# 03-reference — ses ve hareket

Yerel konuşma taslağı. Başlıklar ve kurgu notları okunmaz; ekrana anlatıcı cümleleri yazılmaz. Cue adları, zamanları ve bölümün 168 saniyelik süresi korunur. Cart'a giden referans ile object listesi, byte uzunluğu anlatılırken de görünür kalır.

`01 00 00 80`, mekanizmayı açıklamak için seçilmiş örnek byte'lardır. Gösterilen sırada dört byte'ın hex karşılığı `0x80000001`; aynı 32 bitin signed int32 karşılığı `−2 147 483 647` olur. Bu sayılar bütün firmware'lerin gerçek exploit data'sı olarak sunulmaz. `index`, motorun C++ listesindeki konumu seçer.

## same-list — 2–9

Bir numaralı referans, listedeki cart'ı seçiyordu. İkinci cart bağlantısını da bu sayıyla kuruyorduk. Şimdi araya başka bir tür ekleyelim.

Kurgu: 02'nin son pozu devralınır. Referans 1 ve iki listedeki cart satırı birlikte vurgulanır.

## keepalive — 9–18

Araya BigInt türünde bir sayı ekliyoruz. History'den geri okuduğumuzda, bu sayı da array'in içinde. İki cart bağlantısı da duruyor.

Kurgu: İki array'de de aynı 123n görünür. BigInt'in değeri ve türü, array'in data'sının parçasıdır. Uzun bir sayı yazıp boyutundan kaynaklanan bir sorun izlenimi yaratmayız.

## name-bigint — 18–30

BigInt'in değerini yazmak için cart'taki gibi bir takip numarası gerekmiyor. Ama eski okuyucu, oluşturduğu BigInt'i bellekte tutmak için bir referans saklıyor. Bunu da cart'ı bulmakta kullandığımız listeye ekliyor.

Kurgu: BigInt iki array'de yerinde kalır. Yalnız okuyucunun listesine fazladan BigInt referansı açılır ve array'deki değere bağlanır.

## count-diverges — 30–40

Böylece aynı data için yazanın listesinde iki, okuyanın listesinde üç kayıt oluşuyor. Bu fark önemli; çünkü bir referansın kaç byte yer kaplayacağını da listenin uzunluğu belirliyor.

Kurgu: İki ve üç sayımları, fazladan satırla birlikte görünür. Listelerin farklı uzunlukta olması, sonraki format kararının gerekçesidir.

## width-rule — 40–56

Şu bir numaralı referans hâlâ cart'ı seçiyor. Değişecek olan, bu numaraya ayrılan byte sayısı. Listede iki yüz elli altı ile altmış beş bin beş yüz otuz beş kayıt arasında iki byte kullanılıyor. Sonraki kayıtta dört byte'a geçiliyor. Okuyucu da uzunluğu kendi listesinden seçiyor.

Kurgu: Referans 1, okuyucunun object listesindeki cart'a bağlanır. Başlık listenin okuyucuya ait olduğunu açıkça belirtir; yazanın tablosu sanılmaz. Bu bağlantı üstte kalırken yalnız bu örnekte aşacağımız 2/4 byte sınırı altta açılır. Küçük liste için 1 byte aralığına ayrı bir ders açılmaz. Aralıklar referansın değerini değil, object listesindeki kayıt sayısını gösterir. Okuyucunun BigInt referansı listede görünür kalır.

## writer-width — 56–68

Şimdi farklı object'ler ekleyip yazanın listesini bu sınırın sonuna getirelim: altmış beş bin beş yüz otuz beş kayıt. Cart'ın referansı yine bir. Bu referansı iki byte olarak kaydediyoruz.

Kurgu: Yalnız yazanın sayımı büyür. İki byte aralığı seçildikten sonra 01 ve 00 açılır. Yukarıdaki referans 1 ve cart bağlantısı sabittir. Farklı object'ler sayımı büyütür; aynı cart'ın tekrarı veya BigInt'in sayısal büyüklüğü değil.

## reader-wider — 68–80

Okuyucunun fazladan BigInt referansını hatırlayalım. Aynı data'yı okurken listesi bir kayıt daha uzun. Aradaki tek kayıt, sınırı aştırıyor. Yazan iki byte kullanmışken okuyucu dört byte bekliyor.

