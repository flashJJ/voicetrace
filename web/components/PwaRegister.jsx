"use client";

import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return undefined;
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return undefined;

    const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const register = () => {
      navigator.serviceWorker
        .register(`${base}/sw.js`, { scope: `${base}/` })
        .catch(() => {
          // 注册失败不影响在线使用。
        });
    };

    if (document.readyState === "complete") {
      register();
      return undefined;
    }
    window.addEventListener("load", register);
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
