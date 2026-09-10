# Araç Takip — Claude Code Kılavuzu

Bu dosya tüm ajanlar tarafından okunur. Kuralları değiştirmeden önce kullanıcıyla konuş.

> **Yeni oturum açtıysan:** Önce `HANDOFF.md` dosyasını oku — önceki oturumun tam devir notu orada
> (alınan kararlar, yarım kalanlar, pazar araştırması, kurumsal MVP tasarımı). Bu dosya sadece kuralları
> ve mevcut durumun özetini içerir. Özellik durumu için `STATUS.md`.

---

## Mimari

| Katman | Detay |
|---|---|
| Framework | React 18 SPA, Vite 5 |
| Stil | Inline `style={{ }}` + `T.*` tema nesnesi (Tailwind YOK, CSS class YOK) |
| Storage | `localStorage` wrapper: `stGet(k)` / `stSet(k, v)` |
| Backend | YOK — bireysel veri `data:${kod}`, filo verisi `fleet:${sirketKodu}:veri` anahtarında |
| Deploy | GitHub `main` → Vercel otomatik |

**Tek dosya mimarisi:** Tüm uygulama kodu `src/App.jsx` içinde (~2150 satır, 130 KB).  
Landing page ayrı: `landing/index.html` (bağımsız HTML/CSS/JS dosyası).

⚠️ `public/landing.html` eski bir kopyadır, düzenleme. Güncel landing: `landing/index.html`.

---

## Kritik Kısıtlar

1. **`lucide-react@0.383.0` — sürümü değiştirme.** Yeni ikon eklerken önce o sürümde var mı kontrol et.
2. **Tailwind yok, CSS class yok.** Sadece `style={{ }}` ve `T.*` sabitleri.
3. **Yorum satırı ekleme** — iyi isimlendirilmiş kod kendini açıklar.
4. **Türkçe UI** — tüm label, placeholder, hata mesajları Türkçe.
5. **Backward compat hack'leri ekleme** — kullanılmayan kodu direkt sil.

---

## Tema Sabitleri (T nesnesi — App.jsx içinde)

```
T.bg         = "#EFF1F4"   ← sayfa arka planı
T.card       = "#FFFFFF"   ← kart arka planı
T.navy       = "#13293D"   ← header / navbar
T.primary    = "#1E6FD9"   ← CTA, aktif, yakıt rengi
T.masraf     = "#E8920C"   ← masraf / turuncu
T.servis     = "#16A34A"   ← servis / yeşil / başarı
T.text       = "#1A2733"   ← ana metin
T.textSub    = "#5C6B7A"   ← ikincil metin
T.textMuted  = "#94A3B2"   ← soluk metin
T.border     = "#E2E7EC"   ← kart border
T.primaryDim = "#E8F1FC"   ← primary arka plan tonu
T.warningDim = "#FDF4E7"   ← uyarı arka planı
T.dangerDim  = "#FDECEC"   ← hata arka planı
T.danger     = "#DC2626"   ← hata / tehlike
T.warning    = "#E8920C"   ← uyarı
T.success    = "#16A34A"   ← başarı
```

---

## Veri Yapısı

**Bireysel** — `data:${kod}`

```js
veri = {
  araclar: [],          // AracForm objelerinin listesi
  doldurmalar: {},      // { [aracId]: DolumKayit[] }
  masraflar: {},        // { [aracId]: MasrafKayit[] }
  eposta: null,
  ad: null,
  telefon: null,
  ajanApiKey: null,     // Anthropic API key (kullanıcı opsiyonel)
}
```

**Kurumsal filo** — `fleet:${sirketKodu}:veri`

```js
veri = {
  sirket: { ad, kod, olusturulma },
  araclar: [],
  suruculer: [],        // { id, kod, ad, telefon, atanmisAracId }
  doldurmalar: {},
  masraflar: {},
}
```

Sürücü kodu → şirket eşlemesi ayrı anahtarda: `surucu:${surucuKodu}` → `{ sirketKodu, surucuId }`.
Silinen sürücünün eşlemesi `null` yazılarak geçersizleştirilir.

