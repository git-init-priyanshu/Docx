"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { Plus, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import logo from "@/public/logo.svg";
import useClientSession from "@/lib/customHooks/useClientSession";
import getInitials from "@/helpers/getInitials";
import { LogoutAction } from "@/app/document/components/Header/actions";

type AppSidebarProps = {
  onCreate: () => void;
  children: ReactNode;
  /** Tailwind breakpoint at which the sidebar becomes visible. Default: "md" */
  breakpoint?: "md" | "lg";
};

export default function AppSidebar({ onCreate, children, breakpoint = "md" }: AppSidebarProps) {
  const router = useRouter();
  const session = useClientSession();
  const initial = session?.name ? getInitials(session.name) : "G";

  const logout = async () => {
    const response = await LogoutAction();
    if (response.success) {
      toast.success("Successfully logged out");
      router.push("/login");
    } else {
      toast.error(response.error);
    }
  };

  const showClass = breakpoint === "lg" ? "lg:flex" : "md:flex";

  return (
    <aside
      className={`hidden ${showClass} w-[260px] shrink-0 border-r flex-col h-full`}
      style={{ background: "var(--lp-paper-2)", borderColor: "var(--lp-border)" }}
    >
      {/* Logo */}
      <div
        className="px-5 h-[52px] flex items-center gap-2.5 border-b shrink-0"
        style={{ borderColor: "var(--lp-border)" }}
      >
        <a href="/" className="flex items-center gap-2.5">
          <Image src={logo} alt="DocX" width={28} height={28} />
          <span
            className="text-[19px] font-semibold tracking-tight"
            style={{ color: "var(--lp-ink)" }}
          >
            DocX
          </span>
        </a>
      </div>

      {/* New document */}
      <div className="px-3 pt-4 shrink-0">
        <button
          onClick={onCreate}
          className="w-full flex items-center gap-2 h-10 px-3 rounded-md text-[13px] font-medium transition hover:opacity-90"
          style={{ background: "var(--lp-ink)", color: "var(--lp-paper)" }}
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
          New document
          <span className="ml-auto font-mono text-[10px] opacity-70">⌘N</span>
        </button>
      </div>

      {/* Page-specific middle content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {children}
      </div>

      {/* Profile */}
      <div
        className="px-3 py-3 border-t shrink-0"
        style={{ borderColor: "var(--lp-border)" }}
      >
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md transition">
          <span
            className="w-7 h-7 rounded-full text-white text-[11px] font-semibold flex items-center justify-center shrink-0"
            style={{ background: "var(--lp-accent)" }}
          >
            {initial}
          </span>
          <div className="flex-1 min-w-0">
            <div
              className="text-[12.5px] font-medium truncate"
              style={{ color: "var(--lp-ink)" }}
            >
              {session?.name ?? "Guest"}
            </div>
            <div
              className="font-mono text-[10px] truncate"
              style={{ color: "var(--lp-muted)" }}
            >
              {session?.email ?? "guest@docx.app"}
            </div>
          </div>
          {session?.id ? (
            <button
              onClick={logout}
              className="p-1.5 rounded-md hover:bg-[var(--lp-paper-2)] transition shrink-0"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut
                className="w-3.5 h-3.5"
                style={{ color: "var(--lp-muted)" }}
                strokeWidth={1.8}
              />
            </button>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="text-[11px] font-medium px-2 py-1 rounded-md hover:bg-[var(--lp-paper-2)] transition shrink-0"
              style={{ color: "var(--lp-accent)" }}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
