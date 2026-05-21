import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Sparkles, Zap, Target, DollarSign, Search, Copy,
  CheckCircle2, Download, ArrowRight, ArrowLeft,
  RotateCcw, Share2, X, ChevronRight, Flame,
  BarChart2, Brain, Clock, Lock, Unlock
} from "lucide-react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const FREE_LIMIT = 3;
const STORAGE_KEY = "creator-os-v3";

const ARCHETYPES = [
  {
    id: "silent-empire",
    name: "The Silent Empire",
    tagline: "Power through precision. Wealth through silence.",
    icon: "◼",
    palette: { bg: "#0a0a0a", accent: "#c9a84c", glow: "rgba(201,168,76,0.15)" },
    identity: "Black, gold, ivory",
    tone: "Calm dominance — no shouting, no hype. Just cold authority.",
    niche: "Personal Finance",
    angle: "Luxury/premium",
    intensity: 4,
    controversy: 3,
    topics: ["Hidden systems of generational wealth", "Why quiet people accumulate more", "The psychology of elite decision-making"],
  },
  {
    id: "tech-prophet",
    name: "The Tech Prophet",
    tagline: "See what others refuse to look at.",
    icon: "⟁",
    palette: { bg: "#050510", accent: "#6366f1", glow: "rgba(99,102,241,0.18)" },
    identity: "Deep navy, electric indigo, white",
    tone: "Measured urgency — you're warning people, not panicking.",
    niche: "Business & AI",
    angle: "Dark truth",
    intensity: 8,
    controversy: 7,
    topics: ["The AI shift nobody is prepared for", "Jobs that will disappear by 2027", "Why tech founders know something you don't"],
  },
  {
    id: "rage-economics",
    name: "Rage Economics",
    tagline: "Your anger is data. Let's use it.",
    icon: "▲",
    palette: { bg: "#0d0505", accent: "#ef4444", glow: "rgba(239,68,68,0.15)" },
    identity: "Red, charcoal, white — raw and confrontational",
    tone: "Aggressive truth-telling. No softening. No apology.",
    niche: "Business & AI",
    angle: "Controversial",
    intensity: 9,
    controversy: 9,
    topics: ["Why your salary is mathematically designed to keep you poor", "The hidden tax nobody talks about", "How corporations extract attention as currency"],
  },
  {
    id: "documentary-mind",
    name: "The Documentary Mind",
    tagline: "Every story has a hidden architecture.",
    icon: "▣",
    palette: { bg: "#080810", accent: "#94a3b8", glow: "rgba(148,163,184,0.12)" },
    identity: "Charcoal, slate, off-white — cinematic and editorial",
    tone: "Measured, investigative. You reveal, not rant.",
    niche: "History",
    angle: "Storytelling",
    intensity: 5,
    controversy: 5,
    topics: ["The empire that accidentally invented modern banking", "Why this war was erased from history", "The person behind every major shift in civilization"],
  },
  {
    id: "faceless-machine",
    name: "The Faceless Machine",
    tagline: "Build an audience that never sees your face.",
    icon: "◉",
    palette: { bg: "#050a05", accent: "#22c55e", glow: "rgba(34,197,94,0.15)" },
    identity: "Black, terminal green, white — pure system aesthetic",
    tone: "Clinical efficiency. Every word earns its place.",
    niche: "Business & AI",
    angle: "Zero-to-one",
    intensity: 7,
    controversy: 5,
    topics: ["The one-person media business blueprint", "How faceless channels outperform personal brands", "Automation stacks that run while you sleep"],
  },
  {
    id: "philosophy-capital",
    name: "Philosophy & Capital",
    tagline: "Think differently. Compound relentlessly.",
    icon: "◎",
    palette: { bg: "#080806", accent: "#d97706", glow: "rgba(217,119,6,0.12)" },
    identity: "Warm black, amber, parchment — intellectual luxury",
    tone: "Slow, deliberate, layered. Ideas that reward attention.",
    niche: "Personal Finance",
    angle: "Data-driven",
    intensity: 6,
    controversy: 4,
    topics: ["The mental models billionaires actually use", "Why most self-improvement advice is reverse-engineered poverty", "The compounding effect nobody applies to thinking"],
  },
];

