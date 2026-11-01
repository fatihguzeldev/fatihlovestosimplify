# 04-address-need — ses ve hareket

## Sahne planı ve kabul koşulları

Normal view → data pointer hedefi → bu düzeni taklit eden data → bu data'ya ulaşacak referans → heap yerleşimi → sahte view'ın eksik adresi. Hazırlanan data, sahte view adını almadan önce tanıdığımız alanlardan oluşur. Heap bölümünde hedef yerinde kalır; adres kopyaları ayrı buffer'dadır. Liste dışındaki okumadan buffer'a, buffer'daki adresten hazırlanan data'ya uzanan iki bağlantı sırayla kurulur. Son özet de aynı buffer'ı, üç adres hücresini ve seçili ortadaki hücreyi korur. Adrese F adı 05'te başlangıç adresi ve offset üzerinden hesaplanırken verilir. Bağlamsız `ref: ?`, `F = ?` veya anonim adres kartları gösterilmez.

Cue adları, zamanları ve 138 saniyelik süre korunur. 03/04, 04/05 ve 05/06 geçişleri ortak pozları kullanır. Kontroller: typecheck, değişen dosyalarda ESLint, Prettier ve cue/poz incelemesi. Başlıklar ve kurgu notları okunmaz. Seslendirme cümleleri, amaç soruları ve anlatıcı başlıkları ekrana yazılmaz; yazılar sahnedeki object, alan, işlem ve sonuçlara aittir.

24/48/72/96 ve çizilen bellek blokları açıklama modelidir; gerçek boyut, adres veya garantili allocator yerleşimi iddiası değildir. Hazırlanan alan, object içindeki data'dır; motor bu alanı view olarak yorumlayacaktır. Gerçek view'a referans, F öğrenilmeden önce bu içerikte tutulur. Heap grooming için ayrılan buffer ile sahte view alanı ayrıdır. Gerçek çalıştırmada adres öğrenildikten sonra yerleşim hazırlanır; burada önce bu yerleşimin amacı anlatılır.

## choose-content — 3–11

Liste dışındaki bu okumanın işe yaraması için, orada anlamlı bir referansla karşılaşmamız gerekiyor. Neyi seçmesini istediğimizi anlamak için önce normal bir view'a bakalım.

Kurgu: 03'ün son pozu aynen devralınır. Liste ve index çekilir; okunan alan kısa süre tek başına kalır. Sonra normal okuma örneğine geçilir.

## allocated — 11–20

Dört byte'lık bir buffer düşünelim. Örneğimizde içine yirmi dört, kırk sekiz, yetmiş iki ve doksan altı yazılmış olsun.

## free — 20–27

Bu buffer üzerinde bir Uint8Array oluşturuyoruz. Adı view. JavaScript'ten bu object'i kullanarak buffer'daki byte'ları okuyoruz.

## reuse — 27–36

View'ın sıfırıncı elemanını okuyalım. Bağlantı buffer'ın ilk byte'ına gidiyor; sonuç yirmi dört. Şimdi bu bağlantıyı neyin belirlediğine bakalım.

## grooming — 36–45

Aynı view'ın iç düzenini açalım. Türü, uzunluğu ve data pointer'ı var. Data pointer, okunacak byte'ların nerede olduğunu gösteriyor. Bu bilgilerin tutulduğu kısma metadata diyoruz.

Kurgu: Aynı view büyür. Buffer yerinde kalır; pointer bağlantısı uzayan kartın kenarına uyarlanır. Yeni bir view oluşturulmaz.

## what-to-imitate — 45–54

Bu pointer'ı değiştirebilseydik, view başka bir yeri okuyabilirdi. Dolayısıyla önce buffer'a değil, view'ın kendi metadata'sına ulaşacak bir yol arıyoruz.

Kurgu: Önce normal data bağlantısı, sonra pointer alanının kendisi vurgulanır. Normal okuma sonucu değişmez.

## bytes-first — 54–63

Bunun için ayrı bir object'in içinde data hazırlıyoruz. Düzenini az önce gördüğümüz view'a benzetiyoruz: aynı amaçla okunacak bir başlık, uzunluk ve data bağlantısı.

Kurgu: Hazırlanan data'nın sınırı açılır. Tanıdığımız Uint8Array başlığının bir gösterimi soldaki type alanına taşınır; length alanı eklenir. Bu bir oluşturucu çağrısıyla yaratılan yeni view değildir. Alanların fiziksel bit düzeni şematiktir.

## ordinary-read — 63–73

Data bağlantısının yerine gerçek view'a referans koyuyoruz. Motor bu hazırladığımız alanı view sanırsa, buradan erişilen data gerçek view'ın metadata'sı olacak. Sahte view dediğimiz düzen bu.

