# 05-address-leak — görsel akış ve konuşma notları

Bu dosya final kayıt metni değildir. Sonraki metin çalışmasının sahne planıdır. Cue adları, zamanları ve 255 saniyelik süre korunur. Aktörler: cart getter'ı, ad bağları örneği, gerçekten sızan internal scope, getter/setter kaydı, ayrı getter fonksiyonu, bu fonksiyonun [0] referansı, hazırlanmış object ve Symbol wrapper. Görsel aynıymış gibi gösterilen farklı object'ler veya açıklamasız tür dönüşümleri kullanılmaz.

Kritik teknik ayrım: hatalı Symbol varsayımı Object(scope.g) sırasında wrapper oluşturulurken yapılır. Symbol.prototype.toString daha sonra Symbol wrapper içindeki aynı getter kaydını yanlış türde okuyarak string'e bellek bilgisi karıştırır. Kayıt Symbol'e dönüşmez. Getter fonksiyonunun return 7 gövdesi çalıştırılmaz. H hazırlanmış object'in başlangıcı; F onun içindeki sahte view alanının başlangıcıdır. Referans okları, fiziksel field/offset diyagramı değildir.

## reference — 3–14

Sahte view'ı ve adres kopyalarını taşıyacak aynı buffer'ı 04'ten aynen devral. Gerçek view ve normal buffer sönükleşirken seçili adres hücresi, onun bağlantısı ve sahte view tam görünür kalır. Adresi bulma amacı seslendirmede anlatılır; üstte açıklama veya soru yazısı açılmaz. Henüz F adı verilmez. Bu aşamada bellek erişimi kazanılmış değildir.

## example — 14–24

Tanıdığımız cart ve cart.total okuması. Total bir getter alanıdır; fiyat/adet aynı değerlerle görünür. Eski hazırlık diyagramı tamamen çekildikten sonra bu örnek açılır.

## calculation — 24–32

Alan okuması getter'ın hesabına gider: 120 × 3. Fonksiyon gövdesi ve onu çağıran alan ayrı görünür; ok bu ilişkiyi kurar.

## getter — 32–41

Bu fonksiyonu getter diye adlandır. Alanı okumak, fonksiyonu çalıştırır. Henüz motorun iç kaydı veya adres bilgisi yok.

## getter-result — 41–51

Hesaptan 360 çıkar. Fonksiyonun gövdesi, fonksiyon object'i ve dönüş değeri ayrı şeylerdir. Sonucun hangi işlemden çıktığı okla görünür.

## intercept — 51–62

Aynı cart.total isteğinin önüne Proxy ekle. İstek Proxy'ye, oradan aynı cart'a gider. Receiver alanında cart görünür; yeni bir cart doğmaz.

## proxy-name — 62–70

Araya giren yapı Proxy olarak adlandırılır. Normal örneğin receiver'ı cart'tır. Bu alan birazdan hatalı yoldan gelen değeri taşıyacaktır.

## names — 70–82

Getter'ın kullandığı cart adını nereye bağladığını göster. Getter ifadesi ad bağları kartına, o kart da aynı cart object'ine bağlanır. Cart'ın kendisi küçük bir thumbnail'e dönüşmez; iki property'siyle görünür kalır.

## scope — 82–94

Bu ad bağları bağlamını scope diye adlandır. Bu normal örnek, sonraki hatada dışarı çıkan internal scope object'iyle aynı object olarak sunulmaz.

## real-path — 94–108

Normal örnek kapanır. Ayrı gerçek hatalı yol: super.foo isteği aynı konumdaki Proxy'ye gider. Sağdaki motor tarafında yeni bir internal scope kaydı gösterilir. Bu, az önceki cart adları örneğinin başka yere taşınması değildir.

## scope-leak — 108–122

Motorun internal scope kaydı receiver alanına gelir. Proxy return receiver yapınca aynı kayıt sayfanın JavaScript'i tarafına taşınır. Önce Proxy kapanır; sonra aynı scope kartı sola geçer. scope = super.foo sonucu bu karttır. Henüz bir sayı/adres öğrenilmedi.

## getter-record — 122–136

Aynı sızan scope üzerinde g getter'ı kurulur. Yeni ve ayrı getter fonksiyonunun gövdesi return 7 olarak görünür. scope.g okumasının dışarı çıkan sonucu, bu fonksiyonu ve setter'ı tutan motor kaydıdır. “okumanın sonucu” etiketi getter kaydının üzerinde kalır. Kayıttaki getter bağlantısı ayrı fonksiyona uzanır.7, dışarı çıkan sonuçmuş gibi animasyon almaz.

## target-reference — 136–153

Scope işlemi çekilir, alınmış aynı kayıt kalır. Ayrı getter fonksiyonuna [0] property referansı eklenir. Bu referans, 04'teki sahte view data'sını taşıyan hazırlanmış object'i gösterir. Kayıt → fonksiyon → [0] → object zinciri sırayla çizilir. Fonksiyonun return 7 kodu çalıştırılmaz.

## convert — 153–164

Gerçek kodun Object(scope.g) hazırlığını göster. Üç kart da geçiş boyunca görünür kalır. Aynı getter kaydı yukarı yerleşirken fonksiyon ve hedef object alt sıraya iner; fonksiyonun sola hareketi ancak başlığı üstteki kaydın hizasından çıktıktan sonra başlar. Yeni parent görünür durumdayken aynı node'lar taşınır; kartlara veya ortak parent'larına fade uygulanmaz. Yerleşme tamamlanınca yalnız yeni wrapper sınırı, adı ve Object(scope.g) satırı açılır; bağlantılar yeni uçlarına bağlı olarak geri görünür. Kayıt ayrı adı ve getter/setter alanlarıyla wrapper içinde kalır. Wrapper'ın Symbol türü varsayımının hatalı olduğu, normal Symbol örneğinden sonra açıklanacaktır.

