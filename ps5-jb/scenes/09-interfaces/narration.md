# 09-interfaces — seslendirme ve hareket

Çalışma metni; başlıklar seslendirilmeyecek. Süre hedefi 327 saniye. Önce bir arayüzün normal işi, sonra etkilediğimiz metadata ve o değişikliğin sonucu gösterilir. Hex alanlar sabit kaynağa dayanır; CPU sayısı, ayar değerleri ve harfli adresler örnektir.

## carry-decrement → named-information

Elimizde seçilen bir kernel değerini azaltan işlem var. Bu işlem tek başına data okuyamıyor. Ama kernel’in normalde kullandığı bir kaydı değiştirebilirsek, o kaydı izleyen mevcut işlem de başka davranabilir. Önce normal bir sistem bilgisi sorgusuna bakalım.

## normal-read → name-interface

Program CPU sayısını soruyor. Kernel, bu bilgiye ait kaydı bulup oradaki data pointer’ını izliyor. Örnekte sayı dört; yanıt olarak geri geliyor. Bu arayüzün adı sysctl. Türü, izni ve data pointer’ını tutan kayda OID deniyor.

## allowed-setting → normal-setting-write

Şimdi ayrı bir ayar kaydı. Bunun yazma izni var. Otuz bir yazınca, pointer’ın gösterdiği ayar otuz bir oluyor. CPU bilgisine yazma izni vermedik; yazmaya zaten izin veren başka bir normal kullanım gördük.

## write-rejected

Relapse’in etkileyeceği kayıtta ise yazma isteği reddediliyor. Dokuzu göndermek yetmiyor; kendi data’sı sekiz kalıyor. Önce bu kaydın yazma yolunu açmalıyız. Değiştireceğimiz alan, tür ve izin bitlerini birlikte tutuyor.

## metadata-change → metadata-interpreted

Şimdi yalnız o alana bakalım. Buradaki dört hücre, type ve flags değerinin byte’ları. Azaltmayı yüksek byte’a tekrar tekrar uygulayınca seksen hex, yetmiş hex oluyor. Diğer üç byte değişmedi. Bu sürümde kullanılan yeni düzen, kaydın yazma isteğini kabul etmesini sağlıyor.

Hareket: Normal OID grafiği kapanır. Dört byte, 03'teki gibi düşük adresten yüksek adrese soldan sağa gösterilir: 02 80 04 80. Byte index'leri görünürdür; −1 sağdaki byte[3]'ü etkiler ve 02 80 04 70 olur. Eski yazma kapalı etiketi değişiklik başlamadan çekilir; yeni anlam metadata-interpreted ile açılır. İkinci OID'de de reset ve değişiklik boyunca eski izin sonucu gösterilmez. Sayısal geçiş 0x80048002 → 0x70048002’dir; bu, bütün sistemlerde geçerli bir izin kuralı değildir.

## own-data-write → need-other-destination

Aynı dokuzu tekrar yazalım. Bu kez istek kabul ediliyor ve kendi data’sı dokuz oluyor. Fakat erişim hâlâ bu tek yere gidiyor. Başka bir hedef seçebilmek için, izinden ayrı olarak data pointer’ını da etkilemeliyiz.

## point-to-pointer

İki sysctl kaydı kullanalım. Şimdilik ilk kayıt kendi data’sına gidiyor. İkinci kaydın data pointer’ı da bellekte bir alanda duruyor. O alanın adresi burada EE58 ile bitiyor. İlk kaydı bu alana yöneltebilirsek, ilk sysctl ile yazdığımız değer ikinci kaydın hedefini belirleyecek.

Hareket: İki kart ilk OID ve ikinci OID diye adlandırılır. Sysctl, bu kayıtları kullanan çağrıdır; iki ayrı API kutusu gösterilmez. Aynı data pointer field’ları, adres seçimi ve data taşıma boyunca yerlerinde kalır.

Kurgu: Üstte hedef veya işlem talimatı yazılmaz. Aktarımın hangi OID'ye gittiği hareket eden adres/değer, aynı pointer field’ı ve mevcut bağlantılar üzerinden gösterilir; sonuç etiketi ilgili okumanın sonucunu belirtir.

## target-metadata-effect → target-interpreted

İlk pointer’ın ilgili byte’ını bir azaltıyoruz. Son kısım EF58’den EE58’e geçiyor: adres 0x100 geri kaydı. Bu sürümde orası ikinci kaydın pointer field’ı. İlk bağlantı artık data’ya değil, bu alanın kendisine gidiyor. İkinci pointer’ın tuttuğu adres henüz değişmedi.

