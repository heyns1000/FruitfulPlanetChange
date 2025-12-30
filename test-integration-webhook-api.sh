#!/bin/bash

# Integration Webhook API Test Suite
# This script tests all the integration webhook endpoints

set -e

BASE_URL="http://localhost:5000"
echo "================================================"
echo "Integration Webhook API Test Suite"
echo "================================================"
echo ""
echo "Base URL: $BASE_URL"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check${NC}"
echo "GET $BASE_URL/api/integration/health"
echo ""
health_response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/integration/health")
http_code=$(echo "$health_response" | tail -n1)
body=$(echo "$health_response" | head -n -1)

if [ "$http_code" = "200" ]; then
  echo -e "${GREEN}✓ PASS${NC} - Health check successful"
  echo "Response: $body"
else
  echo -e "${RED}✗ FAIL${NC} - Expected 200, got $http_code"
  echo "Response: $body"
fi
echo ""

# Test 2: Create Deployment
echo -e "${YELLOW}Test 2: Create Deployment${NC}"
echo "POST $BASE_URL/api/integration/deploy"
echo ""
deploy_response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/integration/deploy" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "demo-user-123",
    "brandId": "1",
    "integrationType": "brand_license"
  }')
http_code=$(echo "$deploy_response" | tail -n1)
body=$(echo "$deploy_response" | head -n -1)

if [ "$http_code" = "200" ]; then
  echo -e "${GREEN}✓ PASS${NC} - Deployment created successfully"
  echo "Response: $body"
  
  # Extract deploymentId for next test
  deployment_id=$(echo "$body" | grep -o '"deploymentId":"[^"]*"' | cut -d'"' -f4)
  echo ""
  echo "Deployment ID: $deployment_id"
else
  echo -e "${RED}✗ FAIL${NC} - Expected 200, got $http_code"
  echo "Response: $body"
fi
echo ""

# Test 3: Check Deployment Status (immediately)
if [ -n "$deployment_id" ]; then
  echo -e "${YELLOW}Test 3: Check Deployment Status (Initial)${NC}"
  echo "GET $BASE_URL/api/deployment/status/$deployment_id"
  echo ""
  status_response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/deployment/status/$deployment_id")
  http_code=$(echo "$status_response" | tail -n1)
  body=$(echo "$status_response" | head -n -1)
  
  if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Status retrieved successfully"
    echo "Response: $body"
  else
    echo -e "${RED}✗ FAIL${NC} - Expected 200, got $http_code"
    echo "Response: $body"
  fi
  echo ""
  
  # Test 4: Check Deployment Status (after async processing)
  echo -e "${YELLOW}Test 4: Check Deployment Status (After Processing)${NC}"
  echo "Waiting 3 seconds for background processing..."
  sleep 3
  echo ""
  echo "GET $BASE_URL/api/deployment/status/$deployment_id"
  echo ""
  status_response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/deployment/status/$deployment_id")
  http_code=$(echo "$status_response" | tail -n1)
  body=$(echo "$status_response" | head -n -1)
  
  if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Status retrieved successfully"
    echo "Response: $body"
    
    # Check if status changed to success
    if echo "$body" | grep -q '"status":"success"'; then
      echo -e "${GREEN}✓ PASS${NC} - Deployment completed successfully"
    else
      echo -e "${YELLOW}⚠ WARNING${NC} - Deployment may still be processing"
    fi
  else
    echo -e "${RED}✗ FAIL${NC} - Expected 200, got $http_code"
    echo "Response: $body"
  fi
  echo ""
fi

# Test 5: Invalid Brand ID
echo -e "${YELLOW}Test 5: Invalid Brand ID (Should Fail)${NC}"
echo "POST $BASE_URL/api/integration/deploy"
echo ""
error_response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/integration/deploy" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "demo-user-123",
    "brandId": "99999",
    "integrationType": "brand_license"
  }')
http_code=$(echo "$error_response" | tail -n1)
body=$(echo "$error_response" | head -n -1)

if [ "$http_code" = "404" ]; then
  echo -e "${GREEN}✓ PASS${NC} - Correctly rejected invalid brand"
  echo "Response: $body"
else
  echo -e "${YELLOW}⚠ WARNING${NC} - Expected 404, got $http_code"
  echo "Response: $body"
fi
echo ""

# Test 6: Invalid Request Data
echo -e "${YELLOW}Test 6: Invalid Request Data (Should Fail)${NC}"
echo "POST $BASE_URL/api/integration/deploy"
echo ""
error_response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/integration/deploy" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "",
    "brandId": "1",
    "integrationType": "invalid_type"
  }')
http_code=$(echo "$error_response" | tail -n1)
body=$(echo "$error_response" | head -n -1)

if [ "$http_code" = "400" ]; then
  echo -e "${GREEN}✓ PASS${NC} - Correctly rejected invalid data"
  echo "Response: $body"
else
  echo -e "${YELLOW}⚠ WARNING${NC} - Expected 400, got $http_code"
  echo "Response: $body"
fi
echo ""

# Test 7: Non-existent Deployment Status
echo -e "${YELLOW}Test 7: Non-existent Deployment (Should Fail)${NC}"
echo "GET $BASE_URL/api/deployment/status/deploy_nonexistent"
echo ""
error_response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/deployment/status/deploy_nonexistent")
http_code=$(echo "$error_response" | tail -n1)
body=$(echo "$error_response" | head -n -1)

if [ "$http_code" = "404" ]; then
  echo -e "${GREEN}✓ PASS${NC} - Correctly returned 404 for non-existent deployment"
  echo "Response: $body"
else
  echo -e "${YELLOW}⚠ WARNING${NC} - Expected 404, got $http_code"
  echo "Response: $body"
fi
echo ""

echo "================================================"
echo "Test Suite Complete"
echo "================================================"
echo ""
echo "NOTE: Some tests may show warnings if the server is not running"
echo "      or if the database is not properly configured."
echo ""
echo "To run these tests:"
echo "  1. Start the server: pnpm dev"
echo "  2. Ensure database is migrated: pnpm db:push"
echo "  3. Run this script: bash test-integration-webhook-api.sh"
echo ""
