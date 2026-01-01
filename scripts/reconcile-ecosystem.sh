#!/bin/bash

###############################################################################
# HSOMNI9000 Ecosystem Reconciliation Script
# Version: 1.0.0
# Purpose: Emergency full-sync for cross-repository automation system
# Usage: ./scripts/reconcile-ecosystem.sh [--dry-run] [--force] [--backup]
###############################################################################

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
CONFIG_FILE="${REPO_ROOT}/.github/ecosystem-config.json"
TEMP_DIR="${REPO_ROOT}/.reconcile-temp"
BACKUP_DIR="${REPO_ROOT}/.reconcile-backups/$(date +%Y%m%d_%H%M%S)"

# Default options
DRY_RUN=false
FORCE=false
CREATE_BACKUP=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --force)
      FORCE=true
      shift
      ;;
    --backup)
      CREATE_BACKUP=true
      shift
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      echo "Usage: $0 [--dry-run] [--force] [--backup]"
      exit 1
      ;;
  esac
done

###############################################################################
# Helper Functions
###############################################################################

log_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

check_dependencies() {
  log_info "Checking dependencies..."
  
  local deps=("git" "jq" "curl")
  for dep in "${deps[@]}"; do
    if ! command -v "$dep" &> /dev/null; then
      log_error "Required dependency not found: $dep"
      exit 1
    fi
  done
  
  log_success "All dependencies found"
}

load_config() {
  log_info "Loading ecosystem configuration..."
  
  if [[ ! -f "$CONFIG_FILE" ]]; then
    log_error "Configuration file not found: $CONFIG_FILE"
    exit 1
  fi
  
  # Parse repositories from config
  REPOS=$(jq -r '.repositories[].name' "$CONFIG_FILE")
  log_success "Loaded configuration for $(echo "$REPOS" | wc -l) repositories"
}

create_backup() {
  if [[ "$CREATE_BACKUP" == true ]]; then
    log_info "Creating backup..."
    mkdir -p "$BACKUP_DIR"
    
    # Backup current branch state
    git branch -a > "${BACKUP_DIR}/branches.txt"
    git log --all --oneline -n 100 > "${BACKUP_DIR}/commits.txt"
    git status > "${BACKUP_DIR}/status.txt"
    
    # Create reflog backup
    git reflog > "${BACKUP_DIR}/reflog.txt" 2>/dev/null || true
    
    log_success "Backup created at: $BACKUP_DIR"
  fi
}

fetch_all_branches() {
  log_info "Fetching all branches from origin..."
  
  if [[ "$DRY_RUN" == false ]]; then
    git fetch --all --prune
    log_success "Fetched all branches"
  else
    log_warning "DRY RUN: Would fetch all branches"
  fi
}

get_local_branches() {
  git branch --format='%(refname:short)' | grep -v '^HEAD'
}

get_remote_branches() {
  git branch -r --format='%(refname:short)' | grep -v 'HEAD' | sed 's/origin\///'
}

compare_commit_histories() {
  local branch=$1
  local local_sha=$(git rev-parse "$branch" 2>/dev/null || echo "")
  local remote_sha=$(git rev-parse "origin/$branch" 2>/dev/null || echo "")
  
  if [[ -z "$local_sha" ]]; then
    echo "missing_local"
  elif [[ -z "$remote_sha" ]]; then
    echo "missing_remote"
  elif [[ "$local_sha" == "$remote_sha" ]]; then
    echo "synced"
  else
    # Check if branches have diverged
    local merge_base=$(git merge-base "$branch" "origin/$branch" 2>/dev/null || echo "")
    if [[ "$merge_base" == "$local_sha" ]]; then
      echo "behind"
    elif [[ "$merge_base" == "$remote_sha" ]]; then
      echo "ahead"
    else
      echo "diverged"
    fi
  fi
}

generate_reconciliation_plan() {
  log_info "Generating reconciliation plan..."
  
  local plan_file="${TEMP_DIR}/reconciliation-plan.json"
  mkdir -p "$TEMP_DIR"
  
  echo "{" > "$plan_file"
  echo '  "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",' >> "$plan_file"
  echo '  "branches": [' >> "$plan_file"
  
  local first=true
  local remote_branches=$(get_remote_branches)
  
  for branch in $remote_branches; do
    local status=$(compare_commit_histories "$branch")
    local action=""
    
    case $status in
      synced)
        action="none"
        ;;
      missing_local)
        action="create_local"
        ;;
      behind)
        action="fast_forward"
        ;;
      ahead)
        action="push"
        ;;
      diverged)
        action="merge_or_rebase"
        ;;
    esac
    
    if [[ "$first" == true ]]; then
      first=false
    else
      echo "," >> "$plan_file"
    fi
    
    echo "    {" >> "$plan_file"
    echo "      \"name\": \"$branch\"," >> "$plan_file"
    echo "      \"status\": \"$status\"," >> "$plan_file"
    echo "      \"action\": \"$action\"" >> "$plan_file"
    echo -n "    }" >> "$plan_file"
  done
  
  echo "" >> "$plan_file"
  echo "  ]" >> "$plan_file"
  echo "}" >> "$plan_file"
  
  log_success "Reconciliation plan generated at: $plan_file"
  
  # Display summary
  log_info "Plan Summary:"
  jq -r '.branches[] | "\(.status): \(.name)"' "$plan_file" | sort | uniq -c
  
  echo "$plan_file"
}

