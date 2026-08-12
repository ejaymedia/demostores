import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";
import defaultSiteSettings from "../data/siteSettings";

const SiteContext = createContext();

// Generate shades from a hex colour
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 29, g: 78, b: 216 };
};

const generateShades = (hex) => {
  const { r, g, b } = hexToRgb(hex);

  // Light shade — mix with white (90% white, 10% colour)
  const light = `rgb(${Math.round(r * 0.15 + 255 * 0.85)}, ${Math.round(
    g * 0.15 + 255 * 0.85
  )}, ${Math.round(b * 0.15 + 255 * 0.85)})`;

  // Medium shade — mix with white (50% white, 50% colour)
  const medium = `rgb(${Math.round(r * 0.5 + 255 * 0.5)}, ${Math.round(
    g * 0.5 + 255 * 0.5
  )}, ${Math.round(b * 0.5 + 255 * 0.5)})`;

  // Dark shade — darken by 20%
  const dark = `rgb(${Math.round(r * 0.75)}, ${Math.round(
    g * 0.75
  )}, ${Math.round(b * 0.75)})`;

  // Darker shade — darken by 40%
  const darker = `rgb(${Math.round(r * 0.55)}, ${Math.round(
    g * 0.55
  )}, ${Math.round(b * 0.55)})`;

  // Alpha versions for backgrounds and borders
  const alpha10 = `rgba(${r}, ${g}, ${b}, 0.1)`;
  const alpha20 = `rgba(${r}, ${g}, ${b}, 0.2)`;
  const alpha30 = `rgba(${r}, ${g}, ${b}, 0.3)`;

  return { light, medium, dark, darker, alpha10, alpha20, alpha30 };
};

export const SiteProvider = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState(defaultSiteSettings);
  const [loading, setLoading] = useState(true);

  const applySettings = (settings) => {
    const primary = settings.brand_color_1 || defaultSiteSettings.brand_color_1;
    const footerColor = settings.footer_color || defaultSiteSettings.footer_color;
    const shades = generateShades(primary);

    // ── Primary colour + shades ───────────────────────
    document.documentElement.style.setProperty("--brand-1", primary);
    document.documentElement.style.setProperty("--brand-shade-light", shades.light);
    document.documentElement.style.setProperty("--brand-shade-medium", shades.medium);
    document.documentElement.style.setProperty("--brand-shade-dark", shades.dark);
    document.documentElement.style.setProperty("--brand-shade-darker", shades.darker);
    document.documentElement.style.setProperty("--brand-alpha-10", shades.alpha10);
    document.documentElement.style.setProperty("--brand-alpha-20", shades.alpha20);
    document.documentElement.style.setProperty("--brand-alpha-30", shades.alpha30);

    // ── Footer colour ─────────────────────────────────
    document.documentElement.style.setProperty("--brand-footer", footerColor);

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
    themeColor.content = primary;

    // ── Meta Description ──────────────────────────────
    let metaDesc = document.getElementById("meta-description");
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.id = "meta-description";
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    if (settings.tagline) metaDesc.content = settings.tagline;

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
    applySettings(defaultSiteSettings);
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