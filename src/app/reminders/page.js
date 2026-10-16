"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import {
  BellRing,
  Plus,
  CalendarDays,
  Clock3,
  BriefcaseBusiness,
  Trash2,
  CheckCircle2,
  X,
  ClipboardList,
} from "lucide-react";

const reminderTypes = [
  "Application Deadline",
  "Interview",
  "Online Assessment",
  "Follow-up",
  "Other",
];

export default function RemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [type, setType] = useState("Application Deadline");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Load reminders from PostgreSQL
  useEffect(() => {
    async function loadReminders() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/reminders");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load reminders.");
        }

        setReminders(data.reminders || []);
      } catch (err) {
        setError(err.message || "Failed to load reminders.");
      } finally {
        setLoading(false);
      }
    }

    loadReminders();
  }, []);

  function resetForm() {
    setTitle("");
    setCompany("");
    setType("Application Deadline");
    setDate("");
    setNotes("");
    setShowForm(false);
  }

  // Save a new reminder through the API
  async function addReminder(e) {
    e.preventDefault();

    if (!title.trim() || !date) return;

    try {
      setSaving(true);
      setError("");
      setNotice("");

      const response = await fetch("/api/reminders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          company: company.trim(),
          type,
          date: new Date(date).toISOString(),
          notes: notes.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create reminder.");
      }

      setReminders((prev) => [...prev, data.reminder]);

      resetForm();
      setNotice("Reminder created successfully.");
    } catch (err) {
      setError(err.message || "Failed to create reminder.");
    } finally {
      setSaving(false);
    }
  }

  // Update completion status in PostgreSQL
  async function toggleReminder(id, completed) {
    try {
      setError("");
      setNotice("");

      const response = await fetch(`/api/reminders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !completed }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update reminder.");
      }

      setReminders((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, completed: !completed } : item,
        ),
      );

      setNotice(
        !completed
          ? "Reminder marked as completed."
          : "Reminder marked as pending.",
      );
    } catch (err) {
      setError(err.message || "Failed to update reminder.");
    }
  }

  // Delete reminder from PostgreSQL
  async function deleteReminder(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this reminder?",
    );

    if (!confirmed) return;

    try {
      setError("");
      setNotice("");

      const response = await fetch(`/api/reminders/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete reminder.");
      }

      setReminders((prev) => prev.filter((item) => item.id !== id));

      setNotice("Reminder deleted successfully.");
    } catch (err) {
      setError(err.message || "Failed to delete reminder.");
    }
  }

  const pending = reminders.filter((item) => !item.completed).length;

  const completed = reminders.filter((item) => item.completed).length;

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50";

  const labelClass = "text-sm font-semibold text-gray-700";

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl space-y-6 pb-10">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-700">
              <BellRing size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Reminders
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Stay organized throughout your placement journey.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setError("");
              setNotice("");
              setShowForm(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Plus size={18} />
            Create Reminder
          </button>
        </header>

        {error && (
          <div
            role="alert"
            className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {notice && !error && (
          <div
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
          >
            {notice}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-sm font-medium text-gray-500">Total reminders</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {reminders.length}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
            <p className="text-sm font-medium text-amber-700">Pending</p>
            <p className="mt-2 text-3xl font-bold text-amber-900">{pending}</p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
            <p className="text-sm font-medium text-emerald-700">Completed</p>
            <p className="mt-2 text-3xl font-bold text-emerald-900">
              {completed}
            </p>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-950/50 p-3 backdrop-blur-sm sm:p-6">
            <div className="my-auto w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
              <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5 sm:px-8">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600">
                    <CalendarDays size={15} />
                    Placement planner
                  </div>
                  <h2 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">
                    Create a reminder
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Plan your next application, interview, or assessment.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetForm}
                  aria-label="Close reminder form"
                  className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                >
                  <X size={21} />
                </button>
              </div>

              <form onSubmit={addReminder}>
                <div className="grid md:grid-cols-2">
                  <div className="space-y-5 p-6 sm:p-8">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                        <ClipboardList size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          Reminder details
                        </h3>
                        <p className="text-xs text-gray-500">
                          What do you need to remember?
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Reminder title *</label>
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Submit job application"
                        required
                        maxLength={150}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Reminder type *</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className={inputClass}
                      >
                        {reminderTypes.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Company name</label>
                      <div className="relative">
                        <BriefcaseBusiness
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="e.g. Infosys"
                          maxLength={100}
                          className={`${inputClass} pl-11`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5 border-t border-gray-100 bg-gray-50/70 p-6 md:border-l md:border-t-0 sm:p-8">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-violet-100 p-2.5 text-violet-700">
                        <Clock3 size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Schedule</h3>
                        <p className="text-xs text-gray-500">
                          Choose your date and time.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Date and time *</label>
                      <input
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={new Date(
                          Date.now() - new Date().getTimezoneOffset() * 60000,
                        )
                          .toISOString()
                          .slice(0, 16)}
                        required
                        className={inputClass}
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Select when the task or event is due.
                      </p>
                    </div>

                    <div>
                      <label className={labelClass}>Notes (optional)</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add any details you may need..."
                        rows={4}
                        maxLength={1000}
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                      <p className="text-sm font-semibold text-indigo-900">
                        <BellRing size={16} className="mr-2 inline" />
                        Stay on track
                      </p>
                      <p className="mt-1 text-xs leading-5 text-indigo-800">
                        Keep your placement tasks organized and mark them
                        complete when you finish.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-white px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={saving}
                    className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Plus size={17} />
                    {saving ? "Saving..." : "Create Reminder"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-2">
            <CalendarDays size={20} className="text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-900">Your reminders</h2>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm text-gray-500">
              Loading reminders...
            </div>
          ) : reminders.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <BellRing size={25} />
              </div>
              <h3 className="font-semibold text-gray-900">
                Nothing scheduled yet
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Create a reminder to keep your placement journey on track.
              </p>
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setShowForm(true);
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-indigo-200 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
              >
                <Plus size={16} />
                Add your first reminder
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {reminders.map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-col justify-between gap-4 rounded-xl border p-4 sm:flex-row sm:items-center ${
                    item.completed
                      ? "border-emerald-200 bg-emerald-50/50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                      <BriefcaseBusiness size={19} />
                    </div>
                    <div>
                      <h3
                        className={`font-semibold ${
                          item.completed
                            ? "text-gray-400 line-through"
                            : "text-gray-900"
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs text-indigo-600">
                        {item.type}
                        {item.company ? ` · ${item.company}` : ""}
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                        <Clock3 size={15} />
                        {new Date(item.date).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                      {item.notes && (
                        <p className="mt-2 text-sm text-gray-500">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleReminder(item.id, item.completed)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                    >
                      <CheckCircle2 size={15} />
                      {item.completed ? "Undo" : "Complete"}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteReminder(item.id)}
                      aria-label="Delete reminder"
                      className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
