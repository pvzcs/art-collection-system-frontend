"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocaleStore, Locale } from "@/lib/stores/localeStore";
import { useEffect, useState } from "react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocaleStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Auto-detect browser language on first mount if not set
    const storedLocale = localStorage.getItem("locale-storage");
    if (!storedLocale) {
      const browserLang = navigator.language.toLowerCase();
      const detectedLocale: Locale = browserLang.startsWith("zh") ? "zh" : "en";
      setLocale(detectedLocale);
    }
  }, [setLocale]);

  if (!mounted) {
    return null;
  }

  const languages = [
    { code: "en" as Locale, name: "English", nativeName: "English" },
    { code: "zh" as Locale, name: "Chinese", nativeName: "中文" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Change language"
          className="min-h-[44px] min-w-[44px]"
        >
          <Languages className="h-5 w-5" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLocale(lang.code)}
            className={locale === lang.code ? "bg-accent" : ""}
          >
            <span className="flex items-center justify-between w-full">
              <span>{lang.nativeName}</span>
              {locale === lang.code && <span className="text-primary">✓</span>}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
