# 🚀 VoltaCik Gelişmiş Discord Botu v14

**VoltaCik** tarafından geliştirilen bu Discord botu, en güncel **Discord.js v14** sürümü ile hazırlanmış, geniş fonksiyonlara sahip, tam özellikli bir moderasyon botudur. Sunucularınızı yönetmek, moderasyon sağlamak, eğlence komutları kullanmak ve daha fazlasını yapmak için ideal bir çözümdür.

## 🎯 Özellikler

✅ **Güncel ve Optimize** - En yeni Discord.js v14 sürümü ile hazırlanmış, performans odaklı kod yapısı.
✅ **Geniş Komut Yelpazesi** - Moderasyon, eğlence, kullanıcı bilgileri ve daha fazlasını içeren birçok komut.
✅ **Otomatik Log Sistemi** - Tüm işlemler kayıt altına alınır ve belirlenen kanallara gönderilir.
✅ **Kolay Kullanım** - Komutları anlamak ve kullanmak için sade bir yapı.
✅ **Özelleştirilebilir** - `config.json` dosyası ile sunucuya özel ayarlar yapabilirsiniz.

## 📥 Kurulum

Botu kendi sunucunuzda çalıştırmak için aşağıdaki adımları takip edebilirsiniz:

### 1️⃣ Gerekli Bağımlılıkları Yükleyin
```sh
npm install
```

### 2️⃣ `config.json` Dosyasını Düzenleyin
**Botun düzgün çalışması için `config.json` dosyanızı eksiksiz ve doğru bir şekilde doldurduğunuzdan emin olun!**

```json
{
  "token": "bot tokenin",
  "rulesChannelId": "kurallar kanalı idsi",
  "otorol": "sunucuya giricek kişilere vericek otomatik rol",
  "welcomeChannel": "hoşgeldin kanalı idsi",
  "welcomeImageUrl": "./resimler/hosgeldin.png", // yeni girenleri gösterirken altına ekliyeceği resim yolu
  "logChannel": "bannedwords logları giriş cıkıs logları kanal idsi",
  "ticketCategory": "ticket kategorisi",
  "ticketLogChannel": "kapatılan ticket log kanalı",
  "ticketStaffRole": "ticket yetkilisi rol idsi",
  "ticketSystem": {
    "categoryId": "üsttekilerle birebiraynı yapmanız lazım ",
    "logChannelId": "log channel idsi",
    "staffRoleId": "ticket yetkilisi rol idsi",
    "transcriptChannelId": "ticket log channel idsi"
  },
  "registerSystem": {
    "verifiedRoleId": "kayıt sistemi kuralları okıyan ve kayıt ol butonuna basan kişilere verilcek kayılı rol idsi",
    "memberRoleId": "verifed rolle ayni ıdsyi giriniz",
    "registerChannelId": "kayıt kanalı idsi",
    "welcomeImage": "./resimler/welcome.png"
  },
  "bannedWords": [
    "allah",
    "şehit",
    "sehid",
    "muhammed",
    "muhammet",
    "discord.gg",
    "html",
    "https",
    "amk"
  ],
  "rolePermissions": {},
  "whitelist": [
    "yasaklamalardan etkilenmeyecek kişiler",
    "763443363126706186"
  ]
}

```

### 3️⃣ Botu Çalıştırın
```sh
node index.js
```

## 📌 Kullanım
Botun komutları `/` (slash) komut sistemi ile entegre edilmiştir. **Tüm komutlar ve yetkilendirme ayarları eksiksiz olarak düşünülmüştür.** Yeni eventler veya ek komutlar eklemek isterseniz, event yapısı botun tamamını etkileyecek şekilde tasarlanmıştır.

### 🖼️ `/sunucu` ve `/spoofer` Komutları
Bu komutları kullanırken **eklediğiniz `value` değeri** ile eşleşen bir resim dosyasının **`./resimler/`** dizininde bulunması gerekmektedir.

**Örnek:**
```
/spoofer cs2
```
Bu komutu çalıştırırken, bot `./resimler/cs2.png` dosyasını kullanacaktır. Eğer dosya mevcut değilse, hata alabilirsiniz. Bu yüzden **ilgili resimleri doğru adlandırarak `./resimler/` klasörüne eklediğinizden emin olun!**

## 🛠️ Destek ve İletişim
Daha fazla bilgi veya destek için aşağıdaki bağlantıları kullanabilirsiniz:

🔗 **GitHub:** [VoltaCik](https://github.com/voltacik/)
🔗 **Discord:** [VoltaCik](https://discord.com/users/voltacik)

🎉 **Botu kullanırken karşılaştığınız herhangi bir sorun olursa, yukarıdaki bağlantılar üzerinden benimle iletişime geçebilirsiniz!**

🚀 **İyi Kullanımlar!**

