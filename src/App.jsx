import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Droplets, AlertTriangle, Zap, GitBranch,
  Rocket, ChevronRight, Activity, Lock, Eye,
  ArrowUpRight, Cpu, Database, X
} from "lucide-react";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const TALLY_FORM_ID = "PdA6QB";

// ─── TALLY POPUP HOOK ────────────────────────────────────────────────────────
// Loads Tally's official popup SDK and opens the form as a proper overlay.
// This avoids all iframe/CSP/X-Frame-Options blocking issues.
function useTallyPopup() {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    const script = document.createElement("script");
    script.src = "https://tally.so/widgets/embed.js";
    script.async = true;
    script.onload = () => {
      if (window.Tally) window.Tally.loadEmbeds();
    };
    document.head.appendChild(script);
  }, []);

  const openForm = () => {
    if (window.Tally) {
      window.Tally.openPopup(TALLY_FORM_ID, {
        layout: "modal",
        width: 600,
        autoClose: 3000,
        overlay: true,
        emoji: { text: "⚡", animation: "wave" },
        onSubmit: () => console.log("Form submitted"),
      });
    } else {
      // Fallback: open in new tab if SDK not loaded yet
      window.open(`https://tally.so/r/${TALLY_FORM_ID}`, "_blank");
    }
  };

  return openForm;
}

// ─── ANIMATION VARIANTS ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.11, ease: [0.22, 1, 0.36, 1] }
  })
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({ opacity: 1, transition: { duration: 0.5, delay: i * 0.1 } })
};

// ─── SECTION WRAPPER ─────────────────────────────────────────────────────────
function Section({ children, id, style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section id={id} ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} style={style}>
      {children}
    </motion.section>
  );
}

