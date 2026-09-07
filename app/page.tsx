"use client"

import Link from "next/link"
import { Space_Grotesk, IBM_Plex_Sans } from "next/font/google"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useAuth } from "@/components/auth-provider"
import {
  GraduationCap,
  Building2,
  Newspaper,
  Megaphone,
  ShieldCheck,
  Layers,
  CalendarCheck2,
  Landmark,
  MessageSquare,
  Fingerprint,
  User,
  MapPin,
  Mail,
  Phone,
  Heart,
  MessageCircle,
  Share2,
  CheckCircle2,
  XCircle,
} from "lucide-react"

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
})

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
})

const FACULTIES = [
  { code: "AS", name: "Arts & Social Sciences" },
  { code: "ED", name: "Education" },
  { code: "LL", name: "Law" },
  { code: "MD", name: "Medicine" },
  { code: "PH", name: "Pharmacy" },
  { code: "SC", name: "Science" },
]

const ROLE_PATHS = [
  {
    tag: "STUDENT",
    title: "Find your clubs, follow the feed",
    description:
      "Sign up with your GSU student ID and Connectrix matches you to your faculty and department automatically — no manual club codes to hunt down.",
    bullets: [
      "Auto-matched to your faculty & department",
      "Join clubs, post to the campus feed",
      "Register for events in a couple of taps",
    ],
    cta: { label: "Create your account", href: "/register" },
  },
  {
    tag: "CLUB",
    title: "Run your club from one dashboard",
    description:
      "Post updates, review membership, and manage events for your club without juggling group chats and spreadsheets.",
    bullets: [
      "A dedicated login separate from members",
      "Post directly to your club's followers",
      "Track membership and event attendance",
    ],
    cta: { label: "Club login", href: "/club-login" },
  },
  {
    tag: "ADMIN",
    title: "Oversee the whole campus network",
    description:
      "Approve events, moderate the feed, and keep a full audit trail of every administrative action, across every faculty.",
    bullets: [
      "User, club, and event management",
      "Event approval workflow",
      "Full audit log of admin activity",
    ],
    cta: { label: "Sign in", href: "/login" },
  },
]

const FAQS = [
  {
    q: "Do I need to already belong to a club to sign up?",
    a: "No. Registration only needs your name, GSU student ID, and a few contact details. Club membership happens afterward, from inside the app.",
  },
  {
    q: "How does Connectrix know my faculty and department?",
    a: "Your student ID follows GSU's own format — Connectrix reads the faculty and department codes directly out of it, so you don't fill that in by hand.",
  },
  {
    q: "Can a club have more than one person managing it?",
    a: "A club has its own single login, separate from any individual student account, so anyone with those credentials can post and manage it on the club's behalf.",
  },
  {
    q: "Is Connectrix only for Gombe State University?",
    a: "Right now, yes — the whole platform, from ID parsing to faculty lists, is built specifically around GSU.",
  },
]

