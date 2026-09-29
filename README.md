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

Dosya adı video klasöründen gelir. Geçici parçalar `output/.segments/` altında her video
için ayrı tutulur. Ses, projenin `audio` alanından alınır; sessiz projeler de desteklenir.
Custom export mevcut haliyle tam videoyu 1920×1080, 60 FPS olarak üretir.

Komut satırından aynı export:

```sh
node rendering/render.mjs --project ddia/01/operational-vs-analytical-systems/project.ts
```

Tek proje varsa `--project` atlanabilir. `RENDER_OUTPUT_DIR` verilirse `output/` yerine
bu kök klasör kullanılır; alt klasör yapısı korunur.
