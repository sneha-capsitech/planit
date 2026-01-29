import React from 'react';
import { motion, useAnimationControls, type Variants } from 'framer-motion';

const IconSparkle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M12 2l1.2 4.2L17.4 8 13.2 9.2 12 13.4 10.8 9.2 6.6 8l4.2-1.8L12 2Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path
      d="M19 12l.8 2.7 2.7.8-2.7.8L19 19l-.8-2.7-2.7-.8 2.7-.8L19 12Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

const IconArrowRight = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M5 12h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconCalendar = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M7 3v3M17 3v3M4 9h16M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconDoc = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path d="M14 2v5h5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
  </svg>
);

const IconPin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M14 9l-3 3M8 7l9 9M9 4l11 11-3 1-1 3-6-6-3 1 1-3-3-3 5-4Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconClock = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z" stroke="currentColor" strokeWidth="1.7" />
    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconGrid = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

const IconTarget = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M12 21a9 9 0 1 0-9-9 9 9 0 0 0 9 9Z" stroke="currentColor" strokeWidth="1.7" />
    <path d="M12 16a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="currentColor" strokeWidth="1.7" />
    <path d="M12 13a1 1 0 1 0-1-1 1 1 0 0 0 1 1Z" stroke="currentColor" strokeWidth="1.7" />
  </svg>
);

const IconSearch = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M11 19a8 8 0 1 0-8-8 8 8 0 0 0 8 8Z" stroke="currentColor" strokeWidth="1.7" />
    <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

const IconMoon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M21 13.2A7.8 7.8 0 0 1 10.8 3 9 9 0 1 0 21 13.2Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

const IconPhone = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"
      stroke="currentColor"
      strokeWidth="1.7"
    />
    <path d="M12 18h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

const reveal: Variants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
  }),
};

const hoverLift = {
  hover: { y: -3, transition: { duration: 0.18 } },
  tap: { scale: 0.98 },
} as const;

const FeaturePill = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="hero-pill">
    <span className="hero-pill-ic">{icon}</span>
    <span className="hero-pill-tx">{text}</span>
  </div>
);

const AnimatedCard = ({
  icon,
  title,
  desc,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  delay?: number;
}) => (
  <motion.div
    className="info-card"
    variants={reveal}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.35 }}
    custom={delay ?? 0}
    whileHover="hover"
    whileTap="tap"
    {...hoverLift}
  >
    <div className="info-ic">{icon}</div>
    <div className="info-title">{title}</div>
    <div className="info-desc">{desc}</div>
  </motion.div>
);

const StepCard = ({
  n,
  icon,
  title,
  desc,
  elevated,
  delay = 0,
}: {
  n: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  elevated?: boolean;
  delay?: number;
}) => (
  <motion.div
    className={`step-card ${elevated ? 'step-card--elevated' : ''}`}
    variants={reveal}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.35 }}
    custom={delay ?? 0}
    whileHover="hover"
    whileTap="tap"
    {...hoverLift}
  >
    <div className="step-ic">{icon}</div>
    <div className="step-num">{n}</div>
    <div className="step-title">{title}</div>
    <div className="step-desc">{desc}</div>
  </motion.div>
);

/**
 * ✅ Always visible (no initial fade)
 * ✅ Draggable only around its original location
 * ✅ Snaps back to original spot on release
 * ✅ Keeps soft idle floating by rotating slightly
 */
