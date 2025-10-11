# 📸 How to Add Your Petrol Station Images

You uploaded 3 beautiful petrol station images. Here's how to add them to your site:

---

## 📂 Where to Save the Images

### **Image 1: 7-Eleven/Mobil Station**
The image with the 7-Eleven sign and Mobil branding.

**Save as:**
```
public/images/stations/seven-eleven.jpg
```

**Used for:** 7-Eleven and Mobil branded stations

---

### **Image 2: Shell Station**  
The image with the yellow/orange Shell canopy and V-Power branding.

**Save as:**
```
public/images/stations/shell-station.jpg
```

**Used for:** Shell branded stations

---

### **Image 3: BP Station**
The image with the green BP canopy.

**Save as:**
```
public/images/stations/bp-station.jpg
```

**Used for:** BP branded stations

---

## 🎯 Quick Setup (Windows PowerShell)

### **Option 1: Manual Copy**

1. **Create the directory:**
   ```powershell
   New-Item -Path "public\images\stations" -ItemType Directory -Force
   ```

2. **Copy your images:**
   - Right-click the 7-Eleven image → Save As → `public\images\stations\seven-eleven.jpg`
   - Right-click the Shell image → Save As → `public\images\stations\shell-station.jpg`
   - Right-click the BP image → Save As → `public\images\stations\bp-station.jpg`

### **Option 2: Drag and Drop**

1. Open File Explorer: `public\images\stations\`
2. Drag your 3 images into that folder
3. Rename them:
   - `seven-eleven.jpg`
   - `shell-station.jpg`
   - `bp-station.jpg`

---

## ✅ Verification

After adding the images, verify they're in the right place:

```powershell
dir public\images\stations\

# Should show:
# seven-eleven.jpg
# shell-station.jpg
# bp-station.jpg
```

---

## 🎨 How Images Are Used

### **Station Cards:**
- Each station card shows a header image
- Image is selected based on station brand
- Displays as 180px high header
- Scales up 5% on hover
- Has gradient overlay for brand badge

### **Brand Matching:**
```
Station Brand → Image Used
---------------------------------
Shell         → shell-station.jpg
BP            → bp-station.jpg
7-Eleven      → seven-eleven.jpg
Mobil         → seven-eleven.jpg
Other/Unknown → fuel-nozzles.jpg (default)
```

### **Fallback:**
If brand image isn't found, uses the default fuel nozzles image.

---

## 🖼️ Image Optimization (Optional)

For best performance:

### **Recommended Dimensions:**
- Width: 600px
- Height: 400px
- Aspect Ratio: 3:2
- Format: JPG
- Quality: 85%

### **Optimize with Online Tools:**
- **TinyJPG:** https://tinyjpg.com/
- **Squoosh:** https://squoosh.app/
- **ImageOptim:** https://imageoptim.com/

### **Or PowerShell Script (if you have ImageMagick):**
```powershell
cd public\images\stations
magick seven-eleven.jpg -resize 600x400^ -gravity center -extent 600x400 -quality 85 seven-eleven.jpg
magick shell-station.jpg -resize 600x400^ -gravity center -extent 600x400 -quality 85 shell-station.jpg
magick bp-station.jpg -resize 600x400^ -gravity center -extent 600x400 -quality 85 bp-station.jpg
```

---

## 🎯 Expected Result

After adding images:

### **On Directory Page:**
- **7-Eleven Stations:** Show your 7-Eleven image
- **Shell Stations:** Show your Shell image
- **BP Stations:** Show your BP image
- **Other Stations:** Show fuel nozzles image

### **Visual Impact:**
- ✅ Beautiful branded headers on each card
- ✅ Professional, real-world photos
- ✅ Instant brand recognition
- ✅ Modern, appealing design

---

## 🆘 Troubleshooting

### **Images Not Showing:**

1. **Check file names are exact:**
   - Must be lowercase
   - Must include .jpg extension
   - No spaces in names

2. **Check folder structure:**
   ```
   public/
     images/
       stations/
         seven-eleven.jpg
         shell-station.jpg
         bp-station.jpg
   ```

3. **Refresh browser:**
   - Hard refresh: Ctrl + Shift + R
   - Clear cache if needed

4. **Check console for errors:**
   - F12 → Console tab
   - Look for 404 errors on images

### **Images Look Distorted:**

1. **Resize to recommended dimensions** (600x400)
2. **Ensure aspect ratio is 3:2**
3. **Use JPG format** (not PNG for photos)

---

## 🎨 Alternative: Use as Background

If you want images as backgrounds instead of img tags:

```css
/* In DirectoryPageModern.css: */
.station-image-header {
  background-image: url('/images/stations/shell-station.jpg');
  background-size: cover;
  background-position: center;
}
```

---

## 📝 Current Status

The code is **ready to use your images**:
- ✅ Image paths configured
- ✅ Brand matching implemented
- ✅ Fallback system in place
- ✅ Lazy loading enabled
- ✅ Error handling added

**Just add the 3 images and they'll appear automatically!**

---

## 🎉 Quick Start

**Fastest way:**

1. Create folder:
   ```powershell
   mkdir public\images\stations
   ```

2. Save images there with these exact names:
   - `seven-eleven.jpg`
   - `shell-station.jpg`
   - `bp-station.jpg`

3. Refresh browser (Ctrl + Shift + R)

4. **Done!** Images will appear on station cards.

---

**Images will make your directory look amazing! 🎨**

