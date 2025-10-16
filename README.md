# Auto Resize Images - Obsidian Plugin

This Obsidian plugin automatically resizes linked images by adding width specifications to image links. It supports both wiki-style and markdown-style images, and can detect and resize width parameters embedded in image URLs.

## Features

- **Automatic Resizing**: Automatically adds width specifications to image links
- **Manual Commands**: Commands to resize images in current file or all files
- **Customizable Width**: Configurable default image width (default: 150px)
- **Smart Detection**: Only modifies images that don't already have size specifications
- **URL Width Parameter Detection**: Automatically detects and resizes width parameters in image URLs (e.g., `w_424`, `width=300`)
- **Multiple Image Formats**: Supports both wiki-style (`![[image.jpg]]`) and markdown-style (`![](image.jpg)`) images

## How It Works

The plugin adds width specifications to image links in multiple formats:

### Wiki-style Images
```
![[image.jpg]]  →  ![[image.jpg|150]]
```

### Markdown-style Images
```
![](image.jpg)  →  ![|150](image.jpg)
```

### Images with URL Width Parameters
When enabled, the plugin also detects and resizes width parameters embedded in URLs:
```
![](https://example.com/image/w_424/photo.png)
→
![|150](https://example.com/image/w_150/photo.png)
```

This is particularly useful for images from CDNs like Substack, Cloudinary, or other services that encode width in the URL.

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

You can customize the plugin behavior in the settings:

1. Go to Settings → Community Plugins → Auto Resize Images
2. Configure the available options:
   - **Default image width**: The width in pixels for resized images (default: 150)
   - **Resize URL width parameters**: Toggle automatic detection and resizing of width parameters in image URLs (default: enabled)

The plugin will use these settings for all image resizing operations.

## Supported Image Formats

The plugin recognizes these image file extensions:
- `.jpg` / `.jpeg`
- `.png`
- `.gif`
- `.webp`
- `.svg`

## Examples

### Wiki-style Images

Before:
```markdown
Here's an image: ![[screenshot.png]]
And another: ![[photo.jpg]]
```

After:
```markdown
Here's an image: ![[screenshot.png|150]]
And another: ![[photo.jpg|150]]
```

### Markdown-style Images

Before:
```markdown
![My screenshot](screenshot.png)
![](photo.jpg)
```

After:
```markdown
![My screenshot|150](screenshot.png)
![|150](photo.jpg)
```

### Images with URL Width Parameters

Before:
```markdown
![](https://substackcdn.com/image/fetch/w_424,c_limit/image.png)
![](https://example.com/images?width=800&quality=high.jpg)
```

After:
```markdown
![|150](https://substackcdn.com/image/fetch/w_150,c_limit/image.png)
![|150](https://example.com/images?width=150&quality=high.jpg)
```

### Already Sized Images

Images that already have size specifications are updated to use the configured width:
```markdown
![[image.png|300]]   <!-- Becomes ![[image.png|150]] -->
![alt|200](img.jpg)  <!-- Becomes ![alt|150](img.jpg) -->
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