const FloatingNote = ({
  className,
  floatDelay = 0,
  floatDuration = 7,
  rotate = 0,
}: {
  className: string;
  floatDelay?: number;
  floatDuration?: number;
  rotate?: number;
}) => {
  const controls = useAnimationControls();

  React.useEffect(() => {
    controls.start({
      opacity: 0.95,
      rotate: [rotate, rotate + 1.1, rotate - 1.1, rotate],
      transition: { duration: floatDuration, delay: floatDelay, repeat: Infinity, ease: 'easeInOut' },
    });
  }, [controls, floatDelay, floatDuration, rotate]);

  return (
    <motion.div
      className={className}
      initial={false}
      animate={controls}
      drag
      dragElastic={0.14}
      dragMomentum={false}
      dragConstraints={{ left: -70, right: 70, top: -55, bottom: 55 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onDragEnd={() => {
        controls.start({
          x: 0,
          y: 0,
          transition: { type: 'spring', stiffness: 420, damping: 28 },
        });
      }}
      aria-hidden="true"
    />
  );
};

export default function LandingPage() {
  return (
    <div className="lp">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <FloatingNote className="note note--yellow" rotate={-10} floatDelay={0} />
          <FloatingNote className="note note--purple" rotate={10} floatDelay={0.2} />
          <FloatingNote className="note note--mint" rotate={-6} floatDelay={0.1} />
          <FloatingNote className="note note--blue" rotate={8} floatDelay={0.28} />
        </div>

        <div className="container hero-inner">
          <motion.div className="badge" variants={reveal} initial="hidden" animate="show" custom={0}>
            <span className="badge-ic">
              <IconSparkle />
            </span>
            <span>Calm productivity reimagined</span>
          </motion.div>

          <motion.h1 className="hero-h1" variants={reveal} initial="hidden" animate="show" custom={0.08}>
            Plan less. Do more.
          </motion.h1>

          <motion.p className="hero-sub" variants={reveal} initial="hidden" animate="show" custom={0.14}>
            Sticky notes + calendar reminders in one calm workspace.
          </motion.p>

          <motion.div className="hero-actions" variants={reveal} initial="hidden" animate="show" custom={0.18}>
            <motion.button className="btn btn-primary" whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
              <span>Get Started</span>
              <span className="btn-ic">
                <IconArrowRight />
              </span>
            </motion.button>

            <motion.button className="btn btn-secondary" whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
              <span>Live Demo</span>
              <span className="btn-ic">
                <IconCalendar />
              </span>
            </motion.button>
          </motion.div>

          <motion.div className="hero-pills" variants={reveal} initial="hidden" animate="show" custom={0.22}>
            <FeaturePill icon={<IconGrid />} text="Drag & Drop" />
            <FeaturePill icon={<IconCalendar />} text="Smart Reminders" />
            <FeaturePill icon={<IconSparkle />} text="Focus Mode" />
          </motion.div>
        </div>
      </section>

      {/* WHAT IS */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <motion.h2 className="h2" variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} custom={0}>
              What is PlanIt?
            </motion.h2>
            <motion.p className="muted" variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} custom={0.08}>
              Your thoughts, organized. Your time, respected.
            </motion.p>
          </div>

          <div className="grid-3">
            <AnimatedCard icon={<IconDoc />} title="Capture" desc="Quick-add notes with color, tags, and priority." delay={0.05} />
            <AnimatedCard icon={<IconPin />} title="Organize" desc="Drag, group, and pin your most important items." delay={0.12} />
            <AnimatedCard icon={<IconClock />} title="Remember" desc="Never miss a deadline with smart calendar reminders." delay={0.18} />
          </div>

          <div className="spacer-64" />

          <div className="section-head">
            <motion.h2 className="h2" variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} custom={0}>
              Everything you need
            </motion.h2>
            <motion.p className="muted" variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} custom={0.08}>
              Powerful features wrapped in a calm, beautiful interface.
            </motion.p>
          </div>

          <div className="grid-3 gap-20">
            <AnimatedCard icon={<IconGrid />} title="Sticky Notes Board" desc="Drag, pin, and organize colorful sticky notes in your personal canvas." delay={0.05} />
            <AnimatedCard icon={<IconCalendar />} title="Calendar Reminders" desc="Set date, time, and recurring reminders that sync with your notes." delay={0.12} />
            <AnimatedCard icon={<IconTarget />} title="Focus Mode" desc="See only today's tasks with a distraction-free, zen-like view." delay={0.18} />
            <AnimatedCard icon={<IconSearch />} title="Search & Filters" desc="Find notes instantly by priority, tags, or due dates." delay={0.05} />
            <AnimatedCard icon={<IconMoon />} title="Light & Dark Theme" desc="Toggle between calm light and soothing dark modes seamlessly." delay={0.12} />
            <AnimatedCard icon={<IconPhone />} title="Fully Responsive" desc="Perfect experience on desktop, tablet, and mobile devices." delay={0.18} />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <motion.h2 className="h2" variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} custom={0}>
              How it works
            </motion.h2>
            <motion.p className="muted" variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} custom={0.08}>
              Three simple steps to organized productivity.
            </motion.p>
          </div>

          <div className="steps-wrap">
            <div className="steps-line" />
            <div className="steps">
              <StepCard n="01" delay={0.05} icon={<span className="step-icBox step-icBox--amber">+</span>} title="Add a note" desc="Click the + button and jot down your thought, task, or idea." />
              <StepCard
                n="02"
                delay={0.12}
                elevated
                icon={
                  <span className="step-icBox step-icBox--blue">
                    <IconCalendar />
                  </span>
                }
                title="Assign a date"
                desc="Pick a due date or reminder time if you need one."
              />
              <StepCard n="03" delay={0.18} icon={<span className="step-icBox step-icBox--mint">🔔</span>} title="Get reminded" desc="PlanIt keeps track so you can focus on what matters." />
            </div>
          </div>

          {/* FOOTER */}
          <footer className="footer">
            <div className="footer-top">
              <div className="footer-brand">
                <div className="footer-logo">PlanIt</div>
                <div className="footer-tag">Calm productivity for modern life.</div>
              </div>

              <div className="footer-cols">
                <div className="footer-col">
                  <div className="footer-col-title">Product</div>
                  <a className="footer-link" href="#">Features</a>
                  <a className="footer-link" href="#">Pricing</a>
                  <a className="footer-link" href="#">Roadmap</a>
                </div>
                <div className="footer-col">
                  <div className="footer-col-title">Company</div>
                  <a className="footer-link" href="#">About</a>
                  <a className="footer-link" href="#">Blog</a>
                  <a className="footer-link" href="#">Careers</a>
                </div>
                <div className="footer-col">
                  <div className="footer-col-title">Legal</div>
                  <a className="footer-link" href="#">Privacy</a>
                  <a className="footer-link" href="#">Terms</a>
                  <a className="footer-link" href="#">Contact</a>
                </div>
              </div>
            </div>

            <div className="footer-divider" />

            <div className="footer-bottom">
              <div className="footer-made">Made with ❤️ by the PlanIt team</div>
              <div className="footer-icons">
                <a href="#" aria-label="Twitter" className="footer-ic">𝕏</a>
                <a href="#" aria-label="GitHub" className="footer-ic">⌂</a>
                <a href="#" aria-label="LinkedIn" className="footer-ic">in</a>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}
