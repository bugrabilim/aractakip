# HANDOFF — Oturum Devir Dosyası

**Oluşturulma:** 2026-09-10
**Sebep:** Yerel klasör siliniyor, geliştirme buluttaki yeni Claude Code oturumundan devam edecek.
**Repo:** https://github.com/bugrabilim/aractakip.git (branch: `main`)

Bu dosya tek başına yeterlidir. Yeni oturumda bunu okuyan biri, önceki sohbete hiç bakmadan kaldığı yerden devam edebilir.

---

## 0. YENİ OTURUMDA YAPIŞTIRILACAK İLK MESAJ

Aşağıdaki bloğu olduğu gibi kopyalayıp yeni Claude Code oturumuna yapıştır:

```
Bu repoda çalışıyoruz: https://github.com/bugrabilim/aractakip.git

Önce şu üç dosyayı sırayla oku:
1. HANDOFF.md  — önceki oturumun tam devir notu (en önemlisi)
2. CLAUDE.md   — proje kuralları ve kısıtlar
3. STATUS.md   — özellik durumu ve yol haritası

Sonra `npm install` çalıştır ve `src/App.jsx` dosyasını oku.

Ardından HANDOFF.md §8'deki "Sonraki Adımlar" listesinin 1. maddesinden
devam et: Kurumsal Filo Faz 1'in son eksiği — Raporlar ekranı
(araç/sürücü karşılaştırma, aylık trend, CSV export).

Kurallar: Türkçe konuş, inline stil kullan (Tailwind yok),
lucide-react@0.383.0 sürümünü değiştirme, soru sormadan mantıklı kararı
kendin ver ve devam et.
```

---

## 1. PROJE NEDİR

Türkiye odaklı, çok araçlı yakıt / masraf / servis takip web uygulaması.
Tarayıcı tabanlı React SPA. Backend yok, sunucu yok — tüm veri kullanıcının tarayıcısında (`localStorage`).

**Sahip:** Buğra Bilim — tek kişilik geliştirme.
**Referans ürün:** Drivvo (görsel dil ve akış oradan alındı).

İki ürün kolu var:

| Ürün | URL | Durum |
|---|---|---|
| **Bireysel App** | https://aractakip-sandy.vercel.app/ | Canlı, çalışıyor |
| **Landing Page** | https://aractakip-acxr.vercel.app/ | Canlı, Bireysel/Kurumsal seçici eklendi |
| **Kurumsal Filo** | aractakip-sandy.vercel.app | Faz 1 kodlandı — Raporlar ekranı eksik |

---

## 2. BU SOHBETTE NE KONUŞULDU, NE YAPILDI

### 2.1 İstekler (kronolojik)

1. **"Adım 1 başla, hızlı MVP ile devam"** → Kurumsal tarafa geçiş için mimari seçimi yapıldı: Supabase yerine hızlı MVP (localStorage + şirket kodu).
2. **"Trio Mobil'i detaylı incele"** → Derin araştırma yapıldı (rakip analizi).
3. **"Bireysel tarafı tamamladık say. Artık kurumsal filo yönetimine çevirmek istiyorum. Tüm filo yönetim şirketlerini bul, analiz et, yol haritası oluştur."** → Kapsamlı pazar araştırması.
4. **"Ne alakası var, sadece yazılım satan çok fazla Türk şirket var. Yeterli araştırma yapmamışsın, tekrar araştır."** → ⚠️ İlk araştırma fazla global ve yüzeyseldi. Türkiye'ye özel ikinci tur yapıldı; Filorapor, ATS PRO, Lojiper, Bulut Filo bulundu.
5. **"Güncel durumu kontrol et, master dosya oluştur, GitHub'a kaydet."** → `STATUS.md` yazıldı ve push'landı.
6. **"HANDOFF.md yaz, dosyaları repoya taşı, push'la, yerel klasörü sil."** → Bu dosya.

### 2.2 Yazılan kod (commit'lerle)

