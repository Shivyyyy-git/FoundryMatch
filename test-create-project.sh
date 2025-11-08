#!/bin/bash

BASE_URL="http://localhost:5001"
COOKIE_FILE="/tmp/cookies.txt"

echo "🔑 Getting CSRF token..."
CSRF_RESPONSE=$(curl -s -c $COOKIE_FILE "$BASE_URL/api/auth/csrf")
CSRF_TOKEN=$(echo "$CSRF_RESPONSE" | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)
echo "CSRF Token: $CSRF_TOKEN"

echo "🔐 Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -b $COOKIE_FILE \
  -c $COOKIE_FILE \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF_TOKEN" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }')
echo "$LOGIN_RESPONSE"

# Refresh CSRF token after login
CSRF_RESPONSE=$(curl -s -c $COOKIE_FILE "$BASE_URL/api/auth/csrf")
CSRF_TOKEN=$(echo "$CSRF_RESPONSE" | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)

echo ""
echo "📝 Creating project..."
PROJECT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/projects" \
  -b $COOKIE_FILE \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF_TOKEN" \
  -d '{
    "title": "Build a React App",
    "description": "Looking for a frontend developer to build a modern React application with TypeScript.",
    "category": "software",
    "compensationType": "paid",
    "requiredSkills": ["React", "TypeScript", "CSS"],
    "applicationDeadline": "2024-12-31T23:59:59Z"
  }')

echo "$PROJECT_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$PROJECT_RESPONSE"
