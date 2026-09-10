# ARAÇ TAKİP UYGULAMASI — MASTER DOKÜMAN v2.0

**Tarih:** Haziran 2026  
**Sahip:** Buğra Bilim  
**Durum:** 🟢 Canlıya alındı — Vercel deploy hazır

> Yeni bir Claude oturumunda bu dosyayı + `src/App.jsx`'i yükle, kaldığın yerden devam et.

---

## 1. PROJEYİ TANIYALIM

Türkiye odaklı çok araçlı yakıt/masraf/servis takip web uygulaması. Tarayıcı tabanlı React SPA — backend yok, sunucu yok. Tüm veri kullanıcının tarayıcısında tutuluyor.

**Aktif dosya:** `src/App.jsx` (1222 satır)  
**Görsel dil:** Drivvo birebir — açık gri zemin, lacivert üst bar, mavi vurgu, aktivite zaman çizelgesi ana ekran

---

## 2. PROJE DOSYA YAPISI

```
arac-takip-deploy/          ← deploy reposu (GitHub'a bu gidiyor)
├── src/
│   ├── App.jsx             ← TÜM UYGULAMA KODU (tek dosya)
│   └── main.jsx            ← React entry point (dokunma)
├── index.html              ← HTML şablonu (dokunma)
├── package.json            ← bağımlılıklar
├── vite.config.js          ← build config
├── vercel.json             ← SPA routing kuralı
└── MASTER_DOKUMAN.md       ← bu dosya
```

**Çalışma dizinleri (Claude container):**
- Geliştirme: `/home/claude/arac-takip-deploy/src/App.jsx`
- Outputs: `/mnt/user-data/outputs/yakit-takip-drivvo.jsx`

---

## 3. DEPLOY BİLGİLERİ

### Stack
| Katman | Teknoloji |
|--------|-----------|
| UI | React 18 (functional + hooks) |
| Build | Vite 5 |
| Deploy | Vercel (GitHub otomatik deploy) |
| Grafikler | recharts 2.12 |
| İkonlar | lucide-react **0.383.0** (versiyon kilitli — değiştirme) |
| Font | Inter (Google Fonts CDN) |
| Stil | Inline JS objeleri (Tailwind/CSS yok) |
| Storage | localStorage (web) / window.storage (Claude artifact) / bellekMap (fallback) |

### Build Komutları
```bash
npm install        # bağımlılıkları kur
npm run dev        # geliştirme sunucusu (localhost:5173)
npm run build      # production build → dist/ klasörü
npm run preview    # dist/ klasörünü lokal test
```

### Babel Sözdizimi Kontrolü (Claude container içinde)
```bash
cd /home/claude/arac-takip-deploy
node -e "
const babel = require('@babel/core');
const fs = require('fs');
try {
  babel.transformSync(fs.readFileSync('src/App.jsx','utf-8'), {presets:['@babel/preset-react'],filename:'App.jsx'});
  console.log('OK');
} catch(e) { console.error('HATA:',e.message); }
"
```

### Vercel Deploy Akışı
1. GitHub'a push → Vercel otomatik algılar
2. Framework: **Vite** (otomatik algılanır)
3. Build command: `npm run build`
4. Output dir: `dist`
5. Her push'ta otomatik yeniden deploy

---

## 4. MİMARİ — DRIVVO YAPISI