execute_reconciliation() {
  local plan_file=$1
  
  if [[ "$DRY_RUN" == true ]]; then
    log_warning "DRY RUN MODE: No changes will be made"
    jq -r '.branches[] | select(.action != "none") | "Would \(.action) for branch: \(.name)"' "$plan_file"
    return 0
  fi
  
  if [[ "$FORCE" == false ]]; then
    log_warning "This will modify your repository. Use --force to proceed."
    read -p "Continue? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      log_info "Aborted by user"
      exit 0
    fi
  fi
  
  log_info "Executing reconciliation..."
  
  local total=$(jq '.branches | length' "$plan_file")
  local current=0
  local success=0
  local failed=0
  
  while IFS= read -r branch_json; do
    current=$((current + 1))
    local branch=$(echo "$branch_json" | jq -r '.name')
    local action=$(echo "$branch_json" | jq -r '.action')
    
    if [[ "$action" == "none" ]]; then
      continue
    fi
    
    log_info "[$current/$total] Processing $branch (action: $action)"
    
    case $action in
      create_local)
        if git checkout -b "$branch" "origin/$branch" 2>/dev/null; then
          log_success "Created local branch: $branch"
          success=$((success + 1))
        else
          log_error "Failed to create branch: $branch"
          failed=$((failed + 1))
        fi
        ;;
      fast_forward)
        if git checkout "$branch" && git merge --ff-only "origin/$branch" 2>/dev/null; then
          log_success "Fast-forwarded branch: $branch"
          success=$((success + 1))
        else
          log_error "Failed to fast-forward: $branch"
          failed=$((failed + 1))
        fi
        ;;
      merge_or_rebase)
        log_warning "Branch diverged: $branch - requires manual resolution"
        failed=$((failed + 1))
        ;;
    esac
  done < <(jq -c '.branches[] | select(.action != "none")' "$plan_file")
  
  log_info "Reconciliation Summary:"
  log_success "Successfully processed: $success branches"
  if [[ $failed -gt 0 ]]; then
    log_error "Failed: $failed branches"
  fi
}

verify_reconciliation() {
  log_info "Verifying reconciliation..."
  
  local synced=0
  local diverged=0
  
  for branch in $(get_remote_branches); do
    local status=$(compare_commit_histories "$branch")
    if [[ "$status" == "synced" ]]; then
      synced=$((synced + 1))
    else
      diverged=$((diverged + 1))
      log_warning "Branch still out of sync: $branch (status: $status)"
    fi
  done
  
  log_info "Verification Summary:"
  log_success "Synced branches: $synced"
  if [[ $diverged -gt 0 ]]; then
    log_warning "Diverged branches: $diverged"
  fi
  
  if [[ $diverged -eq 0 ]]; then
    log_success "All branches are now synchronized!"
    return 0
  else
    log_warning "Some branches require manual attention"
    return 1
  fi
}

cleanup() {
  if [[ -d "$TEMP_DIR" ]]; then
    log_info "Cleaning up temporary files..."
    rm -rf "$TEMP_DIR"
    log_success "Cleanup complete"
  fi
}

###############################################################################
# Main Execution
###############################################################################

main() {
  echo "╔════════════════════════════════════════════════════════════════╗"
  echo "║     HSOMNI9000 Ecosystem Reconciliation Script v1.0.0         ║"
  echo "║     Emergency Full-Sync for Cross-Repository Automation        ║"
  echo "╚════════════════════════════════════════════════════════════════╝"
  echo ""
  
  if [[ "$DRY_RUN" == true ]]; then
    log_warning "Running in DRY RUN mode - no changes will be made"
  fi
  
  # Execute reconciliation steps
  check_dependencies
  load_config
  create_backup
  fetch_all_branches
  
  local plan_file=$(generate_reconciliation_plan)
  execute_reconciliation "$plan_file"
  verify_reconciliation
  
  cleanup
  
  echo ""
  log_success "Ecosystem reconciliation complete!"
  echo ""
  echo "Next steps:"
  echo "  1. Review any diverged branches that require manual resolution"
  echo "  2. Test critical functionality in affected branches"
  echo "  3. Run automated sync workflows to maintain synchronization"
  echo ""
  
  if [[ "$CREATE_BACKUP" == true ]]; then
    echo "Backup location: $BACKUP_DIR"
    echo "To restore: git checkout <branch> && git reset --hard <commit-sha>"
    echo ""
  fi
}

# Trap errors and cleanup
trap cleanup EXIT

# Run main function
main
