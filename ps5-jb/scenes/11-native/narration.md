# 11-native — anlatıcı ve hareket

Bu dosya sahne ilişkilerini açıklayan çalışma taslağıdır; kayıt metni ayrıca yazılacaktır. Ekrana konuşma paragrafları taşınmaz. Loader'ın ELF dosyasından belleğe hazırlanması, mekanizmanın genel modelidir; hazır bootstrap binary'sindeki bütün iç talimatların kaynak eşlemesi değildir. Dosya, bellekte hazırlanmış kod ve çalışan kod ayrı durumlarla gösterilir. ELF loader aynı process'te ve user mode'da çalışır. Bölümün somut sonucu, TCP 9021 üzerinde payload bekleyen loader'dır. Sonradan gönderilebilecek ayrı bir payload'ın yüklenmiş veya çalıştırılmış olduğu gösterilmez.

## ordinary-application-acceptance → signature-condition

Sonradan vereceğimiz programları alıp çalışmaya hazırlayan bir loader istiyoruz. O da önce bir dosya. İçinde machine code bulunması, konsolun normal başlatma yolundan kabul edilmesine yetmiyor. Ortam uyumu ve Sony imzası gibi koşullar var. Kazandığımız yetkiler dosyaya yeni bir imza vermedi.

Görsel: Loader dosyası tam boy solda; normal başlatma koşulları sağdadır. Dosyanın kod ve data çizimleri kendi adlarıyla görünür; durum henüz çalışmıyor olur. Henüz bootstrap, ELF tablosu veya yeni bellek alanı gösterilmez. Aynı process çerçevesi büyüyüp küçülmez.

## loading-in-existing-process

Bu dosyayı normal uygulama gibi başlatmak yerine, zaten içinde çalıştığımız process'e yükleyeceğiz. Dosya sağda beklesin: henüz data, henüz çalışan program değil.

## starter-code

Önce küçük bir bootstrap hazırlıyoruz. Bu kod, bekleyen loader'ı çalışmaya hazırlayacak. Birazdan bunun genel modelini göstereceğiz. Loader ise çalıştıktan sonra verdiğimiz diğer programları hazırlayacak.

## request-code-area → mapping-with-permissions

Bootstrap'ın çalışacağı executable memory gerekiyor. Byte yazabildiğimiz her yerde kod yürütemiyoruz. Değiştirdiğimiz yetkilerle native memory API’lerinden bu alan için read, write ve execute izinleri istiyoruz. İzin, bütün process'e değil bu alana ait.

## name-mapping → place-new-code

Mapping, alanın process'in kullanabildiği bir adres aralığına yerleştirilmesi. Şimdi bootstrap'ın byte'ları bu alana yazılıyor ve geri okunarak doğrulanıyor. Kod bellekte; ama henüz yürütme başlamadı.

Görsel: Bootstrap çizimi kapanır, aynı odakta ayrılan alan açılır. Yazma cue'sunda bu alanın içinde talimat izleri görünür. Dosya sağda aynı boyutta data olarak kalır.

## name-bootstrap

Bootstrap artık memory'de hazır; henüz çalışmıyor. Önce o, ardından loader çalışacak. Aradaki yükleme adımlarını birazdan genel bir modelle açacağız.

Görsel: Bootstrap'ın kodu bellekte dururken henüz çalışmıyor etiketi görünür. İşaret veya yürütme çizgisi, native thread başlayana kadar açılmaz. Byte yazmak ile yürütmek ayrı durumlarda okunur.

## loader-is-a-file → prepare-handoff-pipes

Loader çalıştığında kernel erişimini de kullanabilsin istiyoruz. Bunun için çalışma pipe'larından ayrı pipe'lar hazırlıyoruz. Mevcut kernel erişimi, yeni yapıların ilişkilerini ayarlamakta kullanılıyor. İki grup da şimdilik açık.

Görsel: Altta çalışma pipe'ları ile sonraki kodun pipe'ları ayrı ve okunabilir boyutta açılır. Hazırlama oku bu iki grup arasında düzdür. Kod alanı ve bekleyen dosya yer değiştirmez.

## handoff-descriptors → resources-stay-open

Yeni koda kaynakların kendisini taşımıyoruz; açık uçların fd'lerini veriyoruz. İki pipe'ın dört fd'si ve bellekte bekleyen loader'ın adresi, bootstrap'ın arguments alanına kopyalanıyor. Asıl pipe'lar açık kalıyor.

## start-native-thread

Şimdi bu kodu başlangıç noktası olarak kullanan bir native thread oluşturuluyor. Yeni çalışma akışı, yerleştirdiğimiz machine code'u çalıştırmaya başlıyor. Belleğe byte yazmakla kod çalıştırmak arasındaki fark bu.

