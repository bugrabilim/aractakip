# Araç Takip — Claude Code Kılavuzu

Bu dosya tüm ajanlar tarafından okunur. Kuralları değiştirmeden önce kullanıcıyla konuş.

---

## Mimari

| Katman | Detay |
|---|---|
| Framework | React 18 SPA, Vite 5 |
| Stil | Inline `style={{ }}` + `T.*` tema nesnesi (Tailwind YOK, CSS class YOK) |
| Storage | `localStorage` wrapper: `stGet(k)` / `stSet(k, v)` |
| Backend | YOK — tüm veri `data:${kod}` anahtarında localStorage'da |
| Deploy | GitHub `main` → Vercel otomatik |

**Tek dosya mimarisi:** Tüm uygulama kodu `src/App.jsx` içinde (~1300 satır).  
Landing page ayrı: `landing/index.html` (bağımsız HTML/CSS/JS dosyası).

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

---

## Ekran / Modal Haritası

```
GirisEkrani
  └── sekme: giris | yeni | unut

App()
  ├── ekran: zaman | finansal | yakit | bilgi
  └── modal: fab | arac | dolum | masraf | servis | aracSecici | profil
```

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

Ajanlar birbirini `Agent` tool ile çağırır. Her ajan bu CLAUDE.md'yi okuyarak bağlamı alır.
