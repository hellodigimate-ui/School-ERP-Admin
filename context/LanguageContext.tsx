/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type SupportedLang = "en" | "hi" | "es" | "fr"; // extend as needed
export interface Translations {
  [key: string]: string;
}

interface LanguageContextValue {
  lang: SupportedLang;
  setLang: (l: SupportedLang) => void;
  t: (key: string, fallback?: string) => string;
  // optional: list of available languages
  available: SupportedLang[];
}

const defaultLang: SupportedLang = "en";

// translation dictionary; you can move this to separate JSON files later
const dictionary: Record<SupportedLang, Translations> = {
  en: {
    "hello": "Hello",
    "welcome": "Welcome to the school portal",
    "schoolName": "School",
    "login": "Login",
    "quickLinks": "Quick Links",
    "contactUs": "Contact Us",
    "address": "Address",
    "phone": "Phone",
    "phoneNumber": "phone number",
    "email": "Email",
    "emailAddress": "email address",
    "home": "Home",
    "aboutus": "About Us",
    "admissions": "Admissions",
    "contact": "Contact",
    "heroContent": "Building futures with quality education and innovation.",
    "admissionsOpen": "Admissions Open",
    "learnMore": "Learn More",
    // add more keys...
  },
  hi: {
    "hello": "नमस्ते",
    "welcome": "स्कूल पोर्टल में आपका स्वागत है",
    "schoolName": "स्कूल",
    "login": "लॉगिन",
    "quickLinks": "त्वरित लिंक",
    "contactUs": "संपर्क करें",
    "address": "पता",
    "phone": "फोन",
    "phoneNumber": "फ़ोन नंबर",
    "email": "ईमेल",
    "emailAddress": "ईमेल पता",
    "home": "होम",
    "aboutus": "हमारे बारे में",
    "admissions": "प्रवेश",
    "contact": "संपर्क",
    "heroContent": "गुणवत्तापूर्ण शिक्षा और नवाचार के साथ भविष्य का निर्माण।",
    "admissionsOpen": "प्रवेश जारी हैं",
    "learnMore": "और जानें",
    // add more keys...
  },
  es: {
    "hello": "Hola",
    "welcome": "Bienvenido al portal escolar",
  },
  fr: {
    "hello": "Bonjour",
    "welcome": "Bienvenue sur le portail scolaire",
  },
};

const LanguageContext = createContext<LanguageContextValue>({
  lang: defaultLang,
  setLang: () => {},
  t: (key) => key,
  available: Object.keys(dictionary) as SupportedLang[],
});

interface ProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: ProviderProps) {
  const [lang, setLangState] = useState<SupportedLang>(defaultLang);

  useEffect(() => {
    // try restore from localStorage
    const stored = localStorage.getItem("lang") as SupportedLang | null;
    if (stored && dictionary[stored]) {
      setLangState(stored);
    }
  }, []);

  const setLang = (l: SupportedLang) => {
    if (!dictionary[l]) return;
    setLangState(l);
    localStorage.setItem("lang", l);
    // update html lang attribute so screen readers know
    if (typeof document !== "undefined") document.documentElement.lang = l;
  };

  const t = (key: string, fallback?: string) => {
    const txt = dictionary[lang]?.[key];
    if (txt !== undefined) return txt;
    return fallback ?? key;
  };

  const value = {
    lang,
    setLang,
    t,
    available: Object.keys(dictionary) as SupportedLang[],
  };

  useEffect(() => {
    // whenever lang changes update html tag for SEO/ screen readers
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function useTranslate() {
  const { t } = useLanguage();
  return t;
}
