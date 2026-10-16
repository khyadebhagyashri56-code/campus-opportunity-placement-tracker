"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import {
  MapPin,
  BriefcaseBusiness,
  ExternalLink,
  Building2,
  Search,
  RotateCcw,
  Bookmark,
  Check,
  ClipboardList,
} from "lucide-react";

export default function DashboardPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [trackedIds, setTrackedIds] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [trackMessage, setTrackMessage] = useState("");

  const [savingId, setSavingId] = useState(null);
  const [trackingId, setTrackingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedJobType, setSelectedJobType] = useState("All");

  useEffect(() => {
    async function loadData() {
      try {
        const [jobsResponse, savedResponse, applicationsResponse] =
          await Promise.all([
            fetch("/api/opportunities"),
            fetch("/api/saved-opportunities"),
            fetch("/api/applications"),
          ]);

        const jobsData = await jobsResponse.json();
        const savedData = await savedResponse.json();

        if (!jobsResponse.ok || !jobsData.success) {
          throw new Error(jobsData.message || "Failed to load opportunities.");
        }

        setOpportunities(jobsData.opportunities || []);

        if (savedResponse.ok && savedData.success) {
          setSavedIds(
            (savedData.savedOpportunities || []).map(
              (item) => item.opportunityId,
            ),
          );
        }

        if (applicationsResponse.ok) {
          const applicationsData = await applicationsResponse.json();

          if (applicationsData.success) {
            setTrackedIds(
              (applicationsData.applications || []).map(
                (item) => item.opportunityId,
              ),
            );
          }
        }
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleSave(jobId) {
    setSaveMessage("");
    setSavingId(jobId);

    try {
      const response = await fetch("/api/saved-opportunities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ opportunityId: jobId }),
      });

      const data = await response.json();

      if (response.status === 401) {
        setSaveMessage("Please log in to save opportunities.");
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not save this opportunity.");
      }

      setSavedIds((previous) =>
        previous.includes(jobId) ? previous : [...previous, jobId],
      );

      setSaveMessage("Opportunity saved successfully.");
    } catch (err) {
      setSaveMessage(err.message || "Something went wrong.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleTrack(jobId) {
    setTrackMessage("");
    setTrackingId(jobId);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ opportunityId: jobId }),
      });

      const data = await response.json();

      if (response.status === 401) {
        setTrackMessage("Please log in to track applications.");
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not track this application.");
      }

      setTrackedIds((previous) =>
        previous.includes(jobId) ? previous : [...previous, jobId],
      );

      setTrackMessage("Application added to your tracker successfully.");
    } catch (err) {
      setTrackMessage(err.message || "Something went wrong.");
    } finally {
      setTrackingId(null);
    }
  }

  const locations = [
    "All",
    ...new Set(
      opportunities.map((job) => job.location?.trim()).filter(Boolean),
    ),
  ];

  const jobTypes = [
    "All",
    ...new Set(opportunities.map((job) => job.jobType?.trim()).filter(Boolean)),
  ];

  const filteredOpportunities = opportunities.filter((job) => {
    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      (job.title || "").toLowerCase().includes(search) ||
      (job.company?.name || "").toLowerCase().includes(search);

    const matchesLocation =
      selectedLocation === "All" ||
      (job.location || "").trim().toLowerCase() ===
        selectedLocation.toLowerCase();

    const matchesJobType =
      selectedJobType === "All" ||
      (job.jobType || "").trim().toLowerCase() ===
        selectedJobType.toLowerCase();

    return matchesSearch && matchesLocation && matchesJobType;
  });

  function clearFilters() {
    setSearchTerm("");
    setSelectedLocation("All");
    setSelectedJobType("All");
  }

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    selectedLocation !== "All" ||
    selectedJobType !== "All";

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome to your Campus Opportunity &amp; Placement Tracker.
          </p>
        </div>

        {saveMessage && (
          <div
            role="status"
            className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800"
          >
            {saveMessage}
          </div>
        )}

        {trackMessage && (
          <div
            role="status"
            className="rounded-lg border border-indigo-100 bg-indigo-50 p-3 text-sm text-indigo-800"
          >
            {trackMessage}
          </div>
        )}

        <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Latest Opportunities
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Find jobs and campus placement opportunities.
              </p>
            </div>

            <span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
              {loading ? "Loading..." : `${filteredOpportunities.length} Jobs`}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search company or job role..."
                aria-label="Search company or job role"
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={selectedLocation}
              onChange={(event) => setSelectedLocation(event.target.value)}
              aria-label="Filter by location"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location === "All" ? "All Locations" : location}
                </option>
              ))}
            </select>

            <select
              value={selectedJobType}
              onChange={(event) => setSelectedJobType(event.target.value)}
              aria-label="Filter by job type"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {jobTypes.map((jobType) => (
                <option key={jobType} value={jobType}>
                  {jobType === "All" ? "All Job Types" : jobType}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-gray-500">
                Showing {filteredOpportunities.length} of {opportunities.length}{" "}
                opportunities
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
              >
                <RotateCcw size={15} />
                Clear Filters
              </button>
            </div>
          )}

          <div className="mt-6 border-t border-gray-100 pt-5">
            {loading ? (
              <p className="py-8 text-center text-sm text-gray-500">
                Loading opportunities...
              </p>
            ) : error ? (
              <div
                role="alert"
                className="rounded-lg bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </div>
            ) : opportunities.length === 0 ? (
              <div className="py-10 text-center">
                <Building2 size={36} className="mx-auto text-gray-300" />
                <h3 className="mt-3 font-semibold text-gray-900">
                  No opportunities yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add an opportunity to your database to see it here.
                </p>
              </div>
            ) : filteredOpportunities.length === 0 ? (
              <div className="py-10 text-center">
                <Search size={36} className="mx-auto text-gray-300" />
                <h3 className="mt-3 font-semibold text-gray-900">
                  No matching opportunities found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try another search term or change your filters.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredOpportunities.map((job) => {
                  const isSaved = savedIds.includes(job.id);
                  const isTracked = trackedIds.includes(job.id);

                  return (
                    <article
                      key={job.id}
                      className="rounded-xl border border-gray-200 p-5 transition hover:border-blue-300 hover:shadow-md"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-blue-50 p-3">
                          <Building2 size={22} className="text-blue-600" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {job.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">
                            {job.company?.name || "Company not specified"}
                          </p>
                        </div>
                      </div>

                      <p className="mt-4 text-sm leading-6 text-gray-600">
                        {job.description || "No description available."}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600">
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

                      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
                        <button
                          type="button"
                          onClick={() => handleSave(job.id)}
                          disabled={isSaved || savingId === job.id}
                          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                            isSaved
                              ? "cursor-default bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          } disabled:opacity-70`}
                        >
                          {isSaved ? (
                            <Check size={16} />
                          ) : (
                            <Bookmark size={16} />
                          )}

                          {savingId === job.id
                            ? "Saving..."
                            : isSaved
                              ? "Saved"
                              : "Save Job"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTrack(job.id)}
                          disabled={isTracked || trackingId === job.id}
                          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                            isTracked
                              ? "cursor-default bg-indigo-50 text-indigo-700"
                              : "bg-indigo-600 text-white hover:bg-indigo-700"
                          } disabled:opacity-70`}
                        >
                          {isTracked ? (
                            <Check size={16} />
                          ) : (
                            <ClipboardList size={16} />
                          )}

                          {trackingId === job.id
                            ? "Adding..."
                            : isTracked
                              ? "Tracking"
                              : "Track Application"}
                        </button>

                        {job.applicationLink ? (
                          <a
                            href={job.applicationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            View Opportunity
                            <ExternalLink size={15} />
                          </a>
                        ) : (
                          <span className="text-sm text-gray-400">
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
        </section>
      </div>
    </MainLayout>
  );
}
