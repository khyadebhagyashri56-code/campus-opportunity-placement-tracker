
"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import {
  BriefcaseBusiness,
  Building2,
  ExternalLink,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

const statuses = [
  "APPLIED",
  "TEST",
  "INTERVIEW",
  "SELECTED",
  "REJECTED",
];

const statusLabels = {
  APPLIED: "Applied",
  TEST: "Test",
  INTERVIEW: "Interview",
  SELECTED: "Selected",
  REJECTED: "Rejected",
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadApplications() {
      try {
        const response = await fetch("/api/applications");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load applications."
          );
        }

        setApplications(data.applications || []);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, []);

  async function updateStatus(applicationId, status) {
    setUpdatingId(applicationId);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, status }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update status.");
      }

      setApplications((previous) =>
        previous.map((application) =>
          application.id === applicationId
            ? { ...application, status }
            : application
        )
      );

      setMessage("Application status updated.");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setUpdatingId(null);
    }
  }

  const counts = {
    total: applications.length,
    applied: applications.filter((a) => a.status === "APPLIED").length,
    interview: applications.filter((a) => a.status === "INTERVIEW").length,
    selected: applications.filter((a) => a.status === "SELECTED").length,
  };

  return (
    <MainLayout>
      <div className="space-y-6 p-1">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Application Tracker
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Track your job applications and update their progress.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total Applications", value: counts.total },
            { label: "Applied", value: counts.applied },
            { label: "Interviews", value: counts.interview },
            { label: "Selected", value: counts.selected },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {message && (
          <p role="status" className="text-sm text-green-700">
            {message}
          </p>
        )}

        {error && (
          <div role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-xl border bg-white p-10 text-center text-gray-500">
            Loading applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-14 text-center">
            <BriefcaseBusiness className="mx-auto h-10 w-10 text-gray-300" />
            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              No applications yet
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Add a job to your tracker from the Dashboard to see it here.
            </p>
            <a
              href="/dashboard"
              className="mt-5 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Explore Opportunities
            </a>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900">
                Your Applications
              </h2>
            </div>

            <div className="divide-y divide-gray-100">
              {applications.map((application) => {
                const job = application.opportunity;

                return (
                  <article
                    key={application.id}
                    className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-blue-50 p-3">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {job?.title || "Opportunity"}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {job?.company?.name || "Company not specified"}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <BriefcaseBusiness size={14} />
                            {job?.jobType || "Job type not specified"}
                          </span>
                          <span className="flex items-center gap-1">
                            <CalendarDays size={14} />
                            Applied{" "}
                            {new Date(application.appliedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <select
                        aria-label={`Status for ${job?.title || "application"}`}
                        value={application.status}
                        disabled={updatingId === application.id}
                        onChange={(event) =>
                          updateStatus(application.id, event.target.value)
                        }
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {statusLabels[status]}
                          </option>
                        ))}
                      </select>

                      {job?.applicationLink && (
                        <a
                          href={job.applicationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          View Job <ExternalLink size={14} />
                        </a>
                      )}

                      {updatingId === application.id && (
                        <RefreshCw size={16} className="animate-spin text-blue-600" />
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
