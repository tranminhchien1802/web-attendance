"use client";
import { useEffect, useState } from "react";
export function usePortalData() { const [revision, setRevision] = useState(0); useEffect(() => { const update = () => setRevision(old => old + 1); update(); window.addEventListener("plt:data", update); window.addEventListener("storage", update); return () => { window.removeEventListener("plt:data", update); window.removeEventListener("storage", update); }; }, []); return revision; }
export function useUnsavedChanges(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const unload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    const navigate = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!anchor || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const next = new URL(anchor.getAttribute("href")!, window.location.href);
      if (next.pathname === window.location.pathname && next.search === window.location.search) return;
      if (!window.confirm("Bạn có thay đổi chưa lưu. Rời trang này?")) { event.preventDefault(); event.stopPropagation(); }
    };
    window.addEventListener("beforeunload", unload);
    document.addEventListener("click", navigate, true);
    return () => { window.removeEventListener("beforeunload", unload); document.removeEventListener("click", navigate, true); };
  }, [dirty]);
}
