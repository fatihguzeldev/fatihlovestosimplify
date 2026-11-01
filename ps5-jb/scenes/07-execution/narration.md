# 07-execution — seslendirme ve hareket

Çalışma metni; başlıklar seslendirilmeyecek. Görüntü konuşmadaki düşünceyi ilerletir. Sayılar normal call örneğidir; bir cihaz denemesi gösterilmez. Süre hedefi 228 saniye; kayda göre ince ayar gerektirir. Teknik terimler return adresi, argument, memory read/write, library, stack ve syscall olarak kullanılır.

## data-and-code → writing-is-not-execution

Az önce değiştirdiğimiz byte’lar hâlâ burada. Elimizdeki memory write ile bu process’teki data’yı değiştirebiliyoruz. Yazma ve çalıştırma ise ayrı izinler. Soldaki alanın çalıştırma izni yok. Sağdaki mevcut native code çalışabiliyor. Şimdi bu code’un izleyeceği yolu nasıl seçebileceğimize bakalım.

Hareket: 06’dan gelen aynı byte şeridi data alanına taşınır. Aynı process sınırı ve sayfayı çalıştıran process etiketi korunur. Çalışma işareti mevcut code tarafında kalır; data’ya geçiş engelde durur. Açıklanmamış NX yerine çalıştırma izni yok durumu görünür.

## ordinary-call → argument-and-result

Sıradan bir function call düşünelim. Örnekteki read1, argument olarak aldığı adresteki tek byte’ı okuyan mevcut bir native function. Buffer B yerinde duruyor; ilk byte’ı dokuz. Call yapılırken, function return ettikten sonra hangi adımla devam edileceği de saklanıyor. Function B adresini kullanıp byte’ı okuyor ve result olarak dokuzu veriyor.

Hareket: Caller’ın devam noktası, argument ve result ayrı görünür. Return adresi, caller’ın üçüncü adımıyla eşleşir. Code yerinden oynamaz.

## normal-return

Function return ettiğinde, saklanan return adresi caller’ın üçüncü adımını seçiyor. Stack bu call’a ait argument ve return adresi gibi bilgileri tutuyor.

## return-changes → argument-placement

Elimizdeki memory write ile stack’teki return adresini değiştirebiliyoruz. Yeni return adresi mevcut bir code parçasını seçiyor. Bu parça, B adresini bir sonraki native call’ın argument’ı olacak yere yerleştiriyor. Byte’lar buffer’da kalıyor; stack’te tuttuğumuz şey adresler.

Hareket: Aynı buffer B yerinde kalır. Stack’ten argument alanına yalnız B adresi taşınır. Memory write bağlantısı adlandırdığı işlemin yanından başlar ve gerçek stack kaydına ulaşır.

## existing-pieces

İlk parça B’yi argument yerine koydu. Stack’teki sonraki return adresi read1’i seçiyor. B’deki byte okunuyor; result yine dokuz. Bir sonraki return, result’ı alacak mevcut parçayı seçiyor. Her adımda stack’teki bir adres, çalışacak mevcut code’u belirliyor.

Hareket: Yalnız kullanılan stack satırı ve seçtiği code turuncudur. Argument alanındaki B ve aynı buffer’a giden soluk bağlantı, read1(B) result’ı gelene kadar görünür kalır. Sonra sıradaki return bağlantısı açılır. Normal call sırasında ilerideki iki code parçası henüz gösterilmez.

## need-waiting-return

Bu mekanizmayı gördük. Gerçek uygulamada değiştirebileceğimiz bir return adresi de gerekli. ReLapse bunun için worker’ın bekleme durumunu kullanıyor.

## worker-normal → worker-result

Sayfa, postMessage ile bir işi Web Worker’a gönderebiliyor. Örnekte 120, 240 ve 360 gönderiliyor; worker bunları topluyor. Bu sırada sayfa kullanıcıya yanıt vermeyi sürdürüyor. Worker da result olan 720’yi postMessage ile geri gönderiyor.

Hareket: Gönderilen payload açıkça worker.postMessage([120, 240, 360]) olarak görünür. Reply sırasında eski send oku kapanır; aynı payload etiketi reply yönüne alınır ve postMessage(720) olur. Result, ters yöne giden okun yanında görünür.

## worker-wait → worker-resume

İşi bitince worker yeni mesajı bekliyor. Onu çalıştıran thread’in native stack’inde, beklemeden sonra devam edilecek return adresi duruyor. postMessage geldiğinde bekleme bitiyor ve buradan devam ediliyor.

