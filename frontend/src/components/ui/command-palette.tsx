"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  BarChart3,
  Bot,
  Boxes,
  CheckCircle2,
  Folder,
  LayoutGrid,
  Network,
  Plus,
  Settings,
  Store,
  Tags,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "cmdk";
import { useTranslations } from "next-intl";

type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/activity", label: "Live feed", icon: Activity },
  { href: "/board-groups", label: "Board groups", icon: Folder },
  { href: "/boards", label: "Boards", icon: LayoutGrid },
  { href: "/tags", label: "Tags", icon: Tags },
  { href: "/approvals", label: "Approvals", icon: CheckCircle2 },
  { href: "/gateways", label: "Gateways", icon: Network },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/skills/marketplace", label: "Marketplace", icon: Store },
  { href: "/skills/packs", label: "Skill packs", icon: Boxes },
  { href: "/settings", label: "Settings", icon: Settings },
];

const ACTION_ITEMS = [
  { href: "/boards/new", label: "Create new board", icon: Plus },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const t = useTranslations("commandPalette");

  const navigate = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]"
      onClick={() => onOpenChange(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Palette */}
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_64px_rgba(0,0,0,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="[&_[cmdk-input-wrapper]]:border-b [&_[cmdk-input-wrapper]]:border-[var(--border)] [&_[cmdk-input-wrapper]]:px-4 [&_[cmdk-input-wrapper]]:py-3">
          <CommandInput
            placeholder={t("placeholder")}
            className="w-full bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--text-quiet)] outline-none"
            autoFocus
          />
          <CommandList className="max-h-[400px] overflow-y-auto p-2">
            <CommandEmpty className="py-8 text-center text-sm text-[var(--text-muted)]">
              {t("noResults")}
            </CommandEmpty>

            <CommandGroup
              heading={t("navigate")}
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[var(--text-quiet)]"
            >
              {NAV_ITEMS.map((item) => (
                <CommandItem
                  key={item.href}
                  value={item.label}
                  onSelect={() => navigate(item.href)}
                  className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--text)] outline-none data-[selected=true]:bg-[var(--surface-muted)] data-[selected=true]:text-[var(--text)]"
                >
                  <item.icon className="h-4 w-4 text-[var(--text-muted)]" />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup
              heading={t("actions")}
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[var(--text-quiet)]"
            >
              {ACTION_ITEMS.map((item) => (
                <CommandItem
                  key={item.href}
                  value={item.label}
                  onSelect={() => navigate(item.href)}
                  className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--text)] outline-none data-[selected=true]:bg-[var(--surface-muted)] data-[selected=true]:text-[var(--text)]"
                >
                  <item.icon className="h-4 w-4 text-[var(--text-muted)]" />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </div>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return { open, setOpen };
}
