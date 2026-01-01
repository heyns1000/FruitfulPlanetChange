# Cross-Repository Automation System - Migration Runbook

**Version:** 1.0.0  
**Last Updated:** 2026-01-01  
**Target Audience:** DevOps Engineers, Repository Administrators

---

## 📋 Table of Contents

1. [Pre-Migration Checklist](#pre-migration-checklist)
2. [Environment Setup](#environment-setup)
3. [Migration Steps](#migration-steps)
4. [Validation & Testing](#validation--testing)
5. [Rollback Procedures](#rollback-procedures)
6. [Post-Migration Tasks](#post-migration-tasks)
7. [Troubleshooting](#troubleshooting)
8. [Support & Contacts](#support--contacts)

---

## ✅ Pre-Migration Checklist

### Required Access & Permissions

- [ ] Admin access to `Fruitful-Global-Planet/FruitfulPlanetChange`
- [ ] Admin access to `heyns1000/codenest`
- [ ] Admin access to `heyns1000/omnigrid`
- [ ] GitHub organization owner or appropriate permissions
- [ ] Ability to create Personal Access Tokens (PAT)
- [ ] Access to organization secrets management

### Required Knowledge

- [ ] Understanding of GitHub Actions workflows
- [ ] Familiarity with Git branching strategies
- [ ] Basic knowledge of REST API usage
- [ ] Understanding of HSOMNI9000 ecosystem architecture

### Backup & Safety

- [ ] Full backup of all three repositories (clone with --mirror)
- [ ] Document current branch state in all repos
- [ ] Export existing workflow configurations
- [ ] Create rollback branch (`pre-automation-backup`)
- [ ] Notify team of upcoming changes

### Time Requirements

- **Estimated Duration:** 2-4 hours
- **Best Time:** During low-activity hours (weekends/evenings)
- **Team Availability:** At least 2 engineers for validation
- **Monitoring Window:** 48 hours post-migration

---

## 🔧 Environment Setup

### Step 1: Create Personal Access Token (PAT)

1. Navigate to GitHub Settings → Developer Settings → Personal Access Tokens → Fine-grained tokens
2. Click "Generate new token"
3. Configure token:
   - **Name:** `HSOMNI9000 Ecosystem Sync Token`
   - **Expiration:** 1 year (or organization policy)
   - **Repository access:** Select organizations: `Fruitful-Global-Planet`, `heyns1000`
   - **Permissions:**
     ```
     Repository permissions:
       - Actions: Read and write
       - Contents: Read and write
       - Metadata: Read-only
       - Pull requests: Read and write
       - Workflows: Read and write
     
     Organization permissions:
       - Members: Read-only (optional)
     ```
4. Generate token and **save securely** (you won't see it again)

### Step 2: Add Secrets to Repositories

#### In FruitfulPlanetChange Repository:

```bash
# Navigate to: Settings → Secrets and variables → Actions → New repository secret
```

Add the following secrets:

| Secret Name | Value | Required |
|------------|-------|----------|
| `ECOSYSTEM_SYNC_TOKEN` | PAT from Step 1 | ✅ Yes |
| `SLACK_WEBHOOK` | Webhook URL | ⚪ Optional |
| `DISCORD_WEBHOOK` | Webhook URL | ⚪ Optional |

#### In CodeNest Repository:

```bash
# Same location: Settings → Secrets and variables → Actions
```

Add:
- `ECOSYSTEM_SYNC_TOKEN` (same PAT)

#### In OmniGrid Repository:

```bash
# Same location: Settings → Secrets and variables → Actions
```

Add:
- `ECOSYSTEM_SYNC_TOKEN` (same PAT)

### Step 3: Verify Existing Workflows

```bash
# Clone repositories
git clone https://github.com/Fruitful-Global-Planet/FruitfulPlanetChange.git
git clone https://github.com/heyns1000/codenest.git
git clone https://github.com/heyns1000/omnigrid.git

# Check existing workflows
cd FruitfulPlanetChange
ls -la .github/workflows/

# Expected files:
# - ci.yml (will be enhanced)
# - deploy.yml (will be enhanced)
# - gorilla-mountain-fox-protocol.yml (will be enhanced)
# - cross-repo-sync.yml (NEW)
# - bidirectional-sync.yml (NEW)
# - branch-lifecycle.yml (NEW)
# - ecosystem-dashboard.yml (NEW)
```

### Step 4: Configuration File Setup

The `ecosystem-config.json` should already exist at:
```
.github/ecosystem-config.json
```

Verify configuration:

```bash
# Check if file exists and is valid JSON
jq '.' .github/ecosystem-config.json

# Verify repository names are correct
jq '.repositories[].name' .github/ecosystem-config.json

# Should output:
# "Fruitful-Global-Planet/FruitfulPlanetChange"
# "heyns1000/codenest"
# "heyns1000/omnigrid"
```

If file doesn't exist or needs updating, copy from this repository.

---

## 🚀 Migration Steps

### Phase 1: Deploy Configuration Files (15 minutes)

#### Step 1.1: Merge Automation Files

```bash
cd FruitfulPlanetChange

# Ensure you're on the automation branch
git checkout copilot/create-automation-system

# Review changes
git diff main..copilot/create-automation-system

# Files to be added/modified:
# - .github/ecosystem-config.json (NEW)
# - .github/workflows/cross-repo-sync.yml (NEW)
# - .github/workflows/bidirectional-sync.yml (NEW)
# - .github/workflows/branch-lifecycle.yml (NEW)
# - .github/workflows/ecosystem-dashboard.yml (NEW)
# - .github/workflows/ci.yml (MODIFIED)
# - .github/workflows/deploy.yml (MODIFIED)
# - .github/workflows/gorilla-mountain-fox-protocol.yml (MODIFIED)
# - scripts/reconcile-ecosystem.sh (NEW)
# - docs/ADR-CROSS-REPO-AUTOMATION.md (NEW)
# - docs/MIGRATION-RUNBOOK.md (NEW)
```

#### Step 1.2: Create Pull Request

```bash
# If not already done, push the branch
git push origin copilot/create-automation-system

# Create PR via GitHub CLI or web interface
gh pr create \
  --title "🤖 Cross-Repository Automation System" \
  --body "Implements automated synchronization across FruitfulPlanetChange, CodeNest, and OmniGrid. See docs/ADR-CROSS-REPO-AUTOMATION.md for details." \
  --base main \
  --head copilot/create-automation-system \
  --label "automation,infrastructure,enhancement"
```

#### Step 1.3: Review and Merge

1. Have at least 2 engineers review the PR
2. Run validation checks (see Phase 2)
3. Merge to `main` branch
4. Wait for CI to complete

### Phase 2: Initial Validation (30 minutes)

#### Step 2.1: Verify Workflow Files

```bash
# Check workflow syntax
cd FruitfulPlanetChange
find .github/workflows -name "*.yml" -exec echo "Validating {}" \; -exec yamllint {} \;

# Or use GitHub API
gh api repos/Fruitful-Global-Planet/FruitfulPlanetChange/actions/workflows | jq '.workflows[] | {name, path, state}'
```

#### Step 2.2: Manual Test Run

```bash
# Trigger cross-repo-sync manually
gh workflow run cross-repo-sync.yml \
  --ref main \
  --field target_branch="main" \
  --field force_sync="true"

# Monitor execution
gh run list --workflow=cross-repo-sync.yml --limit 1

# View logs
gh run view --log
```

Expected output:
```
✅ Detect branch changes: success
✅ Sync to CodeNest: success
✅ Sync to OmniGrid: success
✅ Sync summary: success
```

#### Step 2.3: Verify Branch Creation

```bash
# Check if branches were created in CodeNest
gh api repos/heyns1000/codenest/branches | jq '.[].name' | grep -E 'copilot|claude'

# Check if branches were created in OmniGrid
gh api repos/heyns1000/omnigrid/branches | jq '.[].name' | grep -E 'copilot|claude'
```

### Phase 3: Enable Scheduled Workflows (15 minutes)

#### Step 3.1: Verify Cron Schedules

All workflows with schedules should now be active:

1. **Cross-Repo Sync:** Every 15 minutes
2. **Bidirectional Sync:** Every 30 minutes
3. **Ecosystem Dashboard:** Daily + every 6 hours
4. **Gorilla Protocol:** Every 5 minutes

```bash
# Check scheduled workflows
gh api repos/Fruitful-Global-Planet/FruitfulPlanetChange/actions/workflows | \
  jq '.workflows[] | select(.name | contains("Sync") or contains("Dashboard")) | {name, path}'
```

#### Step 3.2: Monitor First Scheduled Runs

Wait for first scheduled run (max 15 minutes for cross-repo-sync):

```bash
# Watch for new runs
watch -n 10 'gh run list --workflow=cross-repo-sync.yml --limit 5'

# Should see runs with event type "schedule"
```

### Phase 4: Test Branch Lifecycle (20 minutes)

#### Step 4.1: Test Branch Creation

```bash
# Create a test branch
cd FruitfulPlanetChange
git checkout -b test/automation-validation
echo "# Test" > test-automation.md
git add test-automation.md
git commit -m "test: validate automation system"
git push origin test/automation-validation

# Wait 2-3 minutes, then check if branch was created in other repos
gh api repos/heyns1000/codenest/branches/test/automation-validation
gh api repos/heyns1000/omnigrid/branches/test/automation-validation

# Both should return 200 OK
```

#### Step 4.2: Test Branch Merge & Cleanup

```bash
# Create and merge a PR
gh pr create \
  --title "Test: Automation Validation" \
  --body "Testing branch lifecycle automation" \
  --base main \
  --head test/automation-validation

gh pr merge --merge

# Wait 2-3 minutes, then check if branch was deleted in other repos
gh api repos/heyns1000/codenest/branches/test/automation-validation
# Should return 404 if cleanup worked
```

### Phase 5: Test Bidirectional Sync (20 minutes)

#### Step 5.1: Make Change in CodeNest

```bash
cd codenest
git checkout -b test/reverse-sync
echo "# Reverse Sync Test" > reverse-sync-test.md
git add reverse-sync-test.md
git commit -m "test: validate reverse sync"
git push origin test/reverse-sync

# Trigger bidirectional sync manually
cd ../FruitfulPlanetChange
gh workflow run bidirectional-sync.yml \
  --ref main \
  --field source_repo="codenest" \
  --field branch="test/reverse-sync"

# Wait for workflow to complete
gh run list --workflow=bidirectional-sync.yml --limit 1

# Check if change appeared in main repo
git fetch origin
git branch -a | grep reverse-sync
```

### Phase 6: Verify Dashboard (10 minutes)

#### Step 6.1: Trigger Dashboard Generation

```bash
gh workflow run ecosystem-dashboard.yml --ref main --field force_full_scan="true"

# Wait for completion
gh run list --workflow=ecosystem-dashboard.yml --limit 1
```

#### Step 6.2: Check Dashboard Issue

```bash
# Find dashboard issue
gh issue list --label "ecosystem-dashboard"

# Should show issue like:
# #123  📊 Ecosystem Health Dashboard  (open)

# View dashboard
gh issue view 123
```

Expected dashboard content:
- ✅ Sync percentage > 95%
- ✅ Workflow success rate > 95%
- ✅ List of synced branches
- ⚠️ Any out-of-sync branches

---

## ✅ Validation & Testing

### Automated Validation Script

Create `scripts/validate-automation.sh`:

```bash
#!/bin/bash

echo "🔍 Validating Cross-Repository Automation System"

# Test 1: Configuration file exists and is valid
echo "Test 1: Configuration validation..."
jq '.' .github/ecosystem-config.json > /dev/null && echo "✅ Config valid" || echo "❌ Config invalid"

# Test 2: All workflow files exist
echo "Test 2: Workflow files..."
WORKFLOWS=(
  "cross-repo-sync.yml"
  "bidirectional-sync.yml"
  "branch-lifecycle.yml"
  "ecosystem-dashboard.yml"
)
for workflow in "${WORKFLOWS[@]}"; do
  [[ -f ".github/workflows/$workflow" ]] && echo "✅ $workflow" || echo "❌ $workflow missing"
done

# Test 3: Secrets configured
echo "Test 3: GitHub secrets..."
gh api repos/Fruitful-Global-Planet/FruitfulPlanetChange/actions/secrets | \
  jq -r '.secrets[] | select(.name == "ECOSYSTEM_SYNC_TOKEN") | "✅ ECOSYSTEM_SYNC_TOKEN configured"'

# Test 4: Recent workflow runs
echo "Test 4: Recent workflow runs..."
RECENT_SUCCESS=$(gh run list --workflow=cross-repo-sync.yml --limit 1 --json conclusion --jq '.[0].conclusion')
[[ "$RECENT_SUCCESS" == "success" ]] && echo "✅ Recent sync successful" || echo "⚠️ Recent sync: $RECENT_SUCCESS"

# Test 5: Branch count across repos
echo "Test 5: Branch synchronization..."
MAIN_BRANCHES=$(gh api repos/Fruitful-Global-Planet/FruitfulPlanetChange/branches | jq '. | length')
CN_BRANCHES=$(gh api repos/heyns1000/codenest/branches | jq '. | length')
OG_BRANCHES=$(gh api repos/heyns1000/omnigrid/branches | jq '. | length')
echo "Main: $MAIN_BRANCHES branches"
echo "CodeNest: $CN_BRANCHES branches"
echo "OmniGrid: $OG_BRANCHES branches"

echo ""
echo "🎯 Validation complete!"
```

Run validation:

```bash
chmod +x scripts/validate-automation.sh
./scripts/validate-automation.sh
```

### Manual Validation Checklist

- [ ] All workflow files present in `.github/workflows/`
- [ ] Configuration file valid JSON
- [ ] ECOSYSTEM_SYNC_TOKEN secret configured
- [ ] Cross-repo sync runs successfully
- [ ] Bidirectional sync runs successfully
- [ ] Branch lifecycle creates mirrors
- [ ] Branch lifecycle cleans up on merge
- [ ] Dashboard generates without errors
- [ ] Dashboard issue created/updated
- [ ] No workflow failures in last 24 hours
- [ ] Sync percentage > 95%

---

## 🔄 Rollback Procedures

### Emergency Rollback (< 5 minutes)

If automation causes critical issues:

#### Step 1: Disable Workflows

```bash
# Disable all new automation workflows
WORKFLOWS=("cross-repo-sync" "bidirectional-sync" "branch-lifecycle" "ecosystem-dashboard")
for workflow in "${WORKFLOWS[@]}"; do
  gh workflow disable "$workflow.yml"
  echo "✅ Disabled $workflow"
done
```

#### Step 2: Revert Code Changes

```bash
# Option A: Revert the merge commit
git revert -m 1 <merge-commit-sha>
git push origin main

# Option B: Reset to pre-automation commit
git reset --hard <commit-before-automation>
git push --force origin main  # ⚠️ Use with caution
```

#### Step 3: Verify Rollback

```bash
# Check workflow status
gh workflow list

# All automation workflows should show "disabled"

# Verify old workflows still work
gh run list --workflow=ci.yml --limit 5
```

### Partial Rollback (Keep Some Workflows)

If only specific workflows are problematic:

```bash
# Disable only problematic workflow
gh workflow disable cross-repo-sync.yml

# Keep others running
# This allows incremental fixes
```

### Data Recovery

If sync created unwanted changes:

```bash
# Use emergency reconciliation script
cd FruitfulPlanetChange
./scripts/reconcile-ecosystem.sh --dry-run

# Review proposed changes, then execute
./scripts/reconcile-ecosystem.sh --backup --force
```

---

## ✨ Post-Migration Tasks

### Week 1: Intensive Monitoring

- [ ] **Daily:** Check dashboard issue for sync status
- [ ] **Daily:** Review failed workflow runs
- [ ] **Daily:** Monitor GitHub Actions usage/quota
- [ ] **3x per day:** Spot-check branch synchronization
- [ ] **Weekly:** Generate sync metrics report

### Week 2-4: Stabilization

- [ ] **Twice weekly:** Review dashboard
- [ ] **Weekly:** Check for stuck workflows
- [ ] **Weekly:** Audit sync success rate
- [ ] **Bi-weekly:** Review and optimize sync schedules
- [ ] **Monthly:** Update documentation with lessons learned

### Ongoing Maintenance

- [ ] **Monthly:** Review and rotate ECOSYSTEM_SYNC_TOKEN
- [ ] **Quarterly:** Update workflow versions (actions/checkout, etc.)
- [ ] **Quarterly:** Performance optimization review
- [ ] **Annually:** Full system audit and enhancement planning

### Documentation Updates

- [ ] Update team wiki with automation overview
- [ ] Create troubleshooting guide for common issues
- [ ] Document emergency contacts and escalation
- [ ] Add automation to onboarding materials
- [ ] Update repository README with automation status

### Team Training

- [ ] Conduct workshop on new automation system
- [ ] Create video walkthrough of dashboard usage
- [ ] Document how to manually trigger syncs
- [ ] Train on emergency reconciliation script
- [ ] Establish support rotation for automation issues

---

## 🐛 Troubleshooting

### Issue 1: Workflow Not Triggering

**Symptoms:** Scheduled workflow doesn't run

**Diagnosis:**
```bash
# Check if workflow is enabled
gh workflow view cross-repo-sync.yml

# Check recent runs
gh run list --workflow=cross-repo-sync.yml --limit 10
```

**Solutions:**
1. Verify workflow is enabled: `gh workflow enable cross-repo-sync.yml`
2. Check cron syntax in workflow file
3. GitHub may delay scheduled runs by up to 10 minutes
4. Manually trigger: `gh workflow run cross-repo-sync.yml`

### Issue 2: Authentication Failures

**Symptoms:** "Bad credentials" or "Resource not accessible by token"

**Diagnosis:**
```bash
# Test token permissions
curl -H "Authorization: token $ECOSYSTEM_SYNC_TOKEN" \
  https://api.github.com/repos/heyns1000/codenest

# Should return repo details, not 401/403
```

**Solutions:**
1. Regenerate ECOSYSTEM_SYNC_TOKEN with correct permissions
2. Update secret in all three repositories
3. Verify token hasn't expired
4. Check organization SSO requirements

### Issue 3: Merge Conflicts

**Symptoms:** Sync workflow fails with merge conflict

**Diagnosis:**
```bash
# Check workflow logs
gh run view --log

# Look for "CONFLICT" or "merge failed"
```

**Solutions:**
1. **Auto-Resolution (try first):**
   ```bash
   cd FruitfulPlanetChange
   git fetch origin
   git checkout <conflicted-branch>
   git merge --strategy-option=ours origin/<other-branch>
   git push origin <conflicted-branch>
   ```

2. **Manual Resolution:**
   - Find conflict resolution PR (labeled `conflict-resolution`)
   - Review conflicts in PR
   - Manually resolve and merge

3. **Emergency Full Reconciliation:**
   ```bash
   ./scripts/reconcile-ecosystem.sh --backup --force
   ```

### Issue 4: High API Rate Limit Usage

**Symptoms:** Workflow fails with "API rate limit exceeded"

**Diagnosis:**
```bash
# Check rate limit status
gh api rate_limit | jq '.resources.core'

# Shows remaining calls and reset time
```

**Solutions:**
1. Increase sync interval in `ecosystem-config.json`:
   ```json
   {
     "sync_configuration": {
       "interval_minutes": 30  // was 15
     }
   }
   ```

2. Enable more aggressive caching:
   ```json
   {
     "rate_limiting": {
       "enable_caching": true,
       "cache_duration_minutes": 60  // was 30
     }
   }
   ```

3. Switch to SSH authentication (deploy keys)

### Issue 5: Dashboard Not Updating

**Symptoms:** Dashboard issue shows old data

**Diagnosis:**
```bash
# Check dashboard workflow runs
gh run list --workflow=ecosystem-dashboard.yml --limit 5

# Check if issue exists
gh issue list --label ecosystem-dashboard
```

**Solutions:**
1. Manually trigger dashboard: `gh workflow run ecosystem-dashboard.yml --field force_full_scan="true"`
2. Check if bot has permissions to update issues
3. Verify GITHUB_TOKEN has `issues: write` permission
4. Check workflow logs for API errors

### Issue 6: Branches Out of Sync

**Symptoms:** Dashboard shows high number of out-of-sync branches

**Diagnosis:**
```bash
# Compare branch lists
gh api repos/Fruitful-Global-Planet/FruitfulPlanetChange/branches | jq '.[].name' > main-branches.txt
gh api repos/heyns1000/codenest/branches | jq '.[].name' > cn-branches.txt
diff main-branches.txt cn-branches.txt
```

**Solutions:**
1. Run emergency reconciliation:
   ```bash
   ./scripts/reconcile-ecosystem.sh --dry-run
   # Review plan
   ./scripts/reconcile-ecosystem.sh --backup --force
   ```

2. Manually trigger sync for specific branch:
   ```bash
   gh workflow run cross-repo-sync.yml \
     --field target_branch="<branch-name>" \
     --field force_sync="true"
   ```

3. Check if branches are protected/restricted

### Issue 7: Workflow Runs Taking Too Long

**Symptoms:** Sync takes > 10 minutes to complete

**Diagnosis:**
```bash
# Check recent run duration
gh run list --workflow=cross-repo-sync.yml --limit 1 --json createdAt,updatedAt

# Check for bottlenecks in logs
gh run view --log | grep "Elapsed time"
```

**Solutions:**
1. Increase parallel job limit in `ecosystem-config.json`:
   ```json
   {
     "sync_configuration": {
       "max_parallel_jobs": 10  // was 5
     }
   }
   ```

2. Reduce number of branches synced at once:
   ```json
   {
     "sync_configuration": {
       "batch_size": 5  // was 10
     }
   }
   ```

3. Optimize API calls (reduce redundant checks)

---

## 📞 Support & Contacts

### Emergency Contacts

| Role | Contact | Availability |
|------|---------|--------------|
| **Primary On-Call** | DevOps Team | 24/7 |
| **Secondary On-Call** | Platform Engineering | Business hours |
| **Escalation** | Engineering Manager | Business hours |

### Communication Channels

- **Slack:** `#ecosystem-automation` (primary)
- **Discord:** `#infrastructure` (backup)
- **Email:** devops@fruitfulplanet.com
- **GitHub Issues:** Use `automation` label

### Useful Links

- **Dashboard:** [GitHub Issue #XXX](#)
- **Workflow Runs:** https://github.com/Fruitful-Global-Planet/FruitfulPlanetChange/actions
- **Architecture Doc:** [ADR-CROSS-REPO-AUTOMATION.md](./ADR-CROSS-REPO-AUTOMATION.md)
- **Ecosystem Config:** [.github/ecosystem-config.json](../.github/ecosystem-config.json)
- **Status Page:** https://fruitfulplanet.statuspage.io (if exists)

### Escalation Procedure

1. **Level 1 (0-30 minutes):**
   - Check troubleshooting guide
   - Review recent workflow logs
   - Post in `#ecosystem-automation` Slack

2. **Level 2 (30-60 minutes):**
   - Engage Primary On-Call
   - Create incident ticket
   - Assess impact and scope

3. **Level 3 (60+ minutes or high impact):**
   - Escalate to Engineering Manager
   - Consider emergency rollback
   - Initiate incident response procedure

### Reporting Issues

When reporting issues, include:

```
**Issue Title:** Brief description of problem

**Severity:** Critical / High / Medium / Low

**Impact:**
- Number of affected branches
- Affected repositories
- User impact (if any)

**Symptoms:**
- What you observed
- When it started
- How often it occurs

**Diagnosis:**
- Workflow run IDs
- Error messages
- Relevant logs

**Steps Attempted:**
- What you've tried already
- Results of troubleshooting steps

**Environment:**
- Which repositories affected
- Branch names
- Workflow names
```

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [HSOMNI9000 Architecture](../ARCHITECTURE.md)
- [Global Sync Instructions](../global-sync-instructions.md)
- [Seedwave Protocol Documentation](../ECOSYSTEM_PULSE_IMPLEMENTATION.md)

---

**Document Version:** 1.0.0  
**Last Reviewed:** 2026-01-01  
**Next Review:** 2026-04-01  
**Maintained By:** HSOMNI9000 DevOps Team