### 4.1 Ekran Akışı
```
App (root)
│
├── kod = null → GirisEkrani
│   ├── Sekme: Giriş (6 haneli kod gir)
│   ├── Sekme: Yeni Kod (oluştur + e-posta)
│   └── Sekme: Kodumu Unut (e-posta ile geri al)
│
└── kod var, arac yok → Karşılama + "Araç ekle" butonu
│
└── kod var, arac var → Ana Uygulama
    │
    ├── LACİVERT ÜST BAR
    │   ├── Sol: araç fotoğrafı/ikonu + "Marka Model" + ChevronDown → AracSecici açılır
    │   ├── Orta: üst bar sekmeleri (Akış / Finansal / Yakıt / Bilgi)
    │   └── Sağ: Düzenle (kalem) + Çıkış (X) butonları
    │
    ├── UYARI BANDI (varsa) — kırmızı/turuncu, tüm hatırlatmalar
    │
    ├── İÇERİK (aktif sekmeye göre)
    │   ├── Akış → ZamanCizelgesi (kronolojik olay listesi, ay gruplu)
    │   ├── Finansal → FinansalEkran (özet kart + donut + stacked bar + alım/satış)
    │   ├── Yakıt → YakitEkran (metrikler + L/100km bar grafik)
    │   └── Bilgi → BilgiEkran (araç detayları + belgeler + lastik + bakım)
    │
    ├── FAB (sağ alt, mavi +)
    │   └── Tıklayınca 3 hızlı işlem açılır:
    │       ├── Dolum (mavi, Fuel ikonu)
    │       ├── Masraf (turuncu, Receipt ikonu)
    │       └── Servis (yeşil, Wrench ikonu)
    │
    └── MODALLAR (bottom sheet, karanlık overlay)
        ├── AracSecici — tüm araçlar listesi + "Yeni araç ekle"
        ├── AracFormModal — 5 bölüm: Araç / Lastik / Belgeler / Bakım / Finansal
        ├── DolumFormModal — dolum ekleme/düzenleme
        ├── MasrafFormModal (tip="masraf") — masraf ekleme
        └── MasrafFormModal (tip="servis") — servis ekleme
```

### 4.2 State Yönetimi (App içinde)
```js
const [kod, setKod]               // 6 haneli kullanıcı kodu
const [veri, setVeri]             // { araclar, doldurmalar, masraflar, eposta }
const [aktifAracId, setAktifAracId] // seçili araç id'si
const [ekran, setEkran]           // "zaman" | "finansal" | "yakit" | "bilgi"
const [modal, setModal]           // "fab" | "aracSecici" | "arac" | "dolum" | "masraf" | "servis" | null
const [editKayit, setEditKayit]   // düzenlenen dolum/masraf kaydı
const [editArac, setEditArac]     // düzenlenen araç
```

### 4.3 Tema Renkleri (T nesnesi)
```js
const T = {
  bg: "#EFF1F4",          // sayfa zemini (açık gri)
  card: "#FFFFFF",         // kart zemini
  navy: "#13293D",         // lacivert üst bar
  primary: "#1E6FD9",      // mavi vurgu (butonlar, seçili state)
  primaryDim: "#E8F1FC",   // mavi soluk zemin
  text: "#1A2733",         // ana metin
  textSub: "#5C6B7A",      // ikincil metin
  textMuted: "#94A3B2",    // soluk metin
  border: "#E2E7EC",       // kenarlık
  borderLight: "#EDF0F3",  // hafif kenarlık (grafik gridleri)
  yakit: "#1E6FD9",        // dolum ikonu rengi (mavi)
  masraf: "#E8920C",       // masraf ikonu rengi (turuncu)
  servis: "#16A34A",       // servis ikonu rengi (yeşil)
  danger: "#DC2626",       // hata / geçmiş uyarı
  warning: "#E8920C",      // yaklaşan uyarı
  success: "#16A34A",      // başarı / pozitif
  dangerDim: "#FDECEC",    // hata zemin
  warningDim: "#FDF4E7",   // uyarı zemin
  successDim: "#E9F6EE",   // başarı zemin
}
```

---

## 5. VERİ MODELİ

### Storage Anahtarları
| Key | Değer |
|-----|-------|
| `data:{6HaneliKod}` | Tüm kullanıcı verisi (JSON) |
| `email:{eposta}` | Eposta → kod eşleştirmesi |

### Ana Veri Yapısı
```js
{
  araclar: [Arac, ...],
  doldurmalar: { [aracId]: [Dolum, ...] },
  masraflar:   { [aracId]: [Masraf, ...] },
  eposta: string | null
}
```

### Araç
```js
{
  id, tasitTipi, anaYakitTipi, lpgVarMi, yakitTipleri,
  marka, model, yil, plaka, sanziman, depoKapasitesi, foto,
  motorGucu, motorHacmi, silindirSayisi,
  // Lastik
  lastikTipi, lastikEbati, lastikDegisimTarihi, lastikDegisimKm, lastikFaturasi,
  // Belgeler
  muayeneBitis, egzozBitis, muayeneBelgesi,
  sigortaBitis, sigortaSirketi, sigortaPolicesi,
  kaskoYok, kaskoBitis, kaskoSirketi, kaskoPolicesi,
  mtvDonemi, mtvOdendi,
  // Bakım
  bakimPeriyoduKm, sonBakimTarihi, sonBakimKm,
  // Finansal
  alimTarihi, alimTutari, alimUsdKuru, alimAltinFiyati,
  satisTarihi, satisTutari, satisUsdKuru, satisAltinFiyati,
}
```