const ONBOARDING_QUESTIONS = [
  {
    id: "goal",
    question: "What's the real reason you're building a channel?",
    subtext: "Be honest. This shapes everything.",
    options: [
      { value: "income", label: "Replace my income", icon: "💰" },
      { value: "influence", label: "Build influence in my field", icon: "🎯" },
      { value: "passion", label: "Share something I'm obsessed with", icon: "🔥" },
      { value: "exit", label: "Create an asset I can sell", icon: "📈" },
    ],
  },
  {
    id: "time",
    question: "How much time can you actually commit per week?",
    subtext: "Your system must fit your life, not an ideal version of it.",
    options: [
      { value: "2-4h", label: "2–4 hours", icon: "⚡" },
      { value: "5-10h", label: "5–10 hours", icon: "🕐" },
      { value: "10-20h", label: "10–20 hours", icon: "💪" },
      { value: "fulltime", label: "Going all in", icon: "🚀" },
    ],
  },
  {
    id: "face",
    question: "Are you showing your face?",
    subtext: "Neither is better. Both are valid empires.",
    options: [
      { value: "faceless", label: "Fully faceless", icon: "👤" },
      { value: "sometimes", label: "Sometimes — voice only or silhouette", icon: "🎙️" },
      { value: "yes", label: "Yes, personal brand", icon: "🎥" },
    ],
  },
  {
    id: "obsession",
    question: "What topic keeps you up at night?",
    subtext: "Type it. Don't overthink.",
    type: "text",
    placeholder: "e.g. why the middle class is being quietly eliminated...",
  },
];

// ─── CLAUDE API ───────────────────────────────────────────────────────────────

async function generateWithClaude(archetype, answers, topic) {
  const systemPrompt = `You are a senior YouTube channel strategist with deep expertise in viral content psychology, monetization architecture, and creator positioning. You build real channel strategies — not generic templates.

You will receive a creator's archetype, goals, and topic. Generate a complete, specific, actionable channel strategy. Every output must be tailored to the exact topic and archetype — no generic filler.

Respond ONLY with valid JSON matching this exact structure:
{
  "channelName": "a specific, memorable channel name concept",
  "positioning": "one sharp sentence positioning statement",
  "titles": ["6 specific viral title ideas"],
  "hooks": ["4 specific opening hooks (first 15 seconds of video)"],
  "viralAngles": ["3 specific content angles unique to this topic"],
  "thumbnailConcepts": ["3 specific thumbnail concepts with visual direction"],
  "videoStructure": ["5 specific steps for the perfect video structure"],
  "monetization": ["5 specific monetization paths ranked by speed"],
  "uploadRoadmap": ["4 specific weekly milestones for the first month"],
  "aiStack": ["4 specific tools with exact use case"],
  "competitorGap": "one specific gap in the current creator landscape this channel fills",
  "firstVideoIdea": "one complete first video concept with title, hook, and structure",
  "metrics": {
    "viralScore": <number 70-98>,
    "creatorIQ": <number 80-99>,
    "competition": "<LOW|MEDIUM|HIGH>",
    "rpmEstimate": "<$X - $Y RPM>",
    "retentionPotential": <number 45-85>
  }
}`;

  const userPrompt = `Archetype: ${archetype.name}
Archetype tone: ${archetype.tone}
Creator goal: ${answers.goal}
Time commitment: ${answers.time}
Face on camera: ${answers.face}
Core topic obsession: ${topic}
Channel niche: ${archetype.niche}
Content angle: ${archetype.angle}

Build the complete channel strategy.`;

  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  const data = await response.json();
  const text = data.content?.find(b => b.type === "text")?.text || "";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ─── USAGE TRACKING ───────────────────────────────────────────────────────────

function getUsage() {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const today = new Date().toDateString();
    if (d.date !== today) return 0;
    return d.count || 0;
  } catch { return 0; }
}