## normal-symbol — 164–175

Önce alt sıranın bağlantıları, sonra getter fonksiyonu ve hazırlanmış object tamamen çekilir. Ancak bu alan boşaldıktan sonra aynı wrapper sonraki girdi olarak aşağı iner; içindeki getter kaydı görünür kalır. Wrapper ile silinmekte olan alt kartlar aynı anda aynı alanı kaplamaz. Ayrı normal Symbol girdi olarak açılır. Description etiketi toString sonucundaki Symbol(etiket) ile eşleşir. Symbol'ün kendi bilgisinin string'e taşınması görünür olur. Hazırlanan kayıt Symbol'e dönüşmez.

## wrong-type — 175–190

Normal Symbol ve eski giriş/sonuç bağlantıları kapanır. Aynı hazırlanmış wrapper girişe döner. Object(scope.g) satırı ve Symbol wrapper adı, hareket bittikten sonra açılıp vurgulanır: hata o hazırlık sırasında, getter kaydı Symbol sanılarak Symbol wrapper yapılmasıdır. Wrapper sınırı ile içindeki getter kaydı aynı anda okunabilir kalır. Getter fonksiyonu ve hazırlanmış object, wrapper üstteki yerine tamamen ulaştıktan sonra geri açılır; bağlantıları da kartların ardından görünür. Böylece yükselen wrapper, geri gelmekte olan kartları veya başlıklarını kesmez. toString wrapper'ı kabul edip içerideki bu kaydı Symbol gibi okur. Çıktı oku, henüz görünmeyen bir sonuca uzanmaz; address-output ile açılır.

## address-output — 190–203

Normal description yerine string'e bellek bilgisi karışır. H, hazırlanmış object'in bellekteki başlangıç adresine verdiğimiz kısa addır; gerçek çıktıda H harfi arandığı anlamına gelmez. Dönen string, içindeki H ve sonuç oku önce birlikte okunabilir kalır; H'nin altındaki kısa object’in adresi etiketi değerin anlamını tanıtır. Önce bu etiket, tırnak/üç nokta ve sonuç oku çekilir. Ardından aynı H, hazırlanmış object'in sol üst sınırına taşınır. H'nin altında çizgi veya ok gösterilmez. Anlatıcı cümlesi veya H'den object'e giden ok gösterilmez. H wrapper'ın, scope'un, getter kaydının veya fonksiyonun adresi gibi sunulmaz. String örneği şematiktir; gerçek string boyutu/UTF-16 dizilimi çizilmez.

## knowledge — 203–215

Aynı hazırlanmış object ve başlangıç adresini adlandıran aynı H birlikte büyür. H'nin altına çizgi veya ok eklenmez. Wrapper ve fonksiyon ilişkileri görevlerini tamamlayıp kapanır. Sahte view etiketi geçiş boyunca üst katmanda görünür kalır; büyüme bitince header ve alan sınırı açılır, aynı etiket bu alanın içine alınır. H, object’in başlangıcını adlandıran adres etiketidir. H ile F aynı adres değildir.

## record-address — 215–226

Offset, object'in başlangıcı H'den içindeki sahte view'ın başlangıcına kadar olan byte mesafesidir. Sahte view'ın başlangıç adresine burada F adı verilir: H + offset = F. Böylece F'nin ne olduğu ve nasıl elde edildiği tek object üzerinde izlenir. Gerçek koddaki +0x10 burada offset olarak gösterilir.

## reference-address — 226–236

04'teki tam boy hazırlığa ve aynı üç hücreli buffer'a dönülür. Buffer'daki adres etiketleri birlikte F olur; ortadaki hücre seçili kalır ve aynı sahte view'a bağlanır. Böylece bulduğumuz adresin nereye yazılacağı görünürdür. Sahte view'ın hedefi olan gerçek view'a yeni bir pointer yazılmış değildir.

## missing-access — 236–248

Normal view'ın bağlantısı hâlâ ilk buffer'a gider, view[0] hâlâ 24 döndürür. Adresi bilmek ile o adres üzerinden erişim kurmak iki ayrı aşamadır; eski bağlantı görsel olarak değişmez.

## handoff — 248–255

Buffer'daki seçili F hücresi ve sahte view yolu birlikte vurgulanır. 06 aynı pozdan başlayarak bu yolun gerçek view'ın metadata'sına erişmesini ve data pointer'ın değiştirilmesini gösterecek.

## Teknik kaynaklar

- [ReLapse sabit sürüm: src/webkit.js](https://github.com/ntfargo/Relapse-Exploit/blob/dd8e4e0914c5e9d066ee1f9b056be76cb992c8e0/src/webkit.js): prepareSymbolWrapper, prepareAddressLeak, captureAddresses, finishAddressLeak. Object(scope.g), return 7 ve getterCarrier[0] ilişkisi doğrudan bu kaynaktadır.
- [Eski JSCell boxing yolu](https://github.com/WebKit/WebKit/blob/3218bc287cc3297da11f4d198fe6fe561f439d1e/Source/JavaScriptCore/runtime/JSCell.cpp#L170-L180): Symbol olmayan iç kayıt için hatalı Symbol varsayımı.
- [Symbol'ün wrapper'a alınması](https://github.com/WebKit/WebKit/blob/3218bc287cc3297da11f4d198fe6fe561f439d1e/Source/JavaScriptCore/runtime/Symbol.cpp#L68-L71).
- [SymbolObject'in iç değeri ve toString okuması](https://github.com/WebKit/WebKit/blob/3218bc287cc3297da11f4d198fe6fe561f439d1e/Source/JavaScriptCore/runtime/SymbolPrototype.cpp#L82-L113).
