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
    document.title = settings.site_title || defaultSiteSettings.site_title;

    // ── Favicon ───────────────────────────────────────
    const favicon = document.getElementById("favicon");
    if (favicon && settings.favicon_url) {
      favicon.href = settings.favicon_url;
    }

    // ── Theme Color ───────────────────────────────────
    const themeColor = document.getElementById("meta-theme-color");
    if (themeColor) {
      themeColor.content =
        settings.brand_color_1 || defaultSiteSettings.brand_color_1;
    }

    // ── Meta Description ──────────────────────────────
    const metaDesc = document.getElementById("meta-description");
    if (metaDesc) {
      metaDesc.content =
        settings.tagline || defaultSiteSettings.tagline;
    }

    // ── Open Graph ────────────────────────────────────
    const ogTitle = document.getElementById("og-title");
    if (ogTitle) {
      ogTitle.content =
        settings.site_title || defaultSiteSettings.site_title;
    }

    const ogDesc = document.getElementById("og-description");
    if (ogDesc) {
      ogDesc.content = settings.tagline || defaultSiteSettings.tagline;
    }

    const ogImage = document.getElementById("og-image");
    if (ogImage) {
      ogImage.content =
        settings.og_image_url || defaultSiteSettings.og_image_url;
    }

    const ogUrl = document.getElementById("og-url");
    if (ogUrl) {
      ogUrl.content = settings.og_url || defaultSiteSettings.og_url;
    }

    const ogSiteName = document.getElementById("og-site-name");
    if (ogSiteName) {
      ogSiteName.content =
        settings.business_name || defaultSiteSettings.business_name;
    }

    const ogType = document.getElementById("og-type");
    if (ogType) {
      ogType.content = "website";
    }
  };

  useEffect(() => {
    const loadSettings = async () => {
      // Apply defaults first so the site isn't blank while loading
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
          const merged = { ...defaultSiteSettings, ...data };
          setSiteSettings(merged);
          applySettings(merged);
        }
      } catch (error) {
        console.error("loadSettings error:", error);
        // Fall back to defaults silently
      } finally {
        setLoading(false);
      }
    };

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