"use client";

import { useEffect, useState } from "react";
import { Copy, Globe, Link2Off, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import getInitials from "@/helpers/getInitials";
import {
  AddCollaborator,
  GetSharing,
  RemoveCollaborator,
  SearchUsers,
  SetLinkAccess,
  type SharedUser,
} from "../../sharing/actions";

type ShareDialogProps = {
  docId: string;
  name: string;
  isGuest: boolean;
  onAuthRequired: () => void;
};

type LinkAccessValue = "NONE" | "EDIT";

function PersonRow({
  person,
  canRemove,
  onRemove,
}: {
  person: SharedUser;
  canRemove: boolean;
  onRemove: () => void;
}) {
  return (
    <li className="flex items-center gap-2.5 py-1.5">
      <Avatar className="size-8 shrink-0 bg-[var(--lp-paper-2)]">
        {person.picture && <AvatarImage src={person.picture} />}
        <span className="grid place-items-center h-full w-full text-[11px] font-medium text-[var(--lp-muted)]">
          {getInitials(person.name || "?")}
        </span>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium truncate">{person.name}</p>
        <p className="text-[12px] text-[var(--lp-muted)] truncate">
          {person.email}
        </p>
      </div>
      <span className="text-[12px] text-[var(--lp-muted)] shrink-0">
        {person.isOwner ? "Owner" : "Editor"}
      </span>
      {canRemove && !person.isOwner && (
        <button
          onClick={onRemove}
          aria-label={`Remove ${person.name}`}
          className="shrink-0 h-6 w-6 grid place-items-center rounded-md text-[var(--lp-muted)] transition-colors hover:bg-[var(--lp-paper-2)] hover:text-[var(--lp-ink)]"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </li>
  );
}

export default function ShareDialog({
  docId,
  name,
  isGuest,
  onAuthRequired,
}: ShareDialogProps) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [people, setPeople] = useState<SharedUser[]>([]);
  const [linkAccess, setLinkAccess] = useState<LinkAccessValue>("NONE");
  const [isOwner, setIsOwner] = useState(false);
  const [email, setEmail] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [suggestions, setSuggestions] = useState<SharedUser[]>([]);

  const shared = linkAccess === "EDIT";

  // Debounced so typing an address is one search, not one per keystroke. The
  // stale flag drops results from a query the user has already typed past.
  useEffect(() => {
    if (!open || !isOwner || !email.trim()) {
      setSuggestions([]);
      return;
    }

    let stale = false;
    const timer = setTimeout(async () => {
      const response = await SearchUsers(docId, email);
      if (stale) return;
      setSuggestions(response.success ? (response.data as SharedUser[]) : []);
    }, 250);

    return () => {
      stale = true;
      clearTimeout(timer);
    };
  }, [email, open, isOwner, docId]);

  const openChange = async (next: boolean) => {
    if (next && isGuest) {
      onAuthRequired();
      return;
    }
    setOpen(next);
    if (!next || !docId) return;

    setLoaded(false);
    const response = await GetSharing(docId);
    if (!response.success || !response.data) {
      toast.error(response.error);
      setOpen(false);
      return;
    }
    setPeople(response.data.people);
    setLinkAccess(response.data.linkAccess as LinkAccessValue);
    setIsOwner(response.data.isOwner);
    setLoaded(true);
  };

  const addPerson = async (value: string) => {
    if (!value.trim() || isAdding) return;

    setIsAdding(true);
    const response = await AddCollaborator(docId, value);
    setIsAdding(false);

    if (!response.success || !response.data) {
      toast.error(response.error);
      return;
    }
    setPeople((current) => [...current, response.data as SharedUser]);
    setEmail("");
    setSuggestions([]);
    toast.success(`${response.data.name} can now edit`);
  };

  const removePerson = async (person: SharedUser) => {
    const previous = people;
    setPeople((current) => current.filter((p) => p.id !== person.id));

    const response = await RemoveCollaborator(docId, person.id);
    if (!response.success) {
      setPeople(previous);
      toast.error(response.error);
      return;
    }
    toast.success(`Removed ${person.name}`);
  };

  const toggleLink = async () => {
    const next: LinkAccessValue = shared ? "NONE" : "EDIT";
    setIsUpdating(true);
    setLinkAccess(next);

    const response = await SetLinkAccess(docId, next);
    setIsUpdating(false);
    if (!response.success) {
      setLinkAccess(shared ? "EDIT" : "NONE");
      toast.error(response.error);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied — anyone with it can edit");
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  return (
    <Dialog open={open} onOpenChange={openChange}>
      <DialogTrigger asChild>
        <button className="h-8 px-3 rounded-md text-[12.5px] font-medium transition-opacity hover:opacity-80 bg-[var(--lp-ink)] text-[var(--lp-paper)]">
          Share
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[460px] border-[var(--lp-border)] bg-[var(--lp-card)] text-[var(--lp-ink)]">
        <DialogHeader>
          <DialogTitle className="text-[15px]">
            Share &ldquo;{name.trim() || "Untitled"}&rdquo;
          </DialogTitle>
          <DialogDescription className="text-[12.5px] text-[var(--lp-muted)]">
            Everyone you share with can edit. There is no view-only access yet.
          </DialogDescription>
        </DialogHeader>

        {!loaded ? (
          <div className="py-8 grid place-items-center">
            <Loader2 className="w-4 h-4 animate-spin text-[var(--lp-muted)]" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {isOwner && (
              <div className="relative">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addPerson(email);
                  }}
                  className="flex gap-2"
                >
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Add people by name or email"
                    autoComplete="off"
                    className="flex-1 h-9 px-3 rounded-md border border-[var(--lp-border)] bg-[var(--lp-paper)] text-[13px] outline-none placeholder:text-[var(--lp-muted)] focus:border-[var(--lp-accent)]"
                  />
                  <button
                    type="submit"
                    disabled={!email.trim() || isAdding}
                    className="h-9 px-3.5 rounded-md text-[12.5px] font-medium bg-[var(--lp-ink)] text-[var(--lp-paper)] transition-opacity hover:opacity-80 disabled:opacity-40"
                  >
                    {isAdding ? "Adding…" : "Add"}
                  </button>
                </form>

                {suggestions.length > 0 && (
                  <ul className="absolute z-20 left-0 right-0 mt-1 rounded-md border border-[var(--lp-border)] bg-[var(--lp-card)] shadow-lg overflow-hidden">
                    {suggestions.map((user) => (
                      <li key={user.id}>
                        <button
                          type="button"
                          onClick={() => addPerson(user.email)}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 text-left transition-colors hover:bg-[var(--lp-paper-2)]"
                        >
                          <Avatar className="size-7 shrink-0 bg-[var(--lp-paper-2)]">
                            {user.picture && <AvatarImage src={user.picture} />}
                            <span className="grid place-items-center h-full w-full text-[10px] font-medium text-[var(--lp-muted)]">
                              {getInitials(user.name || "?")}
                            </span>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-[13px] truncate">{user.name}</p>
                            <p className="text-[12px] text-[var(--lp-muted)] truncate">
                              {user.email}
                            </p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div>
              <p className="text-[12px] font-medium text-[var(--lp-muted)] mb-1">
                People with access
              </p>
              <ul className="max-h-[220px] overflow-y-auto">
                {people.map((person) => (
                  <PersonRow
                    key={person.id}
                    person={person}
                    canRemove={isOwner}
                    onRemove={() => removePerson(person)}
                  />
                ))}
              </ul>
            </div>

            <div className="border-t border-[var(--lp-border)] pt-3.5">
              <p className="text-[12px] font-medium text-[var(--lp-muted)] mb-2">
                General access
              </p>
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 shrink-0">
                  {shared ? (
                    <Globe className="w-4 h-4 text-[var(--lp-accent)]" />
                  ) : (
                    <Link2Off className="w-4 h-4 text-[var(--lp-muted)]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium">
                    {shared ? "Anyone with the link" : "Restricted"}
                  </p>
                  <p className="text-[12px] text-[var(--lp-muted)] mt-0.5">
                    {shared
                      ? "Anyone who opens the link can edit this document."
                      : "Only the people listed above can open this document."}
                  </p>
                </div>
                {isOwner && (
                  <button
                    onClick={toggleLink}
                    disabled={isUpdating}
                    role="switch"
                    aria-checked={shared}
                    aria-label="Anyone with the link can edit"
                    className={`mt-0.5 shrink-0 h-5 w-9 rounded-full transition-colors disabled:opacity-50 ${
                      shared
                        ? "bg-[var(--lp-accent)]"
                        : "bg-[var(--lp-border)]"
                    }`}
                  >
                    <span
                      className={`block h-4 w-4 rounded-full bg-white transition-transform ${
                        shared ? "translate-x-[18px]" : "translate-x-[2px]"
                      }`}
                    />
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={copyLink}
              disabled={!shared}
              title={
                shared
                  ? undefined
                  : "Turn on “Anyone with the link” to share a link"
              }
              className="inline-flex items-center justify-center gap-1.5 h-9 rounded-md border border-[var(--lp-border)] text-[12.5px] font-medium transition-colors hover:bg-[var(--lp-paper-2)] disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy link
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