Hareket: Yalnız adreslere ilişkin iki alan açık kalır. EF − 1 = EE işlemi byte[1]'e bağlıdır; adres farkı −256 byte ayrıca görünür. İlk bağlantı, önceden gösterilen EE58 alanına döner. Byte işlemi ile yeni hedef ayrı adımlardır; pointer sıradan bir data değerine dönüşmez.

## prepare-second-readability

İkinci kaydı sorgulayabilmemiz gerekiyor. Aynı decrement işlemi, bu kez onun visible alanını değiştiriyor. Bundan sonra kayıt sorgulanabilir oluyor. Bu alanın değişmesi, data pointer’ını veya yazma iznini değiştirmiyor.

Hareket: ikinci OID’ye bağlı küçük `visible` alanı açık kalır. −1 bu alana uygulanır; ancak sonra `hidden`, `queryable` olur. başlangıç sayısı, bit maskesi veya Sony kernel’indeki C alan adı çizilmez.

## select-address

Şimdi ilk sysctl ile K adresini yazıyoruz. İlk kaydın hedefi ikinci pointer’ın alanı olduğu için, değişen şey ikinci pointer. Artık K’yi tutuyor. Burada adresi seçtik; K’deki data’yı henüz okumadık.

## second-oid-read

İkinci sysctl ile okuduğumuzda, onun K’yi gösteren pointer’ı izleniyor. K’deki kırk iki geri geliyor. İlk sysctl adresi seçti; ikinci sysctl o adresteki data’yı taşıdı. K adresi ve kırk iki değeri ayrı kaldı.

## second-oid-write

İkinci kaydın tür ve izin alanı da yazma için hazırlanıyor. Aynı yüksek byte değişimini burada görüyoruz. Sonra ikinci sysctl ile kırk üç yazıyoruz. Bu kez değişen şey K’deki data. Azaltma yalnız metadata’yı hazırladı; data aktarımını mevcut sysctl işlemi yaptı.

## need-reusable-io

Böylece ilk kernel memory read/write kazanıldı. Sonraki işleri daha kullanışlı read ve write çağrılarıyla sürdürebilmek için bu erişimi pipe’lara taşıyacağız. Pipe burada yeni bir açık değil; zaten kazandığımız erişimle hazırlanacak başka bir arayüz.

## normal-pipe → normal-pipe-read

Önce normal pipe. Write end’e A, B, C byte’larını veriyoruz. Kernel bunları buffer’da tutuyor. Read end’den isteyince aynı byte’lar geri geliyor. Henüz başka bir belleğe bakmıyoruz; yalnız pipe’ın kendi buffer’ını kullanıyoruz.

## normal-buffer-pointer → assign-pipe-descriptors

Pipe’ın metadata’sındaki buffer pointer’ı, bu byte alanının adresini tutuyor. Açık uçları kullanmak için programın elinde file descriptor’lar, kısaca fd’ler var. Burada üç write end’i, dört read end’i seçiyor. Bu numaralar adres değil; açık bir kaynak seçiyorlar.

Hareket: 3 ve 4, karşılık geldikleri uçların içinde görünür. fd’nin tanımı seslendirmede kalır.

## find-process → match-process-id

Bu pointer’ı değiştirebilmek için önce pipe’ın kernel’deki yapısını bulmalıyız. Zaten kazandığımız kernel memory read ile process listesine bakıyoruz. Kendi PID’miz P. Bu bilgiyi kullanarak kendi kaydımızı seçiyoruz.

Hareket: Process listesi, seçilen PID, fd tablosu ve pipe kartı kendi etiketleriyle açılır. Üstte yapılacak işi söyleyen cümle gösterilmez.

## select-descriptor → follow-pipe-record

Buradan kendi fd tablomuzu buluyoruz. Dört numaralı kayıt read end’i seçiyordu. O kayıt üzerinden pipe’ın kernel metadata’sına ulaşıyoruz. Artık programdaki numara ile değiştireceğimiz pointer field’ı arasındaki yolu biliyoruz.

## working-arrangement → second-working-pipe

fd tablosundan ulaştığımız aynı pipe’ın buffer pointer’ı burada kalsın. onu değiştirecek ikinci bir pipe hazırlayacağız. kernel memory read/write zaten elimizde; bu alanları bulup hazırlamayı o erişimle yapıyoruz.

