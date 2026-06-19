import React, { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {
  Plus, Fuel, Gauge, TrendingUp, Car, ChevronLeft, ChevronDown, Copy, Check, Trash2, Pencil, X,
  Wallet, Receipt, Bike, Bus, Truck, Sailboat, Tractor, Caravan, AlertTriangle,
  Image as ImageIcon, Bell, BarChart2, Camera, Wrench, Calendar, Clock, FileText,
  MapPin, ChevronRight, TrendingDown, List, User,
} from "lucide-react";

// ═════════════════════════════════════════════════════════════
// SABİTLER
// ═════════════════════════════════════════════════════════════
const TASIT_TURLERI = [
  { id: "otomobil", label: "Otomobil", ikon: "Car", anaYakitSecenekleri: ["benzin", "dizel", "elektrik", "hibrit"], lpgDestekli: true },
  { id: "motosiklet", label: "Motosiklet", ikon: "Bike", anaYakitSecenekleri: ["benzin", "elektrik"], lpgDestekli: false },
  { id: "karavan", label: "Karavan", ikon: "Caravan", anaYakitSecenekleri: ["benzin", "dizel"], lpgDestekli: true },
  { id: "otobus_minibus", label: "Otobüs / Minibüs", ikon: "Bus", anaYakitSecenekleri: ["dizel", "elektrik"], lpgDestekli: true },
  { id: "kamyon_is_makinesi", label: "Kamyon / İş Mak.", ikon: "Truck", anaYakitSecenekleri: ["dizel", "benzin"], lpgDestekli: false },
  { id: "tarim_insaat", label: "Tarım / İnşaat", ikon: "Tractor", anaYakitSecenekleri: ["dizel", "benzin"], lpgDestekli: false },
  { id: "tekne_yat", label: "Tekne / Yat", ikon: "Sailboat", anaYakitSecenekleri: ["benzin", "dizel", "elektrik"], lpgDestekli: false },
  { id: "jetski", label: "Jet Ski", ikon: "Sailboat", anaYakitSecenekleri: ["benzin"], lpgDestekli: false },
];
const IKON_MAP = { Car, Bike, Caravan, Bus, Truck, Tractor, Sailboat };
function TasitIkonu({ tip, ...p }) {
  const t = TASIT_TURLERI.find((x) => x.id === tip);
  const I = IKON_MAP[t?.ikon] || Car;
  return <I {...p} />;
}

const YAKIT_TIPLERI = [
  { id: "benzin", label: "Benzin", renk: "#E8920C" },
  { id: "dizel", label: "Dizel", renk: "#2563EB" },
  { id: "lpg", label: "LPG", renk: "#16A34A" },
  { id: "elektrik", label: "Elektrik", renk: "#9333EA" },
  { id: "hibrit", label: "Hibrit", renk: "#DB2777" },
];
const SANZIMAN = ["Manuel", "Otomatik", "Yarı Otomatik"];
const ODEME = ["Nakit", "Kredi Kartı", "Yakıt Kartı", "Diğer"];
const DEPO = ["Tam doldu", "Kısmi doldu"];
const SURUS = ["Şehir içi", "Şehir dışı", "Karışık"];
const MTV_D = ["1. Taksit", "2. Taksit", "Tek seferde"];
const LASTIK_T = ["Yaz", "Kış", "Dört Mevsim"];
const SERVIS_KAT = ["Yağ değişimi", "Fren", "Lastik", "Filtre", "Akü", "Triger", "Genel bakım", "Diğer"];
const MASRAF_KAT = ["Sigorta", "MTV", "Vergi", "Otopark", "Köprü/Otoyol", "Yıkama", "Ceza", "Aksesuar", "Diğer"];
const MIN_YIL = 1950, MAX_YIL = 2030;
const UYARI_GUN = 30, BAKIM_KM = 1000;

const yt = (id) => YAKIT_TIPLERI.find((y) => y.id === id)?.renk || "#6B7280";
const yl = (id) => YAKIT_TIPLERI.find((y) => y.id === id)?.label || id;
const tl = (id) => TASIT_TURLERI.find((t) => t.id === id)?.label || id;

function anaYakitler(tasitTipi) {
  const t = TASIT_TURLERI.find((x) => x.id === tasitTipi);
  return YAKIT_TIPLERI.filter((y) => (t?.anaYakitSecenekleri || []).includes(y.id) && y.id !== "lpg");
}
function lpgDestekli(tasitTipi) {
  return !!TASIT_TURLERI.find((t) => t.id === tasitTipi)?.lpgDestekli;
}

// ═════════════════════════════════════════════════════════════
// YARDIMCILAR
// ═════════════════════════════════════════════════════════════
const fmtTRY = (n) => (n == null || isNaN(n) ? "—" : n.toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " ₺");
const fmtSayi = (n, d = 1) => (n == null || isNaN(n) ? "—" : n.toLocaleString("tr-TR", { minimumFractionDigits: d, maximumFractionDigits: d }));
const fmtTarih = (t) => (!t ? "—" : new Date(t).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" }));
const fmtKisaTarih = (t) => (!t ? "—" : new Date(t).toLocaleDateString("tr-TR", { day: "2-digit", month: "short" }));
const bugunStr = () => new Date().toISOString().slice(0, 10);
const yeniId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const kodUret = () => String(Math.floor(100000 + Math.random() * 900000));

function sıkıstir(e, cb) {
  const f = e.target.files?.[0]; if (!f) return;
  if (f.size > 15e6) { alert("15MB'tan küçük görsel seç."); return; }
  const r = new FileReader();
  r.onload = () => { const i = new Image(); i.onload = () => {
    const sc = Math.min(1, 800 / i.width);
    const c = document.createElement("canvas");
    c.width = i.width * sc; c.height = i.height * sc;
    c.getContext("2d").drawImage(i, 0, 0, c.width, c.height);
    cb(c.toDataURL("image/jpeg", 0.72));
  }; i.src = r.result; };
  r.readAsDataURL(f);
}
function belgeSec(e, cb) {
  const f = e.target.files?.[0]; if (!f) return;
  const pdf = f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");
  if (pdf) {
    if (f.size > 5e6) { alert("PDF 5MB'tan küçük olmalı."); return; }
    const r = new FileReader();
    r.onload = () => cb({ tip: "pdf", ad: f.name, veri: r.result });
    r.readAsDataURL(f);
  } else sıkıstir(e, (v) => cb({ tip: "image", ad: f.name, veri: v }));
}
function tarihDurum(str) {
  if (!str) return null;
  const b = new Date(); b.setHours(0, 0, 0, 0);
  const gun = Math.round((new Date(str) - b) / 864e5);
  return { durum: gun < 0 ? "gecmis" : gun <= UYARI_GUN ? "yaklasıyor" : "normal", gun };
}
function sonKm(doldurmalar, id) {
  const ks = (doldurmalar?.[id] || []);
  return ks.length ? Math.max(...ks.map((k) => k.km)) : null;
}
function uyarılar(arac, sk) {
  const list = [];
  const kontrol = (alan, etiket) => {
    const s = tarihDurum(arac[alan]); if (!s) return;
    if (s.durum === "gecmis") list.push({ m: `${etiket} ${Math.abs(s.gun)} gün önce bitti`, tip: "gecmis" });
    else if (s.durum === "yaklasıyor") list.push({ m: `${etiket} bitişine ${s.gun === 0 ? "bugün" : s.gun + " gün"} kaldı`, tip: "yaklasıyor" });
  };
  kontrol("muayeneBitis", "Muayene");
  kontrol("egzozBitis", "Egzoz muayenesi");
  kontrol("sigortaBitis", "Trafik sigortası");
  if (!arac.kaskoYok) kontrol("kaskoBitis", "Kasko");
  if (arac.mtvDonemi && !arac.mtvOdendi) list.push({ m: "MTV ödenmedi", tip: "gecmis" });
  if (arac.bakimPeriyoduKm && arac.sonBakimKm != null && sk != null) {
    const kalan = arac.sonBakimKm + arac.bakimPeriyoduKm - sk;
    if (kalan <= 0) list.push({ m: `Bakım ${fmtSayi(Math.abs(kalan), 0)} km geçti`, tip: "gecmis" });
    else if (kalan <= BAKIM_KM) list.push({ m: `Bakıma ${fmtSayi(kalan, 0)} km kaldı`, tip: "yaklasıyor" });
  }
  if (arac.sonBakimTarihi) {
    const y = new Date(arac.sonBakimTarihi); y.setFullYear(y.getFullYear() + 1);
    const s = tarihDurum(y.toISOString().slice(0, 10));
    if (s?.durum === "gecmis") list.push({ m: `Yıllık bakım ${Math.abs(s.gun)} gün önce geldi`, tip: "gecmis" });
    else if (s?.durum === "yaklasıyor") list.push({ m: `Yıllık bakıma ${s.gun} gün kaldı`, tip: "yaklasıyor" });
  }
  return list;
}

// ═════════════════════════════════════════════════════════════
// STORAGE
// ═════════════════════════════════════════════════════════════
// Storage: önce window.storage (Claude artifact), yoksa localStorage, yoksa bellek
const bellekMap = new Map();
async function stGet(k) {
  // Claude artifact ortamı
  if (typeof window !== "undefined" && window.storage?.get) {
    try { const r = await window.storage.get(k, false); return r ? (typeof r.value === "string" ? JSON.parse(r.value) : r.value) : null; }
    catch { return null; }
  }
  // Web / Vercel ortamı — localStorage
  if (typeof localStorage !== "undefined") {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; }
    catch { return null; }
  }
  return bellekMap.get(k) ?? null;
}
async function stSet(k, v) {
  if (typeof window !== "undefined" && window.storage?.get) {
    try { await window.storage.set(k, JSON.stringify(v), false); return true; }
    catch { return false; }
  }
  if (typeof localStorage !== "undefined") {
    try { localStorage.setItem(k, JSON.stringify(v)); return true; }
    catch { return false; }
  }
  bellekMap.set(k, v); return true;
}
function bosVeri() { return { araclar: [], doldurmalar: {}, masraflar: {}, eposta: null, ad: null, telefon: null }; }

// ═════════════════════════════════════════════════════════════
// TEMA — Drivvo (açık tema, lacivert üst bar, mavi vurgu)
// ═════════════════════════════════════════════════════════════
const T = {
  bg: "#EFF1F4", card: "#FFFFFF", navy: "#13293D", navyDark: "#0E1F2E",
  primary: "#1E6FD9", primaryDim: "#E8F1FC",
  text: "#1A2733", textSub: "#5C6B7A", textMuted: "#94A3B2",
  border: "#E2E7EC", borderLight: "#EDF0F3",
  yakit: "#1E6FD9", masraf: "#E8920C", servis: "#16A34A",
  danger: "#DC2626", warning: "#E8920C", success: "#16A34A",
  dangerDim: "#FDECEC", warningDim: "#FDF4E7", successDim: "#E9F6EE",
};

const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { background: ${T.bg}; font-family: 'Inter', -apple-system, sans-serif; color: ${T.text}; min-height: 100%; }
  input, select, textarea { font-family: inherit; }
  button { cursor: pointer; font-family: inherit; border: none; background: none; }
  button:disabled { opacity: 0.4; cursor: not-allowed; }
  input::placeholder { color: ${T.textMuted}; }
  input:focus, select:focus, textarea:focus { outline: none; }
  ::-webkit-scrollbar { width: 0; }
  input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.5; }
  .ct { transition: transform 0.1s ease, box-shadow 0.1s ease; }
  .ct:active { transform: scale(0.983); box-shadow: 0 0 0 rgba(0,0,0,0) !important; }
