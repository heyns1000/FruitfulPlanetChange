# Token Setup Guide

## Quick Start (Use Default GITHUB_TOKEN)

The workflows now use the default `GITHUB_TOKEN` with write permissions. No additional setup required!

## Advanced Setup (Cross-Repository Sync)

For syncing with codenest and omnigrid, create a Personal Access Token:

### 1. Create GitHub Personal Access Token

1. Go to **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **Generate new token (classic)**
3. Name: `ECOSYSTEM_SYNC_TOKEN`
4. Expiration: Choose appropriate expiry (90 days recommended)
5. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
   - ✅ `write:packages` (if using GitHub Packages)

6. Click **Generate token**
7. **Copy the token** (you won't see it again!)

### 2. Add Token to Repository Secrets

**For FruitfulPlanetChange:**
1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `ECOSYSTEM_SYNC_TOKEN`
4. Value: Paste your token
5. Click **Add secret**

**For codenest:**
1. Repeat above steps for `heyns1000/codenest`

**For omnigrid:**
1. Repeat above steps for `heyns1000/omnigrid`

### 3. Verify Setup

Trigger the workflow manually:

```bash
gh workflow run keep-branches-ahead.yml
```

Check the run:

```bash
gh run list --workflow=keep-branches-ahead.yml
```

## Troubleshooting

### 403 Permission Denied

**Symptom:** `remote: Permission to heyns1000/FruitfulPlanetChange.git denied`

**Solutions:**
1. Verify `GITHUB_TOKEN` has write permissions (should be automatic now)
2. For cross-repo sync, ensure `ECOSYSTEM_SYNC_TOKEN` is configured
3. Check token hasn't expired
4. Verify token has `repo` and `workflow` scopes

### Workflow Not Triggering

**Symptom:** Push to main doesn't trigger sync

**Solutions:**
1. Check workflow file syntax: `cat .github/workflows/keep-branches-ahead.yml`
2. Verify workflow is enabled: Repository Settings → Actions → Workflows
3. Check if workflow was disabled due to inactivity

### Branches Not Syncing

**Symptom:** Workflow runs but branches stay behind

**Solutions:**
1. Check branch patterns in `.github/sync-config.yml`
2. Verify branches aren't in exclude list
3. Check workflow logs for specific branch errors
4. Try manual trigger with specific branch: `gh workflow run keep-branches-ahead.yml -f branch_filter="copilot/*"`

## Testing

Test the workflow:

```bash
# 1. Create a test branch
git checkout -b copilot/test-sync
git push origin copilot/test-sync

# 2. Make a change to main
git checkout main
echo "test" > README.md
git add README.md
git commit -m "test: trigger sync"
git push origin main

# 3. Wait 2-5 minutes

# 4. Check if test branch was updated
git fetch origin
git log origin/copilot/test-sync --oneline -5
# Should show the "test: trigger sync" commit merged

# 5. Clean up
git push origin --delete copilot/test-sync
```

## Token Security Best Practices

1. **Never commit tokens** to the repository
2. **Use repository secrets** for storage
3. **Rotate tokens regularly** (every 90 days)
4. **Use minimal permissions** required
5. **Monitor token usage** in GitHub settings
6. **Revoke compromised tokens** immediately

## Support

Issues with token setup? Check:
- [GitHub Docs: Creating a Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub Docs: Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- Repository Issues: Create an issue with label `workflow-help`