| Commit | Ne yapıldı |
|---|---|
| `64fb663` | Responsive sidebar layout + `useEffect` import düzeltmesi |
| `2390629` | Akış ekranı yeniden tasarımı — hero özet kart + progressive disclosure |
| `8be2bc1` | Galeriden yükleme + **AI fiş tanıma** (Claude Haiku ile fotoğraftan otomatik alan doldurma) |
| `e904217` | Landing page Bireysel/Kurumsal ürün seçici + kurumsal bölümü + fiyatlandırma |
| `0610ca7` | `STATUS.md` — proje durumu ve kurumsal yol haritası |

### 2.3 Alınan kararlar (kilitli — tekrar tartışma)

- **Mimari:** Kurumsal MVP için Supabase **değil**, mevcut localStorage + paylaşımlı şirket kodu yaklaşımı. Supabase Faz 2'ye ertelendi.
- **Konumlanma:** "Türkiye'nin Fleetio'su" — yazılım-only, GPS donanımı satmıyoruz.
- **Hedef segment:** 10-100 araçlı Türk KOBİ'leri.
- **Fiyatlandırma:** ₺99/araç/ay (6-50 araç), ₺69/araç/ay (50+ araç), 1-5 araç ücretsiz. **Aylık ödeme** — yıllık taahhüt yok.
- **Gelir modeli:** Donanım satışı yok, kurulum ücreti yok.

### 2.4 Yarım kalanlar / yapılmayanlar

- ✅ **Kurumsal Filo Faz 1 kodlandı** (2026-09-10 oturumu). Kalan: Raporlar ekranı.
- ❌ Landing'deki kurumsal erken erişim formu **hiçbir yere veri göndermiyor** — sadece "Kaydınız alındı" mesajı gösteriyor. Backend/e-posta entegrasyonu yok.
- ❌ Derin araştırmaların doğrulama (verification) aşaması 3 kez rate limit'e takıldı. Bulgular ham çıktıdan elle sentezlendi — **kaynaklar tekrar doğrulanmadı.** Fiyat bilgilerini karar öncesi teyit et.
- ❌ `public/landing.html` (37 KB) eski sürüm, `landing/index.html` (52 KB) güncel sürüm. İkisi senkron değil — temizlik gerekiyor.
- ❌ `docs/handoff/yakit-takip-drivvo.jsx` ile `src/App.jsx` eskiden senkron tutuluyordu, artık **ayrıştılar**. Taslak dosya sadece tarihsel referans, güncel değil.

---

## 3. TEKNİK KÜNYE

| Katman | Teknoloji |
|---|---|
| UI | React 18 (functional + hooks) |
| Build | Vite 5 |
| Deploy | Vercel (GitHub `main` → otomatik) |
| Grafik | recharts 2.12 |
| İkon | lucide-react **0.383.0** — 🔒 sürüm kilitli |
| Font | Inter (Google Fonts CDN) |
| Stil | Inline JS objeleri (`T` nesnesi) — Tailwind/CSS class **yok** |
| Storage | `localStorage`, `stGet(k)` / `stSet(k, v)` wrapper'ları |
| AI | Claude Haiku `claude-haiku-4-5-20251001` (fiş tanıma) |

### Kritik kısıtlar (ihlal etme)

1. **`lucide-react@0.383.0` sürümünü değiştirme.** Yeni ikon eklemeden önce o sürümde var mı kontrol et.
2. **Tailwind yok, CSS class yok.** Sadece `style={{ }}` ve `T.*` sabitleri.
3. **Yorum satırı ekleme** — iyi isimlendirilmiş kod kendini açıklar.
4. **Türkçe arayüz** — tüm label, placeholder, hata mesajı Türkçe.
5. **Tek dosya mimarisi** — tüm uygulama `src/App.jsx` içinde (~2150 satır, 130 KB). Bölme, framework ekleme, state kütüphanesi kurma.

