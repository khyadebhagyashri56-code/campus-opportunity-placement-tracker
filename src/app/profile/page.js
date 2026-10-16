"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  FileText,
  Upload,
  UserRound,
  GraduationCap,
  Mail,
  Phone,
  Building2,
  CalendarDays,
  Code2,
  Save,
  LoaderCircle,
  Trash2,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photo, setPhoto] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [resume, setResume] = useState(null);
  const [savedResumeName, setSavedResumeName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [removingPhoto, setRemovingPhoto] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    course: "",
    graduationYear: "",
    skills: "",
  });

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const response = await fetch("/api/profile", {
          cache: "no-store",
        });

        if (response.status === 401) {
          router.replace("/login");
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Profile load failed.");
        }

        if (cancelled) return;

        const user = data.user;

        setForm({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          college: user.college || "",
          course: user.course || "",
          graduationYear: user.graduationYear
            ? String(user.graduationYear)
            : "",
          skills: user.skills || "",
        });

        setPhoto(user.profilePhoto || "");
        setSavedResumeName(user.resumeName || "");
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Profile load nahi ho paya.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [router]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
    setError("");
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Photo size must be 2 MB or less.");
      event.target.value = "";
      return;
    }

    setPhotoFile(file);
    setPhoto(URL.createObjectURL(file));
    setMessage("");
    setError("");
  }

  function handleResumeChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (
      file.type !== "application/pdf" ||
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please upload your resume in PDF format.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Resume size must be 5 MB or less.");
      event.target.value = "";
      return;
    }

    setResume(file);
    setMessage("");
    setError("");
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();

      formData.append("name", form.name.trim());
      formData.append("phone", form.phone.trim());
      formData.append("college", form.college.trim());
      formData.append("course", form.course.trim());
      formData.append("graduationYear", form.graduationYear);
      formData.append("skills", form.skills.trim());

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      if (resume) {
        formData.append("resume", resume);
      }

      const response = await fetch("/api/profile", {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Profile save failed.");
      }

      const user = data.user;

      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        college: user.college || "",
        course: user.course || "",
        graduationYear: user.graduationYear ? String(user.graduationYear) : "",
        skills: user.skills || "",
      });

      setPhoto(user.profilePhoto || "");
      setSavedResumeName(user.resumeName || "");
      setPhotoFile(null);
      setResume(null);
      setMessage("Profile saved successfully!");

      // Update the name and email shown in the Navbar.
      window.dispatchEvent(new Event("profile-updated"));
    } catch (err) {
      setError(err.message || "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  }
  async function handleRemovePhoto() {
    if (!photo && !photoFile) return;

    // Agar nayi photo abhi save nahi hui, sirf selection cancel karo.
    if (photoFile) {
      setPhoto("");
      setPhotoFile(null);
      setMessage("Selected photo removed.");
      setError("");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to remove your profile photo?",
    );

    if (!confirmed) return;

    setRemovingPhoto(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/profile", {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to remove photo.");
      }

      setPhoto("");
      setPhotoFile(null);
      setMessage("Profile photo removed successfully!");

      // Navbar ko turant update karo.
      window.dispatchEvent(new Event("profile-updated"));
    } catch (err) {
      setError(err.message || "Unable to remove photo.");
    } finally {
      setRemovingPhoto(false);
    }
  }

  const fields = [
    {
      name: "name",
      label: "Full Name",
      placeholder: "Enter your full name",
      icon: UserRound,
      required: true,
    },
    {
      name: "email",
      label: "Email Address",
      placeholder: "Your email address",
      icon: Mail,
      readOnly: true,
    },
    {
      name: "phone",
      label: "Phone Number",
      placeholder: "Enter phone number",
      icon: Phone,
    },
    {
      name: "college",
      label: "College Name",
      placeholder: "Enter your college name",
      icon: Building2,
    },
    {
      name: "course",
      label: "Course / Degree",
      placeholder: "e.g. B.E. Information Technology",
      icon: GraduationCap,
    },
    {
      name: "graduationYear",
      label: "Graduation Year",
      placeholder: "e.g. 2027",
      icon: CalendarDays,
    },
    {
      name: "skills",
      label: "Technical Skills",
      placeholder: "Java, React, SQL, Next.js...",
      icon: Code2,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center gap-2 text-slate-500">
        <LoaderCircle className="animate-spin" size={20} />
        Loading profile...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="mb-7">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            My Profile
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage your personal information, academic details and resume.
          </p>
        </div>

        {message && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700"
          >
            {message}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Profile Photo
            </h2>

            <div className="mt-5 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-blue-50 text-blue-600">
                {photo ? (
                  <img
                    src={photo}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound size={40} />
                )}
              </div>

              <div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  <Camera size={17} />
                  Choose Photo
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>

                <p className="mt-2 text-xs text-slate-500">
                  JPG, PNG or WebP · Maximum 2 MB
                </p>
              </div>
            </div>
            {(photo || photoFile) && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                disabled={removingPhoto}
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 size={16} />
                {removingPhoto ? "Removing..." : "Remove Photo"}
              </button>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Personal & Academic Details
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {fields.map((field) => {
                const Icon = field.icon;

                return (
                  <div
                    key={field.name}
                    className={field.name === "skills" ? "sm:col-span-2" : ""}
                  >
                    <label
                      htmlFor={field.name}
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      {field.label}
                    </label>

                    <div className="relative">
                      <Icon
                        size={18}
                        className="absolute left-3 top-3 text-slate-400"
                      />

                      <input
                        id={field.name}
                        name={field.name}
                        type="text"
                        value={form[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        readOnly={field.readOnly}
                        required={field.required}
                        className={`w-full rounded-lg border border-slate-300 py-3 pl-10 pr-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                          field.readOnly ? "bg-slate-50" : "bg-white"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">My Resume</h2>

            <p className="mt-2 text-sm text-slate-500">
              Upload your latest resume in PDF format.
            </p>

            <label className="mt-5 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-slate-300 px-5 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50/50">
              <Upload size={28} className="text-blue-600" />

              <span className="mt-3 text-sm font-semibold text-slate-800">
                Choose your resume PDF
              </span>

              <span className="mt-1 text-xs text-slate-500">
                Maximum file size: 5 MB
              </span>

              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleResumeChange}
                className="hidden"
              />
            </label>

            {(resume || savedResumeName) && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <FileText size={25} className="shrink-0 text-blue-600" />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {resume?.name || savedResumeName}
                  </p>

                  <p className="text-xs text-slate-500">
                    {resume
                      ? `${(resume.size / 1024 / 1024).toFixed(2)} MB · Ready to upload`
                      : "Previously saved resume"}
                  </p>
                </div>
              </div>
            )}
          </section>

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {saving ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Profile
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
