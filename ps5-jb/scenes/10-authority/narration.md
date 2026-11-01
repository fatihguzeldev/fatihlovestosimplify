# 10-authority — anlatıcı ve hareket

Bu dosya sahne ilişkilerini açıklayan çalışma taslağıdır; kayıt metni ayrıca yazılacaktır. Konuşma metni ekrana altyazı olarak taşınmaz. Dosya açma örneği, kernel'in bir isteğe hangi kayıtlara bakarak karar verdiğini açıklayan bir modeldir. Örnekteki dosya kuralı ve filesystem ağacı gerçek bir path veya izin denemesinin çıktısı olarak sunulmaz. Mevcut cue adları ve zamanları korunur.

## stabilize-aio → clear-aio

Kernel data'sını okuyup değiştirebiliyoruz. Yetkileri değiştirmeden önce, geride bıraktığımız tehlikeli bir bağlantıyı temizlememiz gerekiyor. Bekleyen AIO isteği bu kaydı hâlâ kullanabilir. Relapse bu bağlantıları temizlemeye çalışıyor. Kernel erişimi için kurduğu çalışma pipe'ları ise açık kalıyor.

Görsel: 09'un process ve kernel erişimi aynı boyutta devam eder. Bekleyen istek ile AIO kaydı arasındaki gerçek ilişki açılır; temizleme sırasında yalnız bu bağlantı çekilir. Bütün erişim kapanmış gibi gösterilmez.

## ordinary-file-request → identity-decision

Şimdi bu yazmayı yetkiye nasıl çevireceğimizi görelim. Aynı process bir dosyayı açmak istiyor. Kernel, isteği yapanın kullanıcı kimliğini dosyanın izin koşuluyla karşılaştırıyor. Bu örnekte dosya UID sıfır istiyor. Bizim kimliğimiz farklı olduğu için izin verilmiyor.

Görsel: Solda aynı process, ortada kernel'in baktığı kayıt, sağda dosyanın koşulu ve karar vardır. İstek soldan gelir; karar sağda açılır. Üç aktörün konumu bundan sonraki örneklerde korunur.

## name-credentials

Kernel'in tuttuğu bu kayda credentials deniyor. Process'in kullanıcı ve grup bilgileri burada. UID, kullanıcı kimliğinin numarası.

## change-identity → same-request

Kernel memory write ile mevcut process'in bu kaydını değiştiriyoruz: UID artık sıfır, yani root. Başka hesaba giriş yapmadık. Aynı dosya isteği tekrar geldiğinde kernel bu kez uygun kimliği görüyor ve izin veriyor.

Görsel: Yazma oku yalnız credentials kaydını hedefler. İstek ve dosya değişmez; değişen UID yüzünden karar değişir.

## same-execution-mode

Kodumuz hâlâ aynı process'te, user mode'da çalışıyor. Root kimliği, kernel'in bizim için verdiği kararları değiştiriyor. Kendi kodumuzun kernel mode'da çalışması başka bir sonuç olurdu; burada onu göstermiyoruz.

## filesystem-boundary → name-filesystem-sandbox

Kimlik tek koşul değil. Process'in dosya araması belirli bir filesystem root'tan başlıyor. Aradığımız dosya bu ağacın dışında kalırsa, kimliği uygun olsa da oraya ulaşamıyor. Filesystem sandbox burada bu başlangıcı sınırlandırıyor.

Görsel: Credentials kartı çekilir. Aynı yerde filesystem ağacı açılır: dar sandbox ağacı, onun üstündeki system root ve sandbox'ın dışında kalan aynı dosya. Process'ten çıkan path başlangıcı oku önce sandbox kökünü seçer. Dosya ve istek değişmez; ulaşılamayan dal fiziksel olarak bu alt ağacın dışındadır. UID 0 olmakla path başlangıcını değiştirmek böylece ayrı ilişkiler olur.

## change-filesystem-links

Relapse, bu başlangıcı belirleyen kernel bağlantılarını da değiştiriyor. Process'in ulaşabildiği dosya ağacı böyle genişliyor. Kimliği değiştirmek ve filesystem root'u değiştirmek, iki ayrı engeli aşan iki ayrı işlem.

Görsel: Alt ağaç ve aynı dosya yerinde kalır. Path başlangıcı oku system root’a yönelir; o kökten dosyaya giden dal vurgulanır. Sandbox kutusu silinmez, bütün filesystem değişmiş veya yeni bir dosya yaratılmış gibi gösterilmez.

## platform-checks

Yeni native kodu hazırlarken library çağrıları da gerekecek. Ama root kimliği, platformun bütün çağrılara izin vermesi demek değil. Aynı process'in bu kez platformun tuttuğu başka izin alanlarına bakılıyor.

## platform-identity → scoped-capabilities

Relapse önce platform kimliğini, ardından capabilities alanlarını düzenliyor. Bunlar Sony'nin yetki kararlarında kullandığı bilgiler. Tek tek görünür özellik açan düğmeler değiller; ilgili çağrıların hangi kimlik ve izinlerle değerlendirileceğini değiştiriyorlar.

## library-constraints → change-library-constraint

Library yükleme ve native çağrı yollarındaki ayrı kısıtlar da değiştiriliyor. Böylece sonraki kodu hazırlamak için gereken arayüzleri kullanabilecek noktaya geliyoruz. Bu işlem bütün güvenlik katmanlarının kaldırıldığı anlamına gelmiyor.

## ready-for-new-code → end

Şimdi elimizde değiştirilmiş process izinleri ve hâlâ açık çalışma pipe'ları var. Sonraki adımda bu izinlerle yeni kod için bellek hazırlayacağız. Pipe'ları da yeni koda kernel erişimini aktarabilene kadar tutacağız.

Görsel: Karar örneği okunabilir boyutta kapanır. Aynı process'in sonraki bölümde de birebir kullanılacak pozu açılır. Soldaki üç satır az önce değişen process kayıtlarını, sağdaki pipe ise açık çalışma kaynaklarını gösterir. Başarı rozeti veya henüz ayrılmamış bir kod alanı gösterilmez. Hiçbir sahne küçük bir köşeye sıkıştırılmaz.

Teknik kaynak: [sabit ReLapse kaynağı](https://github.com/ntfargo/Relapse-Exploit/blob/dd8e4e0914c5e9d066ee1f9b056be76cb992c8e0/src/relapse_exploit.js), defuseAioGroups ve escalate. Filesystem ağacı; rdir, cdir ve jdir ilişkilerinin değiştirilmesinin açıklama modelidir.
