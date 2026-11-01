# DDIA #01 · Shorts

İlk dikey kurgular. Her klasör bağımsız bir Motion Canvas projesidir: 1080×1920, 60 FPS, kendi ses kurgusu ve timeline’ı.

| Klasör                  | Proje adı                                       | Süre    |
| ----------------------- | ----------------------------------------------- | ------- |
| `batch-stream`          | aynı olaylar. uyarı neden yarın geliyor?        | 74.2 sn |
| `cache-freshness`       | cache’teki cevap artık güncel değil.            | 45.5 sn |
| `cache-invalidation`    | sipariş yola çıktı. cache’in haberi yok.        | 41.6 sn |
| `etl-elt`               | harflerin yeri değişti. işlem nerede yapılıyor? | 98.6 sn |
| `freshness-response`    | hızlı geldi ama güncel mi?                      | 56.8 sn |
| `htap`                  | iki farklı iş. tek sistemde olur mu?            | 91.1 sn |
| `materialized-view`     | her seferinde toplamasak?                       | 60.2 sn |
| `model-serving`         | modeli eğittik. müşteriye nasıl ulaşacak?       | 41.8 sn |
| `operational-analytics` | aynı data, iki farklı soru.                     | 68.3 sn |
| `pipeline-freshness`    | sorgu doğru. sonuç hâlâ eski.                   | 79.0 sn |
| `preserve-events`       | toplamı tuttuk. ayrıntılar nereye gitti?        | 99.7 sn |
| `reverse-etl`           | uyarıyı ürettik. ekip nereden görecek?          | 42.9 sn |
| `schema-on-read`        | data lake’e attık. schema’dan kurtulduk mu?     | 77.6 sn |
| `shared-resources`      | bir rapor siparişi neden yavaşlatıyor?          | 66.6 sn |
| `stateless-requests`    | sunucu değişti. sipariş hâlâ burada.            | 40.5 sn |
| `system-of-record`      | aynı satış, iki farklı tutar.                   | 44.3 sn |

`npm start` ile editörü açıp proje seçicisinden ilgili `project.ts` dosyasını seçebilirsin.

Örnek tam render:

```sh
node rendering/render.mjs --project ddia/01/operational-vs-analytical-systems/shorts/cache-invalidation/project.ts
```

MP4’ler `output/ddia/01/operational-vs-analytical-systems/shorts/` altına yazılır. Ara render dosyaları gitignore kapsamındaki `.production/` içinde kalır.

Sesler ana videonun `audio/edited/sXX.wav` kayıtlarındaki tamamlanmış cümlelerden kurgulandı. Her Short kendi final WAV ve önizleme MP3 dosyasını taşır. Ses kesim tarifleri, transkriptler ve cue eşlemeleri `.production/ddia/01/shorts/<klasör>/` altında bulunur.

Görsel dil ana videodan gelir; sahneler dikey yerleşim için yeniden kurulmuştur. Ortak çizimler `shorts/shared/`, ana videonun tekrar kullanılan çizimleri `scenes/` altındadır.