Görsel: Düz yürütme çizgisi ve hareket eden işaret ilk kez burada açılır. Arguments ve açık kaynaklar o anda hâlâ görünür. Önceki bölümün bir minyatürüne zoom yapılmaz.

## bootstrap-prepares-loader → file-layout-to-memory

Bootstrap başladı; loader ise hâlâ dosya. Onu çalıştırmak için code ve data’sının bellekteki yerlerini hazırlamak gerekiyor. Şimdi bu hazırlığın genel modeline bakalım. Dosya bir tarafta, onun için hazırlanacak bellek diğer tarafta.

## name-elf

ELF, dosyadaki bu yerleşimi tarif eden biçim. Kodun ve data'nın nerede olduğunu, bellekte ne kadar alan istediğini ve entry point'i belirtiyor. Yükleyen kod bu tarifi kullanır; burada genel yükleme modelini gösteriyoruz. ELF olmak, normal uygulama kabul koşullarını geçmiş olmak demek değil.

## load-loader-code → load-loader-data

Dosyadaki kodun bellekteki karşılığı hazırlanıyor. Ardından data için gereken alan dolduruluyor. Dosyanın bütünü bir anda çalışan programa dönüşmüyor; tarif ettiği yerleşim kuruluyor.

Görsel: Dosyanın kod ve data izleri, aynı adları taşıyan bellek alanlarına kopyalanır. Kaynak dosya solda kalır. Böylece hangi programın hangi byte'larının nereye geldiği ayrıca sesli açıklamaya bağlı kalmaz.

## loader-entry → loader-runs

Yerleşim hazır olduğunda yürütme dosyanın entry point'ine geçiyor. Aynı loader dosyası için şimdi çalışan loader diyebiliriz. Ekrandaki hareket eden işaret, dosya kopyalamayı değil yürütmeyi gösteriyor.

Görsel: Kaynak dosya etiketi solda kalırken yalnız bellekteki alanın adı çalışan loader olur. Kopya ile yürütülen program aynı kutu olarak yeniden adlandırılmaz.

## release-working-tools

Kernel erişimi yeni kodun kullanacağı yapılara aktarıldıktan sonra eski geçici araçların kalan onarımları deneniyor. Çalışma pipe'ları kapanabilir. Sonraki kodun pipe'ları açık, değiştirilmiş izinler de yerinde kalıyor. Temizlik, yetkileri geri almak değil.

## loader-ready — 210–218

Loader çalışıyor. Onu hazırlayan dosya ve bootstrap çizimleri görevini tamamladı; aynı loader'ın code ve data alanları yerlerinde kalıyor. Kernel erişimini taşıyan pipe'lar da açık.

Görsel: Kaynak dosya ve yükleme bağlantıları çekilir. Gerçek çalışan alanın adı ELF loader olur; aynı code ve data aktörleri birlikte process'in ortasına yerleşir. Açık kaynakların etiketi loader’ın pipe’ları olarak netleşir. Sonraki program diye yeni bir dosya açılmaz.

## wait-for-payload → end — 218–226

ReLapse'in burada ulaştığı somut sonuç bu: ELF loader, TCP 9021 üzerinde payload bekliyor. Artık kendi payload'ımızı gönderebiliriz. Bu videoda o sonraki programı göndermiyoruz; loader'ın hazır olduğu noktada zinciri tamamlıyoruz.

Görsel: TCP :9021 etiketi doğrudan loader başlığının altında görünür. Payload bekliyor durumu aynı loader alanının içindedir. Yeni bir payload dosyası, gönderim oku veya yeni programa execution geçişi açılmaz. Kapanış bölümü aynı loader'ı, aynı açık pipe'ları ve aynı process'i birebir devralır. Sahne, kaldırılan sonraki-program örneği nedeniyle 256 yerine 226 saniyede biter.

Teknik kaynak: [sabit kexp.js](https://github.com/ntfargo/Relapse-Exploit/blob/dd8e4e0914c5e9d066ee1f9b056be76cb992c8e0/src/kexp.js), mapElf, mapExecutable, prepareShellcodePipes ve spawnAndJoin. [README](https://github.com/ntfargo/Relapse-Exploit/blob/dd8e4e0914c5e9d066ee1f9b056be76cb992c8e0/README.md), başarılı akışın sonunda ELF loader'ın 9021 portunda dinlediğini belirtir. Bootstrap içindeki ELF layout çizimi mekanizma modeli olarak kalır; bu çizim binary'nin birebir çözümlemesi değildir.
