# Installation Guide

## Quick Installation

1. **Copy the plugin folder** to your Obsidian vault's plugins directory:
   ```
   cp -r /path/to/obsidian-auto-resize-images /path/to/My Vault/.obsidian/plugins"
   ```

2. **Enable the plugin** in Obsidian:
   - Open Obsidian
   - Go to Settings → Community Plugins
   - Turn off "Safe mode" if it's enabled
   - The plugin should appear in the list of installed plugins
   - Toggle the plugin to enable it

## Manual Installation

1. **Navigate to your Obsidian vault**
2. **Open the plugins folder**: `.obsidian/plugins/`
3. **Copy the plugin files**:
   - `main.js`
   - `manifest.json`
4. **Restart Obsidian**
5. **Enable the plugin** in Community Plugins settings

## Testing the Plugin

1. **Create a test markdown file** with some image links:
   ```markdown
   # Test File
   
   Here's an image: ![[test-image.jpg]]
   Another one: ![[screenshot.png]]
   ```

2. **Use the plugin commands**:
   - Press `Ctrl/Cmd + Shift + P` to open Command Palette
   - Search for "Resize images in current file"
   - The images should be converted to: `![[test-image.jpg|150]]`

3. **Check settings**:
   - Go to Settings → Community Plugins → Auto Resize Images
   - Adjust the default image width if needed

## Troubleshooting

- **Plugin not loading**: Make sure you've copied both `main.js` and `manifest.json`
- **Commands not appearing**: Try restarting Obsidian after installation
- **Images not resizing**: Check that the image links use the correct format `![[filename.jpg]]`

## Plugin Features

- **Automatic resizing** when files are opened
- **Manual commands** for current file or all files
- **Customizable width** (default: 150px)
- **Smart detection** - only modifies images without size specifications
