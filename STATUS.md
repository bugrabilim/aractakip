# Araç Takip — Proje Durum Dosyası

> Bu dosyayı yeni session başında Claude'a "STATUS.md'yi oku ve kaldığımız yerden devam et" diyerek ver.  
> Son güncelleme: 2026-06-22

---

## Genel Bakış

İki ürünlü bir araç takip platformu geliştiriyoruz:

| Ürün | URL | Durum |
|---|---|---|
| **Bireysel App** | aractakip-sandy.vercel.app | ✅ Canlı, tamamlandı |
| **Landing Page** | aractakip-acxr.vercel.app | ✅ Canlı, Bireysel/Kurumsal seçici eklendi |
| **Kurumsal Filo** | — | 🔜 Tasarım tamamlandı, kodlama başlamadı |

GitHub: https://github.com/bugrabilim/aractakip.git  
Son commit: `e904217` — feat: landing page Bireysel/Kurumsal ürün seçici

---

## Bireysel App — Tamamlanan Özellikler

**Temel mimari:**
- React 18 SPA, Vite 5, tek dosya `src/App.jsx` (~1800+ satır)
- localStorage veri saklama: `stGet(k)` / `stSet(k, v)`
- 6 haneli giriş kodu sistemi (kayıt gerekmez)
- `lucide-react@0.383.0` — sürümü değiştirme
- Inline style, T.* tema nesnesi (Tailwind yok, CSS class yok)

