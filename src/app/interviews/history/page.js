"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import { ArrowLeft, Clock, Trophy, RefreshCw } from "lucide-react";

export default function InterviewHistoryPage() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadHistory() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/interviews", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Could not load interview history.");
        return;
      }

      setAttempts(data.attempts || []);
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        <Link
          href="/interviews"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600"
        >
          <ArrowLeft size={17} />
          Back to Interviews
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Interview History
            </h1>
            <p className="mt-2 text-gray-600">
              Review your previous practice sessions and scores.
            </p>
          </div>

          <button
            type="button"
            onClick={loadHistory}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-600">
            Loading interview history...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        ) : attempts.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
            <Clock className="mx-auto text-gray-400" size={36} />
            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              No interviews yet
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Complete a practice interview to see your results here.
            </p>
            <Link
              href="/interviews"
              className="mt-5 inline-flex rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Start Practicing
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {attempts.map((attempt) => {
              const percentage =
                attempt.totalMarks > 0
                  ? Math.round((attempt.score / attempt.totalMarks) * 100)
                  : 0;

              return (
                <div
                  key={attempt.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        {attempt.interviewType}
                      </h2>
                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(attempt.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <Trophy className="shrink-0 text-indigo-600" size={22} />
                  </div>

                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Practice Score</p>
                      <p className="mt-1 text-2xl font-bold text-indigo-700">
                        {attempt.score}/{attempt.totalMarks}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-700">
                      {percentage}%
                    </p>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-indigo-600"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <p className="mt-3 text-xs text-gray-500">
                    {attempt.answers?.length || 0} answers saved
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