**Oturum nesnesi** — `App()` içinde tutulur, storage anahtarını `oturumAnahtari(oturum)` üretir.

```js
{ tur: "bireysel", kod }
{ tur: "kurumsal", rol: "admin", sirketKodu }
{ tur: "kurumsal", rol: "surucu", sirketKodu, surucuId }
```

---

## Ekran / Modal Haritası

```
GirisEkrani
  ├── mod: bireysel | kurumsal
  ├── bireysel sekme: giris | yeni | unut
  └── kurumsal sekme: giris (rol: admin | surucu) | sirket

App()
  ├── ekran: filo | suruculer | zaman | finansal | yakit | bilgi
  └── modal: fab | arac | dolum | masraf | servis | aracSecici | surucu | profil | filoHesap
```

`filo` / `suruculer` sadece yöneticide, `finansal` sürücüde gizli. Ekranda ne çizileceğini
`gorunum` değişkeni belirler — yöneticinin hiç aracı yokken `ekran` ne olursa olsun `filo`ya düşer.

Modal açmak için: `setModal("modal-adi")` + gerekirse `setEditKayit(kayit)`.

---

## UI Kuralları

- Kart: `borderRadius: 14`, `border: 1px solid T.border`, `background: T.card`
- Timeline kart sol border: `borderLeft: 4px solid {renk}`
- Input: `borderRadius: 12`, `padding: "14px 16px"`, `background: T.bg`
- Buton (primary): `borderRadius: 12`, `padding: 14`, `background: T.primary`, `color: #fff`
- FAB: `borderRadius: 29`, `width/height: 58`, `background: T.primary`
- Modal footer: `ModalFooter` komponenti kullan

---

## Deploy Pipeline

```
src/App.jsx veya landing/index.html değiştir
  → npx vite build   ← hata varsa commit ETME
  → git add <dosya>  ← sadece değişen dosyaları, -A kullanma
  → git commit -m "feat/fix/chore: açıklama"
  → git push origin main
  → Vercel otomatik deploy alır (~30-60 sn)
```

**URL'ler:**
- App: https://aractakip-sandy.vercel.app/
- Landing: https://aractakip-acxr.vercel.app/
- GitHub: https://github.com/bugrabilim/aractakip.git

---

## Ajan Rolleri

| Komut | Ajan | Sorumluluk |
|---|---|---|
| `/feature` | Feature Agent | Yeni özellik geliştirme |
| `/review` | Review Agent | Kod inceleme, bug tespiti |
| `/deploy` | Deploy Agent | Build → commit → push |
| `/landing` | Landing Agent | Marketing site güncellemeleri |
| `/ship` | Orchestrator | feature + review + deploy pipeline |
| `/spy-drivvo` | Drivvo Spy | Drivvo'nun özellik / UI / review taraması |
| `/spy-market` | Market Spy | Pazar haritası, rakip analizi, trendler |
| `/spy-ux` | UX Spy | Mobil UX pattern araştırması, görsel iyileştirme önerileri |

**Önerilen workflow:**
```
/spy-drivvo → bulgular → /ship "bulunan özelliği implement et"
/spy-ux     → bulgular → /feature "önerilen UI değişikliğini uygula"
/spy-market → bulgular → ürün kararı → /ship
```

Ajanlar birbirini `Agent` tool ile çağırır. Her ajan bu CLAUDE.md'yi okuyarak bağlamı alır.

---

## Mevcut Durum (2026-09-10)

| Ürün | Durum |
|---|---|
| **Bireysel App** | Canlı ve çalışıyor. Çoklu araç, yakıt/masraf/servis takibi, finansal analiz, AI fiş tanıma, responsive sidebar tamam. |
| **Landing Page** | Canlı. Bireysel/Kurumsal ürün seçici modal, kurumsal bölümü, fiyatlandırma eklendi. |
| **Kurumsal Filo** | **Faz 1 kodlandı** — kurumsal/sürücü giriş ayrımı, şirket kurma, filo paneli, sürücü yönetimi, sürücünün kısıtlı görünümü. Eksik: Raporlar ekranı. |

### Kilitli ürün kararları — tartışma, uygula

