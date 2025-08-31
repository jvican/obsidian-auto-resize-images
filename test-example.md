# Test Example for Auto Resize Images Plugin

This file contains examples of image links that the plugin will automatically resize.

## Before (Original Image Links)

Here are some image links without size specifications:

- Screenshot: ![[screenshot.png]]
- Photo: ![[photo.jpg]]
- Diagram: ![[diagram.svg]]
- Icon: ![[icon.gif]]

## After (Plugin Will Convert To)

The plugin will automatically convert the above links to:

- Screenshot: ![[screenshot.png|150]]
- Photo: ![[photo.jpg|150]]
- Diagram: ![[diagram.svg|150]]
- Icon: ![[icon.gif|150]]

## Already Sized Images

Images that already have size specifications are left unchanged:

- Large image: ![[large-image.png|800]]
- Small icon: ![[small-icon.png|32]]

## Supported Formats

The plugin recognizes these image file extensions:
- `.jpg` / `.jpeg`
- `.png`
- `.gif`
- `.webp`
- `.svg`

## How to Test

1. Install the plugin in Obsidian
2. Open this file
3. Use the command "Resize images in current file"
4. Watch the image links get automatically updated with `|150`