function incrementUsage() {
  const today = new Date().toDateString();
  const current = getUsage();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: current + 1 }));
}

// ─── SHARE CARD ───────────────────────────────────────────────────────────────

function ShareCard({ archetype, strategy, onClose }) {
  const [copied, setCopied] = useState(false);
  const shareText = `My YouTube channel archetype: ${archetype.name}\n\n"${archetype.tagline}"\n\nTopic: ${strategy?.firstVideoIdea?.split(".")[0] || "Building something real"}\n\nBuilt with CreatorOS`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter: "blur(16px)", background: "rgba(0,0,0,0.85)" }}>
      <div className="w-full max-w-md">
        {/* The actual share card */}
        <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl mb-4"
          style={{ background: `linear-gradient(135deg, ${archetype.palette.bg}, #111)` }}>
          <div className="p-8">
            <div className="text-xs uppercase tracking-[0.3em] text-white/40 mb-6">CreatorOS — Channel Strategy</div>
            <div className="text-6xl mb-4" style={{ color: archetype.palette.accent }}>{archetype.icon}</div>
            <div className="text-3xl font-bold text-white mb-2">{archetype.name}</div>
            <div className="text-white/60 mb-6 leading-relaxed">"{archetype.tagline}"</div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Viral Score", value: `${strategy?.metrics?.viralScore || 87}%` },
                { label: "Creator IQ", value: strategy?.metrics?.creatorIQ || 91 },
                { label: "RPM", value: strategy?.metrics?.rpmEstimate?.split(" ")[0] || "$14" },
              ].map(m => (
                <div key={m.label} className="rounded-2xl bg-white/5 p-3 text-center">
                  <div className="text-xs text-white/40 mb-1">{m.label}</div>
                  <div className="font-bold" style={{ color: archetype.palette.accent }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={async () => {
            await navigator.clipboard.writeText(shareText);
            setCopied(true); setTimeout(() => setCopied(false), 2000);
          }} className="flex-1 rounded-2xl bg-white/10 py-3 text-sm font-semibold text-white hover:bg-white/20 transition flex items-center justify-center gap-2">
            {copied ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy for Twitter/X"}
          </button>
          <button onClick={onClose} className="rounded-2xl border border-white/10 px-4 py-3 text-white hover:bg-white/10 transition">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PAYWALL ─────────────────────────────────────────────────────────────────

function PaywallModal({ onClose, archetype }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter: "blur(16px)", background: "rgba(0,0,0,0.9)" }}>
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-neutral-950 overflow-hidden shadow-2xl">
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🔒</div>
            <h2 className="text-2xl font-bold text-white mb-2">You've used your 3 free strategies</h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Serious creators need unlimited access. Get full strategies, export everything, and build faster.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 mb-5">
            <div className="flex items-baseline gap-2 mb-4">
              <div className="text-4xl font-black text-amber-300">$9</div>
              <div className="text-neutral-400 text-sm">/ month</div>
            </div>
            <div className="space-y-2">
              {["Unlimited AI-powered strategies", "Claude API — real intelligence, not templates", "Full JSON + TXT exports", "Strategy history & snapshots", "Priority access to new archetypes"].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-neutral-300">
                  <CheckCircle2 className="h-4 w-4 text-amber-300 shrink-0" />{f}
                </div>
              ))}
            </div>
            <button className="mt-5 w-full rounded-2xl bg-amber-300 py-3 font-bold text-black hover:bg-amber-200 transition text-sm">
              Start Pro — $9/month
            </button>
            <div className="mt-2 text-xs text-center text-neutral-600">Stripe integration coming. Email list below for early access pricing.</div>
          </div>

          <button onClick={onClose} className="w-full text-sm text-neutral-600 hover:text-neutral-400 transition">
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function CreatorOS() {
  // Flow state
  const [phase, setPhase] = useState("landing"); // landing | onboarding | archetype | generating | results
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedArchetype, setSelectedArchetype] = useState(null);
  const [topic, setTopic] = useState("");
  const [strategy, setStrategy] = useState(null);
  const [error, setError] = useState(null);

  // UI state
  const [revealStep, setRevealStep] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [copied, setCopied] = useState(false);
  const [usageCount, setUsageCount] = useState(getUsage());
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  // Progressive reveal on results
  useEffect(() => {
    if (phase !== "results") return;
    setRevealStep(0);
    let i = 0;
    const iv = setInterval(() => { i++; setRevealStep(i); if (i >= 20) clearInterval(iv); }, 120);
    return () => clearInterval(iv);
  }, [phase, strategy]);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    if (onboardingStep < ONBOARDING_QUESTIONS.length - 1) {
      setTimeout(() => setOnboardingStep(s => s + 1), 300);
    } else {
      setPhase("archetype");
    }
  };

  const handleArchetypeSelect = (arch) => {
    setSelectedArchetype(arch);
    const obsession = answers.obsession || arch.topics[0];
    setTopic(obsession);
    setPhase("generating");
    runGeneration(arch, answers, obsession);
  };

  const runGeneration = useCallback(async (arch, ans, top) => {
    if (usageCount >= FREE_LIMIT) {
      setShowPaywall(true);
      setPhase("archetype");
      return;
    }
    setError(null);
    try {
      incrementUsage();
      setUsageCount(getUsage());
      const result = await generateWithClaude(arch, ans, top);
      setStrategy(result);
      setPhase("results");
    } catch (e) {
      setError("Generation failed. Check your connection and try again.");
      setPhase("archetype");
    }
  }, [usageCount]);

  const regenerate = () => {
    if (usageCount >= FREE_LIMIT) { setShowPaywall(true); return; }
    setPhase("generating");
    runGeneration(selectedArchetype, answers, topic);
  };

  const exportTXT = () => {
    if (!strategy) return;
    const arch = selectedArchetype;
    const txt = `CREATOR OS — CHANNEL STRATEGY
════════════════════════════════════
Archetype: ${arch.name}
Topic: ${topic}
Goal: ${answers.goal} | Time: ${answers.time} | Face: ${answers.face}
Generated: ${new Date().toLocaleString()}

CHANNEL POSITIONING
${strategy.channelName}
${strategy.positioning}

COMPETITOR GAP
${strategy.competitorGap}

VIRAL ANGLES
${strategy.viralAngles.map((x,i)=>`${i+1}. ${x}`).join("\n")}

TITLE IDEAS
${strategy.titles.map((x,i)=>`${i+1}. ${x}`).join("\n")}

OPENING HOOKS
${strategy.hooks.map((x,i)=>`${i+1}. ${x}`).join("\n")}

THUMBNAIL CONCEPTS
${strategy.thumbnailConcepts.map((x,i)=>`${i+1}. ${x}`).join("\n")}

VIDEO STRUCTURE
${strategy.videoStructure.map((x,i)=>`${i+1}. ${x}`).join("\n")}

YOUR FIRST VIDEO
${strategy.firstVideoIdea}

MONETIZATION PATHS
${strategy.monetization.map((x,i)=>`${i+1}. ${x}`).join("\n")}

UPLOAD ROADMAP
${strategy.uploadRoadmap.map((x,i)=>`${i+1}. ${x}`).join("\n")}

AI STACK
${strategy.aiStack.map((x,i)=>`${i+1}. ${x}`).join("\n")}

METRICS
Viral Score: ${strategy.metrics.viralScore}%
Creator IQ: ${strategy.metrics.creatorIQ}
Competition: ${strategy.metrics.competition}
RPM Estimate: ${strategy.metrics.rpmEstimate}
Retention Potential: ${strategy.metrics.retentionPotential}%

Built with CreatorOS — creatoros.io
`;
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${arch.id}-strategy.txt`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    if (!strategy) return;
    const data = { archetype: selectedArchetype.id, topic, answers, strategy, generatedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${selectedArchetype.id}-strategy.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const arch = selectedArchetype || ARCHETYPES[0];
  const accentColor = arch?.palette?.accent || "#f59e0b";

  // ── RENDER ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {showShare && strategy && <ShareCard archetype={selectedArchetype} strategy={strategy} onClose={() => setShowShare(false)} />}
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} archetype={selectedArchetype} />}

      {/* ── LANDING ── */}
      {phase === "landing" && (
        <div className="relative min-h-screen flex flex-col items-center justify-center px-5 overflow-hidden">
          {/* Ambient */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, rgba(201,168,76,0.4) 0%, transparent 70%)" }} />
          </div>

          <div className="relative max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50 uppercase tracking-widest mb-10">
              <Sparkles className="h-3 w-3" /> Creator Intelligence System
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-none mb-6">
              Stop guessing.<br />
              <span style={{ color: "#c9a84c" }}>Start building.</span>
            </h1>

            <p className="text-lg text-white/50 leading-relaxed max-w-xl mx-auto mb-12">
              Answer 4 questions. Pick your archetype. Get a complete AI-built channel strategy — titles, hooks, thumbnails, monetization, and a 30-day roadmap.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button
                onClick={() => setPhase("onboarding")}
                className="group flex items-center gap-3 rounded-2xl px-8 py-4 font-bold text-black text-lg transition-all hover:scale-105 active:scale-95"
                style={{ background: "#c9a84c" }}
              >
                Build my channel strategy
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="text-sm text-white/30">{FREE_LIMIT} free strategies · No account needed</div>
            </div>

            {/* Archetype preview strip */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {ARCHETYPES.map(a => (
                <div key={a.id} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/40">
                  <span style={{ color: a.palette.accent }}>{a.icon}</span> {a.name}
                </div>
              ))}
            </div>
          </div>

          {/* Usage indicator */}
          {usageCount > 0 && (
            <div className="absolute bottom-6 right-6 text-xs text-white/20">
              {FREE_LIMIT - usageCount} free generations remaining
            </div>
          )}
        </div>
      )}

      {/* ── ONBOARDING ── */}
      {phase === "onboarding" && (
        <div className="min-h-screen flex flex-col items-center justify-center px-5">
          <div className="w-full max-w-xl">
            {/* Progress */}
            <div className="flex gap-2 mb-12">
              {ONBOARDING_QUESTIONS.map((_, i) => (
                <div key={i} className="h-0.5 flex-1 rounded-full transition-all duration-500"
                  style={{ background: i <= onboardingStep ? "#c9a84c" : "rgba(255,255,255,0.1)" }} />
              ))}
            </div>

            {ONBOARDING_QUESTIONS.map((q, qi) => qi === onboardingStep && (
              <div key={q.id} className="animate-fade-in">
                <div className="text-xs uppercase tracking-widest text-white/30 mb-3">
                  Question {qi + 1} of {ONBOARDING_QUESTIONS.length}
                </div>
                <h2 className="text-3xl font-bold text-white mb-2 leading-tight">{q.question}</h2>
                <p className="text-white/40 mb-8">{q.subtext}</p>

                {q.type === "text" ? (
                  <div>
                    <textarea
                      value={topic}
                      onChange={e => setTopic(e.target.value)}
                      placeholder={q.placeholder}
                      rows={3}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white placeholder-white/20 outline-none focus:border-white/20 resize-none mb-4 text-lg"
                    />
                    <button
                      onClick={() => {
                        if (!topic.trim()) return;
                        handleAnswer(q.id, topic);
                      }}
                      className="w-full rounded-2xl py-4 font-bold text-black text-lg transition hover:opacity-90"
                      style={{ background: "#c9a84c" }}
                    >
                      Continue <ArrowRight className="inline h-5 w-5 ml-1" />
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {q.options.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(q.id, opt.value)}
                        className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left transition-all hover:border-white/20 hover:bg-white/[0.07] hover:translate-x-1 group"
                      >
                        <span className="text-2xl">{opt.icon}</span>
                        <span className="text-white font-medium">{opt.label}</span>
                        <ChevronRight className="h-4 w-4 text-white/20 ml-auto group-hover:text-white/40 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                )}

                {qi > 0 && (
                  <button onClick={() => setOnboardingStep(s => s - 1)} className="mt-6 flex items-center gap-2 text-sm text-white/30 hover:text-white/50 transition">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ARCHETYPE SELECTION ── */}
      {phase === "archetype" && (
        <div className="min-h-screen px-5 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-xs uppercase tracking-widest text-white/30 mb-4">Your channel identity</div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">Choose your archetype.</h2>
              <p className="text-white/40">Each one is a complete system. Pick the one that feels like a weapon, not a costume.</p>
            </div>

            {error && (
              <div className="max-w-xl mx-auto mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300 text-center">
                {error}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {ARCHETYPES.map(a => (
                <button
                  key={a.id}
                  onClick={() => handleArchetypeSelect(a)}
                  className="group relative rounded-3xl border border-white/10 p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:border-white/20 overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${a.palette.bg} 0%, #111 100%)` }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ background: `radial-gradient(circle at top left, ${a.palette.glow}, transparent 60%)` }} />

                  <div className="relative">
                    <div className="text-4xl mb-4" style={{ color: a.palette.accent }}>{a.icon}</div>
                    <div className="text-xl font-bold text-white mb-1">{a.name}</div>
                    <div className="text-sm mb-4 leading-relaxed" style={{ color: a.palette.accent }}>"{a.tagline}"</div>
                    <div className="text-xs text-white/30 leading-relaxed">{a.tone}</div>

                    <div className="mt-5 flex items-center gap-2">
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/30">{a.niche}</span>
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/30">{a.angle}</span>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-xs font-medium transition-all group-hover:gap-3" style={{ color: a.palette.accent }}>
                      Select this archetype <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="text-center mt-8">
              <button onClick={() => setPhase("onboarding")} className="text-sm text-white/20 hover:text-white/40 transition">
                ← Back to questions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── GENERATING ── */}
      {phase === "generating" && (
        <div className="min-h-screen flex flex-col items-center justify-center px-5">
          <div className="text-center max-w-sm">
            <div className="text-6xl mb-8" style={{ color: arch.palette.accent }}>{arch.icon}</div>

            <div className="mb-2 text-xl font-bold text-white">{arch.name}</div>
            <div className="text-sm text-white/30 mb-10">Building your channel strategy...</div>

            {/* Animated dots */}
            <div className="flex justify-center gap-2 mb-6">
              {[0,1,2,3,4].map(i => (
                <div key={i} className="h-1.5 w-1.5 rounded-full animate-pulse"
                  style={{ background: arch.palette.accent, animationDelay: `${i * 150}ms` }} />
              ))}
            </div>

            <div className="text-xs text-white/20 space-y-1">
              <div>Analyzing topic: "{topic}"</div>
              <div>Calibrating archetype psychology...</div>
              <div>Generating real strategy with Claude AI...</div>
            </div>
          </div>
        </div>
      )}

      {/* ── RESULTS ── */}
      {phase === "results" && strategy && (
        <div className="min-h-screen">
          {/* Results hero */}
          <div className="relative overflow-hidden border-b border-white/10">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at top left, ${arch.palette.glow}, transparent 50%)` }} />
            <div className="relative max-w-4xl mx-auto px-5 py-16">
              <div className="flex items-start justify-between flex-wrap gap-6">
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/30 mb-3">Your Channel Strategy</div>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-5xl" style={{ color: arch.palette.accent }}>{arch.icon}</span>
                    <div>
                      <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">{arch.name}</h1>
                      <div className="text-white/40 mt-1">"{arch.tagline}"</div>
                    </div>
                  </div>
                  {strategy.channelName && (
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium"
                      style={{ borderColor: `${arch.palette.accent}40`, color: arch.palette.accent }}>
                      <Sparkles className="h-3.5 w-3.5" /> {strategy.channelName}
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setShowShare(true)}
                    className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white hover:bg-white/[0.08] transition">
                    <Share2 className="h-4 w-4" /> Share
                  </button>
                  <button onClick={exportTXT}
                    className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white hover:bg-white/[0.08] transition">
                    <Download className="h-4 w-4" /> TXT
                  </button>
                  <button onClick={exportJSON}
                    className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white hover:bg-white/[0.08] transition">
                    <Download className="h-4 w-4" /> JSON
                  </button>
                  <button onClick={regenerate}
                    className="flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
                    style={{ background: arch.palette.accent }}>
                    <RotateCcw className="h-4 w-4" /> Regenerate
                  </button>
                </div>
              </div>

              {/* Positioning statement */}
              {strategy.positioning && (
                <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                  <div className="text-xs uppercase tracking-widest text-white/30 mb-2">Channel Positioning</div>
                  <p className="text-lg text-white/80 leading-relaxed">{strategy.positioning}</p>
                </div>
              )}
            </div>
          </div>

          {/* Results body */}
          <div className="max-w-4xl mx-auto px-5 py-10 space-y-5">

            {/* Metrics */}
            <Reveal step={revealStep} threshold={1}>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { label: "Viral Score", value: `${strategy.metrics.viralScore}%`, color: "text-purple-300" },
                  { label: "Creator IQ", value: strategy.metrics.creatorIQ, color: "text-blue-300" },
                  { label: "Competition", value: strategy.metrics.competition, color: "text-red-300" },
                  { label: "RPM Range", value: strategy.metrics.rpmEstimate, color: "text-green-300" },
                  { label: "Retention", value: `${strategy.metrics.retentionPotential}%`, color: "text-orange-300" },
                ].map(m => (
                  <div key={m.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-xs uppercase tracking-widest text-white/30 mb-2">{m.label}</div>
                    <div className={`text-xl font-bold ${m.color}`}>{m.value}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Competitor gap */}
            {strategy.competitorGap && (
              <Reveal step={revealStep} threshold={2}>
                <div className="rounded-3xl border p-6" style={{ borderColor: `${arch.palette.accent}30`, background: `${arch.palette.glow}` }}>
                  <div className="text-xs uppercase tracking-widest mb-2" style={{ color: arch.palette.accent }}>Your Competitive Edge</div>
                  <p className="text-white/80 leading-relaxed">{strategy.competitorGap}</p>
                </div>
              </Reveal>
            )}

            {/* First video idea */}
            {strategy.firstVideoIdea && (
              <Reveal step={revealStep} threshold={3}>
                <ResultCard title="Your First Video" icon={<Flame className="h-4 w-4" />} accent={arch.palette.accent}>
                  <p className="text-white/70 leading-relaxed">{strategy.firstVideoIdea}</p>
                </ResultCard>
              </Reveal>
            )}

            <Reveal step={revealStep} threshold={4}>
              <ResultCard title="Viral Angles" icon={<Zap className="h-4 w-4" />} accent={arch.palette.accent}>
                <NumberedList items={strategy.viralAngles} accent={arch.palette.accent} />
              </ResultCard>
            </Reveal>

            <Reveal step={revealStep} threshold={5}>
              <ResultCard title="Killer Titles" icon={<Target className="h-4 w-4" />} accent={arch.palette.accent}>
                <NumberedList items={strategy.titles} accent={arch.palette.accent} />
              </ResultCard>
            </Reveal>

            <Reveal step={revealStep} threshold={6}>
              <ResultCard title="Opening Hooks" icon={<Brain className="h-4 w-4" />} accent={arch.palette.accent}>
                <NumberedList items={strategy.hooks} accent={arch.palette.accent} />
              </ResultCard>
            </Reveal>

            <Reveal step={revealStep} threshold={7}>
              <ResultCard title="Thumbnail Concepts" icon={<Search className="h-4 w-4" />} accent={arch.palette.accent}>
                <NumberedList items={strategy.thumbnailConcepts} accent={arch.palette.accent} />
              </ResultCard>
            </Reveal>

            <Reveal step={revealStep} threshold={8}>
              <ResultCard title="Video Structure" icon={<BarChart2 className="h-4 w-4" />} accent={arch.palette.accent}>
                <NumberedList items={strategy.videoStructure} accent={arch.palette.accent} />
              </ResultCard>
            </Reveal>

            <Reveal step={revealStep} threshold={9}>
              <ResultCard title="Monetization Paths" icon={<DollarSign className="h-4 w-4" />} accent={arch.palette.accent}>
                <NumberedList items={strategy.monetization} accent={arch.palette.accent} />
              </ResultCard>
            </Reveal>

            <Reveal step={revealStep} threshold={10}>
              <ResultCard title="30-Day Upload Roadmap" icon={<Clock className="h-4 w-4" />} accent={arch.palette.accent}>
                <NumberedList items={strategy.uploadRoadmap} accent={arch.palette.accent} />
              </ResultCard>
            </Reveal>

            <Reveal step={revealStep} threshold={11}>
              <ResultCard title="AI Creator Stack" icon={<Sparkles className="h-4 w-4" />} accent={arch.palette.accent}>
                <NumberedList items={strategy.aiStack} accent={arch.palette.accent} />
              </ResultCard>
            </Reveal>

            {/* CTA bottom */}
            <Reveal step={revealStep} threshold={12}>
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 text-center">
                <div className="text-xs uppercase tracking-widest text-white/30 mb-3">What's next</div>
                <h3 className="text-2xl font-bold text-white mb-2">Build a different archetype.</h3>
                <p className="text-white/40 text-sm mb-6">Each archetype is a completely different channel system. Try them all.</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <button onClick={() => { setPhase("archetype"); setStrategy(null); }}
                    className="rounded-2xl px-6 py-3 font-semibold text-black transition hover:opacity-90"
                    style={{ background: arch.palette.accent }}>
                    Try another archetype
                  </button>
                  <button onClick={() => setPhase("landing")}
                    className="rounded-2xl border border-white/10 px-6 py-3 text-sm text-white hover:bg-white/[0.05] transition">
                    Start over
                  </button>
                </div>
              </div>
            </Reveal>

            {/* Email capture */}
            <Reveal step={revealStep} threshold={13}>
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8">
                <div className="max-w-md mx-auto text-center">
                  <div className="text-xs uppercase tracking-widest text-white/30 mb-3">Early Access</div>
                  <h3 className="text-xl font-bold text-white mb-2">Get Pro before it launches.</h3>
                  <p className="text-white/40 text-sm mb-5">Unlimited generations, full export, priority archetypes. Founding member pricing locked in at launch.</p>
                  {emailSubmitted ? (
                    <div className="flex items-center justify-center gap-2 text-green-400">
                      <CheckCircle2 className="h-5 w-5" /> You're on the list.
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                        className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder-white/20 outline-none text-sm" />
                      <button onClick={() => { if (email.includes("@")) setEmailSubmitted(true); }}
                        className="rounded-2xl px-5 py-3 font-semibold text-black text-sm transition hover:opacity-90"
                        style={{ background: arch.palette.accent }}>
                        Join
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>

            {/* Usage counter */}
            <div className="text-center text-xs text-white/20 pb-8">
              {Math.max(0, FREE_LIMIT - usageCount)} free generations remaining · CreatorOS
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── UTILITY COMPONENTS ───────────────────────────────────────────────────────

function Reveal({ children, step, threshold }) {
  return (
    <div className="transition-all duration-500" style={{
      opacity: step >= threshold ? 1 : 0,
      transform: step >= threshold ? "translateY(0)" : "translateY(20px)",
    }}>
      {children}
    </div>
  );
}

function ResultCard({ title, icon, accent, children }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-white/10">
        <span style={{ color: accent }}>{icon}</span>
        <h3 className="font-semibold text-white tracking-tight">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function NumberedList({ items, accent }) {
  if (!items?.length) return null;
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-3 rounded-2xl border border-white/[0.06] bg-black/30 px-4 py-3 text-sm text-white/70 transition hover:bg-black/50 hover:text-white/90">
          <span className="font-mono text-xs mt-0.5 shrink-0" style={{ color: accent }}>{String(i+1).padStart(2,"0")}</span>
          <span className="leading-relaxed">{item}</span>
        </div>
      ))}
    </div>
  );
}
