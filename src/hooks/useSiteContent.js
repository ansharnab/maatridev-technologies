import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { mergeSiteContent } from "../utils/mergeSiteData";

export function useSiteContent() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    axios
      .get("/api/content", { signal: controller.signal, timeout: 8000 })
      .then((res) => setContent(res.data))
      .catch(() => setContent({ pages: {}, settings: {} }))
      .finally(() => {
        clearTimeout(timeoutId);
        setLoading(false);
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const getPageBlocks = (pageId, fallback = []) => {
    if (!content?.pages?.[pageId]?.blocks?.length) return fallback;
    return content.pages[pageId].blocks;
  };

  const getPageSections = (pageId) => {
    const sec = content?.pages?.[pageId]?.sections;
    if (!sec?.items?.length || sec.enabled === false) return null;
    return sec.items;
  };

  const getPuckPage = (pageId) => {
    const puck = content?.pages?.[pageId]?.puck;
    if (!puck?.data?.content?.length || puck.enabled === false) return null;
    return puck.data;
  };

  const getWysiwygPage = (pageId) => {
    const w = content?.pages?.[pageId]?.wysiwyg;
    if (!w?.html || w.enabled === false) return null;
    return w;
  };

  const merged = useMemo(
    () => mergeSiteContent(content, { deferLogoDefaults: loading }),
    [content, loading]
  );
  const settings = merged.settings;

  return {
    content,
    loading,
    settings,
    merged,
    rawSettings: content?.settings,
    getPageBlocks,
    getPageSections,
    getPuckPage,
    getWysiwygPage,
    setContent,
  };
}
