"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  BriefcaseBusiness,
  ExternalLink,
  Building2,
  Bookmark,
  SlidersHorizontal,
  X,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [savingIds, setSavingIds] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchOpportunities() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();

        if (search.trim()) params.set("search", search.trim());
        if (location.trim()) params.set("location", location.trim());
        if (jobType) params.set("jobType", jobType);

        const response = await fetch(
          `/api/opportunities?${params.toString()}`,
          { signal: controller.signal },
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Could not load opportunities.");
        }

        setOpportunities(data.opportunities || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    const timer = setTimeout(fetchOpportunities, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, location, jobType]);

  useEffect(() => {
    let active = true;

    async function fetchSavedOpportunities() {
      try {
        const response = await fetch("/api/saved-opportunities");
        const data = await response.json();

        if (!response.ok || !data.success || !active) return;

        const savedItems =
          data.savedOpportunities || data.saved || data.opportunities || [];

        setSavedIds(
          savedItems
            .map((item) =>
              Number(item.opportunityId ?? item.opportunity?.id ?? item.id),
            )
            .filter((id) => Number.isSafeInteger(id) && id > 0),
        );
      } catch (err) {
        console.error("Could not load saved opportunities:", err);
      }
    }

    fetchSavedOpportunities();

    return () => {
      active = false;
    };
  }, []);

  async function toggleSave(job) {
    const id = Number(job.id);

    if (!Number.isSafeInteger(id) || savingIds.includes(id)) return;

    setSavingIds((previous) => [...previous, id]);
    setSaveMessage("");

    try {
      const isSaved = savedIds.includes(id);

      const response = await fetch("/api/saved-opportunities", {
        method: isSaved ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityId: id }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            (response.status === 401
              ? "Please log in to save opportunities."
              : "Could not update saved opportunities."),
        );
      }

      setSavedIds((previous) =>
        isSaved
          ? previous.filter((savedId) => savedId !== id)
          : previous.includes(id)
            ? previous
            : [...previous, id],
      );

      setSaveMessage(
        isSaved
          ? "Opportunity removed from saved jobs."
          : "Opportunity saved successfully.",
      );
    } catch (err) {
      setSaveMessage(err.message || "Something went wrong.");
    } finally {
      setSavingIds((previous) => previous.filter((savedId) => savedId !== id));
    }
  }

  function clearFilters() {
    setSearch("");
    setLocation("");
    setJobType("");
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl space-y-7 pb-8">
        {/* Page heading */}
        <section className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-white to-blue-50 p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full bg-blue-100/60 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700">
              <BriefcaseBusiness size={14} />
              Career opportunities
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Find your next opportunity
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Explore jobs and internships, discover companies, and take the
              next step in your career.
            </p>
          </div>
        </section>

        {/* Search and filters */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <SlidersHorizontal size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Search opportunities
              </h2>
              <p className="text-xs text-slate-500">Narrow down your results</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <label className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-3 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50">
              <Search size={18} className="shrink-0 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Job title or company..."
                aria-label="Search job title or company"
                className="w-full min-w-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X size={16} />
                </button>
              )}
            </label>

            <label className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-3 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50">
              <MapPin size={18} className="shrink-0 text-slate-400" />
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Location, e.g. Pune"
                aria-label="Filter by location"
                className="w-full min-w-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </label>

            <label className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-3 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50">
              <BriefcaseBusiness
                size={18}
                className="shrink-0 text-slate-400"
              />
              <select
                value={jobType}
                onChange={(event) => setJobType(event.target.value)}
                aria-label="Filter by job type"
                className="w-full min-w-0 bg-transparent text-sm text-slate-700 outline-none"
              >
                <option value="">All job types</option>
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-500" aria-live="polite">
              {loading
                ? "Searching opportunities..."
                : `${opportunities.length} ${
                    opportunities.length === 1 ? "opportunity" : "opportunities"
                  } found`}
            </p>

            {(search || location || jobType) && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
              >
                <X size={15} />
                Clear filters
              </button>
            )}
          </div>
        </section>

        {/* Save status message */}
        {saveMessage && (
          <div
            role="status"
            className="flex items-start justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800"
          >
            <span>{saveMessage}</span>
            <button
              type="button"
              onClick={() => setSaveMessage("")}
              aria-label="Dismiss message"
              className="shrink-0 text-blue-600 hover:text-blue-900"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="flex gap-3">
                  <div className="h-12 w-12 rounded-xl bg-slate-100" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 w-2/3 rounded bg-slate-100" />
                    <div className="h-3 w-1/3 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="mt-6 h-3 rounded bg-slate-100" />
                <div className="mt-2 h-3 w-4/5 rounded bg-slate-100" />
                <div className="mt-6 h-9 w-32 rounded-lg bg-slate-100" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="font-semibold text-red-800">
              Could not load opportunities
            </p>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => {
                setSearch((value) => value);
                setLocation((value) => value);
                setJobType((value) => value);
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-red-700 ring-1 ring-red-200 hover:bg-red-100"
            >
              <RefreshCw size={15} />
              Retry
            </button>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Search size={25} />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No opportunities found
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Try a different keyword or location, or clear the filters to see
              all available opportunities.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid items-stretch gap-4 xl:grid-cols-2">
            {opportunities.map((job) => {
              const isSaved = savedIds.includes(Number(job.id));
              const isSaving = savingIds.includes(Number(job.id));

              return (
                <article
                  key={job.id}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5 sm:p-6"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700 transition group-hover:bg-blue-100">
                      <Building2 size={22} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="break-words text-base font-bold leading-6 text-slate-900">
                        {job.title}
                      </h2>
                      <p className="mt-1 break-words text-sm font-medium text-slate-500">
                        {job.company?.name || "Company not specified"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleSave(job)}
                      disabled={isSaving}
                      aria-label={
                        isSaved
                          ? "Remove saved opportunity"
                          : "Save opportunity"
                      }
                      aria-pressed={isSaved}
                      title={isSaved ? "Remove from saved jobs" : "Save job"}
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition disabled:cursor-wait disabled:opacity-60 ${
                        isSaved
                          ? "border-blue-200 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      }`}
                    >
                      {isSaving ? (
                        <RefreshCw size={17} className="animate-spin" />
                      ) : (
                        <Bookmark
                          size={18}
                          fill={isSaved ? "currentColor" : "none"}
                        />
                      )}
                    </button>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                    {job.description || "No description available."}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
                      <MapPin size={14} className="shrink-0 text-blue-600" />
                      <span className="break-words">
                        {job.location || "Location not specified"}
                      </span>
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
                      <BriefcaseBusiness
                        size={14}
                        className="shrink-0 text-blue-600"
                      />
                      {job.jobType || "Type not specified"}
                    </span>
                  </div>

                  {job.salary && (
                    <p className="mt-4 text-sm font-semibold text-blue-700">
                      Salary: {job.salary}
                    </p>
                  )}

                  <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-slate-100 pt-5">
                    <Link
                      href={`/opportunities/${job.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                    >
                      View Details
                      <ArrowUpRight size={15} />
                    </Link>

                    {job.applicationLink ? (
                      <a
                        href={job.applicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/15 transition hover:bg-blue-700"
                      >
                        Apply / View
                        <ExternalLink size={15} />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">
                        Application link unavailable
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
