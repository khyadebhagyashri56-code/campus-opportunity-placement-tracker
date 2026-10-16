"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  Search,
  UserRound,
  Settings,
  LogOut,
  X,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();

  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const loadUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", {
        cache: "no-store",
      });

      if (!response.ok) {
        setUser(null);
        setProfilePhoto(null);
        return;
      }

      const data = await response.json();
      setUser(data.user || null);

      // Profile photo alag API se load karo
      const profileResponse = await fetch("/api/profile", {
        cache: "no-store",
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfilePhoto(profileData.user?.profilePhoto || null);
      } else {
        setProfilePhoto(null);
      }
    } catch (error) {
      console.error("Navbar user loading error:", error);
      setUser(null);
      setProfilePhoto(null);
    }
  }, []);

  useEffect(() => {
    loadUser();

    function handleProfileUpdate() {
      loadUser();
    }

    window.addEventListener("profile-updated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profile-updated", handleProfileUpdate);
    };
  }, [loadUser]);

  function handleSearch(event) {
    event.preventDefault();

    const query = searchText.trim();

    if (!query) return;

    setSearchOpen(false);
    router.push(`/opportunities?search=${encodeURIComponent(query)}`);
  }

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    setProfileOpen(false);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setUser(null);
      setProfilePhoto(null);

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
      alert("Logout nahi ho paya. Please dobara try karo.");
    }
  }

  const displayName = user?.name || "Student";
  const initial = displayName.trim().charAt(0).toUpperCase() || "S";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex min-h-20 items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600 sm:text-xs">
            Student Workspace
          </p>

          <h1 className="mt-1 truncate text-base font-bold tracking-tight text-slate-900 sm:text-xl">
            Campus Opportunity Tracker
          </h1>

          <p className="mt-1 hidden text-xs text-slate-500 sm:block">
            Your journey from campus to career
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          {searchOpen && (
            <form
              onSubmit={handleSearch}
              className="absolute left-3 right-3 top-[calc(100%+8px)] flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-lg sm:static sm:w-64 sm:shadow-none"
            >
              <Search size={18} className="shrink-0 text-slate-400" />

              <input
                autoFocus
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search jobs or companies..."
                className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />

              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchText("");
                }}
                aria-label="Close search"
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={17} />
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            aria-label="Open search"
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
              searchOpen
                ? "bg-blue-50 text-blue-700"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Search size={19} />
          </button>

          <button
            type="button"
            onClick={() =>
              alert("Notifications will be connected in the next step.")
            }
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Bell size={19} />
            <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
          </button>

          <div className="mx-1 hidden h-9 w-px bg-slate-200 sm:block" />

          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((open) => !open)}
              aria-expanded={profileOpen}
              className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-50 sm:gap-3 sm:px-2"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-sm">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initial
                )}
              </div>

              <div className="hidden max-w-36 text-left sm:block">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {displayName}
                </p>

                <p className="truncate text-xs text-slate-500">
                  {user?.email || "My account"}
                </p>
              </div>

              <ChevronDown
                size={16}
                className={`hidden text-slate-400 transition-transform sm:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                <Link
                  href="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <UserRound size={17} />
                  My Profile
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Settings size={17} />
                  Settings
                </Link>

                <div className="my-1 border-t border-slate-100" />

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
                >
                  <LogOut size={17} />
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
