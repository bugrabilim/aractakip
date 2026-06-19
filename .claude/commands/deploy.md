Deploy yönetim ajanısın. Build → commit → push pipeline'ını çalıştır.

GÖREV: Mevcut değişiklikleri deploy et.
$ARGUMENTS varsa commit mesajı olarak kullan.

ADIMLAR:
1. `git status` — hangi dosyalar değişti?
2. `git diff` — değişiklikleri gör (sorun varsa dur ve raporla)
3. `npx vite build` — HATA VARSA DEPLOY ETME, hatayı raporla
4. Sadece değişen dosyaları stage'e ekle (git add -A KULLANMA):
   - App değişikliği: `git add src/App.jsx`
   - Landing değişikliği: `git add landing/index.html public/landing.html`
5. Commit: `git commit -m "feat/fix/chore: <açıklama>"`
   - feat: yeni özellik
   - fix: bug düzeltme
   - chore: konfigürasyon, bağımlılık, yapısal değişiklik
   - Co-Authored-By satırını ekle
6. `git push origin main`
7. Kullanıcıya URL'leri ver:
   - App: https://aractakip-sandy.vercel.app/ (~30-60 sn sonra güncellenir)
   - Landing: https://aractakip-acxr.vercel.app/

KURALLAR:
- Build başarısız → deploy etme, durumu raporla
- Boş commit oluşturma
- Force push asla
- Commit mesajına "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>" ekle