Hareket: lookup’ın ulaştığı pipe metadata kartı yer değiştirir; yeni bir ilk pipe kartıyla değiştirilmez. fd araması kapanınca yalnız aynı pointer ve ardından ikinci pipe açılır.

Kurgu: Üstte açıklama veya işlem talimatı açılmaz; pointer field’ları ve aralarındaki bağlantı önceden görünürdür. Adresin ve data'nın hangi pipe üzerinden taşındığı kendi hareketleriyle gösterilir.

## prepare-control-pipe

İkinci pipe’ın buffer pointer’ını, ilk pipe’ın pointer field’ın adresi olan M’ye ayarlıyoruz. Böylece ikinci pipe’a yazdığımız byte’lar ilk pipe’ın buffer pointer’ını değiştirecek. Bu yüzden birine control pipe, diğerine data pipe diyoruz.

Hareket: `memory write: M` paketi ikinci pipe’ın buffer pointer field’ına ulaşır; field ancak sonra `adres M` olur ve ilk pipe’a bağlantı çizilir. Bu hazırlık, daha önce kazanılan kernel memory write’ı kullanır. Normal pipe API’sinin pointer seçebildiği izlenimi verilmez.

## pipe-selects-address

Control pipe’a K adresini yazıyoruz. K adresi, M’deki pointer field’a yazılıyor. Data pipe’ın buffer pointer’ı artık K. Kontrol yolu adresi seçti; K’deki data hâlâ kırk üç.

## pipe-carries-data → pipe-writes-data

Şimdi data pipe’tan okuyoruz: K’deki kırk üç geliyor. Aynı pipe’a kırk dört yazınca da K’deki değer değişiyor. Control pipe adresi, data pipe o adreste taşınacak byte’ları belirliyor. Bunu sağlayan metadata’yı, önceden kazanılan kernel erişimiyle hazırladık.

## kernel-window

Artık kullanıcı tarafındaki kod, bu düzenek üzerinden kernel data’sını okuyup yazabiliyor. Kodumuz hâlâ kullanıcı tarafında. Sonraki adımda, kernel’deki hangi kararların data’sını değiştirebildiğimize bakacağız.

## Kaynak ve kapsam

- Metadata geçişi: [13.60 sabit tablosu](https://github.com/ntfargo/Relapse-Exploit/blob/dd8e4e0914c5e9d066ee1f9b056be76cb992c8e0/offsets/13.60.js#L395-L435). `originalKind=0x80048002`, `writableKind=0x70048002`; A normal arg1 hedefi `…028cef58`, B arg1 alanı `…028cee58`. Yüksek adres kısmı kernel tabanıyla birlikte gelir. Ekranda yalnız son bölüm gösterilir.
- A pointer byte[1] azaltması −0x100 adres farkını açıklar; bir pointer’ın rastgele hedefe tek azaltmayla atanabildiği söylenmez.
- Görünürlük, tür/izin ve pointer field’ları ayrıdır. Sabit kaynaktaki `steerOidWindow()`, reclaim hedeflerine `a.arg1Byte1` ile `b.visible` alanlarını verir ve cancel ile bu decrement etkisini tetikler; `testKernelRead()` ikinci OID’nin sorgulanabildiğini kontrol eder. `visible` sayısal başlangıcı, bit maskesi veya Sony C üye adı iddia edilmez. İlk memory read/write’ın düşük/yüksek adres parçaları ve kaynak kontrolleri bu kavramsal çizimde ayrıntılandırılmaz.
- [Sysctl ve pipe dönüşümü](https://github.com/ntfargo/Relapse-Exploit/blob/dd8e4e0914c5e9d066ee1f9b056be76cb992c8e0/src/relapse_exploit.js). Pipe tekniği bağımsız bir açık değildir. Buffer sayacı gibi burada genişletilmeyen alanlar çizilmez.
- Önceki aşama küçültülüp bir köşede tutulmaz. Metadata byte’ları, iki OID’nin pointer ilişkisi, normal pipe akışı, fd araması ve iki pipe’ın rolü ayrı sahne aşamalarıdır. Aynı anda birden çok return ve data yolu vurgulanmaz.

Terim notu: Ekrandaki permission etiketleri read/write; pipe uçları write end/read end; pointer field’ın adı pointer field; okuma sonucu read: değer olarak yazılır. Teknik terimler için yapay Türkçe karşılık üretilmez.