### Dolum
```js
{ id, tarih, km, yakitTipi, litre, tutar,
  istasyon, sehir, odemeYontemi, depoDoluluk, surusTipi, not,
  kmGorseli, fisGorseli }   // base64 görseller
```

### Masraf / Servis
```js
{ id, tip: "masraf"|"servis", kategori, aciklama,
  tarih, km, tutar, faturaGorseli }
```

---

## 6. İŞ MANTIĞI KURALLARI

### Yakıt Mantığı (Önceki versiyonlarda çok hata yapıldığı için kritik)
- Bir araç **tek ana yakıt** tipiyle çalışır (benzin / dizel / elektrik / hibrit)
- LPG her zaman benzinin üstüne ek dönüşümdür — sadece `anaYakitTipi=benzin` + `lpgVarMi=true` → `yakitTipleri=["benzin","lpg"]`
- Dolum formunda `yakitTipleri.length > 1` ise seçim yaptır, tekse otomatik kullan

### Tüketim Hesabı
```
tuketim = (litre / (şimdikiKm - öncekiKm)) * 100
```
Sadece **aynı yakıt tipindeki arka arkaya iki dolum** arasında hesaplanır.

### Uyarı Eşikleri
| Uyarı | Eşik |
|-------|------|
| Tarih bazlı (muayene, sigorta vb.) | 30 gün ve altı |
| Km bazlı bakım | 1000 km ve altı |
| Yıllık bakım | Son bakımdan 365 gün |

### Finansal (Özgün Özellik — Hiçbir Rakipte Yok)
```
toplamMaliyet = alimTutari + sum(masraflar) + sum(yakıtHarcaması)
karZarar = satisTutari - toplamMaliyet

alimUSD = alimTutari / alimUsdKuru
satisUSD = satisTutari / satisUsdKuru     → gerçek satın alma gücü karşılaştırması

alimAltin = alimTutari / alimAltinFiyati  // gram cinsinden
satisAltin = satisTutari / satisAltinFiyati
```

---

## 7. ORTAK BİLEŞENLER

| Bileşen | Kullanım |
|---------|----------|
| `Field` | Form alanı wrapper (etiket + içerik) |
| `Input` | Text/date/email input |
| `NumberInput` | Binlik ayraçlı sayı (`raw=true` = ayraçsız, yıl/silindir için) |
| `Select` | Dropdown |
| `Toggle` | iOS tarzı switch |
| `Chip` | Seçilebilir etiket/pill |
| `FotoAlani` | Kamera/galeri görsel ekleme (canvas sıkıştırma) |
| `BelgeAlani` | PDF veya görsel belge (max 5MB PDF) |
| `BosDurum` | Boş sayfa mesajı (ikon + başlık + açıklama) |
| `Modal` | Bottom sheet çerçeve (tutaç + başlık + X + overlay) |
| `ModalFooter` | Vazgeç + Kaydet + opsiyonel Sil butonu |
| `Metrik` | Küçük metrik kutusu (etiket + büyük sayı + alt not) |
| `olayStili(tip)` | "dolum"/"masraf"/"servis" → {ikon, renk, etiket} |

---

## 8. EKRANLAR VE MODALLAR

| Bileşen | Görevi |
|---------|--------|
| `GirisEkrani` | 3 sekmeli giriş (Giriş / Yeni Kod / Kodu Unut) |
| `ZamanCizelgesi` | Tüm olaylar kronolojik, ay gruplu, fotoğraf önizlemeli |
| `FinansalEkran` | Lacivert özet kart + donut + stacked bar + alım/satış |
| `YakitEkran` | 4 metrik + L/100km bar grafik |
| `BilgiEkran` | Araç / Muayene&Sigorta / Lastik / Bakım bölümleri |
| `AracSecici` | Bottom sheet araç listesi + yeni araç ekle |
| `AracFormModal` | 5 bölüm: Araç / Lastik / Belgeler / Bakım / Finansal |
| `DolumFormModal` | Dolum ekleme/düzenleme + birim fiyat otomatik |
| `MasrafFormModal` | Masraf veya Servis (tip parametresiyle), kategori seçimli |

