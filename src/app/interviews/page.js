import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import {
  Brain,
  Code2,
  MessageSquare,
  Database,
  ArrowRight,
  Clock,
  Bug,
  Terminal,
  Lightbulb,
} from "lucide-react";

const interviewTypes = [
  {
    title: "Technical Interview",
    description: "Practice Java, OOPs, DSA, DBMS and programming fundamentals.",
    icon: Code2,
    topics: "Java • OOPs • DSA",
    duration: "15–30 minutes",
  },
  {
    title: "HR Interview",
    description:
      "Prepare for introduction, strengths, weaknesses and HR questions.",
    icon: MessageSquare,
    topics: "Introduction • HR Questions",
    duration: "10–20 minutes",
  },
  {
    title: "Database Interview",
    description: "Revise SQL queries, joins, keys and database concepts.",
    icon: Database,
    topics: "SQL • DBMS • PostgreSQL",
    duration: "15–25 minutes",
  },
];

export default function InterviewsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-indigo-600">
            PREPARE FOR YOUR PLACEMENTS
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            AI Interview Practice
          </h1>

          <div className="flex justify-end">
            <Link
              href="/interviews/history"
              className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-50"
            >
              <Clock size={17} />
              Interview History
              <ArrowRight size={16} />
            </Link>
          </div>

          <p className="mt-2 max-w-2xl text-gray-600">
            Practice interview questions, improve your answers and prepare
            confidently for your next placement interview.
          </p>
        </div>

        <section className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white sm:p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-white/15 p-3">
              <Brain size={32} />
            </div>

            <div>
              <h2 className="text-xl font-bold">Ready to practice?</h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100">
                Choose an interview category or challenge yourself with a
                realistic software debugging scenario.
              </p>
            </div>
          </div>
        </section>

        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Choose Your Interview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Select a category to begin your practice.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {interviewTypes.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                    <Icon size={25} />
                  </div>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    Practice
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-2 flex-1 text-sm leading-6 text-gray-600">
                  {item.description}
                </p>

                <p className="mt-4 text-sm font-medium text-indigo-700">
                  {item.topics}
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={16} />
                  {item.duration}
                </div>

                <Link
                  href={`/interviews/practice?type=${encodeURIComponent(item.title)}`}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Start Practice
                  <ArrowRight size={16} />
                </Link>
              </article>
            );
          })}
        </div>

        <section className="overflow-hidden rounded-2xl border border-violet-200 bg-white shadow-sm">
          <div className="grid md:grid-cols-[1.2fr_1fr]">
            <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-900 p-6 text-white sm:p-8">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/10 p-3">
                  <Bug size={28} />
                </div>

                <span className="rounded-full border border-violet-300/40 bg-violet-300/10 px-3 py-1 text-xs font-semibold text-violet-200">
                  SPECIAL CHALLENGE
                </span>
              </div>

              <h2 className="mt-6 text-2xl font-bold sm:text-3xl">
                The Broken Product Challenge
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">
                A fictional software company has a broken product. Investigate
                the symptoms, analyse the logs, explain your decisions and
                propose a fix like a real software developer.
              </p>

              <Link
                href="/broken-product-challenge"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-indigo-950 transition hover:bg-violet-100"
              >
                Enter Challenge
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="space-y-5 p-6 sm:p-8">
              <div className="flex gap-3">
                <div className="h-fit rounded-lg bg-indigo-50 p-2 text-indigo-700">
                  <Terminal size={21} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Investigate real-world scenarios
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Examine bug reports, application behaviour and technical
                    clues before deciding what to do.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-fit rounded-lg bg-amber-50 p-2 text-amber-700">
                  <Lightbulb size={21} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Explain your reasoning
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Practise explaining your investigation and proposed fix, not
                    just memorising interview answers.
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-violet-50 p-4">
                <p className="text-sm font-semibold text-violet-900">
                  Your mission
                </p>
                <p className="mt-1 text-sm leading-6 text-violet-800">
                  Find the cause of the checkout total mismatch and justify your
                  solution.
                </p>
              </div>
            </div>
          </div>
        </section>

        <p className="text-sm text-gray-500">
          The Broken Product Challenge is being developed in stages. Persistent
          results and advanced follow-up evaluation will be added separately.
        </p>
      </div>
    </MainLayout>
  );
}
