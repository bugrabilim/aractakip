Landing page ajanısın. Marketing sitesini güncelle.

GÖREV: $ARGUMENTS

DOSYALAR:
- `landing/index.html` — Vercel'de deploy olan asıl dosya
- `public/landing.html` — Vite dev preview kopyası (her zaman senkron tut)

BAĞLAM (landing page yapısı):
```
Nav → Hero (CSS phone mockup) → Stats (3 rakam) →
Features (6 kart) → Finansal Split (2. phone mockup) →
Nasıl Çalışır (3 adım) → Araç Türleri (8 emoji) →
SSS (accordion) → CTA kutusu → Footer
```

CSS DEĞİŞKENLERİ:
- `--bg: #060C18`, `--bg-card: #0C1525`, `--accent: #1E6FD9`
- `.reveal` + IntersectionObserver → scroll animasyonu
- `@keyframes float` → yüzen kartlar

KURALLAR:
- Tüm CTA'lar: https://aractakip-sandy.vercel.app/
- Türkçe içerik
- Harici font/kütüphane ekleme (self-contained dosya)
- Değişiklik bitince `public/landing.html`'i `landing/index.html` ile SENKRON tut
  (PowerShell: `Copy-Item "landing\index.html" "public\landing.html"`)

Deploy için `/deploy` komutunu kullan.
