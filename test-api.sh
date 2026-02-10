#!/bin/bash

echo "Testing API connection to: https://jwt-auth-api-1-ej2w.onrender.com"
echo ""

# Test basic connectivity
echo "1. Testing server availability..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" \
  https://jwt-auth-api-1-ej2w.onrender.com

echo ""
echo "2. Testing forgot-password endpoint..."
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}' \
  -s \
  https://jwt-auth-api-1-ej2w.onrender.com/api/users/forgot-password \
  | python -m json.tool 2>/dev/null || echo "Response is not JSON or error occurred"

echo ""
echo "Note: If email is not arriving, the backend might:"
echo "• Not have email service configured"
echo "• Return token in API response (check above)"
echo "• Require email verification setup"
