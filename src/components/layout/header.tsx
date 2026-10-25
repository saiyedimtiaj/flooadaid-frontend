"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Waves,
  Menu,
  X,
  HeartHandshake,
  ChevronRight,
  LogIn,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";
import { useCurrentUser, useInvalidateCurrentUser } from "@/lib/hooks/use-current-user";
import { useT, type MessageKey } from "@/lib/i18n/use-t";
import { LanguageToggle } from "./language-toggle";

interface NavLink {
  href: string;
  label: MessageKey;
  danger: boolean;
}

const navLinks: NavLink[] = [
  { href: "/", label: "nav.home", danger: false },
  { href: "/alerts", label: "nav.alerts", danger: false },
  { href: "/shelters", label: "nav.shelters", danger: false },
  { href: "/missing-persons", label: "nav.missing", danger: false },
  { href: "/sos", label: "nav.sos", danger: true },
  { href: "/about", label: "nav.about", danger: false },
];

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const { data: user } = useCurrentUser();
  const invalidateCurrentUser = useInvalidateCurrentUser();
  const { t } = useT();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      await invalidateCurrentUser();
      toast.success("Logged out");
    }
  };

  // Check if we are on the Home page to determine navbar overlay aesthetics
  const isHomePage = pathname === "/";

  useEffect(() => {
    const onScroll = (): void => {
      setScrolled(window.scrollY > 15);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-in-out border-b",
          !scrolled && isHomePage
            ? "bg-transparent border-transparent py-5"
            : "",
          scrolled || !isHomePage
            ? "bg-background/80 backdrop-blur-md shadow-xs py-3.5 border-border/40"
            : "",
        )}
      >
        <div className="mx-auto container px-4 flex items-center justify-between">
          {/* Logo Brand Zone */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group rounded-md focus-visible:outline-2 focus-visible:outline-destructive focus-visible:outline-offset-4"
            aria-label="FloodAid BD Home"
          >
            <div className="flex items-center justify-center size-9 rounded-xl bg-destructive/10 text-destructive group-hover:scale-105 transition-transform duration-200 shadow-xs border border-destructive/20">
              <Waves className="size-5 animate-pulse" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              <span className="text-destructive">Flood</span>
              <span
                className={cn(
                  "transition-colors duration-200",
                  !scrolled && isHomePage ? "text-white" : "text-foreground",
                )}
              >
                Aid
              </span>
            </span>
          </Link>

          {/* Center Navigation Pill */}
          <nav
            className={cn(
              "hidden md:flex items-center gap-1 p-1 rounded-full transition-all duration-300 border",
              !scrolled && isHomePage
                ? "bg-white/10 backdrop-blur-md border-white/10"
                : "bg-muted/60 border-border/50",
            )}
            aria-label="Main navigation"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-all rounded-full focus-visible:outline-2 focus-visible:outline-destructive",
                    isActive
                      ? !scrolled && isHomePage
                        ? "bg-white/20 text-white font-semibold"
                        : "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : link.danger
                        ? "text-destructive hover:bg-destructive/10 font-semibold"
                        : !scrolled && isHomePage
                          ? "text-white/80 hover:text-white hover:bg-white/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/80",
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    {link.danger && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
                      </span>
                    )}
                    {t(link.label)}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons Zone */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2.5">
              <LanguageToggle
                className={cn(
                  !scrolled && isHomePage
                    ? "text-white hover:bg-white/10"
                    : "text-foreground hover:bg-accent",
                )}
              />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none">
                    <Avatar className="h-9 w-9 border border-border/60">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                        {initialsOf(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{user.name}</span>
                          <span className="text-xs font-normal text-muted-foreground">
                            {user.email}
                          </span>
                        </div>
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                      <LayoutDashboard className="h-4 w-4" />
                      {t("nav.dashboard")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} variant="destructive">
                      <LogOut className="h-4 w-4" />
                      {t("nav.logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="ghost"
                  className={cn(
                    "rounded-full px-5 transition-all",
                    !scrolled && isHomePage
                      ? "text-white hover:bg-white/10 hover:text-white"
                      : "text-foreground hover:bg-accent",
                  )} nativeButton={false} render={<Link href="/login" className="flex items-center gap-1.5" />}>
                    <LogIn className="size-4" />
                    <span>{t("nav.signIn")}</span>
                  </Button>
              )}

              <Button
                variant="destructive"
                className="rounded-full shadow-md shadow-destructive/10 hover:shadow-lg hover:shadow-destructive/20 transition-all" nativeButton={false} render={<Link href="/sos" className="flex items-center gap-2" />}>
                  <HeartHandshake className="size-4" />
                  <span className="font-semibold">{t("nav.getHelp")}</span>
                </Button>
            </div>
            <button
              ref={triggerRef}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className={cn(
                "md:hidden inline-flex items-center justify-center p-2 rounded-xl transition-colors border focus-visible:outline-2 focus-visible:outline-destructive focus-visible:outline-offset-2",
                !scrolled && isHomePage
                  ? "text-white bg-white/5 border-white/10 hover:bg-white/15"
                  : "text-foreground bg-muted/40 border-border/50 hover:bg-accent",
              )}
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="size-6" />
            </button>
          </div>
        </div>
      </header>
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden"
            onClick={() => {
              setMenuOpen(false);
              triggerRef.current?.focus();
            }}
          />

          <div
            ref={drawerRef}
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            className="fixed top-0 right-0 z-50 h-full w-full max-w-75 bg-card border-l border-border/40 shadow-2xl md:hidden flex flex-col transition-all duration-300"
          >
            <div className="flex items-center justify-between h-16 px-5 border-b border-border/40">
              <span className="font-bold text-lg text-foreground tracking-tight">
                {t("nav.menu")}
              </span>
              <button
                type="button"
                aria-label="Close menu"
                className="inline-flex items-center justify-center p-2 rounded-xl text-foreground hover:bg-accent border border-transparent hover:border-border/30 focus-visible:outline-2 focus-visible:outline-destructive transition-all"
                onClick={() => {
                  setMenuOpen(false);
                  triggerRef.current?.focus();
                }}
              >
                <X className="size-5" />
              </button>
            </div>

            <nav
              className="flex-1 flex flex-col gap-1.5 p-4 overflow-y-auto"
              aria-label="Mobile navigation"
            >
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-medium transition-all group",
                      isActive
                        ? "bg-primary/10 text-primary font-bold"
                        : link.danger
                          ? "text-destructive hover:bg-destructive/10"
                          : "text-foreground hover:bg-accent",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {link.danger && (
                        <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                      )}
                      {t(link.label)}
                    </span>
                    <ChevronRight className="size-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                );
              })}

              <div
                className="my-3 border-t border-border/40"
                aria-hidden="true"
              />

              <div className="flex flex-col gap-3 px-1 mt-2">
                <LanguageToggle className="justify-center border border-border/60 h-11 rounded-xl text-foreground hover:bg-accent" />
                {user ? (
                  <>
                    <Button
                      variant="outline"
                      className="w-full justify-center rounded-xl text-foreground bg-background hover:bg-accent h-11 border-border/60" nativeButton={false} render={<Link href="/dashboard" onClick={() => setMenuOpen(false)} />}>
                        <LayoutDashboard className="size-4 mr-1.5" />
                        {t("nav.dashboard")}
                      </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-center rounded-xl text-destructive hover:bg-destructive/10 h-11"
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      <LogOut className="size-4 mr-1.5" />
                      {t("nav.logout")}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full justify-center rounded-xl text-foreground bg-background hover:bg-accent h-11 border-border/60" nativeButton={false} render={<Link href="/login" onClick={() => setMenuOpen(false)} />}>
                      <LogIn className="size-4 mr-1.5" />
                      {t("nav.signIn")}
                    </Button>
                )}
                <Button
                  variant="destructive"
                  className="w-full justify-center rounded-xl flex items-center gap-2 h-11 shadow-sm" nativeButton={false} render={<Link href="/sos" onClick={() => setMenuOpen(false)} />}>
                    <HeartHandshake className="size-4" />
                    <span className="font-semibold">{t("nav.getHelp")}</span>
                  </Button>
              </div>
            </nav>

            <div className="p-5 text-center border-t border-border/30">
              <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                &copy; 2026 FloodAid BD
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
