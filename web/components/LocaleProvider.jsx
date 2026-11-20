"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "voicetrace:locale";

export const LOCALES = [
  { key: "zh", label: "简体中文", short: "简" },
  { key: "zh-HK", label: "繁體中文", short: "繁" },
  { key: "en", label: "English", short: "EN" },
];

const LocaleContext = createContext(null);

function detectLocale() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (LOCALES.some((item) => item.key === saved)) return saved;
  } catch (error) {
    // 隐私模式可能禁用 localStorage，继续用浏览器语言。
  }
  const lang = window.navigator.language || "";
  if (/^en/i.test(lang)) return "en";
  if (/^zh-(hk|tw|mo|hant)/i.test(lang)) return "zh-HK";
  return "zh";
}

function convertDeep(value, convert) {
  if (typeof value === "string") return convert ? convert(value) : value;
  if (Array.isArray(value)) return value.map((item) => convertDeep(item, convert));
  if (value && typeof value === "object") {
    const next = {};
    for (const [key, item] of Object.entries(value)) {
      next[key] = convertDeep(item, convert);
    }
    return next;
  }
  return value;
}

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState("zh");
  const [converter, setConverter] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocaleState(detectLocale());
    setMounted(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang =
      locale === "en" ? "en" : locale === "zh-HK" ? "zh-Hant" : "zh-Hans";
  }, [locale]);

  useEffect(() => {
    if (locale !== "zh-HK" || converter) return undefined;
    let alive = true;
    import("opencc-js")
      .then((module) => {
        if (!alive) return;
        const convert = module.Converter({ from: "cn", to: "hk" });
        setConverter(() => convert);
      })
      .catch(() => {
        // 转换失败时保留简体，不影响阅读。
      });
    return () => {
      alive = false;
    };
  }, [locale, converter]);

  const setLocale = useCallback((next) => {
    if (!LOCALES.some((item) => item.key === next)) return;
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch (error) {
      // 写不进去也不影响当前会话。
    }
  }, []);

  const localize = useCallback(
    (value) => (locale === "zh-HK" ? convertDeep(value, converter) : value),
    [locale, converter]
  );

  const pick = useCallback(
    (copy) => {
      if (!copy) return copy;
      const source = locale === "en" ? copy.en : copy.zh;
      return locale === "zh-HK" ? convertDeep(source, converter) : source;
    },
    [locale, converter]
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      localize,
      pick,
      mounted,
      ready: locale !== "zh-HK" || Boolean(converter),
    }),
    [locale, setLocale, localize, pick, mounted, converter]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return (
    useContext(LocaleContext) || {
      locale: "zh",
      setLocale: () => {},
      localize: (value) => value,
      pick: (copy) => copy?.zh,
      mounted: true,
      ready: true,
    }
  );
}

export default LocaleProvider;

