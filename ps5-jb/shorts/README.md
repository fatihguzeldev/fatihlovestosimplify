# PS5 ReLapse Shorts

Her klasör, kendi ses kurgusu ve timeline’ı olan bağımsız bir Motion Canvas projesidir. Sahneler 1080×1920, 60 FPS dikey kadraj için yeniden kurulmuştur.

| Klasör                | Proje adı                                       | Süre     |
| --------------------- | ----------------------------------------------- | -------- |
| `shared-references`   | birini değiştirdim, ikisi de değişti.           | 47.6 sn  |
| `reference-width`     | 2 byte yazdılar, 4 byte okudular.               | 129.9 sn |
| `negative-index`      | negatif index’i unutmuşlar.                     | 67.6 sn  |
| `pointer-retarget`    | index aynı, okuduğumuz yer değişti.             | 119.9 sn |
| `process-memory`      | tarayıcıyı kırınca bütün ps5 senin olmuyor.     | 61.7 sn  |
| `rop`                 | yeni kod çalıştıramayınca eskisini kullandılar. | 129.7 sn |
| `use-after-free`      | free ettik ama pointer hâlâ oraya bakıyor.      | 140.1 sn |
| `root-user-mode`      | root olduk. hâlâ user mode’dayız.               | 72.7 sn  |
| `filesystem-root`     | root’sun ama dosyaya ulaşamıyorsun.             | 48.9 sn  |
| `elf-loading`         | programı ram’e koymak yetmiyor.                 | 53.6 sn  |
| `exploit-chain`       | bir internet sitesi ps5’i nasıl kırabiliyor?    | 42.1 sn  |
| `decrement-primitive` | bütün yapabildiğimiz bir sayıyı 1 azaltmaktı.   | 101.4 sn |
| `control-data-pipes`  | biri adresi seçiyor, diğeri data’yı taşıyor.    | 93.0 sn  |

`npm start` ile editörü açıp proje seçicisinden ilgili `project.ts` dosyasını seçebilirsin. Yeni projeler editör başlatılırken otomatik bulunur.

Örnek render:

```sh
node rendering/render.mjs --project ps5-jb/shorts/exploit-chain/project.ts
```

Final videolar `output/ps5-jb/shorts/<klasör>.mp4` yoluna yazılır. Render cache’i, ses kesim tarifleri, transkript eşlemeleri ve kontrol çıktıları gitignore kapsamındaki `.production/ps5-jb/shorts/<klasör>/` içinde kalır.

Her projenin `audio/edited/main.wav` dosyası final ses kurgusudur. `narration.flac`, export için kullanılan lossless kopyadır; `narration.mp3` editör önizlemesinde kullanılır. Kayıtlar ana videonun final sahne seslerinden seçilmiştir.

Ortak dikey çizimler `shared/portrait.ts` içinde. Renkler, fontlar ve tekrar kullanılan çizimler ana videodan gelir.
