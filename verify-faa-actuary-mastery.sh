#!/bin/bash
# Verification script for FAA ACTUARY MASTERY™ v2.2x implementation

echo "═══════════════════════════════════════════════════════════════"
echo "     FAA ACTUARY MASTERY™ v2.2x - Verification Script          "
echo "═══════════════════════════════════════════════════════════════"
echo ""

cd github-profile || exit 1

PASS=0
FAIL=0

# Check README.md content
echo "🔍 Checking README.md..."
if grep -q "FAA ACTUARY MASTERY™ v2.2x" README.md; then
    echo "  ✅ Title present"
    ((PASS++))
else
    echo "  ❌ Title missing"
    ((FAIL++))
fi

if grep -q "PR #35 LIVE" README.md; then
    echo "  ✅ PR reference present"
    ((PASS++))
else
    echo "  ❌ PR reference missing"
    ((FAIL++))
fi

if grep -q "94 REPOS IMMORTALIZED" README.md; then
    echo "  ✅ Repo count present"
    ((PASS++))
else
    echo "  ❌ Repo count missing"
    ((FAIL++))
fi

if grep -q "ONE BADGE RULES ALL" README.md; then
    echo "  ✅ Badge declaration present"
    ((PASS++))
else
    echo "  ❌ Badge declaration missing"
    ((FAIL++))
fi

if grep -q "PRODUCTION READY" README.md; then
    echo "  ✅ Status present"
    ((PASS++))
else
    echo "  ❌ Status missing"
    ((FAIL++))
fi

if grep -q "omnigrid/pull/35" README.md; then
    echo "  ✅ OmniGrid PR link present"
    ((PASS++))
else
    echo "  ❌ OmniGrid PR link missing"
    ((FAIL++))
fi

echo ""

# Check FUNDING.yml
echo "🔍 Checking FUNDING.yml..."
if [ -f ".github/FUNDING.yml" ]; then
    echo "  ✅ FUNDING.yml exists"
    ((PASS++))
    
    if grep -q "github: heyns1000" .github/FUNDING.yml; then
        echo "  ✅ GitHub Sponsors configured"
        ((PASS++))
    else
        echo "  ❌ GitHub Sponsors not configured"
        ((FAIL++))
    fi
    
    if grep -q "faa.zone/sponsor" .github/FUNDING.yml; then
        echo "  ✅ Custom sponsor links configured"
        ((PASS++))
    else
        echo "  ❌ Custom sponsor links missing"
        ((FAIL++))
    fi
else
    echo "  ❌ FUNDING.yml not found"
    ((FAIL++))
fi

echo ""

# Check workflows
echo "🔍 Checking workflows..."
WORKFLOW_COUNT=$(find .github/workflows -name "*.yml" 2>/dev/null | wc -l)
echo "  📊 Found $WORKFLOW_COUNT workflows"

if [ $WORKFLOW_COUNT -ge 10 ]; then
    echo "  ✅ 10+ workflows deployed"
    ((PASS++))
else
    echo "  ❌ Less than 10 workflows"
    ((FAIL++))
fi

# Check specific workflows
REQUIRED_WORKFLOWS=(
    "auto-approve.yml"
    "auto-merge.yml"
    "pr-labeler.yml"
    "badge-status.yml"
    "ecosystem-heartbeat.yml"
    "sovereignty-monitor.yml"
    "profile-ci.yml"
    "workflow-validation.yml"
    "deploy.yml"
    "repo-sync.yml"
)

for workflow in "${REQUIRED_WORKFLOWS[@]}"; do
    if [ -f ".github/workflows/$workflow" ]; then
        echo "  ✅ $workflow present"
        ((PASS++))
    else
        echo "  ❌ $workflow missing"
        ((FAIL++))
    fi
done

echo ""

# Validate YAML syntax
echo "🔍 Validating YAML syntax..."
YAML_VALID=true
for file in .github/workflows/*.yml; do
    if ! python3 -c "import yaml; yaml.safe_load(open('$file'))" 2>/dev/null; then
        echo "  ❌ $file has invalid YAML"
        YAML_VALID=false
        ((FAIL++))
    fi
done

if $YAML_VALID; then
    echo "  ✅ All workflows have valid YAML syntax"
    ((PASS++))
fi

echo ""

# Check auto-merge configuration
echo "🔍 Checking auto-merge configuration..."
if grep -q "automerge" .github/workflows/auto-approve.yml; then
    echo "  ✅ Auto-approve configured for 'automerge' label"
    ((PASS++))
else
    echo "  ❌ Auto-approve not properly configured"
    ((FAIL++))
fi

if grep -q "pascalgn/automerge-action" .github/workflows/auto-merge.yml; then
    echo "  ✅ Auto-merge action configured"
    ((PASS++))
else
    echo "  ❌ Auto-merge action not found"
    ((FAIL++))
fi

echo ""

# Summary
echo "═══════════════════════════════════════════════════════════════"
echo "                    Verification Summary                        "
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "  ✅ Passed: $PASS"
echo "  ❌ Failed: $FAIL"
echo ""

if [ $FAIL -eq 0 ]; then
    echo "🎉 All checks passed! FAA ACTUARY MASTERY™ v2.2x is ready!"
    echo ""
    echo "Status: PRODUCTION READY ✅"
    echo ""
    echo "Next steps:"
    echo "1. Merge this PR"
    echo "2. Copy github-profile/ contents to heyns1000/heyns1000 repo"
    echo "3. Create PR #35 in omnigrid with 'automerge' label"
    echo "4. Watch the auto-merge magic happen! 🚀"
    echo ""
    exit 0
else
    echo "⚠️ Some checks failed. Please review the output above."
    echo ""
    exit 1
fi
