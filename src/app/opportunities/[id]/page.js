"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  MapPin,
  BriefcaseBusiness,
  Building2,
  ExternalLink,
  IndianRupee,
  CalendarDays,
  Clock3,
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

export default function OpportunityDetailsPage() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    async function fetchOpportunity() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/opportunities/${id}`, {
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Could not load opportunity details.",
          );
        }

        setJob(data.opportunity);
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

    fetchOpportunity();

    return () => controller.abort();
  }, [id]);

  const postedDate = job?.createdAt
    ? new Date(job.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl space-y-6 pb-8">
        {/* Back navigation */}
        <Link
          href="/opportunities"
          className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-blue-700 transition hover:text-blue-900"
        >
          <ArrowLeft size={17} />
          Back to Opportunities
        </Link>

        {loading ? (
          <div className="animate-pulse space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="flex gap-4">
                <div className="h-16 w-16 rounded-2xl bg-slate-100" />
                <div className="flex-1 space-y-3 pt-2">
                  <div className="h-5 w-2/3 rounded bg-slate-100" />
                  <div className="h-4 w-1/3 rounded bg-slate-100" />
                </div>
              </div>
              <div className="mt-8 h-12 rounded-xl bg-slate-100" />
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-8">
              <div className="h-5 w-1/3 rounded bg-slate-100" />
              <div className="mt-5 h-3 rounded bg-slate-100" />
              <div className="mt-3 h-3 w-4/5 rounded bg-slate-100" />
            </div>
          </div>
        ) : error ? (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h1 className="text-lg font-semibold text-red-900">
              Unable to load opportunity
            </h1>
            <p className="mt-2 text-sm leading-6 text-red-700">{error}</p>
            <Link
              href="/opportunities"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-red-700 ring-1 ring-red-200 transition hover:bg-red-100"
            >
              <ArrowLeft size={16} />
              Return to Opportunities
            </Link>
          </section>
        ) : !job ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <BriefcaseBusiness size={25} />
            </div>
            <h1 className="mt-4 text-lg font-bold text-slate-900">
              Opportunity not found
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              This opportunity may have been removed or is no longer available.
            </p>
            <Link
              href="/opportunities"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <ArrowLeft size={16} />
              Browse Opportunities
            </Link>
          </section>
        ) : (
          <>
            {/* Opportunity header */}
            <section className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-white to-blue-50 p-6 shadow-sm sm:p-8">
              <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-blue-100/60 blur-3xl" />

              <div className="relative">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-white text-blue-700 shadow-sm">
                    <Building2 size={30} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-semibold text-blue-700">
                      <BriefcaseBusiness size={13} />
                      Career opportunity
                    </div>

                    <h1 className="mt-3 break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                      {job.title}
                    </h1>

                    <p className="mt-2 break-words text-base font-medium text-slate-600">
                      {job.company?.name || "Company not specified"}
                    </p>

                    {postedDate && (
                      <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-500">
                        <CalendarDays size={14} />
                        Posted on {postedDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Job information */}
                <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white/90 p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                      <MapPin size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-500">
                        Location
                      </p>
                      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                        {job.location || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white/90 p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                      <BriefcaseBusiness size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-500">
                        Job type
                      </p>
                      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                        {job.jobType || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {job.salary && (
                    <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white/90 p-4 sm:col-span-2 lg:col-span-1">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                        <IndianRupee size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-500">
                          Salary / Stipend
                        </p>
                        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                          {job.salary}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Application action */}
                <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-blue-100 pt-6">
                  {job.applicationLink ? (
                    <a
                      href={job.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                    >
                      Apply on Company Website
                      <ExternalLink size={16} />
                    </a>
                  ) : (
                    <p className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
                      Application link is not available.
                    </p>
                  )}

                  <Link
                    href="/opportunities"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  >
                    Explore more jobs
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            </section>

            {/* Job description */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <BriefcaseBusiness size={19} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Job Description
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Role details and responsibilities
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <p className="whitespace-pre-line break-words text-sm leading-7 text-slate-600">
                  {job.description || "No description available."}
                </p>
              </div>
            </section>

            {/* Additional information */}
            <section className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700">
                <Clock3 size={18} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Before you apply
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Review the role details and eligibility requirements on the
                  company website before submitting your application.
                </p>
              </div>
            </section>
          </>
        )}
      </div>
    </MainLayout>
  );
}