export default function Home() {
  const { user, isAuthenticated } = useAuth()

  return (
    <div className={`${display.variable} ${body.variable} cx-root flex min-h-screen flex-col`}>
      <style jsx>{`
        .cx-root {
          --ink: #181a22;
          --paper: #f8f4ea;
          --paper-deep: #efe8d8;
          --marigold: #f0a93b;
          --marigold-deep: #cf8a1f;
          --coral: #e35c55;
          --forest: #26594a;
          --line: #e3dac4;
          font-family: var(--font-body), sans-serif;
          background: var(--paper);
          color: var(--ink);
        }
        .cx-root :global(h1),
        .cx-root :global(h2),
        .cx-root :global(h3),
        .cx-root :global(.cx-display) {
          font-family: var(--font-display), sans-serif;
        }
        .cx-badge {
          border: 1px solid var(--line);
          background: #fff;
          border-radius: 14px;
          position: relative;
        }
        .cx-badge::before {
          content: "";
          position: absolute;
          top: -7px;
          left: 50%;
          transform: translateX(-50%);
          width: 34px;
          height: 14px;
          border-radius: 8px;
          background: var(--ink);
        }
        .cx-pin {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--marigold);
          display: inline-block;
        }
        .cx-hairline {
          border-color: var(--line);
        }
        .cx-marquee-track {
          display: flex;
          width: max-content;
          animation: cx-scroll 32s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .cx-marquee-track {
            animation: none;
          }
        }
        @keyframes cx-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b cx-hairline bg-[var(--paper)]/95 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-md text-sm font-bold text-white"
              style={{ background: "var(--ink)" }}
            >
              C
            </span>
            <span className="cx-display text-xl font-bold">Connectrix</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-[var(--ink)]/70 md:flex">
            <Link href="#clubs" className="hover:text-[var(--ink)]">Clubs</Link>
            <Link href="#feed" className="hover:text-[var(--ink)]">Newsfeed</Link>
            <Link href="#events" className="hover:text-[var(--ink)]">Events</Link>
            <Link href="#roles" className="hover:text-[var(--ink)]">For your role</Link>
            <Link href="#faq" className="hover:text-[var(--ink)]">FAQ</Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated() ? (
              <>
                <span className="hidden text-sm text-[var(--ink)]/60 sm:inline">
                  Welcome, {user?.name || "back"}
                </span>
                <Link href="/dashboard">
                  <Button
                    size="sm"
                    className="rounded-full px-4 text-white hover:opacity-90"
                    style={{ background: "var(--ink)" }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="px-3 text-[var(--ink)]">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="rounded-full px-4 text-white hover:opacity-90"
                    style={{ background: "var(--ink)" }}
                  >
                    Join Connectrix
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="w-full px-4 pb-16 pt-14 sm:px-6 sm:pt-20 md:pb-24">
          <div className="container grid gap-12 md:grid-cols-2 md:items-center md:gap-8">
            <div>
              <h1 className="cx-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Every club, every post,
                <br />
                one campus network.
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-[var(--ink)]/70 sm:text-lg">
                Connectrix is Gombe State University's own club and community
                platform — verified by your student ID, matched to your
                faculty, and built to keep every club's activity in one feed.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="w-full rounded-full px-7 text-white hover:opacity-90 sm:w-auto"
                    style={{ background: "var(--marigold-deep)" }}
                  >
                    Create your account
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full rounded-full border-[var(--ink)]/20 px-7 text-[var(--ink)] hover:bg-[var(--ink)]/5 sm:w-auto"
                  >
                    Sign in
                  </Button>
                </Link>
              </div>

              <p className="mt-4 flex items-center gap-2 text-sm text-[var(--ink)]/55">
                <Fingerprint className="h-4 w-4" />
                Verified with your GSU student ID — no separate club codes.
              </p>
            </div>

            {/* Badge/card stack visual */}
            <div className="relative mx-auto h-[360px] w-full max-w-sm sm:h-[400px]">
              <div className="cx-badge absolute left-1/2 top-0 w-72 -translate-x-1/2 p-5 shadow-sm">
                <div className="flex items-center justify-between text-xs font-medium text-[var(--ink)]/50">
                  <span>GSU STUDENT</span>
                  <span className="cx-pin" />
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-white"
                    style={{ background: "var(--forest)" }}
                  >
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Hauwa Bello</p>
                    <p className="text-xs text-[var(--ink)]/55">UG22/SCCS/1102</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2 text-xs">
                  <span className="rounded-full bg-[var(--paper-deep)] px-2.5 py-1">Science</span>
                  <span className="rounded-full bg-[var(--paper-deep)] px-2.5 py-1">Comp. Science</span>
                </div>
              </div>

              <div className="cx-badge absolute bottom-2 left-2 w-64 rotate-[-6deg] p-4 shadow-md">
                <p className="text-xs font-medium text-[var(--ink)]/50">CS DEPARTMENTAL CLUB</p>
                <p className="mt-1 text-sm leading-snug">
                  "Hackathon sign-ups close Friday — see you at the lab!"
                </p>
                <div className="mt-3 flex items-center gap-4 text-xs text-[var(--ink)]/50">
                  <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" />24</span>
                  <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" />6</span>
                  <span className="flex items-center gap-1"><Share2 className="h-3.5 w-3.5" />2</span>
                </div>
              </div>

              <div className="cx-badge absolute bottom-10 right-0 w-52 rotate-[5deg] p-4 shadow-md">
                <p className="text-xs font-medium text-[var(--ink)]/50">EVENT REQUEST</p>
                <p className="mt-1 text-sm font-semibold">Faculty of Law Moot Court</p>
                <div className="mt-3 flex gap-2">
                  <span className="flex items-center gap-1 rounded-full bg-[var(--forest)]/10 px-2.5 py-1 text-xs font-medium text-[var(--forest)]">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-[var(--coral)]/10 px-2.5 py-1 text-xs font-medium text-[var(--coral)]">
                    <XCircle className="h-3.5 w-3.5" /> Hold
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Marquee strip */}
          <div className="container mt-14 overflow-hidden border-y cx-hairline py-3">
            <div className="cx-marquee-track gap-10 text-sm font-medium text-[var(--ink)]/55">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex shrink-0 items-center gap-10 pr-10">
                  <span>6 faculties on the network</span>
                  <span>·</span>
                  <span>30+ departments auto-matched</span>
                  <span>·</span>
                  <span>Student ID verified sign-up</span>
                  <span>·</span>
                  <span>One feed for every club</span>
                  <span>·</span>
                  <span>Built for Gombe State University</span>
                  <span>·</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Faculty stat band */}
        <section
          className="w-full py-14 text-[var(--paper)]"
          style={{ background: "var(--ink)" }}
        >
          <div className="container grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              { n: "6", label: "Faculties mapped, from Arts to Medicine" },
              { n: "30+", label: "Departments matched from your student ID" },
              { n: "1", label: "Feed shared across the whole campus" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-4 sm:justify-center">
                {i > 0 && <span className="hidden h-10 w-px bg-white/15 sm:block" />}
                <div>
                  <div className="cx-display text-4xl font-bold">{stat.n}</div>
                  <div className="mt-1 text-sm text-white/60">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Feature panel 1: Clubs */}
        <section id="clubs" className="w-full py-20 sm:py-28">
          <div className="container grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
            <div className="order-2 md:order-1">
              <div className="rounded-2xl border cx-hairline bg-white p-5 shadow-sm">
                <p className="mb-3 text-xs font-semibold text-[var(--ink)]/45">CLUB DIRECTORY</p>
                {[
                  { name: "Computer Science Club", tag: "Faculty of Science", color: "var(--forest)" },
                  { name: "Law Students Association", tag: "Faculty of Law", color: "var(--coral)" },
                  { name: "Debate & Rhetoric Society", tag: "Open to all faculties", color: "var(--marigold-deep)" },
                ].map((club, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between py-3 ${i > 0 ? "border-t cx-hairline" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-white"
                        style={{ background: club.color }}
                      >
                        <Building2 className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{club.name}</p>
                        <p className="text-xs text-[var(--ink)]/50">{club.tag}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="rounded-full border-[var(--ink)]/15 text-xs">
                      Join
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 md:order-2">
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white"
                style={{ background: "var(--forest)" }}
              >
                <Layers className="h-5 w-5" />
              </span>
              <h2 className="cx-display mt-5 text-3xl font-bold leading-tight sm:text-4xl">
                Clubs matched to your faculty, not a search bar
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--ink)]/70">
                Your student ID already tells us your faculty and department —
                Connectrix uses that to surface the clubs most relevant to
                you first, while still keeping the full directory open to
                browse.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-[var(--ink)]/75">
                <li className="flex gap-2">
                  <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-[var(--forest)]" />
                  Departmental and cross-faculty clubs, side by side
                </li>
                <li className="flex gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--forest)]" />
                  Every membership tracked against a real student account
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Feature panel 2: Newsfeed */}
        <section id="feed" className="w-full py-20" style={{ background: "var(--paper-deep)" }}>
          <div className="container grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
            <div>
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white"
                style={{ background: "var(--coral)" }}
              >
                <Newspaper className="h-5 w-5" />
              </span>
              <h2 className="cx-display mt-5 text-3xl font-bold leading-tight sm:text-4xl">
                One feed for the whole campus
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--ink)]/70">
                Clubs post announcements, students share updates, and
                everything lands in a single, searchable feed — filterable
                by club, tag, or the people you follow.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-[var(--ink)]/75">
                <li className="flex gap-2">
                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-[var(--coral)]" />
                  Comments, likes, and shares on every post
                </li>
                <li className="flex gap-2">
                  <Megaphone className="mt-0.5 h-4 w-4 shrink-0 text-[var(--coral)]" />
                  Club accounts post directly to their followers
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border cx-hairline bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
                  style={{ background: "var(--ink)" }}
                >
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    Debate & Rhetoric Society <span className="font-normal text-[var(--ink)]/45">· Club</span>
                  </p>
                  <p className="text-xs text-[var(--ink)]/45">2 hours ago</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--ink)]/80">
                Inter-faculty debate finals move to the Main Auditorium,
                Saturday 10am. Come support your faculty's team!
              </p>
              <div className="mt-4 flex gap-2 text-xs">
                <span className="rounded-full bg-[var(--paper-deep)] px-2.5 py-1">#debate</span>
                <span className="rounded-full bg-[var(--paper-deep)] px-2.5 py-1">#finals</span>
              </div>
              <div className="mt-4 flex items-center gap-5 border-t cx-hairline pt-3 text-xs font-medium text-[var(--ink)]/55">
                <span className="flex items-center gap-1.5"><Heart className="h-4 w-4" /> 58</span>
                <span className="flex items-center gap-1.5"><MessageCircle className="h-4 w-4" /> 12</span>
                <span className="flex items-center gap-1.5"><Share2 className="h-4 w-4" /> 4</span>
              </div>
            </div>
          </div>
        </section>

        {/* Feature panel 3: Events */}
        <section id="events" className="w-full py-20 sm:py-28">
          <div className="container grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
            <div className="order-2 md:order-1 rounded-2xl border cx-hairline bg-white p-5 shadow-sm">
              <p className="mb-3 text-xs font-semibold text-[var(--ink)]/45">EVENT APPROVAL</p>
              <div className="rounded-xl border cx-hairline p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Pharmacy Week Health Fair</p>
                  <span className="rounded-full bg-[var(--marigold)]/20 px-2.5 py-0.5 text-xs font-medium text-[var(--marigold-deep)]">
                    Pending
                  </span>
                </div>
                <p className="mt-1 text-xs text-[var(--ink)]/50">Faculty of Pharmacy · Fri, 10:00am · Quadrangle</p>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" className="rounded-full text-white" style={{ background: "var(--forest)" }}>
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full border-[var(--ink)]/15">
                    Send back
                  </Button>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl border cx-hairline p-4">
                <div>
                  <p className="text-sm font-semibold">Freshers' Welcome Night</p>
                  <p className="text-xs text-[var(--ink)]/50">Open to all faculties · 142 registered</p>
                </div>
                <CalendarCheck2 className="h-5 w-5 text-[var(--forest)]" />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white"
                style={{ background: "var(--marigold-deep)" }}
              >
                <CalendarCheck2 className="h-5 w-5" />
              </span>
              <h2 className="cx-display mt-5 text-3xl font-bold leading-tight sm:text-4xl">
                Events that go through a real approval step
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--ink)]/70">
                Clubs submit events with a date, venue, and category. Admins
                review and approve before they go live — so the campus
                calendar stays reliable, not a free-for-all.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-[var(--ink)]/75">
                <li className="flex gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--marigold-deep)]" />
                  Registration and attendance tracked per event
                </li>
                <li className="flex gap-2">
                  <Landmark className="mt-0.5 h-4 w-4 shrink-0 text-[var(--marigold-deep)]" />
                  Every approval recorded in the admin audit log
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Why Connectrix - 2x2 */}
        <section className="w-full py-20" style={{ background: "var(--paper-deep)" }}>
          <div className="container">
            <div className="max-w-xl">
              <h2 className="cx-display text-3xl font-bold leading-tight sm:text-4xl">
                Built around how a university actually runs
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--ink)]/70">
                Not a generic social app repurposed for campus life — every
                part of Connectrix maps to something real at GSU.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {[
                {
                  icon: Fingerprint,
                  title: "Verified by student ID",
                  body: "Registration reads your real GSU student ID format, so faculty and department are never self-reported.",
                },
                {
                  icon: GraduationCap,
                  title: "Faculty & department matching",
                  body: "Every account is tagged to a real faculty and department, straight from admissions-style records.",
                },
                {
                  icon: Building2,
                  title: "Clubs have their own accounts",
                  body: "Club logins are separate from student logins, so club content is posted by the club, not an individual member.",
                },
                {
                  icon: ShieldCheck,
                  title: "Admin oversight, on the record",
                  body: "User, club, and event changes are logged in an audit trail admins can review at any time.",
                },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl border cx-hairline bg-white p-6">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ background: "var(--paper-deep)" }}
                  >
                    <item.icon className="h-5 w-5" style={{ color: "var(--forest)" }} />
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]/65">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Role paths (replaces pricing) */}
        <section id="roles" className="w-full py-20 sm:py-28">
          <div className="container">
            <div className="max-w-xl">
              <h2 className="cx-display text-3xl font-bold leading-tight sm:text-4xl">
                Three ways to use Connectrix
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--ink)]/70">
                Every account on the network is one of these three — pick
                where you fit.
              </p>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {ROLE_PATHS.map((role, i) => (
                <div
                  key={i}
                  className="cx-badge flex flex-col p-6"
                  style={i === 0 ? { borderColor: "var(--ink)", borderWidth: 2 } : undefined}
                >
                  <span className="text-xs font-semibold tracking-wide text-[var(--ink)]/45">{role.tag}</span>
                  <h3 className="cx-display mt-3 text-xl font-bold leading-snug">{role.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--ink)]/70">{role.description}</p>
                  <ul className="mt-5 space-y-2 text-sm text-[var(--ink)]/75">
                    {role.bullets.map((b, j) => (
                      <li key={j} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--forest)]" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Link href={role.cta.href} className="mt-6">
                    <Button
                      className="w-full rounded-full text-white hover:opacity-90"
                      style={{ background: i === 0 ? "var(--marigold-deep)" : "var(--ink)" }}
                    >
                      {role.cta.label}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="w-full py-20" style={{ background: "var(--paper-deep)" }}>
          <div className="container max-w-2xl">
            <h2 className="cx-display text-center text-3xl font-bold sm:text-4xl">Questions, answered</h2>
            <Accordion type="single" collapsible className="mt-10">
              {FAQS.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="cx-hairline">
                  <AccordionTrigger className="text-left text-base font-semibold">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-[var(--ink)]/70">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA band */}
        <section className="w-full py-16" style={{ background: "var(--marigold)" }}>
          <div className="container flex flex-col items-center gap-6 text-center">
            <h2 className="cx-display max-w-lg text-3xl font-bold leading-tight text-[var(--ink)] sm:text-4xl">
              Find your people on campus
            </h2>
            <Link href="/register">
              <Button
                size="lg"
                className="rounded-full px-8 text-white hover:opacity-90"
                style={{ background: "var(--ink)" }}
              >
                Create your account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-14 text-[var(--paper)]" style={{ background: "var(--ink)" }}>
        <div className="container grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-sm font-bold text-[var(--ink)]">
                C
              </span>
              <span className="cx-display text-lg font-bold">Connectrix</span>
            </div>
            <p className="mt-4 text-sm text-white/55">
              The club and community network built for Gombe State University.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Platform</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/55">
              <li><Link href="#clubs" className="hover:text-white">Clubs</Link></li>
              <li><Link href="#feed" className="hover:text-white">Newsfeed</Link></li>
              <li><Link href="#events" className="hover:text-white">Events</Link></li>
              <li><Link href="#roles" className="hover:text-white">For your role</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Faculties</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/55">
              {FACULTIES.map((f) => (
                <li key={f.code}>{f.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/55">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                Gombe State University, Nigeria
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                +234 903 250 9094
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                info@connectrix.edu.ng
              </li>
            </ul>
          </div>
        </div>
        <div className="container mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/45">
          © 2026 Connectrix, Gombe State University. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