`;

// ═════════════════════════════════════════════════════════════
// ORTAK BİLEŞENLER
// ═════════════════════════════════════════════════════════════
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: T.textSub, marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}
const inputStil = { width: "100%", background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "11px 14px", color: T.text, fontSize: 15 };
function Input({ label, value, onChange, placeholder, type = "text", max, min }) {
  return <Field label={label}><input value={value} type={type} max={max} min={min} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} style={inputStil} /></Field>;
}
function NumberInput({ label, value, onChange, placeholder, decimal = false, maxDigits, raw = false }) {
  function göster(v) {
    if (v === "" || v == null) return "";
    if (raw) return String(v);
    const [t, o] = String(v).split(",");
    const g = t.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return o !== undefined ? `${g},${o}` : g;
  }
  function handle(s) {
    let v = raw ? s : s.replace(/\./g, "");
    if (decimal) { v = v.replace(/[^0-9,]/g, ""); const ps = v.split(","); if (ps.length > 2) v = ps[0] + "," + ps.slice(1).join(""); }
    else v = v.replace(/\D/g, "");
    if (maxDigits && v.replace(",", "").length > maxDigits) return;
    onChange(v);
  }
  return <Field label={label}><input type="text" inputMode="decimal" value={göster(value)} placeholder={placeholder} onChange={(e) => handle(e.target.value)} style={inputStil} /></Field>;
}
function Select({ label, value, onChange, options, placeholder = "Seçiniz" }) {
  return (
    <Field label={label}>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ ...inputStil, color: value ? T.text : T.textMuted }}>
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </Field>
  );
}
function Toggle({ label, checked, onChange, açıklama }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
      <div onClick={() => onChange(!checked)} style={{ width: 44, height: 26, borderRadius: 13, background: checked ? T.primary : "#CBD3DC", display: "flex", alignItems: "center", padding: 2, flexShrink: 0, cursor: "pointer", transition: "background 0.2s" }}>
        <div style={{ width: 20, height: 20, borderRadius: 10, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transform: checked ? "translateX(18px)" : "translateX(0)", transition: "transform 0.2s" }} />
      </div>
      <div><div style={{ fontSize: 14, fontWeight: 500, color: T.text }}>{label}</div>{açıklama && <div style={{ fontSize: 12, color: T.textSub, marginTop: 2 }}>{açıklama}</div>}</div>
    </div>
  );
}
function Chip({ aktif, renk, onClick, children }) {
  return (
    <button onClick={onClick} style={{ padding: "8px 14px", borderRadius: 8, border: `1.5px solid ${aktif ? renk || T.primary : T.border}`, background: aktif ? `${renk || T.primary}14` : T.card, color: aktif ? renk || T.primary : T.textSub, fontSize: 14, fontWeight: aktif ? 600 : 500, display: "inline-flex", alignItems: "center", gap: 5 }}>
      {aktif && <Check size={13} />}{children}
    </button>
  );
}
function FotoAlani({ etiket, gorsel, onSec, onKaldir }) {
  return (
    <Field label={etiket}>
      {gorsel ? (
        <div style={{ position: "relative", display: "inline-block" }}>
          <img src={gorsel} alt={etiket} style={{ height: 64, width: 100, objectFit: "cover", borderRadius: 10, border: `1px solid ${T.border}` }} />
          <button onClick={onKaldir} style={{ position: "absolute", top: -8, right: -8, width: 22, height: 22, borderRadius: 11, background: T.danger, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={12} /></button>
        </div>
      ) : (
        <label style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10, border: `1.5px dashed ${T.border}`, background: T.card, color: T.textSub, fontSize: 14, cursor: "pointer" }}>
          <Camera size={16} /> Fotoğraf ekle<input type="file" accept="image/*" capture="environment" onChange={onSec} style={{ display: "none" }} />
        </label>
      )}
    </Field>
  );
}
function BelgeAlani({ etiket, belge, onSec, onKaldir }) {
  return (
    <Field label={etiket}>
      {belge ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: T.card, borderRadius: 10, border: `1px solid ${T.border}` }}>
          {belge.tip === "pdf" ? <FileText size={18} color={T.primary} /> : <img src={belge.veri} style={{ width: 32, height: 32, objectFit: "cover", borderRadius: 6 }} />}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{belge.ad}</div>
            <a href={belge.veri} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: T.primary }}>Görüntüle</a>
          </div>
          <button onClick={onKaldir} style={{ color: T.danger, display: "flex" }}><X size={16} /></button>
        </div>
      ) : (
        <label style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10, border: `1.5px dashed ${T.border}`, background: T.card, color: T.textSub, fontSize: 14, cursor: "pointer" }}>
          <FileText size={16} /> PDF veya görsel ekle<input type="file" accept="application/pdf,image/*" onChange={onSec} style={{ display: "none" }} />
        </label>
      )}
    </Field>
  );
}
function BosDurum({ ikon, başlık, açıklama }) {
  return (
    <div style={{ textAlign: "center", padding: "56px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ width: 72, height: 72, borderRadius: 36, background: T.card, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{ikon}</div>
      <div style={{ fontSize: 17, fontWeight: 700, color: T.text }}>{başlık}</div>
      <div style={{ fontSize: 14, color: T.textSub, maxWidth: 260, lineHeight: 1.6 }}>{açıklama}</div>
    </div>
  );
}
function olayStili(tip) {
  if (tip === "dolum") return { ikon: <Fuel size={19} color="#fff" />, renk: T.yakit, etiket: "Dolum" };
  if (tip === "servis") return { ikon: <Wrench size={19} color="#fff" />, renk: T.servis, etiket: "Servis" };
  return { ikon: <Receipt size={19} color="#fff" />, renk: T.masraf, etiket: "Masraf" };
}

// ═════════════════════════════════════════════════════════════
// GİRİŞ EKRANI
// ═════════════════════════════════════════════════════════════
function ProfilModal({ kod, veri, onKapat, onGuncelle, onCikis }) {
  const [ad, setAd] = useState(veri.ad || "");
  const [eposta, setEposta] = useState(veri.eposta || "");
  const [telefon, setTelefon] = useState(veri.telefon || "");
  const [kopya, setKopya] = useState(false);

  function kaydet() {
    onGuncelle({ ...veri, ad: ad.trim() || null, eposta: eposta.trim() || null, telefon: telefon.trim() || null });
    onKapat();
  }

  return (
    <Modal başlık="Profil & Ayarlar" onKapat={onKapat} yükseklik="85vh"
      footer={<ModalFooter onKapat={onKapat} onKaydet={kaydet} kaydetLabel="Kaydet" />}>

      <div style={{ background: T.primaryDim, border: `1px solid rgba(30,111,217,0.2)`, borderRadius: 14, padding: "18px 20px", marginBottom: 16, textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.textSub, letterSpacing: "0.06em", marginBottom: 10 }}>GİRİŞ KODUN</div>
        <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: "0.22em", color: T.primary }}>{kod}</div>
        <button onClick={() => { navigator.clipboard?.writeText(kod); setKopya(true); setTimeout(() => setKopya(false), 2000); }}
          style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6, color: T.textSub, fontSize: 13 }}>
          {kopya ? <Check size={14} color={T.success} /> : <Copy size={14} />}
          {kopya ? "Kopyalandı!" : "Kopyala"}
        </button>
        <div style={{ fontSize: 11, color: T.textMuted, marginTop: 8, lineHeight: 1.5 }}>Bu kodu kaybedersen hesabına erişemezsin. Bir yere not al.</div>
      </div>

      <div style={{ background: T.warningDim, border: `1px solid rgba(232,146,12,0.25)`, borderRadius: 10, padding: "10px 14px", marginBottom: 18 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.warning }}>⚠️ Veriler bu cihaza özel kaydedilir</div>
        <div style={{ fontSize: 12, color: T.textSub, marginTop: 3, lineHeight: 1.5 }}>Başka bir cihazdan aynı kodla giriş yapsan bile veriler oraya geçmez. CSV export yakında geliyor.</div>
      </div>

      <Input label="İsim (opsiyonel)" value={ad} onChange={setAd} placeholder="Adın Soyadın" />
      <Input label="E-posta (opsiyonel)" value={eposta} onChange={setEposta} placeholder="ornek@email.com" type="email" />
      <Input label="Telefon (opsiyonel)" value={telefon} onChange={setTelefon} placeholder="+90 555 000 00 00" />

      <div style={{ height: 1, background: T.border, margin: "8px 0 14px" }} />
      <button onClick={() => { onKapat(); onCikis(); }}
        style={{ width: "100%", padding: 14, borderRadius: 12, border: `1px solid ${T.border}`, background: T.card, color: T.textSub, fontSize: 14, fontWeight: 600 }}>
        Oturumu Kapat
      </button>
    </Modal>
  );
}

function GirisEkrani({ onGiris }) {
  const [sekme, setSekme] = useState("giris");
  const [girisKod, setGirisKod] = useState("");
  const [yeniKod] = useState(kodUret());
  const [eposta, setEposta] = useState("");
  const [hata, setHata] = useState("");
  const [kopya, setKopya] = useState(false);
  const [cihazdaYok, setCihazdaYok] = useState(false);

  async function demoGiris() {
    const k = "111111";
    const d = {
      ad: "Demo Kullanıcı", eposta: "demo@aractakip.com", telefon: null, ajanApiKey: null,
      araclar: [{ id: "a1", marka: "Toyota", model: "Corolla", yil: "2021", plaka: "34KA4521", renk: "Gümüş", foto: null, tasitTipi: "otomobil", anaYakitTipi: "benzin", yakitTipleri: ["benzin"], notlar: "", sigortaYok: false, sigortaBitis: "2027-03-15", sigortaSirketi: "Axa Sigorta", sigortaPolicesi: null, kaskoYok: false, kaskoBitis: "2026-09-20", kaskoSirketi: "Mapfre", kaskoPolicesi: null, mtvDonemi: "2026-01", mtvOdendi: true, bakimPeriyoduKm: "15000", sonBakimTarihi: "2026-03-10", sonBakimKm: "78500", alimTarihi: "2022-06-15", alimTutari: "480000", alimUsdKuru: "17.5", alimAltinFiyati: "1050", satisTarihi: "", satisTutari: "", satisUsdKuru: "", satisAltinFiyati: "" }],
      doldurmalar: { a1: [
        { id: "d1", tarih: "2026-04-03", km: 80200, yakitTipi: "benzin", litre: 45.2, tutar: 1808, istasyon: "Opet", sehir: "İstanbul", odemeYontemi: "Kredi Kartı", depoDoluluk: null, surusTipi: null, not: null, kmGorseli: null, fisGorseli: null },
        { id: "d2", tarih: "2026-04-18", km: 80980, yakitTipi: "benzin", litre: 38.5, tutar: 1540, istasyon: "BP", sehir: "İstanbul", odemeYontemi: "Nakit", depoDoluluk: null, surusTipi: null, not: null, kmGorseli: null, fisGorseli: null },
        { id: "d3", tarih: "2026-05-02", km: 81750, yakitTipi: "benzin", litre: 41.0, tutar: 1640, istasyon: "Shell", sehir: "Ankara", odemeYontemi: "Kredi Kartı", depoDoluluk: null, surusTipi: null, not: "Uzun yol", kmGorseli: null, fisGorseli: null },
        { id: "d4", tarih: "2026-05-16", km: 82520, yakitTipi: "benzin", litre: 39.8, tutar: 1592, istasyon: "Petrol Ofisi", sehir: "İstanbul", odemeYontemi: "Kredi Kartı", depoDoluluk: null, surusTipi: null, not: null, kmGorseli: null, fisGorseli: null },
        { id: "d5", tarih: "2026-05-29", km: 83310, yakitTipi: "benzin", litre: 43.2, tutar: 1728, istasyon: "Opet", sehir: "İstanbul", odemeYontemi: "Nakit", depoDoluluk: null, surusTipi: null, not: null, kmGorseli: null, fisGorseli: null },
        { id: "d6", tarih: "2026-06-08", km: 84150, yakitTipi: "benzin", litre: 40.5, tutar: 1822, istasyon: "BP", sehir: "İstanbul", odemeYontemi: "Kredi Kartı", depoDoluluk: null, surusTipi: null, not: null, kmGorseli: null, fisGorseli: null },
        { id: "d7", tarih: "2026-06-17", km: 84920, yakitTipi: "benzin", litre: 44.0, tutar: 1980, istasyon: "Shell", sehir: "İstanbul", odemeYontemi: "Kredi Kartı", depoDoluluk: null, surusTipi: null, not: "Son dolum", kmGorseli: null, fisGorseli: null },
      ]},
      masraflar: { a1: [
        { id: "m1", tip: "masraf", kategori: "Sigorta", aciklama: "Trafik sigortası yenileme", tarih: "2026-04-01", km: 80100, tutar: 3200, faturaGorseli: null },
        { id: "m2", tip: "servis", kategori: null, aciklama: "Periyodik bakım — yağ + filtre", tarih: "2026-04-10", km: 80500, tutar: 4850, faturaGorseli: null },
        { id: "m3", tip: "masraf", kategori: "Lastik", aciklama: "4 lastik değişimi", tarih: "2026-05-05", km: 81900, tutar: 12400, faturaGorseli: null },
        { id: "m4", tip: "masraf", kategori: "Park", aciklama: "Aylık otopark", tarih: "2026-05-01", km: null, tutar: 1200, faturaGorseli: null },
        { id: "m5", tip: "servis", kategori: null, aciklama: "Ön cam değişimi (çatlak)", tarih: "2026-05-20", km: 82700, tutar: 5500, faturaGorseli: null },
        { id: "m6", tip: "masraf", kategori: "Park", aciklama: "Aylık otopark", tarih: "2026-06-01", km: null, tutar: 1200, faturaGorseli: null },
        { id: "m7", tip: "masraf", kategori: "Yıkama", aciklama: "Detaylı iç-dış temizlik", tarih: "2026-06-12", km: 84200, tutar: 850, faturaGorseli: null },
      ]},
    };
    await stSet(`data:${k}`, d);
    onGiris(k, d);
  }

  async function girisYap() {
    const k = girisKod.trim();
    if (k.length !== 6 || !/^\d+$/.test(k)) { setHata("6 haneli rakamsal kod gir."); return; }
    const d = await stGet(`data:${k}`);
    if (!d) { setHata(""); setCihazdaYok(true); return; }
    onGiris(k, d);
  }
  async function buKodlaBasla() {
    const k = girisKod.trim();
    const yeni = bosVeri();
    await stSet(`data:${k}`, yeni);
    onGiris(k, yeni);
  }
  async function hesapOlustur() {
    const mevcut = await stGet(`data:${yeniKod}`);
    if (mevcut) { setHata("Kod çakışması, sayfayı yenile."); return; }
    const yeni = bosVeri();
    if (eposta.trim()) { yeni.eposta = eposta.trim(); await stSet(`email:${eposta.trim().toLowerCase()}`, yeniKod); }
    await stSet(`data:${yeniKod}`, yeni);
    onGiris(yeniKod, yeni);
  }

  return (
    <div style={{ minHeight: "100vh", background: T.navy, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 20px" }}>
      <style>{globalCss}</style>
      <div style={{ marginBottom: 36, textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: T.primary, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <Car size={32} color="#fff" strokeWidth={2.2} />
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#fff" }}>Araç Takip</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>Aracının her kuruşunu yönet</div>
      </div>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ display: "flex", background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: 4, marginBottom: 20 }}>
          {["giris", "yeni", "unut"].map((s, i) => (
            <button key={s} onClick={() => { setSekme(s); setHata(""); }} style={{ flex: 1, padding: "9px 6px", borderRadius: 9, fontSize: 13, fontWeight: 600, background: sekme === s ? "#fff" : "transparent", color: sekme === s ? T.navy : "rgba(255,255,255,0.7)" }}>
              {["Giriş", "Yeni Kod", "Kodu Unut"][i]}
            </button>
          ))}
        </div>
        <div style={{ background: "#fff", borderRadius: 16, padding: 24 }}>
          {sekme === "giris" && !cihazdaYok && (
            <>
              <Field label="6 Haneli Kodun">
                <input value={girisKod} onChange={(e) => { setGirisKod(e.target.value.replace(/\D/g, "").slice(0, 6)); setCihazdaYok(false); }} placeholder="123456" maxLength={6} inputMode="numeric"
                  style={{ width: "100%", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px 16px", color: T.text, fontSize: 24, fontWeight: 700, letterSpacing: "0.2em", textAlign: "center" }} />
              </Field>
              <button onClick={girisYap} style={{ width: "100%", background: T.primary, color: "#fff", borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Giriş Yap</button>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ flex: 1, height: 1, background: T.border }} />
                <span style={{ fontSize: 11, color: T.textMuted }}>ya da</span>
                <div style={{ flex: 1, height: 1, background: T.border }} />
              </div>
              <button onClick={demoGiris} style={{ width: "100%", background: T.bg, border: `1px solid ${T.border}`, color: T.textSub, borderRadius: 12, padding: 13, fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Car size={16} color={T.textSub} /> Demo ile dene
              </button>
            </>
          )}
          {sekme === "giris" && cihazdaYok && (
            <>
              <div style={{ textAlign: "center", padding: "6px 0 16px" }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>📱</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 8 }}>Bu cihazda kayıt bulunamadı</div>
                <div style={{ fontSize: 12, color: T.textSub, lineHeight: 1.6 }}>
                  Uygulama verilerini cihaza özel saklar. Başka bir cihazda oluşturduğun veriler otomatik aktarılmaz.
                </div>
              </div>
              <button onClick={buKodlaBasla} style={{ width: "100%", background: T.primary, color: "#fff", borderRadius: 12, padding: 14, fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
                {girisKod} koduyla bu cihazda başla
              </button>
              <button onClick={() => { setCihazdaYok(false); setGirisKod(""); }} style={{ width: "100%", background: T.bg, border: `1px solid ${T.border}`, color: T.textSub, borderRadius: 12, padding: 14, fontSize: 14, fontWeight: 600 }}>
                Farklı Kod Dene
              </button>
            </>
          )}
          {sekme === "yeni" && (
            <>
              <div style={{ textAlign: "center", marginBottom: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.textSub, marginBottom: 10 }}>SENİN KODUN</div>
                <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: "0.22em", color: T.primary }}>{yeniKod}</div>
                <button onClick={() => { navigator.clipboard?.writeText(yeniKod); setKopya(true); setTimeout(() => setKopya(false), 2000); }} style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6, color: T.textSub, fontSize: 13 }}>
                  {kopya ? <Check size={14} color={T.success} /> : <Copy size={14} />}{kopya ? "Kopyalandı" : "Kopyala"}
                </button>
              </div>
              <div style={{ fontSize: 12, color: T.textSub, marginBottom: 16, textAlign: "center", lineHeight: 1.5 }}>Bu kodu kaydet — tekrar gösterilmez. Girişte bu kodu kullanacaksın.</div>
              <Input label="E-posta (opsiyonel, kurtarma için)" value={eposta} onChange={setEposta} placeholder="ornek@email.com" type="email" />
              <button onClick={hesapOlustur} style={{ width: "100%", background: T.primary, color: "#fff", borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 700, marginTop: 4 }}>Hesabı Oluştur</button>
            </>
          )}
          {sekme === "unut" && (
            <>
              <Input label="E-posta Adresin" value={eposta} onChange={setEposta} placeholder="ornek@email.com" type="email" />
              <button onClick={async () => { const k = await stGet(`email:${eposta.trim().toLowerCase()}`); if (k) alert(`Kodun: ${k}`); else setHata("Bu e-posta ile kayıtlı kod yok."); }} style={{ width: "100%", background: T.bg, border: `1px solid ${T.border}`, color: T.text, borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 700 }}>Kodumu Göster</button>
            </>
          )}
          {hata && <div style={{ marginTop: 14, fontSize: 13, color: T.danger, textAlign: "center" }}>{hata}</div>}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// ARAÇ FORM VARSAYILANI
// ═════════════════════════════════════════════════════════════
function bosAracForm() {
  return {
    tasitTipi: "otomobil", anaYakitTipi: "benzin", lpgVarMi: false,
    marka: "", model: "", yil: "", motorGucu: "", motorHacmi: "", silindirSayisi: "",
    plaka: "", sanziman: "", depoKapasitesi: "", foto: null,
    lastikTipi: "", lastikEbati: "", lastikDegisimTarihi: "", lastikDegisimKm: "", lastikFaturasi: null,
    muayeneBitis: "", egzozBitis: "", muayeneBelgesi: null,
    sigortaBitis: "", sigortaSirketi: "", sigortaPolicesi: null,
    kaskoYok: false, kaskoBitis: "", kaskoSirketi: "", kaskoPolicesi: null,
    mtvDonemi: "", mtvOdendi: false,
    bakimPeriyoduKm: "", sonBakimTarihi: "", sonBakimKm: "",
    alimTarihi: "", alimTutari: "", alimUsdKuru: "", alimAltinFiyati: "",
    satisTarihi: "", satisTutari: "", satisUsdKuru: "", satisAltinFiyati: "",
  };
}

// ═════════════════════════════════════════════════════════════
// ANA UYGULAMA — Drivvo yapısı: tek aktif araç + alt navigasyon
// ═════════════════════════════════════════════════════════════
export default function App() {
  const [kod, setKod] = useState(null);
  const [veri, setVeri] = useState(bosVeri());
  const [aktifAracId, setAktifAracId] = useState(null);
  const [ekran, setEkran] = useState("zaman");      // zaman | finansal | yakit | bilgi
  const [modal, setModal] = useState(null);         // fab | arac | dolum | masraf | servis | aracSecici
  const [editKayit, setEditKayit] = useState(null);
  const [editArac, setEditArac] = useState(null);

  const aktifArac = veri.araclar.find((a) => a.id === aktifAracId) || veri.araclar[0] || null;

  async function kaydet(yeniVeri) { setVeri(yeniVeri); await stSet(`data:${kod}`, yeniVeri); }
  function girisYap(k, d) { setKod(k); setVeri(d); setAktifAracId(d.araclar[0]?.id || null); }
  function cikis() { setKod(null); setVeri(bosVeri()); setAktifAracId(null); setEkran("zaman"); }
  async function profilGuncelle(yeniVeri) {
    if (yeniVeri.eposta && yeniVeri.eposta !== veri.eposta) {
      await stSet(`email:${yeniVeri.eposta.toLowerCase()}`, kod);
    }
    await kaydet(yeniVeri);
  }

  async function aracKaydet(form) {
    const yeni = { ...bosAracForm(), ...form, id: editArac?.id || yeniId() };
    const yeniAraclar = editArac ? veri.araclar.map((a) => (a.id === editArac.id ? yeni : a)) : [...veri.araclar, yeni];
    await kaydet({ ...veri, araclar: yeniAraclar });
    if (!editArac) setAktifAracId(yeni.id);
    setModal(null); setEditArac(null);
  }
  async function aracSil(id) {
    if (!confirm("Bu aracı ve tüm kayıtlarını sil?")) return;
    const { [id]: _, ...ds } = veri.doldurmalar; const { [id]: __, ...ms } = veri.masraflar;
    const kalan = veri.araclar.filter((a) => a.id !== id);
    await kaydet({ ...veri, araclar: kalan, doldurmalar: ds, masraflar: ms });
    if (aktifAracId === id) setAktifAracId(kalan[0]?.id || null);
    setModal(null); setEditArac(null);
  }

  async function dolumKaydet(form) {
    const km = Number(form.km), litre = Number(String(form.litre).replace(",", ".")), tutar = Number(String(form.tutar).replace(",", "."));
    const kayit = { id: editKayit?.id || yeniId(), tarih: form.tarih, km, yakitTipi: form.yakitTipi, litre, tutar,
      istasyon: form.istasyon || null, sehir: form.sehir || null, odemeYontemi: form.odemeYontemi || null,
      depoDoluluk: form.depoDoluluk || null, surusTipi: form.surusTipi || null, not: form.not || null,
      kmGorseli: form.kmGorseli || null, fisGorseli: form.fisGorseli || null };
    const mev = veri.doldurmalar[aktifArac.id] || [];
    const yeniD = editKayit ? mev.map((d) => (d.id === editKayit.id ? kayit : d)) : [...mev, kayit];
    await kaydet({ ...veri, doldurmalar: { ...veri.doldurmalar, [aktifArac.id]: yeniD } });
    setModal(null); setEditKayit(null);
  }
  async function dolumSil(id) {
    if (!confirm("Bu dolumu sil?")) return;
    await kaydet({ ...veri, doldurmalar: { ...veri.doldurmalar, [aktifArac.id]: (veri.doldurmalar[aktifArac.id] || []).filter((d) => d.id !== id) } });
  }

  async function masrafKaydet(form) {
    const tutar = Number(String(form.tutar).replace(",", "."));
    const kayit = { id: editKayit?.id || yeniId(), tip: form.tip, kategori: form.kategori || null, aciklama: form.aciklama, tarih: form.tarih, km: form.km ? Number(form.km) : null, tutar, faturaGorseli: form.faturaGorseli || null };
    const mev = veri.masraflar[aktifArac.id] || [];
    const yeniM = editKayit ? mev.map((m) => (m.id === editKayit.id ? kayit : m)) : [...mev, kayit];
    await kaydet({ ...veri, masraflar: { ...veri.masraflar, [aktifArac.id]: yeniM } });
    setModal(null); setEditKayit(null);
  }
  async function masrafSil(id) {
    if (!confirm("Bu kaydı sil?")) return;
    await kaydet({ ...veri, masraflar: { ...veri.masraflar, [aktifArac.id]: (veri.masraflar[aktifArac.id] || []).filter((m) => m.id !== id) } });
  }

  if (!kod) return <GirisEkrani onGiris={girisYap} />;

  // Hiç araç yoksa karşılama
  if (!aktifArac) {
    return (
      <div style={{ minHeight: "100vh", background: T.bg, maxWidth: 480, margin: "0 auto" }}>
        <style>{globalCss}</style>
        <div style={{ background: T.navy, padding: "52px 20px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>Araç Takip</div>
          <button onClick={cikis} style={{ padding: "7px 14px", background: "rgba(255,255,255,0.12)", borderRadius: 20, fontSize: 12, color: "#fff" }}>Çıkış</button>
        </div>
        <BosDurum ikon={<Car size={32} color={T.textMuted} />} başlık="İlk aracını ekle" açıklama="Araç ekleyerek yakıt, masraf ve servis takibine başla." />
        <div style={{ padding: "0 20px" }}>
          <button onClick={() => { setEditArac(null); setModal("arac"); }} style={{ width: "100%", background: T.primary, color: "#fff", borderRadius: 12, padding: 15, fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Plus size={20} strokeWidth={2.4} /> Araç ekle
          </button>
        </div>
        {modal === "arac" && <AracFormModal mevcut={editArac} onKaydet={aracKaydet} onKapat={() => { setModal(null); setEditArac(null); }} onSil={editArac ? () => aracSil(editArac.id) : null} />}
      </div>
    );
  }

  const sk = sonKm(veri.doldurmalar, aktifArac.id);
  const uw = uyarılar(aktifArac, sk);
  const dolumlar = veri.doldurmalar[aktifArac.id] || [];
  const masraflar = veri.masraflar[aktifArac.id] || [];
  const buAy = new Date().toISOString().slice(0, 7);
  const aylikYakit = dolumlar.filter((d) => d.tarih.startsWith(buAy)).reduce((s, d) => s + d.tutar, 0);
  const aylikMasraf = masraflar.filter((m) => m.tip === "masraf" && m.tarih.startsWith(buAy)).reduce((s, m) => s + m.tutar, 0);
  const aylikServis = masraflar.filter((m) => m.tip === "servis" && m.tarih.startsWith(buAy)).reduce((s, m) => s + m.tutar, 0);

  return (
    <div style={{ minHeight: "100vh", background: T.bg, maxWidth: 480, margin: "0 auto", position: "relative" }}>
      <style>{globalCss}</style>

      {/* ── LACİVERT ÜST BAR + ARAÇ SEÇİCİ ── */}
      <div style={{ background: T.navy, paddingTop: 44 }}>
        <div style={{ padding: "0 16px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => setModal("aracSecici")} style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff" }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(255,255,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {aktifArac.foto ? <img src={aktifArac.foto} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <TasitIkonu tip={aktifArac.tasitTipi} size={20} color="#fff" />}
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>{aktifArac.marka} {aktifArac.model} <ChevronDown size={16} /></div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{aktifArac.plaka || tl(aktifArac.tasitTipi)}{sk ? ` · ${fmtSayi(sk, 0)} km` : ""}</div>
            </div>
          </button>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setModal("profil")} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}><User size={16} color="#fff" /></button>
            <button onClick={() => { setEditArac(aktifArac); setModal("arac"); }} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}><Pencil size={16} color="#fff" /></button>
            <button onClick={cikis} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={16} color="#fff" /></button>
          </div>
        </div>

        {/* Üst bar sekmeleri */}
        <div style={{ display: "flex", padding: "4px 8px 0" }}>
          {[
            { id: "zaman", l: "Akış" }, { id: "finansal", l: "Finansal" },
            { id: "yakit", l: "Yakıt" }, { id: "bilgi", l: "Bilgi" },
          ].map((t) => (
            <button key={t.id} onClick={() => setEkran(t.id)} style={{ flex: 1, padding: "9px 4px", margin: "0 2px", fontSize: 13, fontWeight: 600, color: ekran === t.id ? "#fff" : "rgba(255,255,255,0.5)", background: ekran === t.id ? "rgba(255,255,255,0.15)" : "transparent", borderRadius: "8px 8px 0 0", transition: "all 0.18s" }}>{t.l}</button>
          ))}
        </div>

        {/* Bu ay özet strip */}
        {(aylikYakit + aylikMasraf + aylikServis) > 0 && (
          <div style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "10px 16px 14px" }}>
            {[
              { l: "Yakıt", v: fmtTRY(aylikYakit) },
              { l: "Masraf", v: fmtTRY(aylikMasraf) },
              { l: "Servis", v: fmtTRY(aylikServis) },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{s.v}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── İÇERİK ── */}
      <div style={{ padding: "16px 16px 96px" }}>
        {uw.length > 0 && ekran !== "bilgi" && (
          <div style={{ marginBottom: 16, background: T.card, borderRadius: 14, overflow: "hidden", border: `1px solid ${T.border}` }}>
            <div style={{ padding: "10px 14px", background: uw.some((u) => u.tip === "gecmis") ? T.dangerDim : T.warningDim, display: "flex", alignItems: "center", gap: 8 }}>
              <Bell size={15} color={uw.some((u) => u.tip === "gecmis") ? T.danger : T.warning} />
              <span style={{ fontSize: 13, fontWeight: 700, color: uw.some((u) => u.tip === "gecmis") ? T.danger : T.warning }}>{uw.length} hatırlatma</span>
            </div>
            <div style={{ padding: "4px 14px 10px" }}>
              {uw.map((u, i) => (
                <div key={i} style={{ fontSize: 13, color: u.tip === "gecmis" ? T.danger : T.warning, padding: "5px 0", display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ width: 5, height: 5, borderRadius: 3, background: "currentColor", flexShrink: 0 }} />{u.m}
                </div>
              ))}
            </div>
          </div>
        )}

        {ekran === "zaman" && <ZamanCizelgesi dolumlar={dolumlar} masraflar={masraflar}
          onDolumDuzenle={(d) => { setEditKayit(d); setModal("dolum"); }} onDolumSil={dolumSil}
          onMasrafDuzenle={(m) => { setEditKayit(m); setModal(m.tip === "servis" ? "servis" : "masraf"); }} onMasrafSil={masrafSil} />}
        {ekran === "finansal" && <FinansalEkran arac={aktifArac} dolumlar={dolumlar} masraflar={masraflar} />}
        {ekran === "yakit" && <YakitEkran dolumlar={dolumlar} />}
        {ekran === "bilgi" && <BilgiEkran arac={aktifArac} sk={sk} uyarilar={uw} />}
      </div>

      {/* ── FAB ── */}
      <button onClick={() => setModal("fab")} style={{ position: "fixed", right: 22, bottom: 24, width: 58, height: 58, borderRadius: 29, background: T.primary, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(30,111,217,0.45)", zIndex: 50 }}>
        <Plus size={28} color="#fff" strokeWidth={2.4} />
      </button>

      {/* ── FAB MENÜSÜ ── */}
      {modal === "fab" && (
        <div style={{ position: "fixed", inset: 0, zIndex: 90 }} onClick={() => setModal(null)}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(19,41,61,0.55)" }} />
          <div style={{ position: "absolute", right: 22, bottom: 92, display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }} onClick={(e) => e.stopPropagation()}>
            {[
              { l: "Araç Ekle", ikon: <Car size={20} color="#fff" />, renk: T.navy, cb: () => { setEditArac(null); setModal("arac"); } },
              { l: "Dolum", ikon: <Fuel size={20} color="#fff" />, renk: T.yakit, cb: () => { setEditKayit(null); setModal("dolum"); } },
              { l: "Masraf", ikon: <Receipt size={20} color="#fff" />, renk: T.masraf, cb: () => { setEditKayit(null); setModal("masraf"); } },
              { l: "Servis", ikon: <Wrench size={20} color="#fff" />, renk: T.servis, cb: () => { setEditKayit(null); setModal("servis"); } },
            ].map((it, i) => (
              <button key={i} onClick={it.cb} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#fff", background: "rgba(0,0,0,0.3)", padding: "6px 12px", borderRadius: 8 }}>{it.l}</span>
                <span style={{ width: 50, height: 50, borderRadius: 25, background: it.renk, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 12px rgba(0,0,0,0.3)" }}>{it.ikon}</span>
              </button>
            ))}
            <button onClick={() => setModal(null)} style={{ width: 58, height: 58, borderRadius: 29, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 4 }}>
              <X size={26} color={T.navy} />
            </button>
          </div>
        </div>
      )}

      {/* ── MODALLAR ── */}
      {modal === "aracSecici" && <AracSecici araclar={veri.araclar} aktifId={aktifArac.id} doldurmalar={veri.doldurmalar}
        onSec={(id) => { setAktifAracId(id); setModal(null); }} onYeni={() => { setEditArac(null); setModal("arac"); }} onKapat={() => setModal(null)} />}
      {modal === "arac" && <AracFormModal mevcut={editArac} onKaydet={aracKaydet} onKapat={() => { setModal(null); setEditArac(null); }} onSil={editArac ? () => aracSil(editArac.id) : null} />}
      {modal === "dolum" && <DolumFormModal mevcut={editKayit} yakitListesi={aktifArac.yakitTipleri || [aktifArac.anaYakitTipi || "benzin"]} onKaydet={dolumKaydet} onKapat={() => { setModal(null); setEditKayit(null); }} />}
      {modal === "masraf" && <MasrafFormModal mevcut={editKayit} tip="masraf" onKaydet={masrafKaydet} onKapat={() => { setModal(null); setEditKayit(null); }} />}
      {modal === "servis" && <MasrafFormModal mevcut={editKayit} tip="servis" onKaydet={masrafKaydet} onKapat={() => { setModal(null); setEditKayit(null); }} />}
      {modal === "profil" && <ProfilModal kod={kod} veri={veri} onKapat={() => setModal(null)} onGuncelle={profilGuncelle} onCikis={cikis} />}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// EKRAN: ZAMAN ÇİZELGESİ (Drivvo ana ekranı — aktivite akışı)
// ═════════════════════════════════════════════════════════════
function ZamanCizelgesi({ dolumlar, masraflar, onDolumDuzenle, onDolumSil, onMasrafDuzenle, onMasrafSil }) {
  // Tüm olayları tek listede birleştir, tarihe göre sırala
  const olaylar = useMemo(() => {
    const liste = [];
    [...dolumlar].sort((a, b) => a.tarih.localeCompare(b.tarih)).forEach((d, i, arr) => {
      let tuketim = null;
      if (i > 0 && arr[i - 1].yakitTipi === d.yakitTipi) {
        const km = d.km - arr[i - 1].km;
        if (km > 0) tuketim = (d.litre / km) * 100;
      }
      liste.push({ ...d, _tip: "dolum", tuketim });
    });
    masraflar.forEach((m) => liste.push({ ...m, _tip: m.tip === "servis" ? "servis" : "masraf" }));
    return liste.sort((a, b) => b.tarih.localeCompare(a.tarih));
  }, [dolumlar, masraflar]);

  if (!olaylar.length) {
    return <BosDurum ikon={<List size={32} color={T.textMuted} />} başlık="Henüz kayıt yok" açıklama="Sağ alttaki + butonuyla dolum, masraf veya servis ekle." />;
  }

  // Ay bazında grupla
  const gruplar = {};
  olaylar.forEach((o) => { const ay = o.tarih.slice(0, 7); (gruplar[ay] = gruplar[ay] || []).push(o); });

  return (
    <div>
      {Object.entries(gruplar).map(([ay, list]) => (
        <div key={ay} style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 4px 10px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.textMuted, textTransform: "capitalize" }}>
              {new Date(ay + "-01").toLocaleDateString("tr-TR", { month: "long", year: "numeric" })}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.textSub }}>{fmtTRY(list.reduce((s, o) => s + o.tutar, 0))}</div>
          </div>
          {list.map((o) => {
            const st = olayStili(o._tip);
            return (
              <div key={o.id} className="ct" style={{ background: T.card, borderRadius: 14, padding: "13px 14px", marginBottom: 8, display: "flex", gap: 13, alignItems: "center", border: `1px solid ${T.border}`, borderLeft: `4px solid ${st.renk}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: st.renk, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{st.ikon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: T.text }}>
                      {o._tip === "dolum" ? `${fmtSayi(o.litre, 1)} L` : (o.kategori || o.aciklama || st.etiket)}
                    </span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: T.text, whiteSpace: "nowrap" }}>{fmtTRY(o.tutar)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 3 }}>
                    <span style={{ fontSize: 12, color: T.textSub }}>
                      {o._tip === "dolum"
                        ? `${yl(o.yakitTipi)} · ${fmtSayi(o.km, 0)} km${o.tuketim ? ` · ${fmtSayi(o.tuketim)} L/100` : ""}`
                        : `${o.aciklama || ""}${o.km ? ` · ${fmtSayi(o.km, 0)} km` : ""}`}
                    </span>
                    <span style={{ fontSize: 12, color: T.textMuted }}>{fmtKisaTarih(o.tarih)}</span>
                  </div>
                  {(o.istasyon || o.not) && <div style={{ fontSize: 12, color: T.textMuted, marginTop: 3 }}>{[o.istasyon, o.not].filter(Boolean).join(" · ")}</div>}
                  {(o.kmGorseli || o.fisGorseli || o.faturaGorseli) && (
                    <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                      {[o.kmGorseli, o.fisGorseli, o.faturaGorseli].filter(Boolean).map((g, i) => (
                        <img key={i} src={g} style={{ width: 42, height: 42, borderRadius: 8, objectFit: "cover" }} />
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button onClick={() => o._tip === "dolum" ? onDolumDuzenle(o) : onMasrafDuzenle(o)} style={{ color: T.textMuted, display: "flex" }}><Pencil size={15} /></button>
                  <button onClick={() => o._tip === "dolum" ? onDolumSil(o.id) : onMasrafSil(o.id)} style={{ color: "#D9A0A0", display: "flex" }}><Trash2 size={15} /></button>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// EKRAN: FİNANSAL (özet + donut + aylık bar — Drivvo finansal ekranı)
// ═════════════════════════════════════════════════════════════
function FinansalEkran({ arac, dolumlar, masraflar }) {
  const h = useMemo(() => {
    const yakitT = dolumlar.reduce((s, d) => s + d.tutar, 0);
    const servisT = masraflar.filter((m) => m.tip === "servis").reduce((s, m) => s + m.tutar, 0);
    const masrafT = masraflar.filter((m) => m.tip === "masraf").reduce((s, m) => s + m.tutar, 0);
    const toplam = yakitT + servisT + masrafT;
    // aylık
    const aylik = {};
    dolumlar.forEach((d) => { const a = d.tarih.slice(0, 7); aylik[a] = aylik[a] || { yakit: 0, servis: 0, masraf: 0 }; aylik[a].yakit += d.tutar; });
    masraflar.forEach((m) => { const a = m.tarih.slice(0, 7); aylik[a] = aylik[a] || { yakit: 0, servis: 0, masraf: 0 }; aylik[a][m.tip === "servis" ? "servis" : "masraf"] += m.tutar; });
    const aylikArr = Object.entries(aylik).sort().slice(-6).map(([a, v]) => ({ ay: new Date(a + "-01").toLocaleDateString("tr-TR", { month: "short" }), ...v, toplam: v.yakit + v.servis + v.masraf }));
    return { yakitT, servisT, masrafT, toplam, aylikArr };
  }, [dolumlar, masraflar]);

  const donutData = [
    { name: "Yakıt", value: h.yakitT, renk: T.yakit },
    { name: "Masraf", value: h.masrafT, renk: T.masraf },
    { name: "Servis", value: h.servisT, renk: T.servis },
  ].filter((d) => d.value > 0);

  if (h.toplam === 0) {
    return <BosDurum ikon={<BarChart2 size={32} color={T.textMuted} />} başlık="Finansal veri yok" açıklama="Dolum ve masraf ekledikçe maliyet özetin burada oluşur." />;
  }

  return (
    <div>
      {/* Toplam maliyet kartı */}
      <div style={{ background: T.navy, borderRadius: 16, padding: "20px 22px", marginBottom: 16, color: "#fff" }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>TOPLAM MALİYET</div>
        <div style={{ fontSize: 30, fontWeight: 800 }}>{fmtTRY(h.toplam)}</div>
      </div>

      {/* Donut dağılım */}
      <div style={{ background: T.card, borderRadius: 16, padding: 18, marginBottom: 16, border: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 12 }}>Gider Dağılımı</div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 130, height: 130, flexShrink: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} dataKey="value" cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={2} stroke="none">
                  {donutData.map((e, i) => <Cell key={i} fill={e.renk} />)}
                </Pie>
                <Tooltip formatter={(v) => fmtTRY(v)} contentStyle={{ borderRadius: 10, border: `1px solid ${T.border}`, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ flex: 1 }}>
            {donutData.map((d) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 11 }}>
                <span style={{ width: 11, height: 11, borderRadius: 3, background: d.renk, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: T.textSub, flex: 1 }}>{d.name}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{fmtTRY(d.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Aylık stacked bar */}
      {h.aylikArr.length > 0 && (
        <div style={{ background: T.card, borderRadius: 16, padding: "18px 10px 10px", marginBottom: 16, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.text, padding: "0 8px 14px" }}>Aylık Gider</div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={h.aylikArr} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} vertical={false} />
              <XAxis dataKey="ay" tick={{ fill: T.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={(v, n) => [fmtTRY(v), n]} contentStyle={{ borderRadius: 10, border: `1px solid ${T.border}`, fontSize: 12 }} cursor={{ fill: T.borderLight }} />
              <Bar dataKey="yakit" stackId="a" fill={T.yakit} name="Yakıt" radius={[0, 0, 0, 0]} />
              <Bar dataKey="masraf" stackId="a" fill={T.masraf} name="Masraf" />
              <Bar dataKey="servis" stackId="a" fill={T.servis} name="Servis" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Alım/satış kâr-zarar */}
      {(arac.alimTutari || arac.satisTutari) && (
        <div style={{ background: T.card, borderRadius: 16, padding: 18, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 14 }}>Alım / Satış</div>
          <div style={{ display: "flex", gap: 12, marginBottom: arac.alimTutari && arac.satisTutari ? 14 : 0 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: T.textSub, marginBottom: 4 }}>Alım</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: T.text }}>{fmtTRY(arac.alimTutari)}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: T.textSub, marginBottom: 4 }}>Satış</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: T.text }}>{arac.satisTutari ? fmtTRY(arac.satisTutari) : "—"}</div>
            </div>
          </div>
          {arac.alimTutari && arac.satisTutari && (() => {
            const tumM = masraflar.reduce((s, m) => s + m.tutar, 0) + h.yakitT;
            const maliyet = arac.alimTutari + tumM;
            const kz = arac.satisTutari - maliyet;
            return (
              <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: T.textSub }}>Kâr / Zarar (tüm giderler dahil)</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: kz >= 0 ? T.success : T.danger }}>{fmtTRY(kz)}</span>
                </div>
                {arac.alimUsdKuru && arac.satisUsdKuru && (
                  <div style={{ fontSize: 12, color: T.textMuted, marginTop: 8 }}>USD bazında: ${fmtSayi(arac.alimTutari / arac.alimUsdKuru, 0)} → ${fmtSayi(arac.satisTutari / arac.satisUsdKuru, 0)}</div>
                )}
                {arac.alimAltinFiyati && arac.satisAltinFiyati && (
                  <div style={{ fontSize: 12, color: T.textMuted, marginTop: 3 }}>Altın bazında: {fmtSayi(arac.alimTutari / arac.alimAltinFiyati, 1)} gr → {fmtSayi(arac.satisTutari / arac.satisAltinFiyati, 1)} gr</div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// EKRAN: YAKIT (tüketim metrikleri + bar)
// ═════════════════════════════════════════════════════════════
function YakitEkran({ dolumlar }) {
  const h = useMemo(() => {
    const sıralı = [...dolumlar].sort((a, b) => a.tarih.localeCompare(b.tarih));
    let toplamLitre = 0, toplamTutar = 0, toplamKm = 0;
    const tuketimSeri = [];
    sıralı.forEach((d, i) => {
      toplamLitre += d.litre; toplamTutar += d.tutar;
      if (i > 0 && sıralı[i - 1].yakitTipi === d.yakitTipi) {
        const km = d.km - sıralı[i - 1].km;
        if (km > 0) { toplamKm += km; tuketimSeri.push({ tarih: fmtKisaTarih(d.tarih), tuketim: Number(((d.litre / km) * 100).toFixed(1)) }); }
      }
    });
    const ortTuketim = toplamKm > 0 ? (toplamLitre / toplamKm) * 100 : null;
    const ortFiyat = toplamLitre > 0 ? toplamTutar / toplamLitre : null;
    return { toplamLitre, toplamTutar, ortTuketim, ortFiyat, tuketimSeri, adet: dolumlar.length };
  }, [dolumlar]);

  if (!dolumlar.length) {
    return <BosDurum ikon={<Fuel size={32} color={T.textMuted} />} başlık="Dolum yok" açıklama="Yakıt dolumu ekledikçe tüketim analizin burada oluşur." />;
  }

  const sonDolum = [...dolumlar].sort((a, b) => b.tarih.localeCompare(a.tarih))[0] || null;

  return (
    <div>
      {sonDolum && (
        <div className="ct" style={{ background: T.primaryDim, border: `1px solid rgba(30,111,217,0.2)`, borderRadius: 14, padding: "14px 16px", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, letterSpacing: "0.05em" }}>SON DOLUM</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginTop: 3 }}>
              {fmtKisaTarih(sonDolum.tarih)} · {fmtSayi(sonDolum.litre, 1)} L · {fmtSayi(sonDolum.km, 0)} km
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, letterSpacing: "0.05em" }}>BİRİM FİYAT</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: T.primary, marginTop: 3 }}>
              {fmtSayi(sonDolum.tutar / sonDolum.litre, 2)} <span style={{ fontSize: 12, fontWeight: 600 }}>₺/L</span>
            </div>
          </div>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <Metrik etiket="ORT. TÜKETİM" değer={h.ortTuketim ? `${fmtSayi(h.ortTuketim)}` : "—"} alt="L/100km" renk={T.yakit} />
        <Metrik etiket="ORT. FİYAT" değer={h.ortFiyat ? fmtSayi(h.ortFiyat, 2) : "—"} alt="₺/litre" />
        <Metrik etiket="TOPLAM LİTRE" değer={fmtSayi(h.toplamLitre, 0)} alt={`${h.adet} dolum`} />
        <Metrik etiket="TOPLAM TUTAR" değer={fmtTRY(h.toplamTutar)} />
      </div>
      {h.tuketimSeri.length > 1 && (
        <div style={{ background: T.card, borderRadius: 16, padding: "18px 10px 10px", border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.text, padding: "0 8px 14px" }}>Tüketim Geçmişi (L/100km)</div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={h.tuketimSeri} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} vertical={false} />
              <XAxis dataKey="tarih" tick={{ fill: T.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip formatter={(v) => [`${v} L/100km`, "Tüketim"]} contentStyle={{ borderRadius: 10, border: `1px solid ${T.border}`, fontSize: 12 }} cursor={{ fill: T.borderLight }} />
              <Bar dataKey="tuketim" fill={T.yakit} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
function Metrik({ etiket, değer, alt, renk }) {
  return (
    <div style={{ background: T.card, borderRadius: 14, padding: "15px 16px", border: `1px solid ${T.border}` }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, letterSpacing: "0.03em" }}>{etiket}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: renk || T.text, marginTop: 6, lineHeight: 1.1 }}>{değer}</div>
      {alt && <div style={{ fontSize: 11, color: T.textMuted, marginTop: 3 }}>{alt}</div>}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// EKRAN: BİLGİ (araç detayları + belgeler + lastik)
// ═════════════════════════════════════════════════════════════
function BilgiEkran({ arac, sk, uyarilar }) {
  const yakitListesi = arac.yakitTipleri || [arac.anaYakitTipi || "benzin"];
  const Satir = ({ l, v, belge, ek }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${T.borderLight}` }}>
      <span style={{ fontSize: 14, color: T.textSub }}>{l}</span>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{v}</div>
        {ek && <div style={{ fontSize: 12, color: T.textMuted }}>{ek}</div>}
        {belge && <a href={belge.veri} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: T.primary }}>Görüntüle</a>}
      </div>
    </div>
  );
  const Bolum = ({ başlık, children }) => (
    <div style={{ background: T.card, borderRadius: 16, padding: "6px 16px 14px", marginBottom: 14, border: `1px solid ${T.border}` }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: T.textMuted, letterSpacing: "0.04em", padding: "12px 0 4px" }}>{başlık}</div>
      {children}
    </div>
  );

  return (
    <div>
      <Bolum başlık="ARAÇ">
        <Satir l="Taşıt türü" v={tl(arac.tasitTipi)} />
        <Satir l="Yakıt" v={yakitListesi.map(yl).join(" + ")} />
        {arac.yil && <Satir l="Yıl" v={arac.yil} />}
        {arac.motorGucu && <Satir l="Motor gücü" v={`${arac.motorGucu} hp`} />}
        {arac.motorHacmi && <Satir l="Motor hacmi" v={`${fmtSayi(arac.motorHacmi, 0)} cc`} />}
        {arac.silindirSayisi && <Satir l="Silindir" v={`${arac.silindirSayisi}`} />}
        {arac.sanziman && <Satir l="Şanzıman" v={arac.sanziman} />}
        {arac.depoKapasitesi && <Satir l="Depo" v={`${arac.depoKapasitesi} L`} />}
        {sk && <Satir l="Güncel km" v={`${fmtSayi(sk, 0)} km`} />}
      </Bolum>

      {(arac.muayeneBitis || arac.egzozBitis || arac.sigortaBitis || arac.kaskoBitis || arac.kaskoYok) && (
        <Bolum başlık="MUAYENE & SİGORTA">
          {arac.muayeneBitis && <Satir l="Muayene bitiş" v={fmtTarih(arac.muayeneBitis)} belge={arac.muayeneBelgesi} />}
          {arac.egzozBitis && <Satir l="Egzoz muayene" v={fmtTarih(arac.egzozBitis)} />}
          {arac.sigortaBitis && <Satir l="Trafik sigortası" v={fmtTarih(arac.sigortaBitis)} ek={arac.sigortaSirketi} belge={arac.sigortaPolicesi} />}
          {arac.kaskoYok ? <Satir l="Kasko" v="Yok" /> : (arac.kaskoBitis && <Satir l="Kasko" v={fmtTarih(arac.kaskoBitis)} ek={arac.kaskoSirketi} belge={arac.kaskoPolicesi} />)}
          {arac.mtvDonemi && <Satir l="MTV" v={arac.mtvDonemi} ek={arac.mtvOdendi ? "Ödendi" : "Ödenmedi"} />}
        </Bolum>
      )}

      {(arac.lastikTipi || arac.lastikEbati || arac.lastikDegisimTarihi) && (
        <Bolum başlık="LASTİK">
          {arac.lastikTipi && <Satir l="Tip" v={arac.lastikTipi} />}
          {arac.lastikEbati && <Satir l="Ebat" v={arac.lastikEbati} />}
          {arac.lastikDegisimTarihi && <Satir l="Son değişim" v={fmtTarih(arac.lastikDegisimTarihi)} />}
          {arac.lastikDegisimKm && <Satir l="Değişim km" v={`${fmtSayi(arac.lastikDegisimKm, 0)} km`} />}
          {arac.lastikFaturasi && <Satir l="Fatura" v="" belge={{ tip: "image", veri: arac.lastikFaturasi }} />}
        </Bolum>
      )}

      {(arac.bakimPeriyoduKm || arac.sonBakimTarihi) && (
        <Bolum başlık="BAKIM">
          {arac.bakimPeriyoduKm && <Satir l="Bakım periyodu" v={`${fmtSayi(arac.bakimPeriyoduKm, 0)} km`} />}
          {arac.sonBakimKm && <Satir l="Son bakım km" v={`${fmtSayi(arac.sonBakimKm, 0)} km`} />}
          {arac.sonBakimTarihi && <Satir l="Son bakım tarihi" v={fmtTarih(arac.sonBakimTarihi)} />}
        </Bolum>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// ARAÇ SEÇİCİ (üst bardan açılır)
// ═════════════════════════════════════════════════════════════
function AracSecici({ araclar, aktifId, doldurmalar, onSec, onYeni, onKapat }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", flexDirection: "column" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(19,41,61,0.55)" }} onClick={onKapat} />
      <div style={{ position: "relative", marginTop: "auto", background: T.bg, borderRadius: "22px 22px 0 0", maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "#CBD3DC", margin: "12px auto 0" }} />
        <div style={{ padding: "16px 20px 8px", fontSize: 17, fontWeight: 700 }}>Araç Seç</div>
        <div style={{ overflowY: "auto", padding: "8px 16px 16px" }}>
          {araclar.map((a) => {
            const sk = sonKm(doldurmalar, a.id);
            return (
              <button key={a.id} onClick={() => onSec(a.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 13, padding: 12, marginBottom: 8, borderRadius: 14, background: T.card, border: `1.5px solid ${a.id === aktifId ? T.primary : T.border}`, textAlign: "left" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: a.id === aktifId ? T.primary : T.bg, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                  {a.foto ? <img src={a.foto} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <TasitIkonu tip={a.tasitTipi} size={22} color={a.id === aktifId ? "#fff" : T.textMuted} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{a.marka} {a.model}</div>
                  <div style={{ fontSize: 12, color: T.textSub }}>{a.plaka || tl(a.tasitTipi)}{sk ? ` · ${fmtSayi(sk, 0)} km` : ""}</div>
                </div>
                {a.id === aktifId && <Check size={20} color={T.primary} />}
              </button>
            );
          })}
          <button onClick={onYeni} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 14, borderRadius: 14, background: T.primaryDim, color: T.primary, fontSize: 15, fontWeight: 700, marginTop: 4 }}>
            <Plus size={20} strokeWidth={2.4} /> Yeni araç ekle
          </button>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// MODAL ÇERÇEVE (ortak bottom-sheet)
// ═════════════════════════════════════════════════════════════
function Modal({ başlık, onKapat, children, footer, yükseklik = "92vh" }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", flexDirection: "column" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(19,41,61,0.55)" }} onClick={onKapat} />
      <div style={{ position: "relative", marginTop: "auto", background: T.bg, borderRadius: "22px 22px 0 0", maxHeight: yükseklik, display: "flex", flexDirection: "column" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "#CBD3DC", margin: "12px auto 0" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px 0" }}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>{başlık}</div>
          <button onClick={onKapat} style={{ width: 32, height: 32, borderRadius: 16, background: T.card, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}><X size={16} color={T.textSub} /></button>
        </div>
        <div style={{ overflowY: "auto", padding: "16px 20px 8px", flex: 1 }}>{children}</div>
        {footer}
      </div>
    </div>
  );
}
function ModalFooter({ onKapat, onKaydet, kaydetLabel = "Kaydet", onSil }) {
  return (
    <div style={{ display: "flex", gap: 10, padding: "12px 20px 28px", alignItems: "center" }}>
      {onSil && <button onClick={onSil} style={{ width: 48, height: 48, borderRadius: 12, background: T.dangerDim, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Trash2 size={18} color={T.danger} /></button>}
      <button onClick={onKapat} style={{ flex: 1, padding: 14, borderRadius: 12, border: `1px solid ${T.border}`, background: T.card, color: T.textSub, fontSize: 15, fontWeight: 600 }}>Vazgeç</button>
      <button onClick={onKaydet} style={{ flex: 2, padding: 14, borderRadius: 12, background: T.primary, color: "#fff", fontSize: 15, fontWeight: 700 }}>{kaydetLabel}</button>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// ARAÇ FORM MODALI
// ═════════════════════════════════════════════════════════════
function AracFormModal({ mevcut, onKaydet, onKapat, onSil }) {
  const [form, setForm] = useState(() => {
    if (!mevcut) return bosAracForm();
    const f = { ...bosAracForm(), ...mevcut };
    if (!f.anaYakitTipi && mevcut.yakitTipleri) { f.anaYakitTipi = mevcut.yakitTipleri.filter((y) => y !== "lpg")[0] || "benzin"; f.lpgVarMi = mevcut.yakitTipleri.includes("lpg"); }
    if (!f.motorHacmi && mevcut.silindir) f.motorHacmi = String(mevcut.silindir);
    Object.keys(f).forEach((k) => { if (f[k] != null && typeof f[k] !== "boolean" && typeof f[k] !== "object") f[k] = String(f[k]); });
    f.lpgVarMi = !!mevcut.lpgVarMi; f.kaskoYok = !!mevcut.kaskoYok; f.mtvOdendi = !!mevcut.mtvOdendi;
    ["foto", "muayeneBelgesi", "sigortaPolicesi", "kaskoPolicesi", "lastikFaturasi"].forEach((k) => f[k] = mevcut[k] || null);
    return f;
  });
  const [bolum, setBolum] = useState("temel");
  const [hata, setHata] = useState("");
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const bugun = bugunStr();

  function kaydet() {
    if (!form.marka.trim() || !form.model.trim()) { setHata("Marka ve model zorunlu."); return; }
    if (form.yil) { const y = Number(form.yil); if (y < MIN_YIL || y > MAX_YIL) { setHata(`Yıl ${MIN_YIL}–${MAX_YIL} arasında olmalı.`); return; } }
    const yl2 = [form.anaYakitTipi];
    if (form.anaYakitTipi === "benzin" && form.lpgVarMi && lpgDestekli(form.tasitTipi)) yl2.push("lpg");
    const num = (v) => v ? Number(String(v).replace(",", ".")) : null;
    onKaydet({
      ...form, id: mevcut?.id, yakitTipleri: yl2,
      yil: form.yil ? Number(form.yil) : null,
      motorGucu: num(form.motorGucu), motorHacmi: num(form.motorHacmi), silindirSayisi: num(form.silindirSayisi),
      depoKapasitesi: num(form.depoKapasitesi), lastikDegisimKm: num(form.lastikDegisimKm),
      bakimPeriyoduKm: num(form.bakimPeriyoduKm), sonBakimKm: num(form.sonBakimKm),
      alimTutari: num(form.alimTutari), alimUsdKuru: num(form.alimUsdKuru), alimAltinFiyati: num(form.alimAltinFiyati),
      satisTutari: num(form.satisTutari), satisUsdKuru: num(form.satisUsdKuru), satisAltinFiyati: num(form.satisAltinFiyati),
      kaskoBitis: form.kaskoYok ? null : form.kaskoBitis || null,
      kaskoSirketi: form.kaskoYok ? null : form.kaskoSirketi || null,
      kaskoPolicesi: form.kaskoYok ? null : form.kaskoPolicesi || null,
    });
  }

  const BOLUMLER = [{ id: "temel", l: "Araç" }, { id: "lastik", l: "Lastik" }, { id: "belge", l: "Belgeler" }, { id: "bakim", l: "Bakım" }, { id: "finans", l: "Finansal" }];

  return (
    <Modal başlık={mevcut ? "Aracı Düzenle" : "Yeni Araç"} onKapat={onKapat}
      footer={<><div style={{ padding: hata ? "0 20px 6px" : 0, fontSize: 13, color: T.danger, textAlign: "center" }}>{hata}</div><ModalFooter onKapat={onKapat} onKaydet={kaydet} kaydetLabel={mevcut ? "Güncelle" : "Ekle"} onSil={onSil} /></>}>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 2 }}>
        {BOLUMLER.map((b) => (
          <button key={b.id} onClick={() => setBolum(b.id)} style={{ padding: "7px 14px", borderRadius: 20, border: `1.5px solid ${bolum === b.id ? T.primary : T.border}`, background: bolum === b.id ? T.primaryDim : T.card, color: bolum === b.id ? T.primary : T.textSub, fontSize: 13, fontWeight: bolum === b.id ? 600 : 500, flexShrink: 0 }}>{b.l}</button>
        ))}
      </div>

      {bolum === "temel" && (
        <>
          <FotoAlani etiket="Araç fotoğrafı" gorsel={form.foto} onSec={(e) => sıkıstir(e, (v) => set("foto", v))} onKaldir={() => set("foto", null)} />
          <Field label="Taşıt türü">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {TASIT_TURLERI.map((t) => (
                <button key={t.id} onClick={() => { const iz = anaYakitler(t.id).map((y) => y.id); set("tasitTipi", t.id); if (!iz.includes(form.anaYakitTipi)) set("anaYakitTipi", iz[0]); }}
                  style={{ display: "flex", alignItems: "center", gap: 9, padding: "11px 12px", borderRadius: 11, border: `1.5px solid ${form.tasitTipi === t.id ? T.primary : T.border}`, background: form.tasitTipi === t.id ? T.primaryDim : T.card, color: form.tasitTipi === t.id ? T.primary : T.textSub, textAlign: "left" }}>
                  <TasitIkonu tip={t.id} size={17} color={form.tasitTipi === t.id ? T.primary : T.textMuted} />
                  <span style={{ fontSize: 12, fontWeight: form.tasitTipi === t.id ? 600 : 500, lineHeight: 1.2 }}>{t.label}</span>
                </button>
              ))}
            </div>
          </Field>
          <Field label="Yakıt tipi">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: form.anaYakitTipi === "benzin" && lpgDestekli(form.tasitTipi) ? 12 : 0 }}>
              {anaYakitler(form.tasitTipi).map((y) => (
                <Chip key={y.id} aktif={form.anaYakitTipi === y.id} renk={y.renk} onClick={() => { set("anaYakitTipi", y.id); if (y.id !== "benzin") set("lpgVarMi", false); }}>{y.label}</Chip>
              ))}
            </div>
            {form.anaYakitTipi === "benzin" && lpgDestekli(form.tasitTipi) && (
              <Toggle label="LPG dönüşümü de var" checked={form.lpgVarMi} onChange={(v) => set("lpgVarMi", v)} açıklama="Benzin + LPG arası geçiş yapılabiliyor" />
            )}
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Marka *" value={form.marka} onChange={(v) => set("marka", v)} placeholder="Toyota" />
            <Input label="Model *" value={form.model} onChange={(v) => set("model", v)} placeholder="Corolla" />
            <NumberInput label="Yıl" value={form.yil} onChange={(v) => set("yil", v)} placeholder="2021" maxDigits={4} raw />
            <Input label="Plaka" value={form.plaka} onChange={(v) => set("plaka", v)} placeholder="34 ABC 123" />
            <NumberInput label="Motor gücü (hp)" value={form.motorGucu} onChange={(v) => set("motorGucu", v)} placeholder="132" />
            <NumberInput label="Motor hacmi (cc)" value={form.motorHacmi} onChange={(v) => set("motorHacmi", v)} placeholder="1.600" />
            <NumberInput label="Silindir sayısı" value={form.silindirSayisi} onChange={(v) => set("silindirSayisi", v)} placeholder="4" maxDigits={2} raw />
            <Select label="Şanzıman" value={form.sanziman} onChange={(v) => set("sanziman", v)} options={SANZIMAN} />
            <NumberInput label="Depo (L)" value={form.depoKapasitesi} onChange={(v) => set("depoKapasitesi", v)} placeholder="50" />
          </div>
        </>
      )}

      {bolum === "lastik" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Select label="Lastik tipi" value={form.lastikTipi} onChange={(v) => set("lastikTipi", v)} options={LASTIK_T} />
            <Input label="Lastik ebatı" value={form.lastikEbati} onChange={(v) => set("lastikEbati", v)} placeholder="205/55 R16" />
            <Input type="date" label="Son değişim tarihi" value={form.lastikDegisimTarihi} max={bugun} onChange={(v) => set("lastikDegisimTarihi", v)} />
            <NumberInput label="Değişim km'si" value={form.lastikDegisimKm} onChange={(v) => set("lastikDegisimKm", v)} placeholder="38.500" />
          </div>
          <FotoAlani etiket="Lastik faturası" gorsel={form.lastikFaturasi} onSec={(e) => sıkıstir(e, (v) => set("lastikFaturasi", v))} onKaldir={() => set("lastikFaturasi", null)} />
        </>
      )}

      {bolum === "belge" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input type="date" label="Muayene bitiş" value={form.muayeneBitis} onChange={(v) => set("muayeneBitis", v)} />
            <Input type="date" label="Egzoz emisyon bitiş" value={form.egzozBitis} onChange={(v) => set("egzozBitis", v)} />
          </div>
          <BelgeAlani etiket="Muayene belgesi" belge={form.muayeneBelgesi} onSec={(e) => belgeSec(e, (v) => set("muayeneBelgesi", v))} onKaldir={() => set("muayeneBelgesi", null)} />
          <div style={{ height: 1, background: T.border, margin: "8px 0 16px" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input type="date" label="Trafik sigortası bitiş" value={form.sigortaBitis} onChange={(v) => set("sigortaBitis", v)} />
            <Input label="Sigorta şirketi" value={form.sigortaSirketi} onChange={(v) => set("sigortaSirketi", v)} placeholder="Allianz" />
          </div>
          <BelgeAlani etiket="Sigorta poliçesi (PDF)" belge={form.sigortaPolicesi} onSec={(e) => belgeSec(e, (v) => set("sigortaPolicesi", v))} onKaldir={() => set("sigortaPolicesi", null)} />
          <div style={{ height: 1, background: T.border, margin: "8px 0 16px" }} />
          <Toggle label="Bu araçta kasko yok" checked={form.kaskoYok} onChange={(v) => set("kaskoYok", v)} />
          {!form.kaskoYok && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Input type="date" label="Kasko bitiş" value={form.kaskoBitis} onChange={(v) => set("kaskoBitis", v)} />
                <Input label="Kasko şirketi" value={form.kaskoSirketi} onChange={(v) => set("kaskoSirketi", v)} placeholder="Axa" />
              </div>
              <BelgeAlani etiket="Kasko poliçesi (PDF)" belge={form.kaskoPolicesi} onSec={(e) => belgeSec(e, (v) => set("kaskoPolicesi", v))} onKaldir={() => set("kaskoPolicesi", null)} />
            </>
          )}
        </>
      )}

      {bolum === "bakim" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Select label="MTV dönemi" value={form.mtvDonemi} onChange={(v) => set("mtvDonemi", v)} options={MTV_D} />
          </div>
          <Toggle label="MTV ödendi" checked={form.mtvOdendi} onChange={(v) => set("mtvOdendi", v)} />
          <div style={{ height: 1, background: T.border, margin: "4px 0 16px" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <NumberInput label="Kaç km'de bakım" value={form.bakimPeriyoduKm} onChange={(v) => set("bakimPeriyoduKm", v)} placeholder="15.000" />
            <NumberInput label="Son bakım km" value={form.sonBakimKm} onChange={(v) => set("sonBakimKm", v)} placeholder="42.000" />
          </div>
          <Input type="date" label="Son bakım tarihi" value={form.sonBakimTarihi} max={bugun} onChange={(v) => set("sonBakimTarihi", v)} />
        </>
      )}

      {bolum === "finans" && (
        <>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.textSub, marginBottom: 12 }}>ALIM</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input type="date" label="Alım tarihi" value={form.alimTarihi} max={bugun} onChange={(v) => set("alimTarihi", v)} />
            <NumberInput label="Alım tutarı (₺)" value={form.alimTutari} onChange={(v) => set("alimTutari", v)} placeholder="450.000" decimal />
            <NumberInput label="USD/TRY (o gün)" value={form.alimUsdKuru} onChange={(v) => set("alimUsdKuru", v)} placeholder="34,20" decimal />
            <NumberInput label="Gram altın (o gün)" value={form.alimAltinFiyati} onChange={(v) => set("alimAltinFiyati", v)} placeholder="2.450" decimal />
          </div>
          <div style={{ height: 1, background: T.border, margin: "8px 0 16px" }} />
          <div style={{ fontSize: 13, fontWeight: 700, color: T.textSub, marginBottom: 12 }}>SATIŞ</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input type="date" label="Satış tarihi" value={form.satisTarihi} max={bugun} onChange={(v) => set("satisTarihi", v)} />
            <NumberInput label="Satış tutarı (₺)" value={form.satisTutari} onChange={(v) => set("satisTutari", v)} placeholder="520.000" decimal />
            <NumberInput label="USD/TRY (o gün)" value={form.satisUsdKuru} onChange={(v) => set("satisUsdKuru", v)} placeholder="38,50" decimal />
            <NumberInput label="Gram altın (o gün)" value={form.satisAltinFiyati} onChange={(v) => set("satisAltinFiyati", v)} placeholder="3.100" decimal />
          </div>
        </>
      )}
    </Modal>
  );
}

// ═════════════════════════════════════════════════════════════
// DOLUM FORM MODALI
// ═════════════════════════════════════════════════════════════
function DolumFormModal({ mevcut, yakitListesi, onKaydet, onKapat }) {
  const bugun = bugunStr();
  const [form, setForm] = useState(mevcut ? {
    tarih: mevcut.tarih, km: String(mevcut.km), yakitTipi: mevcut.yakitTipi, litre: String(mevcut.litre), tutar: String(mevcut.tutar),
    istasyon: mevcut.istasyon || "", sehir: mevcut.sehir || "", odemeYontemi: mevcut.odemeYontemi || "",
    depoDoluluk: mevcut.depoDoluluk || "", surusTipi: mevcut.surusTipi || "", not: mevcut.not || "",
    kmGorseli: mevcut.kmGorseli || null, fisGorseli: mevcut.fisGorseli || null,
  } : { tarih: bugun, km: "", yakitTipi: yakitListesi[0] || "benzin", litre: "", tutar: "", istasyon: "", sehir: "", odemeYontemi: "", depoDoluluk: "", surusTipi: "", not: "", kmGorseli: null, fisGorseli: null });
  const [hata, setHata] = useState("");
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const lt = Number(String(form.litre).replace(",", ".")), tt = Number(String(form.tutar).replace(",", "."));
  const birim = lt && tt ? tt / lt : null;

  function kaydet() {
    if (!form.tarih || !form.km || !form.litre || !form.tutar || !form.yakitTipi) { setHata("Tarih, km, litre, tutar zorunlu."); return; }
    onKaydet(form);
  }

  return (
    <Modal başlık={mevcut ? "Dolumu Düzenle" : "Dolum Ekle"} onKapat={onKapat} yükseklik="90vh"
      footer={<><div style={{ padding: hata ? "0 20px 6px" : 0, fontSize: 13, color: T.danger, textAlign: "center" }}>{hata}</div><ModalFooter onKapat={onKapat} onKaydet={kaydet} /></>}>
      {yakitListesi.length > 1 && (
        <Field label="Yakıt tipi">
          <div style={{ display: "flex", gap: 8 }}>{yakitListesi.map((y) => <Chip key={y} aktif={form.yakitTipi === y} renk={yt(y)} onClick={() => set("yakitTipi", y)}>{yl(y)}</Chip>)}</div>
        </Field>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Input type="date" label="Tarih *" value={form.tarih} max={bugun} onChange={(v) => set("tarih", v)} />
        <NumberInput label="Km *" value={form.km} onChange={(v) => set("km", v)} placeholder="45.230" />
        <NumberInput label="Litre *" value={form.litre} onChange={(v) => set("litre", v)} placeholder="42,5" decimal />
        <NumberInput label="Tutar (₺) *" value={form.tutar} onChange={(v) => set("tutar", v)} placeholder="1.850" decimal />
      </div>
      {birim && <div style={{ padding: "10px 14px", background: T.primaryDim, borderRadius: 10, marginBottom: 14, fontSize: 14, color: T.primary, fontWeight: 700, textAlign: "center" }}>{fmtSayi(birim, 2)} ₺/litre</div>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Input label="İstasyon" value={form.istasyon} onChange={(v) => set("istasyon", v)} placeholder="Opet, Shell..." />
        <Input label="Şehir" value={form.sehir} onChange={(v) => set("sehir", v)} placeholder="İstanbul" />
        <Select label="Ödeme" value={form.odemeYontemi} onChange={(v) => set("odemeYontemi", v)} options={ODEME} />
        <Select label="Depo" value={form.depoDoluluk} onChange={(v) => set("depoDoluluk", v)} options={DEPO} />
      </div>
      <Select label="Sürüş tipi" value={form.surusTipi} onChange={(v) => set("surusTipi", v)} options={SURUS} />
      <Input label="Not" value={form.not} onChange={(v) => set("not", v)} placeholder="Klimalı uzun yol..." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FotoAlani etiket="Km göstergesi" gorsel={form.kmGorseli} onSec={(e) => sıkıstir(e, (v) => set("kmGorseli", v))} onKaldir={() => set("kmGorseli", null)} />
        <FotoAlani etiket="Yakıt fişi" gorsel={form.fisGorseli} onSec={(e) => sıkıstir(e, (v) => set("fisGorseli", v))} onKaldir={() => set("fisGorseli", null)} />
      </div>
    </Modal>
  );
}

// ═════════════════════════════════════════════════════════════
// MASRAF / SERVİS FORM MODALI (tip ile ayrılır)
// ═════════════════════════════════════════════════════════════
function MasrafFormModal({ mevcut, tip, onKaydet, onKapat }) {
  const servisMi = (mevcut?.tip || tip) === "servis";
  const bugun = bugunStr();
  const [form, setForm] = useState(mevcut ? {
    tip: mevcut.tip, kategori: mevcut.kategori || "", aciklama: mevcut.aciklama || "", tarih: mevcut.tarih, km: mevcut.km ? String(mevcut.km) : "", tutar: String(mevcut.tutar), faturaGorseli: mevcut.faturaGorseli || null,
  } : { tip, kategori: "", aciklama: "", tarih: bugun, km: "", tutar: "", faturaGorseli: null });
  const [hata, setHata] = useState("");
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const katlar = servisMi ? SERVIS_KAT : MASRAF_KAT;

  function kaydet() {
    if (!form.kategori && !form.aciklama) { setHata("Kategori seç veya açıklama yaz."); return; }
    if (!form.tutar) { setHata("Tutar zorunlu."); return; }
    onKaydet(form);
  }

  return (
    <Modal başlık={mevcut ? (servisMi ? "Servisi Düzenle" : "Masrafı Düzenle") : (servisMi ? "Servis Ekle" : "Masraf Ekle")} onKapat={onKapat} yükseklik="82vh"
      footer={<><div style={{ padding: hata ? "0 20px 6px" : 0, fontSize: 13, color: T.danger, textAlign: "center" }}>{hata}</div><ModalFooter onKapat={onKapat} onKaydet={kaydet} /></>}>
      <Field label="Kategori">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {katlar.map((k) => <Chip key={k} aktif={form.kategori === k} renk={servisMi ? T.servis : T.masraf} onClick={() => set("kategori", form.kategori === k ? "" : k)}>{k}</Chip>)}
        </div>
      </Field>
      <Input label="Açıklama" value={form.aciklama} onChange={(v) => set("aciklama", v)} placeholder={servisMi ? "Yağ + filtre değişimi" : "Köprü geçişi"} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Input type="date" label="Tarih" value={form.tarih} max={bugun} onChange={(v) => set("tarih", v)} />
        <NumberInput label="Tutar (₺) *" value={form.tutar} onChange={(v) => set("tutar", v)} placeholder="1.500" decimal />
      </div>
      {servisMi && <NumberInput label="Km (opsiyonel)" value={form.km} onChange={(v) => set("km", v)} placeholder="45.000" />}
      <FotoAlani etiket="Fatura / fiş" gorsel={form.faturaGorseli} onSec={(e) => sıkıstir(e, (v) => set("faturaGorseli", v))} onKaldir={() => set("faturaGorseli", null)} />
    </Modal>
  );
}
