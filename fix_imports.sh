#!/bin/bash

# Update all component files to use default import

# Navbar.jsx
sed -i "s/import { authService }/import authService/" src/components/Navbar.jsx

# PrivateRoute.jsx  
sed -i "s/import { authService }/import authService/" src/components/PrivateRoute.jsx

# Login.jsx
sed -i "s/import { authService }/import authService/" src/pages/Login.jsx

# Register.jsx
sed -i "s/import { authService }/import authService/" src/pages/Register.jsx

# Dashboard.jsx
sed -i "s/import { authService }/import authService/" src/pages/Dashboard.jsx

echo "All imports fixed to use default import!"
