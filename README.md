# fatihlovestosimplify

youtube'da yayınladığım videoların örnek kodları: [fatih loves to simplify](https://www.youtube.com/@fatihlovestosimplify)

## motion canvas

```sh
npm install
npm start
```

Her video kendi klasöründeki `project.ts` dosyasıyla otomatik bulunur. Yeni bir video
klasörü ekledikten sonra editörü yeniden başlatmak yeterli; Vite config'e yol eklemek gerekmez.

Editörde **custom export** seçildiğinde MP4, video klasörünün yolunu `output/` altında izler:

```text
ddia/01/operational-vs-analytical-systems/project.ts
→ output/ddia/01/operational-vs-analytical-systems.mp4

başka-seri/02/video-adı/project.ts
→ output/başka-seri/02/video-adı.mp4
```

Dosya adı video klasöründen gelir. Geçici parçalar her video için ayrı tutulur;
Shorts projelerinde `.production/`, diğer projelerde `output/.segments/` kullanılır.
Ses, projenin `audio` alanından alınır; sessiz projeler de desteklenir.
Custom export projenin çözünürlüğünü kullanır ve 60 FPS gerektirir. Yatay videolar
1920×1080, dikey Shorts projeleri 1080×1920 olarak hazırlanmıştır.

Komut satırından aynı export:

```sh
node rendering/render.mjs --project ddia/01/operational-vs-analytical-systems/project.ts
```

Tek proje varsa `--project` atlanabilir. `RENDER_OUTPUT_DIR` verilirse `output/` yerine
bu kök klasör kullanılır; alt klasör yapısı korunur.
