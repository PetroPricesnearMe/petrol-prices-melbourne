# Cursor AI Connection Troubleshooting

Guide to resolve the "Unable to reach the model provider" error in Cursor IDE.

---

## Error Overview

**Error Message:**

```
ERROR_OPENAI
Unable to reach the model provider
We're having trouble connecting to the model provider.
This might be temporary - please try again in a moment.
```

**Error Type:** `ConnectError: [unavailable] Error`

---

## Quick Fixes (Try These First)

### 1. Wait and Retry

The error message suggests this might be temporary. Wait 30-60 seconds and try again.

### 2. Check Internet Connection

```bash
# Test connectivity
ping google.com
ping api.anthropic.com
```

### 3. Restart Cursor IDE

Close Cursor completely and restart it.

### 4. Check Cursor Status

Visit [status.cursor.sh](https://status.cursor.sh) to see if there are any ongoing issues.

---

## Configuration Checks

### 1. Verify API Settings

**Steps:**

1. Open Cursor Settings (Ctrl+,)
2. Search for "API" or "Model"
3. Check if your API key is configured correctly
4. Verify the model provider selection

### 2. Check Proxy/Firewall Settings

**Corporate Network Issues:**

- If you're behind a corporate firewall, it might block AI API calls
- Check with your IT department about proxy settings
- Try connecting from a different network (e.g., mobile hotspot)

**Proxy Configuration:**

1. Open Cursor Settings
2. Search for "Proxy"
3. Configure proxy settings if required:
   ```
   HTTP Proxy: http://your-proxy:port
   HTTPS Proxy: https://your-proxy:port
   ```

### 3. VPN Issues

If using a VPN:

- Try disconnecting VPN temporarily
- Some VPNs block AI API endpoints
- Try a different VPN server location

---

## Advanced Troubleshooting

### 1. Clear Cursor Cache

**Windows:**

```bash
# Close Cursor first, then:
rd /s /q "%APPDATA%\Cursor\Cache"
rd /s /q "%APPDATA%\Cursor\Code Cache"
rd /s /q "%LOCALAPPDATA%\Cursor\Cache"
```

**After clearing cache:**

1. Restart Cursor
2. Reconfigure your settings if needed

### 2. Check System Hosts File

Ensure Cursor API domains aren't blocked:

**Windows:**

```bash
notepad C:\Windows\System32\drivers\etc\hosts
```

Look for any entries blocking:

- `api.anthropic.com`
- `api.openai.com`
- `cursor.sh`

Remove any blocking entries.

### 3. Antivirus/Security Software

Some security software blocks AI API calls:

1. Check your antivirus logs
2. Temporarily disable antivirus to test
3. Add Cursor to whitelist/exceptions

### 4. DNS Issues

Try using different DNS servers:

**Google DNS:**

- Primary: `8.8.8.8`
- Secondary: `8.8.4.4`

**Cloudflare DNS:**

- Primary: `1.1.1.1`
- Secondary: `1.0.0.1`

**Windows - Change DNS:**

1. Open Network Settings
2. Change Adapter Options
3. Right-click your connection → Properties
4. Select IPv4 → Properties
5. Use the DNS servers above

### 5. Reinstall Cursor

If all else fails:

1. **Backup Settings:**
   - Export your settings from File → Preferences → Settings
   - Note down any custom keybindings

2. **Uninstall:**

   ```bash
   # Windows - Control Panel → Uninstall Program
   # Select "Cursor" and uninstall
   ```

3. **Clean Install:**
   - Download latest version from [cursor.com](https://cursor.com)
   - Install fresh
   - Reconfigure settings

---

## Cursor-Specific Settings

### Check Model Configuration

In your workspace, check `.cursor/` folder:

```bash
# List .cursor directory
dir .cursor
```

Files to check:

- `.cursor/config.json` - Configuration
- `.cursor/rules/*.mdc` - Agent rules

### Reset to Defaults

If settings are corrupted:

1. Open Command Palette (Ctrl+Shift+P)
2. Search: "Cursor: Reset Settings"
3. Confirm reset
4. Reconfigure as needed

---

## Project-Specific Issues

### 1. Check .vscode/settings.json

We've already configured this for you. Verify settings at:
[.vscode/settings.json](.vscode/settings.json)

### 2. Large Files

If working with large files, Cursor might timeout:

- Split large files into smaller modules
- Use `.cursorignore` to exclude unnecessary files

### 3. Node Modules

Exclude node_modules from AI indexing:

Create `.cursorignore`:

```
node_modules/
build/
dist/
*.log
.git/
```

---

## Alternative Solutions

### 1. Use Different Model Provider

If one provider is down, try switching:

1. Open Cursor Settings
2. Change Model Provider (OpenAI, Anthropic, etc.)
3. Configure appropriate API key

### 2. Use Claude Code Differently

While waiting for fix:

- Use terminal commands directly
- Edit files manually
- Use other IDE features

### 3. Fallback to VSCode

Cursor is built on VSCode, so you can always:

1. Open project in VSCode
2. Use Copilot or other AI extensions
3. Return to Cursor when working

---

## Monitoring and Logs

### View Cursor Logs

1. Open Command Palette (Ctrl+Shift+P)
2. Search: "Developer: Toggle Developer Tools"
3. Check Console tab for errors
4. Look for network errors or failed requests

### Network Inspector

In Developer Tools:

1. Go to Network tab
2. Try making AI request
3. Look for failed requests
4. Check error details

---

## Getting Help

### 1. Cursor Community

- GitHub Issues: [github.com/getcursor/cursor](https://github.com/getcursor/cursor)
- Discord: Join Cursor community
- Forum: Official Cursor forum

### 2. Report Bug

If issue persists:

1. Collect error logs
2. Note reproduction steps
3. Report at: https://github.com/anthropics/claude-code/issues

### 3. Contact Support

For urgent issues:

- Email: support@cursor.com
- Include error details and logs

---

## Prevention Tips

### 1. Keep Cursor Updated

- Enable auto-updates
- Check for updates regularly
- Install stable versions

### 2. Stable Internet

- Use wired connection when possible
- Avoid unstable WiFi
- Consider internet speed requirements

### 3. Regular Maintenance

- Clear cache monthly
- Update extensions
- Keep system updated

---

## Your Project Setup

Your project is now configured with:

- ✅ VSCode settings optimized for development
- ✅ Environment variable templates
- ✅ Development setup documentation
- ✅ Quick start guide

**The connection error is IDE-specific, not your project.**

---

## Summary Checklist

- [ ] Waited 60 seconds and retried
- [ ] Checked internet connection
- [ ] Restarted Cursor IDE
- [ ] Verified API settings in Cursor
- [ ] Checked proxy/firewall settings
- [ ] Tried without VPN
- [ ] Cleared Cursor cache
- [ ] Checked hosts file
- [ ] Temporarily disabled antivirus
- [ ] Changed DNS servers
- [ ] Checked Cursor status page
- [ ] Viewed error logs in Developer Tools
- [ ] Considered reinstalling Cursor

---

**Good luck!** 🚀 Most connection issues resolve within a few minutes or after a restart.
