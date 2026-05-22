import { createContext, useContext, useMemo } from "react";
import { useSiteContent } from "../hooks/useSiteContent";
import { mergeSiteContent } from "../utils/mergeSiteData";

const SiteDataContext = createContext(null);

export function SiteDataProvider({ children }) {
  const { content, loading, settings: rawSettings, ...rest } = useSiteContent();
  const merged = useMemo(
    () => mergeSiteContent(content, { deferLogoDefaults: loading }),
    [content, loading]
  );

  const value = useMemo(
    () => ({
      ...rest,
      content,
      loading,
      settings: merged.settings,
      founders: merged.founders,
      services: merged.services,
      projects: merged.projects,
      team: merged.team,
      blog: merged.blog,
    }),
    [rest, content, loading, merged]
  );

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) {
    throw new Error("useSiteData must be used within SiteDataProvider");
  }
  return ctx;
}

/** Safe for admin preview outside provider */
export function useSiteDataOptional() {
  return useContext(SiteDataContext);
}
