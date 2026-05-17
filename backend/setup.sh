#!/bin/bash
# Expense Manager - Backend Setup Script
# This script helps you quickly set up the backend

echo "================================"
echo "   EXPENSE MANAGER BACKEND"
echo "   Setup Helper Script"
echo "================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "📥 Download from: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js $(node -v) found"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm $(npm -v) found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check for .env file
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env with your MongoDB URI and email settings"
    echo "   Run: nano .env"
    echo ""
fi

echo "================================"
echo "   Setup Complete! ✅"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your MongoDB URI"
echo "2. Configure SMTP settings for email"
echo "3. Run: npm run dev"
echo ""
echo "For more details, see QUICK_START.md"
echo ""