### Tema sabitleri (`T` nesnesi — `src/App.jsx` içinde)

```
T.bg         = "#EFF1F4"   sayfa arka planı
T.card       = "#FFFFFF"   kart arka planı
T.navy       = "#13293D"   header / navbar
T.primary    = "#1E6FD9"   CTA, aktif, yakıt rengi
T.masraf     = "#E8920C"   masraf / turuncu
T.servis     = "#16A34A"   servis / yeşil
T.text       = "#1A2733"   ana metin
T.textSub    = "#5C6B7A"   ikincil metin
T.textMuted  = "#94A3B2"   soluk metin
T.border     = "#E2E7EC"   kart border
T.primaryDim = "#E8F1FC"   primary arka plan tonu
T.warningDim = "#FDF4E7"   uyarı arka planı
T.dangerDim  = "#FDECEC"   hata arka planı
T.danger     = "#DC2626"
T.warning    = "#E8920C"
T.success    = "#16A34A"
```

### UI kuralları

- Kart: `borderRadius: 14`, `border: 1px solid T.border`, `background: T.card`
- Timeline kart sol border: `borderLeft: 4px solid {renk}`
- Input: `borderRadius: 12`, `padding: "14px 16px"`, `background: T.bg`
- Primary buton: `borderRadius: 12`, `padding: 14`, `background: T.primary`, `color: #fff`
- FAB: `borderRadius: 29`, `width/height: 58`
- Modal footer: `ModalFooter` bileşenini kullan

### Veri modeli

**Bireysel** — storage anahtarı `data:${kod}`, `kod` 6 haneli giriş kodu (kayıt gerekmez).

```js
veri = {
  araclar: [],        // AracForm[]
  doldurmalar: {},    // { [aracId]: DolumKayit[] }
  masraflar: {},      // { [aracId]: MasrafKayit[] }
  eposta: null,
  ad: null,
  telefon: null,
  ajanApiKey: null,   // Kullanıcının kendi Anthropic API anahtarı (opsiyonel)
}
```

**Kurumsal filo** — storage anahtarı `fleet:${sirketKodu}:veri`

```js
veri = {
  sirket: { ad, kod, olusturulma },
  araclar: [],
  suruculer: [],      // { id, kod, ad, telefon, atanmisAracId }
  doldurmalar: {},
  masraflar: {},
}
```

Sürücü kodu eşlemesi ayrı anahtarda: `surucu:${surucuKodu}` → `{ sirketKodu, surucuId }`.
Sürücü silinince eşlemeye `null` yazılır — kod geçersizleşir.

**Oturum nesnesi** — hangi storage anahtarının kullanılacağını `oturumAnahtari(oturum)` belirler.

```js
{ tur: "bireysel", kod }
{ tur: "kurumsal", rol: "admin", sirketKodu }
{ tur: "kurumsal", rol: "surucu", sirketKodu, surucuId }
```

### Ekran / modal haritası

```
GirisEkrani
  ├── mod: bireysel | kurumsal
  ├── bireysel sekme: giris | yeni | unut
  └── kurumsal sekme: giris (rol: admin | surucu) | sirket

App()
  ├── ekran: filo | suruculer | zaman | finansal | yakit | bilgi
  └── modal: fab | arac | dolum | masraf | servis | aracSecici | surucu | profil | filoHesap
```

`filo` / `suruculer` sadece yöneticide, `finansal` sürücüde gizli. Çizilen ekranı `gorunum`
değişkeni belirler — yöneticinin hiç aracı yokken `ekran` ne olursa olsun `filo`ya düşer.

Modal açmak için: `setModal("modal-adi")` + gerekirse `setEditKayit(kayit)`.

---

## 4. BİREYSEL APP — TAMAMLANAN ÖZELLİKLER

