# 08-lifetime — seslendirme ve hareket

Çalışma metni; başlıklar seslendirilmeyecek. Süre hedefi 176 saniye. Normal işleyiş, yayımlanmış ömür hatası açıklaması ve kısıtlı ilk kazanım ayrı kalır.

## start-work → continue-while-pending

Az önce başlattığımız okuma işi bu. Data’nın gelmesi zaman alabilir. Program, o sırada başka iş yapmaya devam edebilir. Başlatma ile tamamlanmanın ayrıldığı bu yol, asynchronous I/O; kısaca AIO.

Hareket: 07’deki gerçek iş kutusu ve adı, read A kaydına taşınır. Yeni bir kutuyla değiştirilmez.

## need-result → name-records

Program sonuca ihtiyaç duyunca beklemeye geçiyor. Kernel, işi takip eden request’in yanında, bu bekleyişi de ayrı bir kayıtla tutuyor. Bunun adı waiter. Aralarındaki bağlantı, hangi işin hangi bekleyişle ilişkili olduğunu gösteriyor.

## normal-completion → normal-cleanup → normal-free

iş bitiyor, request’in tamamlanan I/O sonucu programa dönüyor. waiter bu data’yı üretmiyor; bekleyişi takip ediyor. bekleme bağlantısı kaldırılıyor. bu kayıt artık kullanılmayacağı için belleği de serbest bırakılabiliyor. alan ortadan kaybolmadı; oradaki kaydın ömrü bitti.

## shared-waiter → first-owner

Şimdi iki yeni işi birlikte bekleyelim. İki request var, bekleyiş ise ortak: tek waiter kullanılıyor. Önce A bağlanıyor. Waiter’ın owner alanı, cleanup’ın hangi request’i takip edeceğini tutuyor. Bu alan şimdilik A’yı gösteriyor.

## owner-changes → multi-wait-name

B de aynı waiter’a bağlanıyor. Fakat tek owner alanı var; artık B’yi gösteriyor. A’nın bağlantısı silinmedi. Böylece iki request aynı waiter’a bakarken, cleanup’ın takip edeceği alan yalnız B’yi hatırlıyor. Bu çoklu bekleme yolu aio_multi_wait.

## cleanup-follows-owner → wrong-cleanup → stale-reference

Cleanup, owner alanındaki B’yi izliyor. B’nin bağlantısını kaldırıyor ve waiter’ın alanı serbest bırakılıyor. Ama A hâlâ aynı adrese bakıyor. Hata bu: kayıt artık geçerli değilken onu kullanacak pointer duruyor.

Hareket: Alan serbest kaldığı anda A'nın bağlantısı eski waiter pointer’ı diye etiketlenir. Eski bağlantının varlığı yalnız turuncu renkle anlatılmaz; karşısındaki aynı alan artık serbesttir.

## same-kernel-operation

Bu cleanup yolunun kullanacağı sabit işlemi de görelim: kayıttan izlenen pointer’ın hedefindeki bir değeri azaltmak. Yeni bir komut yazmıyoruz; bir azaltma işleminin hangi data’ya uygulanacağını değiştireceğiz.

Hareket: `*pointer -= 1` sabit kalır. Bu, kapalı kernel’deki alan adlarını birebir çizen bir disassembly değil; yayımlanmış azaltma etkisinin sadeleştirilmiş gösterimidir.

## reuse-slot → use-after-free

Program, hazırladığı data’yı syscall ile verip yeni kayıt istiyor. Kernel bu kayıt için serbest alanı yeniden kullanırsa, A’nın eski pointer’ı yeni içeriğe ulaşır. Use-after-free bu. Programın kernel adresine doğrudan yazması gerekmiyor.

Hareket: request data programdan normal syscall yoluna çıkar. yeni kayıt önce kernel allocation tarafında oluşur, sonra serbest alana yerleşir. içeride şimdilik yalnız `target pointer` görünür; K ve onun data’sı, kernel’in bu pointer’ı izlediği adımda açılır.

## relative-timing → timing-varies

Burada olayların sırası önemli. Eski pointer, yeni kayıt yerleşmeden kullanılırsa hazırladığımız içerikle karşılaşmaz. Sırayı ters çevirelim: yeni kayıt aynı alana önce yerleşir, eski erişim sonra gelir. Bu kez eski pointer yeni içeriğe ulaşır. Yarış koşulu bu sırayı yakalamakla ilgili. Pointer’ın serbest alanda kalması ise az önce gördüğümüz ayrı hata.

Hareket: İki olayın kutuları ve sıralama oku, yerleşim sırasını taşır. Altta açıklama cümlesi gösterilmez; sonuç ilişkisi seslendirmede kalır.

## follow-reused-pointer → follow-target-pointer

Uygun yeniden kullanımda aynı eski pointer’ı izliyoruz. Kernel eski kaydı kullandığını düşünüyor, ama hedef pointer’ını bizim yerleştirdiğimiz içerikten alıyor. Bu pointer da K adresindeki değeri seçiyor.

## limited-decrease → primitive-name

Değişmeyen azaltma işlemi bu kez K’deki yediye uygulanıyor; altı oluyor. Bu, istediğimiz değeri yazmak ya da okumak değil. Elimizde, seçilen bir kernel değerini azaltan kısıtlı bir temel işlem var: decrement primitive.

## small-change-next

Peki yalnız bir değeri azaltmakla ne yapılabilir? Eğer o değer başka bir işlemin kullandığı izin veya adres bilgisiyse, küçük değişiklik o işlemin davranışını değiştirebilir. Şimdi bu bağlantıyı kuracağız.

## Kaynak ve kapsam

- Request/waiter/owner açıklaması [araştırma notundaki 8.2–8.3](../../../plans/ps5-jailbreak/research.md) ve orada belirtilen yayımlanmış disassembly analizine dayanır; bağımsız PS5 binary doğrulaması yoktur.
- Kontrollü yeni kayıt, reclaim ve cancel akışı: [sabit kaynak](https://github.com/ntfargo/Relapse-Exploit/blob/dd8e4e0914c5e9d066ee1f9b056be76cb992c8e0/src/relapse_exploit.js).
- `*pointer -= 1` ve 7→6 sadeleştirilmiş etki modelidir. Normal bir waiter’ın belirli bir iç counter alanının adını veya kesin layout’unu iddia etmez. Ömür hatası ile uygun yeniden kullanım zamanlaması ayrı gösterilir.

Hareket notu: zamanlama karşılaştırması ayrı, tam boy bir aşamadır. Owner grafiği arkasında soluk halde tutulmaz. Aynı adresin içeriği yeniden gösterildiğinde önceki konumu ve boyutu korunur; devam sahnesine taşınan decrementPose değişmez.
