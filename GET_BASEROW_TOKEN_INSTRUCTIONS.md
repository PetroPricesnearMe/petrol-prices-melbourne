# 🔑 How to Get Your Baserow Token

## Step 1: Access Baserow

**Open your browser and go to:**
👉 **https://baserow.io/login**

## Step 2: Log In

Enter your Baserow account credentials:
- Email address
- Password

If you don't have an account, click "Sign up" to create one.

---

## Step 3: Navigate to Settings

Once logged in:

1. Click your **profile icon** or **avatar** in the top right corner
2. Select **"Settings"** from the dropdown menu

---

## Step 4: Go to API Tokens Section

In Settings:

1. Look for **"API tokens"** or **"Database tokens"** in the left sidebar
2. Click on it

---

## Step 5: Create a New Token

1. Click **"Create token"** or **"Generate token"** button
2. Give your token a name (e.g., "Melbourne Petrol Stations")
3. Select the permissions needed:
   - ✅ **Read** access to your tables
   - ✅ **Write** access (if you need to update data)
4. Click **"Create"** or **"Generate"**

---

## Step 6: Copy Your Token

⚠️ **IMPORTANT:** The token will only be shown **ONCE**!

1. **Copy the entire token** (it looks like: `LuwYYOFxLFuBkzSMZJ9XTvE9OgnIsiuXI`)
2. Store it somewhere safe temporarily

---

## Step 7: Update Your .env File

### Option A: Using the Tool I Created (Recommended)

I've already created a `backend/.env` file for you. Now you need to:

1. **Copy your token** from Baserow
2. **Run this command:**

```bash
# Open .env file in notepad
notepad backend\.env
```

3. **Find the line:**
```
BASEROW_TOKEN=PASTE_YOUR_TOKEN_HERE
```

4. **Replace** `PASTE_YOUR_TOKEN_HERE` with your actual token:
```
BASEROW_TOKEN=LuwYYOFxLFuBkzSMZJ9XTvE9OgnIsiuXI
```
*(Use YOUR token, not this example)*

5. **Save** the file (Ctrl+S)
6. **Close** notepad

### Option B: Quick PowerShell Command

Or use this quick command (replace with YOUR token):

```powershell
(Get-Content backend\.env) -replace 'PASTE_YOUR_TOKEN_HERE', 'YOUR_ACTUAL_TOKEN_HERE' | Set-Content backend\.env
```

---

## Step 8: Verify Database and Table IDs

Your config already has these set:
- ✅ Database ID: `265358`
- ✅ Petrol Stations Table ID: `623329`
- ✅ Fuel Prices Table ID: `623330`

**Make sure these match your Baserow setup!**

To check:
1. Go to your database in Baserow
2. Look at the URL: `https://baserow.io/database/265358/table/623329`
3. The numbers are your database and table IDs

---

## Step 9: Restart Backend Server

After updating the token:

1. **Stop the current server:**
   - Go to the terminal running the backend
   - Press `Ctrl+C`

2. **Start it again:**
```powershell
Set-Location C:\Users\zenbo\Desktop\PPNM\backend
node server.js
```

3. **Look for success messages:**
```
🚀 Server running on port 3001
📊 API available at http://localhost:3001
```

4. **Watch for Baserow connection:**
   - Should NOT see "ERROR_TOKEN_DOES_NOT_EXIST" anymore
   - Should see successful data fetching

---

## Step 10: Test It Works

Run the health check:

```powershell
Set-Location C:\Users\zenbo\Desktop\PPNM
node test-backend-health.js
```

**Expected result:**
```
✅ Root Endpoint: PASS
✅ Spatial Data: PASS (250 points)
✅ All Stations: PASS
✅ Paginated Stations: PASS
✅ Baserow Test: PASS

🎉 All tests passed! Backend is healthy.
```

---

## 🔐 Security Best Practices

### ✅ DO:
- Keep your token private
- Add `.env` to `.gitignore` (already done)
- Regenerate token if exposed
- Use separate tokens for dev/production

### ❌ DON'T:
- Commit `.env` to Git
- Share your token publicly
- Use the same token everywhere
- Hardcode the token in your code

---

## 🆘 Troubleshooting

### Problem: "Token does not exist"
**Solution:**
- Verify you copied the entire token
- No extra spaces before/after the token
- Token hasn't been deleted in Baserow
- Generate a new token and try again

### Problem: "Permission denied"
**Solution:**
- Check token has read/write permissions
- Token has access to the specific database
- Token has access to the specific tables

### Problem: "Cannot find table"
**Solution:**
- Verify table IDs in `backend/config.js`
- Check database ID is correct
- Ensure tables exist in your Baserow account

---

## ✅ Quick Verification Checklist

- [ ] Logged into Baserow
- [ ] Created API token with proper permissions
- [ ] Copied token (all characters)
- [ ] Opened `backend/.env` file
- [ ] Replaced `PASTE_YOUR_TOKEN_HERE` with actual token
- [ ] Saved the file
- [ ] Verified no extra spaces
- [ ] Restarted backend server
- [ ] Tested with health check
- [ ] Map shows 250+ stations (not just 5)

---

## 🎯 EXPECTED OUTCOME

### Before (With Invalid Token):
```
❌ API Error: 401
ERROR_TOKEN_DOES_NOT_EXIST
⚠️ Using fallback data (5 stations)
```

### After (With Valid Token):
```
✅ Successfully fetched 250 stations from Baserow
✅ Spatial data loaded: 250 points
✅ Map displaying all station markers
```

---

## 📞 Need Help?

If you're stuck:

1. **Check the token format:**
   - Should be a long string of letters and numbers
   - Example: `LuwYYOFxLFuBkzSMZJ9XTvE9OgnIsiuXI`
   - About 30-40 characters

2. **Verify .env file:**
   ```powershell
   Get-Content backend\.env | Select-String "BASEROW_TOKEN"
   ```
   Should show: `BASEROW_TOKEN=your_actual_token`

3. **Check backend logs:**
   - Look for successful API requests
   - Should NOT see 401 errors

---

**Ready to proceed?** Follow the steps above and let me know if you get stuck! 🚀

