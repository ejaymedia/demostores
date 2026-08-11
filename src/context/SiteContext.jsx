import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";
import defaultSiteSettings from "../data/siteSettings";

const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState(defaultSiteSettings);
  const [loading, setLoading] = useState(true);

  const applySettings = (settings) => {
    // ── CSS Variables ─────────────────────────────────
    if (settings.brand_color_1) {
      document.documentElement.style.setProperty(
        "--brand-1",
        settings.brand_color_1
      );
    }
    if (settings.brand_color_2) {
      document.documentElement.style.setProperty(
        "--brand-2",
        settings.brand_color_2
      );
    }

    // ── Page Title ────────────────────────────────────
    if (settings.site_title) {
      document.title = settings.site_title;
    }

    // ── Favicon ───────────────────────────────────────
    if (settings.favicon_url) {
      let link = document.getElementById("favicon");
      if (!link) {
        link = document.createElement("link");
        link.id = "favicon";
        link.rel = "icon";
        link.type = "image/png";
        document.head.appendChild(link);
      }
      link.href = `${settings.favicon_url}?t=${Date.now()}`;
    }

    // ── Theme Color ───────────────────────────────────
    let themeColor = document.getElementById("meta-theme-color");
    if (!themeColor) {
      themeColor = document.createElement("meta");
      themeColor.id = "meta-theme-color";
      themeColor.name = "theme-color";
      document.head.appendChild(themeColor);
    }
    if (settings.brand_color_1) {
      themeColor.content = settings.brand_color_1;
    }

    // ── Meta Description ──────────────────────────────
    let metaDesc = document.getElementById("meta-description");
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.id = "meta-description";
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    if (settings.tagline) {
      metaDesc.content = settings.tagline;
    }

    // ── Open Graph ────────────────────────────────────
    const setMeta = (id, property, content) => {
      if (!content) return;
      let el = document.getElementById(id);
      if (!el) {
        el = document.createElement("meta");
        el.id = id;
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta("og-title", "og:title", settings.site_title);
    setMeta("og-description", "og:description", settings.tagline);
    setMeta("og-site-name", "og:site_name", settings.business_name);
    setMeta("og-type", "og:type", "website");
  };

  const fetchAndApply = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single();

      if (error) throw error;

      if (data) {
        // Supabase data wins over defaults for everything
        const merged = { ...defaultSiteSettings, ...data };
        setSiteSettings(merged);
        applySettings(merged);
      }
    } catch (error) {
      console.error("fetchAndApply error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Apply default colours immediately so page doesn't flash unstyled
    applySettings(defaultSiteSettings);
    // Then fetch real settings from Supabase
    fetchAndApply();
  }, []);

  const refreshSettings = async () => {
    await fetchAndApply();
  };

  return (
    <SiteContext.Provider
      value={{ siteSettings, loading, refreshSettings, setSiteSettings }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);