- [x] Çoklu araç yönetimi — 8 araç türü (otomobil, motosiklet, kamyon, karavan, tekne, tarım, jet ski, otobüs)
- [x] Yakıt dolum takibi — litre, km, birim fiyat, L/100km tüketim hesabı
- [x] Masraf yönetimi — sigorta, MTV, otopark, köprü geçişi vb.
- [x] Servis geçmişi — km bazlı
- [x] Finansal analiz — TL/USD/Altın bazlı kâr-zarar, alım-satım *(rakiplerde olmayan özgün özellik)*
- [x] Akış ekranı — hero özet kart (6 aylık sparkline) + progressive disclosure (5 kayıt, "Tümünü gör")
- [x] Responsive sidebar — desktop 220px sabit, mobil hamburger drawer 280px
- [x] Fotoğraf yükleme — kamera çek + galeriden seç
- [x] **AI fiş tanıma** — fotoğraftan tutar/litre/tarih/istasyon/şehir/km otomatik çıkarma
- [x] Profil modal — ad, e-posta, telefon, Anthropic API anahtarı
- [x] Demo modu — tek tıkla dolu hesap
- [x] Muayene / sigorta / kasko hatırlatmaları

### AI fiş tanıma — çalışma notu

`fisiTani(b64, apiKey)` fonksiyonu tarayıcıdan doğrudan Anthropic API'ye istek atıyor.
Zorunlu header: `anthropic-dangerous-direct-browser-access: true`
Kullanıcı kendi API anahtarını Profil modalından giriyor (`ajanApiKey`). Anahtar repoda yok, kullanıcının tarayıcısında duruyor.

---

## 5. LANDING PAGE — YAPILANLAR

Dosya: `landing/index.html` — bağımsız HTML/CSS/JS, Vite build gerektirmez.

- [x] "Uygulamayı Aç" butonları (nav, hero, CTA, footer — 4 adet) artık modal açıyor
- [x] Ürün seçici modal: **Bireysel** (mevcut app) / **Kurumsal** (erken erişim)
- [x] Kurumsal erken erişim modal: e-posta + şirket adı formu → "Kaydınız alındı" *(backend yok)*
- [x] Kurumsal bölümü: 4 özellik kartı (Filo Dashboard, Sürücü Yönetimi, Raporlar, Bakım Takvimi)
- [x] Fiyatlandırma bölümü: Bireysel ₺0 / Kurumsal Yakında
- [x] Nav: Özellikler, Kurumsal, Fiyatlandırma, SSS
- [x] SSS'e kurumsal sorusu

**Modal mekaniği:** CSS'te `display:none` taban + açarken inline `style.display='flex'`, animasyon için `classList.add/remove('open')`, kapanışta 250ms timeout. Escape tuşu ve overlay tıklaması kapatıyor, iç panel tıklaması `stopPropagation`.

---

## 6. PAZAR ARAŞTIRMASI BULGULARI

> ⚠️ Doğrulama aşaması rate limit nedeniyle tamamlanamadı. Fiyatları karar öncesi teyit et.

### Yazılım-ağırlıklı rakipler (GPS zorunlu değil) — asıl rakiplerimiz

| Şirket | GPS zorunlu? | Fiyat | Zayıf yanı |
|---|---|---|---|
| **Filorapor** (filorapor.com) | Hayır | ₺18.000/yıl (25 araç), ₺30.000/yıl (50 araç) → ~₺28,8/araç/ay | **Yıllık peşin taahhüt**, sürücü uygulaması belirsiz |
| **ATS PRO** (atspro.com.tr) | Opsiyonel | Gizli, demo talebi gerekiyor | Satış süreci ağır, şeffaf değil |
| **Lojiper** (lojiper.com) | Opsiyonel | Ücretsiz katman var, ücretli gizli | Filo yan ürün, sürücü uygulaması yok |

**En yakın direkt rakip: Filorapor.** Bizim farkımız → aylık ödeme, sürücü mobil uygulaması, self-servis kurulum, açık fiyat.

### Donanım zorunlu rakipler (farklı segment)

