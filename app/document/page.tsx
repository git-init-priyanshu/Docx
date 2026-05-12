"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LayoutGrid, List } from "lucide-react";

import { CreateNewDocument } from "./components/Header/actions";
import { createGuestDocument } from "@/lib/guestServices";
import useClientSession from "@/lib/customHooks/useClientSession";
import { useDocs } from "@/lib/hooks/useDocs";
import Sidebar from "./components/Sidebar";
import DocTopBar from "./components/DocTopBar";
import DocCardItem from "./components/DocCardItem";
import QuickStart from "./components/QuickStart";


export default function DocumentPage() {
  const router = useRouter();
  const session = useClientSession();

  const [folder, setFolder] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<"recent" | "alpha">("recent");
  const [q, setQ] = useState("");

  const userId = session === null ? null : session?.id;
  const { docs, isLoading } = useDocs(userId);

  const createDocument = async () => {
    if (session?.id) {
      const response = await CreateNewDocument();
      if (response.success) {
        toast.success("Successfully created new document");
        router.push(`/writer/${response.data?.id}`);
      } else {
        toast.error(response.error);
      }
    } else {
      const doc = createGuestDocument();
      toast.success("Successfully created new document");
      router.push(`/writer/${doc.id}`);
    }
  };

  const filtered = docs
    .filter(d => !q || d.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => {
      if (sort === "alpha") return a.name.localeCompare(b.name);
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const recent = docs
    .slice()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);

  const firstName = session?.name?.split(" ")[0] ?? "there";
  const totalDocs = docs.length;

  return (
    <div
      className="h-screen w-screen flex overflow-hidden"
      style={{ background: "var(--lp-paper)", color: "var(--lp-ink)" }}
    >
      <Sidebar folder={folder} setFolder={setFolder} onCreate={createDocument} />

      <main className="flex-1 flex flex-col min-w-0">
        <DocTopBar q={q} setQ={setQ} onCreate={createDocument} />

        <div
          className="flex-1 overflow-y-auto"
          style={{ background: "var(--lp-paper)" }}
        >
          <div className="max-w-[1180px] mx-auto px-6 md:px-8 py-8">

            {/* Page header */}
            <div className="mb-8">
              <div
                className="font-mono text-[10.5px] uppercase tracking-[0.18em] mb-2"
                style={{ color: "var(--lp-muted)" }}
              >
                {folder === "all" ? "Your workspace" : folder}
              </div>
              <h1
                className="text-[30px] sm:text-[38px] leading-[1.05] tracking-tight font-semibold"
                style={{ color: "var(--lp-ink)" }}
              >
                {folder === "all" ? `Welcome back, ${firstName}.` : folder}
              </h1>
              <p className="text-[14px] mt-2" style={{ color: "var(--lp-muted)" }}>
                {folder === "all"
                  ? `You have ${totalDocs} document${totalDocs === 1 ? "" : "s"}. Pick up where you left off, or start something new.`
                  : `${filtered.length} document${filtered.length === 1 ? "" : "s"} in this folder.`}
              </p>
            </div>

            {/* Quick start */}
            {folder === "all" && !isLoading && (
              <div className="mb-10">
                <QuickStart onCreate={createDocument} />
              </div>
            )}

            {/* Recent */}
            {folder === "all" && !isLoading && recent.length > 0 && (
              <section className="mb-10">
                <div className="flex items-end justify-between mb-3">
                  <h2
                    className="text-[20px] font-semibold tracking-tight"
                    style={{ color: "var(--lp-ink)" }}
                  >
                    Pick up where you left off
                  </h2>
                  <span
                    className="font-mono text-[10.5px] uppercase tracking-wider"
                    style={{ color: "var(--lp-muted)" }}
                  >
                    Recent
                  </span>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {recent.map((d, i) => (
                    <DocCardItem
                      key={d.id}
                      docId={d.id}
                      data={d.data}
                      title={d.name}
                      updatedAt={d.updatedAt}
                      users={d.users}
                      view="grid"
                      colorIndex={i}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* All documents */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2
                  className="text-[20px] font-semibold tracking-tight"
                  style={{ color: "var(--lp-ink)" }}
                >
                  {folder === "all" ? "All documents" : "Documents"}
                </h2>
                <div className="flex items-center gap-2">
                  <select
                    value={sort}
                    onChange={e => setSort(e.target.value as "recent" | "alpha")}
                    className="h-8 px-2.5 rounded-md border text-[12px] outline-none cursor-pointer"
                    style={{
                      background: "var(--lp-card)",
                      borderColor: "var(--lp-border)",
                      color: "var(--lp-ink)",
                    }}
                  >
                    <option value="recent">Recently updated</option>
                    <option value="alpha">A → Z</option>
                  </select>
                  <div
                    className="flex border rounded-md overflow-hidden"
                    style={{ borderColor: "var(--lp-border)" }}
                  >
                    <button
                      onClick={() => setView("grid")}
                      className="h-8 w-8 flex items-center justify-center transition"
                      style={{
                        background: view === "grid" ? "var(--lp-paper-2)" : "var(--lp-card)",
                        color: "var(--lp-ink)",
                      }}
                      title="Grid view"
                    >
                      <LayoutGrid className="w-4 h-4" strokeWidth={1.6} />
                    </button>
                    <button
                      onClick={() => setView("list")}
                      className="h-8 w-8 flex items-center justify-center transition"
                      style={{
                        background: view === "list" ? "var(--lp-paper-2)" : "var(--lp-card)",
                        color: "var(--lp-ink)",
                      }}
                      title="List view"
                    >
                      <List className="w-4 h-4" strokeWidth={1.6} />
                    </button>
                  </div>
                </div>
              </div>

              {/* List header */}
              {view === "list" && (
                <div
                  className="grid grid-cols-[1fr,140px,90px,32px] gap-4 px-4 pb-2 font-mono uppercase tracking-wider text-[10px]"
                  style={{ color: "var(--lp-muted)" }}
                >
                  <span>Name</span>
                  <span>Owner</span>
                  <span>Updated</span>
                  <span />
                </div>
              )}

              {/* Loading skeleton */}
              {isLoading && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-lg border animate-pulse"
                      style={{
                        background: "var(--lp-card)",
                        borderColor: "var(--lp-border)",
                        aspectRatio: "4/5",
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!isLoading && filtered.length === 0 && (
                <div
                  className="rounded-lg border p-12 text-center"
                  style={{ background: "var(--lp-card)", borderColor: "var(--lp-border)" }}
                >
                  <div
                    className="text-[14px] font-medium mb-1"
                    style={{ color: "var(--lp-ink)" }}
                  >
                    {q ? "No documents match." : "No documents yet."}
                  </div>
                  <p className="text-[12.5px]" style={{ color: "var(--lp-muted)" }}>
                    {q
                      ? "Try a different search term."
                      : "Create your first document to get started."}
                  </p>
                </div>
              )}

              {/* Grid view */}
              {!isLoading && filtered.length > 0 && view === "grid" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filtered.map((d, i) => (
                    <DocCardItem
                      key={d.id}
                      docId={d.id}
                      data={d.data}
                      title={d.name}
                      updatedAt={d.updatedAt}
                      users={d.users}
                      view="grid"
                      colorIndex={i}
                    />
                  ))}
                </div>
              )}

              {/* List view */}
              {!isLoading && filtered.length > 0 && view === "list" && (
                <div className="space-y-2">
                  {filtered.map((d, i) => (
                    <DocCardItem
                      key={d.id}
                      docId={d.id}
                      data={d.data}
                      title={d.name}
                      updatedAt={d.updatedAt}
                      users={d.users}
                      view="list"
                      colorIndex={i}
                    />
                  ))}
                </div>
              )}
            </section>

            <div className="h-16" />
          </div>
        </div>
      </main>
    </div>
  );
}
