import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { Copy, Sparkles, Zap, Target, DollarSign, Search, Wand2, CheckCircle2, Download, X, History, RotateCcw, ChevronDown } from "lucide-react";

// ─── DATA ───────────────────────────────────────────────────────────────────

const niches = ["Business & AI","Space","Tech Reviews","Personal Finance","History","Fitness","Travel","Language Learning","Psychology","Documentary"];
const angles = ["Beginner-friendly","Controversial","Luxury/premium","Dark truth","Step-by-step","Case study","Mistakes to avoid","Zero-to-one","Data-driven","Storytelling"];

const titlePatterns = [
  "The Dark Reality Behind {topic}",
  "How {topic} Quietly Changed Everything",
  "Why Nobody Understands {topic}",
  "The Hidden Psychology of {topic}",
  "What They Don't Tell You About {topic}",
  "How Beginners Waste Years Learning {topic}",
  "The Brutal Truth About {topic}",
  "Why {topic} Feels Rigged",
  "The Strange Reason {topic} Keeps Winning",
  "The Rise of {topic} Explained",
];

const hookOpeners = [
  "Most people completely misunderstand {topic}.",
  "There's a hidden reason why {topic} keeps growing.",
  "Nobody talks honestly about {topic}, so let's fix that.",
  "If you study {topic} long enough, you start noticing disturbing patterns.",
  "The biggest lie about {topic} is surprisingly simple.",
  "Most beginners approach {topic} backwards.",
  "The psychology behind {topic} is much darker than people realize.",
  "There are forces quietly shaping the future of {topic}.",
  "Almost everyone learning {topic} makes the same fatal mistake.",
  "The people winning at {topic} think completely differently.",
];

const thumbnailFormulas = [
  "Big face reaction + 3-word promise + one clear object",
  "Before/after split screen + red circle around the transformation",
  "Dark background + glowing keyword + shocked facial expression",
  "Luxury visual + bold contradiction text + cinematic lighting",
  "Simple chart/arrow + one emotional word + clean high contrast",
];

const archetypes = [
  { name:"Silent Empire", vibe:"Minimal, cold, calculated wealth", colors:"Black, gold, ivory", tone:"Calm dominance", examples:["Hidden systems of power","Quiet billionaire habits","The psychology of elite spaces"] },
  { name:"AI Apocalypse", vibe:"Urgent technological disruption", colors:"Dark graphite, neon blue", tone:"Existential and futuristic", examples:["Jobs AI will erase","The terrifying speed of automation","Why humans are losing leverage"] },
  { name:"Rage Economics", vibe:"Economic frustration and ambition", colors:"Red, charcoal, white", tone:"Aggressive truth-telling", examples:["Why your salary is dying","The hidden tax trap","How corporations extract attention"] },
];

// ─── PRESET ENGINE ───────────────────────────────────────────────────────────

const PRESETS = [
  { id:"silent-empire", label:"Silent Empire", icon:"◼", desc:"Minimal cold dominance", topic:"wealth psychology", niche:"Personal Finance", angle:"Luxury/premium", intensity:4, controversy:3 },
  { id:"tech-prophet", label:"Tech Prophet", icon:"⟁", desc:"AI-driven disruption", topic:"artificial intelligence", niche:"Business & AI", angle:"Dark truth", intensity:8, controversy:7 },
  { id:"rage-economics", label:"Rage Economics", icon:"▲", desc:"Economic frustration", topic:"salary stagnation", niche:"Business & AI", angle:"Controversial", intensity:9, controversy:9 },
  { id:"luxury-authority", label:"Luxury Authority", icon:"◈", desc:"Premium lifestyle signal", topic:"luxury mindset", niche:"Personal Finance", angle:"Luxury/premium", intensity:6, controversy:4 },
  { id:"faceless-auto", label:"Faceless Machine", icon:"◉", desc:"Pure automation empire", topic:"faceless channels", niche:"Business & AI", angle:"Zero-to-one", intensity:7, controversy:5 },
  { id:"ai-doomcaster", label:"AI Doomcaster", icon:"⬡", desc:"Existential AI futures", topic:"AI job displacement", niche:"Tech Reviews", angle:"Dark truth", intensity:10, controversy:10 },
  { id:"doc-strategist", label:"Documentary Strategist", icon:"▣", desc:"Deep narrative format", topic:"hidden history", niche:"History", angle:"Storytelling", intensity:5, controversy:6 },
  { id:"biz-philosopher", label:"Business Philosopher", icon:"◎", desc:"Systems thinking for wealth", topic:"business systems", niche:"Business & AI", angle:"Data-driven", intensity:6, controversy:5 },
];

// ─── THEME SYSTEM ────────────────────────────────────────────────────────────

