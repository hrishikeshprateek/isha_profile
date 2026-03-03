#!/bin/bash

# Instagram Database Seed - Bash Helper Script
# This script sends a seed request to your admin API

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🌱 Instagram Database Seed Helper${NC}"
echo ""
echo "This script will help you seed your Instagram data."
echo ""
echo "There are two ways to seed:"
echo ""
echo "1️⃣  ${GREEN}Via Admin Panel (Recommended)${NC}"
echo "   • Navigate to: http://localhost:3000/admin/seed"
echo "   • Or search: Cmd+K → type 'seed'"
echo "   • Click 'Seed Database' button"
echo ""
echo "2️⃣  ${GREEN}Via Node Script${NC}"
echo "   • Requires MONGODB_URI in .env.local"
echo "   • Run: node scripts/seed-instagram.js"
echo ""
echo "3️⃣  ${GREEN}Via API Call${NC}"
echo "   • Your API: PUT /api/admin/instagram"
echo "   • See documentation for details"
echo ""
echo -e "${YELLOW}Note:${NC} The admin panel method is easiest!"
echo ""
echo "📚 Documentation: /docs/INSTAGRAM_DATABASE_SEEDING.md"
echo ""