---

## 9. AÇIK MADDELER — SONRAKİ GELİŞTİRMELER

### 🔴 Öncelik 1 — Hemen Yapılabilir
- [ ] **Veri export (CSV)** — Blob ile indirme linki, en kritik eksik. Rekabette de birinci sırada.
  ```js
  // Taslak mantık
  const csv = dolumlar.map(d => `${d.tarih},${d.km},${d.litre},${d.tutar}`).join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  // <a href={url} download="dolumlar.csv">
  ```
- [ ] **Araç kartı fotoğrafa tıklanınca büyük görüntüleme** — şu an küçük thumbnail var
- [ ] **Dolum/masraf silince onay modal** — şu an `confirm()` kullanıyoruz, native browser dialog, kötü UX

### 🟡 Öncelik 2 — Kısa Vadeli
- [ ] **Özelleştirilebilir bakım hatırlatıcıları** — kullanıcı kendi başlığını ve km/tarih periyodunu tanımlasın ("Triger 80.000 km'de" gibi). Şu an sadece tek genel bakım periyodu var.
- [ ] **Servis geçmişi özeti** — BilgiEkranı'nda toplam servis harcaması + son servis tarihi göster
- [ ] **Yakıt sekmesine dolum sayısı ve en son birim fiyat** ekle

### 🟢 Öncelik 3 — Orta Vade
- [ ] **Çoklu araç karşılaştırma** — hangi araç daha az yakıyor, daha az masraflı?
- [ ] **Yolculuk/trip kaydı** — başlangıç-bitiş km, mesafe, amaç (iş/özel)
- [ ] **Dark mode toggle** — şu an açık tema sabit

### ❌ Kapsam Dışı (Yüksek Maliyet / Bağımlılık)
- OBD2 donanım entegrasyonu
- Piyasa değeri API (sahibinden vb.)
- HGS/ceza sorgulama (resmi API)

---

## 10. RAKİP ANALİZİ ÖZETI

**Bizde olup rakiplerde olmayan:**
- USD / gram altın bazlı alım-satış analizi → Türkiye enflasyon ortamında benzersiz
- 8 taşıt türü + fiziksel olarak doğru LPG modelleme
- PDF belge saklama derinliği (muayene, sigorta, kasko poliçesi)
- Servis kayıtları kategorize (yağ, fren, lastik, triger vb.)

**Öncelikli eksikler (rakiplere göre):**
1. Veri export/yedekleme — Drivvo, Fuelio, AUTOsist'te standart
2. Özelleştirilebilir hatırlatıcılar
3. Topluluk benchmark (aynı araç ortalamasıyla kıyaslama)

---

## 11. ÇALIŞMA TERCİHLERİ

- **Dil:** Türkçe (arayüz + konuşma)
- **Karar verme:** Soru sorma, mantıklı kararı kendin ver, devam et
- **Her değişiklik sonrası:** Babel sözdizimi kontrolü (yukarıdaki komut)
- **Büyük değişikliklerde:** `npm run build` ile production build test et
- **Yeni özellik:** Önce `src/App.jsx`'e ekle, test et, sonra outputs'a kopyala
- **Stil:** Inline JS objeleri — Tailwind/CSS ekleme, `T` nesnesindeki renkleri kullan
- **İkon:** Sadece lucide-react@0.383.0 — başka kütüphane ekleme
- **Grafik:** Sadece recharts — başka kütüphane ekleme

---

## 12. YENİ OTURUMDA HIZLI BAŞLANGIÇ

```
1. Bu dosyayı (MASTER_DOKUMAN.md) Claude'a yükle
2. src/App.jsx'i de yükle
3. Şunu söyle:

"Bu araç takip uygulamasının master dokümanı ve kaynak kodu.
[yapmak istediğin değişiklik]"

Claude tüm bağlamı bu dosyadan geri yükler.
```

---

*Araç Takip Uygulaması — Master Doküman v2.0 | Haziran 2026 | Buğra Bilim*
