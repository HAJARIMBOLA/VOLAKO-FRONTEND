"use client";

import * as React from "react";
import { Check, ChevronDown, Plus } from "lucide-react";
import { toast } from "sonner";
import { createCategoryInlineAction } from "@/actions/categories";
import type { Category, TransactionType } from "@/lib/types";

/** A category "select" you can also type into: search existing categories,
 * or create a new one on the fly without leaving the transaction form. */
export function CategoryCombobox({
  type,
  categories,
  value,
  onChange,
  onCategoryCreated,
}: {
  type: TransactionType;
  categories: Category[];
  value?: number;
  onChange: (categoryId: number) => void;
  onCategoryCreated: (category: Category) => void;
}) {
  const selected = categories.find((c) => c.id === value);
  // No effect syncing query from `value`: the parent remounts this component
  // (via a `key`) whenever the selection should reset instead.
  const [query, setQuery] = React.useState(selected?.name ?? "");
  const [open, setOpen] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onOutsideClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = normalizedQuery
    ? categories.filter((c) => c.name.toLowerCase().includes(normalizedQuery))
    : categories;
  const exactMatch = categories.find((c) => c.name.toLowerCase() === normalizedQuery);
  const canCreate = normalizedQuery.length > 0 && !exactMatch;

  async function handleCreate() {
    const name = query.trim();
    setCreating(true);
    const result = await createCategoryInlineAction({ name, type });
    setCreating(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(`Catégorie "${name}" créée.`);
    onCategoryCreated(result.category);
    onChange(result.category.id);
    setQuery(result.category.name);
    setOpen(false);
  }

  function handleSelect(category: Category) {
    onChange(category.id);
    setQuery(category.name);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Chercher ou créer…"
          className="flex h-10 w-full rounded-lg border border-border-strong bg-surface px-3 pr-8 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent"
        />
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      {open ? (
        <div className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-border-strong bg-card p-1 shadow-xl">
          {filtered.length > 0 ? (
            filtered.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleSelect(category)}
                className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm text-foreground hover:bg-muted"
              >
                {category.name}
                {category.id === value ? <Check className="size-4 text-primary" /> : null}
              </button>
            ))
          ) : (
            <p className="px-2 py-2 text-sm text-muted-foreground">Aucune catégorie trouvée.</p>
          )}

          {canCreate ? (
            <button
              type="button"
              onClick={handleCreate}
              disabled={creating}
              className="flex w-full items-center gap-2 rounded-md border-t border-border px-2 py-2 text-left text-sm font-medium text-primary hover:bg-muted disabled:opacity-50"
            >
              <Plus className="size-4" />
              {creating ? "Création…" : `Créer "${query.trim()}"`}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
