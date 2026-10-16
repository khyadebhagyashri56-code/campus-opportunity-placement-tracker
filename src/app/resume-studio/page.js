"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import {
  User,
  GraduationCap,
  Code2,
  Award,
  Download,
  Eye,
  Plus,
  Trash2,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Link as LinkIcon,
} from "lucide-react";

const initialResume = {
  name: "",
  role: "Full Stack Developer",
  email: "",
  phone: "",
  location: "",
  summary: "",
  skills: "",
  education: [
    {
      degree: "B.E. Information Technology",
      college: "",
      year: "2027",
      score: "",
    },
  ],
  projects: [
    {
      name: "Campus Opportunity & Placement Tracker",
      description:
        "A web application to track campus opportunities, placements and job applications.",
      technologies: "Next.js, React, JavaScript, PostgreSQL, Prisma",
    },
  ],
  achievements: "",
  github: "",
  linkedin: "",
};

const tabs = [
  { id: "personal", label: "Personal Details", icon: User },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "projects", label: "Projects", icon: Code2 },
  { id: "skills", label: "Skills & Achievements", icon: Award },
];

const inputClass =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-black placeholder:text-gray-500 outline-none focus:border-black focus:ring-1 focus:ring-black";

export default function ResumeStudioPage() {
  const [resume, setResume] = useState(initialResume);
  const [activeTab, setActiveTab] = useState("personal");
  const [showPreview, setShowPreview] = useState(false);

  function updateField(field, value) {
    setResume((prev) => ({ ...prev, [field]: value }));
  }

  function updateEducation(index, field, value) {
    setResume((prev) => ({
      ...prev,
      education: prev.education.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  }

  function updateProject(index, field, value) {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  }

  function downloadResume() {
    window.print();
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 p-4 text-black md:p-8">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-black">
                <Sparkles size={17} />
                CAREER TOOLS
              </div>
              <h1 className="text-3xl font-bold text-black">Resume Studio</h1>
              <p className="mt-2 text-sm text-black">
                Create and preview your professional fresher resume.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowPreview((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-gray-100"
              >
                <Eye size={18} />
                {showPreview ? "Edit Resume" : "Preview Resume"}
              </button>

              <button
                onClick={downloadResume}
                className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
              >
                <Download size={18} />
                Download / Print
              </button>
            </div>
          </header>

          {!showPreview ? (
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
              <aside className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
                <p className="px-3 pb-3 pt-2 text-xs font-bold uppercase tracking-wider text-black">
                  Resume Sections
                </p>

                <div className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const selected = activeTab === tab.id;

                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold ${
                          selected
                            ? "bg-gray-200 text-black"
                            : "text-black hover:bg-gray-100"
                        }`}
                      >
                        <Icon size={19} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 rounded-xl bg-gray-100 p-4">
                  <p className="text-sm font-bold text-black">Resume tip</p>
                  <p className="mt-2 text-xs leading-5 text-black">
                    Use accurate skills, real project details and genuine
                    achievements. Review everything before applying.
                  </p>
                </div>
              </aside>

              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-8">
                {activeTab === "personal" && (
                  <>
                    <SectionHeading
                      icon={User}
                      title="Personal Details"
                      subtitle="Add your contact information and professional summary."
                    />

                    <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">
                      <InputField
                        label="Full Name"
                        value={resume.name}
                        onChange={(v) => updateField("name", v)}
                        placeholder="Enter your full name"
                      />
                      <InputField
                        label="Target Job Role"
                        value={resume.role}
                        onChange={(v) => updateField("role", v)}
                        placeholder="e.g. Java Developer"
                      />
                      <InputField
                        label="Email Address"
                        value={resume.email}
                        onChange={(v) => updateField("email", v)}
                        placeholder="you@example.com"
                        type="email"
                      />
                      <InputField
                        label="Phone Number"
                        value={resume.phone}
                        onChange={(v) => updateField("phone", v)}
                        placeholder="Enter phone number"
                      />
                      <InputField
                        label="Location"
                        value={resume.location}
                        onChange={(v) => updateField("location", v)}
                        placeholder="City, State"
                      />
                      <InputField
                        label="GitHub Profile URL"
                        value={resume.github}
                        onChange={(v) => updateField("github", v)}
                        placeholder="https://github.com/username"
                      />
                      <InputField
                        label="LinkedIn Profile URL"
                        value={resume.linkedin}
                        onChange={(v) => updateField("linkedin", v)}
                        placeholder="https://linkedin.com/in/username"
                      />

                      <TextAreaField
                        label="Professional Summary"
                        value={resume.summary}
                        onChange={(v) => updateField("summary", v)}
                        placeholder="Write a short summary of your education, technical skills and career goals."
                        rows={5}
                        className="md:col-span-2"
                      />
                    </div>
                  </>
                )}

                {activeTab === "education" && (
                  <>
                    <SectionHeading
                      icon={GraduationCap}
                      title="Education"
                      subtitle="Add your degree, college and academic scores."
                    />

                    <div className="mt-7 space-y-5">
                      {resume.education.map((item, index) => (
                        <div
                          key={index}
                          className="rounded-xl border border-gray-200 p-5"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <h3 className="font-bold text-black">
                              Education {index + 1}
                            </h3>
                            <button
                              onClick={() =>
                                setResume((prev) => ({
                                  ...prev,
                                  education: prev.education.filter(
                                    (_, i) => i !== index,
                                  ),
                                }))
                              }
                              className="p-2 text-black hover:bg-gray-100 rounded-lg"
                              aria-label="Remove education"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <InputField
                              label="Degree"
                              value={item.degree}
                              onChange={(v) =>
                                updateEducation(index, "degree", v)
                              }
                              placeholder="B.E. Information Technology"
                            />
                            <InputField
                              label="College / Institution"
                              value={item.college}
                              onChange={(v) =>
                                updateEducation(index, "college", v)
                              }
                              placeholder="College name"
                            />
                            <InputField
                              label="Graduation Year"
                              value={item.year}
                              onChange={(v) =>
                                updateEducation(index, "year", v)
                              }
                              placeholder="2027"
                            />
                            <InputField
                              label="CGPA / Percentage"
                              value={item.score}
                              onChange={(v) =>
                                updateEducation(index, "score", v)
                              }
                              placeholder="Enter actual score"
                            />
                          </div>
                        </div>
                      ))}

                      <AddButton
                        onClick={() =>
                          setResume((prev) => ({
                            ...prev,
                            education: [
                              ...prev.education,
                              { degree: "", college: "", year: "", score: "" },
                            ],
                          }))
                        }
                      >
                        Add Education
                      </AddButton>
                    </div>
                  </>
                )}

                {activeTab === "projects" && (
                  <>
                    <SectionHeading
                      icon={Code2}
                      title="Projects"
                      subtitle="Show projects that demonstrate your technical skills."
                    />

                    <div className="mt-7 space-y-5">
                      {resume.projects.map((item, index) => (
                        <div
                          key={index}
                          className="rounded-xl border border-gray-200 p-5"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <h3 className="font-bold text-black">
                              Project {index + 1}
                            </h3>
                            <button
                              onClick={() =>
                                setResume((prev) => ({
                                  ...prev,
                                  projects: prev.projects.filter(
                                    (_, i) => i !== index,
                                  ),
                                }))
                              }
                              className="rounded-lg p-2 text-black hover:bg-gray-100"
                              aria-label="Remove project"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>

                          <div className="space-y-4">
                            <InputField
                              label="Project Name"
                              value={item.name}
                              onChange={(v) => updateProject(index, "name", v)}
                              placeholder="Project name"
                            />
                            <TextAreaField
                              label="Project Description"
                              value={item.description}
                              onChange={(v) =>
                                updateProject(index, "description", v)
                              }
                              placeholder="Explain the problem your project solves and its key features."
                            />
                            <InputField
                              label="Technologies Used"
                              value={item.technologies}
                              onChange={(v) =>
                                updateProject(index, "technologies", v)
                              }
                              placeholder="JavaScript, React, PostgreSQL"
                            />
                          </div>
                        </div>
                      ))}

                      <AddButton
                        onClick={() =>
                          setResume((prev) => ({
                            ...prev,
                            projects: [
                              ...prev.projects,
                              { name: "", description: "", technologies: "" },
                            ],
                          }))
                        }
                      >
                        Add Project
                      </AddButton>
                    </div>
                  </>
                )}

                {activeTab === "skills" && (
                  <>
                    <SectionHeading
                      icon={Award}
                      title="Skills & Achievements"
                      subtitle="Highlight relevant technical skills and accomplishments."
                    />

                    <div className="mt-7 space-y-6">
                      <TextAreaField
                        label="Technical Skills"
                        value={resume.skills}
                        onChange={(v) => updateField("skills", v)}
                        placeholder="Java, JavaScript, React, Next.js, SQL, Git..."
                      />
                      <TextAreaField
                        label="Achievements & Certifications"
                        value={resume.achievements}
                        onChange={(v) => updateField("achievements", v)}
                        placeholder="Add genuine achievements, hackathons and certifications."
                      />
                    </div>
                  </>
                )}

                <div className="mt-8 flex justify-between border-t border-gray-200 pt-5">
                  <button
                    disabled={activeTab === "personal"}
                    onClick={() =>
                      setActiveTab(
                        tabs[tabs.findIndex((t) => t.id === activeTab) - 1].id,
                      )
                    }
                    className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-40"
                  >
                    Previous
                  </button>

                  {activeTab !== "skills" ? (
                    <button
                      onClick={() =>
                        setActiveTab(
                          tabs[tabs.findIndex((t) => t.id === activeTab) + 1]
                            .id,
                        )
                      }
                      className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
                    >
                      Next Section
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowPreview(true)}
                      className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
                    >
                      Preview Resume
                    </button>
                  )}
                </div>
              </section>
            </div>
          ) : (
            <ResumePreview
              resume={resume}
              onEdit={() => setShowPreview(false)}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}

function SectionHeading({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-xl bg-gray-100 p-3 text-black">
        <Icon size={22} />
      </div>
      <div>
        <h2 className="text-xl font-bold text-black">{title}</h2>
        <p className="mt-1 text-sm text-black">{subtitle}</p>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-black">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  className = "",
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-semibold text-black">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

function AddButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-xl border border-dashed border-gray-400 px-4 py-3 text-sm font-semibold text-black hover:bg-gray-100"
    >
      <Plus size={17} />
      {children}
    </button>
  );
}

function ResumePreview({ resume, onEdit }) {
  return (
    <div className="mx-auto max-w-4xl text-black">
      <div className="mb-4 flex justify-between print:hidden">
        <button
          onClick={onEdit}
          className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-black"
        >
          Back to Editor
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white"
        >
          <Download size={17} />
          Print Resume
        </button>
      </div>

      <article className="resume-paper bg-white p-8 text-black shadow-lg sm:p-12">
        <header className="border-b-2 border-black pb-5">
          <h1 className="text-3xl font-bold uppercase tracking-wide text-black">
            {resume.name || "Your Name"}
          </h1>
          <p className="mt-2 text-lg font-semibold text-black">
            {resume.role || "Your Target Role"}
          </p>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-black">
            {resume.email && (
              <span className="flex items-center gap-1.5">
                <Mail size={14} />
                {resume.email}
              </span>
            )}
            {resume.phone && (
              <span className="flex items-center gap-1.5">
                <Phone size={14} />
                {resume.phone}
              </span>
            )}
            {resume.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                {resume.location}
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-4 text-sm text-black">
            {resume.github && (
              <a href={resume.github} className="flex items-center gap-1">
                <LinkIcon size={14} />
                GitHub
              </a>
            )}
            {resume.linkedin && (
              <a href={resume.linkedin} className="flex items-center gap-1">
                <LinkIcon size={14} />
                LinkedIn
              </a>
            )}
          </div>
        </header>

        {resume.summary && (
          <ResumeSection title="Professional Summary">
            <p className="whitespace-pre-line text-sm leading-6 text-black">
              {resume.summary}
            </p>
          </ResumeSection>
        )}

        {resume.skills && (
          <ResumeSection title="Technical Skills">
            <p className="whitespace-pre-line text-sm leading-6 text-black">
              {resume.skills}
            </p>
          </ResumeSection>
        )}

        {resume.education.some((item) => item.degree || item.college) && (
          <ResumeSection title="Education">
            {resume.education.map((item, index) => (
              <div key={index} className="mb-4">
                <div className="flex flex-wrap justify-between gap-2">
                  <h3 className="font-bold text-black">
                    {item.degree || "Degree"}
                  </h3>
                  <span className="text-sm text-black">{item.year}</span>
                </div>
                <p className="mt-1 text-sm text-black">{item.college}</p>
                {item.score && (
                  <p className="mt-1 text-sm text-black">Score: {item.score}</p>
                )}
              </div>
            ))}
          </ResumeSection>
        )}

        {resume.projects.some((item) => item.name || item.description) && (
          <ResumeSection title="Projects">
            {resume.projects.map((item, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-bold text-black">
                  {item.name || "Project"}
                </h3>
                {item.description && (
                  <p className="mt-1 whitespace-pre-line text-sm leading-6 text-black">
                    {item.description}
                  </p>
                )}
                {item.technologies && (
                  <p className="mt-2 text-sm text-black">
                    <strong>Technologies:</strong> {item.technologies}
                  </p>
                )}
              </div>
            ))}
          </ResumeSection>
        )}

        {resume.achievements && (
          <ResumeSection title="Achievements & Certifications">
            <p className="whitespace-pre-line text-sm leading-6 text-black">
              {resume.achievements}
            </p>
          </ResumeSection>
        )}
      </article>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .resume-paper,
          .resume-paper * {
            visibility: visible;
          }
          .resume-paper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
            margin: 0;
            box-shadow: none;
          }
          @page {
            size: A4;
            margin: 10mm;
          }
        }
      `}</style>
    </div>
  );
}

function ResumeSection({ title, children }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 border-b border-gray-400 pb-2 text-sm font-bold uppercase tracking-widest text-black">
        {title}
      </h2>
      {children}
    </section>
  );
}