**Tamamlanan özellikler:**
- [x] Çoklu araç yönetimi (8 araç türü: otomobil, motosiklet, kamyon, karavan, tekne, tarım, jet ski, otobüs)
- [x] Yakıt dolum takibi (litre, km, birim fiyat, L/100km hesaplama)
- [x] Masraf yönetimi (sigorta, MTV, otopark, köprü geçişi vb.)
- [x] Servis geçmişi (km bazlı)
- [x] Finansal analiz (TL/USD/Altın bazlı kâr-zarar, alım-satım)
- [x] Akış ekranı — hero özet kart (6 aylık sparkline BarChart) + progressive disclosure (5 kayıt göster, "Tümünü gör" ile genişlet)
- [x] Responsive sidebar (desktop 220px sabit, mobil hamburger drawer 280px)
- [x] `useGenis()` hook — window.innerWidth >= 768 kontrolü
- [x] Fotoğraf yükleme: kamera çek + galeriden seç (ikisi aynı anda aktif)
- [x] AI fiş tanıma — Claude Haiku (`claude-haiku-4-5-20251001`) ile fotoğraftan otomatik alan doldurma
  - `fisiTani(b64, apiKey)` fonksiyonu: tutar, litre, tarih, istasyon, şehir, km çıkarır
  - `anthropic-dangerous-direct-browser-access: true` header gerekli (browser'dan direkt API çağrısı)
- [x] Profil modal — ad, e-posta, telefon, Anthropic API key alanı
- [x] Demo modu — tek tıkla dolu hesap açma
- [x] Muayene/sigorta/kasko hatırlatmaları (Bilgi ekranı)

**Tema sabitleri (T nesnesi — App.jsx içinde):**
```
T.bg="#EFF1F4", T.card="#FFFFFF", T.navy="#13293D"
T.primary="#1E6FD9", T.masraf="#E8920C", T.servis="#16A34A"
T.text="#1A2733", T.textSub="#5C6B7A", T.textMuted="#94A3B2"
T.border="#E2E7EC", T.primaryDim="#E8F1FC"
T.danger="#DC2626", T.warning="#E8920C", T.success="#16A34A"
```

**Ekran / Modal haritası:**
```
GirisEkrani (sekme: giris | yeni | unut)
App()
  ├── ekran: zaman | finansal | yakit | bilgi
  └── modal: fab | arac | dolum | masraf | servis | aracSecici | profil
```

---

## Landing Page — Tamamlanan Değişiklikler

Dosya: `landing/index.html` (bağımsız HTML/CSS/JS, Vite build gerektirmez)

**Yapılanlar:**
- [x] "Uygulamayı Aç" butonu → modal açıyor (nav, hero, CTA, footer'daki 4 buton)
- [x] Ürün seçici modal: Bireysel (mevcut app) / Kurumsal (erken erişim)
- [x] Kurumsal erken erişim modal: e-posta + şirket adı formu, "Kaydınız alındı" onayı
- [x] Yeni "Kurumsal" landing section: 4 özellik kartı (Filo Dashboard, Sürücü Yönetimi, Raporlar, Bakım Takvimi)
- [x] Fiyatlandırma section: Bireysel ₺0 / Kurumsal Yakında
- [x] Nav güncellendi: Özellikler, Kurumsal, Fiyatlandırma, SSS
- [x] SSS'e kurumsal sorusu eklendi

---

## Kurumsal Filo — Karar ve Tasarım

### Strateji Kararları
- **Mimari seçim: Hızlı MVP** → localStorage + şirket kodu (Supabase Faz 2)
- **Hedef segment:** 10-100 araçlı Türk KOBİ'leri
- **Konumlanma:** "Türkiye'nin Fleetio'su" — yazılım-only, GPS donanım gerektirmez, aylık ödeme
- **Fiyatlandırma:** ₺99/araç/ay (6-50 araç), ₺69/araç/ay (50+ araç), ücretsiz tier (1-5 araç)

### Pazar Araştırması Sonuçları

**Türkiye'de Yazılım-Ağırlıklı Rakipler (GPS opsiyonel):**

| Şirket | GPS Zorunlu? | Fiyat | Zayıf Yanı |
|---|---|---|---|
| **Filorapor** (filorapor.com) | Hayır ✓ | ₺18K/yıl (25 araç), ₺30K/yıl (50 araç) | Yıllık peşin taahhüt, sürücü app belirsiz |
| **ATS PRO** (atspro.com.tr) | Opsiyonel | Fiyat gizli, demo talep | Satış süreci, şeffaf değil |
| **Lojiper** (lojiper.com) | Opsiyonel | Ücretsiz tier, ücretli gizli | Filo yan ürün, sürücü app yok |

**Türkiye'de Donanım Zorunlu Rakipler:**
- Arvento (160K+ müşteri, pazar lideri), Mobiliz, N2 Mobil, Seyir Mobil, TNB Mobil, Trio Mobil
- Telekomlar: Turkcell Kopilot (₺51,28/araç/ay + donanım), Vodafone, Türk Telekom

**Ortak Müşteri Şikayetleri (sikayetvar.com, ekşisözlük):**
1. Aktivasyon/kurulum gecikmeleri (Trio Mobil: 3 ay bekleme)
2. Müşteri hizmetleri kötü (Mobiliz, Arvento sikayetvar'da aktif)
3. Fiyat şeffaflığı yok — demo talep, satış baskısı
4. Sürücü mobil app zayıf veya yok
5. Uzun sözleşme kilidi

**Bizim rekabet avantajlarımız:**
- GPS donanım yok → kurulum sıfır, anında başla
- Aylık ödeme, iptal garantisi (Filorapor yıllık peşin istiyor)
- Fiyat web'de açık
- Sürücü mobil app — saha veri girişi
- Türkçe + KDV uyumlu

### Kurumsal MVP Teknik Tasarım (Faz 1)

**Mimari:** Mevcut localStorage yaklaşımı genişletilir
```
localStorage key: fleet:{sirketKodu}:veri
  → sirket: { ad, kod, adminKodu, olusturulma }
  → araclar: [ AracForm[] ]
  → suruculer: [ { id, ad, telefon, atanmisAracId } ]
  → doldurmalar: { [aracId]: DolumKayit[] }
  → masraflar: { [aracId]: MasrafKayit[] }
```

**Kullanıcı rolleri:**
- **Admin (şirket kodu):** Filo dashboard, sürücü yönetimi, raporlar, araç ekleme
- **Sürücü (sürücü kodu):** Sadece kendi aracına km/dolum/masraf girişi

**Yeni ekranlar:**
1. **Filo Dashboard** — tüm araçlar grid, toplam maliyet, bu ay özet, kritik uyarılar
2. **Sürücüler** — liste, araç ataması, kişi başı maliyet
3. **Araç Detay** — bireysel app'teki 4 sekme (zaman/finansal/yakıt/bilgi) aynen
4. **Raporlar** — araç/sürücü karşılaştırma, aylık trend, CSV export

---

## Backlog (Bireysel App)

- [ ] CSV/Excel export (dolumlar, masraflar, servisler)
- [ ] Fotoğraf büyütme modal (araç kartına tıklayınca)
- [ ] Silme onayı modal (browser `confirm()` yerine)
- [ ] Özelleştirilebilir bakım hatırlatıcıları
- [ ] Servis geçmişi özeti BilgiEkranı'nda

---

## Deploy Pipeline

```
# Bireysel app değişikliği:
npx vite build          # hata varsa commit etme
git add src/App.jsx
git commit -m "feat: açıklama"
git push origin main    # Vercel otomatik deploy (~30-60sn)

# Landing page değişikliği (build gerekmez):
git add landing/index.html
git commit -m "feat: açıklama"
git push origin main
```

**Vercel Projeleri:**
- Bireysel app → `dist/` klasöründen deploy
- Landing page → `landing/` klasöründen deploy (ayrı Vercel projesi)

---

## Dosya Yapısı

```
repo/
├── src/
│   ├── App.jsx          # Tüm uygulama kodu (~1800+ satır)
│   └── main.jsx         # React root
├── landing/
│   └── index.html       # Landing page (bağımsız, Vite'siz)
├── .claude/
│   └── launch.json      # Preview server config (vite --port 5173)
├── CLAUDE.md            # Claude Code kuralları (tüm ajanlar okur)
├── STATUS.md            # Bu dosya — proje durumu
├── package.json
└── vite.config.js
```

---

## Sonraki Adım

**Kurumsal Filo MVP kodlamaya başla** — Faz 1:
1. GirisEkrani'na "Kurumsal Giriş" seçeneği ekle (şirket kodu / sürücü kodu ayrımı)
2. Admin rolü için FiloDashboard ekranı (yeni ana ekran)
3. Sürücü rolü için kısıtlı giriş (sadece kendi aracı)
4. Şirket oluşturma akışı (yeni şirket kodu üret)

Başlamak için: `src/App.jsx` dosyasını oku ve mevcut `GirisEkrani` bileşenini baz alarak genişlet.
