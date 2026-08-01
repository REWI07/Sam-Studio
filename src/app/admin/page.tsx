"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  X, Save, Upload, Plus, Trash2, ChevronUp, ChevronDown,
  Eye, LogOut, ImageIcon, Type, User, Phone, Grid3X3, Quote, Star, KeyRound, CheckCircle2
} from "lucide-react";

type Service = { name: string; duration: string; price: string; note?: string };
type ServiceCategory = { category: string; items: Service[] };
type Hour = { label: string; value: string };
type ReviewItem = { name: string; rating: number; text: string; date: string };

type Content = {
  hero: { backgroundImage: string; welcomeText: string; line1: string; line2: string; tagline: string };
  about: { portraitImage: string; ownerName: string; ownerRole: string; heading: string; headingAccent: string; text1: string; text2: string; rating: string; reviews: string; experience: string };
  story: { backgroundImage: string; label: string; quoteBefore: string; quoteAccent: string; quoteAfter: string; tagline: string };
  reviews: { rating: string; count: string; items: ReviewItem[] };
  gallery: string[];
  services: ServiceCategory[];
  studio: { name: string; city: string; address: string; area: string; phone: string; bookingUrl: string; instagram: string; hours: Hour[] };
};

const TABS = [
  { id: "gallery", label: "Galleri", icon: Grid3X3 },
  { id: "hero", label: "Hero", icon: ImageIcon },
  { id: "about", label: "Om oss", icon: User },
  { id: "story", label: "Story", icon: Quote },
  { id: "reviews", label: "Recensioner", icon: Star },
  { id: "services", label: "Tjänster", icon: Type },
  { id: "contact", label: "Kontakt", icon: Phone },
  { id: "account", label: "Konto", icon: KeyRound },
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState<"admin" | "superadmin">("admin");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [content, setContent] = useState<Content | null>(null);
  const [tab, setTab] = useState("gallery");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const touchDragIdx = useRef<number | null>(null);

  function handleTouchStart(idx: number) {
    touchDragIdx.current = idx;
    setDragIdx(idx);
  }

  function handleTouchMove(e: React.TouchEvent) {
    const touch = e.touches[0];
    const els = document.elementsFromPoint(touch.clientX, touch.clientY);
    for (const el of els) {
      const raw = (el as HTMLElement).dataset?.galleryIdx;
      if (raw !== undefined) {
        const ti = parseInt(raw);
        setDragOver(ti);
        return;
      }
    }
  }

  function handleTouchEnd() {
    const from = touchDragIdx.current;
    if (from !== null && dragOver !== null && from !== dragOver) {
      moveGallery(from, dragOver);
    }
    touchDragIdx.current = null;
    setDragIdx(null);
    setDragOver(null);
  }

  useEffect(() => {
    if (authed) fetchContent();
  }, [authed]);

  async function fetchContent() {
    const res = await fetch("/api/admin/content");
    const d = await res.json();
    setContent({
      ...d,
      story: d.story ?? {
        backgroundImage: "/img/sam1.jpg",
        label: "Vår filosofi",
        quoteBefore: "Ett klipp är mer än ett klipp —",
        quoteAccent: "det är känslan du bär med dig",
        quoteAfter: "när du lämnar stolen.",
        tagline: "Sam Studio · Växjö · sedan 2018",
      },
      reviews: d.reviews ?? {
        rating: "4.9",
        count: "424",
        items: [],
      },
    });
  }

  async function save() {
    if (!content) return;
    setSaving(true);
    await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: credentials.username, password: credentials.password, ...content }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function uploadImage(file: File): Promise<string | null> {
    const fd = new FormData();
    fd.append("username", credentials.username);
    fd.append("password", credentials.password);
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (!res.ok) return null;
    const { path } = await res.json();
    return path;
  }

  function removeGalleryImage(idx: number) {
    if (!content) return;
    const g = [...content.gallery];
    g.splice(idx, 1);
    setContent({ ...content, gallery: g });
  }

  function moveGallery(from: number, to: number) {
    if (!content) return;
    const g = [...content.gallery];
    const [item] = g.splice(from, 1);
    g.splice(to, 0, item);
    setContent({ ...content, gallery: g });
  }

  function onDragStart(idx: number) { setDragIdx(idx); }
  function onDragOver(e: React.DragEvent, idx: number) { e.preventDefault(); setDragOver(idx); }
  function onDrop(e: React.DragEvent, idx: number) {
    e.preventDefault();
    if (dragIdx !== null && dragIdx !== idx) moveGallery(dragIdx, idx);
    setDragIdx(null);
    setDragOver(null);
  }

  async function handleGalleryUpload(files: FileList | null) {
    if (!files || !content) return;
    const paths: string[] = [];
    for (const file of Array.from(files)) {
      const p = await uploadImage(file);
      if (p) paths.push(p);
    }
    setContent({ ...content, gallery: [...content.gallery, ...paths] });
  }

  function updateService(ci: number, si: number, field: keyof Service, val: string) {
    if (!content) return;
    const s = JSON.parse(JSON.stringify(content.services)) as ServiceCategory[];
    (s[ci].items[si] as Record<string, string>)[field] = val;
    setContent({ ...content, services: s });
  }

  function removeService(ci: number, si: number) {
    if (!content) return;
    const s = JSON.parse(JSON.stringify(content.services)) as ServiceCategory[];
    s[ci].items.splice(si, 1);
    setContent({ ...content, services: s });
  }

  function addService(ci: number) {
    if (!content) return;
    const s = JSON.parse(JSON.stringify(content.services)) as ServiceCategory[];
    s[ci].items.push({ name: "Ny tjänst", duration: "30 min", price: "0 kr" });
    setContent({ ...content, services: s });
  }

  function moveService(ci: number, si: number, dir: -1 | 1) {
    if (!content) return;
    const s = JSON.parse(JSON.stringify(content.services)) as ServiceCategory[];
    const items = s[ci].items;
    const to = si + dir;
    if (to < 0 || to >= items.length) return;
    [items[si], items[to]] = [items[to], items[si]];
    setContent({ ...content, services: s });
  }

  async function handleLogin() {
    if (!loginUsername || !loginPassword) {
      setLoginError("Fyll i användarnamn och lösenord");
      return;
    }
    setLoginLoading(true);
    setLoginError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", username: loginUsername, password: loginPassword }),
    });
    setLoginLoading(false);
    if (res.ok) {
      const d = await res.json();
      setCredentials({ username: loginUsername, password: loginPassword });
      setRole(d.role === "superadmin" ? "superadmin" : "admin");
      setAuthed(true);
    } else {
      const d = await res.json();
      setLoginError(d.error ?? "Fel uppgifter");
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#080608] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <Image src="/img/logo.jpeg" alt="Sam Studio" width={80} height={80} className="w-20 h-20 rounded-full mb-4" />
            <h1 className="font-display text-2xl text-[#ece6dc]">Admin Panel</h1>
            <p className="text-xs text-[#9e9590] mt-1 tracking-widest uppercase">Sam Studio Växjö</p>
          </div>
          <input
            type="text"
            placeholder="Användarnamn"
            autoComplete="username"
            value={loginUsername}
            onChange={e => { setLoginUsername(e.target.value); setLoginError(""); }}
            onKeyDown={e => { if (e.key === "Enter") handleLogin(); }}
            className="w-full px-5 py-4 rounded-sm bg-[#100e12] border border-[rgba(184,154,106,0.18)] text-[#ece6dc] placeholder-[#9e9590] outline-none focus:border-[#c8a46a] transition-colors text-sm mb-3"
          />
          <input
            type="password"
            placeholder="Lösenord"
            autoComplete="current-password"
            value={loginPassword}
            onChange={e => { setLoginPassword(e.target.value); setLoginError(""); }}
            onKeyDown={e => { if (e.key === "Enter") handleLogin(); }}
            className="w-full px-5 py-4 rounded-sm bg-[#100e12] border border-[rgba(184,154,106,0.18)] text-[#ece6dc] placeholder-[#9e9590] outline-none focus:border-[#c8a46a] transition-colors text-sm mb-3"
          />
          {loginError && <p className="text-red-400 text-xs mb-3 text-center">{loginError}</p>}
          <button
            onClick={handleLogin}
            disabled={loginLoading}
            className="w-full py-4 rounded-sm text-sm uppercase tracking-widest font-medium transition-all hover:scale-[1.02] disabled:opacity-60"
            style={{ background: "#c8a46a", color: "#06050a" }}
          >
            {loginLoading ? "Loggar in..." : "Logga in"}
          </button>
        </div>
      </div>
    );
  }

  if (!content) {
    return <div className="min-h-screen bg-[#080608] flex items-center justify-center text-[#9e9590]">Laddar...</div>;
  }

  return (
    <div className="min-h-screen bg-[#080608] text-[#ece6dc]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#080608]/90 backdrop-blur-xl border-b border-[rgba(184,154,106,0.18)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/img/logo.jpeg" alt="Sam Studio" width={36} height={36} className="w-9 h-9 rounded-full" />
            <span className="font-display text-lg hidden md:block">Admin Panel</span>
          </div>

          <div className="flex items-center gap-2">
            <a href="/" target="_blank" className="flex items-center gap-2 px-3 py-1.5 rounded text-xs text-[#9e9590] hover:text-[#ece6dc] transition-colors border border-transparent hover:border-[rgba(184,154,106,0.18)]">
              <Eye size={14} /> <span className="hidden md:inline">Visa sida</span>
            </a>
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded text-xs font-medium transition-all hover:scale-105"
              style={{ background: saved ? "#4ade80" : "#c8a46a", color: "#06050a" }}
            >
              <Save size={14} />
              {saving ? "Sparar..." : saved ? "Sparat!" : "Spara"}
            </button>
            <button onClick={() => setAuthed(false)} className="p-2 text-[#9e9590] hover:text-[#ece6dc] transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex gap-1 overflow-x-auto pb-px">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider whitespace-nowrap transition-all border-b-2 ${
                  tab === t.id
                    ? "border-[#c8a46a] text-[#c8a46a]"
                    : "border-transparent text-[#9e9590] hover:text-[#ece6dc]"
                }`}
              >
                <Icon size={13} /> {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* ── GALLERY ── */}
        {tab === "gallery" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl">Galleri</h2>
                <p className="text-xs text-[#9e9590] mt-1">{content.gallery.length} bilder · Dra för att flytta, X för att ta bort</p>
              </div>
              <button
                onClick={() => uploadRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded text-xs font-medium border border-[#c8a46a] text-[#c8a46a] hover:bg-[#c8a46a] hover:text-[#06050a] transition-all"
              >
                <Upload size={14} /> Ladda upp bilder
              </button>
              <input
                ref={uploadRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={e => handleGalleryUpload(e.target.files)}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {content.gallery.map((src, i) => (
                <div
                  key={src + i}
                  data-gallery-idx={i}
                  draggable
                  onDragStart={() => onDragStart(i)}
                  onDragOver={e => onDragOver(e, i)}
                  onDrop={e => onDrop(e, i)}
                  onDragEnd={() => { setDragIdx(null); setDragOver(null); }}
                  onTouchStart={() => handleTouchStart(i)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  style={{ touchAction: "none" }}
                  className={`relative group aspect-square rounded-sm overflow-hidden cursor-grab active:cursor-grabbing bg-[#100e12] transition-all ${
                    dragOver === i ? "ring-2 ring-[#c8a46a] scale-105" : ""
                  } ${dragIdx === i ? "opacity-40" : ""}`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="150px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                  <button
                    onClick={() => removeGalleryImage(i)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500/90 text-white flex items-center justify-center hover:bg-red-600 z-10 transition-colors"
                  >
                    <X size={12} />
                  </button>
                  <span className="absolute bottom-1.5 left-1.5 text-[10px] text-white/50">
                    #{i + 1}
                  </span>
                </div>
              ))}

              {/* Add new image tile */}
              <button
                onClick={() => uploadRef.current?.click()}
                className="aspect-square rounded-sm border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors hover:border-[#c8a46a] hover:text-[#c8a46a]"
                style={{ borderColor: "rgba(200,164,106,0.25)", color: "#9e9590" }}
              >
                <Plus size={22} />
                <span className="text-[10px] uppercase tracking-wider">Lägg till</span>
              </button>
            </div>
          </div>
        )}

        {/* ── HERO ── */}
        {tab === "hero" && (
          <div className="max-w-2xl space-y-6">
            <h2 className="font-display text-2xl mb-6">Hero</h2>
            <ImageField label="Bakgrundsbild" value={content.hero.backgroundImage} onChange={v => setContent({ ...content, hero: { ...content.hero, backgroundImage: v } })} onUpload={uploadImage} />
            <Field label="Välkomsttext" value={content.hero.welcomeText} onChange={v => setContent({ ...content, hero: { ...content.hero, welcomeText: v } })} />
            <Field label="Rad 1 (stor text)" value={content.hero.line1} onChange={v => setContent({ ...content, hero: { ...content.hero, line1: v } })} />
            <Field label="Rad 2 (stor text)" value={content.hero.line2} onChange={v => setContent({ ...content, hero: { ...content.hero, line2: v } })} />
            <Field label="Undertitel" value={content.hero.tagline} onChange={v => setContent({ ...content, hero: { ...content.hero, tagline: v } })} />
            <div className="mt-4 rounded-sm overflow-hidden border border-[rgba(184,154,106,0.18)]">
              <div className="relative h-40">
                <Image src={content.hero.backgroundImage} alt="" fill className="object-cover opacity-50" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <p className="text-xs text-[#e2c898] tracking-widest uppercase mb-1">{content.hero.welcomeText}</p>
                  <p className="font-display text-2xl">{content.hero.line1} <span className="text-[#c8a46a]">{content.hero.line2}</span></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ABOUT ── */}
        {tab === "about" && (
          <div className="max-w-2xl space-y-5">
            <h2 className="font-display text-2xl mb-6">Om oss</h2>
            <ImageField label="Porträttbild" value={content.about.portraitImage} onChange={v => setContent({ ...content, about: { ...content.about, portraitImage: v } })} onUpload={uploadImage} />
            <Field label="Ägarens namn" value={content.about.ownerName} onChange={v => setContent({ ...content, about: { ...content.about, ownerName: v } })} />
            <Field label="Roll / titel" value={content.about.ownerRole} onChange={v => setContent({ ...content, about: { ...content.about, ownerRole: v } })} />
            <Field label="Rubrik" value={content.about.heading} onChange={v => setContent({ ...content, about: { ...content.about, heading: v } })} />
            <Field label="Rubrik (accent)" value={content.about.headingAccent} onChange={v => setContent({ ...content, about: { ...content.about, headingAccent: v } })} />
            <TextArea label="Brödtext 1" value={content.about.text1} onChange={v => setContent({ ...content, about: { ...content.about, text1: v } })} />
            <TextArea label="Brödtext 2" value={content.about.text2} onChange={v => setContent({ ...content, about: { ...content.about, text2: v } })} />
            <div className="grid grid-cols-3 gap-4">
              <Field label="Betyg" value={content.about.rating} onChange={v => setContent({ ...content, about: { ...content.about, rating: v } })} />
              <Field label="Antal recensioner" value={content.about.reviews} onChange={v => setContent({ ...content, about: { ...content.about, reviews: v } })} />
              <Field label="Erfarenhet" value={content.about.experience} onChange={v => setContent({ ...content, about: { ...content.about, experience: v } })} />
            </div>
          </div>
        )}

        {/* ── STORY ── */}
        {tab === "story" && (
          <div className="max-w-2xl space-y-5">
            <h2 className="font-display text-2xl mb-6">Story / Filosofi</h2>
            <ImageField label="Bakgrundsbild" value={content.story.backgroundImage} onChange={v => setContent({ ...content, story: { ...content.story, backgroundImage: v } })} onUpload={uploadImage} />
            <Field label="Etikett (liten text ovanför)" value={content.story.label} onChange={v => setContent({ ...content, story: { ...content.story, label: v } })} />
            <div className="rounded-sm border border-[rgba(184,154,106,0.18)] bg-[#100e12] p-4 space-y-3">
              <p className="text-[10px] uppercase tracking-widest text-[#9e9590]">Citat (3 delar)</p>
              <TextArea label="Citat — del 1 (vanlig text)" value={content.story.quoteBefore} onChange={v => setContent({ ...content, story: { ...content.story, quoteBefore: v } })} />
              <TextArea label="Citat — del 2 (guldtext, markerad del)" value={content.story.quoteAccent} onChange={v => setContent({ ...content, story: { ...content.story, quoteAccent: v } })} />
              <TextArea label="Citat — del 3 (vanlig text)" value={content.story.quoteAfter} onChange={v => setContent({ ...content, story: { ...content.story, quoteAfter: v } })} />
              <div className="mt-3 p-4 rounded bg-[#080608] border border-[rgba(184,154,106,0.1)] font-display text-sm leading-relaxed">
                <span className="text-[#ece6dc]">{content.story.quoteBefore} </span>
                <span style={{ color: "#c8a46a" }}>{content.story.quoteAccent}</span>
                <span className="text-[#ece6dc]"> {content.story.quoteAfter}</span>
              </div>
            </div>
            <Field label="Underetikett (t.ex. 'Sam Studio · Växjö · sedan 2018')" value={content.story.tagline} onChange={v => setContent({ ...content, story: { ...content.story, tagline: v } })} />
          </div>
        )}

        {/* ── REVIEWS ── */}
        {tab === "reviews" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl mb-6">Recensioner</h2>
            <div className="max-w-sm grid grid-cols-2 gap-4">
              <Field label="Betyg (visas stort)" value={content.reviews.rating} onChange={v => setContent({ ...content, reviews: { ...content.reviews, rating: v } })} />
              <Field label="Antal recensioner" value={content.reviews.count} onChange={v => setContent({ ...content, reviews: { ...content.reviews, count: v } })} />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-widest text-[#9e9590]">Recensioner ({content.reviews.items.length} st)</p>
                <button
                  onClick={() => setContent({ ...content, reviews: { ...content.reviews, items: [...content.reviews.items, { name: "Ny kund", rating: 5, text: "Skriv recension här...", date: "2025" }] } })}
                  className="flex items-center gap-1 text-xs text-[#9e9590] hover:text-[#c8a46a] transition-colors"
                >
                  <Plus size={13} /> Lägg till
                </button>
              </div>
              {content.reviews.items.map((r, i) => (
                <div key={i} className="border border-[rgba(184,154,106,0.18)] rounded-sm bg-[#100e12] p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(star => (
                        <button key={star} onClick={() => {
                          const items = JSON.parse(JSON.stringify(content.reviews.items));
                          items[i].rating = star;
                          setContent({ ...content, reviews: { ...content.reviews, items } });
                        }}>
                          <Star size={16} fill={star <= r.rating ? "#c8a46a" : "none"} stroke={star <= r.rating ? "none" : "#9e9590"} />
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        const items = content.reviews.items.filter((_, idx) => idx !== i);
                        setContent({ ...content, reviews: { ...content.reviews, items } });
                      }}
                      className="text-[#9e9590] hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-[#9e9590] mb-1">Namn</label>
                      <input value={r.name} onChange={e => {
                        const items = JSON.parse(JSON.stringify(content.reviews.items));
                        items[i].name = e.target.value;
                        setContent({ ...content, reviews: { ...content.reviews, items } });
                      }} className="w-full bg-[#080608] border border-[rgba(184,154,106,0.18)] rounded-sm px-3 py-2 text-sm text-[#ece6dc] outline-none focus:border-[#c8a46a] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-[#9e9590] mb-1">Datum</label>
                      <input value={r.date} onChange={e => {
                        const items = JSON.parse(JSON.stringify(content.reviews.items));
                        items[i].date = e.target.value;
                        setContent({ ...content, reviews: { ...content.reviews, items } });
                      }} className="w-full bg-[#080608] border border-[rgba(184,154,106,0.18)] rounded-sm px-3 py-2 text-sm text-[#ece6dc] outline-none focus:border-[#c8a46a] transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#9e9590] mb-1">Recension</label>
                    <textarea value={r.text} rows={3} onChange={e => {
                      const items = JSON.parse(JSON.stringify(content.reviews.items));
                      items[i].text = e.target.value;
                      setContent({ ...content, reviews: { ...content.reviews, items } });
                    }} className="w-full bg-[#080608] border border-[rgba(184,154,106,0.18)] rounded-sm px-3 py-2 text-sm text-[#ece6dc] outline-none focus:border-[#c8a46a] transition-colors resize-y" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SERVICES ── */}
        {tab === "services" && (
          <div className="space-y-8">
            <h2 className="font-display text-2xl mb-6">Tjänster</h2>
            {content.services.map((cat, ci) => (
              <div key={ci} className="border border-[rgba(184,154,106,0.18)] rounded-sm overflow-hidden">
                <div className="px-5 py-3 bg-[#100e12] flex items-center justify-between">
                  <p className="text-xs uppercase tracking-widest" style={{ color: "#c8a46a" }}>{cat.category}</p>
                  <button onClick={() => addService(ci)} className="flex items-center gap-1 text-xs text-[#9e9590] hover:text-[#c8a46a] transition-colors">
                    <Plus size={13} /> Lägg till
                  </button>
                </div>
                <div className="divide-y divide-[rgba(184,154,106,0.1)]">
                  {cat.items.map((s, si) => (
                    <div key={si} className="px-5 py-4 flex items-center gap-3 bg-[#080608] hover:bg-[#100e12] transition-colors">
                      <div className="flex flex-col gap-1 shrink-0">
                        <button onClick={() => moveService(ci, si, -1)} className="text-[#9e9590] hover:text-[#c8a46a] disabled:opacity-20" disabled={si === 0}><ChevronUp size={14} /></button>
                        <button onClick={() => moveService(ci, si, 1)} className="text-[#9e9590] hover:text-[#c8a46a] disabled:opacity-20" disabled={si === cat.items.length - 1}><ChevronDown size={14} /></button>
                      </div>
                      <input value={s.name} onChange={e => updateService(ci, si, "name", e.target.value)} className="flex-1 bg-transparent border-b border-[rgba(184,154,106,0.15)] text-sm text-[#ece6dc] px-1 py-0.5 outline-none focus:border-[#c8a46a] min-w-0" />
                      <input value={s.duration} onChange={e => updateService(ci, si, "duration", e.target.value)} className="w-20 bg-transparent border-b border-[rgba(184,154,106,0.15)] text-xs text-[#9e9590] px-1 py-0.5 outline-none focus:border-[#c8a46a]" />
                      <input value={s.price} onChange={e => updateService(ci, si, "price", e.target.value)} className="w-28 bg-transparent border-b border-[rgba(184,154,106,0.15)] text-sm px-1 py-0.5 outline-none focus:border-[#c8a46a]" style={{ color: "#e2c898" }} />
                      <button onClick={() => removeService(ci, si)} className="text-[#9e9590] hover:text-red-400 transition-colors shrink-0">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ACCOUNT ── */}
        {tab === "account" && (
          <AccountTab
            role={role}
            currentUsername={credentials.username}
            currentPassword={credentials.password}
            onChanged={(u, p) => { if (role === "admin") setCredentials({ username: u, password: p }); }}
          />
        )}

        {/* ── CONTACT ── */}
        {tab === "contact" && (
          <div className="max-w-2xl space-y-5">
            <h2 className="font-display text-2xl mb-6">Kontakt & Info</h2>
            <Field label="Salong namn" value={content.studio.name} onChange={v => setContent({ ...content, studio: { ...content.studio, name: v } })} />
            <Field label="Stad" value={content.studio.city} onChange={v => setContent({ ...content, studio: { ...content.studio, city: v } })} />
            <Field label="Adress" value={content.studio.address} onChange={v => setContent({ ...content, studio: { ...content.studio, address: v } })} />
            <Field label="Telefon" value={content.studio.phone} onChange={v => setContent({ ...content, studio: { ...content.studio, phone: v } })} />
            <Field label="Bokningslänk" value={content.studio.bookingUrl} onChange={v => setContent({ ...content, studio: { ...content.studio, bookingUrl: v } })} />
            <Field label="Instagram URL" value={content.studio.instagram} onChange={v => setContent({ ...content, studio: { ...content.studio, instagram: v } })} />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-widest text-[#9e9590]">Öppettider</p>
                <button
                  onClick={() => setContent({ ...content, studio: { ...content.studio, hours: [...content.studio.hours, { label: "Dag", value: "00:00 – 00:00" }] } })}
                  className="flex items-center gap-1 text-xs text-[#9e9590] hover:text-[#c8a46a] transition-colors"
                >
                  <Plus size={13} /> Lägg till rad
                </button>
              </div>
              {content.studio.hours.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={h.label} onChange={e => { const hrs = [...content.studio.hours]; hrs[i] = { ...hrs[i], label: e.target.value }; setContent({ ...content, studio: { ...content.studio, hours: hrs } }); }} className="w-28 bg-[#100e12] border border-[rgba(184,154,106,0.18)] rounded px-3 py-2 text-sm outline-none focus:border-[#c8a46a] transition-colors" />
                  <input value={h.value} onChange={e => { const hrs = [...content.studio.hours]; hrs[i] = { ...hrs[i], value: e.target.value }; setContent({ ...content, studio: { ...content.studio, hours: hrs } }); }} className="flex-1 bg-[#100e12] border border-[rgba(184,154,106,0.18)] rounded px-3 py-2 text-sm outline-none focus:border-[#c8a46a] transition-colors" />
                  <button
                    onClick={() => { const hrs = content.studio.hours.filter((_, idx) => idx !== i); setContent({ ...content, studio: { ...content.studio, hours: hrs } }); }}
                    className="text-[#9e9590] hover:text-red-400 transition-colors shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating save */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium shadow-2xl transition-all"
          style={{ background: saved ? "#4ade80" : "#c8a46a", color: "#06050a" }}
        >
          <Save size={16} />
          {saving ? "..." : saved ? "Sparat!" : "Spara"}
        </button>
      </div>
    </div>
  );
}

function AccountTab({ role, currentUsername, currentPassword, onChanged }: {
  role: "admin" | "superadmin";
  currentUsername: string;
  currentPassword: string;
  onChanged: (username: string, password: string) => void;
}) {
  const adminCreds = role === "superadmin"
    ? { username: "", password: "" }
    : { username: currentUsername, password: currentPassword };

  const [newUsername, setNewUsername] = useState(adminCreds.username);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSave() {
    setError("");
    if (!newUsername.trim()) { setError("Användarnamn får inte vara tomt"); return; }
    if (!newPassword) { setError("Ange ett nytt lösenord"); return; }
    if (newPassword.length < 4) { setError("Lösenordet måste vara minst 4 tecken"); return; }
    if (newPassword !== confirmPassword) { setError("Lösenorden matchar inte"); return; }
    setSaving(true);
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "change-password",
        username: currentUsername,
        password: currentPassword,
        newUsername: newUsername.trim(),
        newPassword,
      }),
    });
    setSaving(false);
    if (res.ok) {
      onChanged(newUsername.trim(), newPassword);
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      const d = await res.json();
      setError(d.error ?? "Något gick fel");
    }
  }

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h2 className="font-display text-2xl">Kontoinställningar</h2>
        <p className="text-xs text-[#9e9590] mt-1">
          {role === "superadmin" ? "Ändra admin-kontots inloggningsuppgifter" : "Ändra användarnamn och lösenord för admin-inloggning"}
        </p>
      </div>

      <div className="border border-[rgba(184,154,106,0.18)] rounded-sm bg-[#100e12] p-6 space-y-4">
        {role !== "superadmin" && (
          <p className="text-[10px] uppercase tracking-widest text-[#c8a46a]">Inloggat som: {currentUsername}</p>
        )}

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-[#9e9590] mb-1.5">Nytt användarnamn</label>
          <input
            type="text"
            value={newUsername}
            autoComplete="username"
            onChange={e => { setNewUsername(e.target.value); setError(""); }}
            className="w-full bg-[#080608] border border-[rgba(184,154,106,0.18)] rounded-sm px-4 py-3 text-sm text-[#ece6dc] outline-none focus:border-[#c8a46a] transition-colors"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-[#9e9590] mb-1.5">Nytt lösenord</label>
          <input
            type="password"
            value={newPassword}
            autoComplete="new-password"
            onChange={e => { setNewPassword(e.target.value); setError(""); }}
            className="w-full bg-[#080608] border border-[rgba(184,154,106,0.18)] rounded-sm px-4 py-3 text-sm text-[#ece6dc] outline-none focus:border-[#c8a46a] transition-colors"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-[#9e9590] mb-1.5">Bekräfta nytt lösenord</label>
          <input
            type="password"
            value={confirmPassword}
            autoComplete="new-password"
            onChange={e => { setConfirmPassword(e.target.value); setError(""); }}
            onKeyDown={e => { if (e.key === "Enter") handleSave(); }}
            className="w-full bg-[#080608] border border-[rgba(184,154,106,0.18)] rounded-sm px-4 py-3 text-sm text-[#ece6dc] outline-none focus:border-[#c8a46a] transition-colors"
          />
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}
        {success && (
          <div className="flex items-center gap-2 text-green-400 text-xs">
            <CheckCircle2 size={14} /> Uppgifterna har uppdaterats
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 rounded-sm text-sm uppercase tracking-widest font-medium transition-all hover:scale-[1.01] disabled:opacity-60"
          style={{ background: "#c8a46a", color: "#06050a" }}
        >
          {saving ? "Sparar..." : "Uppdatera uppgifter"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-[#9e9590] mb-1.5">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-[#100e12] border border-[rgba(184,154,106,0.18)] rounded-sm px-4 py-3 text-sm text-[#ece6dc] outline-none focus:border-[#c8a46a] transition-colors"
      />
    </div>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-[#9e9590] mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={3}
        className="w-full bg-[#100e12] border border-[rgba(184,154,106,0.18)] rounded-sm px-4 py-3 text-sm text-[#ece6dc] outline-none focus:border-[#c8a46a] transition-colors resize-y"
      />
    </div>
  );
}

function ImageField({ label, value, onChange, onUpload }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onUpload: (file: File) => Promise<string | null>;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = await onUpload(file);
    if (path) onChange(path);
    setUploading(false);
    e.target.value = "";
  }

  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-[#9e9590] mb-1.5">{label}</label>
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-3 bg-[#100e12] border border-[rgba(184,154,106,0.18)] rounded-sm px-4 py-2 focus-within:border-[#c8a46a] transition-colors">
          {value && (
            <div className="relative w-10 h-10 rounded shrink-0 overflow-hidden bg-[#080608]">
              <Image src={value} alt="" fill className="object-cover" />
            </div>
          )}
          <input
            value={value}
            onChange={e => onChange(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[#ece6dc] outline-none min-w-0"
            placeholder="/img/..."
          />
        </div>
        <button
          onClick={() => ref.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-medium border border-[#c8a46a] text-[#c8a46a] hover:bg-[#c8a46a] hover:text-[#06050a] transition-all whitespace-nowrap disabled:opacity-50"
        >
          <Upload size={13} />
          {uploading ? "Laddar..." : "Ladda upp"}
        </button>
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    </div>
  );
}