- Arvento (160.000+ müşteri, pazar lideri), Mobiliz, N2 Mobil, Seyir Mobil, TNB Mobil, Trio Mobil, Bulut Filo
- Telekom paketleri: Turkcell Kopilot (₺51,28/araç/ay + donanım), Vodafone, Türk Telekom

### Ortak müşteri şikâyetleri (sikayetvar.com, ekşisözlük)

1. Aktivasyon/kurulum gecikmeleri (Trio Mobil'de 3 ay bekleme vakası)
2. Müşteri hizmetleri kalitesi düşük (Mobiliz, Arvento)
3. Fiyat şeffaflığı yok — demo talebi, satış baskısı
4. Sürücü mobil uygulaması zayıf veya yok
5. Uzun sözleşme kilidi

### Bizim rekabet avantajlarımız

- GPS donanımı yok → kurulum sıfır, anında başlama
- Aylık ödeme, istediğin an iptal (Filorapor yıllık peşin istiyor)
- Fiyat web sitesinde açık
- Sürücü mobil uygulaması — saha veri girişi
- Türkçe + KDV uyumlu

---

## 7. KURUMSAL FİLO MVP — FAZ 1 KODLANDI

Veri modeli §3'te. Tasarımdan iki sapma:

- **`sirket.adminKodu` yazılmadı** — yönetici zaten şirket koduyla giriyor, ikinci kod hiçbir akışta
  kullanılmıyordu. Kullanılmayan alan bırakma kuralı gereği düşürüldü.
- **`suruculer[].kod` eklendi** — sürücü girişi 6 haneli koda dayanıyor, alan zorunluydu.
  Kod → şirket eşlemesi `surucu:{kod}` anahtarında, mevcut `email:{...}` deseniyle aynı.

**Roller:**
- **Yönetici** (şirket kodu ile girer) → filo paneli, sürücü yönetimi, araç ekleme, her aracın detayı
- **Sürücü** (sürücü kodu ile girer) → sadece atanmış aracına dolum/masraf/servis girişi.
  Finansal ekran, araç seçici, araç ekle/düzenle/sil kapalı; başka aracın verisi görünmüyor.

**Ekranlar:**
1. [x] **Filo Paneli** (`FiloEkran`) — araç grid'i, 4 metrik, birleşik kritik uyarı listesi
2. [x] **Sürücüler** (`SurucularEkran` + `SurucuFormModal`) — liste, araç ataması, kopyalanabilir sürücü kodu, kişi başı aylık maliyet
3. [x] **Araç Detay** — bireysel app'teki 4 sekme aynen yeniden kullanıldı
4. [ ] **Raporlar** — araç/sürücü karşılaştırma, aylık trend, CSV export

**Test edildi (Playwright, gerçek tarayıcı):** şirket kurma → araç ekle → sürücü ekle →
sürücü koduyla giriş → sürücünün kayıt girişi → yöneticinin kaydı görmesi; rol sızıntısı yok
(şirket kodu sürücü rolüyle giriş yapamıyor, sürücü başka aracı göremiyor). Bireysel taraf regresyonsuz.

### Faz 2 — sonraya bırakıldı

Supabase migrasyonu, gerçek kimlik doğrulama, Stripe faturalama, çoklu cihaz senkronizasyonu, bakım takvimi, CSV export.

---

## 8. SONRAKİ ADIMLAR (öncelik sırasıyla)

### 🔴 1 — Raporlar ekranı (Faz 1'in son eksiği)

1. Araç karşılaştırma tablosu — km, yakıt, masraf, TL/km
2. Sürücü karşılaştırma — kişi başı maliyet, aylık trend
3. Aylık trend grafiği — mevcut recharts `BarChart` desenini kullan
4. **CSV export** — bireysel tarafta da eksik; tek fonksiyon ikisini de karşılar

Başlangıç noktası: `FiloEkran` bileşeninin yanına `RaporEkran` ekle, `SolMenu`'deki
`filoItems` listesine bir giriş, `EKRAN_ADI`'ya bir başlık.

**Faz 1 tamamlandı:** kurumsal/sürücü giriş ayrımı, şirket kurma, filo paneli,
sürücü yönetimi, sürücünün kısıtlı görünümü — hepsi `src/App.jsx` içinde.

### 🟡 2 — Bireysel app backlog

- [ ] **CSV export** — Blob ile indirme; dolumlar/masraflar/servisler. *En kritik eksik.*
- [ ] Araç kartı fotoğraf büyütme modalı
- [ ] Silme onay modalı — tarayıcı `confirm()` yerine uygulama içi bottom sheet
- [ ] Özelleştirilebilir bakım hatırlatıcıları
- [ ] Servis geçmişi özeti — `BilgiEkranı`'nda toplam servis harcaması + son servis tarihi
- [ ] Yakıt sekmesi — dolum sayısı ve son birim fiyat

### 🟢 3 — Orta vade

- [ ] Çoklu araç karşılaştırma
- [ ] Yolculuk/trip kaydı
- [ ] Dark mode

### 🧹 4 — Temizlik

- [ ] `public/landing.html` eski sürüm — sil veya `landing/index.html` ile senkronla
- [ ] Landing kurumsal formu için gerçek bir toplama noktası (Formspree / Supabase / e-posta)

### ❌ Kapsam dışı

OBD2 entegrasyonu, piyasa değeri API'si, HGS/ceza sorgulama — yüksek maliyet ve harici bağımlılık.

---

## 9. DOSYA ENVANTERİ

```
repo/
├── HANDOFF.md              ← bu dosya
├── CLAUDE.md               ← proje kuralları (her oturumda ilk okunacak)
├── STATUS.md               ← özellik durumu ve yol haritası
├── src/
│   ├── App.jsx             ← TÜM UYGULAMA KODU (~2150 satır, 130 KB)
│   └── main.jsx            ← React entry point — dokunma
├── landing/
│   └── index.html          ← GÜNCEL landing page (52 KB, bağımsız)
├── public/
│   └── landing.html        ← ESKİ landing kopyası (37 KB) — temizlenecek
├── docs/handoff/
│   ├── MASTER_DOKUMAN.md   ← v2.0 master doküman (iş mantığı, veri modeli, rakip analizi)
│   ├── yakit-takip-drivvo.jsx ← App.jsx'in eski taslağı — tarihsel referans, GÜNCEL DEĞİL
│   ├── settings.local.json.ornek ← eski oturumun izin listesi
│   └── memory/             ← önceki oturumların bellek dosyaları
│       ├── MEMORY.md
│       ├── open_items.md
│       ├── project_overview.md
│       └── user_preferences.md
├── .claude/
│   ├── launch.json         ← Vite dev server config (port 5173)
│   └── commands/           ← slash komutları (ajan tanımları)
│       ├── deploy.md  feature.md  landing.md  review.md
│       └── ship.md    spy-drivvo.md  spy-market.md  spy-ux.md
├── index.html              ← HTML şablonu — dokunma
├── package.json
├── package-lock.json
├── vite.config.js
├── vercel.json             ← SPA routing kuralı
└── .gitignore              ← node_modules, dist, .DS_Store, *.local
```

**Repoda olmayan ve olmayacaklar:** `node_modules/` (97 MB, `npm install` ile gelir), `dist/` (`npm run build` ile gelir).
**Gizli anahtar / .env dosyası yok** — tarandı, temiz. Anthropic API anahtarı kullanıcının tarayıcısında.

---

## 10. ÇALIŞTIRMA NOTLARI

### Kurulum ve geliştirme

```bash
npm install        # bağımlılıkları kur (ilk iş)
npm run dev        # geliştirme sunucusu → localhost:5173
npm run build      # production build → dist/
npm run preview    # dist/ klasörünü lokal test et
```

Landing page'i test etmek için build gerekmez — `landing/index.html` dosyasını doğrudan tarayıcıda aç.

### Deploy akışı

```bash
# 1. Değişikliği yap
# 2. Build'i doğrula — HATA VARSA COMMIT ETME
npx vite build

# 3. Sadece değişen dosyaları ekle (-A kullanma)
git add src/App.jsx

# 4. Commit + push
git commit -m "feat: açıklama"
git push origin main

# 5. Vercel otomatik deploy alır (~30-60 sn)
```

Landing değişikliğinde build adımı gerekmez, doğrudan `git add landing/index.html`.

**İki ayrı Vercel projesi var:**
- Bireysel app → `dist/` klasöründen deploy
- Landing page → `landing/` klasöründen deploy

### Slash komutları (ajanlar)

| Komut | Sorumluluk |
|---|---|
| `/feature` | Yeni özellik geliştirme |
| `/review` | Kod inceleme, bug tespiti |
| `/deploy` | Build → commit → push |
| `/landing` | Marketing site güncellemeleri |
| `/ship` | feature + review + deploy zinciri |
| `/spy-drivvo` | Drivvo özellik/UI taraması |
| `/spy-market` | Pazar haritası, rakip analizi |
| `/spy-ux` | Mobil UX pattern araştırması |

---

## 11. ÇALIŞMA TERCİHLERİ (Buğra)

- **Dil:** Türkçe — arayüz, konuşma, commit mesajı, doküman.
- **Karar verme:** Soru sorup bekleme. Mantıklı kararı kendin ver ve devam et.
- **Cevap stili:** Kısa ve net. Uzun açıklama yerine çalışan kod.
- **Büyük değişiklikte:** `npm run build` ile production build'i test et.
- **Commit:** Sadece değişen dosyaları ekle, `git add -A` kullanma.

---

## 12. BİLİNMESİ GEREKEN TUZAKLAR

1. **Yakıt mantığı** — önceki sürümlerde defalarca hata yapıldı. Tüketim hesabı iki dolum arasındaki km farkına dayanır; ilk dolumda tüketim hesaplanamaz. `docs/handoff/MASTER_DOKUMAN.md` §6'yı oku.
2. **`useEffect` import'u** — bir kez unutuldu ve build'i kırdı. `src/App.jsx` ilk satırındaki import'a yeni hook eklerken dikkat et.
3. **lucide-react ikonları** — 0.383.0'da olmayan bir ikon import edersen build sessizce değil, gürültülü kırılır. Önce sürümde var mı bak.
4. **İki landing dosyası** — `landing/index.html` güncel, `public/landing.html` eski. Yanlış olanı düzenleme.
5. **`git commit -m` ve Türkçe karakterler (PowerShell)** — PowerShell 5.1'de here-string ile çok satırlı Türkçe commit mesajı parse hatası veriyor. Tek satır ASCII commit mesajı kullan veya Bash tool'a geç.
6. **AI fiş tanıma test edilemez** — kullanıcının kendi Anthropic API anahtarı gerekiyor, repoda anahtar yok.

---

## 13. VERSİYON GEÇMİŞİ

| Tarih | Değişiklik |
|---|---|
| 2026-06-19 | Proje kuruldu, Vercel'e deploy edildi, `MASTER_DOKUMAN.md` v2.0 yazıldı |
| 2026-06-20 | Responsive sidebar, Akış ekranı yeniden tasarımı, AI fiş tanıma |
| 2026-06-22 | Landing page Bireysel/Kurumsal ayrımı |
| 2026-07-01 | `STATUS.md` — pazar araştırması ve kurumsal yol haritası |
| 2026-09-10 | `HANDOFF.md` — yerel klasör kapatıldı, buluta devir |
| 2026-09-10 | **Kurumsal Filo Faz 1** — giriş rol ayrımı, şirket kurma, filo paneli, sürücü yönetimi, sürücü kısıtlı görünümü |
