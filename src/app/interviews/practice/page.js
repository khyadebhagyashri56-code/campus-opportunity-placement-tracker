"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

const questionBank = {
  "Technical Interview": [
    {
      topic: "Java",
      question: "What is Java, and what are its main features?",
      keywords: ["platform independent", "object-oriented", "JVM"],
    },
    {
      topic: "OOPs",
      question: "What are the four main principles of OOPs?",
      keywords: ["encapsulation", "inheritance", "polymorphism", "abstraction"],
    },
    {
      topic: "Java",
      question: "What is the difference between JDK, JRE and JVM?",
      keywords: ["development", "runtime", "virtual machine"],
    },
    {
      topic: "DSA",
      question: "What is the difference between an array and a linked list?",
      keywords: ["contiguous", "nodes", "memory"],
    },
    {
      topic: "DBMS",
      question:
        "What is the difference between a primary key and a foreign key?",
      keywords: ["unique", "relationship", "reference"],
    },
  ],
  "HR Interview": [
    {
      topic: "Introduction",
      question: "Tell me about yourself.",
      keywords: ["education", "skills", "projects"],
    },
    {
      topic: "Motivation",
      question: "Why do you want to work in the software industry?",
      keywords: ["technology", "learning", "development"],
    },
    {
      topic: "Strengths",
      question: "What are your strengths, and how do they help you?",
      keywords: ["strength", "example", "improvement"],
    },
    {
      topic: "Teamwork",
      question: "How would you handle a disagreement with a teammate?",
      keywords: ["listen", "communication", "solution"],
    },
    {
      topic: "Career Goals",
      question: "Where do you see yourself in the next five years?",
      keywords: ["goals", "skills", "growth"],
    },
  ],
  "Database Interview": [
    {
      topic: "SQL",
      question: "What is SQL, and why is it used?",
      keywords: ["query", "database", "data"],
    },
    {
      topic: "SQL",
      question: "What is the difference between WHERE and HAVING?",
      keywords: ["rows", "groups", "aggregate"],
    },
    {
      topic: "DBMS",
      question: "What is database normalization?",
      keywords: ["redundancy", "organize", "tables"],
    },
    {
      topic: "SQL",
      question: "Explain INNER JOIN and LEFT JOIN.",
      keywords: ["matching", "rows", "left table"],
    },
    {
      topic: "PostgreSQL",
      question: "What is a primary key, and why is it important?",
      keywords: ["unique", "null", "identify"],
    },
  ],
};

export default function InterviewPracticePage() {
  const searchParams = useSearchParams();
  const requestedType = searchParams.get("type");

  const interviewType = questionBank[requestedType]
    ? requestedType
    : "Technical Interview";

  const questions = questionBank[interviewType];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saved, setSaved] = useState(false);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentIndex] || "";

  async function finishInterview() {
    setSaving(true);
    setSaveMessage("");

    try {
      const response = await fetch("/api/interviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interviewType,
          score,
          totalMarks,
          answers: questions.map((question, index) => ({
            question: question.question,
            answer: answers[index] || "",
            questionNumber: index + 1,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSaveMessage(data.message || "Could not save interview result.");
        return;
      }

      setSaved(true);
      setFinished(true);
    } catch {
      setSaveMessage("Server connection failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function restartInterview() {
    setCurrentIndex(0);
    setAnswers({});
    setFinished(false);
  }

  function calculateScore() {
    let score = 0;

    questions.forEach((question, index) => {
      const answer = (answers[index] || "").toLowerCase();

      const matchedKeywords = question.keywords.filter((keyword) =>
        answer.includes(keyword.toLowerCase()),
      );

      if (matchedKeywords.length >= 2) {
        score += 2;
      } else if (matchedKeywords.length === 1) {
        score += 1;
      }
    });

    return score;
  }

  const score = calculateScore();
  const totalMarks = questions.length * 2;
  const percentage = Math.round((score / totalMarks) * 100);

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <Link
          href="/interviews"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600"
        >
          <ArrowLeft size={17} />
          Back to Interviews
        </Link>

        {!finished ? (
          <>
            <div>
              <p className="text-sm font-semibold text-indigo-600">
                {interviewType}
              </p>

              <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                Interview Practice
              </h1>

              <p className="mt-2 text-gray-600">
                Read each question carefully and write your own answer.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                  Question {currentIndex + 1} of {questions.length}
                </span>

                <span className="text-sm text-gray-500">
                  Topic: {currentQuestion.topic}
                </span>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all"
                  style={{
                    width: `${((currentIndex + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>

              <div className="mt-7 flex items-start gap-3">
                <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                  <Brain size={22} />
                </div>

                <h2 className="text-lg font-semibold leading-7 text-gray-900 sm:text-xl">
                  {currentQuestion.question}
                </h2>
              </div>

              <label
                htmlFor="interview-answer"
                className="mt-7 block text-sm font-medium text-gray-700"
              >
                Your Answer
              </label>

              <textarea
                id="interview-answer"
                value={currentAnswer}
                onChange={(event) =>
                  setAnswers((previous) => ({
                    ...previous,
                    [currentIndex]: event.target.value,
                  }))
                }
                placeholder="Type your answer here..."
                rows={7}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white p-4 text-sm leading-6 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <p className="mt-2 text-xs text-gray-500">
                Your answer stays in this page for now. It is not saved to the
                database yet.
              </p>

              <div className="mt-6 flex flex-wrap justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentIndex((previous) => previous - 1)}
                  disabled={currentIndex === 0}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft size={16} />
                  Previous
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((previous) => previous + 1)}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    Next Question
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={finishInterview}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Saving Result..." : "Finish Interview"}
                    <CheckCircle2 size={17} />
                  </button>
                )}
                {saveMessage && (
                  <p
                    className="mt-4 text-sm font-medium text-red-600"
                    role="alert"
                  >
                    {saveMessage}
                  </p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
              <CheckCircle2 size={34} />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-gray-900">
              Interview Completed!
            </h1>

            <p className="mt-2 text-gray-600">
              You completed the {interviewType} practice session.
            </p>

            <div className="mx-auto mt-7 max-w-sm rounded-xl bg-indigo-50 p-6">
              <p className="text-sm font-medium text-indigo-700">
                Practice Score
              </p>

              <p className="mt-2 text-4xl font-bold text-indigo-900">
                {score}/{totalMarks}
              </p>

              <p className="mt-2 text-sm text-indigo-700">
                {percentage}% keyword match
              </p>
            </div>

            <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-gray-600">
              This preliminary score checks for selected keywords only. It does
              not measure the full correctness or quality of your answers.
              Review your answers and improve them for next time.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={restartInterview}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <RotateCcw size={16} />
                Try Again
              </button>

              <Link
                href="/interviews"
                className="inline-flex items-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                All Interviews
              </Link>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
