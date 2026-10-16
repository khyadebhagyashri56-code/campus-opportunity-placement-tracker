"use client";

import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Search,
  BookmarkCheck,
  Target,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Discover Opportunities",
    description:
      "Explore internships and fresher jobs that match your career goals.",
  },
  {
    icon: BookmarkCheck,
    title: "Save Your Favorites",
    description:
      "Keep interesting opportunities organized so you can revisit them later.",
  },
  {
    icon: Target,
    title: "Track Your Progress",
    description:
      "Stay organized while preparing and applying for opportunities.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <BriefcaseBusiness size={22} />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Campus<span className="text-indigo-600">Track</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Sign up
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm">
              <GraduationCap size={18} />
              Built for students and freshers
            </div>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Your next career opportunity
              <span className="text-indigo-600"> starts here.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Discover fresher jobs and internships, save opportunities you
              like, and organize your placement journey in one place.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                Get started <ArrowRight size={19} />
              </Link>

              <Link
                href="/login"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                I already have an account
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-600" />
                Student-friendly
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-600" />
                Organized job search
              </span>
            </div>
          </div>

          {/* Preview Card */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-indigo-200/50 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-blue-200/50 blur-3xl" />

            <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-indigo-100 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Your career journey</p>
                  <h2 className="mt-1 text-xl font-bold">Opportunity Hub</h2>
                </div>
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                  <Target size={25} />
                </div>
              </div>

              <div className="mt-7 rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-700">
                    I
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold">Software Developer</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Infosys · Fresher
                    </p>
                    <span className="mt-3 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      Example opportunity
                    </span>
                  </div>
                  <BookmarkCheck size={20} className="text-indigo-600" />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-indigo-50 p-4">
                  <Search className="text-indigo-600" size={22} />
                  <p className="mt-3 font-semibold">Find jobs</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Explore opportunities
                  </p>
                </div>
                <div className="rounded-2xl bg-blue-50 p-4">
                  <BookmarkCheck className="text-blue-600" size={22} />
                  <p className="mt-3 font-semibold">Save jobs</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Build your shortlist
                  </p>
                </div>
              </div>

              <p className="mt-5 text-center text-xs text-slate-400">
                Preview only · Sign in to access your personal dashboard
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
            Everything in one place
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Make your placement journey simpler
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            Spend less time organizing your search and more time preparing for
            your next opportunity.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Icon size={24} />
                </div>
                <h3 className="mt-5 text-lg font-bold">{feature.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-7xl rounded-3xl bg-slate-900 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to take the next step?
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-300">
            Create your account to start organizing your job search and
            placement opportunities.
          </p>
          <Link
            href="/signup"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-slate-900 transition hover:bg-indigo-50"
          >
            Create free account <ArrowRight size={19} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 px-6 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-sm text-slate-500 sm:flex-row">
          <p>© 2026 CampusTrack. Built for students and freshers.</p>
          <div className="flex gap-5">
            <Link href="/login" className="hover:text-indigo-600">
              Log in
            </Link>
            <Link href="/signup" className="hover:text-indigo-600">
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
