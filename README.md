# Auto Resize Images - Obsidian Plugin

This Obsidian plugin automatically resizes linked images by adding `|150` (or a custom width) to image links.

## Features

- **Automatic Resizing**: Automatically adds width specifications to image links when files are opened
- **Manual Commands**: Commands to resize images in current file or all files
- **Customizable Width**: Configurable default image width (default: 150px)
- **Smart Detection**: Only modifies images that don't already have size specifications

## How It Works

The plugin converts image links from:
```
![[image.jpg]]
```

To:
```
![[image.jpg|150]]
```

## Installation

### Manual Installation

1. Download the latest release from the releases page
2. Extract the ZIP file
3. Copy the extracted folder to your Obsidian vault's `.obsidian/plugins/` folder
4. Enable the plugin in Obsidian's Community Plugins settings

### From Source

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to build the plugin
4. Copy the built files to your Obsidian vault's `.obsidian/plugins/` folder

## Usage

### Automatic Resizing

The plugin automatically resizes images when you open markdown files. It will:
- Detect image links without size specifications
- Add the configured width (default: 150px)
- Preserve existing size specifications

### Manual Commands

The plugin adds two commands to Obsidian:

1. **Resize images in current file**: Resizes all images in the currently open file
2. **Resize images in all files**: Resizes images in all markdown files in your vault

To use these commands:
1. Open the Command Palette (`Ctrl/Cmd + Shift + P`)
2. Search for "Resize images"
3. Select the desired command

### Settings

You can customize the default image width in the plugin settings:
1. Go to Settings → Community Plugins → Auto Resize Images
2. Adjust the "Default image width" value
3. The plugin will use this width for all new image resizing

## Supported Image Formats

The plugin recognizes these image file extensions:
- `.jpg` / `.jpeg`
- `.png`
- `.gif`
- `.webp`
- `.svg`

## Examples

### Before (Original)
```markdown
Here's an image: ![[screenshot.png]]
And another: ![[photo.jpg]]
```

### After (Resized)
```markdown
Here's an image: ![[screenshot.png|150]]
And another: ![[photo.jpg|150]]
```

### Already Sized Images
Images that already have size specifications are left unchanged:
```markdown
![[image.png|300]]  <!-- This stays as is -->
![[image.png]]       <!-- This becomes ![[image.png|150]] -->
```

## Development

### Building

```bash
npm install
npm run build
```

### Development Mode

```bash
npm run dev
```

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.
