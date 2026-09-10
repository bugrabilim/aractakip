---
name: project-overview
description: "Araç Takip uygulamasının stack, mimari ve dosya yapısı hakkında temel bilgiler"
metadata: 
  node_type: memory
  type: project
  originSessionId: a75ed633-dbb4-4251-b371-4e40ae4d8845
---

## Proje Özeti

Türkiye odaklı çok araçlı yakıt/masraf/servis takip web uygulaması. Backend yok, sunucu yok — tüm veri tarayıcıda tutuluyor.

**Why:** Drivvo birebir görsel dil, Türkiye'ye özgü özellikler (USD/altın bazlı alım-satış analizi, LPG desteği, PDF poliçe saklama).

**How to apply:** Yeni özellik eklerken Drivvo görsel diline ve mevcut stil sistemine (T nesnesi, inline JS stilleri) bağlı kal.

## Stack

| Katman | Teknoloji |
|--------|-----------|
| UI | React 18 (functional + hooks) |
| Build | Vite 5 |
| Deploy | Vercel (GitHub otomatik) |
| Grafikler | recharts 2.12 |
| İkonlar | lucide-react **0.383.0** (kilitli — değiştirme) |
| Font | Inter (Google Fonts CDN) |
| Stil | Inline JS objeleri (`T` nesnesi) |
| Storage | localStorage (web) / window.storage (artifact) / bellekMap (fallback) |

## Dosya Yapısı

```
arac-takip-deploy/
├── repo/
│   ├── src/
│   │   ├── App.jsx       ← TÜM KOD (1223 satır, tek dosya)
│   │   └── main.jsx      ← entry point (dokunma)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
├── yakit-takip-drivvo.jsx  ← App.jsx'in output kopyası
└── MASTER_DOKUMAN.md       ← proje master dokümanı (detaylı)
```

## Tema (T nesnesi)

```js
T.bg = "#EFF1F4"      // zemin
T.navy = "#13293D"    // üst bar
T.primary = "#1E6FD9" // mavi vurgu
T.yakit = "#1E6FD9"   // mavi
T.masraf = "#E8920C"  // turuncu
T.servis = "#16A34A"  // yeşil
T.danger = "#DC2626"
T.warning = "#E8920C"
```

## State (App root)

```js
[kod]          // 6 haneli kullanıcı kodu
[veri]         // { araclar, doldurmalar, masraflar, eposta }
[aktifAracId]  // seçili araç
[ekran]        // "zaman" | "finansal" | "yakit" | "bilgi"
[modal]        // "fab"|"aracSecici"|"arac"|"dolum"|"masraf"|"servis"|null
[editKayit]    // düzenlenen dolum/masraf
[editArac]     // düzenlenen araç
```

## Storage Anahtarları

- `data:{6HaneliKod}` → tüm kullanıcı verisi
- `email:{eposta}` → eposta → kod eşleştirmesi
