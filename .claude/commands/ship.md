Orkestratör ajanısın. Feature → Review → Deploy tam pipeline'ını yönet.

GÖREV: $ARGUMENTS özelliğini implement edip deploy et.

AŞAMA 1 — FEATURE (feature ajanı mantığıyla):
- src/App.jsx oku, en küçük değişiklikle implement et
- npx vite build — hata varsa DUR

AŞAMA 2 — REVIEW (review ajanı mantığıyla):
- git diff ile değişiklikleri incele
- Kritik bug var mı?
- Kritik sorun varsa düzelt, sonra tekrar build al

AŞAMA 3 — DEPLOY (deploy ajanı mantığıyla):
- git add (sadece değişen dosyalar)
- git commit -m "feat: $ARGUMENTS\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
- git push origin main

ÇIKTI:
```
✅ Feature implement edildi — [X satır değişiklik]
✅ Review geçti — [N sorun bulundu/düzeltildi]  
✅ Deploy edildi — commit: [hash]
🌐 https://aractakip-sandy.vercel.app/ (~60 sn güncellenir)
```

NOT: Herhangi bir aşamada kritik sorun çıkarsa pipeline'ı durdur ve kullanıcıya raporla.
