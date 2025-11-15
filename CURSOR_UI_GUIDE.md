# Cursor UI & Tab Bar Guide

Quick reference for accessing tabs, settings, and UI elements in Cursor IDE.

---

## ✅ Configured Settings

Your project now has optimized tab bar and UI settings in [.vscode/settings.json](.vscode/settings.json):

- ✅ **Tab Bar** - Multiple tabs visible and accessible
- ✅ **Activity Bar** - Left sidebar with file explorer, search, etc.
- ✅ **Status Bar** - Bottom bar showing file info, errors, etc.
- ✅ **Breadcrumbs** - File path navigation at top of editor
- ✅ **Minimap** - Code overview on right side of editor

---

## 🎯 Accessing Key UI Elements

### Tab Bar

The tab bar shows open files at the top of the editor.

**Keyboard Shortcuts:**

- `Ctrl+Tab` - Switch between open tabs
- `Ctrl+W` - Close current tab
- `Ctrl+K Ctrl+W` - Close all tabs
- `Ctrl+Shift+T` - Reopen closed tab
- `Alt+1` through `Alt+9` - Switch to tab 1-9

**Right-Click Tab for:**

- Close Tab
- Close Other Tabs
- Close Tabs to the Right
- Close All Tabs
- Pin Tab
- Split Editor

### Settings Access

**Multiple Ways to Open Settings:**

1. **Menu Bar** (Toggle with `Alt`)
   - Click `File` → `Preferences` → `Settings`

2. **Command Palette** (`Ctrl+Shift+P`)
   - Type: `Preferences: Open Settings (UI)`
   - Or: `Preferences: Open Settings (JSON)`

3. **Keyboard Shortcut**
   - `Ctrl+,` - Opens Settings UI

4. **Gear Icon**
   - Click gear icon in bottom-left corner
   - Select "Settings"

### View Menu

**Toggle UI Elements:**

Press `Alt` to show menu bar, then click `View`:

- **Command Palette** - `Ctrl+Shift+P`
- **Open View** - `Ctrl+Q`
- **Appearance** submenu:
  - Show Activity Bar
  - Show Side Bar - `Ctrl+B`
  - Show Status Bar
  - Show Panel - `Ctrl+J`
  - Show Menu Bar - `Alt`

Or use **Command Palette** (`Ctrl+Shift+P`) and type:

- `View: Toggle Activity Bar Visibility`
- `View: Toggle Side Bar Visibility`
- `View: Toggle Status Bar Visibility`
- `View: Toggle Panel Visibility`
- `View: Toggle Menu Bar Visibility`

---

## 🗂️ File Navigation

### Quick Open

- `Ctrl+P` - Quick open file by name
- `Ctrl+Shift+P` - Command Palette
- `Ctrl+Shift+O` - Go to Symbol in File
- `Ctrl+T` - Go to Symbol in Workspace

### Explorer Sidebar

- `Ctrl+Shift+E` - Focus on Explorer
- `Ctrl+B` - Toggle sidebar visibility

### Breadcrumbs

Now enabled! Shows file path at top of editor:

- Click segments to navigate
- `Ctrl+Shift+.` - Focus breadcrumbs

---

## 📋 Editor Layout

### Split Editor

- `Ctrl+\` - Split editor vertically
- `Ctrl+K Ctrl+\` - Split editor horizontally
- `Ctrl+1/2/3` - Focus on editor group 1, 2, or 3

### Tab Management

- **Pin Tab** - Right-click tab → Pin Tab
- **Unpin Tab** - Right-click pinned tab → Unpin Tab
- Pinned tabs stay at the left and won't close with "Close All"

---

## ⚙️ Customizing Settings

### Your Current Settings

Located in [.vscode/settings.json](.vscode/settings.json):

**Tab Bar Configuration:**

```json
"workbench.editor.showTabs": "multiple",    // Show multiple tabs
"workbench.editor.tabSizing": "fit",        // Tabs fit to content
"workbench.editor.tabCloseButton": "right", // Close button on right
```

**UI Visibility:**

```json
"workbench.activityBar.visible": true,      // Show activity bar
"workbench.statusBar.visible": true,        // Show status bar
"breadcrumbs.enabled": true,                // Show breadcrumbs
```

### To Customize Further

1. **Open Settings** - `Ctrl+,`
2. **Search for:**
   - "tabs" - Tab-related settings
   - "workbench" - UI/layout settings
   - "breadcrumbs" - File navigation
   - "minimap" - Code overview map

3. **Or Edit JSON Directly:**
   - `Ctrl+Shift+P` → `Preferences: Open Settings (JSON)`
   - Or open [.vscode/settings.json](.vscode/settings.json)

---

## 🎨 Appearance Customization

### Color Theme

- `Ctrl+K Ctrl+T` - Select Color Theme
- Or: `File` → `Preferences` → `Color Theme`

### File Icons

- `File` → `Preferences` → `File Icon Theme`

### Zoom Level

- `Ctrl++` - Zoom in
- `Ctrl+-` - Zoom out
- `Ctrl+0` - Reset zoom

---

## 💡 Useful Settings for Tabs

### Tab Behavior Options

Add these to [.vscode/settings.json](.vscode/settings.json) if desired:

```json
// Always show tabs even with one file open
"workbench.editor.showTabs": "multiple",