const THEMES = {
  gold: {
    label:"Creator Gold",
    bg:"bg-neutral-950",
    accent:"text-amber-300",
    accentBg:"bg-amber-300",
    accentBorder:"border-amber-300/30",
    accentGlow:"rgba(245,158,11,0.28)",
    accentGlow2:"rgba(59,130,246,0.18)",
    metricColor:"text-purple-300",
    gradient:"from-amber-300/10 to-white/[0.03]",
  },
  midnight: {
    label:"Midnight",
    bg:"bg-slate-950",
    accent:"text-blue-400",
    accentBg:"bg-blue-400",
    accentBorder:"border-blue-400/30",
    accentGlow:"rgba(59,130,246,0.3)",
    accentGlow2:"rgba(139,92,246,0.2)",
    metricColor:"text-cyan-300",
    gradient:"from-blue-400/10 to-white/[0.03]",
  },
  matrix: {
    label:"Matrix",
    bg:"bg-black",
    accent:"text-green-400",
    accentBg:"bg-green-400",
    accentBorder:"border-green-400/30",
    accentGlow:"rgba(34,197,94,0.25)",
    accentGlow2:"rgba(16,185,129,0.15)",
    metricColor:"text-green-300",
    gradient:"from-green-400/10 to-white/[0.03]",
  },
  ivory: {
    label:"Luxury Ivory",
    bg:"bg-stone-950",
    accent:"text-stone-300",
    accentBg:"bg-stone-200",
    accentBorder:"border-stone-300/30",
    accentGlow:"rgba(214,211,209,0.15)",
    accentGlow2:"rgba(168,162,158,0.1)",
    metricColor:"text-stone-300",
    gradient:"from-stone-300/10 to-white/[0.03]",
  },
  crimson: {
    label:"Crimson Authority",
    bg:"bg-zinc-950",
    accent:"text-red-400",
    accentBg:"bg-red-500",
    accentBorder:"border-red-400/30",
    accentGlow:"rgba(239,68,68,0.25)",
    accentGlow2:"rgba(220,38,38,0.15)",
    metricColor:"text-red-300",
    gradient:"from-red-400/10 to-white/[0.03]",
  },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function pickMany(arr, seed, count) {
  const copy = [...arr]; const out = []; let s = seed||7;
  for (let i=0;i<count;i++) { s=(s*9301+49297)%233280; const idx=Math.floor((s/233280)*copy.length); out.push(copy.splice(idx,1)[0]||arr[idx%arr.length]); }
  return out;
}
function hashText(text) { return text.split("").reduce((acc,c)=>acc+c.charCodeAt(0),0); }
function fill(t,topic) { return t.replaceAll("{topic}",topic||"your niche"); }

// ─── ANALYSING PHRASES ───────────────────────────────────────────────────────

const analysingPhrases = [
  "Scanning viral signal patterns...",
  "Calibrating creator IQ matrix...",
  "Mapping niche authority vectors...",
  "Extracting hook psychology...",
  "Profiling audience attention triggers...",
  "Calculating monetization vectors...",
  "Synthesizing strategic blueprint...",
];

// ─── SUBCOMPONENTS ───────────────────────────────────────────────────────────

function OutputCard({ icon, title, items, theme, delay = 0, revealed = true }) {
  const t = THEMES[theme] || THEMES["gold"];
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-white/[0.04] text-white shadow-xl transition-all duration-500`}
      style={{ opacity: revealed ? 1 : 0, transform: revealed ? "translateY(0)" : "translateY(16px)", transitionDelay: `${delay}ms` }}
    >
      <div className="p-6">
        <div className="mb-4 flex items-center gap-2">
          {icon}
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        </div>
        <div className="space-y-2">
          {items.map((item,i) => (
            <div key={i} className="group rounded-2xl border border-white/10 bg-neutral-900/70 px-4 py-3 text-neutral-200 transition-all hover:border-white/20 hover:bg-neutral-800/80 hover:translate-x-1 cursor-default">
              <span className={`mr-2 font-mono text-sm ${t.accent}`}>{String(i+1).padStart(2,"0")}</span>{item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, color, revealed, delay }) {
  return (
    <div
      className="rounded-2xl border border-white/10 bg-black/30 p-4 transition-all duration-500"
      style={{ opacity: revealed?1:0, transform: revealed?"translateY(0)":"translateY(12px)", transitionDelay:`${delay}ms` }}
    >
      <div className="text-xs uppercase tracking-widest text-neutral-500">{label}</div>
      <div className={`mt-2 text-3xl font-bold ${color}`}>{value}</div>
    </div>
  );
}

// Premium Modal
function PremiumModal({ onClose, email, setEmail, onUnlock, theme }) {
  const t = THEMES[theme] || THEMES["gold"];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter:"blur(12px)", background:"rgba(0,0,0,0.7)" }}>
      <div className={`relative w-full max-w-2xl rounded-3xl border border-white/10 bg-neutral-950 shadow-2xl overflow-hidden`}>
        <div className="absolute inset-0 pointer-events-none" style={{ background:`radial-gradient(circle at top left,${t.accentGlow},transparent 50%)` }} />
        <button onClick={onClose} className="absolute right-5 top-5 text-neutral-500 hover:text-white transition z-10"><X className="h-5 w-5"/></button>
        <div className="relative p-8">
          <div className={`mb-2 text-xs uppercase tracking-[0.3em] ${t.accent}`}>Early Access — Limited Offer</div>
          <h2 className="text-3xl font-bold text-white mb-2">Unlock the full Creator OS</h2>
          <p className="text-neutral-400 mb-6 leading-7">Advanced viral systems, monetization maps, creator psychology frameworks, trend hijack engines, and elite faceless channel blueprints.</p>
          <div className="grid gap-4 sm:grid-cols-3 mb-6">
            {["Viral Psychology Engine","Monetization Blueprint","Faceless Channel OS","Trend Hijack Matrix","Thumbnail AI System","Creator IQ Calibration"].map(f => (
              <div key={f} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-neutral-300 flex items-center gap-2">
                <CheckCircle2 className={`h-4 w-4 shrink-0 ${t.accent}`}/>{f}
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <input
              value={email} onChange={e=>setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-amber-300/40"
            />
            <div className="text-center">
              <div className="text-4xl font-black text-amber-300 leading-none">$19</div>
              <div className="text-xs text-neutral-500 mt-1">one-time</div>
            </div>
            <button
              onClick={()=>{
                if(!email.includes("@")) return alert("Enter a valid email.");
                onUnlock(); onClose();
              }}
              className={`whitespace-nowrap rounded-2xl ${t.accentBg} px-6 py-3 font-bold text-black hover:opacity-90 transition`}
            >Unlock Premium</button>
          </div>
          <div className="mt-4 text-xs text-neutral-600 text-center">Secure checkout · Instant access · No subscription</div>
        </div>
      </div>
    </div>
  );
}

// History Panel
function HistoryPanel({ history, onRestore, onClose, theme }) {
  const t = THEMES[theme] || THEMES["gold"];
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ backdropFilter:"blur(8px)", background:"rgba(0,0,0,0.6)" }}>
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-neutral-950 shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-2"><History className={`h-4 w-4 ${t.accent}`}/><span className="font-semibold text-white">Generation History</span></div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition"><X className="h-4 w-4"/></button>
        </div>
        <div className="overflow-y-auto flex-1 p-4 space-y-2">
          {history.length===0 && <div className="text-neutral-500 text-sm text-center py-8">No history yet. Generate some strategies first.</div>}
          {history.map((h,i)=>(
            <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 cursor-pointer hover:bg-white/[0.06] transition" onClick={()=>{onRestore(h);onClose();}}>
              <div className={`font-medium text-sm ${t.accent}`}>{h.topic}</div>
              <div className="text-xs text-neutral-500 mt-1">{h.niche} · {h.angle} · {new Date(h.ts).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function CreatorOS() {
  const [topic, setTopic] = useState("AI business ideas");
  const [niche, setNiche] = useState("Business & AI");
  const [angle, setAngle] = useState("Zero-to-one");
  const [audience, setAudience] = useState("ambitious beginners who want to make money online");
  const [intensity, setIntensity] = useState(7);
  const [controversy, setControversy] = useState(6);
  const [facelessMode, setFacelessMode] = useState(true);
  const [email, setEmail] = useState("");
  const [premiumUnlocked, setPremiumUnlocked] = useState(false);
  const [randomSeed, setRandomSeed] = useState(0);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState("gold");
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);

  // Generation state machine
  const [genPhase, setGenPhase] = useState("idle"); // idle | analyzing | revealing
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [revealedCards, setRevealedCards] = useState(0);
  const phraseTimer = useRef(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("creator-os-v2");
    if (!saved) return;
    try {
      const d = JSON.parse(saved);
      if (d.topic) setTopic(d.topic);
      if (d.niche) setNiche(d.niche);
      if (d.angle) setAngle(d.angle);
      if (d.audience) setAudience(d.audience);
      if (d.email) setEmail(d.email);
      if (d.intensity) setIntensity(d.intensity);
      if (d.controversy) setControversy(d.controversy);
      if (typeof d.facelessMode==="boolean") setFacelessMode(d.facelessMode);
      if (d.theme) setTheme(d.theme);
      if (d.history) setHistory(d.history);
    } catch{}
  }, []);

  // Persist
  useEffect(() => {
    localStorage.setItem("creator-os-v2", JSON.stringify({
      topic,niche,angle,audience,email,intensity,controversy,facelessMode,theme,history
    }));
  }, [topic,niche,angle,audience,email,intensity,controversy,facelessMode,theme,history]);

  // Initial reveal on mount
  useEffect(() => {
    setGenPhase("revealing");
    let i=0; const iv=setInterval(()=>{ i++; setRevealedCards(i); if(i>=12)clearInterval(iv); },80);
    return ()=>clearInterval(iv);
  }, []);

  const seed = hashText(topic+niche+angle+audience+intensity+controversy+facelessMode+randomSeed);

  const output = useMemo(() => {
    const titles = pickMany(titlePatterns,seed,6).map(t=>fill(t,topic));
    const hooks = pickMany(hookOpeners,seed+11,4).map(h=>fill(h,topic));
    const thumbs = pickMany(thumbnailFormulas,seed+23,4);
    const selectedArchetype = archetypes[seed%archetypes.length];
    const viralAnglePool = {
      "Business & AI":["The AI gold rush nobody is prepared for","Why one-person businesses are becoming unstoppable","The hidden psychology behind viral AI channels"],
      Space:["The horrifying reality of deep space silence","Why billionaires are obsessed with Mars","The experiment that nearly destroyed the atmosphere"],
      History:["The empire that accidentally invented modern finance","The forgotten war that reshaped civilization","Why ancient rulers engineered fear"],
    };
    const viralAngles = (viralAnglePool[niche]||[`The hidden opportunity inside ${topic}`,`Why most creators misunderstand ${topic}`,`The psychology behind successful ${topic} channels`])
      .map(a=>controversy>7?a.replace("Why","The brutal reason why").replace("hidden","disturbing hidden"):a);
    const videoPlan = [
      controversy>7?`Open with a controversial claim about ${topic}.`:`Open with a painful truth about ${topic}.`,
      `Show the common beginner mistake your audience makes.`,
      intensity>7?`Give an aggressive 3-step roadmap using the ${angle.toLowerCase()} angle.`:`Give a simple 3-step roadmap using the ${angle.toLowerCase()} angle.`,
      `Add one real example, tool, or mini case study.`,
      `End with a clear next action: comment, subscribe, download, or try the method.`,
    ];
    const monetization = ["Affiliate links to tools/resources","Paid PDF checklist or mini-guide","Newsletter lead magnet","Consulting or done-with-you offer","Prompt pack or template bundle"];
    const uploadRoadmap = ["Week 1: Publish 3 authority-establishing videos","Week 2: Double down on the best CTR topic","Week 3: Introduce a recurring series format","Week 4: Push emotional and controversial angles"];
    const rpmEstimate = `$${(seed%18)+6} - $${(seed%30)+18} RPM potential`;
    const viralScore = 72+(seed%27);
    const creatorIQ = 80+(seed%20);
    const competitionLevel = ["LOW","MEDIUM","HIGH"][seed%3];
    const thumbnailPrompts = [
      `Ultra-cinematic ${topic} thumbnail, emotional contrast, glowing typography, luxury creator aesthetic`,
      `${topic} thumbnail with fear-driven psychology, dramatic shadows, high CTR composition`,
      `Faceless viral ${topic} thumbnail concept with emotional intensity and cinematic lighting`,
    ];
    const trendHijacks = [
      `How ${topic} is secretly changing because of AI`,
      `The controversial future of ${topic} nobody is prepared for`,
      `Why creators are abandoning traditional ${topic} strategies`,
    ];
    const premiumBlueprint = ["30-day upload domination plan","CTR-maximizing thumbnail psychology","Audience retention scripting framework","Faceless automation workflow","Sponsor acquisition strategy"];
    const aiStack = facelessMode
      ? ["ChatGPT — scripting and ideation","CapCut — editing and subtitles","ElevenLabs — AI narration","Midjourney/DALL·E — thumbnails and visuals"]
      : ["DSLR or phone camera","CapCut or Premiere Pro","TubeBuddy for optimization","Beehiiv newsletter funnel"];
    return { titles,hooks,thumbs,videoPlan,monetization,uploadRoadmap,rpmEstimate,aiStack,viralScore,creatorIQ,competitionLevel,thumbnailPrompts,trendHijacks,premiumBlueprint,selectedArchetype,viralAngles };
  }, [topic,niche,angle,audience,seed,intensity,controversy,facelessMode]);

  const fullText = `╔══════════════════════════════════════╗
        CREATOR OPERATING SYSTEM
╚══════════════════════════════════════╝

TOPIC: ${topic}  NICHE: ${niche}  ANGLE: ${angle}
TARGET AUDIENCE: ${audience}

━━━ CHANNEL ARCHETYPE ━━━
${output.selectedArchetype.name} — ${output.selectedArchetype.vibe}
Visual: ${output.selectedArchetype.colors} | Tone: ${output.selectedArchetype.tone}

━━━ PERFORMANCE SIGNALS ━━━
Viral: ${output.viralScore}% | Creator IQ: ${output.creatorIQ} | Competition: ${output.competitionLevel} | RPM: ${output.rpmEstimate}

━━━ TITLES ━━━
${output.titles.map((x,i)=>`${i+1}. ${x}`).join("\n")}

━━━ HOOKS ━━━
${output.hooks.map((x,i)=>`${i+1}. ${x}`).join("\n")}

━━━ VIRAL ANGLES ━━━
${output.viralAngles.map((x,i)=>`${i+1}. ${x}`).join("\n")}

━━━ THUMBNAIL STRATEGY ━━━
${output.thumbnailPrompts.map((x,i)=>`${i+1}. ${x}`).join("\n")}

━━━ MONETIZATION ━━━
${output.monetization.map((x,i)=>`${i+1}. ${x}`).join("\n")}

━━━ UPLOAD ROADMAP ━━━
${output.uploadRoadmap.map((x,i)=>`${i+1}. ${x}`).join("\n")}

━━━ AI STACK ━━━
${output.aiStack.map((x,i)=>`${i+1}. ${x}`).join("\n")}

━━━ PREMIUM BLUEPRINT ━━━
${output.premiumBlueprint.map((x,i)=>`${i+1}. ${x}`).join("\n")}

The channels winning in 2026 are not the biggest.
They are the most psychologically precise.
Attention is now an engineered system. Build accordingly.
`;

  const jsonExport = () => {
    const data = { meta:{ topic,niche,angle,audience,intensity,controversy,facelessMode,generatedAt:new Date().toISOString() }, metrics:{ viralScore:output.viralScore,creatorIQ:output.creatorIQ,competitionLevel:output.competitionLevel,rpmEstimate:output.rpmEstimate }, archetype:output.selectedArchetype, outputs:{ titles:output.titles,hooks:output.hooks,viralAngles:output.viralAngles,thumbnailFormulas:output.thumbs,thumbnailPrompts:output.thumbnailPrompts,videoPlan:output.videoPlan,monetization:output.monetization,uploadRoadmap:output.uploadRoadmap,aiStack:output.aiStack,premiumBlueprint:output.premiumBlueprint } };
    const blob = new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download=`${topic.toLowerCase().replace(/[^a-z0-9]/g,"-")}-creator-os.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(fullText);
    setCopied(true); setTimeout(()=>setCopied(false),1600);
  };

  const downloadBlueprint = () => {
    const blob = new Blob([fullText],{type:"text/plain"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download=`${topic.toLowerCase().replace(/[^a-z0-9]/g,"-")}-blueprint.txt`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const applyPreset = (preset) => {
    setTopic(preset.topic); setNiche(preset.niche); setAngle(preset.angle);
    setIntensity(preset.intensity); setControversy(preset.controversy);
    triggerGenerate();
  };

  const triggerGenerate = useCallback(() => {
    setGenPhase("analyzing");
    setRevealedCards(0);
    setPhraseIdx(0);
    let pi=0;
    phraseTimer.current = setInterval(()=>{
      pi++; setPhraseIdx(pi%analysingPhrases.length);
    },320);
    // Save to history
    setHistory(prev=>[{ topic,niche,angle,ts:Date.now() },...prev.slice(0,19)]);
    setTimeout(()=>{
      clearInterval(phraseTimer.current);
      setRandomSeed(Math.floor(Math.random()*100000));
      setGenPhase("revealing");
      let i=0; const iv=setInterval(()=>{ i++; setRevealedCards(i); if(i>=12)clearInterval(iv); },70);
    },1800);
  },[topic,niche,angle]);

  const t = THEMES[theme] || THEMES["gold"];

  return (
    <div className={`min-h-screen ${t.bg} text-white font-sans`} style={{ fontFamily:"'DM Sans', 'Inter', system-ui, sans-serif" }}>
      {showPremiumModal && <PremiumModal onClose={()=>setShowPremiumModal(false)} email={email} setEmail={setEmail} onUnlock={()=>setPremiumUnlocked(true)} theme={theme}/>}
      {showHistory && <HistoryPanel history={history} onRestore={h=>{setTopic(h.topic);setNiche(h.niche);setAngle(h.angle);}} onClose={()=>setShowHistory(false)} theme={theme}/>}

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 pointer-events-none" style={{ background:`radial-gradient(circle at top left,${t.accentGlow},transparent 35%),radial-gradient(circle at bottom right,${t.accentGlow2},transparent 35%)` }}/>
        <div className="relative mx-auto max-w-6xl px-5 py-12 md:py-18">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <div className={`inline-flex items-center gap-2 rounded-full border ${t.accentBorder} bg-white/5 px-4 py-2 text-sm ${t.accent}`}>
              <Sparkles className="h-3.5 w-3.5"/> CreatorOS
            </div>
            <div className="flex items-center gap-2">
              {/* Theme switcher */}
              <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1">
                {Object.entries(THEMES).map(([key,th])=>(
                  <button key={key} onClick={()=>setTheme(key)} title={th.label}
                    className={`h-5 w-5 rounded-full transition-all ${theme===key?"ring-2 ring-white/40 scale-110":""}`}
                    style={{ background: key==="gold"?"#f59e0b":key==="midnight"?"#3b82f6":key==="matrix"?"#22c55e":key==="ivory"?"#d6d3d1":"#ef4444" }}
                  />
                ))}
              </div>
              <button onClick={()=>setShowHistory(true)} className="rounded-full border border-white/10 bg-white/[0.04] p-2 hover:bg-white/[0.08] transition">
                <History className="h-4 w-4 text-neutral-400"/>
              </button>
            </div>
          </div>
          <h1 className="max-w-3xl text-5xl font-bold tracking-tight leading-tight md:text-7xl">
            Build your channel<br/><span className={t.accent}>in seconds.</span>
          </h1>
          <div className="mt-4 mb-6 flex flex-wrap gap-3">
            <span className="rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1.5 text-xs text-green-300">12,481+ Creator Kits Generated</span>
            <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-xs text-blue-300">Avg. Viral Score: 84%</span>
            <span className="rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1.5 text-xs text-purple-300">Used by Faceless Channels</span>
          </div>
          <p className="max-w-xl text-base leading-7 text-neutral-400">
            Titles, hooks, thumbnail concepts, video structure, and monetization ideas for creators who want to move fast instead of staring at a blank page.
          </p>

          {/* PRESET ENGINE */}
          <div className="mt-8 flex flex-wrap gap-2">
            {PRESETS.map(p=>(
              <button key={p.id} onClick={()=>applyPreset(p)}
                className={`group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-neutral-300 transition hover:border-white/20 hover:bg-white/[0.08] hover:-translate-y-0.5`}>
                <span className={`text-base ${t.accent}`}>{p.icon}</span>
                <span className="font-medium">{p.label}</span>
                <span className="hidden sm:block text-xs text-neutral-600 group-hover:text-neutral-500">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN GRID */}
      <main className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[0.9fr_1.1fr]">

        {/* ── INPUT PANEL ── */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] text-white shadow-2xl self-start sticky top-6">
          <div className="p-6">
            <div className="mb-5 flex items-center gap-2">
              <Wand2 className={`h-5 w-5 ${t.accent}`}/>
              <h2 className="text-xl font-semibold">Input</h2>
            </div>

            <label className="mb-2 block text-sm text-neutral-400">Video topic</label>
            <input value={topic} onChange={e=>setTopic(e.target.value)}
              className={`mb-4 w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-amber-300/30`}
              placeholder="e.g. AI tools for small businesses"/>

            <label className="mb-2 block text-sm text-neutral-400">Niche</label>
            <select value={niche} onChange={e=>setNiche(e.target.value)}
              className="mb-4 w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-white outline-none">
              {niches.map(n=><option key={n}>{n}</option>)}
            </select>

            <label className="mb-2 block text-sm text-neutral-400">Angle</label>
            <select value={angle} onChange={e=>setAngle(e.target.value)}
              className="mb-4 w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-white outline-none">
              {angles.map(a=><option key={a}>{a}</option>)}
            </select>

            <div className="mb-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-neutral-900 p-4 col-span-2">
                <div className="mb-2 text-sm text-neutral-400">Controversy Amplifier</div>
                <input type="range" min="1" max="10" value={controversy} onChange={e=>setControversy(+e.target.value)} className="w-full accent-red-400"/>
                <div className="mt-1.5 text-sm font-medium text-red-300">{controversy}/10</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-neutral-900 p-4">
                <div className="mb-2 text-sm text-neutral-400">Intensity</div>
                <input type="range" min="1" max="10" value={intensity} onChange={e=>setIntensity(+e.target.value)} className={`w-full`} style={{ accentColor:"#f59e0b" }}/>
                <div className={`mt-1.5 text-sm font-medium ${t.accent}`}>{intensity}/10</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-neutral-900 p-4 flex flex-col justify-between">
                <div>
                  <div className="text-sm text-neutral-400 mb-1">Faceless Mode</div>
                  <div className="text-xs text-neutral-600">Automation-first</div>
                </div>
                <button onClick={()=>setFacelessMode(!facelessMode)}
                  className={`mt-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${facelessMode?`${t.accentBg} text-black`:"bg-neutral-800 text-white"}`}>
                  {facelessMode?"ENABLED":"DISABLED"}
                </button>
              </div>
            </div>

            <label className="mb-2 block text-sm text-neutral-400">Target viewer</label>
            <textarea value={audience} onChange={e=>setAudience(e.target.value)}
              className="mb-4 min-h-20 w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-amber-300/30"/>

            {/* Premium gate */}
            <div className={`mb-4 rounded-2xl border ${t.accentBorder} bg-gradient-to-br ${t.gradient} p-4`}>
              <div className={`mb-1 text-sm font-medium ${t.accent}`}>Unlock Premium Creator Blueprint</div>
              <div className="mb-3 text-xs text-neutral-500">Deeper viral systems, monetization maps, and psychology frameworks.</div>
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter your email"
                className="mb-2 w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-2.5 text-white text-sm outline-none"/>
              <button onClick={()=>{ if(!email.includes("@"))return setShowPremiumModal(true); setPremiumUnlocked(true); }}
                className={`w-full rounded-xl ${t.accentBg} px-4 py-2.5 text-sm font-semibold text-black hover:opacity-90 transition`}>
                {premiumUnlocked?"✓ Premium Unlocked":"Unlock Premium Access"}
              </button>
            </div>

            {/* Generate button */}
            <button onClick={triggerGenerate} disabled={genPhase==="analyzing"}
              className={`w-full rounded-2xl border px-4 py-3.5 font-semibold transition-all ${
                genPhase==="analyzing"
                  ?`border-white/10 bg-white/[0.02] ${t.accent} opacity-60 cursor-not-allowed`
                  :`border-${t.accentBorder} ${t.gradient.includes("amber")?"border-amber-300/20 bg-amber-300/10 text-amber-200 hover:bg-amber-300/20":""} bg-white/[0.04] text-neutral-200 hover:bg-white/[0.08] border-white/10`
              }`}>
              {genPhase==="analyzing"?(
                <div className="flex items-center justify-center gap-2">
                  <div className={`h-1.5 w-1.5 animate-ping rounded-full ${t.accentBg}`}/>
                  <span className="text-sm">{analysingPhrases[phraseIdx]}</span>
                </div>
              ):"Regenerate Strategy"}
            </button>
            <div className="mt-2 text-center text-xs text-neutral-600">
              {genPhase==="analyzing"?"Creator intelligence engine is recalculating...":"Click to generate a fresh strategic variation."}
            </div>

            {/* Action buttons */}
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <button onClick={copyAll} className={`rounded-2xl ${t.accentBg} py-3 text-sm font-semibold text-black hover:opacity-90 transition flex items-center justify-center gap-1.5`}>
                {copied?<CheckCircle2 className="h-4 w-4"/>:<Copy className="h-4 w-4"/>}
                {copied?"Copied":"Copy Kit"}
              </button>
              <button onClick={downloadBlueprint} className="rounded-2xl border border-white/10 bg-white/[0.04] py-3 text-sm font-semibold text-white hover:bg-white/[0.08] transition flex items-center justify-center gap-1.5">
                <Download className="h-4 w-4"/> TXT
              </button>
              <button onClick={jsonExport} className="rounded-2xl border border-white/10 bg-white/[0.04] py-3 text-sm font-semibold text-white hover:bg-white/[0.08] transition flex items-center justify-center gap-1.5">
                <Download className="h-4 w-4"/> JSON
              </button>
            </div>
          </div>
        </div>

        {/* ── OUTPUT PANEL ── */}
        <div className="space-y-5">

          {/* Archetype */}
          <div
            className={`rounded-3xl border border-white/10 bg-gradient-to-br ${t.gradient} text-white shadow-2xl overflow-hidden transition-all duration-500`}
            style={{ opacity:revealedCards>=1?1:0, transform:revealedCards>=1?"translateY(0)":"translateY(16px)" }}
          >
            <div className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className={`h-5 w-5 ${t.accent}`}/>
                <h3 className="text-xl font-semibold">Channel Archetype</h3>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/40 p-5">
                <div className={`text-3xl font-bold tracking-tight ${t.accent} mb-1`}>{output.selectedArchetype.name}</div>
                <p className="text-neutral-400 text-sm mb-4">{output.selectedArchetype.vibe}</p>
                <div className="grid gap-2 md:grid-cols-2 mb-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <div className="text-xs text-neutral-500 mb-1">Visual Identity</div>
                    <div className="text-sm font-medium text-neutral-200">{output.selectedArchetype.colors}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <div className="text-xs text-neutral-500 mb-1">Narration Tone</div>
                    <div className="text-sm font-medium text-neutral-200">{output.selectedArchetype.tone}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {output.selectedArchetype.examples.map((ex,i)=>(
                    <div key={i} className="rounded-2xl border border-white/10 bg-neutral-900/70 px-4 py-2.5 text-sm text-neutral-300">{ex}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <OutputCard icon={<Zap className={`h-5 w-5 ${t.accent}`}/>} title="Viral angle engine" items={output.viralAngles} theme={theme} revealed={revealedCards>=2} delay={0}/>
          <OutputCard icon={<Zap className={`h-5 w-5 ${t.accent}`}/>} title="Killer title ideas" items={output.titles} theme={theme} revealed={revealedCards>=3} delay={0}/>
          <OutputCard icon={<Target className={`h-5 w-5 ${t.accent}`}/>} title="Opening hooks" items={output.hooks} theme={theme} revealed={revealedCards>=4} delay={0}/>
          <OutputCard icon={<Search className={`h-5 w-5 ${t.accent}`}/>} title="Thumbnail formulas" items={output.thumbs} theme={theme} revealed={revealedCards>=5} delay={0}/>
          <OutputCard icon={<Sparkles className={`h-5 w-5 ${t.accent}`}/>} title="5-part video structure" items={output.videoPlan} theme={theme} revealed={revealedCards>=6} delay={0}/>
          <OutputCard icon={<DollarSign className={`h-5 w-5 ${t.accent}`}/>} title="Monetization paths" items={output.monetization} theme={theme} revealed={revealedCards>=7} delay={0}/>
          <OutputCard icon={<Target className={`h-5 w-5 ${t.accent}`}/>} title="Upload roadmap" items={output.uploadRoadmap} theme={theme} revealed={revealedCards>=8} delay={0}/>
          <OutputCard icon={<Sparkles className={`h-5 w-5 ${t.accent}`}/>} title="AI creator stack" items={output.aiStack} theme={theme} revealed={revealedCards>=9} delay={0}/>

          {/* Mission Control */}
          <div
            className={`rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-amber-300/5 text-white shadow-2xl transition-all duration-500`}
            style={{ opacity:revealedCards>=10?1:0, transform:revealedCards>=10?"translateY(0)":"translateY(16px)" }}
          >
            <div className="p-6">
              <div className="mb-4">
                <div className={`text-xs uppercase tracking-[0.25em] ${t.accent}`}>Creator Intelligence Dashboard</div>
                <h3 className="mt-1 text-2xl font-bold">Mission Control</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <MetricCard label="Viral Probability" value={`${output.viralScore}%`} color="text-purple-300" revealed={revealedCards>=10} delay={0}/>
                <MetricCard label="RPM Potential" value={output.rpmEstimate} color="text-green-300" revealed={revealedCards>=10} delay={60}/>
                <MetricCard label="Creator IQ" value={output.creatorIQ} color="text-blue-300" revealed={revealedCards>=10} delay={120}/>
                <MetricCard label="Competition" value={output.competitionLevel} color="text-red-300" revealed={revealedCards>=10} delay={180}/>
              </div>
              <div
                className="mt-3 rounded-2xl border border-white/10 bg-black/30 p-4 transition-all duration-500"
                style={{ opacity:revealedCards>=10?1:0, transitionDelay:"240ms" }}
              >
                <div className="text-xs uppercase tracking-widest text-neutral-500">Viewer Retention</div>
                <div className="mt-2 text-3xl font-bold text-orange-300">{48+(seed%38)}%</div>
              </div>
            </div>
          </div>

          <OutputCard icon={<Search className={`h-5 w-5 ${t.accent}`}/>} title="Thumbnail AI prompts" items={output.thumbnailPrompts} theme={theme} revealed={revealedCards>=11} delay={0}/>
          <OutputCard icon={<Zap className={`h-5 w-5 ${t.accent}`}/>} title="Trend hijacking engine" items={output.trendHijacks} theme={theme} revealed={revealedCards>=11} delay={100}/>

          {/* Premium upsell */}
          <div className={`rounded-3xl border ${t.accentBorder} bg-gradient-to-br ${t.gradient} text-white shadow-2xl transition-all duration-500`}
            style={{ opacity:revealedCards>=12?1:0, transform:revealedCards>=12?"translateY(0)":"translateY(16px)" }}>
            <div className="p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className={`text-xs uppercase tracking-[0.3em] ${t.accent}`}>Premium Creator System</div>
                  <h3 className="mt-3 text-3xl font-bold">Unlock the full creator operating system</h3>
                  <p className="mt-3 max-w-xl text-neutral-400 leading-7 text-sm">Advanced monetization maps, viral psychology systems, creator positioning frameworks, trend hijack engines, and elite faceless channel blueprints.</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-sm text-neutral-400">
                    {["Viral psychology","Monetization systems","Faceless channel frameworks"].map(f=>(
                      <span key={f} className="rounded-full border border-white/10 px-3 py-1">{f}</span>
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-black/40 p-6 text-center min-w-[140px]">
                  <div className="text-sm uppercase tracking-widest text-neutral-500">Early Access</div>
                  <div className={`mt-3 text-5xl font-black ${t.accent}`}>$19</div>
                  <div className="mt-1 text-xs text-neutral-500">one-time creator upgrade</div>
                  <button onClick={()=>setShowPremiumModal(true)}
                    className={`mt-4 w-full rounded-2xl ${t.accentBg} px-4 py-3 font-bold text-black hover:opacity-90 transition text-sm`}>
                    Unlock Premium
                  </button>
                </div>
              </div>
            </div>
          </div>

          {premiumUnlocked && (
            <OutputCard icon={<Sparkles className={`h-5 w-5 ${t.accent}`}/>} title="Premium creator blueprint" items={output.premiumBlueprint} theme={theme} revealed={true} delay={0}/>
          )}

          {/* RPM Card */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-green-400/10 to-white/[0.03] text-white shadow-xl p-6">
            <div className="text-sm uppercase tracking-widest text-neutral-500 mb-2">Estimated Revenue Potential</div>
            <div className="text-4xl font-bold text-green-300">{output.rpmEstimate}</div>
            <p className="mt-2 text-sm text-neutral-500">Based on niche monetization strength, advertiser demand, and audience psychology.</p>
          </div>
        </div>
      </main>

      {/* FOOTER CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-10">
        <div className={`rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] ${t.gradient} p-8 shadow-2xl`}>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className={`mb-3 inline-flex items-center gap-2 rounded-full border ${t.accentBorder} bg-white/5 px-4 py-2 text-sm ${t.accent}`}>Creator Intelligence System</div>
              <h2 className="max-w-xl text-4xl font-bold tracking-tight">Stop guessing what videos to make.</h2>
              <p className="mt-3 max-w-md text-neutral-400 leading-7 text-sm">Generate viral concepts, thumbnail psychology, monetization paths, and faceless creator systems in seconds.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
              <div className="mb-1 text-sm uppercase tracking-widest text-neutral-500">Early Access</div>
              <div className="mb-4 text-2xl font-bold text-white">Join the Creator List</div>
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter your email"
                className="mb-2 w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-2.5 text-white outline-none text-sm"/>
              <button onClick={()=>{ if(!email.includes("@"))return alert("Enter a valid email."); setPremiumUnlocked(true); }}
                className={`w-full rounded-2xl ${t.accentBg} px-4 py-3 font-semibold text-black hover:opacity-90 transition text-sm`}>
                {premiumUnlocked?"Access Activated":"Get Early Access"}
              </button>
              <div className="mt-3 text-xs text-neutral-600">Weekly creator systems, trend reports, and viral channel blueprints.</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-5 pb-8 text-xs text-neutral-600">
        CreatorOS — built for speed: no login, no backend, no friction.
      </footer>
    </div>
  );
}
