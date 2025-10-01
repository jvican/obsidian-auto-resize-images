import AutoResizeImagesPlugin from './main';

jest.mock('obsidian');

describe('AutoResizeImagesPlugin', () => {
  let plugin: AutoResizeImagesPlugin;

  beforeEach(() => {
    plugin = new AutoResizeImagesPlugin({} as any, {} as any);
    plugin.settings = { imageWidth: 150 };
  });

  describe('resizeImagesInContent - Wiki-style images', () => {
    test('should add size to wiki image without size', () => {
      const input = '![[test.jpg]]';
      const expected = '![[test.jpg|150]]';
      expect(plugin.resizeImagesInContent(input)).toBe(expected);
    });

    test('should replace existing size in wiki image', () => {
      const input = '![[test.jpg|300]]';
      const expected = '![[test.jpg|150]]';
      expect(plugin.resizeImagesInContent(input)).toBe(expected);
    });

    test('should handle multiple wiki images', () => {
      const input = '![[image1.jpg]] Some text ![[image2.png]]';
      const expected = '![[image1.jpg|150]] Some text ![[image2.png|150]]';
      expect(plugin.resizeImagesInContent(input)).toBe(expected);
    });

    test('should handle all supported image formats', () => {
      const formats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
      formats.forEach(format => {
        const input = `![[test.${format}]]`;
        const expected = `![[test.${format}|150]]`;
        expect(plugin.resizeImagesInContent(input)).toBe(expected);
      });
    });

    test('should handle wiki images with paths', () => {
      const input = '![[folder/subfolder/image.jpg]]';
      const expected = '![[folder/subfolder/image.jpg|150]]';
      expect(plugin.resizeImagesInContent(input)).toBe(expected);
    });

    test('should replace wiki images with existing size and spaces', () => {
      const input = '![[test.jpg|200]]';
      const expected = '![[test.jpg|150]]';
      expect(plugin.resizeImagesInContent(input)).toBe(expected);
    });
  });

  describe('resizeImagesInContent - Markdown-style images', () => {
    test('should add size to markdown image without size', () => {
      const input = '![alt text](test.jpg)';
      const expected = '![alt text|150](test.jpg)';
      expect(plugin.resizeImagesInContent(input)).toBe(expected);
    });

    test('should replace existing size in markdown image', () => {
      const input = '![alt text|300](test.jpg)';
      const expected = '![alt text|150](test.jpg)';
      expect(plugin.resizeImagesInContent(input)).toBe(expected);
    });

    test('should handle markdown image with empty alt text', () => {
      const input = '![](test.jpg)';
      const expected = '![|150](test.jpg)';
      expect(plugin.resizeImagesInContent(input)).toBe(expected);
    });

    test('should handle multiple markdown images', () => {
      const input = '![img1](image1.jpg) Some text ![img2](image2.png)';
      const expected = '![img1|150](image1.jpg) Some text ![img2|150](image2.png)';
      expect(plugin.resizeImagesInContent(input)).toBe(expected);
    });

    test('should handle markdown images with paths', () => {
      const input = '![My image](folder/subfolder/image.jpg)';
      const expected = '![My image|150](folder/subfolder/image.jpg)';
      expect(plugin.resizeImagesInContent(input)).toBe(expected);
    });

    test('should handle all supported image formats in markdown', () => {
      const formats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
      formats.forEach(format => {
        const input = `![alt](test.${format})`;
        const expected = `![alt|150](test.${format})`;
        expect(plugin.resizeImagesInContent(input)).toBe(expected);
      });
    });
  });

  describe('resizeImagesInContent - Mixed content', () => {
    test('should handle both wiki and markdown images in same content', () => {
      const input = '![[wiki.jpg]] and ![markdown](md.png)';
      const expected = '![[wiki.jpg|150]] and ![markdown|150](md.png)';
      expect(plugin.resizeImagesInContent(input)).toBe(expected);
    });

    test('should not modify non-image content', () => {
      const input = 'Regular text [[not an image]] and [link](url)';
      const expected = 'Regular text [[not an image]] and [link](url)';
      expect(plugin.resizeImagesInContent(input)).toBe(expected);
    });

    test('should handle complex document with multiple images', () => {
      const input = `# Header
Some text ![[image1.jpg|200]] more text
Another paragraph ![alt](image2.png)
![[image3.gif]]`;
      const expected = `# Header
Some text ![[image1.jpg|150]] more text
Another paragraph ![alt|150](image2.png)
![[image3.gif|150]]`;
      expect(plugin.resizeImagesInContent(input)).toBe(expected);
    });
  });

  describe('resizeImagesInContent - Custom width', () => {
    test('should use custom width setting', () => {
      plugin.settings.imageWidth = 300;
      const input = '![[test.jpg]]';
      const expected = '![[test.jpg|300]]';
      expect(plugin.resizeImagesInContent(input)).toBe(expected);
    });

    test('should replace with custom width', () => {
      plugin.settings.imageWidth = 500;
      const input = '![[test.jpg|100]] ![alt|200](test2.png)';
      const expected = '![[test.jpg|500]] ![alt|500](test2.png)';
      expect(plugin.resizeImagesInContent(input)).toBe(expected);
    });
  });
});