// Wrap tabs to next line (if you have many files open)
"workbench.editor.wrapTabs": true,

// Show modified indicator on tabs
"workbench.editor.highlightModifiedTabs": true,

// Tab close button position
"workbench.editor.tabCloseButton": "right",  // or "left" or "off"

// Tab sizing
"workbench.editor.tabSizing": "fit",  // or "shrink" to make more fit
```

---

## 🔍 Finding Settings

### Search in Settings UI

1. Open Settings - `Ctrl+,`
2. Use search bar at top
3. Common searches:
   - **"tabs"** - All tab settings
   - **"editor"** - Editor behavior
   - **"workbench"** - UI and layout
   - **"format"** - Code formatting
   - **"auto save"** - Auto-save options

### Settings Categories

**Commonly Used Settings:**

- User Settings - Apply globally
- Workspace Settings - Apply to this project only
- Folder Settings - Apply to specific folder

---

## 📱 Panel Management

### Bottom Panel (Terminal, Problems, etc.)

**Toggle Panel:** `Ctrl+J`

**Panel Views:**

- **Terminal** - `Ctrl+` ` (backtick)
- **Problems** - `Ctrl+Shift+M`
- **Output** - `Ctrl+Shift+U`
- **Debug Console** - `Ctrl+Shift+Y`

**Move Panel:**

- Right-click panel → Move Panel
- Or drag panel to different edge

---

## 🆘 Troubleshooting Tab Bar Issues

### Tab Bar Not Visible

1. **Check if tabs are enabled:**
   - `Ctrl+,` → Search "showTabs"
   - Ensure `"workbench.editor.showTabs": "multiple"`

2. **Reset Workbench:**
   - `Ctrl+Shift+P` → `Developer: Reload Window`

3. **Reset View:**
   - `View` menu → `Reset View Locations`

### Can't See Menu Bar

- Press `Alt` key to toggle menu bar
- Or: `Ctrl+Shift+P` → `View: Toggle Menu Bar`

### UI Elements Missing

Run these commands from Command Palette (`Ctrl+Shift+P`):

- `View: Toggle Activity Bar Visibility`
- `View: Toggle Side Bar Visibility`
- `View: Toggle Status Bar Visibility`

---

## 🎓 Pro Tips

### Multi-Select Tabs

- `Ctrl+Click` - Select multiple tabs
- Right-click → Close Selected Tabs

### Tab Groups

- Drag tabs between split editors
- `Ctrl+K ←/→/↑/↓` - Move editor to different group

### Quick Tab Navigation

- `Ctrl+Tab` - Switch tabs (hold Ctrl, tap Tab)
- `Ctrl+PageUp/PageDown` - Previous/Next tab

### Zen Mode (Distraction-Free)

- `Ctrl+K Z` - Enter Zen Mode
- Press `Esc Esc` to exit

---

## 📖 Keyboard Shortcuts Summary

### Essential Shortcuts

| Action          | Shortcut       |
| --------------- | -------------- |
| Open Settings   | `Ctrl+,`       |
| Command Palette | `Ctrl+Shift+P` |
| Quick Open File | `Ctrl+P`       |
| Toggle Sidebar  | `Ctrl+B`       |
| Toggle Panel    | `Ctrl+J`       |
| New File        | `Ctrl+N`       |
| Close Tab       | `Ctrl+W`       |
| Switch Tabs     | `Ctrl+Tab`     |
| Split Editor    | `Ctrl+\`       |
| Toggle Menu Bar | `Alt`          |

### View Shortcuts

| Action         | Shortcut       |
| -------------- | -------------- |
| Explorer       | `Ctrl+Shift+E` |
| Search         | `Ctrl+Shift+F` |
| Source Control | `Ctrl+Shift+G` |
| Debug          | `Ctrl+Shift+D` |
| Extensions     | `Ctrl+Shift+X` |
| Terminal       | `Ctrl+` `      |

---

## 📚 Additional Resources

### Official Documentation

- VSCode Keyboard Shortcuts: [code.visualstudio.com/shortcuts](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf)
- Cursor Documentation: [cursor.com/docs](https://cursor.com/docs)

### Your Project Documentation

- [SETUP.md](SETUP.md) - Complete setup guide
- [QUICK_START.md](QUICK_START.md) - Quick start guide
- [PROJECT_HEALTH_REPORT.md](PROJECT_HEALTH_REPORT.md) - Project status

---

## ✅ Current Configuration Summary

Your workspace is now configured with:

✅ **Tab Bar** - Fully visible and accessible
✅ **Activity Bar** - Left sidebar enabled
✅ **Status Bar** - Bottom bar enabled
✅ **Breadcrumbs** - File navigation enabled
✅ **Settings UI** - Accessible via `Ctrl+,`

**All view options are now accessible!** 🎉

---

**Need Help?** Press `Ctrl+Shift+P` and type "help" to see available help commands.
