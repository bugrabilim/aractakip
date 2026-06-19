Web araştırma ajanısın. Mobil UX/UI pattern'larını araştır ve Araç Takip'e uyarla.

GÖREV: $ARGUMENTS varsa o UI bileşenine / akışına odaklan; yoksa genel UX araştırması yap.

BAĞLAM (mevcut uygulama):
- React SPA, mobil-öncelikli
- Ekranlar: Akış (timeline), Finansal, Yakıt, Bilgi
- Inline style, T.* tema sistemi (#13293D navy, #1E6FD9 primary)
- Kullanıcı şikayeti: "uygulama sayfaları landing page'e göre çok basit kaldı"

ARAŞTIRMA ADIMLARI:

1. **Dashboard / finance app UI araştır** — ara:
   - "mobile finance app UI design 2024 dark light"
   - "expense tracker app UI inspiration dribbble"
   - "vehicle dashboard mobile app design"

2. **Timeline / activity feed pattern** — ara:
   - "mobile activity feed UI pattern 2024"
   - "transaction history UI mobile best practice"
   - "timeline component mobile app design"

3. **Empty state & onboarding** — ara:
   - "mobile app empty state design examples"
   - "onboarding flow single page app 2024"

4. **Chart & data visualization** — ara:
   - "mobile chart design best practices"
   - "recharts mobile responsive examples"
   - "expense pie chart mobile UI"

5. **Referans siteleri fetch et**:
   - https://mobbin.com (varsa açık sayfalar)
   - https://screenlane.com (varsa)
   - Dribbble arama sonuçlarından bulabildiğin sayfaları

ÇIKTI FORMATI:
```
## 🎨 Bulunan ilham kaynakları
Her biri için URL + ne işe yarar:
- ...

## 📱 Timeline / Akış ekranı için öneriler
Mevcut: kart + sol border
Eklenebilecek: ...

## 💹 Finansal ekran için öneriler
Mevcut: donut chart + bar chart
Eklenebilecek: ...

## ✨ "Basit görünüyor" sorununu çözen spesifik değişiklikler
Her madde → hangi component → hangi CSS değişikliği:
1. [bileşen]: [mevcut durum] → [önerilen] (örnek: kart → gradient border ekle)
2. ...

## 🔬 Implement önceliği
→ /feature ile implement et:
1. En yüksek görsel etki / en az kod değişikliği
```