- **Kurumsal mimari:** Supabase değil, mevcut localStorage + paylaşımlı şirket kodu (Faz 1). Supabase Faz 2'ye ertelendi.
- **Konumlanma:** "Türkiye'nin Fleetio'su" — yazılım-only, GPS donanımı satmıyoruz.
- **Hedef segment:** 10-100 araçlı Türk KOBİ'leri.
- **Fiyatlandırma:** ₺99/araç/ay (6-50 araç), ₺69/araç/ay (50+ araç), 1-5 araç ücretsiz. Aylık ödeme, yıllık taahhüt yok.
- **En yakın rakip:** Filorapor — GPS gerektirmiyor ama yıllık peşin taahhüt istiyor (~₺28,8/araç/ay). Bizim farkımız: aylık ödeme, sürücü mobil uygulaması, self-servis kurulum, açık fiyat.

### Kurumsal Filo Faz 1 — tamamlandı

- [x] `GirisEkrani` bireysel/kurumsal mod ayrımı + yönetici/sürücü rol seçimi
- [x] Şirket kurma akışı — 6 haneli şirket kodu üretimi
- [x] `FiloEkran` — araç grid'i, filo metrikleri, birleşik kritik uyarı listesi
- [x] `SurucularEkran` + `SurucuFormModal` — sürücü ekle/düzenle/sil, araç ataması, sürücü kodu üretimi
- [x] Sürücü rolü kısıtlı giriş — sadece atanmış aracı; finansal ekran ve araç yönetimi kapalı

**Roller:** Yönetici (şirket kodu ile girer) → filo paneli, sürücü yönetimi, araç ekleme. Sürücü (sürücü kodu ile girer) → sadece kendi aracına dolum/masraf/servis girişi.

**Sıradaki iş — Raporlar ekranı:** araç/sürücü karşılaştırma, aylık trend, CSV export.

### Bireysel app backlog

CSV export (en kritik eksik) · fotoğraf büyütme modalı · silme onay modalı (`confirm()` yerine) · özelleştirilebilir bakım hatırlatıcıları · servis geçmişi özeti.

---

## Tuzaklar

1. **Yakıt mantığı** — önceki sürümlerde defalarca hata yapıldı. Tüketim iki dolum arasındaki km farkına dayanır; ilk dolumda hesaplanamaz. Detay: `docs/handoff/MASTER_DOKUMAN.md` §6.
2. **`useEffect` import'u** — bir kez unutuldu, build kırıldı. `src/App.jsx` ilk satırındaki import'a yeni hook eklerken dikkat.
3. **lucide-react ikonları** — 0.383.0'da olmayan ikon build'i kırar. Önce sürümde var mı bak.
4. **İki landing dosyası** — `landing/index.html` güncel, `public/landing.html` eski.
5. **PowerShell + Türkçe commit mesajı** — PowerShell 5.1'de here-string ile çok satırlı Türkçe mesaj parse hatası veriyor. Tek satır ASCII kullan ya da Bash tool'a geç.
6. **AI fiş tanıma test edilemez** — kullanıcının kendi Anthropic API anahtarı gerekiyor, repoda anahtar yok.

---

## Çalışma Tercihleri (Buğra)

- **Dil:** Türkçe — arayüz, konuşma, commit mesajı, doküman.
- **Karar verme:** Soru sorup bekleme. Mantıklı kararı kendin ver ve devam et.
- **Cevap stili:** Kısa ve net. Uzun açıklama yerine çalışan kod.
- **Commit:** Sadece değişen dosyaları ekle, `git add -A` kullanma.
- **Büyük değişiklikte:** `npm run build` ile production build'i doğrula.

---

## Arşiv — `docs/handoff/`

| Dosya | Ne işe yarar |
|---|---|
| `MASTER_DOKUMAN.md` | v2.0 master doküman — iş mantığı kuralları, veri modeli, rakip analizi |
| `yakit-takip-drivvo.jsx` | `App.jsx`'in eski taslağı — tarihsel referans, **güncel değil** |
| `memory/` | Önceki oturumların bellek dosyaları (tercihler, açık maddeler) |
| `settings.local.json.ornek` | Eski oturumun izin listesi |
