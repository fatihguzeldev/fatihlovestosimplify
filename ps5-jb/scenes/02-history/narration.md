# 02-history — görsel akış

İlk üç beat için yerel konuşma taslağı ve bölümün tamamı için görsel akış planı. Tam seslendirme metni sonraki aşamada yazılacak. Başlıklar ve kurgu notları okunmaz; ekrana anlatıcı cümleleri yazılmaz. Cart, açığı açıklamak için kullandığımız örnektir. Giriş dahil toplam süre 150 saniyedir.

## history-api — 2–6

Tarayıcının sayfa geçmişini History API ile yönetebiliyoruz.

Kurgu: 01'in son pozu ilk karede korunur. Sayfanın içeriği çekilirken tarayıcı çerçevesi ve adresi sabit kalır. Geri/ileri düğmeleri kısa süre vurgulanır. History API başlığının altında üç geçmiş kaydı açılır; mevcut /cart kaydı ve bu sayfa etiketi vurguludur. Çift yönlü bağlantılar kayıtlar arasında geri/ileri gidilebildiğini gösterir.

## history-data — 6–9

Bu geçmişteki kayıtlara data da ekleyebiliyoruz.

Kurgu: Mevcut /cart kaydının içinde data belirir. Diğer kayıtlar yerlerinde kalır; yeni bir API veya kod örneği açılmaz.

## history-cart — 9–14

Şimdi ReLapse'in kullandığı açığı cart üzerinden inceleyelim.

Kurgu: Başlık, komşu kayıtlar ve bağlantılar çekilir. Mevcut kayıt sağ alta taşınır ve history kaydı adını alır. Tanıdığımız cart sayfası ve aynı cart object'i geri gelir. Copy-question ile sayfanın arayüzü çekilirken cart object'i mevcut deney pozuna, aynı history kaydı da alt ortaya taşınır. Array yalnız two-links ile açılır. Write-history sırasında data etiketi çekilir ve [cart, cart] bu kayda yazılır.

## copy-question — 14–21

Kurgu: Arayüz çekilir; aynı cart object'i orta alana taşınır. Az önce tanıtılan history kaydı da alt ortaya gelir. Henüz array veya ikinci bir cart gösterilmez. Amaç önce bilinen object'i deneyin tek kaynağı olarak sabitlemektir.

## two-links — 21–28

Kurgu: [cart, cart] array'i açılır. Önce ilk elemanın, sonra ikinci elemanın aynı cart'a giden bağlantısı çizilir. İkinci bağlantıda yeni bir object oluşmaz. İki kullanımın tek bir kimliği paylaştığı, History çağrısından önce görünürdür.

## write-history — 28–36

Kurgu: history.replaceState([cart, cart], "") görünür. Kayda giden yol array'in alt kenarından başlar. History kutusunun içindeki genel data etiketi çekilir; örneğin artık hangi data'yı kaydettiği somuttur.

## read-history — 36–45

Kurgu: const copied = history.state görünür. İlk cart solda kalırken okunan yeni array ve yeni cart sağda oluşur. Yeni array'in iki elemanı da sağdaki tek cart'a bağlanır. İlk cart ile yeni cart iki ayrı object'tir; yeni array'in içindeki paylaşım korunmuştur.

## mutate-copy — 45–52

Kurgu: copied[0].quantity = 4 görünür. İlk bağlantı vurgulanır, onun ulaştığı cart'ın quantity alanı 4 olur. Ardından copied[1].quantity → 4 görünür; ikinci bağlantı da aynı alanı seçer. İkinci bir değişiklik veya ikinci bir yeni cart yoktur. Bu koddaki [0]/[1], array'in elemanlarını seçer.

## source-unchanged — 52–59

Kurgu: cart.quantity → 3 görünür. Soldaki ilk cart'ın 3'ü ile sağdaki yeni cart'ın 4'ü karşılaştırılır. Böylece kopyalama ile yeni array'in içindeki ortak kimlik, ayrı ayrı anlaşılır.

## tracking-question — 59–67

Kurgu: İşlem metni ve kopya çekilir. Kaynak array'in iki bağlantısı sırayla vurgulanır. İhtiyaç, aynı cart ile ikinci kez karşılaşıldığını tanımaktır. Bu ihtiyaç kurulmadan takip tablosu açılmaz.

## remember-cart — 67–73

Kurgu: Önce array'in tamamı object olarak seçilir. İçindeki cart bağlantıları ve cart sönükleşir. Bir sonraki tablonun ilk kaydının neden array olduğu görselden anlaşılır.

## writer-list — 73–77

Kurgu: Kaynak yukarı taşınır; altındaki object listesi boş olarak açılır. Başlık ile ilk boş satır vardır; henüz numara, kaydedildi rozeti veya hazır dolu tablo yoktur.

## writer-array — 77–81

Kurgu: Bütün array'den ilk tablo satırına bağlantı çizilir. Satırın array kimliği açıldıktan sonra 0 görünür. Satır etiketi, bunların takip tablosunun numaraları olduğunu belirtir; array eleman index'leriyle karıştırılmaz.

## writer-cart — 81–89

Kurgu: Kaynak array'in ilk cart bağlantısı izlenir. Cart, aynı tabloda ayrı bir satır olarak görünür; satır numarası 1 daha sonra açılır. Array 0, cart 1 olarak iki ayrı object takip edilir.

## writer-repeat — 89–97

Kurgu: İkinci cart bağlantısı izlendiğinde yeni satır açılmaz. Var olan 1 numaralı satır ve onun gösterdiği aynı cart birlikte seçilir. Tabloya ekleme ile mevcut kaydı bulma, ayrı hareketlerle anlatılır.

## write-reference — 97–105

Kurgu: Kaynak object diyagramı çekilir, tablo kalır. 1 numarası tablonun cart satırından kaydedilen referans alanına taşınır. Referansın, bir sonraki okumanın hangi object'i seçmesi gerektiğini taşıdığı görünürdür.

## reader-list — 105–112

Kurgu: Yazanın tablosu çekilir, kaydedilen referans 1 kısa süre tek başına kalır. Okuma tarafında henüz oluşturulmamış array ve cart hemen dolu bir tablo olarak belirmez.

## reader-array — 112–119

Kurgu: Önce yeni array oluşur; sonra okuyucunun 0 numaralı satırına kaydedilir. İki array elemanının yerleri henüz boştur.

## reader-cart — 119–127

Kurgu: İlk eleman okunurken yeni cart oluşur. Bu cart okuyucunun 1 numaralı satırına eklenir. Kaydedilen 1 referansı hâlâ ekrandadır; henüz ikinci bir cart yaratılmaz.

## read-reference — 127–136

Kurgu: Kaydedilen referans 1, okuyucunun 1 numaralı satırını seçer. Bu satırın gösterdiği mevcut yeni cart vurgulanır; ikinci array elemanının bağlantısı ona çizilir. Okuyucu, mevcut cart'ı tekrar kullanır.

## compare-lists — 136–150

Kurgu: Array/object diyagramı çekilir. Yazarken ve okurken kurulan tablolar aynı boyda yan yana gelir. İki tarafta array 0, cart 1 ve kaydedilen referans 1 birlikte görünür. Bu tam poz 03'ün ilk karesidir; BigInt eklenmeden önce iki tarafın aynı numarayı aynı role bağladığı sabitlenir.
