# 🚀 Quick Import Reference

## TL;DR - Import Data to Baserow NOW

### Step 1: Generate Import Files (Already Done ✅)

```bash
node scripts/import-csv-to-baserow.js
node scripts/test-baserow-import.js
```

### Step 2: Import to Baserow (Choose One)

#### Option A: Bulk Import via UI (5 minutes)

1. Go to https://baserow.io
2. Open "Petrol Stations" table
3. Table menu → "Import from file"
4. Upload: `database/baserow-import.csv`
5. Click "Import"
6. Done! ✅

#### Option B: Use Generated Files

- **JSON format**: `database/baserow-import-data.json` (1,141 records)
- **CSV format**: `database/baserow-import.csv` (1,141 records)

### Step 3: Test

```bash
npm start
# Check browser console for: "Successfully loaded X stations from baserow"
```

## Files Ready to Use

### Import Files

- ✅ `database/baserow-import-data.json` - JSON format
- ✅ `database/baserow-import.csv` - CSV format (use this for UI import)

### Scripts

- ✅ `scripts/import-csv-to-baserow.js` - Main import script
- ✅ `scripts/test-baserow-import.js` - Generate CSV
- ✅ `scripts/single-row-import-test.js` - Test single record

### Documentation

- 📘 `BASEROW_IMPORT_GUIDE.md` - Complete guide
- 📘 `DATASOURCE_FIX_SUMMARY.md` - Technical details
- 📘 `DATA_IMPORT_COMPLETE.md` - Full summary

## What Was Fixed

| Issue                   | Solution                          |
| ----------------------- | --------------------------------- |
| DataSourceManager error | ✅ Updated field mappings         |
| Coordinate validation   | ✅ Round to 4 decimals            |
| Field name mismatch     | ✅ Support CSV & Baserow names    |
| Empty Baserow table     | ✅ Generated 1,141 import records |

## Data Stats

- 📊 Total CSV records: 6,651
- 📍 VIC records: 1,141
- 🎯 Import ready: 1,141
- ✅ Validation: 100%

## Baserow Config

**Table**: Petrol Stations (ID: 623329)

Key validations:

- Latitude: max 4 decimals ✅
- Longitude: max 4 decimals ✅
- Category: option 3812407 ✅

## One-Liner Import

```bash
# Generate and view import file
node scripts/test-baserow-import.js && echo "Now upload database/baserow-import.csv to Baserow"
```

## Troubleshooting

| Error                   | Fix                              |
| ----------------------- | -------------------------------- |
| Too many decimal places | ✅ Fixed - coords rounded        |
| Field not found         | ✅ Fixed - multiple name support |
| Invalid category        | ✅ Fixed - using ID 3812407      |

## Support

- 💡 Quick: Read this file
- 📚 Detailed: Read `BASEROW_IMPORT_GUIDE.md`
- 🔧 Technical: Read `DATASOURCE_FIX_SUMMARY.md`

---

**Status**: READY TO IMPORT ✅

Just upload `database/baserow-import.csv` to Baserow and you're done!
