"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

const labels: Record<string, string> = {
  en: "English",
  hi: "हिन्दी",
  es: "Español",
  fr: "Français",
};

export default function LanguageSwitcher() {
  const { lang, setLang, available } = useLanguage();

  return (
    <div className="inline-block">
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as any)}
        className="border rounded px-2 py-1"
      >
        {available.map((l) => (
          <option key={l} value={l}>
            {labels[l] || l}
          </option>
        ))}
      </select>
    </div>
  );
}