// ─── GLASS CARD ──────────────────────────────────────────────────────────────
function GlassCard({ children, delay = 0, hoverGlow = "rgba(124,58,237,0.12)" }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", borderRadius: 18, padding: 32, overflow: "hidden",
        border: hovered ? "1px solid rgba(255,255,255,0.13)" : "1px solid rgba(255,255,255,0.07)",
        background: hovered ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
        transition: "all 0.35s ease",
        boxShadow: hovered ? `0 0 40px ${hoverGlow}` : "none"
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── TERMINAL BLOCK ──────────────────────────────────────────────────────────
const TERMINAL_LINES = [
  { delay: 0,    text: "// Vector Systems — Protocol: COLD_START",     color: "#52525b" },
  { delay: 350,  text: "> Initializing project_megan_may.env",         color: "#71717a" },
  { delay: 750,  text: "> Loading baseline metrics...",                color: "#71717a" },
  { delay: 1150, text: "STATUS       DAY_0    →    DAY_20",            color: "#d4d4d8" },
  { delay: 1550, text: "─────────────────────────────────────────",    color: "#27272a" },
  { delay: 1750, text: "AUDIENCE     0        →    70        [+700%]", color: "#34d399" },
  { delay: 2150, text: "NET_DENSITY  0        →    50_HVC    [∞]",     color: "#34d399" },
  { delay: 2550, text: "ASSET_VALUE  NULL     →    LIVE",              color: "#22d3ee" },
  { delay: 2950, text: "─────────────────────────────────────────",    color: "#27272a" },
  { delay: 3150, text: "RESULT  ::  PROOF_OF_CONCEPT  ::  VALIDATED",  color: "#c084fc" },
  { delay: 3550, text: "> System ready. Awaiting next deployment.",    color: "#52525b" },
];

function TerminalBlock() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    if (!inView) return;
    TERMINAL_LINES.forEach((line, i) => {
      setTimeout(() => setVisible(v => [...v, i]), line.delay);
    });
  }, [inView]);

  return (
    <div ref={ref} style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)", background: "#060606", overflow: "hidden", fontFamily: "monospace", fontSize: 13 }}>
      {/* Chrome bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "rgba(239,68,68,0.55)", display: "inline-block" }} />
        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "rgba(234,179,8,0.55)", display: "inline-block" }} />
        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "rgba(34,197,94,0.55)", display: "inline-block" }} />
        <span style={{ marginLeft: 14, color: "#3f3f46", fontSize: 10, letterSpacing: "0.13em", textTransform: "uppercase" }}>
          vector_sys / protocol / cold_start.log
        </span>
      </div>
      <div style={{ padding: 24, minHeight: 300, lineHeight: 1.9 }}>
        {TERMINAL_LINES.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={visible.includes(i) ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.28 }}
            style={{ color: line.color, whiteSpace: "pre", letterSpacing: "0.02em" }}
          >
            {line.text}
          </motion.div>
        ))}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.75 }}
          style={{ display: "inline-block", width: 8, height: 16, background: "#c084fc", verticalAlign: "middle", marginTop: 4 }}
        />
      </div>
    </div>
  );
}

// ─── NOISE TEXTURE ───────────────────────────────────────────────────────────
function Noise() {
  return (
    <div style={{
      pointerEvents: "none", position: "fixed", inset: 0, zIndex: 1, opacity: 0.04,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: "120px 120px"
    }} />
  );
}

// ─── DARK NEEDLE TERMINAL ─────────────────────────────────────────────────────
const DARK_NEEDLE_LINES = [
  { delay: 0,    text: "// Vector Systems — Protocol: DORMANT_ACTIVATION", color: "#52525b" },
  { delay: 350,  text: "> Scanning project_dark_needle.env",               color: "#71717a" },
  { delay: 750,  text: "> Diagnosing passive audience cluster...",          color: "#71717a" },
  { delay: 1150, text: "METRIC           INPUT      →    OUTPUT",          color: "#d4d4d8" },
  { delay: 1550, text: "─────────────────────────────────────────",        color: "#27272a" },
  { delay: 1750, text: "SCALE            98,000 SUBS →  ACTIVE",           color: "#fb923c" },
  { delay: 2150, text: "STATUS           PASSIVE    →  ENGAGED  [LIVE]",   color: "#34d399" },
  { delay: 2550, text: "ENGAGEMENT       DEAD       →  +300%    SPIKE",    color: "#34d399" },
  { delay: 2950, text: "DEPLOYMENT       ━━━━━━━━━  →  7 DAYS",            color: "#22d3ee" },
  { delay: 3150, text: "─────────────────────────────────────────",        color: "#27272a" },
  { delay: 3350, text: "RESULT  ::  DORMANT_AUDIENCE  ::  REACTIVATED",    color: "#fb923c" },
  { delay: 3750, text: "> Activation sequence complete.",                  color: "#52525b" },
];

function DarkNeedleTerminal() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    if (!inView) return;
    DARK_NEEDLE_LINES.forEach((line, i) => {
      setTimeout(() => setVisible(v => [...v, i]), line.delay);
    });
  }, [inView]);

  return (
    <div ref={ref} style={{ borderRadius: 16, border: "1px solid rgba(251,146,60,0.15)", background: "#060606", overflow: "hidden", fontFamily: "monospace", fontSize: 13 }}>
      {/* Chrome bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "12px 20px", borderBottom: "1px solid rgba(251,146,60,0.08)", background: "rgba(251,146,60,0.03)" }}>
        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "rgba(239,68,68,0.55)", display: "inline-block" }} />
        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "rgba(234,179,8,0.55)", display: "inline-block" }} />
        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "rgba(34,197,94,0.55)", display: "inline-block" }} />
        <span style={{ marginLeft: 14, color: "#3f3f46", fontSize: 10, letterSpacing: "0.13em", textTransform: "uppercase" }}>
          vector_sys / protocol / dark_needle.log
        </span>
      </div>
      <div style={{ padding: 24, minHeight: 300, lineHeight: 1.9 }}>
        {DARK_NEEDLE_LINES.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={visible.includes(i) ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.28 }}
            style={{ color: line.color, whiteSpace: "pre", letterSpacing: "0.02em" }}
          >
            {line.text}
          </motion.div>
        ))}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.75 }}
          style={{ display: "inline-block", width: 8, height: 16, background: "#fb923c", verticalAlign: "middle", marginTop: 4 }}
        />
      </div>
    </div>
  );
}

// ─── CTA BUTTON ──────────────────────────────────────────────────────────────
function CTAButton({ onClick, children, style = {} }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      style={{
        fontFamily: "monospace", fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase",
        padding: "16px 38px", borderRadius: 14, border: "none", color: "#ffffff", cursor: "pointer",
        background: "linear-gradient(135deg,#7c3aed,#3b82f6)",
        boxShadow: "0 0 40px rgba(124,58,237,0.5), 0 0 90px rgba(124,58,237,0.18)",
        display: "inline-flex", alignItems: "center", gap: 9,
        ...style
      }}
    >
      {children}
    </motion.button>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function VectorSystems() {
  const openForm = useTallyPopup();

  return (
    <div style={{ minHeight: "100vh", background: "#000000", color: "#ffffff", overflowX: "hidden", fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif" }}>
      <Noise />

      {/* Dot grid */}
      <div style={{
        pointerEvents: "none", position: "fixed", inset: 0, zIndex: 0, opacity: 0.025,
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }} />

      {/* Ambient glows */}
      <div style={{ pointerEvents: "none", position: "fixed", top: "-25vh", left: "50%", transform: "translateX(-50%)", width: 800, height: 500, borderRadius: "50%", background: "rgba(124,58,237,0.1)", filter: "blur(120px)", zIndex: 0 }} />
      <div style={{ pointerEvents: "none", position: "fixed", bottom: "-15vh", right: "-10vw", width: 600, height: 600, borderRadius: "50%", background: "rgba(59,130,246,0.07)", filter: "blur(120px)", zIndex: 0 }} />

      {/* ═══ NAV ═══ */}
      <nav style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 64px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Cpu size={13} color="#fff" />
          </div>
          <span style={{ fontFamily: "monospace", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "#e4e4e7" }}>
            Vector Systems
          </span>
        </div>

        <div style={{ display: "flex", gap: 36 }}>
          {[["Protocol","#protocol"],["Case Study","#case-study"],["Architecture","#architecture"]].map(([label, href], i) => (
            <a key={i} href={href}
              style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#71717a", textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.color = "#e4e4e7"}
              onMouseLeave={e => e.currentTarget.style.color = "#71717a"}
            >{label}</a>
          ))}
        </div>

        <button onClick={openForm} style={{
          fontFamily: "monospace", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
          color: "#c084fc", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.35)",
          borderRadius: 10, padding: "9px 18px", cursor: "pointer", transition: "all 0.25s"
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.16)"; e.currentTarget.style.borderColor = "rgba(192,132,252,0.55)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(124,58,237,0.08)"; e.currentTarget.style.borderColor = "rgba(124,58,237,0.35)"; }}
        >
          Access
        </button>
      </nav>

      {/* ═══ HERO ═══ */}
      <Section style={{ position: "relative", zIndex: 10, minHeight: "90vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 24px" }}>
        <motion.div variants={fadeIn} custom={0} style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 999, border: "1px solid rgba(192,132,252,0.3)", background: "rgba(124,58,237,0.1)", padding: "7px 18px", marginBottom: 44 }}>
          <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ width: 6, height: 6, borderRadius: "50%", background: "#c084fc", display: "inline-block" }} />
          <span style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#c084fc" }}>
            System Online — v2.4.1
          </span>
        </motion.div>

        <motion.h1 variants={fadeUp} custom={1} style={{ fontSize: "clamp(54px,9vw,108px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 0.92, margin: "0 0 32px" }}>
          <span style={{ color: "#ffffff", display: "block" }}>Turn Entropy</span>
          <span style={{ background: "linear-gradient(90deg,#a855f7,#818cf8,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "block" }}>
            Into Equity.
          </span>
        </motion.h1>

        <motion.p variants={fadeUp} custom={2} style={{ maxWidth: 580, color: "#a1a1aa", fontSize: 18, lineHeight: 1.72, marginBottom: 52, fontWeight: 300 }}>
          We do not manage influencers.{" "}
          <span style={{ color: "#f4f4f5" }}>We architect digital assets for high-value creators.</span>{" "}
          Stop renting your audience. Start owning your infrastructure.
        </motion.p>

        <motion.div variants={fadeUp} custom={3}>
          <CTAButton onClick={openForm}>
            Initialize Build Sequence <ChevronRight size={16} />
          </CTAButton>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeUp} custom={4} style={{ marginTop: 72, display: "flex", flexWrap: "wrap", gap: "56px", justifyContent: "center" }}>
          {[
            { label: "Avg. Funnel Conv.", value: "38.4%", icon: <Activity size={12} /> },
            { label: "Time to Deploy",    value: "14 Days", icon: <Zap size={12} /> },
            { label: "Asset Uptime",      value: "99.97%", icon: <Activity size={12} /> },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, color: "#52525b", fontFamily: "monospace", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>
                {s.icon} {s.label}
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 26, fontWeight: 700, color: "#ffffff" }}>{s.value}</div>
            </div>
          ))}
        </motion.div>
      </Section>

      {/* ═══ PROBLEM ═══ */}
      <Section id="protocol" style={{ position: "relative", zIndex: 10, padding: "96px 64px", maxWidth: 1200, margin: "0 auto" }}>
        <motion.div variants={fadeUp} custom={0}>
          <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#3f3f46" }}>// Module 01</span>
        </motion.div>
        <motion.h2 variants={fadeUp} custom={1} style={{ fontSize: "clamp(30px,5vw,60px)", fontWeight: 900, letterSpacing: "-0.03em", margin: "14px 0 16px", color: "#ffffff" }}>
          The <span style={{ color: "#c084fc" }}>Entropy</span> Problem
        </motion.h2>
        <motion.p variants={fadeUp} custom={2} style={{ color: "#a1a1aa", maxWidth: 520, fontSize: 16, lineHeight: 1.75, marginBottom: 52 }}>
          Most creators generate massive traffic. Almost none capture it. The pipeline leaks at every stage — views evaporate, attention dissipates, zero infrastructure remains.
        </motion.p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 }}>
          {[
            {
              icon: <Eye size={24} style={{ color: "#60a5fa" }} />,
              tag: "INPUT_SIGNAL",
              tagBg: "rgba(29,78,216,0.15)", tagBorder: "rgba(59,130,246,0.3)", tagColor: "#93c5fd",
              title: "High Views",
              desc: "Millions of impressions. Maximum eyeball capture. All signals pointing up.",
              stat: "∞ Traffic", statColor: "#60a5fa",
              hoverGlow: "rgba(59,130,246,0.1)"
            },
            {
              icon: <Droplets size={24} style={{ color: "#fbbf24" }} />,
              tag: "FAILURE_NODE",
              tagBg: "rgba(133,77,14,0.18)", tagBorder: "rgba(234,179,8,0.3)", tagColor: "#fde68a",
              title: "Leaky Bucket",
              desc: "No capture layer. No email. No product. No owned channel. Audience evaporates the moment the algorithm pivots.",
              stat: "0 Retention", statColor: "#fbbf24",
              hoverGlow: "rgba(234,179,8,0.08)"
            },
            {
              icon: <AlertTriangle size={24} style={{ color: "#f87171" }} />,
              tag: "TERMINAL_STATE",
              tagBg: "rgba(153,27,27,0.18)", tagBorder: "rgba(239,68,68,0.3)", tagColor: "#fca5a5",
              title: "Zero Asset Value",
              desc: "Traffic is not an asset. Without infrastructure, a creator's digital net worth is effectively null.",
              stat: "NULL VALUE", statColor: "#f87171",
              hoverGlow: "rgba(239,68,68,0.1)"
            },
          ].map((card, i) => (
            <GlassCard key={i} delay={i + 1} hoverGlow={card.hoverGlow}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
                <div style={{ padding: 11, borderRadius: 11, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  {card.icon}
                </div>
                <span style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.13em", textTransform: "uppercase", background: card.tagBg, border: `1px solid ${card.tagBorder}`, color: card.tagColor, padding: "4px 9px", borderRadius: 6 }}>
                  {card.tag}
                </span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#ffffff", marginBottom: 10 }}>{card.title}</h3>
              <p style={{ color: "#a1a1aa", fontSize: 14, lineHeight: 1.68, marginBottom: 22 }}>{card.desc}</p>
              <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: card.statColor }}>{card.stat}</div>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* ═══ CASE STUDIES ═══ */}
      <Section id="case-study" style={{ position: "relative", zIndex: 10, padding: "96px 64px", maxWidth: 1400, margin: "0 auto" }}>

        {/* Section header */}
        <motion.div variants={fadeUp} custom={0}>
          <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#3f3f46" }}>// Case Studies — Field Records</span>
        </motion.div>
        <motion.h2 variants={fadeUp} custom={1} style={{ fontSize: "clamp(30px,5vw,60px)", fontWeight: 900, letterSpacing: "-0.03em", margin: "14px 0 12px", color: "#ffffff" }}>
          Proof of <span style={{ background: "linear-gradient(90deg,#a855f7,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>System</span>
        </motion.h2>
        <motion.p variants={fadeUp} custom={2} style={{ color: "#a1a1aa", maxWidth: 500, fontSize: 15, lineHeight: 1.75, marginBottom: 64 }}>
          Two protocols. Two different failure states. One repeatable system that resolves both.
        </motion.p>

        {/* Two case study cards side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(560px, 1fr))", gap: 24 }}>

          {/* ── Card 1: Megan May ── */}
          <motion.div variants={fadeUp} custom={3} style={{
            borderRadius: 20, border: "1px solid rgba(168,85,247,0.2)",
            background: "rgba(168,85,247,0.03)", overflow: "hidden"
          }}>
            {/* Card header */}
            <div style={{ padding: "28px 32px 0" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <span style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7c3aed", background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)", padding: "4px 10px", borderRadius: 6 }}>
                    EXECUTION_THREAD #001
                  </span>
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: "#ffffff", margin: "14px 0 4px", letterSpacing: "-0.02em" }}>
                    Project Megan May
                  </h3>
                  <p style={{ fontFamily: "monospace", fontSize: 10, color: "#71717a", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    Cold Start Protocol
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "monospace", fontSize: 28, fontWeight: 700, color: "#c084fc", lineHeight: 1 }}>+700%</div>
                  <div style={{ fontFamily: "monospace", fontSize: 10, color: "#52525b", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>Audience Growth</div>
                </div>
              </div>

              {/* Inline stats row */}
              <div style={{ display: "flex", gap: 0, borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", margin: "0 -32px", padding: "16px 32px", marginBottom: 24 }}>
                {[
                  { label: "Start", value: "Day 0" },
                  { label: "End", value: "Day 20" },
                  { label: "Connections", value: "50 HVC" },
                  { label: "Baseline", value: "0 → Live" },
                ].map((s, i) => (
                  <div key={i} style={{ flex: 1, textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <div style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 700, color: "#e4e4e7" }}>{s.value}</div>
                    <div style={{ fontFamily: "monospace", fontSize: 9, color: "#52525b", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 3 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal */}
            <div style={{ padding: "0 32px 28px" }}>
              <TerminalBlock />
            </div>
          </motion.div>

          {/* ── Card 2: Dark Needle ── */}
          <motion.div variants={fadeUp} custom={4} style={{
            borderRadius: 20, border: "1px solid rgba(251,146,60,0.2)",
            background: "rgba(251,146,60,0.02)", overflow: "hidden"
          }}>
            {/* Card header */}
            <div style={{ padding: "28px 32px 0" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <span style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#ea580c", background: "rgba(234,88,12,0.12)", border: "1px solid rgba(234,88,12,0.3)", padding: "4px 10px", borderRadius: 6 }}>
                    EXECUTION_THREAD #002
                  </span>
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: "#ffffff", margin: "14px 0 4px", letterSpacing: "-0.02em" }}>
                    Project Dark Needle
                  </h3>
                  <p style={{ fontFamily: "monospace", fontSize: 10, color: "#71717a", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    Dormant Audience Activation
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "monospace", fontSize: 28, fontWeight: 700, color: "#fb923c", lineHeight: 1 }}>+300%</div>
                  <div style={{ fontFamily: "monospace", fontSize: 10, color: "#52525b", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>Engagement Spike</div>
                </div>
              </div>

              {/* Inline stats row */}
              <div style={{ display: "flex", gap: 0, borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", margin: "0 -32px", padding: "16px 32px", marginBottom: 24 }}>
                {[
                  { label: "Scale", value: "98K Subs" },
                  { label: "Status", value: "Passive→Active" },
                  { label: "Deployment", value: "7 Days" },
                  { label: "Prior State", value: "Dead Audience" },
                ].map((s, i) => (
                  <div key={i} style={{ flex: 1, textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <div style={{ fontFamily: "monospace", fontSize: i === 1 ? 11 : 15, fontWeight: 700, color: "#e4e4e7" }}>{s.value}</div>
                    <div style={{ fontFamily: "monospace", fontSize: 9, color: "#52525b", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 3 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal */}
            <div style={{ padding: "0 32px 28px" }}>
              <DarkNeedleTerminal />
            </div>
          </motion.div>

        </div>
      </Section>

      {/* ═══ SOLUTION ═══ */}
      <Section id="architecture" style={{ position: "relative", zIndex: 10, padding: "96px 64px", maxWidth: 1200, margin: "0 auto" }}>
        <motion.div variants={fadeUp} custom={0}>
          <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#3f3f46" }}>// Module 03 — Product Architecture</span>
        </motion.div>
        <motion.h2 variants={fadeUp} custom={1} style={{ fontSize: "clamp(30px,5vw,60px)", fontWeight: 900, letterSpacing: "-0.03em", margin: "14px 0 14px", color: "#ffffff" }}>
          The <span style={{ color: "#60a5fa" }}>System</span> Stack
        </motion.h2>
        <motion.p variants={fadeUp} custom={2} style={{ color: "#a1a1aa", maxWidth: 460, fontSize: 16, lineHeight: 1.75, marginBottom: 52 }}>
          Three integrated modules. One deployment pipeline. Total infrastructure ownership.
        </motion.p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 }}>
          {[
            {
              icon: <Database size={23} style={{ color: "#c084fc" }} />,
              module: "MODULE_01", title: "The Asset Build", subtitle: "Notion / Digital Products",
              desc: "We engineer your core digital asset — structured Notion systems, productized knowledge, and distribution-ready content architecture.",
              features: ["Notion OS build", "Digital product spec", "Content asset mapping"],
              hoverGlow: "rgba(192,132,252,0.1)"
            },
            {
              icon: <GitBranch size={23} style={{ color: "#22d3ee" }} />,
              module: "MODULE_02", title: "The Funnel Logic", subtitle: "Views → Cash Conversion",
              desc: "Traffic capture mechanics. Automated pipelines that convert passive viewers into active buyers without manual intervention.",
              features: ["Capture layer design", "Automated sequences", "Revenue routing"],
              hoverGlow: "rgba(34,211,238,0.1)"
            },
            {
              icon: <Rocket size={23} style={{ color: "#60a5fa" }} />,
              module: "MODULE_03", title: "The Launch Algorithm", subtitle: "14-Day Deployment Cycle",
              desc: "Precision-timed rollout. Not a content calendar. A deployment sequence with measurable milestones and hard checkpoints.",
              features: ["Day-by-day sprint map", "Distribution triggers", "Performance gates"],
              hoverGlow: "rgba(96,165,250,0.1)"
            },
          ].map((card, i) => (
            <GlassCard key={i} delay={i + 1} hoverGlow={card.hoverGlow}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
                <div style={{ padding: 11, borderRadius: 11, background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  {card.icon}
                </div>
                <span style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "#52525b" }}>
                  {card.module}
                </span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#ffffff", marginBottom: 6 }}>{card.title}</h3>
              <p style={{ fontFamily: "monospace", fontSize: 10, color: "#71717a", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>{card.subtitle}</p>
              <p style={{ color: "#a1a1aa", fontSize: 14, lineHeight: 1.68, marginBottom: 22 }}>{card.desc}</p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {card.features.map((f, j) => (
                  <li key={j} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "monospace", fontSize: 12, color: "#a1a1aa" }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#52525b", display: "inline-block", flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div variants={fadeUp} custom={5} style={{ marginTop: 72, textAlign: "center" }}>
          <p style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#52525b", marginBottom: 24 }}>
            Ready to initialize your build sequence?
          </p>
          <CTAButton onClick={openForm} style={{ padding: "16px 42px" }}>
            Request System Access <ArrowUpRight size={15} />
          </CTAButton>
        </motion.div>
      </Section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ position: "relative", zIndex: 10, borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 32 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 64px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg,#7c3aed,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Cpu size={11} color="#fff" />
            </div>
            <span style={{ fontFamily: "monospace", fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "#71717a" }}>
              Vector Systems. Operating in the Shadows.
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "monospace", fontSize: 10, color: "#3f3f46" }}>
            <Lock size={10} />
            <span>ENCRYPTED • ALL RIGHTS RESERVED • {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}