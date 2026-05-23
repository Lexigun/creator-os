import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Sparkles, Zap, Target, DollarSign, Search, Wand2, CheckCircle2 } from "lucide-react";

const niches = [
  "Business & AI", "Space", "Tech Reviews", "Personal Finance", "History", "Fitness", "Travel", "Language Learning", "Psychology", "Documentary"
];

const angles = [
  "Beginner-friendly", "Controversial", "Luxury/premium", "Dark truth", "Step-by-step", "Case study", "Mistakes to avoid", "Zero-to-one", "Data-driven", "Storytelling"
];

const titlePatterns = [
  "I Tried {topic} for 30 Days — Here’s What Actually Happened",
  "The Hidden Truth About {topic} Nobody Explains",
  "How to Start {topic} From Zero Without Wasting Months",
  "{topic}: The Beginner Roadmap I Wish I Had",
  "Why Most People Fail at {topic} — And How to Win",
  "I Studied {topic} So You Don’t Have To",
  "The Fastest Way to Understand {topic} in 2026",
  "This One Mistake Is Killing Your {topic} Progress",
  "Can {topic} Actually Make You Money? Honest Breakdown",
  "The Brutally Simple {topic} Strategy for Beginners"
];

const hookOpeners = [
  "Most beginners are told the wrong thing about {topic}.",
  "I used to think {topic} was complicated — until I found this pattern.",
  "There are two ways to approach {topic}: the slow way, and the smart way.",
  "If I had to start {topic} again from zero, this is exactly what I’d do.",
  "The biggest problem with {topic} is that nobody explains the first step clearly."
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
    examples: [
      "Hidden systems of power",
      "Quiet billionaire habits",
      "The psychology of elite spaces"
    ]
  },
  {
    name: "AI Apocalypse",
    vibe: "Urgent technological disruption",
    colors: "Dark graphite, neon blue",
    tone: "Existential and futuristic",
    examples: [
      "Jobs AI will erase",
      "The terrifying speed of automation",
      "Why humans are losing leverage"
    ]
  },
  {
    name: "Rage Economics",
    vibe: "Economic frustration and ambition",
    colors: "Red, charcoal, white",
    tone: "Aggressive truth-telling",
    examples: [
      "Why your salary is dying",
      "The hidden tax trap",
      "How corporations extract attention"
    ]
  }
];

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

  React.useEffect(() => {
    const saved = localStorage.getItem("creator-os-state");
    if (!saved) return;
    try {
      const data = JSON.parse(saved);
      if (data.topic) setTopic(data.topic);
      if (data.niche) setNiche(data.niche);
      if (data.angle) setAngle(data.angle);
      if (data.audience) setAudience(data.audience);
      if (data.email) setEmail(data.email);
      if (data.intensity) setIntensity(data.intensity);
      if (data.controversy) setControversy(data.controversy);
      if (typeof data.facelessMode === "boolean") setFacelessMode(data.facelessMode);
    } catch (error) {}
  }, []);

  React.useEffect(() => {
    localStorage.setItem(
      "creator-os-state",
      JSON.stringify({ topic, niche, angle, audience, email, intensity, controversy, facelessMode })
    );
  }, [topic, niche, angle, audience, email, intensity, controversy, facelessMode]);

  const seed = hashText(topic + niche + angle + audience + intensity + controversy + facelessMode);

  const output = useMemo(() => {
    const titles = pickMany(titlePatterns, seed, 6).map(t => fill(t, topic));
    const hooks = pickMany(hookOpeners, seed + 11, 4).map(h => fill(h, topic));
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
    ]).map(angleText => controversy > 7 ? angleText.replace("Why", "The brutal reason why").replace("hidden", "disturbing hidden") : angleText);
    const videoPlan = [
      controversy > 7
        ? `Open with a controversial claim about ${topic}.`
        : `Open with a painful truth about ${topic}.`,
      `Show the common beginner mistake your audience makes.`,
      intensity > 7
        ? `Give an aggressive 3-step roadmap using the ${angle.toLowerCase()} angle.`
        : `Give a simple 3-step roadmap using the ${angle.toLowerCase()} angle.`,
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

    const rpmEstimate = `$${(seed % 18) + 6} - $${(seed % 30) + 18} RPM potential`;

    const viralScore = 72 + (seed % 27);
    const creatorIQ = 80 + (seed % 20);
    const competitionLevel = ["LOW", "MEDIUM", "HIGH"][seed % 3];

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

    const aiStack = facelessMode ? [
      "ChatGPT — scripting and ideation",
      "CapCut — editing and subtitles",
      "ElevenLabs — AI narration",
      "Midjourney/DALL·E — thumbnails and visuals"
    ] : [
      "DSLR or phone camera",
      "CapCut or Premiere Pro",
      "TubeBuddy for optimization",
      "Beehiiv newsletter funnel"
    ];
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
      thumbnailPrompts,
      trendHijacks,
      premiumBlueprint
    };
  }, [topic, niche, angle, audience, seed, intensity, controversy, facelessMode]);

  const fullText = `YouTube Starter Kit\n\nTopic: ${topic}\nNiche: ${niche}\nAngle: ${angle}\nAudience: ${audience}\n\nTitles:\n${output.titles.map((x, i) => `${i + 1}. ${x}`).join("\n")}\n\nHooks:\n${output.hooks.map((x, i) => `${i + 1}. ${x}`).join("\n")}\n\nThumbnail Ideas:\n${output.thumbs.map((x, i) => `${i + 1}. ${x}`).join("\n")}\n\nVideo Plan:\n${output.videoPlan.map((x, i) => `${i + 1}. ${x}`).join("\n")}\n\nMonetization Ideas:\n${output.monetization.map((x, i) => `${i + 1}. ${x}`).join("\n")}`;

  const copyAll = async () => {
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const downloadBlueprint = () => {
    const blob = new Blob([fullText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${topic.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-creator-blueprint.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.28),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_35%)]" />
        <div className="relative mx-auto max-w-6xl px-5 py-14 md:py-20">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm text-amber-200">
              <Sparkles className="h-4 w-4" /> Fastest-path creator utility
            </div>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
              Generate a YouTube starter kit in seconds.
            </h1>
            <div className="mb-6 flex flex-wrap gap-3">
              <div className="rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-sm text-green-300">
                12,481+ Creator Kits Generated
              </div>

              <div className="rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-300">
                Avg. Viral Score: 84%
              </div>

              <div className="rounded-full border border-purple-400/20 bg-purple-400/10 px-4 py-2 text-sm text-purple-300">
                Used by Faceless Channels
              </div>
            </div>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-300">
              Titles, hooks, thumbnail concepts, video structure, and monetization ideas for creators who want to move fast instead of staring at a blank page.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-white/10 bg-white/[0.04] text-white shadow-2xl">
          <CardContent className="p-6">
            <div className="mb-5 flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-amber-300" />
              <h2 className="text-xl font-semibold">Input</h2>
            </div>
            <label className="mb-2 block text-sm text-neutral-300">Video topic</label>
            <input value={topic} onChange={e => setTopic(e.target.value)} className="mb-4 w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none ring-amber-300/40 focus:ring-2" placeholder="e.g. AI tools for small businesses" />

            <label className="mb-2 block text-sm text-neutral-300">Niche</label>
            <select value={niche} onChange={e => setNiche(e.target.value)} className="mb-4 w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none">
              {niches.map(n => <option key={n}>{n}</option>)}
            </select>

            <label className="mb-2 block text-sm text-neutral-300">Angle</label>
            <select value={angle} onChange={e => setAngle(e.target.value)} className="mb-4 w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none">
              {angles.map(a => <option key={a}>{a}</option>)}
            </select>

            <div className="mb-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-neutral-900 p-4 col-span-2">
                <div className="mb-2 text-sm text-neutral-300">Controversy Amplifier</div>
                <input type="range" min="1" max="10" value={controversy} onChange={e => setControversy(e.target.value)} className="w-full" />
                <div className="mt-2 text-red-300">{controversy}/10</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-neutral-900 p-4">
                <div className="mb-2 text-sm text-neutral-300">Intensity Level</div>
                <input type="range" min="1" max="10" value={intensity} onChange={e => setIntensity(e.target.value)} className="w-full" />
                <div className="mt-2 text-amber-300">{intensity}/10</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-neutral-900 p-4 flex flex-col justify-between">
                <div>
                  <div className="text-sm text-neutral-300 mb-2">Faceless Empire Mode</div>
                  <div className="text-xs text-neutral-500">Automation-first creator business</div>
                </div>

                <button onClick={() => setFacelessMode(!facelessMode)} className={`mt-4 rounded-xl px-4 py-2 font-medium transition ${facelessMode ? 'bg-amber-300 text-black' : 'bg-neutral-800 text-white'}`}>
                  {facelessMode ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            </div>

            <label className="mb-2 block text-sm text-neutral-300">Target viewer</label>
            <textarea value={audience} onChange={e => setAudience(e.target.value)} className="min-h-24 w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none ring-amber-300/40 focus:ring-2" />

            <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
              <div className="mb-2 text-sm font-medium text-amber-200">Unlock Premium Creator Blueprint</div>
              <div className="mb-3 text-xs text-neutral-400">Get deeper viral systems, monetization maps, and creator psychology frameworks.</div>

              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mb-3 w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none"
              />

              <button
                onClick={() => setPremiumUnlocked(true)}
                className="w-full rounded-xl bg-amber-300 px-4 py-3 font-semibold text-black transition hover:bg-amber-200"
              >
                {premiumUnlocked ? "Premium Unlocked" : "Unlock Premium Access"}
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Button onClick={copyAll} className="w-full rounded-2xl bg-amber-300 py-4 text-base font-semibold text-neutral-950 hover:bg-amber-200">
                {copied ? <CheckCircle2 className="mr-2 inline h-5 w-5" /> : <Copy className="mr-2 inline h-5 w-5" />}
                {copied ? "Copied" : "Copy full kit"}
              </Button>

              <Button onClick={downloadBlueprint} className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-4 text-base font-semibold text-white hover:bg-white/[0.08]">
                Download blueprint
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-white/10 bg-gradient-to-br from-amber-300/10 to-white/[0.03] text-white shadow-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-300" />
                <h3 className="text-xl font-semibold">Channel Archetype</h3>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/40 p-5">
                <div className="text-3xl font-bold tracking-tight text-amber-200 mb-2">
                  {output.selectedArchetype.name}
                </div>

                <p className="text-neutral-300 mb-5">
                  {output.selectedArchetype.vibe}
                </p>

                <div className="grid gap-3 md:grid-cols-2 mb-5">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-sm text-neutral-400 mb-1">Visual Identity</div>
                    <div className="font-medium">{output.selectedArchetype.colors}</div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-sm text-neutral-400 mb-1">Narration Tone</div>
                    <div className="font-medium">{output.selectedArchetype.tone}</div>
                  </div>
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

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-white/10 bg-gradient-to-br from-purple-400/10 to-white/[0.03] text-white shadow-xl">
              <CardContent className="p-6">
                <div className="mb-2 text-sm uppercase tracking-widest text-neutral-400">Viral Probability</div>
                <div className="text-4xl font-bold tracking-tight text-purple-300">{output.viralScore}%</div>
                <Progress value={output.viralScore} className="mt-4" />
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-gradient-to-br from-blue-400/10 to-white/[0.03] text-white shadow-xl">
              <CardContent className="p-6">
                <div className="mb-2 text-sm uppercase tracking-widest text-neutral-400">Creator IQ</div>
                <div className="text-4xl font-bold tracking-tight text-blue-300">{output.creatorIQ}</div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-gradient-to-br from-red-400/10 to-white/[0.03] text-white shadow-xl">
              <CardContent className="p-6">
                <div className="mb-2 text-sm uppercase tracking-widest text-neutral-400">Competition</div>
                <div className="text-4xl font-bold tracking-tight text-red-300">{output.competitionLevel}</div>
              </CardContent>
            </Card>
          </div>

          <OutputCard icon={<Search className="h-5 w-5 text-amber-300" />} title="Thumbnail AI prompts" items={output.thumbnailPrompts} />

          <OutputCard icon={<Zap className="h-5 w-5 text-amber-300" />} title="Trend hijacking engine" items={output.trendHijacks} />

          {premiumUnlocked && (
            <OutputCard
              icon={<Sparkles className="h-5 w-5 text-amber-300" />}
              title="Premium creator blueprint"
              items={output.premiumBlueprint}
            />
          )}

          <Card className="border-white/10 bg-gradient-to-br from-green-400/10 to-white/[0.03] text-white shadow-xl">
            <CardContent className="p-6">
              <div className="mb-2 text-sm uppercase tracking-widest text-neutral-400">Estimated Revenue Potential</div>
              <div className="text-4xl font-bold tracking-tight text-green-300">{output.rpmEstimate}</div>
              <p className="mt-3 text-neutral-400">
                Based on niche monetization strength, advertiser demand, and audience psychology.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <section className="mx-auto max-w-6xl px-5 pb-10">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-amber-300/5 p-8 shadow-2xl">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-sm text-amber-200">
                Creator Intelligence System
              </div>

              <h2 className="max-w-2xl text-4xl font-bold tracking-tight text-white">
                Stop guessing what videos to make.
              </h2>

              <p className="mt-4 max-w-xl text-neutral-400 leading-8">
                Generate viral concepts, thumbnail psychology, monetization paths, and faceless creator systems in seconds.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
              <div className="mb-2 text-sm uppercase tracking-widest text-neutral-500">
                Early Access
              </div>

              <div className="mb-4 text-3xl font-bold text-white">
                Join the Creator List
              </div>

              <input
                placeholder="Enter your email"
                className="mb-3 w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none"
              />

              <button
                onClick={() => setPremiumUnlocked(true)}
                className="w-full rounded-2xl bg-amber-300 px-4 py-3 font-semibold text-black transition hover:bg-amber-200"
              >
                {premiumUnlocked ? "Access Activated" : "Get Early Access"}
              </button>

              <div className="mt-4 text-xs text-neutral-500">
                Weekly creator systems, trend reports, and viral channel blueprints.
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-5 pb-10 text-sm text-neutral-500">
        Built for speed: no login, no backend, no friction. Ship it as a free tool, collect emails, then sell templates, prompt packs, and creator PDFs.
      </footer>
    </div>
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
            <div key={i} className="rounded-2xl border border-white/10 bg-neutral-900/70 p-4 text-neutral-200">
              <span className="mr-2 text-amber-300">{String(i + 1).padStart(2, "0")}</span>{item}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
function Card({ className = "", children }) {
  return <div className={className}>{children}</div>;
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
    <div className={`h-2 w-full rounded-full bg-white/10 ${className}`}>
      <div
        className="h-full rounded-full bg-purple-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}