import { App, Editor, MarkdownView, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface AutoResizeImagesSettings {
	imageWidth: number;
	resizeUrlWidthParams: boolean;
}

const DEFAULT_SETTINGS: AutoResizeImagesSettings = {
	imageWidth: 150,
	resizeUrlWidthParams: true
}

export default class AutoResizeImagesPlugin extends Plugin {
	settings: AutoResizeImagesSettings;

	async onload() {
		await this.loadSettings();

		// Add command to manually resize images in current file
		this.addCommand({
			id: 'resize-images-in-current-file',
			name: 'Resize images in current file',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.resizeImagesInEditor(editor);
			}
		});

		// Add settings tab
		this.addSettingTab(new AutoResizeImagesSettingTab(this.app, this));

		console.log('Auto Resize Images plugin loaded');
	}

	onunload() {
		console.log('Auto Resize Images plugin unloaded');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	// Function to resize images in the current editor
	resizeImagesInEditor(editor: Editor) {
		const content = editor.getValue();
		const newContent = this.resizeImagesInContent(content);

		if (content !== newContent) {
			editor.setValue(newContent);
		}
	}

	// Function to replace width parameters in URLs
	replaceUrlWidthParam(url: string): string {
		// Common width parameter patterns:
		// - w_XXX (e.g., Substack CDN: w_424)
		// - width=XXX or width:XXX
		// - w=XXX or w:XXX
		const widthPatterns = [
			{ regex: /\bw_(\d+)\b/g, replacement: `w_${this.settings.imageWidth}` },
			{ regex: /\bwidth[=:](\d+)\b/gi, replacement: `width=${this.settings.imageWidth}` },
			{ regex: /\bw[=:](\d+)\b/g, replacement: `w=${this.settings.imageWidth}` }
		];

		let newUrl = url;
		for (const pattern of widthPatterns) {
			if (pattern.regex.test(url)) {
				newUrl = newUrl.replace(pattern.regex, pattern.replacement);
				break; // Only replace the first matching pattern
			}
		}

		return newUrl;
	}

	// Function to resize images in content
	resizeImagesInContent(content: string): string {
		// Regex to match wiki-style image links: ![[filename.jpg]] or ![[filename.jpg|size]]
		const wikiImageRegex = /!\[\[([^\]]+\.(?:jpg|jpeg|png|gif|webp|svg))(?:\|[^\]]+)?\]\]/g;

		// Regex to match markdown-style image links: ![alt](path) or ![alt|size](path)
		// Updated to handle URLs with query parameters or fragments
		const mdImageRegex = /!\[([^\]]*)\]\(([^)]*\.(?:jpg|jpeg|png|gif|webp|svg)[^)]*)\)/g;

		// Process wiki-style links
		let newContent = content.replace(wikiImageRegex, (match, filename) => {
			// Remove any existing size specification from filename
			const cleanFilename = filename.split('|')[0];

			// Add the size specification
			return `![[${cleanFilename}|${this.settings.imageWidth}]]`;
		});

		// Process markdown-style links
		newContent = newContent.replace(mdImageRegex, (match, alt, path) => {
			// Remove any existing size specification from alt text
			const cleanAlt = alt.split('|')[0];

			// Process URL width parameters if enabled
			let processedPath = path;
			if (this.settings.resizeUrlWidthParams && this.containsWidthParam(path)) {
				processedPath = this.replaceUrlWidthParam(path);
			}

			// Add the size specification to alt text
			return `![${cleanAlt}|${this.settings.imageWidth}](${processedPath})`;
		});

		return newContent;
	}

	// Check if URL contains width parameters
	containsWidthParam(url: string): boolean {
		const widthPatterns = [
			/\bw_\d+\b/,
			/\bwidth[=:]\d+\b/i,
			/\bw[=:]\d+\b/
		];

		return widthPatterns.some(pattern => pattern.test(url));
	}
}

class AutoResizeImagesSettingTab extends PluginSettingTab {
	plugin: AutoResizeImagesPlugin;

	constructor(app: App, plugin: AutoResizeImagesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Auto Resize Images Settings'});

		new Setting(containerEl)
			.setName('Default image width')
			.setDesc('Default width in pixels for resized images')
			.addText(text => text
				.setPlaceholder('150')
				.setValue(this.plugin.settings.imageWidth.toString())
				.onChange(async (value) => {
					const numValue = parseInt(value);
					if (!isNaN(numValue) && numValue > 0) {
						this.plugin.settings.imageWidth = numValue;
						await this.plugin.saveSettings();
					}
				}));

		new Setting(containerEl)
			.setName('Resize URL width parameters')
			.setDesc('Automatically detect and resize width parameters embedded in image URLs (e.g., w_424, width=300). When enabled, URLs with width parameters will be updated to use the default image width.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.resizeUrlWidthParams)
				.onChange(async (value) => {
					this.plugin.settings.resizeUrlWidthParams = value;
					await this.plugin.saveSettings();
				}));
	}
}
