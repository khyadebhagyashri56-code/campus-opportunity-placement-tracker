"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  ClipboardList,
  CalendarDays,
  Bell,
  Bookmark,
  UserRound,
  FileText,
  Sparkles,
  Settings,
  GraduationCap,
  ChevronRight,
} from "lucide-react";

const menuGroups = [
  {
    title: "WORKSPACE",
    items: [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Opportunities",
        path: "/opportunities",
        icon: BriefcaseBusiness,
      },
      {
        name: "Applications",
        path: "/applications",
        icon: ClipboardList,
      },
      {
        name: "Interviews",
        path: "/interviews",
        icon: CalendarDays,
      },
    ],
  },
  {
    title: "MY CAREER",
    items: [
      {
        name: "Reminders",
        path: "/reminders",
        icon: Bell,
      },
      {
        name: "Saved Jobs",
        path: "/saved",
        icon: Bookmark,
      },
      {
        name: "Resume Studio",
        path: "/resume-studio",
        icon: FileText,
      },
      {
        name: "Career Prep",
        path: "/career-prep",
        icon: Sparkles,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  function isItemActive(path) {
    return pathname === path || pathname.startsWith(`${path}/`);
  }

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white px-4 py-6">
      {/* Brand */}
      <Link href="/dashboard" className="mb-9 flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20">
          <GraduationCap size={25} strokeWidth={2} />
        </div>

        <div className="min-w-0">
          <h2 className="text-[15px] font-bold tracking-tight text-slate-900">
            Campus Tracker
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">Your career workspace</p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-7">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.16em] text-slate-400">
              {group.title}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = isItemActive(item.path);

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-100/70"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-blue-600" />
                    )}

                    <Icon
                      size={19}
                      strokeWidth={isActive ? 2.2 : 1.8}
                      className={`shrink-0 transition-colors ${
                        isActive
                          ? "text-blue-600"
                          : "text-slate-400 group-hover:text-slate-700"
                      }`}
                    />

                    <span className="flex-1">{item.name}</span>

                    {isActive && (
                      <ChevronRight size={15} className="text-blue-500" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Profile shortcut */}
      <Link
        href="/profile"
        className={`mb-4 flex items-center gap-3 rounded-xl border p-3 transition ${
          isItemActive("/profile")
            ? "border-blue-200 bg-blue-50"
            : "border-slate-200 bg-white hover:bg-slate-50"
        }`}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <UserRound size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-800">
            My Profile
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Personal information</p>
        </div>

        <Settings size={16} className="text-slate-400" />
      </Link>

      {/* Footer */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 p-4 text-white">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
          <Sparkles size={19} />
        </div>

        <p className="text-sm font-semibold">Your future starts here</p>

        <p className="mt-1 text-xs leading-5 text-slate-300">
          Stay organized and take one step closer to your dream job.
        </p>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/15">
          <div className="h-full w-1/3 rounded-full bg-blue-400" />
        </div>
        <p className="mt-2 text-[10px] text-slate-400">Keep moving forward</p>
      </div>
    </aside>
  );
}
