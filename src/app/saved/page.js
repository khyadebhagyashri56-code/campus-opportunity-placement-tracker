"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import {
  Bookmark,
  Building2,
  MapPin,
  BriefcaseBusiness,
  ExternalLink,
  Trash2,
} from "lucide-react";

export default function SavedPage() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchSavedJobs() {
      try {
        const response = await fetch("/api/saved-opportunities");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load saved opportunities.",
          );
        }

        setSavedJobs(data.savedOpportunities || []);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchSavedJobs();
  }, []);

  async function removeSavedJob(opportunityId) {
    setMessage("");
    setRemovingId(opportunityId);

    try {
      const response = await fetch("/api/saved-opportunities", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ opportunityId }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not remove saved job.");
      }

      setSavedJobs((previous) =>
        previous.filter((item) => item.opportunityId !== opportunityId),
      );
      setMessage("Opportunity removed from saved jobs.");
    } catch (err) {
      setMessage(err.message || "Something went wrong.");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 p-6 md:p-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3">
              <Bookmark className="h-6 w-6 text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Saved Opportunities
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Keep track of opportunities you want to apply for.
              </p>
            </div>
          </div>

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            {savedJobs.length} Saved
          </span>
        </div>

        {message && (
          <p role="status" className="mb-4 text-sm text-blue-700">
            {message}
          </p>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <p className="text-sm text-slate-500">
              Loading saved opportunities...
            </p>
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
          >
            {error}
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Bookmark className="h-8 w-8 text-slate-400" />
            </div>

            <h2 className="text-lg font-semibold text-slate-800">
              No saved opportunities yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Save interesting jobs from the Dashboard, and they will appear
              here.
            </p>

            <Link
              href="/dashboard"
              className="mt-5 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Explore Opportunities
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {savedJobs.map((item) => {
              const job = item.opportunity;

              if (!job) return null;

              return (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-blue-50 p-3">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="font-semibold text-slate-900">
                        {job.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-600">
                        {job.company?.name || "Company not specified"}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {job.description || "No description available."}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <MapPin size={15} />
                      {job.location || "Location not specified"}
                    </span>

                    <span className="flex items-center gap-1">
                      <BriefcaseBusiness size={15} />
                      {job.jobType || "Job type not specified"}
                    </span>
                  </div>

                  {job.salary && (
                    <p className="mt-3 text-sm font-semibold text-green-700">
                      Salary: {job.salary}
                    </p>
                  )}

                  <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
                    {job.applicationLink && (
                      <a
                        href={job.applicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        View Opportunity
                        <ExternalLink size={15} />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => removeSavedJob(item.opportunityId)}
                      disabled={removingId === item.opportunityId}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                    >
                      <Trash2 size={15} />
                      {removingId === item.opportunityId
                        ? "Removing..."
                        : "Remove"}
                    </button>
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