Kurgu: Önce 65 535 + 1 ve BigInt referansı gösterilir; sonra 65 536 kayıt olur ve dört byte aralığı seçilir. Sağdaki dört hücre boş kalır: bunlar okuyucunun beklediği genişliktir. Üstteki listede cart hâlâ aynı satırdadır.

## same-bytes — 80–92

Kaydedilen data'ya bakalım. Şu iki byte, bir numaralı referans. İkisini okuyunca listeden cart'ı buluyoruz. Hemen arkasına da sonraki alanın iki örnek byte'ını koyuyoruz. Referansın bittiği yer burası.

Kurgu: Üstte aynı referans ve aynı object listesi kalır. Önce 01 ve 00 açılır; bunlardan 1'e, 1'den cart'a giden yol gösterilir. Sonra sonraki alanın 00 ve 80 byte'ları açılır. İkinci byte'ın sonundaki sınır ve yazılan 2 byte ayracı sabittir.

## overread — 92–106

Ama okuyucu dört byte bekliyordu. İlk iki byte'ta durmuyor; sonraki alandan iki byte daha alıyor. Dördünü tek bir referans numarası sayınca, cart'ı seçen bir yerine başka bir numara oluşuyor.

Kurgu: Okuma oku ilk iki byte'ta duraklayıp sınırı geçer. Cart'a giden normal yol çekilir. Aynı referans kutusunda 1, dört byte'ın hex gösterimi olan 0x80000001'e dönüşür. Büyük bir ondalık sayının hesabına geçilmez; listedeki cart görünür kalır ama artık seçili değildir.

## signed-index — 106–122

Bu referans numarası, C++ tarafında listedeki konumu seçmek için kullanılıyor. Yani index oluyor. Burada index, signed 32 bit bir int. Aynı dört byte bu türle yorumlandığında, örneğimizde negatif bir index çıkıyor. Data değişmedi; sayının yorumlandığı tür değişti.

Kurgu: Dört byte sabit kalır. Object listesinin yanında C++ etiketi açılır. Aynı 32 bit ve hex gösterimi görünürken aynı referans kutusu signed index olarak −2 147 483 647 gösterir. Sekiz bitlik ayrı bir açılım veya unsigned ondalık ara sonuç eklenmez. Cart ve listenin 0'dan başlayan index'leri görünürdür.

## bounds — 122–134

Liste sıfırdan başlıyor. Ama fonksiyon yalnız index'in kayıt sayısına eşit ya da daha büyük olup olmadığını kontrol ediyor. Negatif sayı bu koşulu sağlamıyor. Kontrol erişimi durdurmuyor; bu index'le listeyi okumaya devam ediyor.

Kurgu: Byte açıklaması çekilir; aynı liste üstte kalır ve 0 başlangıcı belirginleşir. Aynı negatif index aşağıdaki karşılaştırmaya taşınır. index >= count koşulu false olur; ardından at(index) açılır. False'un sonucu erişimin devam etmesidir.

## negative-position — 134–146

Bir numaralı index bizi cart'a götürüyordu. Negatif index ise sıfırın, yani listenin başlangıcının öncesine gidiyor. Böylece listede kayıt ararken, listenin dışındaki belleği okuyoruz.

Kurgu: Aynı object listesi aşağı iner; aynı negatif sayı listenin öncesindeki konuma taşınır. Ulaşılan bellek alanı önce boş gösterilir. Uzaklık ölçekli değildir. Bu erişim JavaScript array'ine değil, motorun C++ listesine yapılır.

## missing-lower-bound — 146–158

Eksik olan, sıfırın altındaki index'leri durduracak kontrol. Bu kontrol olmayınca motor, ulaştığı alandaki byte'ları bir JavaScript değeri gibi yorumluyor. Oradan hangi değerin çıkacağı, o bellekte ne bulunduğuna bağlı.

Kurgu: Önce 0 başlangıcı vurgulanır. Ardından erişilen alanın içinde soru işareti açılır. Index ile okunan değer ayrı yerlerde kalır; negatif sayı, sonuçmuş gibi gösterilmez.

## other-content — 158–168

Şimdi soru şu: Okuduğumuz bu alanda, işimize yarayacak bir referansla nasıl karşılaşırız? Bir sonraki adım, bellekteki bu içeriği hazırlamaya çalışmak.

Kurgu: Bu alanın soru işaretiyle bitirilir. 04 aynı liste, index, ok ve bellek alanıyla açılır. Henüz seçilmiş bir object veya kazanılmış erişim gösterilmez.
