let canvas;
let context;

self.onmessage = async ({ data: { id, bitmap } }) => {
  try {
    if (!canvas || canvas.width !== bitmap.width || canvas.height !== bitmap.height) {
      canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
      context = canvas.getContext('2d', { alpha: true, colorSpace: 'srgb' });
      if (!context) throw new Error('OffscreenCanvas 2D is unavailable.');
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0);
    const blob = await canvas.convertToBlob({ type: 'image/png' });
    const reader = new self.FileReaderSync();
    const png = reader.readAsDataURL(blob).split(',')[1];
    self.postMessage({ id, png });
  } catch (error) {
    self.postMessage({ id, error: String(error) });
  } finally {
    bitmap.close();
  }
};
