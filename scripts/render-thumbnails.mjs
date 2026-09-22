import {readdir, writeFile} from 'node:fs/promises';
import {once} from 'node:events';
import {basename, join, relative, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
import {createServer} from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const excluded = new Set(['node_modules', '.git', 'dist', 'output', 'plans']);

async function findThumbnails(directory) {
  const files = [];
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    const path = join(directory, entry.name);
    if (entry.isDirectory() && !excluded.has(entry.name)) {
      files.push(...await findThumbnails(path));
    } else if (entry.isFile() && basename(directory) === 'thumbnail' && entry.name.endsWith('.html')) {
      files.push(path);
    }
  }
  return files.sort();
}

async function render(browser, origin, html) {
  const page = await browser.newPage({
    viewport: {width: 3840, height: 2160},
    deviceScaleFactor: 1,
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
  page.on('response', response => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });

  try {
    const path = relative(root, html).split(sep).map(encodeURIComponent).join('/');
    await page.goto(`${origin}/${path}`, {waitUntil: 'load'});
    await page.evaluate(async () => {
      let timeout;
      try {
        await Promise.race([
          (async () => {
            await window.thumbnailReady;
            await document.fonts.ready;
            for (const font of document.fonts) {
              if (font.status === 'error') throw new Error(`Font failed to load: ${font.family}`);
            }
            await Promise.all([...document.images].map(async image => {
              try {
                await image.decode();
              } catch {
                throw new Error(`Image failed to load: ${image.currentSrc || image.src}`);
              }
            }));
          })(),
          new Promise((_, reject) => {
            timeout = setTimeout(() => reject(new Error('Thumbnail was not ready within 30 seconds.')), 30_000);
          }),
        ]);
      } finally {
        clearTimeout(timeout);
      }
    });
    if (errors.length) throw new Error(errors.join('\n'));
    const png = await page.screenshot({type: 'png', scale: 'css', animations: 'disabled'});
    if (errors.length) throw new Error(errors.join('\n'));
    const output = html.replace(/\.html$/, '.png');
    await writeFile(output, png);
    console.log(relative(root, output));
  } catch (error) {
    throw new Error(`${relative(root, html)}: ${error.message}`, {cause: error});
  } finally {
    await page.close();
  }
}

async function main() {
  const files = await findThumbnails(root);
  if (!files.length) {
    console.log('No thumbnail/*.html files found.');
    return;
  }
  const server = await createServer({
    root,
    configFile: false,
    appType: 'mpa',
    logLevel: 'error',
    optimizeDeps: {noDiscovery: true, include: []},
    server: {host: '127.0.0.1', port: 0, watch: null, hmr: false},
  });
  let browser;
  try {
    // Vite 5's listen() replaces port 0; the HTTP listener preserves ephemeral ports.
    const listening = once(server.httpServer, 'listening');
    server.httpServer.listen(0, '127.0.0.1');
    await listening;
    const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
    browser = await chromium.launch();
    for (const html of files) await render(browser, origin, html);
  } finally {
    await Promise.all([browser?.close(), server.close()]);
  }
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