Hareket: return: mesajı işle kaydı, kendi native stack etiketiyle açılır. Kayıt process çerçevesinin içinde boşluk bırakarak durur. Yeni postMessage, bekleyen worker’a giden aynı send yolunu kullanır.

## library-placement → find-library

Worker’ın bu return kaydı elimizde kalsın. Gideceğimiz function’ın adresine de ihtiyacımız var. Function’ın library içindeki offset’ini biliyoruz. Memory read ile o çalıştırmadaki library base’i bulunca, read adresi = library base + offset hesabını yapabiliyoruz.

Hareket: Önce eski wait bağlantısı kapanır. Aynı worker return kaydı process çerçevesini kesmeden sola taşınır. Memory read panelinde library base bulunur; library’nin köşesine giden ok veya orada beliren nokta yoktur. Hesap, gerçek read(…) satırı ve o satırın çerçevesiyle birlikte görünür. Sonuç, açıklamasız L yerine read adresi olarak adlandırılır. B, buffer adresidir; library base veya read adresiyle aynı değer değildir.

## worker-return-changes → name-rop

Bulduğumuz read adresini aynı worker return kaydına yazıyoruz. postMessage ile worker devam ettiğinde bu return, seçtiğimiz mevcut function’a gidiyor. Return adresleriyle mevcut code parçalarını sıraya koyduğumuz yönteme return-oriented programming, kısaca ROP deniyor. Hâlâ aynı process’in içindeyiz.

Hareket: Aynı read adresi değeri function’ın yanından return kaydına taşınır. Return bağlantısı, library’nin köşesine değil çerçevelenen read(…) satırına ulaşır. postMessage sonrasında çalışma işareti bu bağlantıyı izler. Üstte ROP başlığı açılmaz; terim, gösterilmiş somut mekanizmanın adı olarak seslendirmede tanıtılır.

## need-system-service → system-call

Bu function her işi tek başına yapmıyor. Dosya okuma gibi bir hizmet için kernel’e bir syscall yapması gerekiyor. Call’ı kullanıcı tarafındaki code başlatıyor; işi kernel yapıyor, result geri geliyor.

Hareket: Eski return bağlantısı önce kapanır. Aynı read(…) satırı görünür kalarak syscall çiziminin kullanıcı tarafına taşınır; başka bir etikete dönüşüp yeni bir aktörle değiştirilmez. syscall adı, tam da bu sınırı geçen request okunun yanında açılır.

## kernel-does-work

Libkernel, bu syscall’ın kullanıcı tarafındaki yolunda bulunan library. Normal bir uygulama da kernel’den hizmet isterken bu yolu kullanır.

## need-kernel-location → leaking-response

Bir syscall yapabilmek, kernel memory üzerinde kontrol sahibi olduğumuz anlamına gelmiyor. O adresleri de henüz bilmiyoruz. ReLapse bir route query’nin response’u içinden kernel’e ait bir adres elde ediyor. Normal route bilgisiyle bu adres ayrı gösteriliyor.

## kernel-placement

Sızan adres, kernel’in içinde konumu bilinen bir noktaya ait. O noktanın offset’iyle o çalıştırmadaki kernel base bulunabiliyor. Library için gördüğümüz adres hesabı burada kernel’e uygulanıyor.

## request-without-control

Kernel’den bir read request isteyebiliyoruz. Bu işi takip eden kayıtlar hâlâ kernel’in kontrolünde. Şimdi request’in başlatılmasıyla tamamlanması arasında hangi kayıtların yaşadığına bakalım.

## Kaynak ve kapsam

- Normal call/stack çizimi mekanizma modelidir; örnek byte’lar 06’dan korunur. read1(B), bir adresten tek byte okuyan örnek native function’dır; ReLapse’in bu isimde literal bir call yaptığı iddia edilmez.
- Library hesabı, bilinen base + offset ilişkisini gösterir; base’i öğrenmek, library’nin ilk byte’ını okumak veya oraya execution jump yapmak gibi çizilmez.
- Worker bekleme/return seçimi ve postMessage ile devam etme: [sabit main.js](https://github.com/ntfargo/Relapse-Exploit/blob/dd8e4e0914c5e9d066ee1f9b056be76cb992c8e0/src/main.js).
- ROP mevcut code’u kullanır. Ağ response’undaki leak’in kapalı kernel içindeki kök nedeni bu çizimde icat edilmez.
