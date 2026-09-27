import { Link, useNavigate } from "@tanstack/react-router";
import {
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  ArrowRight,
  ArrowUpRight,
  ReceiptText,
  ChartPie,
  Sparkles,
  GraduationCap,
  Target,
  Repeat2,
  ChartNoAxesCombined,
  ShieldCheck,
  Smartphone,
  UserPlus,
  Wallet,
  Mail,
  LockKeyhole,
  UserRound,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Tags,
  Lightbulb,
  Bookmark,
  Bell,
  Settings,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {
  Brand,
  PublicHeader,
  PublicFooter,
  SecureNote,
} from "./shared";

import { notice } from "./alerts";
import { authService, type AuthUser } from "@/services/authService";

import carousel1 from "@/assets/campus/visuals/carousel-1.png";
import carousel2 from "@/assets/campus/visuals/carousel-2.png";
import carousel3 from "@/assets/campus/visuals/carousel-3.png";
import carousel4 from "@/assets/campus/visuals/carousel-4.png";
import carousel5 from "@/assets/campus/visuals/carousel-5.png";
import carousel6 from "@/assets/campus/visuals/carousel-6.png";
import campusStudyVideo from "@/assets/campus/visuals/campus-study.mp4";
import bgHome from "@/assets/campus/visuals/bg-home.png";
import bgFeatures from "@/assets/campus/visuals/bg-features.png";
import bgHowItWorks from "@/assets/campus/visuals/bg-how-it-works.png";
import authLoginImage from "@/assets/campus/visuals/auth-login.png";
import authSignupImage from "@/assets/campus/visuals/auth-signup.png";

/* Public feature content */

const features = [
  {
    title: "Track Expenses",
    desc: "Know exactly where your money goes, without the guesswork.",
    icon: ReceiptText,
    tone: "bg-sage text-primary",
  },
  {
    title: "Budget Management",
    desc: "Give every dollar a purpose and stay on track with ease.",
    icon: ChartPie,
    tone: "bg-peach text-warning",
  },
  {
    title: "AI Insights",
    desc: "Thoughtful money tips tailored to your student life.",
    icon: Sparkles,
    tone: "bg-violet-soft text-foreground",
  },
  {
    title: "Saving Goals",
    desc: "Turn your next big thing into a real, reachable plan.",
    icon: Target,
    tone: "bg-orange-soft text-warning",
  },
  {
    title: "Recurring Transactions",
    desc: "Keep regular spending neatly accounted for.",
    icon: Repeat2,
    tone: "bg-blue-soft text-foreground",
  },
  {
    title: "Smart Reports",
    desc: "See the bigger picture behind your spending habits.",
    icon: ChartNoAxesCombined,
    tone: "bg-sage text-primary",
  },
  {
    title: "Secure & Private",
    desc: "A space for your finances that puts you first.",
    icon: ShieldCheck,
    tone: "bg-peach text-warning",
  },
  {
    title: "Works Everywhere",
    desc: "Your money picture, wherever student life takes you.",
    icon: Smartphone,
    tone: "bg-blue-soft text-foreground",
  },
];

const studentWorkspace = [
  {
    title: "Dashboard",
    desc: "See your monthly money overview and recent activity.",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Expenses",
    desc: "Add, edit and review your expense transactions.",
    to: "/transactions",
    icon: ReceiptText,
  },
  {
    title: "Income",
    desc: "Track allowances, jobs, scholarships and other income.",
    to: "/income",
    icon: Wallet,
  },
  {
    title: "Categories",
    desc: "Manage your personal income and expense categories.",
    to: "/categories",
    icon: Tags,
  },
  {
    title: "Budgets",
    desc: "Set monthly category limits and monitor your progress.",
    to: "/budgets",
    icon: ChartPie,
  },
  {
    title: "Savings Goals",
    desc: "Create goals and track progress toward what matters to you.",
    to: "/goals",
    icon: Target,
  },
  {
    title: "Reports",
    desc: "Review spending summaries, trends and comparisons.",
    to: "/reports",
    icon: ChartNoAxesCombined,
  },
  {
    title: "AI Insights",
    desc: "Review optional monthly insights and spending patterns.",
    to: "/insights",
    icon: Sparkles,
  },
  {
    title: "Saving Tips",
    desc: "Use personalized tips based on your financial activity.",
    to: "/tips",
    icon: Lightbulb,
  },
  {
    title: "Saved Items",
    desc: "Return to tips and insights you bookmarked earlier.",
    to: "/bookmarks",
    icon: Bookmark,
  },
  {
    title: "CSV Import",
    desc: "Import historical transactions from a supported CSV file.",
    to: "/import",
    icon: Upload,
  },
  {
    title: "Notifications",
    desc: "Check budget alerts and important account updates.",
    to: "/notifications",
    icon: Bell,
  },
  {
    title: "Profile",
    desc: "Update your student profile and financial preferences.",
    to: "/profile",
    icon: UserRound,
  },
  {
    title: "Settings",
    desc: "Adjust your Campus Coin workspace preferences.",
    to: "/settings",
    icon: Settings,
  },
] as const;

const heroSlides = [
 {
  image: carousel1,
  video: campusStudyVideo,
  eyebrow: "Student money, made calmer",
  title: "Build better habits without making money feel heavy.",
},
  {
    image: carousel2,
    eyebrow: "Small choices, stronger futures",
    title: "See where your money goes and make every rupee more intentional.",
  },
  {
    image: carousel3,
    eyebrow: "Made for real student life",
    title: "Plan around classes, goals, routines and the moments in between.",
  },
  {
    image: carousel4,
    eyebrow: "Clarity over pressure",
    title: "Turn everyday spending into a clearer monthly picture.",
  },
  {
    image: carousel5,
    eyebrow: "Budget with confidence",
    title: "Keep progress visible while still enjoying student life.",
  },
  {
    image: carousel6,
    eyebrow: "Your future compounds here",
    title: "Create a money routine that can grow with you.",
  },
] as const;

/* Home page */

export function HomePage() {
  const [
    student,
    setStudent,
  ] =
    useState<AuthUser | null>(
      null,
    );

  const [
    slide,
    setSlide,
  ] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadStudentSession() {
      try {
        const response =
          await authService.me();

        const currentUser =
          response.data.user;

        if (
          active &&
          currentUser.role ===
            "student"
        ) {
          setStudent(
            currentUser,
          );
        }
      } catch {
        if (active) {
          setStudent(null);
        }
      }
    }

    void loadStudentSession();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const timer =
      window.setInterval(
        () => {
          setSlide(
            (current) =>
              (current + 1) %
              heroSlides.length,
          );
        },
        6500,
      );

    return () =>
      window.clearInterval(
        timer,
      );
  }, []);

  function moveSlide(
    direction: -1 | 1,
  ) {
    setSlide(
      (current) =>
        (current +
          direction +
          heroSlides.length) %
        heroSlides.length,
    );
  }

  const activeSlide =
    heroSlides[slide] ??
    heroSlides[0];

  const previousSlide =
    heroSlides[
      (slide -
        1 +
        heroSlides.length) %
        heroSlides.length
    ] ?? heroSlides[0];

  const nextSlide =
    heroSlides[
      (slide + 1) %
        heroSlides.length
    ] ?? heroSlides[0];

  return (
    <>
      <PublicHeader />

      <main>
        {/* Hero section */}

        <section className="public-hero">
          <img
            src={bgHome}
            alt=""
            aria-hidden="true"
            className="public-hero-backdrop"
          />

          <div className="public-hero-vignette" />

          <div className="public-hero-orb public-hero-orb-one" />
          <div className="public-hero-orb public-hero-orb-two" />

          <div className="page-shell public-hero-grid">
            <div className="public-hero-copy relative z-10 py-6 lg:py-10">
              <div className="section-kicker">
                <Sparkles
                  size={14}
                />
                A brighter tomorrow
              </div>

              <h1 className="section-title public-hero-title mt-6">
                Smarter Money
                <br />
                for a{" "}
                <em>
                  Brighter You
                </em>
              </h1>

              <p className="section-text mt-6 max-w-[610px]">
                Track expenses.
                Set realistic
                budgets. Understand
                your habits and build
                a money routine made
                for student life.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="premium-btn h-12 px-7"
                >
                  <Link
                    to={
                      student
                        ? "/dashboard"
                        : "/register"
                    }
                  >
                    {student
                      ? "Open Dashboard"
                      : "Get Started Free"}

                    <ArrowRight
                      size={18}
                    />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="outline-btn h-12 px-7"
                >
                  <Link to="/features">
                    Explore Features

                    <ArrowUpRight
                      size={18}
                    />
                  </Link>
                </Button>
              </div>

              <div className="public-proof-row mt-8">
                {[
                  "Expense tracking",
                  "Budget alerts",
                  "Smart reports",
                  "Saving tips",
                ].map(
                  (item) => (
                    <span
                      key={
                        item
                      }
                      className="public-proof-chip"
                    >
                      <span className="size-1.5 rounded-full bg-primary" />
                      {item}
                    </span>
                  ),
                )}
              </div>
            </div>

            <div className="public-carousel-stage">

              <div className="public-carousel-side public-carousel-side-left">
                <img
                  src={
                    previousSlide.image
                  }
                  alt=""
                  aria-hidden="true"
                />
              </div>

              <article className="public-carousel-main">
               {"video" in activeSlide && activeSlide.video ? (
  <video
    key={slide}
    src={activeSlide.video}
    poster={activeSlide.image}
    autoPlay
    muted
    playsInline
    className="h-full w-full object-cover"
  />
) : (
  <img
    src={activeSlide.image}
    alt="Students building better money habits on campus"
  />
)}

                <div className="public-carousel-overlay">
                  <div>
                    <p>
                      {
                        activeSlide.eyebrow
                      }
                    </p>

                    <h2>
                      {
                        activeSlide.title
                      }
                    </h2>
                  </div>

                  <span className="public-carousel-count">
                    0
                    {slide + 1}
                    {" / "}0
                    {
                      heroSlides.length
                    }
                  </span>
                </div>
              </article>

              <div className="public-carousel-side public-carousel-side-right">
                <img
                  src={
                    nextSlide.image
                  }
                  alt=""
                  aria-hidden="true"
                />
              </div>

              <div className="public-carousel-controls">
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={() =>
                    moveSlide(-1)
                  }
                  className="public-carousel-arrow"
                >
                  <ChevronLeft
                    size={22}
                  />
                </button>

                <div className="flex items-center gap-2">
                  {heroSlides.map(
                    (
                      _item,
                      index,
                    ) => (
                      <button
                        key={
                          index
                        }
                        type="button"
                        aria-label={`Show image ${index + 1}`}
                        onClick={() =>
                          setSlide(
                            index,
                          )
                        }
                        className={cn(
                          "public-carousel-dot",
                          index ===
                            slide &&
                            "is-active",
                        )}
                      />
                    ),
                  )}
                </div>

                <button
                  type="button"
                  aria-label="Next image"
                  onClick={() =>
                    moveSlide(1)
                  }
                  className="public-carousel-arrow"
                >
                  <ChevronRight
                    size={22}
                  />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Key benefits strip */}

        <section className="public-value-strip">
          <div className="page-shell public-value-strip-inner">
            <span className="public-value-label">
              Built around
              real student
              routines
            </span>

            {[
              "Simple tracking",
              "Flexible budgets",
              "Clear reports",
              "Private workspace",
              "Mobile friendly",
            ].map(
              (item) => (
                <span
                  key={item}
                  className="public-value-word"
                >
                  {item}
                </span>
              ),
            )}
          </div>
        </section>

        {/* Feature highlights */}

        <section className="public-ribbon-section">
          <div className="page-shell py-7 md:py-9">
            <div className="public-feature-ribbon">
            {[
              {
                title:
                  "Track Expenses",
                desc:
                  "See where your money goes",
                icon:
                  ReceiptText,
                tone:
                  "bg-sage text-primary",
              },
              {
                title:
                  "Set Budgets",
                desc:
                  "Stay on track, effortlessly",
                icon:
                  Target,
                tone:
                  "bg-peach text-destructive",
              },
              {
                title:
                  "AI Insights",
                desc:
                  "Review personalized patterns",
                icon:
                  Sparkles,
                tone:
                  "bg-violet-soft text-primary",
              },
              {
                title:
                  "Student Focused",
                desc:
                  "Built for your unique journey",
                icon:
                  GraduationCap,
                tone:
                  "bg-orange-soft text-warning",
              },
            ].map(
              (feature) => (
                <div
                  key={
                    feature.title
                  }
                  className="public-feature-ribbon-card"
                >
                  <span
                    className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${feature.tone}`}
                  >
                    <feature.icon
                      size={20}
                    />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">
                      {
                        feature.title
                      }
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {
                        feature.desc
                      }
                    </p>
                  </div>

                  <ArrowRight
                    size={16}
                    className="text-muted-foreground"
                  />
                </div>
              ),
            )}
            </div>
          </div>
        </section>

        {/* Dashboard preview */}

        <section
          id="dashboard-preview"
          className="public-dashboard-showcase"
        >
          <div className="public-dashboard-orb public-dashboard-orb-one" />
          <div className="public-dashboard-orb public-dashboard-orb-two" />

          <div className="page-shell">
            <div className="public-dashboard-heading-grid">
              <div>
                <div className="section-kicker">
                  <LayoutDashboard size={14} />
                  Your financial cockpit
                </div>

                <h2 className="section-title mt-4">
                  Everything important,
                  <br />
                  <em>in one beautiful view.</em>
                </h2>
              </div>

              <div className="public-dashboard-intro">
                <p className="section-text">
                  Balance, budgets, goals, recent activity and smart insights
                  stay connected in one calm workspace — so the dashboard feels
                  useful, not overwhelming.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    "Live balance",
                    "Budget progress",
                    "Recent activity",
                    "Smart insights",
                  ].map((item) => (
                    <span
                      key={item}
                      className="public-mini-chip"
                    >
                      <span className="size-1.5 rounded-full bg-primary" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="public-dashboard-layout mt-9">
              <div className="public-dashboard-copy-panel">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                    Designed for clarity
                  </p>

                  <h3 className="mt-4 text-2xl font-bold md:text-3xl">
                    See the full picture without digging through menus.
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    The public preview mirrors the real student workspace:
                    quick actions, money summaries, goal progress, spending
                    patterns and useful insights all live together.
                  </p>
                </div>

                <div className="public-dashboard-benefits">
                  {[
                    {
                      icon: Wallet,
                      title: "Balance at a glance",
                      text: "Know what came in, what went out and what remains.",
                    },
                    {
                      icon: Target,
                      title: "Budgets that stay visible",
                      text: "Category limits and goal progress never disappear.",
                    },
                    {
                      icon: ChartNoAxesCombined,
                      title: "Reports with context",
                      text: "Turn transactions into patterns you can understand.",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="public-dashboard-benefit"
                    >
                      <span className="public-dashboard-benefit-icon">
                        <item.icon size={18} />
                      </span>

                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  asChild
                  className="premium-btn mt-7 h-12 w-fit px-7"
                >
                  <Link
                    to={
                      student
                        ? "/dashboard"
                        : "/features"
                    }
                  >
                    {student
                      ? "Open Your Dashboard"
                      : "Explore the Experience"}

                    <ArrowRight size={18} />
                  </Link>
                </Button>
              </div>

              <div className="public-dashboard-stage">
                <div className="public-dashboard-browser">
                  <div className="public-dashboard-browser-topbar">
                    <div className="flex items-center gap-2">
                      <span className="public-window-dot" />
                      <span className="public-window-dot" />
                      <span className="public-window-dot" />
                    </div>

                    <div className="public-dashboard-url">
                      campuscoin / dashboard
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="size-7 rounded-full border border-border bg-card" />
                      <span className="size-7 rounded-full bg-sage" />
                    </div>
                  </div>

                  <div className="public-dashboard-app">
                    <aside className="public-dashboard-sidebar">
                      <Brand compact />

                      <div className="mt-6 space-y-1">
                        {[
                          "Dashboard",
                          "Expenses",
                          "Budgets",
                          "Goals",
                          "Insights",
                          "Reports",
                        ].map((item, index) => (
                          <div
                            key={item}
                            className={cn(
                              "public-dashboard-nav-item",
                              index === 0 && "is-active",
                            )}
                          >
                            <span className="size-2 rounded-full bg-current opacity-60" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </aside>

                    <div className="public-dashboard-canvas">
                      <div className="public-dashboard-welcome">
                        <div>
                          <p className="font-display text-2xl">
                            Good morning, Alex 👋
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Here’s your financial overview for this month.
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="public-icon-bubble">
                            <Bell size={15} />
                          </span>
                          <span className="size-9 rounded-full bg-sage" />
                        </div>
                      </div>

                      <div className="public-dashboard-kpis">
                        <div className="public-kpi-card public-kpi-balance">
                          <p className="text-xs text-muted-foreground">
                            Total Balance
                          </p>

                          <strong className="mt-2 block text-3xl">
                            $1,240.50
                          </strong>

                          <span className="metric-pill mt-4">
                            ↑ 12% this month
                          </span>
                        </div>

                        <div className="public-kpi-card">
                          <p className="text-xs text-muted-foreground">
                            Income
                          </p>
                          <strong className="mt-2 block text-xl text-success">
                            $2,080
                          </strong>
                          <div className="public-mini-bars mt-4">
                            {[36, 54, 42, 68, 82, 70, 92].map(
                              (height, index) => (
                                <span
                                  key={index}
                                  style={{ height: `${height}%` }}
                                />
                              ),
                            )}
                          </div>
                        </div>

                        <div className="public-kpi-card">
                          <p className="text-xs text-muted-foreground">
                            Spending
                          </p>
                          <strong className="mt-2 block text-xl text-destructive">
                            $840
                          </strong>
                          <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                            <div className="h-full w-[58%] rounded-full bg-chart-2" />
                          </div>
                          <p className="mt-2 text-[10px] text-muted-foreground">
                            58% of monthly budget
                          </p>
                        </div>
                      </div>

                      <div className="public-dashboard-main-grid">
                        <div className="public-dashboard-chart-card">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-bold">
                                Cash Flow
                              </p>
                              <p className="mt-1 text-[11px] text-muted-foreground">
                                Income vs expense
                              </p>
                            </div>

                            <span className="public-chart-badge">
                              This month
                            </span>
                          </div>

                          <div className="public-bar-chart">
                            {[46, 62, 54, 78, 67, 88, 76, 96].map(
                              (height, index) => (
                                <div
                                  key={index}
                                  className="public-bar-column"
                                >
                                  <span
                                    className="public-bar-income"
                                    style={{ height: `${height}%` }}
                                  />
                                  <span
                                    className="public-bar-expense"
                                    style={{
                                      height: `${Math.max(24, height - 24)}%`,
                                    }}
                                  />
                                </div>
                              ),
                            )}
                          </div>
                        </div>

                        <div className="public-dashboard-spend-card">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-bold">
                                Monthly Spending
                              </p>
                              <p className="mt-1 text-[11px] text-muted-foreground">
                                Category breakdown
                              </p>
                            </div>

                            <ChartPie
                              size={17}
                              className="text-primary"
                            />
                          </div>

                          <div className="mt-5 flex items-center gap-5">
                            <div
                              className="grid size-28 shrink-0 place-items-center rounded-full"
                              style={{
                                background:
                                  "conic-gradient(var(--chart-1) 0 34%, var(--chart-2) 34% 58%, var(--chart-3) 58% 77%, var(--chart-4) 77% 100%)",
                              }}
                            >
                              <div className="grid size-16 place-items-center rounded-full bg-card text-center shadow-sm">
                                <div>
                                  <strong className="block text-sm">
                                    $632
                                  </strong>
                                  <span className="text-[9px] text-muted-foreground">
                                    this month
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="min-w-0 flex-1 space-y-2 text-[11px]">
                              {[
                                ["Food", "$210", "bg-chart-1"],
                                ["Transport", "$96", "bg-chart-2"],
                                ["Shopping", "$142", "bg-chart-3"],
                                ["Other", "$184", "bg-chart-4"],
                              ].map(([label, value, tone]) => (
                                <div
                                  key={label}
                                  className="flex items-center justify-between gap-3"
                                >
                                  <span className="flex items-center gap-2 text-muted-foreground">
                                    <span className={`size-2 rounded-full ${tone}`} />
                                    {label}
                                  </span>
                                  <strong className="text-foreground">
                                    {value}
                                  </strong>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="public-dashboard-lower-grid">
                        <div className="public-insight-card">
                          <span className="flex size-10 items-center justify-center rounded-2xl bg-violet-soft text-primary">
                            <Sparkles size={18} />
                          </span>

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold">
                              Smart Insight
                            </p>
                            <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                              Dining spend is trending lower than last month.
                              Keep the habit going.
                            </p>
                          </div>

                          <ArrowRight
                            size={15}
                            className="text-muted-foreground"
                          />
                        </div>

                        <div className="public-goal-card">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Savings Goal
                              </p>
                              <strong className="mt-1 block text-sm">
                                $1,200 / $2,000
                              </strong>
                            </div>

                            <Target
                              size={17}
                              className="text-primary"
                            />
                          </div>

                          <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                            <div className="h-full w-3/5 rounded-full bg-primary" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="public-floating-alert">
                  <span className="flex size-9 items-center justify-center rounded-2xl bg-peach text-destructive">
                    <Bell size={17} />
                  </span>

                  <div>
                    <p className="text-xs font-bold">
                      Budget check
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Food is close to its monthly limit.
                    </p>
                  </div>
                </div>

                <div className="public-floating-goal">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    Goal progress
                  </span>
                  <strong className="mt-1 block text-xl">
                    68%
                  </strong>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-2/3 rounded-full bg-primary" />
                  </div>
                </div>
              </div>
            </div>

            <div className="public-experience-strip">
              {[
                {
                  icon: ReceiptText,
                  title: "Everyday spending",
                  text: "Simple records that stay easy to review.",
                },
                {
                  icon: Target,
                  title: "Goals that stay visible",
                  text: "Progress is never hidden in another screen.",
                },
                {
                  icon: Sparkles,
                  title: "Helpful insights",
                  text: "Small patterns are surfaced when they matter.",
                },
                {
                  icon: ShieldCheck,
                  title: "Private by design",
                  text: "Student and admin spaces stay separated.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="public-experience-item"
                >
                  <span className="public-experience-icon">
                    <item.icon size={18} />
                  </span>

                  <div>
                    <p className="text-sm font-bold">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Signed-in student workspace */}

        {student && (
          <section className="public-workspace-section">
            <div className="page-shell public-workspace-inner py-14 md:py-16">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                    Your Workspace
                  </p>

                  <h2 className="section-title mt-3 text-4xl md:text-5xl">
                    Welcome back,{" "}
                    <em>
                      {
                        student.name.split(
                          " ",
                        )[0]
                      }
                    </em>
                    .
                  </h2>

                  <p className="section-text mt-3 max-w-2xl text-base">
                    You’re signed in.
                    Open any student
                    tool directly from
                    here.
                  </p>
                </div>

                <Button
                  asChild
                  className="premium-btn h-11 px-6"
                >
                  <Link to="/dashboard">
                    Open Dashboard
                    <ArrowRight
                      size={17}
                    />
                  </Link>
                </Button>
              </div>

              <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {studentWorkspace.map(
                  (item) => (
                    <Link
                      key={
                        item.to
                      }
                      to={
                        item.to
                      }
                      className="surface-card group p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-lift)]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span className="flex size-10 items-center justify-center rounded-2xl bg-sage text-primary">
                          <item.icon
                            size={
                              19
                            }
                          />
                        </span>

                        <ArrowUpRight
                          size={17}
                          className="text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                        />
                      </div>

                      <h3 className="mt-5 font-bold">
                        {
                          item.title
                        }
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {
                          item.desc
                        }
                      </p>
                    </Link>
                  ),
                )}
              </div>
            </div>
          </section>
        )}

        {/* Student tools */}

        <section
          id="student-tools"
          className="public-tools-section"
        >
          <div className="page-shell">
            <div className="public-tools-heading">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  Real solutions for student life
                </p>

                <h2 className="section-title mt-4 text-4xl md:text-5xl">
                  Tools that make money
                  <br />
                  feel <em>simpler.</em>
                </h2>
              </div>

              <div className="max-w-xl rounded-[24px] border border-border bg-card/80 p-5 shadow-[var(--shadow-soft)] backdrop-blur-xl">
                <p className="section-text text-base">
                  Track what matters, understand the pattern, then make the next
                  decision with more confidence. Everything stays connected without
                  making the page feel crowded.
                </p>

                <div className="mt-5 grid grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-secondary/35">
                  {[
                    ["01", "Track"],
                    ["02", "Understand"],
                    ["03", "Improve"],
                  ].map(([number, label]) => (
                    <div key={number} className="px-4 py-3">
                      <strong className="block text-sm text-primary">{number}</strong>
                      <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-9 grid gap-6 lg:grid-cols-[1.14fr_.86fr]">
              <article className="rounded-[30px] border border-border bg-card/90 p-6 shadow-[var(--shadow-card)] backdrop-blur-xl md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-2xl">
                    <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-sage text-primary">
                      <ReceiptText size={20} />
                    </span>

                    <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.13em] text-primary">
                      Everyday money
                    </p>

                    <h3 className="mt-2 text-2xl font-bold tracking-tight md:text-[28px]">
                      Track spending without turning it into bookkeeping.
                    </h3>

                    <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                      A clean view of recent activity keeps the important numbers
                      visible while the detail stays easy to scan.
                    </p>
                  </div>

                  <span className="rounded-full border border-border bg-secondary/45 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                    Live overview
                  </span>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  {[
                    ["12", "Entries"],
                    ["$632", "Spent"],
                    ["3", "Categories"],
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-2xl border border-border bg-secondary/30 px-4 py-4">
                      <strong className="block text-lg">{value}</strong>
                      <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 overflow-hidden rounded-[22px] border border-border bg-secondary/20">
                  {(
                    [
                      ["Coffee", "Food", "- $4.50"],
                      ["Bus Card", "Transport", "- $12"],
                      ["Allowance", "Income", "+ $120"],
                    ] as const
                  ).map(([name, type, value], index) => (
                    <div
                      key={name}
                      className={cn(
                        "flex items-center justify-between gap-4 px-4 py-4",
                        index !== 2 && "border-b border-border",
                      )}
                    >
                      <div>
                        <p className="text-sm font-bold">{name}</p>
                        <p className="mt-1 text-[10px] text-muted-foreground">{type}</p>
                      </div>

                      <strong
                        className={cn(
                          "text-xs",
                          value.startsWith("+") ? "text-success" : "text-destructive",
                        )}
                      >
                        {value}
                      </strong>
                    </div>
                  ))}
                </div>
              </article>

              <div className="grid gap-6">
                <article className="rounded-[28px] border border-border bg-card/90 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-peach text-destructive">
                      <Target size={18} />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                        Monthly control
                      </p>
                      <h3 className="mt-1 text-lg font-bold">Budget with confidence.</h3>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    Keep category limits visible without filling the screen with
                    unnecessary detail.
                  </p>

                  <div className="mt-6 space-y-4">
                    {[
                      ["Food", "78%", "w-[78%]"],
                      ["Transport", "46%", "w-[46%]"],
                      ["Study", "61%", "w-[61%]"],
                    ].map(([label, value, width]) => (
                      <div key={label}>
                        <div className="flex items-center justify-between text-[11px]">
                          <span>{label}</span>
                          <strong>{value}</strong>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                          <div className={cn("h-full rounded-full bg-primary", width)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="rounded-[28px] border border-border bg-card/90 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-violet-soft text-primary">
                      <Sparkles size={18} />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                        Smart pattern
                      </p>
                      <h3 className="mt-1 text-lg font-bold">Useful insight, not noise.</h3>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[20px] border border-border bg-secondary/30 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                      This month
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6">
                      Dining spend is 18% lower than last month. Keep the habit going.
                    </p>
                  </div>
                </article>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
              {student ? (
                <article className="rounded-[30px] border border-border bg-card/90 p-6 shadow-[var(--shadow-card)] backdrop-blur-xl md:p-8">
                  <div className="grid items-center gap-7 md:grid-cols-[1fr_.9fr]">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-orange-soft text-warning">
                          <ChartNoAxesCombined size={20} />
                        </span>
                        <span className="rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                          Your reports
                        </span>
                      </div>

                      <h3 className="mt-5 text-2xl font-bold tracking-tight">
                        Your spending story is ready to review.
                      </h3>

                      <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                        Open your reports workspace to review monthly summaries,
                        category trends and income-versus-expense comparisons.
                      </p>

                      <Button asChild className="premium-btn mt-6 h-11 px-6">
                        <Link to="/reports">
                          Open Reports
                          <ArrowRight size={17} />
                        </Link>
                      </Button>
                    </div>

                    <div className="rounded-[24px] border border-border bg-secondary/25 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                            Monthly trend
                          </p>
                          <p className="mt-1 text-sm font-bold">Income vs spending</p>
                        </div>
                        <span className="metric-pill">6 months</span>
                      </div>

                      <div className="mt-6 flex h-36 items-end gap-3">
                        {[44, 66, 52, 78, 63, 88].map((height, index) => (
                          <span
                            key={index}
                            className={cn(
                              "flex-1 rounded-t-xl",
                              index % 2 === 0 ? "bg-primary" : "bg-chart-2",
                            )}
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ) : (
                <article className="rounded-[30px] border border-border bg-card/90 p-6 shadow-[var(--shadow-card)] backdrop-blur-xl md:p-8">
                  <div className="grid items-center gap-7 md:grid-cols-[.95fr_1.05fr]">
                    <div>
                      <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-orange-soft text-warning">
                        <ChartNoAxesCombined size={20} />
                      </span>

                      <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.13em] text-primary">
                        Report preview
                      </p>

                      <h3 className="mt-2 text-2xl font-bold tracking-tight">
                        Reports should explain the story, not just show numbers.
                      </h3>

                      <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                        This preview shows how CampusCoin turns monthly activity into
                        a simple visual summary without overwhelming the page.
                      </p>
                    </div>

                    <div className="rounded-[24px] border border-border bg-secondary/25 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                            Sample month
                          </p>
                          <p className="mt-1 text-sm font-bold">Spending trend</p>
                        </div>
                        <span className="rounded-full border border-border bg-card px-3 py-1.5 text-[10px] font-bold text-muted-foreground">
                          Preview
                        </span>
                      </div>

                      <div className="mt-6 flex h-36 items-end gap-3">
                        {[38, 58, 46, 72, 64, 86].map((height, index) => (
                          <span
                            key={index}
                            className={cn(
                              "flex-1 rounded-t-xl",
                              index % 2 === 0 ? "bg-primary" : "bg-chart-2",
                            )}
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-4 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <span className="size-2 rounded-full bg-primary" /> Income
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="size-2 rounded-full bg-chart-2" /> Spending
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              )}

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-[24px] border border-border bg-card/85 p-5 shadow-[var(--shadow-soft)] backdrop-blur-xl">
                  <span className="inline-flex size-9 items-center justify-center rounded-xl bg-sage text-primary">
                    <Bookmark size={17} />
                  </span>
                  <h3 className="mt-4 text-base font-bold">Save what matters</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Keep useful tips and insights easy to return to later.
                  </p>
                </div>

                <div className="rounded-[24px] border border-border bg-card/85 p-5 shadow-[var(--shadow-soft)] backdrop-blur-xl">
                  <span className="inline-flex size-9 items-center justify-center rounded-xl bg-blue-soft text-primary">
                    <Smartphone size={17} />
                  </span>
                  <h3 className="mt-4 text-base font-bold">Built to travel</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    A responsive workspace that stays clear across screen sizes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sitemap */}

        <section
          id="sitemap"
          className="public-sitemap-section"
        >
          <div className="public-sitemap-grid-pattern" />

          <div className="page-shell relative z-10">
            <div className="public-sitemap-head">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  Sitemap
                </p>

                <h2 className="section-title mt-3 text-4xl md:text-5xl">
                  Find your way
                  around{" "}
                  <em>Campus Coin.</em>
                </h2>

                <p className="section-text mt-4 max-w-2xl text-base">
                  Public pages, student tools and administrator areas are
                  organised below — with clear separation between browsing and
                  protected workspaces.
                </p>
              </div>

              <div className="public-sitemap-quick">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  Quick directions
                </p>

                <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
                  <a
                    href="#public-pages"
                    className="public-sitemap-quick-link"
                  >
                    <span className="public-sitemap-quick-icon">
                      <LayoutDashboard size={17} />
                    </span>
                    Public website
                    <ArrowRight size={15} />
                  </a>

                  <a
                    href="#student-space"
                    className="public-sitemap-quick-link"
                  >
                    <span className="public-sitemap-quick-icon">
                      <GraduationCap size={17} />
                    </span>
                    Student space
                    <ArrowRight size={15} />
                  </a>

                  <a
                    href="#admin-space"
                    className="public-sitemap-quick-link"
                  >
                    <span className="public-sitemap-quick-icon">
                      <ShieldCheck size={17} />
                    </span>
                    Admin space
                    <ArrowRight size={15} />
                  </a>
                </div>
              </div>
            </div>

            <div className="public-sitemap-map">
              <div className="public-sitemap-hub">
                <span className="public-sitemap-hub-icon">
                  <LayoutDashboard size={20} />
                </span>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                    Navigation hub
                  </p>
                  <h3 className="mt-1 text-lg font-bold">
                    CampusCoin
                  </h3>
                </div>

                <span className="public-sitemap-hub-status">
                  Public + protected
                </span>
              </div>

              <div
                className="public-sitemap-connector"
                aria-hidden="true"
              />

              <div className="public-sitemap-branches">
                <div
                  id="public-pages"
                  className="public-sitemap-node public-sitemap-node-public"
                >
                  <div className="public-sitemap-node-top">
                    <span className="public-sitemap-node-icon">
                      <LayoutDashboard size={19} />
                    </span>

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                        Public
                      </p>
                      <h3 className="mt-1 text-lg font-bold">
                        Visitor Pages
                      </h3>
                    </div>

                    <span className="public-sitemap-count">
                      07
                    </span>
                  </div>

                  <p className="public-sitemap-node-copy">
                    Browse the public experience before entering a protected
                    workspace.
                  </p>

                  <div className="public-sitemap-node-links">
                    {(
                      [
                        ["Home", "/"],
                        ["Features", "/features"],
                        ["How It Works", "/how-it-works"],
                        ["Student Registration", "/register"],
                        ["Student Login", "/login"],
                        ["Forgot Password", "/forgot-password"],
                        ["Administrator Login", "/admin/login"],
                      ] as const
                    ).map(([label, to]) => (
                      <Link
                        key={label}
                        to={to}
                        className="public-sitemap-map-link"
                      >
                        <span>{label}</span>
                        <ArrowUpRight size={14} />
                      </Link>
                    ))}
                  </div>
                </div>

                <div
                  id="student-space"
                  className="public-sitemap-node public-sitemap-node-student"
                >
                  <div className="public-sitemap-node-top">
                    <span className="public-sitemap-node-icon">
                      <GraduationCap size={19} />
                    </span>

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                        Student
                      </p>
                      <h3 className="mt-1 text-lg font-bold">
                        Protected Workspace
                      </h3>
                    </div>

                    <span className="public-sitemap-count">
                      {studentWorkspace.length.toString().padStart(2, "0")}
                    </span>
                  </div>

                  <p className="public-sitemap-node-copy">
                    Student money tools open after sign in so personal data
                    stays connected to the correct account.
                  </p>

                  <div className="public-sitemap-node-links public-sitemap-node-links-two">
                    {studentWorkspace.map((item) => (
                      <Link
                        key={item.to}
                        to={student ? item.to : "/login"}
                        className="public-sitemap-map-link"
                      >
                        <span>{item.title}</span>
                        <ArrowUpRight size={14} />
                      </Link>
                    ))}
                  </div>
                </div>

                <div
                  id="admin-space"
                  className="public-sitemap-node public-sitemap-node-admin"
                >
                  <div className="public-sitemap-node-top">
                    <span className="public-sitemap-node-icon">
                      <ShieldCheck size={19} />
                    </span>

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                        Administrator
                      </p>
                      <h3 className="mt-1 text-lg font-bold">
                        Admin Area
                      </h3>
                    </div>

                    <span className="public-sitemap-count">
                      07
                    </span>
                  </div>

                  <p className="public-sitemap-node-copy">
                    Administrative routes stay visually separate from the
                    student workspace.
                  </p>

                  <div className="public-sitemap-node-links">
                    {(
                      [
                        ["Admin Login", "/admin/login"],
                        ["Dashboard", "/admin/dashboard"],
                        ["Users", "/admin/users"],
                        ["Categories", "/admin/categories"],
                        ["Content", "/admin/content"],
                        ["Statistics", "/admin/statistics"],
                        ["Settings", "/admin/settings"],
                      ] as const
                    ).map(([label, to]) => (
                      <Link
                        key={label}
                        to={to}
                        className="public-sitemap-map-link"
                      >
                        <span>{label}</span>
                        <ArrowUpRight size={14} />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="public-sitemap-footerbar">
              <div>
                <p className="text-sm font-bold">
                  Ready to make the workspace yours?
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Create a student account and move from browsing to your
                  personal dashboard.
                </p>
              </div>

              <Button
                asChild
                className="premium-btn h-11 px-6"
              >
                <Link
                  to={
                    student
                      ? "/dashboard"
                      : "/register"
                  }
                >
                  {student
                    ? "Open Dashboard"
                    : "Create Account"}
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}

/* Features page */

export function FeaturesPage() {
  return (
    <>
      <PublicHeader />

      <main>
        <section className="public-inner-hero public-features-hero">
          <img
            src={bgFeatures}
            alt="Students building better financial habits"
            className="public-inner-hero-image"
          />

          <div className="public-inner-hero-overlay" />

          <div className="page-shell relative z-10 py-16 lg:py-20">
            <div className="public-inner-text max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                Everything in one place
              </p>

              <h1 className="section-title mt-4">
                Powerful Features for <em>Student Life</em>
              </h1>

              <p className="section-text mt-5 max-w-2xl">
                Everything you need to understand your money, build better habits, and keep your student finances clear — all in one place.
              </p>
            </div>
          </div>
        </section>

        <section className="public-features-body relative z-20 -mt-14 pb-20 lg:-mt-20">
          <div className="page-shell">
            <div className="public-features-grid">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="surface-card p-6 backdrop-blur-sm"
              >
                <div
                  className={`mb-6 inline-flex size-12 items-center justify-center rounded-2xl ${feature.tone}`}
                >
                  <feature.icon size={23} />
                </div>

                <h2 className="text-lg font-bold">
                  {feature.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.desc}
                </p>
              </div>
            ))}
            </div>

          <div className="public-feature-spotlight mt-12 overflow-hidden rounded-[30px] border border-border">
            <img
              src={bgFeatures}
              alt=""
              aria-hidden="true"
              className="public-feature-spotlight-image"
            />

            <div className="public-feature-spotlight-overlay" />

            <div className="relative z-10 grid items-center gap-12 p-8 md:grid-cols-2 md:p-14">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.13em] text-primary">
                  Designed around you
                </p>

                <h2 className="section-title mt-4 text-4xl md:text-5xl">
                  Your money in your <em>pocket.</em>
                </h2>

                <p className="mt-5 max-w-md leading-7 text-muted-foreground">
                  From morning coffee to semester goals, see the whole picture in a way that makes sense to you.
                </p>

                <Button
                  asChild
                  className="premium-btn mt-7 h-11 px-6"
                >
                  <Link to="/register">
                    Get Started
                    <ArrowRight />
                  </Link>
                </Button>
              </div>

              <div className="mx-auto w-full max-w-[285px] rounded-[35px] border-[9px] border-foreground bg-card p-5 shadow-xl">
                <div className="mx-auto mb-6 h-1.5 w-20 rounded-full bg-foreground/30" />

                <span className="text-xs text-muted-foreground">
                  Good morning, Alex
                </span>

                <div className="mt-5 rounded-xl bg-primary p-5 text-primary-foreground">
                  <span className="text-xs opacity-80">
                    Total Balance
                  </span>

                  <p className="mt-2 text-3xl font-bold">
                    $1,240.50
                  </p>

                  <span className="text-xs">
                    ↗ +8.2% this month
                  </span>
                </div>

                <p className="mt-6 text-sm font-bold">
                  This month
                </p>

                {[
                  ["Food", "$210"],
                  ["Transport", "$68"],
                  ["Education", "$82"],
                ].map(([name, value]) => (
                  <div
                    key={name}
                    className="flex justify-between border-b border-border py-3 text-xs"
                  >
                    <span>{name}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}

/* How it works page */

export function HowPage() {
  const steps = [
    {
      n: "01",
      title: "Create Your Account",
      text: "Join with just a few details and make your space your own.",
      icon: UserPlus,
    },
    {
      n: "02",
      title: "Track Your Money",
      text: "Keep income and expenses together in one clear view.",
      icon: Wallet,
    },
    {
      n: "03",
      title: "Set Budgets & Goals",
      text: "Make room for today while planning for what is next.",
      icon: Target,
    },
    {
      n: "04",
      title: "Get Insights",
      text: "Discover small changes that make a real difference.",
      icon: Sparkles,
    },
  ];

  return (
    <>
      <PublicHeader />

      <main>
        <section className="public-inner-hero public-inner-hero-how">
          <img
            src={bgHowItWorks}
            alt="Students learning and planning together"
            className="public-inner-hero-image"
          />

          <div className="public-inner-hero-overlay" />

          <div className="page-shell relative z-10 py-16 lg:py-20">
            <div className="public-inner-text max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                Simple by design
              </p>

              <h1 className="section-title mt-4">
                Your Better Money <em>Journey</em>
              </h1>

              <p className="section-text mt-5 max-w-lg">
                Four small steps to feeling more confident with your money.
              </p>
            </div>
          </div>
        </section>

        <section className="public-how-body relative z-20 -mt-14 pb-20 lg:-mt-20">
          <div className="page-shell">
            <div className="public-steps-grid">
            {steps.map((step) => (
              <div
                key={step.n}
                className="surface-card p-6 backdrop-blur-sm"
              >
                <div className="mb-8 flex items-start justify-between">
                  <span className="font-display text-3xl text-primary">
                    {step.n}
                  </span>

                  <span className="flex size-10 items-center justify-center rounded-2xl bg-sage text-primary">
                    <step.icon size={19} />
                  </span>
                </div>

                <h2 className="text-base font-bold">
                  {step.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {step.text}
                </p>
              </div>
            ))}
            </div>

          <div className="public-how-visual mt-12 overflow-hidden rounded-[30px] border border-border">
            <img
              src={bgHowItWorks}
              alt="A calm student study environment"
              className="h-[430px] w-full object-cover md:h-[520px]"
              loading="lazy"
            />

            <div className="public-how-visual-overlay">
              <div className="max-w-xl">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/75">
                  Small steps, real progress
                </p>

                <h2 className="mt-3 font-display text-4xl leading-tight text-white md:text-5xl">
                  Make money feel clearer, one habit at a time.
                </h2>

                <Button
                  asChild
                  className="premium-btn mt-6 h-11 px-6"
                >
                  <Link to="/register">
                    Start Your Journey
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}

/* Authentication pages: login, registration, password recovery and admin login */

export function AuthPage({
  mode,
}: {
  mode: "login" | "register" | "forgot" | "admin";
}) {
  const navigate = useNavigate();

  const [sent, setSent] = useState(false);
  const [showPassword, setShowPassword] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const title =
    mode === "register"
      ? "Create Your Account"
      : mode === "forgot"
        ? "Forgot Password?"
        : mode === "admin"
          ? "Admin Login"
          : "Welcome Back";

  const subtitle =
    mode === "register"
      ? "Start your journey to a brighter financial future."
      : mode === "forgot"
        ? "Enter your email address to begin the password reset process."
        : mode === "admin"
          ? "Sign in to your administrator workspace."
          : "Sign in to your Campus Coin account.";

  const authSideImage =
    mode === "register"
      ? authSignupImage
      : authLoginImage;

  /* Handle authentication form submissions */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (loading) {
      return;
    }

    const form = new FormData(event.currentTarget);

    const name = String(
      form.get("name") || "",
    ).trim();

    const email = String(
      form.get("email") || "",
    )
      .trim()
      .toLowerCase();

    const password = String(
      form.get("password") || "",
    );

    const confirmPassword = String(
      form.get("confirm") || "",
    );

    const academicYear = String(
      form.get("year") || "",
    );

    /* Check the email before sending the request */

    if (
      email === "" ||
      !email.includes("@")
    ) {
      await notice(
        "Check your email",
        "Please enter a valid email address.",
        "error",
      );

      return;
    }

    /* Password recovery */

    if (mode === "forgot") {
      try {
        setLoading(true);

        await authService.forgotPassword(email);

        setSent(true);

        await notice(
          "Request received",
          "If an active account exists with this email, password reset instructions have been prepared.",
          "success",
        );
      } catch (error) {
        await notice(
          "Unable to continue",
          error instanceof Error
            ? error.message
            : "Password reset request failed.",
          "error",
        );
      } finally {
        setLoading(false);
      }

      return;
    }

    /* Validate the password fields */

    if (password.length < 8) {
      await notice(
        "Check your password",
        "Password must contain at least 8 characters.",
        "error",
      );

      return;
    }

    /* Registration-only validation */

    if (mode === "register") {
      if (name.length < 2) {
        await notice(
          "Check your name",
          "Please enter your full name.",
          "error",
        );

        return;
      }

      if (password !== confirmPassword) {
        await notice(
          "Passwords do not match",
          "Please check both password fields.",
          "error",
        );

        return;
      }

      if (!academicYear) {
        await notice(
          "Academic year required",
          "Please select your academic year.",
          "warning",
        );

        return;
      }

      if (!form.get("terms")) {
        await notice(
          "One more thing",
          "Please agree to the terms and privacy policy.",
          "warning",
        );

        return;
      }
    }

    /* Send the form to the existing PHP API */

    try {
      setLoading(true);

      /* Create a student account */

      if (mode === "register") {
        const response =
          await authService.register({
            name,
            email,
            password,
            academic_year:
              academicYear,
          });

        await notice(
          "Account created",
          `Welcome to Campus Coin, ${response.data.user.name}!`,
          "success",
        );

        navigate({
          to: "/dashboard",
        });

        return;
      }

      /* Sign in as an administrator */

      if (mode === "admin") {
        const response =
          await authService.adminLogin(
            email,
            password,
          );

        await notice(
          "Welcome back",
          `Signed in as ${response.data.user.name}.`,
          "success",
        );

        navigate({
          to: "/admin/dashboard",
        });

        return;
      }

      /* Sign in as a student */

      const response =
        await authService.login(
          email,
          password,
        );

      await notice(
        "Welcome back",
        `Good to see you, ${response.data.user.name}.`,
        "success",
      );

      navigate({
        to: "/dashboard",
      });
    } catch (error) {
      await notice(
        mode === "register"
          ? "Unable to create account"
          : "Unable to sign in",
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page min-h-screen bg-background lg:grid lg:grid-cols-[44%_56%]">

      {/* Authentication artwork */}

      <div className="auth-visual-panel relative m-5 hidden overflow-hidden rounded-[34px] border border-border shadow-[var(--shadow-lift)] lg:block">
        <img
          src={authSideImage}
          alt={mode === "register" ? "Students beginning a new academic journey" : "Student studying in a calm campus environment"}
          className="absolute inset-0 h-full w-full object-cover"
          width={1008}
          height={1408}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-black/5" />

        <div className="absolute left-8 top-8 rounded-full border border-white/55 bg-card/90 px-4 py-2 shadow-lg backdrop-blur-md">
          <Brand />
        </div>

        <div className="absolute bottom-10 left-9 right-9 text-white">
          <p className="font-display text-5xl leading-[1.02]">
            Good habits today,
            <br />
            <em>brighter tomorrow.</em>
          </p>

          <p className="mt-5 text-sm">
            Smart Spending, Student Style.
          </p>
        </div>
      </div>

      {/* Authentication form */}

      <div className="auth-form-side flex flex-col px-5 py-6 sm:px-10 lg:px-12 xl:px-16">

        {/* Back navigation */}

        <div className="flex items-center justify-between">
          <div className="lg:hidden">
            <Brand />
          </div>

          <Link
            to="/"
            className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ChevronLeft size={16} />
            Back to home
          </Link>
        </div>

        {/* Form card */}

        <div className="auth-form-card mx-auto my-auto flex w-full max-w-[520px] flex-col justify-center px-6 py-8 sm:px-8 lg:px-9 lg:py-9">

          {/* Page icon */}

          <span className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-sage text-primary ring-1 ring-primary/10">
            {mode === "forgot" ? (
              <Mail />
            ) : mode === "admin" ? (
              <ShieldCheck />
            ) : (
              <LeafIcon />
            )}
          </span>

          {/* Page heading */}

          <h1 className="font-display text-4xl leading-tight md:text-5xl">
            {sent
              ? "Check Your Inbox"
              : title}
          </h1>

          {/* Supporting text */}

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {sent
              ? "If an active account exists for that email, password reset instructions have been prepared."
              : subtitle}
          </p>

          {!sent && mode !== "forgot" && (
            <div className="auth-trust-grid mt-6">
              <div className="auth-trust-item">
                <span className="auth-trust-icon">
                  <ShieldCheck size={15} />
                </span>
                <span>
                  <strong>Secure workspace</strong>
                  <small>Your account data stays protected.</small>
                </span>
              </div>

              <div className="auth-trust-item">
                <span className="auth-trust-icon">
                  <Sparkles size={15} />
                </span>
                <span>
                  <strong>Student focused</strong>
                  <small>Simple tools built around student life.</small>
                </span>
              </div>
            </div>
          )}

          {!sent ? (
            <form
              className="mt-9 space-y-5"
              onSubmit={handleSubmit}
            >

              {/* Student name */}

              {mode === "register" && (
                <Field
                  label="Full Name"
                  name="name"
                  placeholder="Your full name"
                  icon={
                    <UserRound size={17} />
                  }
                  required
                />
              )}

              {/* Email address */}

              <Field
                label={
                  mode === "admin"
                    ? "Admin Email Address"
                    : "Email Address"
                }
                name="email"
                type="email"
                placeholder={
                  mode === "admin"
                    ? "admin@campuscoin.test"
                    : "you@campus.edu"
                }
                icon={<Mail size={17} />}
                required
              />

              {/* Password inputs */}

              {mode !== "forgot" && (
                <>
                  <div>
                    <Field
                      label="Password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Enter your password"
                      icon={
                        <LockKeyhole
                          size={17}
                        />
                      }
                      required
                    />

                    <Button
                      type="button"
                      variant="link"
                      className="mt-1 h-auto p-0 text-xs"
                      onClick={() =>
                        setShowPassword(
                          (current) =>
                            !current,
                        )
                      }
                    >
                      {showPassword
                        ? "Hide password"
                        : "Show password"}
                    </Button>
                  </div>

                  {/* Additional registration fields */}

                  {mode === "register" && (
                    <>
                      <Field
                        label="Confirm Password"
                        name="confirm"
                        type="password"
                        placeholder="Confirm your password"
                        icon={
                          <LockKeyhole
                            size={17}
                          />
                        }
                        required
                      />

                      <label className="block text-sm font-semibold">
                        Academic Year

                        <select
                          name="year"
                          className="mt-2 h-12 w-full rounded-2xl border border-border bg-card px-4 text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                          required
                        >
                          <option value="">
                            Select your year
                          </option>

                          {[
                            "First Year",
                            "Second Year",
                            "Third Year",
                            "Fourth Year",
                            "Graduate",
                          ].map((year) => (
                            <option
                              key={year}
                              value={year}
                            >
                              {year}
                            </option>
                          ))}
                        </select>
                      </label>

                      {/* Terms agreement */}

                      <label className="flex cursor-pointer items-start gap-2 text-sm leading-6 text-muted-foreground">
                        <input
                          name="terms"
                          type="checkbox"
                          className="mt-1 accent-primary"
                        />

                        <span>
                          I agree to the terms
                          and privacy policy.
                        </span>
                      </label>
                    </>
                  )}

                  {/* Login actions */}

                  {mode === "login" && (
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <label className="flex items-center gap-2 text-muted-foreground">
                        <input
                          type="checkbox"
                          className="accent-primary"
                        />

                        Remember me
                      </label>

                      <Link
                        to="/forgot-password"
                        className="font-semibold text-primary hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                  )}
                </>
              )}

              {/* Submit action */}

              <Button
                type="submit"
                disabled={loading}
                className="premium-btn h-12 w-full text-sm"
              >
                {loading ? (
                  "Please wait..."
                ) : (
                  <>
                    {mode === "register"
                      ? "Create Account"
                      : mode === "forgot"
                        ? "Send Reset Link"
                        : mode === "admin"
                          ? "Admin Login"
                          : "Login"}

                    <ArrowRight />
                  </>
                )}
              </Button>
            </form>
          ) : (

            /* Confirmation shown after a reset request */

            <Button
              asChild
              className="mt-8 h-11"
            >
              <Link to="/login">
                Back to Login
              </Link>
            </Button>
          )}

          {/* Switch between login and registration */}

          <p className="mt-7 text-center text-sm text-muted-foreground">
            {mode === "register"
              ? "Already have an account?"
              : mode === "login"
                ? "Don't have an account?"
                : ""}{" "}

            {mode === "register" ? (
              <Link
                to="/login"
                className="font-bold text-primary hover:underline"
              >
                Login
              </Link>
            ) : mode === "login" ? (
              <Link
                to="/register"
                className="font-bold text-primary hover:underline"
              >
                Sign Up
              </Link>
            ) : null}
          </p>

          {/* Link to the admin sign-in */}

          {mode === "login" && (
            <div className="mt-8 border-t border-border pt-6 text-center">
              <p className="text-xs text-muted-foreground">
                Administrator?
              </p>

              <Link
                to="/admin/login"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                <ShieldCheck size={15} />
                Admin Login
              </Link>
            </div>
          )}

          {/* Return to the student sign-in */}

          {mode === "admin" && (
            <div className="mt-8 text-center">
              <Link
                to="/login"
                className="text-sm font-semibold text-primary hover:underline"
              >
                Back to Student Login
              </Link>
            </div>
          )}
        </div>

        {/* Security reminder */}

        <div className="text-center">
          <SecureNote />
        </div>
      </div>
    </div>
  );
}

/* Authentication icon */

function LeafIcon() {
  return <GraduationCap />;
}

/* Shared authentication field */

function Field({
  label,
  name,
  type = "text",
  placeholder,
  icon,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  icon: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}

      <span className="relative mt-2 block text-muted-foreground">
        <span className="absolute left-3 top-1/2 -translate-y-1/2">
          {icon}
        </span>

        <Input
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          autoComplete={
            type === "password"
              ? "current-password"
              : undefined
          }
          className="h-12 rounded-2xl bg-card pl-10 text-foreground"
        />
      </span>
    </label>
  );
}
