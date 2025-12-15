# Environment Variables Setup Guide

## ⚠️ IMPORTANT - SECURITY NOTICE
All sensitive API keys and tokens have been moved to `.env` files.
**NEVER commit `.env` files to Git!**

## Files Created

### 1. Root `.env`
Contains all project-wide API keys and configuration:
- Fynd Platform credentials
- Extension API keys
- Weather API key
- Google Sheets IDs

### 2. `pro/.env`
Contains Fynd extension-specific credentials

## Setup Instructions

### For Local Development:
1. Copy the `.env` files to your local machine
2. Ensure `.env` is in `.gitignore` ✅ (Already added)
3. Run `npm install dotenv` in the `pro` directory
4. The application will automatically load environment variables

### For Production (Vercel):
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add these variables:
   - `VITE_BOLTIC_TOKEN` (for inventory-ui)

### For Pro Extension:
The extension already uses `process.env` variables from the `.env` file.

## Files Updated to Use Environment Variables

✅ `pro/populate-products.js` - Now uses `process.env`
✅ `extension.context.json` - Sensitive data removed
✅ `pro/extension.context.json` - Sensitive data removed
✅ `workflowA.json` - Weather API key removed

## Next Steps - Clean Git History

To remove sensitive data from Git history:

```bash
# Navigate to repository root
cd "d:\personal\React Projects\Showcasing Projects\Smart inventory system"

# Remove sensitive files from Git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch extension.context.json pro/extension.context.json workflowA.json pro/populate-products.js" \
  --prune-empty --tag-name-filter cat -- --all

# Force push to GitHub (WARNING: This rewrites history!)
git push origin --force --all
git push origin --force --tags
```

## Alternative: Use BFG Repo-Cleaner (Recommended)

```bash
# Install BFG
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Clone a fresh copy
git clone --mirror https://github.com/aditya-poojary/Smart-Inventory-System.git

# Remove sensitive data
java -jar bfg.jar --delete-files extension.context.json Smart-Inventory-System.git

# Clean up
cd Smart-Inventory-System.git
git reflog expire --expire=now --all && git gc --prune=now --aggressive

# Push changes
git push
```

## Emergency: Rotate All Keys

If keys are exposed in Git history, immediately:
1. ✅ Revoke/regenerate the Fynd auth token
2. ✅ Regenerate Weather API key
3. ✅ Update extension API credentials
4. Update all `.env` files with new values

## Verification

After cleaning Git history, verify:
```bash
git log --all --full-history --source -- **/extension.context.json
git log --all --full-history --source -- **/populate-products.js
```

Should return empty results.
