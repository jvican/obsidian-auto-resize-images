export class App {}

export class Plugin {
  app: any;
  manifest: any;

  constructor(app: any, manifest: any) {
    this.app = app;
    this.manifest = manifest;
  }

  loadData = jest.fn();
  saveData = jest.fn();
  addCommand = jest.fn();
  addSettingTab = jest.fn();
  registerEvent = jest.fn();
}

export class PluginSettingTab {
  constructor(public app: any, public plugin: any) {}
}

export class Setting {}
export class Editor {}
export class MarkdownView {}
