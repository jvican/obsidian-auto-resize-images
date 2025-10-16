import AutoResizeImagesPlugin from './main';

jest.mock('obsidian');

describe('AutoResizeImagesPlugin', () => {
  let plugin: AutoResizeImagesPlugin;

  beforeEach(() => {
    plugin = new AutoResizeImagesPlugin({} as any, {} as any);
    plugin.settings = { imageWidth: 150, resizeUrlWidthParams: true };
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

  describe('URL width parameter detection and replacement', () => {
    test('should detect w_XXX pattern in URL', () => {
      const url = 'https://example.com/image/fetch/w_424/image.png';
      expect(plugin.containsWidthParam(url)).toBe(true);
    });

    test('should detect width=XXX pattern in URL', () => {
      const url = 'https://example.com/image?width=300&quality=high';
      expect(plugin.containsWidthParam(url)).toBe(true);
    });

    test('should detect w=XXX pattern in URL', () => {
      const url = 'https://example.com/image?w=500';
      expect(plugin.containsWidthParam(url)).toBe(true);
    });

    test('should not detect width in non-parameter text', () => {
      const url = 'https://example.com/my-wide-image.jpg';
      expect(plugin.containsWidthParam(url)).toBe(false);
    });

    test('should replace w_XXX pattern in URL', () => {
      const input = 'https://example.com/image/fetch/w_424/image.png';
      const expected = 'https://example.com/image/fetch/w_150/image.png';
      expect(plugin.replaceUrlWidthParam(input)).toBe(expected);
    });

    test('should replace width=XXX pattern in URL', () => {
      const input = 'https://example.com/image?width=300&quality=high';
      const expected = 'https://example.com/image?width=150&quality=high';
      expect(plugin.replaceUrlWidthParam(input)).toBe(expected);
    });

    test('should replace w=XXX pattern in URL', () => {
      const input = 'https://example.com/image?w=500';
      const expected = 'https://example.com/image?w=150';
      expect(plugin.replaceUrlWidthParam(input)).toBe(expected);
    });

    test('should handle Substack CDN URL with w_XXX', () => {
      const input = 'https://substackcdn.com/image/fetch/$s_!_APX!,w_424,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fbb3d5266-b65a-45ea-9f8f-98d7d8038b8e_3432x1536.png';
      const expected = 'https://substackcdn.com/image/fetch/$s_!_APX!,w_150,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fbb3d5266-b65a-45ea-9f8f-98d7d8038b8e_3432x1536.png';
      expect(plugin.replaceUrlWidthParam(input)).toBe(expected);
    });

    test('should resize markdown image with URL width parameter when enabled', () => {
      plugin.settings.resizeUrlWidthParams = true;
      const input = '![](https://example.com/image/fetch/w_424/image.png)';
      const expected = '![|150](https://example.com/image/fetch/w_150/image.png)';
      expect(plugin.resizeImagesInContent(input)).toBe(expected);
    });

    test('should resize markdown image with Substack CDN URL', () => {
      plugin.settings.resizeUrlWidthParams = true;
      const input = '![](https://substackcdn.com/image/fetch/$s_!_APX!,w_424,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fbb3d5266-b65a-45ea-9f8f-98d7d8038b8e_3432x1536.png)';
      const expected = '![|150](https://substackcdn.com/image/fetch/$s_!_APX!,w_150,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fbb3d5266-b65a-45ea-9f8f-98d7d8038b8e_3432x1536.png)';
      expect(plugin.resizeImagesInContent(input)).toBe(expected);
    });

    test('should not resize URL width parameters when disabled', () => {
      plugin.settings.resizeUrlWidthParams = false;
      const input = '![](https://example.com/image/fetch/w_424/image.png)';
      const expected = '![|150](https://example.com/image/fetch/w_424/image.png)';
      expect(plugin.resizeImagesInContent(input)).toBe(expected);
    });

    test('should handle markdown images with alt text and URL width params', () => {
      plugin.settings.resizeUrlWidthParams = true;
      const input = '![My image](https://example.com/image?width=300&quality=high.jpg)';
      const expected = '![My image|150](https://example.com/image?width=150&quality=high.jpg)';
      expect(plugin.resizeImagesInContent(input)).toBe(expected);
    });

    test('should handle multiple images with different URL width patterns', () => {
      plugin.settings.resizeUrlWidthParams = true;
      const input = '![img1](https://example.com/w_200/image1.jpg) and ![img2](https://example.com/image2.png?width=400)';
      const expected = '![img1|150](https://example.com/w_150/image1.jpg) and ![img2|150](https://example.com/image2.png?width=150)';
      expect(plugin.resizeImagesInContent(input)).toBe(expected);
    });

    test('should use custom width for URL parameters', () => {
      plugin.settings.imageWidth = 300;
      plugin.settings.resizeUrlWidthParams = true;
      const input = '![](https://example.com/image/w_500/test.jpg)';
      const expected = '![|300](https://example.com/image/w_300/test.jpg)';
      expect(plugin.resizeImagesInContent(input)).toBe(expected);
    });
  });

  describe('Full URL image links', () => {
    test('should handle markdown image with full URL', () => {
      const input = '![](https://karpathy.github.io/assets/rnn/diags.jpeg)';
      const expected = '![|150](https://karpathy.github.io/assets/rnn/diags.jpeg)';
      expect(plugin.resizeImagesInContent(input)).toBe(expected);
    });

    test('should handle wiki-style image with full URL', () => {
      const input = '![[https://cdn.example.com/photos/sunset.jpg]]';
      const expected = '![[https://cdn.example.com/photos/sunset.jpg|150]]';
      expect(plugin.resizeImagesInContent(input)).toBe(expected);
    });

    test('should handle wiki-style image with URL-encoded URL', () => {
      const input = '![[https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7dd8fbed-8264-420f-8c9a-e1a46c2d0029_1666x1701.png]]';
      const expected = '![[https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7dd8fbed-8264-420f-8c9a-e1a46c2d0029_1666x1701.png|150]]';
      expect(plugin.resizeImagesInContent(input)).toBe(expected);
    });

    test('should handle wiki-style image with URL and spaces in filename', () => {
      const input = '![[https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7dd8fbed-8264-420f-8c9a-e1a46c2d0029_1666x1701 1.png]]';
      const expected = '![[https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7dd8fbed-8264-420f-8c9a-e1a46c2d0029_1666x1701 1.png|150]]';
      expect(plugin.resizeImagesInContent(input)).toBe(expected);
    });

    test('should handle multiple markdown images with full URLs', () => {
      const input = '![](https://example.com/image1.jpg) text ![](https://example.com/image2.png)';
      const expected = '![|150](https://example.com/image1.jpg) text ![|150](https://example.com/image2.png)';
      expect(plugin.resizeImagesInContent(input)).toBe(expected);
    });
  });
});
