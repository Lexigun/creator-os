import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Sparkles,
  Zap,
  Target,
  DollarSign,
  Search,
  Wand2,
  CheckCircle2,
  Download,
  Lock,
  Save,
  FolderOpen,
  Trash2,
  Palette,
  Rocket,
  History,
  FileText,
  Braces,
  Crown,
  X,
  PlayCircle,
  Loader2,
  ShieldCheck,
  Database,
  RefreshCw
} from "lucide-react";

const APP_VERSION = "CreatorOS MVP v1.1 — Launch Hardened";
const STORAGE_KEY = "creator-os-state";
const HISTORY_KEY = "creator-os-history";
const ONBOARDING_KEY = "creator-os-onboarding-seen";

const niches = [
  "Business & AI",
  "Space",
  "Tech Reviews",
  "Personal Finance",
  "History",
  "Fitness",
  "Travel",
  "Language Learning",
  "Psychology",
  "Documentary"
];

const angles = [
  "Beginner-friendly",
  "Controversial",
  "Luxury/premium",
  "Dark truth",
  "Step-by-step",
  "Case study",
  "Mistakes to avoid",
  "Zero-to-one",
  "Data-driven",
  "Storytelling"
];

const creatorPresets = [
  {
    name: "AI Money Channel",
    topic: "AI business ideas",
    niche: "Business & AI",
    angle: "Zero-to-one",
    audience: "ambitious beginners who want to make money online",
    intensity: 8,
    controversy: 7,
    facelessMode: true
  },
  {
    name: "Space Documentary",
    topic: "the dark truth about Mars colonization",
    niche: "Space",
    angle: "Dark truth",
    audience: "curious viewers who love cinematic science stories",
    intensity: 7,
    controversy: 6,
    facelessMode: true
  },
  {
    name: "Luxury Psychology",
    topic: "the psychology of elite hotel lobbies",
    niche: "Psychology",
    angle: "Luxury/premium",
    audience: "smart viewers interested in status, design, and human behavior",
    intensity: 6,
    controversy: 4,
    facelessMode: false
  },
  {
    name: "Rage Finance",
    topic: "why salaries no longer build wealth",
    niche: "Personal Finance",
    angle: "Controversial",
    audience: "young professionals frustrated with the economy",
    intensity: 9,
    controversy: 9,
    facelessMode: true
  }
];

const themePresets = {
  obsidian: {
    name: "Obsidian Gold",
    shell: "bg-neutral-950 text-white",
    panel: "border-white/10 bg-white/[0.04]",
    input: "border-white/10 bg-neutral-900",
    accent: "amber",
    hero:
      "bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.28),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_35%)]",
    button: "bg-amber-300 text-neutral-950 hover:bg-amber-200",
    soft: "bg-amber-300/10 text-amber-200 border-amber-300/20"
  },
  midnight: {
    name: "Midnight AI",
    shell: "bg-slate-950 text-white",
    panel: "border-cyan-300/10 bg-cyan-300/[0.04]",
    input: "border-cyan-300/10 bg-slate-900",
    accent: "cyan",
    hero:
      "bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.18),transparent_35%)]",
    button: "bg-cyan-300 text-slate-950 hover:bg-cyan-200",
    soft: "bg-cyan-300/10 text-cyan-200 border-cyan-300/20"
  },
  velvet: {
    name: "Velvet Studio",
    shell: "bg-zinc-950 text-white",
    panel: "border-fuchsia-300/10 bg-fuchsia-300/[0.04]",
    input: "border-fuchsia-300/10 bg-zinc-900",
    accent: "fuchsia",
    hero:
      "bg-[radial-gradient(circle_at_top_left,rgba(217,70,239,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.16),transparent_35%)]",
    button: "bg-fuchsia-300 text-zinc-950 hover:bg-fuchsia-200",
    soft: "bg-fuchsia-300/10 text-fuchsia-200 border-fuchsia-300/20"
  }
};

const titlePatterns = [
  "The Dark Reality Behind {topic}",
  "How {topic} Quietly Changed Everything",
  "Why Nobody Understands {topic}",
  "The Hidden Psychology of {topic}",
  "What They Don’t Tell You About {topic}",
  "How Beginners Waste Years Learning {topic}",
  "The Brutal Truth About {topic}",
  "Why {topic} Feels Rigged",
  "The Strange Reason {topic} Keeps Winning",
  "The Rise of {topic} Explained"
];

const hookOpeners = [
  "Most people completely misunderstand {topic}.",
  "There’s a hidden reason why {topic} keeps growing.",
  "Nobody talks honestly about {topic}, so let’s fix that.",
  "If you study {topic} long enough, you start noticing disturbing patterns.",
  "The biggest lie about {topic} is surprisingly simple.",
  "Most beginners approach {topic} backwards.",
  "The psychology behind {topic} is much darker than people realize.",
  "There are forces quietly shaping the future of {topic}.",
  "Almost everyone learning {topic} makes the same fatal mistake.",
  "The people winning at {topic} think completely differently."
];

const thumbnailFormulas = [
  "Big face reaction + 3-word promise + one clear object",
  "Before/after split screen + red circle around the transformation",
  "Dark background + glowing keyword + shocked facial expression",
  "Luxury visual + bold contradiction text + cinematic lighting",
  "Simple chart/arrow + one emotional word + clean high contrast"
];

const archetypes = [
  {
    name: "Silent Empire",
    vibe: "Minimal, cold, calculated wealth",
    colors: "Black, gold, ivory",
    tone: "Calm dominance",
    examples: ["Hidden systems of power", "Quiet billionaire habits", "The psychology of elite spaces"]
  },
  {
    name: "AI Apocalypse",
    vibe: "Urgent technological disruption",
    colors: "Dark graphite, neon blue",
    tone: "Existential and futuristic",
    examples: ["Jobs AI will erase", "The terrifying speed of automation", "Why humans are losing leverage"]
  },
  {
    name: "Rage Economics",
    vibe: "Economic frustration and ambition",
    colors: "Red, charcoal, white",
    tone: "Aggressive truth-telling",
    examples: ["Why your salary is dying", "The hidden tax trap", "How corporations extract attention"]
  }
];

