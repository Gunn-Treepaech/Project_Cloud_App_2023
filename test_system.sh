#!/bin/bash

echo "🏦 Testing Mortgage Calculator Pro - Full System Integration"
echo "=========================================================="

API_BASE="http://localhost:5000"
FRONTEND_URL="http://localhost:5173"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run test
run_test() {
    local test_name="$1"
    local command="$2"
    local expected_pattern="$3"

    echo -e "\n${YELLOW}Testing: $test_name${NC}"

    if result=$(eval "$command" 2>&1); then
        if echo "$result" | grep -q "$expected_pattern"; then
            echo -e "${GREEN}✅ PASS: $test_name${NC}"
            ((TESTS_PASSED++))
            return 0
        else
            echo -e "${RED}❌ FAIL: $test_name - Unexpected response${NC}"
            echo "Expected pattern: $expected_pattern"
            echo "Got: $result"
            ((TESTS_FAILED++))
            return 1
        fi
    else
        echo -e "${RED}❌ FAIL: $test_name - Command failed${NC}"
        echo "Error: $result"
        ((TESTS_FAILED++))
        return 1
    fi
}

echo -e "\n${YELLOW}🔍 Phase 1: Backend API Tests${NC}"

# Test 1: Backend health check
run_test "Backend Health Check" \
    "curl -s $API_BASE/" \
    "Calculate Loan Schedule Program"

# Test 2: Database connectivity
run_test "Database Connection" \
    "curl -s $API_BASE/api/showdatadb" \
    "Kbank\|SCB\|UOB\|KTB"

# Test 3: Bank-specific info
run_test "Bank Info API" \
    "curl -s 'http://localhost:5000/api/bank-info?bank=Kbank'" \
    "MRR"

# Test 4: Loan calculation
run_test "Loan Calculation API" \
    "curl -s -X POST $API_BASE/api/calculate \
    -H 'Content-Type: application/json' \
    -d '{
        \"start_month\": 12,
        \"start_year\": 2024,
        \"initial_loan\": 1000000,
        \"fixed_interest\": 2.95,
        \"fixed_year\": 3,
        \"MRR\": 7.30,
        \"monthly_payment\": 20000,
        \"chang_interest\": [2.95, 1.95],
        \"bank\": \"Kbank\"
    }'" \
    "balance\|interest\|remaining"

echo -e "\n${YELLOW}🌐 Phase 2: Frontend Tests${NC}"

# Test 5: Frontend accessibility
run_test "Frontend Loading" \
    "curl -s $FRONTEND_URL/" \
    "Mortgage Calculator"

# Test 6: Check frontend has proper environment
echo -e "\n${YELLOW}Testing: Frontend Environment Configuration${NC}"
if docker exec project_cloud_app_2023-frontend-1 printenv | grep -q "VITE_API_BASE_URL=http://backend:5000"; then
    echo -e "${GREEN}✅ PASS: Frontend Environment Configuration${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ FAIL: Frontend Environment Configuration${NC}"
    ((TESTS_FAILED++))
fi

echo -e "\n${YELLOW}🐳 Phase 3: Docker Infrastructure Tests${NC}"

# Test 7: All containers running
echo -e "\n${YELLOW}Testing: Docker Containers Status${NC}"
container_count=$(docker ps --format "table {{.Names}}" | grep -E "(frontend|backend|db)" | wc -l)
if [ "$container_count" -eq 3 ]; then
    echo -e "${GREEN}✅ PASS: All 3 required containers are running${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ FAIL: Expected 3 containers, found $container_count${NC}"
    ((TESTS_FAILED++))
fi

# Test 8: Container health
echo -e "\n${YELLOW}Testing: Container Health Status${NC}"
unhealthy_count=$(docker ps --format "table {{.Names}}\t{{.Status}}" | grep -E "(frontend|backend|db)" | grep -v "healthy" | wc -l)
if [ "$unhealthy_count" -eq 0 ]; then
    echo -e "${GREEN}✅ PASS: All containers are healthy${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ FAIL: $unhealthy_count containers are unhealthy${NC}"
    ((TESTS_FAILED++))
fi

echo -e "\n${YELLOW}🏦 Phase 4: Business Logic Validation${NC}"

# Test 9: Thai bank data validation
echo -e "\n${YELLOW}Testing: Thai Bank Data Validation${NC}"
bank_data=$(curl -s "$API_BASE/api/showdatadb")
 thai_banks=("Kbank" "SCB" "UOB" "KTB")
all_banks_found=true

for bank in "${thai_banks[@]}"; do
    if ! echo "$bank_data" | grep -q "\"bank_name\": *\"$bank\""; then
        echo -e "${RED}❌ Missing bank data for: $bank${NC}"
        all_banks_found=false
    fi
done

if [ "$all_banks_found" = true ]; then
    echo -e "${GREEN}✅ PASS: All Thai banks found in database${NC}"
    ((TESTS_PASSED++))
else
    ((TESTS_FAILED++))
fi

# Test 10: Network connectivity between containers
echo -e "\n${YELLOW}Testing: Inter-container Network Connectivity${NC}"
network_test=$(docker network inspect project_cloud_app_2023_mortgage-network 2>/dev/null | grep -E "(frontend|backend|db)" | wc -l)
if [ "$network_test" -ge 3 ]; then
    echo -e "${GREEN}✅ PASS: All containers connected to mortgage network${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ FAIL: Network connectivity issue${NC}"
    ((TESTS_FAILED++))
fi

echo -e "\n${YELLOW}📊 Final Results${NC}"
echo "=========================================================="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo -e "Total Tests:  $((TESTS_PASSED + TESTS_FAILED))"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed! System is ready for use.${NC}"
    echo -e "\n📱 You can now access the application at: ${YELLOW}$FRONTEND_URL${NC}"
    echo -e "\n🏦 Mortgage Calculator Pro Features Available:"
    echo -e "  • Multi-bank comparison (Kbank, SCB, UOB, KTB)"
    echo -e "  • Dynamic interest rate calculations"
    echo -e "  • Thai MRR-based loan scheduling"
    echo -e "  • Responsive web interface"
    echo -e "  • Real-time calculation results"
    exit 0
else
    echo -e "\n${RED}❌ Some tests failed. Please check the system configuration.${NC}"
    exit 1
fi