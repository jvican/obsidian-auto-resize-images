import { App, Editor, MarkdownView, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface AutoResizeImagesSettings {
	imageWidth: number;
}

const DEFAULT_SETTINGS: AutoResizeImagesSettings = {
	imageWidth: 150
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

		// Add command to resize images in all files
		this.addCommand({
			id: 'resize-images-in-all-files',
			name: 'Resize images in all files',
			callback: () => {
				this.resizeImagesInAllFiles();
			}
		});

		// Add settings tab
		this.addSettingTab(new AutoResizeImagesSettingTab(this.app, this));

		// Auto-resize images when files are opened
		this.registerEvent(
			this.app.workspace.on('file-open', (file) => {
				if (file && file.extension === 'md') {
					this.autoResizeImagesInFile(file);
				}
			})
		);

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

	// Function to resize images in all markdown files
	async resizeImagesInAllFiles() {
		const files = this.app.vault.getMarkdownFiles();
		
		for (const file of files) {
			await this.autoResizeImagesInFile(file);
		}
	}

	// Function to auto-resize images in a specific file
	async autoResizeImagesInFile(file: any) {
		try {
			const content = await this.app.vault.read(file);
			const newContent = this.resizeImagesInContent(content);
			
			if (content !== newContent) {
				await this.app.vault.modify(file, newContent);
			}
		} catch (error) {
			console.error(`Error processing file ${file.path}:`, error);
		}
	}

	// Function to resize images in content
	resizeImagesInContent(content: string): string {
		// Regex to match image links: ![[filename.jpg]] or ![[filename.png]] etc.
		// This will match image links that don't already have a size specification
		const imageRegex = /!\[\[([^\]]+\.(?:jpg|jpeg|png|gif|webp|svg))\]\]/g;
		
		return content.replace(imageRegex, (match, filename) => {
			// Check if the image already has a size specification
			if (filename.includes('|')) {
				return match; // Don't modify if already has size
			}
			
			// Add the size specification
			return `![[${filename}|${this.settings.imageWidth}]]`;
		});
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
	}
}