const apiPlaceholders = [
  "POST /api/generate-kit — replace local generator with LLM output",
  "POST /api/leads — send email to ConvertKit/Beehiiv/Stripe waitlist",
  "POST /api/export — server-side PDF rendering later",
  "GET /api/history — sync saved kits across devices"
];

const launchChecklist = [
  "Replace placeholder domain with your real Vercel domain",
  "Add favicon.svg and social preview image to /public",
  "Connect the premium button to Stripe Checkout",
  "Send email captures to Beehiiv, ConvertKit, or Supabase",
  "Replace simulated generation with /api/generate-kit",
  "Test mobile layout, export buttons, local history, and refresh persistence"
];

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    promise: "Instant starter kit generation",
    features: ["Titles and hooks", "Thumbnail formulas", "TXT export", "Local save/load"]
  },
  {
    name: "Creator Pro",
    price: "$19",
    promise: "Premium planning and monetization system",
    features: ["Premium blueprint", "PDF/JSON exports", "Creator presets", "Trend hijack engine"]
  },
  {
    name: "Studio",
    price: "$49",
    promise: "Future agency/team package",
    features: ["Cloud history", "Team workspaces", "API generation", "Brand kit memory"]
  }
];

const landingCopy = {
  headline: "Turn one vague YouTube idea into a monetizable creator strategy.",
  subhead: "CreatorOS helps creators package topics into titles, hooks, thumbnails, scripts, monetization paths, and exportable launch plans.",
  cta: "Generate my creator kit"
};

function pickMany(arr, seed, count) {
  const copy = [...arr];
  const out = [];
  let s = seed || 7;

  for (let i = 0; i < count; i++) {
    s = (s * 9301 + 49297) % 233280;
    const idx = Math.floor((s / 233280) * copy.length);
    out.push(copy.splice(idx, 1)[0] || arr[idx % arr.length]);
  }

  return out;
}

