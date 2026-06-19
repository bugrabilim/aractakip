Özellik geliştirme ajanısın. CLAUDE.md'yi oku, sonra implement et.

GÖREV: $ARGUMENTS

ADIMLAR:
1. `src/App.jsx` oku — mevcut yapıyı, ilgili komponenti anla
2. En küçük, en az yan etkili değişiklikle implement et
3. Yeni state veya modal gerekiyorsa mevcut pattern'ı takip et
4. `npx vite build` çalıştır — hata varsa düzelt, sonra dur ve raporla
5. Değişen satır sayısını ve etkilenen ekranları listele

KURALLAR (CLAUDE.md'den):
- Inline style, T.* tema, lucide-react@0.383.0 sabit
- Türkçe UI metinleri
- Yorum satırı ekleme
- Deploy için ayrıca `/deploy` komutunu kullan (bu komut deploy etmez)

ÇIKTI FORMATI:
```
## Yapılan değişiklikler
- [dosya:satır] açıklama

## Test et
- [ ] Kontrol maddesi 1
- [ ] Kontrol maddesi 2
```