Kurgu: Gerçek view yerinde kalır; yalnız ona giden referans soldaki data alanına yerleşir. Object içindeki data etiketi sahte view olur. Kesik bağlantı, bu alanın view olarak yorumlanması halinde ulaşılacak metadata'yı gösterir. Henüz erişim kurulmaz.

## typedarray-name — 73–84

Şimdi liste dışındaki okumayı bu hazırlığa bağlamamız gerekiyor. Bunun için heap'teki yerleşimi etkilemeye çalışacağız. Önce birkaç buffer ayırdığımız bir bellek düzenini düşünelim.

Kurgu: Sahte view yerinde kalır. Normal view ve buffer geçici olarak çekilir; altta ayrı bellek tahsisleri açılır. Hazırlanan data bu blokların içine taşınmaz. Bu bölüm, kurulmak istenen yerleşimin planıdır.

## engine-record — 84–94

Sağdaki tahsisi bırakıp yeniden kullanılabilecek bir boşluk oluşturuyoruz. Adresleri taşıyacak buffer yerinde kalıyor. Amacımız, birazdan oluşturulacak object listesinin bu boşluğa yerleşmesi.

Kurgu: Sağdaki buffer etiketi ve dolgusu çekilir; aynı bellek sınırları kalır. Soldaki buffer ve yukarıdaki sahte view sabittir. Yerleşim örneği tek bir boşluk üzerinden gösterilir. Ayrı bir use-after-free açığı gösterilmez.

## pointer — 94–103

Elimizde tuttuğumuz buffer, hazırladığımız data'nın adresini tekrar tekrar taşıyacak. Okuma bu kopyalardan birine denk gelirse, oradan ayrı duran sahte view'a ulaşabilecek.

Kurgu: Buffer'a aynı rolü taşıyan üç adres hücresi açılır. Ortadaki hücre vurgulanır ve ondan, yerinde kalan sahte view'a kesik bir bağlantı çizilir. Sayısal adres henüz yazılmadığından hücreler adres diye etiketlenir.

## other-bytes — 103–113

Liste, hedeflediğimiz yere ayrılırsa negatif index bu adres kopyalarından birini seçer. Tahsislerle ve boşluklarla bu yerleşimi sağlamaya çalışma işine heap grooming diyoruz. Yerleşim tutmazsa yeniden denenir.

Kurgu: Aynı boş alanda okuyucunun object listesinin iç bölmeleri açılır; başlık bu listenin kime ait olduğunu belirtir. Liste dışındaki okuma, seçilen adres hücresine bağlanır; bu hücreden sahte view'a giden ayrı yol zaten görünürdür. Heap grooming adı bu iki ilişki kurulduktan sonra açılır. Bu, garanti edilmiş sonuç veya gerçek çalışma kaydı değildir.

## metadata-target — 113–125

İki bağlantıyı birleştirelim: liste dışındaki okuma bir adres alacak; o adres hazırladığımız sahte view'ı seçecek. Sahte view üzerinden de gerçek view'ın metadata'sını hedefleyeceğiz. Normal view şimdilik kendi buffer'ını okumaya devam ediyor.

Kurgu: Yalnız heap yerleşimi ve okuyucunun listesi çekilir. Ayırdığımız buffer, üç adres hücresi ve ortadaki hücrenin vurgusu korunarak sahte view'ın altına gelir. Eski dolambaçlı bağlantı çekilir; yerleşme bittikten sonra ortadaki hücreden sahte view'a tek, düz bir kesik ok çizilir. Normal view ve kendi buffer'ı geri gelir. Adres hücresi başka bir object'e veya anonim referans kartına dönüşmez.

## need-address — 125–138

Buffer'a yazacağımız adres hâlâ eksik: hazırladığımız sahte view alanı bellekte nereden başlıyor? Data'yı biz hazırladık, ama bu onun sayısal adresini bildiğimiz anlamına gelmiyor. Şimdi bu adresi bulacağız.

Kurgu: Buffer, seçili adres hücresi ve onun sahte view'a bağlantısı ekranda kalır. Adresi bulma amacı seslendirmede anlatılır; yukarıda cümle veya amaç başlığı açılmaz. Henüz F adı verilmez; ikinci bir ok veya durum kutusu açılmaz. Bu poz preparationPose(false) ile 05'e devredilir.

## Teknik kaynak

[ReLapse WebKit kaynağı, sabit sürüm](https://github.com/ntfargo/Relapse-Exploit/blob/dd8e4e0914c5e9d066ee1f9b056be76cb992c8e0/src/webkit.js): prepareExploitObjects, fillPointerSpray, groomHeap, finishAddressLeak ve inspectClonedGraph. Başlık/length gösterimleri şematiktir; gerçek fakeHost.q0/q2 düzeni veya allocation boyutları birebir çizilmez.
