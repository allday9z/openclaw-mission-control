"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  Bot,
  Boxes,
  CheckCircle2,
  Folder,
  Building2,
  LayoutGrid,
  Moon,
  Network,
  Settings,
  Store,
  Sun,
  Tags,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

import { useAuth } from "@/auth/clerk";
import { ApiError } from "@/api/mutator";
import { useOrganizationMembership } from "@/lib/use-organization-membership";
import {
  type healthzHealthzGetResponse,
  useHealthzHealthzGet,
} from "@/api/generated/default/default";
import { cn } from "@/lib/utils";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const { isAdmin } = useOrganizationMembership(isSignedIn);
  const { theme, setTheme } = useTheme();
  const t = useTranslations("nav");
  const tc = useTranslations("common");

  const healthQuery = useHealthzHealthzGet<healthzHealthzGetResponse, ApiError>(
    {
      query: {
        refetchInterval: 30_000,
        refetchOnMount: "always",
        retry: false,
      },
      request: { cache: "no-store" },
    },
  );

  const okValue = healthQuery.data?.data?.ok;
  const systemStatus: "unknown" | "operational" | "degraded" =
    okValue === true
      ? "operational"
      : okValue === false
        ? "degraded"
        : healthQuery.isError
          ? "degraded"
          : "unknown";
  const statusLabel =
    systemStatus === "operational"
      ? tc("systemOperational")
      : systemStatus === "unknown"
        ? tc("systemUnavailable")
        : tc("systemDegraded");

  const navLink = (href: string, exact = false) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[var(--text-muted)] transition",
      (exact ? pathname === href : pathname.startsWith(href))
        ? "bg-[var(--accent-soft)] text-[var(--accent)] font-medium"
        : "hover:bg-[var(--surface-muted)]",
    );

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[280px] -translate-x-full flex-col border-r border-[var(--border)] bg-[var(--surface)] pt-16 shadow-lg transition-transform duration-200 ease-in-out [[data-sidebar=open]_&]:translate-x-0 md:relative md:inset-auto md:z-auto md:w-[260px] md:translate-x-0 md:pt-0 md:shadow-none md:transition-none">
      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-quiet)]">
          {t("navigation")}
        </p>
        <nav className="mt-3 space-y-4 text-sm">
          <div>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-quiet)]">
              {t("overview")}
            </p>
            <div className="mt-1 space-y-1">
              <Link href="/dashboard" className={navLink("/dashboard", true)}>
                <BarChart3 className="h-4 w-4" />
                {t("dashboard")}
              </Link>
              <Link href="/activity" className={navLink("/activity")}>
                <Activity className="h-4 w-4" />
                {t("liveFeed")}
              </Link>
            </div>
          </div>

          <div>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-quiet)]">
              {t("boards")}
            </p>
            <div className="mt-1 space-y-1">
              <Link href="/board-groups" className={navLink("/board-groups")}>
                <Folder className="h-4 w-4" />
                {t("boardGroups")}
              </Link>
              <Link href="/boards" className={navLink("/boards")}>
                <LayoutGrid className="h-4 w-4" />
                {t("boards")}
              </Link>
              <Link href="/tags" className={navLink("/tags")}>
                <Tags className="h-4 w-4" />
                {t("tags")}
              </Link>
              <Link href="/approvals" className={navLink("/approvals")}>
                <CheckCircle2 className="h-4 w-4" />
                {t("approvals")}
              </Link>
              {isAdmin ? (
                <Link href="/custom-fields" className={navLink("/custom-fields")}>
                  <Settings className="h-4 w-4" />
                  {t("customFields")}
                </Link>
              ) : null}
            </div>
          </div>

          <div>
            {isAdmin ? (
              <>
                <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-quiet)]">
                  {t("skills")}
                </p>
                <div className="mt-1 space-y-1">
                  <Link
                    href="/skills/marketplace"
                    className={navLink("/skills/marketplace")}
                  >
                    <Store className="h-4 w-4" />
                    {t("marketplace")}
                  </Link>
                  <Link href="/skills/packs" className={navLink("/skills/packs")}>
                    <Boxes className="h-4 w-4" />
                    {t("packs")}
                  </Link>
                </div>
              </>
            ) : null}
          </div>

          <div>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-quiet)]">
              {t("administration")}
            </p>
            <div className="mt-1 space-y-1">
              <Link href="/organization" className={navLink("/organization")}>
                <Building2 className="h-4 w-4" />
                {t("organization")}
              </Link>
              {isAdmin ? (
                <Link href="/gateways" className={navLink("/gateways")}>
                  <Network className="h-4 w-4" />
                  {t("gateways")}
                </Link>
              ) : null}
              {isAdmin ? (
                <Link href="/agents" className={navLink("/agents")}>
                  <Bot className="h-4 w-4" />
                  {t("agents")}
                </Link>
              ) : null}
            </div>
          </div>
        </nav>
      </div>

      <div className="border-t border-[var(--border)] p-4 space-y-3">
        {/* Theme toggle */}
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--text-muted)] hover:bg-[var(--surface-muted)] transition"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          {theme === "dark" ? "Light mode" : "Dark mode"}
          <kbd className="ml-auto rounded bg-[var(--surface-strong)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-quiet)]">
            ⌘K
          </kbd>
        </button>

        {/* System status */}
        <div className="flex items-center gap-2 text-xs text-[var(--text-quiet)]">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              systemStatus === "operational" && "bg-emerald-500",
              systemStatus === "degraded" && "bg-rose-500",
              systemStatus === "unknown" && "bg-[var(--surface-strong)]",
            )}
          />
          {statusLabel}
        </div>
      </div>
    </aside>
  );
}
