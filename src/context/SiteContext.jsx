import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";
import defaultSiteSettings from "../data/siteSettings";

const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState(defaultSiteSettings);
  const [loading, setLoading] = useState(true);

  const applySettings = (settings) => {
    // ── CSS Variables ─────────────────────────────────
    document.documentElement.style.setProperty(
      "--brand-1",
      settings.brand_color_1 || defaultSiteSettings.brand_color_1
    );
    document.documentElement.style.setProperty(
      "--brand-2",
      settings.brand_color_2 || defaultSiteSettings.brand_color_2
    );

    // ── Page Title ────────────────────────────────────
    if (settings.site_title) {
      document.title = settings.site_title;
    }

    // ── Favicon ───────────────────────────────────────
    if (settings.favicon_url) {
      let favicon = document.getElementById("favicon");
      if (!favicon) {
        favicon = document.createElement("link");
        favicon.id = "favicon";
        favicon.rel = "icon";
        favicon.type = "image/png";
        document.head.appendChild(favicon);
      }
      // Force browser to reload favicon by appending cache-buster
      favicon.href = `${settings.favicon_url}?t=${Date.now()}`;
    }

    // ── Theme Color ───────────────────────────────────
    const themeColor = document.getElementById("meta-theme-color");
    if (themeColor && settings.brand_color_1) {
      themeColor.content = settings.brand_color_1;
    }

    // ── Meta Description ──────────────────────────────
    const metaDesc = document.getElementById("meta-description");
    if (metaDesc && settings.tagline) {
      metaDesc.content = settings.tagline;
    }

    // ── Open Graph ────────────────────────────────────
    const ogTitle = document.getElementById("og-title");
    if (ogTitle && settings.site_title) {
      ogTitle.content = settings.site_title;
    }

    const ogDesc = document.getElementById("og-description");
    if (ogDesc && settings.tagline) {
      ogDesc.content = settings.tagline;
    }

    const ogSiteName = document.getElementById("og-site-name");
    if (ogSiteName && settings.business_name) {
      ogSiteName.content = settings.business_name;
    }
  };

  const loadSettings = async () => {
    // Apply defaults first (colours + title only, no images)
    applySettings(defaultSiteSettings);

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
        // Supabase values always win — no merging with defaults for image fields
        const merged = {
          ...defaultSiteSettings,
          ...data,
        };
        setSiteSettings(merged);
        applySettings(merged);
      }
    } catch (error) {
      console.error("loadSettings error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const refreshSettings = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single();
      if (error) throw error;
      if (data) {
        const merged = { ...defaultSiteSettings, ...data };
        setSiteSettings(merged);
        applySettings(merged);
      }
    } catch (error) {
      console.error("refreshSettings error:", error);
    }
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