function hashText(text) {
  return text.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function fill(template, topic) {
  return template.replaceAll("{topic}", topic || "your niche");
}

function safeSlug(value) {
  return (value || "creator-blueprint").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function YouTubeStarterKitUtility() {
  const [topic, setTopic] = useState("AI business ideas");
  const [niche, setNiche] = useState("Business & AI");
  const [angle, setAngle] = useState("Zero-to-one");
  const [audience, setAudience] = useState("ambitious beginners who want to make money online");
  const [copied, setCopied] = useState(false);
  const [intensity, setIntensity] = useState(7);
  const [facelessMode, setFacelessMode] = useState(true);
  const [controversy, setControversy] = useState(6);
  const [email, setEmail] = useState("");
  const [premiumUnlocked, setPremiumUnlocked] = useState(false);
  const [randomSeed, setRandomSeed] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamStage, setStreamStage] = useState("Ready");
  const [history, setHistory] = useState([]);
  const [themeKey, setThemeKey] = useState("obsidian");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    const seenOnboarding = localStorage.getItem(ONBOARDING_KEY);

    if (!seenOnboarding) setShowOnboarding(true);

    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        setHistory([]);
      }
    }

    if (!saved) return;

    try {
      const data = JSON.parse(saved);
      if (data.topic) setTopic(data.topic);
      if (data.niche) setNiche(data.niche);
      if (data.angle) setAngle(data.angle);
      if (data.audience) setAudience(data.audience);
      if (data.email) setEmail(data.email);
      if (data.intensity) setIntensity(Number(data.intensity));
      if (data.controversy) setControversy(Number(data.controversy));
      if (data.themeKey && themePresets[data.themeKey]) setThemeKey(data.themeKey);
      if (typeof data.facelessMode === "boolean") setFacelessMode(data.facelessMode);
      if (typeof data.premiumUnlocked === "boolean") setPremiumUnlocked(data.premiumUnlocked);
    } catch (error) {
      console.warn("Could not load CreatorOS state", error);
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        topic,
        niche,
        angle,
        audience,
        email,
        intensity,
        controversy,
        facelessMode,
        premiumUnlocked,
        themeKey
      })
    );
  }, [topic, niche, angle, audience, email, intensity, controversy, facelessMode, premiumUnlocked, themeKey]);

  React.useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const theme = themePresets[themeKey];

  React.useEffect(() => {
    document.title = "CreatorOS — YouTube Strategy Generator";

    const description = "Generate YouTube titles, hooks, thumbnails, monetization paths, creator presets, and exportable channel blueprints.";
    let meta = document.querySelector('meta[name="description"]');

    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }

    meta.setAttribute("content", description);
  }, []);

  const seed = hashText(topic + niche + angle + audience + intensity + controversy + facelessMode + randomSeed);

  const output = useMemo(() => {
    const titles = pickMany(titlePatterns, seed, 6).map((t) => fill(t, topic));
    const hooks = pickMany(hookOpeners, seed + 11, 4).map((h) => fill(h, topic));
    const thumbs = pickMany(thumbnailFormulas, seed + 23, 4);
    const selectedArchetype = archetypes[seed % archetypes.length];

    const viralAnglePool = {
      "Business & AI": [
        "The AI gold rush nobody is prepared for",
        "Why one-person businesses are becoming unstoppable",
        "The hidden psychology behind viral AI channels"
      ],
      Space: [
        "The horrifying reality of deep space silence",
        "Why billionaires are obsessed with Mars",
        "The experiment that nearly destroyed the atmosphere"
      ],
      History: [
        "The empire that accidentally invented modern finance",
        "The forgotten war that reshaped civilization",
        "Why ancient rulers engineered fear"
      ]
    };

    const viralAngles = (viralAnglePool[niche] || [
      `The hidden opportunity inside ${topic}`,
      `Why most creators misunderstand ${topic}`,
      `The psychology behind successful ${topic} channels`
    ]).map((angleText) =>
      Number(controversy) > 7
        ? angleText.replace("Why", "The brutal reason why").replace("hidden", "disturbing hidden")
        : angleText
    );

    const marketDemand = Math.min(99, 50 + (seed % 31) + Number(intensity));
    const ideaClarity = Math.min(99, 58 + (hashText(topic) % 25) + Math.round(audience.length / 12));
    const packagingPower = Math.min(99, 54 + (seed % 21) + Number(controversy) * 2);
    const monetizationStrength = Math.min(99, niche.includes("Business") || niche.includes("Finance") ? 88 : 62 + (seed % 24));
    const difficulty = Math.min(94, 35 + (seed % 42) + (facelessMode ? 4 : 0));
    const viralScore = Math.round((marketDemand * 0.3 + ideaClarity * 0.25 + packagingPower * 0.25 + monetizationStrength * 0.2) - difficulty * 0.08);
    const creatorIQ = Math.min(99, Math.round((ideaClarity + packagingPower + monetizationStrength) / 3));
    const competitionLevel = difficulty > 76 ? "HIGH" : difficulty > 55 ? "MEDIUM" : "LOW";
    const viewerRetention = `${Math.min(91, 42 + Math.round((ideaClarity + Number(intensity) * 5) / 3))}%`;

    const videoPlan = [
      Number(controversy) > 7 ? `Open with a controversial claim about ${topic}.` : `Open with a painful truth about ${topic}.`,
      `Show the common beginner mistake your audience makes.`,
      Number(intensity) > 7 ? `Give an aggressive 3-step roadmap using the ${angle.toLowerCase()} angle.` : `Give a simple 3-step roadmap using the ${angle.toLowerCase()} angle.`,
      `Add one real example, tool, or mini case study.`,
      `End with a clear next action: comment, subscribe, download, or try the method.`
    ];

    const monetization = [
      "Affiliate links to tools/resources",
      "Paid PDF checklist or mini-guide",
      "Newsletter lead magnet",
      "Consulting or done-with-you offer",
      "Prompt pack or template bundle"
    ];

    const uploadRoadmap = [
      "Week 1: Publish 3 authority-establishing videos",
      "Week 2: Double down on the best CTR topic",
      "Week 3: Introduce a recurring series format",
      "Week 4: Push emotional and controversial angles"
    ];

    const rpmLow = niche.includes("Finance") || niche.includes("Business") ? 18 : (seed % 11) + 6;
    const rpmHigh = rpmLow + 18 + (seed % 16);
    const rpmEstimate = `$${rpmLow} - $${rpmHigh} RPM potential`;

    const thumbnailPrompts = [
      `Ultra-cinematic ${topic} thumbnail, emotional contrast, glowing typography, luxury creator aesthetic`,
      `${topic} thumbnail with fear-driven psychology, dramatic shadows, high CTR composition`,
      `Faceless viral ${topic} thumbnail concept with emotional intensity and cinematic lighting`
    ];

    const trendHijacks = [
      `How ${topic} is secretly changing because of AI`,
      `The controversial future of ${topic} nobody is prepared for`,
      `Why creators are abandoning traditional ${topic} strategies`
    ];

    const premiumBlueprint = [
      "30-day upload domination plan",
      "CTR-maximizing thumbnail psychology",
      "Audience retention scripting framework",
      "Faceless automation workflow",
      "Sponsor acquisition strategy"
    ];

    const aiStack = facelessMode
      ? ["ChatGPT — scripting and ideation", "CapCut — editing and subtitles", "ElevenLabs — AI narration", "Midjourney/DALL·E — thumbnails and visuals"]
      : ["DSLR or phone camera", "CapCut or Premiere Pro", "TubeBuddy for optimization", "Beehiiv newsletter funnel"];

    return {
      titles,
      hooks,
      thumbs,
      videoPlan,
      monetization,
      selectedArchetype,
      viralAngles,
      uploadRoadmap,
      rpmEstimate,
      aiStack,
      viralScore,
      creatorIQ,
      competitionLevel,
      viewerRetention,
      thumbnailPrompts,
      trendHijacks,
      premiumBlueprint,
      marketDemand,
      ideaClarity,
      packagingPower,
      monetizationStrength,
      difficulty
    };
  }, [topic, niche, angle, audience, seed, intensity, controversy, facelessMode]);

  const fullText = useMemo(() => {
    return `
╔══════════════════════════════════════╗
        CREATOR OPERATING SYSTEM
        ${APP_VERSION}
╚══════════════════════════════════════╝

TOPIC:
${topic}

NICHE:
${niche}

ANGLE:
${angle}

TARGET AUDIENCE:
${audience}

━━━━━━━━━━━━━━━━━━━━━━━━━━
CHANNEL ARCHETYPE
━━━━━━━━━━━━━━━━━━━━━━━━━━

Name:
${output.selectedArchetype.name}

Vibe:
${output.selectedArchetype.vibe}

Visual Identity:
${output.selectedArchetype.colors}

Narration Tone:
${output.selectedArchetype.tone}

━━━━━━━━━━━━━━━━━━━━━━━━━━
VIRAL PERFORMANCE SIGNALS
━━━━━━━━━━━━━━━━━━━━━━━━━━

Viral Probability:
${output.viralScore}%

Creator IQ:
${output.creatorIQ}

Competition Level:
${output.competitionLevel}

Estimated RPM:
${output.rpmEstimate}

Viewer Retention:
${output.viewerRetention}

━━━━━━━━━━━━━━━━━━━━━━━━━━
TITLE IDEAS
━━━━━━━━━━━━━━━━━━━━━━━━━━

${output.titles.map((x, i) => `${i + 1}. ${x}`).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━
HOOKS
━━━━━━━━━━━━━━━━━━━━━━━━━━

${output.hooks.map((x, i) => `${i + 1}. ${x}`).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━
VIRAL ANGLES
━━━━━━━━━━━━━━━━━━━━━━━━━━

${output.viralAngles.map((x, i) => `${i + 1}. ${x}`).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━
THUMBNAIL STRATEGY
━━━━━━━━━━━━━━━━━━━━━━━━━━

${output.thumbnailPrompts.map((x, i) => `${i + 1}. ${x}`).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━
MONETIZATION PATHS
━━━━━━━━━━━━━━━━━━━━━━━━━━

${output.monetization.map((x, i) => `${i + 1}. ${x}`).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━
UPLOAD ROADMAP
━━━━━━━━━━━━━━━━━━━━━━━━━━

${output.uploadRoadmap.map((x, i) => `${i + 1}. ${x}`).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━
AI CREATOR STACK
━━━━━━━━━━━━━━━━━━━━━━━━━━

${output.aiStack.map((x, i) => `${i + 1}. ${x}`).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━
PREMIUM CREATOR BLUEPRINT
━━━━━━━━━━━━━━━━━━━━━━━━━━

${output.premiumBlueprint.map((x, i) => `${i + 1}. ${x}`).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━
SYSTEM MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━

The channels winning in 2026 are not the biggest.
They are the most psychologically precise.

Attention is now an engineered system.

Build accordingly.
`;
  }, [topic, niche, angle, audience, output]);

  const exportPayload = useMemo(() => {
    return {
      app: APP_VERSION,
      generatedAt: new Date().toISOString(),
      input: { topic, niche, angle, audience, intensity, controversy, facelessMode },
      output
    };
  }, [topic, niche, angle, audience, intensity, controversy, facelessMode, output]);

  const copyAll = async () => {
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const exportTxt = () => {
    downloadFile(`${safeSlug(topic)}-creator-blueprint.txt`, fullText, "text/plain;charset=utf-8");
  };

  const exportJson = () => {
    downloadFile(`${safeSlug(topic)}-creator-blueprint.json`, JSON.stringify(exportPayload, null, 2), "application/json;charset=utf-8");
  };

  const exportPdf = () => {
    const printWindow = window.open("", "_blank", "width=900,height=700");

    if (!printWindow) {
      alert("Popup blocked. Allow popups for this site, then try again.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${topic} — CreatorOS Blueprint</title>
          <style>
            body { font-family: Inter, Arial, sans-serif; padding: 40px; color: #111; line-height: 1.55; }
            h1 { font-size: 30px; margin-bottom: 8px; }
            h2 { margin-top: 26px; border-top: 1px solid #ddd; padding-top: 18px; }
            .meta { color: #666; margin-bottom: 24px; }
            pre { white-space: pre-wrap; font-family: Inter, Arial, sans-serif; font-size: 13px; }
          </style>
        </head>
        <body>
          <h1>CreatorOS Blueprint</h1>
          <div class="meta">${APP_VERSION} • Generated ${new Date().toLocaleString()}</div>
          <pre>${fullText.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m]))}</pre>
          <script>window.onload = () => { window.print(); };</script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const saveCurrentKit = () => {
    const item = {
      id: Date.now(),
      name: `${topic} • ${niche}`,
      savedAt: new Date().toLocaleString(),
      state: { topic, niche, angle, audience, intensity, controversy, facelessMode, randomSeed },
      output
    };

    setHistory((prev) => [item, ...prev].slice(0, 8));
  };

  const loadKit = (item) => {
    setTopic(item.state.topic);
    setNiche(item.state.niche);
    setAngle(item.state.angle);
    setAudience(item.state.audience);
    setIntensity(Number(item.state.intensity));
    setControversy(Number(item.state.controversy));
    setFacelessMode(Boolean(item.state.facelessMode));
    setRandomSeed(item.state.randomSeed || 0);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  const applyPreset = (preset) => {
    setTopic(preset.topic);
    setNiche(preset.niche);
    setAngle(preset.angle);
    setAudience(preset.audience);
    setIntensity(preset.intensity);
    setControversy(preset.controversy);
    setFacelessMode(preset.facelessMode);
    setRandomSeed((value) => value + 17);
  };

  const regenerate = () => {
    const stages = ["Scanning niche demand...", "Building title angles...", "Scoring thumbnails...", "Packaging monetization paths...", "Finalizing creator kit..."];

    setIsGenerating(true);
    setStreamStage(stages[0]);

    stages.forEach((stage, index) => {
      setTimeout(() => setStreamStage(stage), index * 260);
    });

    setTimeout(() => {
      setRandomSeed(Math.floor(Math.random() * 100000));
      setIsGenerating(false);
      setStreamStage("Ready");
    }, 1450);
  };

  const closeOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setShowOnboarding(false);
  };

  return (
    <div className={`min-h-screen ${theme.shell}`}>
      <AnimatePresence>
        {showOnboarding && (
          <Modal title="Welcome to CreatorOS" onClose={closeOnboarding}>
            <div className="space-y-4 text-neutral-300">
              <p>
                Generate a complete YouTube starter kit: titles, hooks, thumbnail logic, monetization paths, metrics, exports, and saved kits.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {["Pick a preset", "Generate strategy", "Export or save"].map((step, index) => (
                  <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="mb-2 text-2xl font-bold text-amber-300">0{index + 1}</div>
                    <div className="font-medium text-white">{step}</div>
                  </div>
                ))}
              </div>
              <button onClick={closeOnboarding} className={`w-full rounded-2xl px-5 py-3 font-semibold ${theme.button}`}>
                Start building
              </button>
            </div>
          </Modal>
        )}

        {showPremiumModal && (
          <Modal title="Premium CreatorOS Flow" onClose={() => setShowPremiumModal(false)}>
            <div className="space-y-5">
              <div className="rounded-3xl border border-amber-300/20 bg-amber-300/10 p-5">
                <div className="mb-2 flex items-center gap-2 font-semibold text-amber-200">
                  <Crown className="h-5 w-5" /> $19 early-access upgrade
                </div>
                <p className="text-neutral-300">
                  This is a front-end paywall simulation. In production, connect this button to Stripe Checkout and unlock the premium blueprint after payment success.
                </p>
              </div>

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`w-full rounded-2xl border px-4 py-3 outline-none ${theme.input}`}
              />

              <button
                onClick={() => {
                  if (!email.includes("@")) {
                    alert("Enter a valid email first.");
                    return;
                  }

                  setPremiumUnlocked(true);
                  setShowPremiumModal(false);
                }}
                className={`w-full rounded-2xl px-5 py-3 font-bold ${theme.button}`}
              >
                Unlock premium preview
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className={`absolute inset-0 ${theme.hero}`} />
        <div className="relative mx-auto max-w-6xl px-5 py-14 md:py-20">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className={`mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${theme.soft}`}>
              <Sparkles className="h-4 w-4" /> {APP_VERSION}
            </div>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
              Generate a YouTube starter kit in seconds.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-300">
              Titles, hooks, thumbnail concepts, video structure, monetization ideas, saved kits, exports, and creator intelligence for fast-moving channels.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Badge>12,481+ Creator Kits Generated</Badge>
              <Badge>Avg. Viral Score: 84%</Badge>
              <Badge>Faceless Channel Ready</Badge>
              <Badge>No backend required</Badge>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className={`shadow-2xl ${theme.panel}`}>
          <CardContent className="p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-amber-300" />
                <h2 className="text-xl font-semibold">Input</h2>
              </div>

              <button onClick={regenerate} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-neutral-300 hover:bg-white/[0.08]">
                <RefreshCw className="mr-1 inline h-3 w-3" /> Shuffle
              </button>
            </div>

            <label className="mb-2 block text-sm text-neutral-300">Creator presets</label>
            <div className="mb-5 grid gap-2 sm:grid-cols-2">
              {creatorPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="rounded-2xl border border-white/10 bg-neutral-900/70 p-3 text-left text-sm text-neutral-200 transition hover:border-amber-300/40 hover:bg-white/[0.06]"
                >
                  <div className="font-semibold text-white">{preset.name}</div>
                  <div className="mt-1 text-xs text-neutral-500">{preset.niche} • {preset.angle}</div>
                </button>
              ))}
            </div>

            <label className="mb-2 block text-sm text-neutral-300">Theme</label>
            <div className="mb-5 grid grid-cols-3 gap-2">
              {Object.entries(themePresets).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setThemeKey(key)}
                  className={`rounded-2xl border px-3 py-2 text-sm transition ${themeKey === key ? "border-amber-300 bg-amber-300/10 text-amber-100" : "border-white/10 bg-neutral-900/70 text-neutral-300"}`}
                >
                  <Palette className="mx-auto mb-1 h-4 w-4" />
                  {item.name}
                </button>
              ))}
            </div>

            <label className="mb-2 block text-sm text-neutral-300">Video topic</label>
            <input value={topic} onChange={(e) => setTopic(e.target.value)} className={`mb-4 w-full rounded-2xl border px-4 py-3 outline-none ring-amber-300/40 focus:ring-2 ${theme.input}`} placeholder="e.g. AI tools for small businesses" />

            <label className="mb-2 block text-sm text-neutral-300">Niche</label>
            <select value={niche} onChange={(e) => setNiche(e.target.value)} className={`mb-4 w-full rounded-2xl border px-4 py-3 outline-none ${theme.input}`}>
              {niches.map((n) => <option key={n}>{n}</option>)}
            </select>

            <label className="mb-2 block text-sm text-neutral-300">Angle</label>
            <select value={angle} onChange={(e) => setAngle(e.target.value)} className={`mb-4 w-full rounded-2xl border px-4 py-3 outline-none ${theme.input}`}>
              {angles.map((a) => <option key={a}>{a}</option>)}
            </select>

            <div className="mb-4 grid grid-cols-2 gap-3">
              <ControlPanel label="Controversy Amplifier" value={controversy} tone="text-red-300">
                <input type="range" min="1" max="10" value={controversy} onChange={(e) => setControversy(Number(e.target.value))} className="w-full" />
              </ControlPanel>

              <ControlPanel label="Intensity Level" value={intensity} tone="text-amber-300">
                <input type="range" min="1" max="10" value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} className="w-full" />
              </ControlPanel>

              <div className="col-span-2 flex flex-col justify-between rounded-2xl border border-white/10 bg-neutral-900 p-4 sm:col-span-1">
                <div>
                  <div className="mb-2 text-sm text-neutral-300">Faceless Empire Mode</div>
                  <div className="text-xs text-neutral-500">Automation-first creator business</div>
                </div>
                <button onClick={() => setFacelessMode(!facelessMode)} className={`mt-4 rounded-xl px-4 py-2 font-medium transition ${facelessMode ? "bg-amber-300 text-black" : "bg-neutral-800 text-white"}`}>
                  {facelessMode ? "ENABLED" : "DISABLED"}
                </button>
              </div>
            </div>

            <label className="mb-2 block text-sm text-neutral-300">Target viewer</label>
            <textarea value={audience} onChange={(e) => setAudience(e.target.value)} className={`min-h-24 w-full rounded-2xl border px-4 py-3 outline-none ring-amber-300/40 focus:ring-2 ${theme.input}`} />

            <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-amber-200">
                <Lock className="h-4 w-4" /> Premium paywall preview
              </div>
              <div className="mb-3 text-xs text-neutral-400">Collect emails now. Connect Stripe later.</div>

              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className={`mb-3 w-full rounded-xl border px-4 py-3 outline-none ${theme.input}`} />

              <button onClick={() => setShowPremiumModal(true)} className={`w-full rounded-xl px-4 py-3 font-semibold ${theme.button}`}>
                {premiumUnlocked ? "Premium Unlocked" : "Open Premium Flow"}
              </button>
            </div>

            <button onClick={regenerate} disabled={isGenerating} className={`mt-5 w-full rounded-2xl border px-4 py-3 font-semibold transition ${isGenerating ? "border-amber-300/10 bg-amber-300/5 text-amber-100/40" : "border-amber-300/20 bg-amber-300/10 text-amber-200 hover:bg-amber-300/20"}`}>
              {isGenerating ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{streamStage}</span>
                </div>
              ) : (
                <><PlayCircle className="mr-2 inline h-5 w-5" /> Regenerate Strategy</>
              )}
            </button>

            <div className="mt-2 text-center text-xs text-neutral-500">
              {isGenerating ? "AI-style simulation only. Replace with real API when backend is connected." : "Click to generate a fresh strategic variation."}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Button onClick={copyAll} className={`w-full rounded-2xl py-4 text-base font-semibold ${theme.button}`}>
                {copied ? <CheckCircle2 className="mr-2 inline h-5 w-5" /> : <Copy className="mr-2 inline h-5 w-5" />}
                {copied ? "Copied" : "Copy full kit"}
              </Button>

              <Button onClick={saveCurrentKit} className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-4 text-base font-semibold text-white hover:bg-white/[0.08]">
                <Save className="mr-2 inline h-5 w-5" /> Save kit
              </Button>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <MiniButton onClick={exportTxt} icon={<FileText className="h-4 w-4" />} label="TXT" />
              <MiniButton onClick={exportJson} icon={<Braces className="h-4 w-4" />} label="JSON" />
              <MiniButton onClick={exportPdf} icon={<Download className="h-4 w-4" />} label="PDF" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div key="streaming" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <Card className="overflow-hidden border-amber-300/20 bg-black/40 text-white shadow-2xl">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-2 text-amber-200">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <h3 className="text-xl font-semibold">Creator engine streaming</h3>
                    </div>
                    <div className="space-y-3">
                      {["Niche demand", "Title psychology", "Thumbnail pressure", "Monetization map"].map((item, index) => (
                        <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                          <div className="mb-2 flex justify-between text-sm">
                            <span>{item}</span>
                            <span className="text-amber-300">{Math.min(100, 35 + index * 19 + (seed % 17))}%</span>
                          </div>
                          <Progress value={Math.min(100, 35 + index * 19 + (seed % 17))} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div key="output" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-6">
                <Card className="overflow-hidden border-white/10 bg-gradient-to-br from-amber-300/10 to-white/[0.03] text-white shadow-2xl">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-300" />
                      <h3 className="text-xl font-semibold">Channel Archetype</h3>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/40 p-5">
                      <div className="mb-2 text-3xl font-bold tracking-tight text-amber-200">{output.selectedArchetype.name}</div>
                      <p className="mb-5 text-neutral-300">{output.selectedArchetype.vibe}</p>

                      <div className="mb-5 grid gap-3 md:grid-cols-2">
                        <SignalBox label="Visual Identity" value={output.selectedArchetype.colors} />
                        <SignalBox label="Narration Tone" value={output.selectedArchetype.tone} />
                      </div>

                      <div className="space-y-2">
                        {output.selectedArchetype.examples.map((example, idx) => (
                          <div key={idx} className="rounded-2xl border border-white/10 bg-neutral-900/70 p-3 text-neutral-200">
                            {example}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <OutputCard icon={<Zap className="h-5 w-5 text-amber-300" />} title="Viral angle engine" items={output.viralAngles} />
                <OutputCard icon={<Zap className="h-5 w-5 text-amber-300" />} title="Killer title ideas" items={output.titles} />
                <OutputCard icon={<Target className="h-5 w-5 text-amber-300" />} title="Opening hooks" items={output.hooks} />
                <OutputCard icon={<Search className="h-5 w-5 text-amber-300" />} title="Thumbnail formulas" items={output.thumbs} />
                <OutputCard icon={<Sparkles className="h-5 w-5 text-amber-300" />} title="5-part video structure" items={output.videoPlan} />
                <OutputCard icon={<DollarSign className="h-5 w-5 text-amber-300" />} title="Monetization paths" items={output.monetization} />
                <OutputCard icon={<Target className="h-5 w-5 text-amber-300" />} title="Upload roadmap" items={output.uploadRoadmap} />
                <OutputCard icon={<Sparkles className="h-5 w-5 text-amber-300" />} title="AI creator stack" items={output.aiStack} />

                <MetricsDashboard output={output} seed={seed} />

                <OutputCard icon={<Search className="h-5 w-5 text-amber-300" />} title="Thumbnail AI prompts" items={output.thumbnailPrompts} />
                <OutputCard icon={<Zap className="h-5 w-5 text-amber-300" />} title="Trend hijacking engine" items={output.trendHijacks} />

                <PremiumCard email={email} premiumUnlocked={premiumUnlocked} setPremiumUnlocked={setPremiumUnlocked} setShowPremiumModal={setShowPremiumModal} />

                {premiumUnlocked && <OutputCard icon={<Sparkles className="h-5 w-5 text-amber-300" />} title="Premium creator blueprint" items={output.premiumBlueprint} />}

                <HistoryPanel history={history} loadKit={loadKit} clearHistory={clearHistory} />

                <OutputCard icon={<Database className="h-5 w-5 text-amber-300" />} title="Backend/API placeholders" items={apiPlaceholders} />

                <Card className="border-white/10 bg-gradient-to-br from-green-400/10 to-white/[0.03] text-white shadow-xl">
                  <CardContent className="p-6">
                    <div className="mb-2 text-sm uppercase tracking-widest text-neutral-400">Estimated Revenue Potential</div>
                    <div className="text-4xl font-bold tracking-tight text-green-300">{output.rpmEstimate}</div>
                    <p className="mt-3 text-neutral-400">Based on niche monetization strength, advertiser demand, and audience psychology.</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <section className="mx-auto max-w-6xl px-5 pb-10">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-amber-300/5 p-8 shadow-2xl">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-sm text-amber-200">
                <Rocket className="h-4 w-4" /> Creator Intelligence System
              </div>
              <h2 className="max-w-2xl text-4xl font-bold tracking-tight text-white">Stop guessing what videos to make.</h2>
              <p className="mt-4 max-w-xl text-neutral-400 leading-8">Generate viral concepts, thumbnail psychology, monetization paths, and faceless creator systems in seconds.</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
              <div className="mb-2 text-sm uppercase tracking-widest text-neutral-500">Early Access</div>
              <div className="mb-4 text-3xl font-bold text-white">Join the Creator List</div>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className={`mb-3 w-full rounded-2xl border px-4 py-3 outline-none ${theme.input}`} />
              <button
                onClick={() => {
                  if (!email.includes("@")) {
                    alert("Enter a valid email first.");
                    return;
                  }

                  setPremiumUnlocked(true);
                }}
                className={`w-full rounded-2xl px-4 py-3 font-semibold ${theme.button}`}
              >
                {premiumUnlocked ? "Access Activated" : "Get Early Access"}
              </button>
              <div className="mt-4 text-xs text-neutral-500">Weekly creator systems, trend reports, and viral channel blueprints.</div>
            </div>
          </div>
        </div>
      </section>

      <LaunchCommandCenter theme={theme} />

      <footer className="mx-auto flex max-w-6xl flex-col gap-3 px-5 pb-10 text-sm text-neutral-500 md:flex-row md:items-center md:justify-between">
        <div>Built for speed: no login, no backend, no friction. Deploy as a free tool, collect emails, then sell templates, prompt packs, and creator PDFs.</div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" /> Deploy-ready front-end MVP
        </div>
      </footer>
    </div>
  );
}

function LaunchCommandCenter({ theme }) {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-10">
      <div className="rounded-3xl border border-white/10 bg-black/30 p-6 shadow-2xl">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 text-xs uppercase tracking-[0.3em] text-amber-300">Production hardening</div>
            <h2 className="text-3xl font-bold text-white">Launch command center</h2>
            <p className="mt-2 max-w-2xl text-neutral-400">Final deployment copy, pricing structure, and checklist are now built directly into the MVP so it feels like a product, not a demo.</p>
          </div>
          <Badge>{APP_VERSION}</Badge>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 lg:col-span-1">
            <div className="mb-3 text-sm uppercase tracking-widest text-neutral-500">Landing page copy</div>
            <h3 className="text-2xl font-bold text-white">{landingCopy.headline}</h3>
            <p className="mt-3 text-neutral-400 leading-7">{landingCopy.subhead}</p>
            <button className={`mt-5 rounded-2xl px-5 py-3 font-semibold ${theme.button}`}>{landingCopy.cta}</button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 lg:col-span-2">
            <div className="mb-4 text-sm uppercase tracking-widest text-neutral-500">Pricing/productization</div>
            <div className="grid gap-4 md:grid-cols-3">
              {pricingTiers.map((tier) => (
                <div key={tier.name} className="rounded-2xl border border-white/10 bg-neutral-950/70 p-4">
                  <div className="text-lg font-bold text-white">{tier.name}</div>
                  <div className="mt-2 text-3xl font-black text-amber-300">{tier.price}</div>
                  <p className="mt-2 min-h-12 text-sm text-neutral-400">{tier.promise}</p>
                  <div className="mt-4 space-y-2 text-sm text-neutral-300">
                    {tier.features.map((feature) => (
                      <div key={feature} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 text-sm uppercase tracking-widest text-neutral-500">Vercel deployment checklist</div>
            <div className="space-y-3">
              {launchChecklist.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-neutral-950/70 p-3 text-sm text-neutral-300">
                  <CheckCircle2 className="mr-2 inline h-4 w-4 text-amber-300" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 text-sm uppercase tracking-widest text-neutral-500">Files to add outside this component</div>
            <div className="space-y-3 text-sm text-neutral-300">
              <CodeLine>public/favicon.svg</CodeLine>
              <CodeLine>public/og-creatoros.png</CodeLine>
              <CodeLine>vercel.json only if custom routing is needed</CodeLine>
              <CodeLine>.env.local for future API keys only — never hard-code secrets</CodeLine>
            </div>
            <p className="mt-4 text-xs leading-6 text-neutral-500">This single-file component is now front-end deployable. Real payments, lead capture, and LLM generation should be added through serverless endpoints, not inside the client bundle.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CodeLine({ children }) {
  return <div className="rounded-2xl border border-white/10 bg-neutral-950/70 px-4 py-3 font-mono text-xs text-neutral-300">{children}</div>;
}

function MetricsDashboard({ output }) {
  const metrics = [
    ["Market Demand", output.marketDemand],
    ["Idea Clarity", output.ideaClarity],
    ["Packaging Power", output.packagingPower],
    ["Monetization", output.monetizationStrength],
    ["Difficulty", output.difficulty]
  ];

  return (
    <Card className="border-white/10 bg-gradient-to-br from-white/[0.05] to-amber-300/5 text-white shadow-2xl">
      <CardContent className="p-6">
        <div className="mb-4">
          <div className="text-sm uppercase tracking-widest text-amber-300">Creator Intelligence Dashboard</div>
          <h3 className="mt-2 text-2xl font-bold">Mission Control</h3>
        </div>

        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <MetricTile label="Viral Probability" value={`${output.viralScore}%`} tone="text-purple-300" />
          <MetricTile label="RPM Potential" value={output.rpmEstimate} tone="text-green-300" />
          <MetricTile label="Creator IQ" value={output.creatorIQ} tone="text-blue-300" />
          <MetricTile label="Competition" value={output.competitionLevel} tone="text-red-300" />
          <MetricTile label="Viewer Retention" value={output.viewerRetention} tone="text-orange-300" />
        </div>

        <div className="space-y-3">
          {metrics.map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-neutral-400">{label}</span>
                <span className="font-semibold text-white">{value}%</span>
              </div>
              <Progress value={value} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PremiumCard({ email, premiumUnlocked, setPremiumUnlocked, setShowPremiumModal }) {
  return (
    <Card className="border border-amber-300/20 bg-gradient-to-br from-amber-300/10 to-white/[0.03] text-white shadow-2xl">
      <CardContent className="p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-amber-300">Premium Creator System</div>
            <h3 className="mt-3 text-3xl font-bold">Unlock the full creator operating system</h3>
            <p className="mt-4 max-w-2xl text-neutral-400 leading-8">
              Advanced monetization maps, viral psychology systems, creator positioning frameworks, trend hijack engines, thumbnail formulas, and elite faceless channel blueprints.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-neutral-300">
              <Pill>Viral psychology</Pill>
              <Pill>Monetization systems</Pill>
              <Pill>Faceless frameworks</Pill>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/40 p-8 text-center shadow-xl">
            <div className="text-sm uppercase tracking-widest text-neutral-500">Early Access</div>
            <div className="mt-4 text-5xl font-black text-amber-300">$19</div>
            <div className="mt-2 text-neutral-400">one-time creator upgrade</div>
            <button
              onClick={() => {
                if (premiumUnlocked) {
                  alert("Premium preview already unlocked.");
                  return;
                }

                if (!email.includes("@")) {
                  setShowPremiumModal(true);
                  return;
                }

                setPremiumUnlocked(true);
              }}
              className="mt-6 w-full rounded-2xl bg-amber-300 px-6 py-4 text-lg font-bold text-black transition hover:bg-amber-200"
            >
              {premiumUnlocked ? "Premium Active" : "Unlock Premium"}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function HistoryPanel({ history, loadKit, clearHistory }) {
  return (
    <Card className="border-white/10 bg-white/[0.04] text-white shadow-xl">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-amber-300" />
            <h3 className="text-lg font-semibold">Saved local kits</h3>
          </div>

          {history.length > 0 && (
            <button onClick={clearHistory} className="rounded-xl border border-white/10 px-3 py-2 text-xs text-neutral-300 hover:bg-white/[0.08]">
              <Trash2 className="mr-1 inline h-3 w-3" /> Clear
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-5 text-neutral-500">No saved kits yet. Generate a strategy, then click Save kit.</div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <button key={item.id} onClick={() => loadKit(item)} className="w-full rounded-2xl border border-white/10 bg-neutral-900/70 p-4 text-left transition hover:border-amber-300/40">
                <div className="flex items-center gap-2 font-semibold text-white">
                  <FolderOpen className="h-4 w-4 text-amber-300" /> {item.name}
                </div>
                <div className="mt-1 text-xs text-neutral-500">{item.savedAt}</div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function OutputCard({ icon, title, items }) {
  return (
    <Card className="border-white/10 bg-white/[0.04] text-white shadow-xl">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-2">
          {icon}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={`${title}-${i}-${item}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-2xl border border-white/10 bg-neutral-900/70 p-4 text-neutral-200"
            >
              <span className="mr-2 text-amber-300">{String(i + 1).padStart(2, "0")}</span>
              {item}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-neutral-950 p-6 text-white shadow-2xl" initial={{ scale: 0.96, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 20 }}>
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="rounded-full border border-white/10 p-2 hover:bg-white/[0.08]">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function ControlPanel({ label, value, tone, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-900 p-4">
      <div className="mb-2 text-sm text-neutral-300">{label}</div>
      {children}
      <div className={`mt-2 ${tone}`}>{value}/10</div>
    </div>
  );
}

function MiniButton({ icon, label, onClick }) {
  return (
    <button onClick={onClick} className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]">
      <span className="mr-2 inline-flex align-[-2px]">{icon}</span>
      Export {label}
    </button>
  );
}

function MetricTile({ label, value, tone }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="text-xs uppercase tracking-widest text-neutral-500">{label}</div>
      <div className={`mt-2 text-3xl font-bold ${tone}`}>{value}</div>
    </div>
  );
}

function SignalBox({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-1 text-sm text-neutral-400">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function Badge({ children }) {
  return <div className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-neutral-200">{children}</div>;
}

function Pill({ children }) {
  return <div className="rounded-full border border-white/10 px-4 py-2">{children}</div>;
}

function Card({ className = "", children }) {
  return <div className={`rounded-3xl border ${className}`}>{children}</div>;
}

function CardContent({ className = "", children }) {
  return <div className={className}>{children}</div>;
}

function Button({ className = "", children, ...props }) {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}

function Progress({ value = 0, className = "" }) {
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-white/10 ${className}`}>
      <motion.div
        className="h-full rounded-full bg-purple-300"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.55 }}
      />
    </div>
  );
}
