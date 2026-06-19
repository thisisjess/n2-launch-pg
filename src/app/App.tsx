import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowUpRight, Check, Search, ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { DashboardMockup } from "./components/dashboard-mockup";
import PasswordGate from "./components/PasswordGate";
import { N2LabsLogo } from "./components/N2LabsLogo";

// Assets from imports
import svgPaths from "../imports/Mobile/svg-q236zk8bca";
import imgLogo from "../imports/Mobile/b336fb71f2d2247dadd41666e98bffac92058c9f.png";
import imgBenefit1 from "../assets/benefits/benefit-1-project-card.png";
import imgBenefit2 from "../assets/benefits/benefit-2-import-wizard.png";
import imgBenefit3 from "../assets/benefits/benefit-3-projects-overview.png";
import imgBenefit4 from "../assets/benefits/benefit-4-my-flows-idle.png";
import imgLabs from "../imports/Mobile/7df302eb8abcfc114bd55eb4551e42eb33a28ac1.png";
import imgDesignDashboard from "../assets/design/design-dashboard-full.png";

const EARLY_ACCESS_FORM_URL = "https://forms.mdmi.com/mdmiportal3271/form/N2ition/formperma/donw_JfIu5vJIW6NgEvPofnRzKFMJur1NPgSSKSypr8";

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Overview", href: "#overview" },
    { name: "Benefits", href: "#benefits" },
    { name: "Design", href: "#design" },
    { name: "n2Labs", href: "#n2labs" },
    { name: "Access", href: "#access" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e9e9e9] py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <ImageWithFallback src={imgLogo} alt="n2ition logo" className="h-10 w-10 object-contain" />
          <span className="font-['Work_Sans'] font-bold text-xl tracking-tight hidden sm:block">n2ition</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="font-['DM_Sans'] font-bold text-sm tracking-tight hover:text-[#d70321] transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a
            href={EARLY_ACCESS_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#d70321] text-white px-6 py-2.5 rounded-full font-['DM_Sans'] font-bold text-sm flex items-center gap-2 hover:bg-[#b0021b] transition-colors"
          >
            Early Access
            <ArrowUpRight size={14} />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-black" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-[#e9e9e9] p-6 md:hidden flex flex-col gap-6"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-['DM_Sans'] font-bold text-lg border-b border-[#f3f3f3] pb-2"
              >
                {link.name}
              </a>
            ))}
            <a
              href={EARLY_ACCESS_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="bg-[#d70321] text-white py-4 rounded-full font-['DM_Sans'] font-bold text-center flex items-center justify-center gap-2"
            >
              Early Access
              <ArrowUpRight size={16} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const IPhoneMockup = () => {
  return (
    <div className="relative mx-auto w-full max-w-[320px] lg:max-w-[374px]">
      <div className="aspect-[374/750] rounded-[38px] overflow-hidden relative shadow-2xl">
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#c4c4c4] to-[#5e5e5e]"
          style={{ opacity: 0.9 }}
        ></div>
      </div>
    </div>
  );
};

const LogoCloud = () => {
  const logos = [
    "NASA (SBIR PROGRAM)",
    "LOS ALAMOS NATIONAL LABRATORIES",
    "AMERICAN SOCIETY FOR METALS",
    "ROLLS-ROYCE",
    "INTELLIGENS",
    "CARRIER",
    "DATABRICKS",
    "APPLE",
    "BLUE ORIGIN",
    "L3HARRIS",
    "RIO TINTO",
  ];

  return (
    <div className="mt-32 border-t border-[#e9e9e9] pt-20 text-center">
      <h3 className="font-['Roboto_Mono'] text-sm md:text-base text-[#6f6f6f] mb-12 uppercase tracking-widest">
        Development contributions involving & validated in complex environments
      </h3>
      <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 max-w-5xl mx-auto">
        {logos.map((logo, i) => (
          <span
            key={i}
            className="font-['Roboto_Mono'] font-bold text-[10px] md:text-xs text-black/40 hover:text-black transition-colors cursor-default"
          >
            {logo}
          </span>
        ))}
      </div>
    </div>
  );
};

const Hero = () => {
  return (
    <section id="overview" className="pt-32 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-['Roboto_Mono'] text-[#d70321] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
            Engineer-Led Intelligence
          </span>
          <h1 className="font-['Work_Sans'] font-bold text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-[-0.03em] mb-8">
            Spread your knowledge, not your spreadsheets.
          </h1>
          <p className="font-['Work_Sans'] font-light text-xl md:text-2xl text-[#6f6f6f] leading-relaxed mb-12 max-w-xl">
            n2ition is an enterprise-grade platform for engineering data intelligence—built by engineers, to fit your existing tools and workflows while making engineering data easier to find, trust, and use.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center items-center"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-[#d70321] opacity-10 blur-[120px] rounded-full"></div>
          
          {/* Desktop Dashboard Preview in Background */}
          <div className="hidden lg:block absolute w-[140%] -right-1/4 scale-75 transition-all duration-700">
             <DashboardMockup />
          </div>
          
          {/* Primary Mobile Focus */}
          <div className="relative z-10">
            <IPhoneMockup />
          </div>
        </motion.div>
      </div>

      <div className="mt-32 border-t border-[#e9e9e9] pt-20">
        <span className="font-['Roboto_Mono'] text-[#d70321] text-xs font-bold tracking-[0.2em] uppercase mb-6 block">
          Our Platform Is Built On Three Core Tenets
        </span>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              num: "01",
              title: "Design for adoption, not administration.",
              desc: "Implementation-first and modular—fitting into to your real workflows so engineers stay in the work, not in admin overhead.",
            },
            {
              num: "02",
              title: "Keep context with the work.",
              desc: "Decisions stay explainable as knowledge moves across teams and tools, amplifying your IP’s utility, reach, and value.",
            },
            {
              num: "03",
              title: "Make knowledge provable.",
              desc: "Build a culture of verifiable proof where decisions are backed by auditable truth, not “trust me” data and institutional folklore.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col gap-8"
            >
              <span className="font-['Roboto_Mono'] text-[#d70321] text-7xl md:text-8xl font-normal tracking-tighter opacity-80 leading-none">
                {item.num}
              </span>
              <div className="flex flex-col gap-4">
                <h1 className="font-['Work_Sans'] font-bold text-2xl md:text-3xl leading-[0.9] tracking-[-0.03em]">
                  {item.title}
                </h1>
                <p className="font-['Work_Sans'] font-light text-xl text-[#6f6f6f] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <LogoCloud />
    </section>
  );
};

const Benefits = () => {
  const benefits = [
    {
      img: imgBenefit1,
      alt: "n2uition project card with domain chips, dataset and job counts, collaborator avatars, and last-updated affordance",
      objectPosition: "center center",
      title: "Governed trust by design",
      desc: "Knowledge isn’t useful if it can’t be trusted. n2uition captures engineer context so every result is explainable, audit-ready, and decision-ready across teams and tools.",
    },
    {
      img: imgBenefit2,
      alt: "Import flow wizard drag-and-drop upload zone with choose file button",
      objectPosition: "center center",
      title: "Adoption in the flow of work",
      desc: "Implementation-first by design. Templates, forms, and connectors map to real workflows and handoffs so engineers capture once and reuse everywhere.",
    },
    {
      img: imgBenefit3,
      alt: "n2uition projects grid with n2 demo red-accent cards showing domains, datasets, jobs, and collaborators",
      objectPosition: "center top",
      title: "Ecosystem fit, not a silo",
      desc: "n2uition is an independent front end that’s model- and platform-agnostic. Use stand alone or as a pre-processor.",
    },
    {
      img: imgBenefit4,
      alt: "n2flow All flows table with progress bars, status chips, and idle-day indicators in n2 demo theme",
      objectPosition: "left top",
      title: "Clarity, speed, and security",
      desc: "Built for complex, regulated environments without requiring teams to become software experts.",
    },
  ];

  return (
    <section id="benefits" className="py-32 px-6 bg-[#fcfcfc] border-y border-[#e9e9e9]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <span className="font-['Roboto_Mono'] text-[#d70321] text-xs font-bold tracking-[0.2em] uppercase mb-6 block">
            Benefits
          </span>
          <h1 className="font-['Work_Sans'] font-bold text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-[-0.03em] max-w-4xl mb-8">
            For teams whose system is too big to change, or too small to trust.
          </h1>
          <p className="font-['Work_Sans'] font-normal text-2xl md:text-3xl text-black/80 max-w-4xl leading-snug">
            Turn scattered technical data, supply context, and hard-won know-how into governed, reusable, model-ready knowledge so teams move faster without sacrificing rigor.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-white p-2 rounded-2xl shadow-sm border border-black/5"
            >
              <div className="aspect-[1.4] overflow-hidden rounded-xl mb-6 bg-gray-50">
                <ImageWithFallback
                  src={benefit.img}
                  alt={benefit.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  style={{ objectPosition: benefit.objectPosition }}
                />
              </div>
              <div className="px-4 pb-6">
                <h1 className="font-['Work_Sans'] font-bold text-xl leading-[0.9] tracking-[-0.03em] mb-3">{benefit.title}</h1>
                <p className="font-['Work_Sans'] font-light text-base text-[#6f6f6f] leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DesignShowcase = () => {
  const steps = [
    { num: "01", text: "Implementation ready workflows: easy user controls and import templates come standard." },
    { num: "02", text: "Context-first: units, methods, and assumptions travel with the data." },
    { num: "03", text: "Governed by default: approvals and lineage are built in, not bolted on later." },
    { num: "04", text: "Modular & composable: start small, expand without replatforming." },
    { num: "05", text: "Clarity over clutter: surface what’s trusted and what’s being used." },
  ];

  const designSteps = (
    <>
      <div className="space-y-4 mb-12">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-6 items-start py-5 border-t border-[#e9e9e9]">
            <span className="font-['Work_Sans'] font-bold text-xl text-[#d70321]">{step.num}</span>
            <p className="font-['Work_Sans'] font-normal text-2xl text-[#3d3936] leading-snug">
              {step.text}
            </p>
          </div>
        ))}
      </div>
      <a
        href="#access"
        className="inline-flex bg-[#d70321] text-white px-10 py-5 rounded-full font-['DM_Sans'] font-bold text-lg hover:bg-[#b0021b] transition-all transform hover:scale-105"
      >
        Get Access
      </a>
    </>
  );

  return (
    <section id="design" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 lg:items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 flex flex-col"
          >
            <span className="font-['Roboto_Mono'] text-[#d70321] text-xs font-bold tracking-[0.2em] uppercase mb-6 block">
              Design
            </span>
            <h1 className="font-['Work_Sans'] font-bold text-5xl md:text-7xl lg:text-5xl xl:text-6xl leading-[0.9] tracking-[-0.03em] mb-8">
              Less platform. More progress.
            </h1>
            <p className="font-['Work_Sans'] font-light text-xl md:text-2xl text-[#6f6f6f] leading-relaxed mb-10">
              You shouldn’t need a specialist admin crew to keep knowledge usable, and shouldn’t have to knock on the closed door of the hermit Hazards Officer at the end of the hallway to ask him to share his handwritten lab results either. Neither of you want that. n2uition is modular and workflow-led, so teams can start small, get value quickly, and scale without the overhead.
            </p>
            <div className="hidden lg:block">{designSteps}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:h-full min-h-0"
          >
            <div className="rounded-2xl shadow-2xl border border-[#e9e9e9] overflow-hidden bg-white w-full aspect-[4/3] lg:aspect-auto lg:h-full min-h-0">
              <ImageWithFallback
                src={imgDesignDashboard}
                alt="n2ition platform dashboard with N²ITION branding, sidebar navigation, and Ingest, Organize, Discover, and Share phase metric cards"
                className="w-full h-full object-cover object-left-top block"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:hidden order-3 col-span-1"
          >
            {designSteps}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const LabsSection = () => {
  return (
    <section id="n2labs" className="py-32 px-6 bg-[#f9f9f9] border-t border-[#e9e9e9]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-8">
              <N2LabsLogo size="md" variant="light" />
            </div>
            <h1 className="font-['Work_Sans'] font-bold text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-[-0.03em] mb-10">
              Built by engineers. Grounded in operations. Designed to last.
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-['Work_Sans'] font-light text-xl text-[#6f6f6f] space-y-8 leading-relaxed"
          >
            <p>
              n2uition is built by a team with decades of engineering and operating experience, who’ve had to make data trustworthy in the real world, not just in a slide deck. We’ve built systems that survive reorganizations, retirements, and the Rube Goldberg workarounds that arise within many firms.
            </p>
            <p>
              We’ve paired that practical rigor with a modern, modular architecture so teams can start where they are, integrate what they already run, and expand without replatforming.
            </p>
            <p>
              And because engineering knowledge is an asset—not a hostage situation—we design with data portability, security, and sovereignty in mind. Your data, your control, your rules, across the environments you actually have to support.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-stretch">
          <div className="lg:col-span-2 relative rounded-[32px] overflow-hidden min-h-[400px] bg-[#231f20]">
            <ImageWithFallback
              src={imgLabs}
              alt="n2Labs team collaborating in the lab"
              className="w-full h-full min-h-[400px] object-cover grayscale contrast-[1.05]"
            />
            <div
              className="absolute bottom-6 left-6 pointer-events-none"
              aria-hidden="true"
            >
              <N2LabsLogo size="sm" variant="dark" />
            </div>
          </div>
          <div className="flex flex-col gap-1 border-l border-[#e9e9e9] pl-10 py-10">
            {[
              { title: "Engineer-led product + implementations", desc: "Built with real workflows and live integrations in mind." },
              { title: "Materials Data Management domain depth", desc: "Industry realities are designed into data reuse, across toolchains" },
              { title: "Agile design partner + product mindset", desc: "We co-create with teams who care about adoption, not shelfware." },
            ].map((stat, i) => (
              <div key={i} className="mb-10 last:mb-0">
                <h1 className="font-['Work_Sans'] font-bold text-2xl mb-3 leading-[0.9] tracking-[-0.03em]">{stat.title}</h1>
                <p className="font-['Work_Sans'] font-light text-xl text-[#6f6f6f]">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const AccessSection = () => {
  const tableData = [
    { title: "Get early access", items: ["Quarterly roadmap previews", "Prototype feedback sessions", "Monthly n2Labs office hours"] },
    { title: "Accelerate your adoption", items: ["Data Readiness scorecard", "Governance gap analysis", "Priority demo scheduling"] },
    { title: "Priority onboarding", items: ["Concierge configuration help", "Reference standards pack", "Schema starter templates"] },
  ];

  return (
    <section id="access" className="py-32 px-6 bg-black text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-14"
        >
          <N2LabsLogo size="lg" />
        </motion.div>

        <h1 className="font-['Work_Sans'] font-bold text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-[-0.03em] mb-20 max-w-5xl mx-auto">
          Apply for access and help us design the future of data intelligence
        </h1>

        <div className="grid md:grid-cols-3 gap-6 mb-24">
          {tableData.map((col, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-10 text-left flex flex-col"
            >
              <h4 className="font-['Roboto_Mono'] font-bold text-[#d70321] text-sm uppercase tracking-widest mb-10 pb-6 border-b border-white/10">
                {col.title}
              </h4>
              <ul className="space-y-6 flex-grow">
                {col.items.map((item, j) => (
                  <li key={j} className="flex gap-3 items-start font-['Roboto_Mono'] text-sm text-white/70">
                    <Check size={16} className="text-[#d70321] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div id="sign-up" className="max-w-xl mx-auto text-center">
          <a
            href={EARLY_ACCESS_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#d70321] text-white px-12 py-6 rounded-full font-['DM_Sans'] font-bold text-xl hover:bg-[#b0021b] transition-all transform hover:scale-[1.02]"
          >
            Apply for Early Access to n2labs
            <ExternalLink size={14} className="opacity-70" />
          </a>
          <p className="font-['Roboto_Mono'] text-sm text-white/60 tracking-tight leading-relaxed mt-6 max-w-md mx-auto">
            This will open our early access form in a new tab.
          </p>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#d70321] blur-[150px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#d70321] blur-[150px] rounded-full"></div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-20 px-6 border-t border-[#e9e9e9]">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <ImageWithFallback src={imgLogo} alt="n2ition logo" className="h-10 w-10 object-contain grayscale opacity-50" />
              <span className="font-['Work_Sans'] font-bold text-2xl tracking-tight opacity-50">n2ition</span>
            </div>
            <p className="font-['Work_Sans'] font-light text-lg text-[#6f6f6f] max-w-sm">
              The enterprise platform for engineering data intelligence. Grounded in reality.
            </p>
          </div>
          
          <div>
            <h5 className="font-['DM_Sans'] font-bold text-sm uppercase tracking-widest mb-8">Product</h5>
            <ul className="space-y-4 font-['Work_Sans'] text-[#6f6f6f]">
              <li><a href="#" className="hover:text-black transition-colors">Overview</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Roadmap</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-['DM_Sans'] font-bold text-sm uppercase tracking-widest mb-8">Resources</h5>
            <ul className="space-y-4 font-['Work_Sans'] text-[#6f6f6f]">
              <li><a href="#" className="hover:text-black transition-colors">MDMi</a></li>
              <li><a href="#" className="hover:text-black transition-colors">n2Labs</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-[#f3f3f3] flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 font-['Roboto_Mono'] text-xs text-[#485c11]">
            <span>MDMi</span>
            <span>2026</span>
            <span>All Rights Reserved</span>
          </div>
          <div className="flex gap-8 font-['DM_Sans'] font-bold text-sm">
            <a href="https://mdmi.com/" target="_blank" className="underline underline-offset-4">MDMi</a>
            <a href="mailto:contact@n2ition.com" className="hover:text-[#d70321] transition-colors">Contact us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  return (
    <PasswordGate>
      <div className="bg-white min-h-screen selection:bg-[#d70321] selection:text-white">
        <Navbar />
        <main>
          <Hero />
          <Benefits />
          <DesignShowcase />
          <LabsSection />
          <AccessSection />
        </main>
        <Footer />
      </div>
    </PasswordGate>
  );
}
