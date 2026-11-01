# 06-memory — ses ve hareket

05'in tam boy bitiş pozu ile başlanır. F, hazırlanmış sahte view kaydının adresidir; gerçek view referansı bu içerikte zaten durur. Aynı kutular ve aynı bağlantılar kullanılır. Yeni bir object listesi hatırlatması veya küçültülmüş bağlam eklenmez. Başlıklar ve kurgu notları okunmaz; ekrana konuşma cümleleri yazılmaz.

A ve B, iki ayrı buffer'ın data başlangıcını temsil eder. Dört hücre ve 24/8/9 sayıları açıklama örneğidir; gerçek payload veya native layout iddiası değildir. `write bytes(B)` sahte view üzerinde şematik bir yazma işlemidir; çalıştırılabilir JavaScript satırı değildir. Uygulamada B adresinin byte'ları ayrı eleman yazmalarıyla gerçek view'ın data pointer alanına yazılır. Bir Uint8Array elemanına tek işlemde koca bir adres yazıldığı izlenimi verilmez. Bu alanın exact offset'i gösterilmez.

## known-target — 2–13

Kaldığımız yerdeyiz. F biliniyor, sahte view hazır. Ama gerçek view hâlâ eski buffer'ı gösteriyor. View sıfır, yine yirmi dört. Şimdi bu bağlantıyı neyin değiştirdiğine bakalım.

## wrong-reference — 13–25

Liste dışından gelen yanlış referans F'yi gösteriyor. Motor böylece hazırladığımız aynı kayda ulaşıyor. Yeni bir object yaratmıyoruz; hazırladığımız byte'ların nasıl yorumlandığı değişiyor.

Kurgu: Var olan kesik referans çizgisi kesintisiz hale gelir. Silinip baştan çizilmez. F ve sahte view aynı yerlerinde kalır.

## interpret-as-record — 25–39

Hazırladığımız başlık, TypedArray bilgisi sanılıyor. İçeride tuttuğumuz gerçek view referansı da sahte view'ın data bağlantısı gibi kullanılıyor. Bu yüzden sahte view üzerinden erişim, gerçek view'ın metadata'sına gidiyor.

Kurgu: Aynı kaydın type, length ve data alanları belirginleşir. Mevcut bağlantı korunur; gerçek view'ın data pointer satırı çerçevelenir. Henüz A'daki byte'lar değişmez.

## first-access — 39–55

İkinci buffer'ın data başlangıcına B diyelim. Yazmak istediğimiz, bu adresin byte'ları. Soldaki sahte view üzerinden yapılan yazmanın hedefi, çerçevelenen metadata alanı. B'nin içinde duran sekiz sayısını yazmıyoruz; B adresini oluşturan byte'ları hazırlıyoruz.

Kurgu: Çözülmüş F/referans yolu bu aşamada kapanır. Buffer B, başlangıcına bağlı adres B etiketiyle açılır. Sahte view'ın altında B adresinin 8 byte’ı şeridi ve `write bytes(B)` görünür. Boş hücreler adresin sekiz ayrı byte'ını temsil eder; B'deki 8 sayısı bu şeride taşınmaz. Gerçek view'daki data pointer satırı hedef olarak çerçevelidir. İşlem henüz data bağlantısını B'ye çevirmemiştir.

## change-pointer — 55–66

Adresin byte'larını sahte view üzerinden yazınca, gerçek view'ın metadata'sı değişiyor. Data pointer artık B'yi seçiyor. View aynı object; değişen, hangi buffer'a baktığı. A da yerinde duruyor.

Kurgu: Önce adresin sekiz hücresi sırayla vurgulanır. Ardından sahte view'dan çıkan mevcut metadata bağlantısı kalınlaşır; işlem işareti çerçevelenen data pointer satırına ulaşır. İşaret tek bir byte veya tek elemanlık bütün adres değildir. Önce hedef satır vurgulanır ve pointer B olarak değişir; ardından A'ya giden tek çizgi B'ye yönelir. Adres byte'ları kapanır; data okuması bundan sonra başlar.

## same-index — 66–78

Şimdi gerçek view'dan yine sıfırıncı elemanı okuyalım. Bu kez B'nin ilk byte'ını, sekizi alıyoruz. Index değişmedi; data pointer değiştiği için okunan yer değişti.

Kurgu: İşlemin yanındaki okuma etiketi, `view[0] → 8` sonucuyla birlikte açılır. Etiket doğrudan yapılan okumayı adlandırır.

## write — 78–91

Aynı view üzerinden dokuz yazalım. B'nin ilk byte'ı sekizden dokuza döndü. Tekrar okuyunca da dokuzu alıyoruz. Bir yazma metadata'da hedefi seçti; bu yazma ise seçilen buffer'daki data’yı değiştirdi.

Kurgu: Okuma satırı yerinde kalır. Altında yazma etiketiyle `view[0] = 9` açılır; sonra aynı B hücresi 9 olur. Ardından okuma satırı tekrar `view[0] → 9` gösterir. Okuma ve yazmanın hedefi aynı görünür hücredir. Bağımsız read/write başlığı eklenmez.

## process-boundary — 91–104

Tarayıcı, web sayfasının kodunu ayrı bir process'te çalıştırıyor. WebKit'te bunun adı WebContent process. Gösterdiğimiz view'lar ve buffer'lar bu process'in belleğinde. Şimdi adresini seçtiğimiz yerdeki byte'ları okuyup değiştirebiliyoruz. Kernel belleğine henüz geçmedik.

Kurgu: F/referans yolu önceki aşamada kapanmıştır. Var olan görüntünün çevresinde process sınırı açılır; adı, sayfayı çalıştıran process diye yazılır. Bu çerçeve process'in erişebildiği bellek bağlamını belirtir. Okuma/yazma satırları ve aynı B hücresi görünür kalır. Görüntü bu sınırın içine sığdırılmak için küçültülmez; yeni bir yetenek başlığı belirmez.

## address-space — 104–116

Bir adres seçebilmek, process'in erişemediği belleği açmıyor. Bütün fiziksel RAM'e ulaşmış değiliz. Elimizde, bu process'in erişebildiği bellekte hedefini değiştirebildiğimiz bir okuma yazma yolu var.

## carry-access — 116–121

Şimdi belleğe yazmaktan, mevcut native kodu çalıştırmaya geçelim.

## Kavram kaynağı

[WebKit mimarisi](https://docs.webkit.org/Getting%20Started/Introduction.html): WebContent process, web sitelerinden yüklenen kodu çalıştıran process'tir. Bu sahne, tek tek sayfaların güncel tarayıcılardaki process paylaşımı/site isolation kurallarını açıklamaz.
