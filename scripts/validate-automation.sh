#!/bin/bash

###############################################################################
# Cross-Repository Automation System - Validation Script
# Version: 1.0.0
# Purpose: Validate that all automation components are correctly installed
###############################################################################

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PASS_COUNT=0
FAIL_COUNT=0

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Cross-Repository Automation System Validation             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

check_file() {
  local file=$1
  local desc=$2
  
  if [[ -f "$file" ]]; then
    echo -e "${GREEN}✅ PASS${NC} - $desc"
    PASS_COUNT=$((PASS_COUNT + 1))
    return 0
  else
    echo -e "${RED}❌ FAIL${NC} - $desc (file not found: $file)"
    FAIL_COUNT=$((FAIL_COUNT + 1))
    return 1
  fi
}

check_json_valid() {
  local file=$1
  local desc=$2
  
  if [[ -f "$file" ]]; then
    if jq '.' "$file" > /dev/null 2>&1; then
      echo -e "${GREEN}✅ PASS${NC} - $desc"
      PASS_COUNT=$((PASS_COUNT + 1))
      return 0
    else
      echo -e "${RED}❌ FAIL${NC} - $desc (invalid JSON)"
      FAIL_COUNT=$((FAIL_COUNT + 1))
      return 1
    fi
  else
    echo -e "${RED}❌ FAIL${NC} - $desc (file not found: $file)"
    FAIL_COUNT=$((FAIL_COUNT + 1))
    return 1
  fi
}

check_executable() {
  local file=$1
  local desc=$2
  
  if [[ -x "$file" ]]; then
    echo -e "${GREEN}✅ PASS${NC} - $desc"
    PASS_COUNT=$((PASS_COUNT + 1))
    return 0
  else
    echo -e "${RED}❌ FAIL${NC} - $desc (not executable: $file)"
    FAIL_COUNT=$((FAIL_COUNT + 1))
    return 1
  fi
}

echo "📋 Checking Configuration Files..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_json_valid ".github/ecosystem-config.json" "Ecosystem configuration exists and is valid JSON"
echo ""

echo "🔄 Checking Workflow Files..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file ".github/workflows/cross-repo-sync.yml" "Cross-repository sync workflow"
check_file ".github/workflows/bidirectional-sync.yml" "Bidirectional sync workflow"
check_file ".github/workflows/branch-lifecycle.yml" "Branch lifecycle automation workflow"
check_file ".github/workflows/ecosystem-dashboard.yml" "Ecosystem dashboard workflow"
check_file ".github/workflows/ci.yml" "Enhanced CI workflow"
check_file ".github/workflows/deploy.yml" "Enhanced deploy workflow"
check_file ".github/workflows/gorilla-mountain-fox-protocol.yml" "Enhanced Gorilla protocol workflow"
echo ""

echo "🔧 Checking Scripts..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "scripts/reconcile-ecosystem.sh" "Emergency reconciliation script exists"
check_executable "scripts/reconcile-ecosystem.sh" "Reconciliation script is executable"
echo ""

echo "📚 Checking Documentation..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "docs/ADR-CROSS-REPO-AUTOMATION.md" "Architecture Decision Record"
check_file "docs/MIGRATION-RUNBOOK.md" "Migration Runbook"
check_file "docs/AUTOMATION-README.md" "Automation README"
echo ""

echo "🔍 Checking Configuration Content..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [[ -f ".github/ecosystem-config.json" ]]; then
  # Check repository count
  REPO_COUNT=$(jq '.repositories | length' .github/ecosystem-config.json)
  if [[ "$REPO_COUNT" -eq 3 ]]; then
    echo -e "${GREEN}✅ PASS${NC} - Configuration has 3 repositories"
    PASS_COUNT=$((PASS_COUNT + 1))
  else
    echo -e "${RED}❌ FAIL${NC} - Expected 3 repositories, found $REPO_COUNT"
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
  
  # Check sync interval
  SYNC_INTERVAL=$(jq '.sync_configuration.interval_minutes' .github/ecosystem-config.json)
  if [[ "$SYNC_INTERVAL" -eq 15 ]]; then
    echo -e "${GREEN}✅ PASS${NC} - Sync interval is 15 minutes"
    PASS_COUNT=$((PASS_COUNT + 1))
  else
    echo -e "${YELLOW}⚠️  WARN${NC} - Sync interval is $SYNC_INTERVAL minutes (expected 15)"
  fi
  
  # Check conflict resolution strategy
  CONFLICT_STRATEGY=$(jq -r '.conflict_resolution.strategy' .github/ecosystem-config.json)
  if [[ "$CONFLICT_STRATEGY" == "auto-ours-with-pr" ]]; then
    echo -e "${GREEN}✅ PASS${NC} - Conflict resolution strategy is auto-ours-with-pr"
    PASS_COUNT=$((PASS_COUNT + 1))
  else
    echo -e "${RED}❌ FAIL${NC} - Unexpected conflict strategy: $CONFLICT_STRATEGY"
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
  
  # Check integrations
  SEEDWAVE=$(jq -r '.integrations.seedwave.enabled' .github/ecosystem-config.json)
  SCROLLBINDER=$(jq -r '.integrations.scrollbinder.enabled' .github/ecosystem-config.json)
  GORILLA=$(jq -r '.integrations.gorilla_mountain_fox.enabled' .github/ecosystem-config.json)
  
  if [[ "$SEEDWAVE" == "true" ]] && [[ "$SCROLLBINDER" == "true" ]] && [[ "$GORILLA" == "true" ]]; then
    echo -e "${GREEN}✅ PASS${NC} - All integrations enabled (Seedwave, ScrollBinder, Gorilla)"
    PASS_COUNT=$((PASS_COUNT + 1))
  else
    echo -e "${RED}❌ FAIL${NC} - Some integrations not enabled"
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
fi
echo ""

echo "📊 Validation Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "Total Checks: $((PASS_COUNT + FAIL_COUNT))"
echo -e "${GREEN}Passed: $PASS_COUNT${NC}"
echo -e "${RED}Failed: $FAIL_COUNT${NC}"
echo ""

if [[ $FAIL_COUNT -eq 0 ]]; then
  echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║                  ✅ ALL CHECKS PASSED ✅                        ║${NC}"
  echo -e "${GREEN}║                                                                ║${NC}"
  echo -e "${GREEN}║  Cross-Repository Automation System is ready for deployment!  ║${NC}"
  echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo "Next steps:"
  echo "  1. Review the PR and documentation"
  echo "  2. Configure ECOSYSTEM_SYNC_TOKEN secret in all repositories"
  echo "  3. Merge to main branch to activate automation"
  echo "  4. Monitor dashboard: https://github.com/Fruitful-Global-Planet/FruitfulPlanetChange/issues?q=label:ecosystem-dashboard"
  echo ""
  exit 0
else
  echo -e "${RED}╔════════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${RED}║                   ❌ VALIDATION FAILED ❌                       ║${NC}"
  echo -e "${RED}║                                                                ║${NC}"
  echo -e "${RED}║  Please fix the issues above before proceeding.               ║${NC}"
  echo -e "${RED}╚════════════════════════════════════════════════════════════════╝${NC}"
  echo ""
  exit 1
fi
