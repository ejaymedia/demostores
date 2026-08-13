import { useState, useRef, useEffect } from "react";
import { Save, Upload, RefreshCw, Trash2 } from "lucide-react";
import { useSite } from "../../context/SiteContext";
import {
  updateSiteSettings,
  uploadFile,
  deleteStorageFile,
} from "../../supabaseService";

const BUCKET = "brand-assets";

const SiteSettings = () => {
  const { siteSettings, refreshSettings } = useSite();
  const [form, setForm] = useState({ ...siteSettings });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState({
    logo: false,
    hero: false,
    favicon: false,
    men: false,
    women: false,
    kids: false,
  });
  const [deleting, setDeleting] = useState({
    logo: false,
    hero: false,
    favicon: false,
    men: false,
    women: false,
    kids: false,
  });

  const refs = {
    logo: useRef(null),
    hero: useRef(null),
    favicon: useRef(null),
    men: useRef(null),
    women: useRef(null),
    kids: useRef(null),
  };

  useEffect(() => {
    setForm({ ...siteSettings });
  }, [siteSettings]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
    setError("");
  };

  const handleUpload = async (file, pathPrefix, field, key) => {
    if (!file) return;
    const oldUrl = form[field];
    setUploading((prev) => ({ ...prev, [key]: true }));
    setError("");
    try {
      const ext = file.name.split(".").pop();
      const path = `${pathPrefix}/${Date.now()}.${ext}`;
      const url = await uploadFile(BUCKET, path, file);
      if (url) {
        setForm((prev) => ({ ...prev, [field]: url }));
        if (oldUrl) await deleteStorageFile(BUCKET, oldUrl);
      } else {
        setError("Upload failed. Please try again.");
      }
    } catch (err) {
      setError(`Upload error: ${err.message}`);
    } finally {
      setUploading((prev) => ({ ...prev, [key]: false }));
      // Reset file input
      if (refs[key]?.current) refs[key].current.value = "";
    }
  };

  const handleDeleteImage = async (field, key) => {
    const url = form[field];
    if (!url) return;
    setDeleting((prev) => ({ ...prev, [key]: true }));
    setError("");
    try {
      await deleteStorageFile(BUCKET, url);
      setForm((prev) => ({ ...prev, [field]: "" }));
    } catch (err) {
      setError(`Delete error: ${err.message}`);
    } finally {
      setDeleting((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleSave = async () => {
    if (!form.business_name?.trim()) {
      setError("Business name is required.");
      return;
    }
    if (!form.site_title?.trim()) {
      setError("Site title is required.");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const saved = await updateSiteSettings(form);
      if (saved) {
        await refreshSettings();
        setSuccess(true);
      } else {
        setError("Failed to save settings. Please try again.");
      }
    } catch (err) {
      setError(`Save error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const isAnyUploading = Object.values(uploading).some(Boolean);
  const isAnyDeleting = Object.values(deleting).some(Boolean);

  const inputClass =
    "w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder-gray-400 px-4 py-3 rounded-xl outline-none focus:border-gray-400 transition-colors duration-200";
  const labelClass =
    "text-gray-500 text-xs font-bold uppercase tracking-widest block mb-2";

  // ── Reusable image upload field ───────────────────────
  const ImageField = ({
    label,
    fieldKey,
    field,
    pathPrefix,
    isSquare = false,
    accept = "image/*",
    note,
    previewContain = true,
  }) => {
    const hasImage = Boolean(form[field]);
    const isUp = uploading[fieldKey];
    const isDel = deleting[fieldKey];
    const isBusy = isUp || isDel;

    return (
      <div className="flex items-start gap-4">
        {/* Preview */}
        <div
          className={`shrink-0 bg-gray-100 border border-gray-200 rounded-xl overflow-hidden flex items-center justify-center ${
            isSquare ? "w-16 h-16" : "w-28 h-16"
          }`}
        >
          {hasImage ? (
            <img
              src={form[field]}
              alt={label}
              className={`w-full h-full ${
                previewContain ? "object-contain p-1" : "object-cover"
              }`}
              onError={(e) => { e.target.style.display = "none"; }}
            />
          ) : (
            <span className="text-gray-300 text-xs text-center px-2 leading-snug">
              No image
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 text-sm font-semibold mb-1">{label}</p>
          {note && (
            <p className="text-gray-400 text-xs mb-2 leading-relaxed">{note}</p>
          )}
          <input
            ref={refs[fieldKey]}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file, pathPrefix, field, fieldKey);
            }}
          />
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => refs[fieldKey].current?.click()}
              disabled={isBusy}
              className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-2 rounded-full transition-all duration-200 disabled:opacity-50"
            >
              {isUp ? (
                <RefreshCw size={11} className="animate-spin" />
              ) : (
                <Upload size={11} />
              )}
              {isUp ? "Uploading..." : hasImage ? "Replace" : "Upload"}
            </button>
            {hasImage && (
              <button
                onClick={() => handleDeleteImage(field, fieldKey)}
                disabled={isBusy}
                className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold px-3 py-2 rounded-full transition-all duration-200 disabled:opacity-50"
              >
                {isDel ? (
                  <RefreshCw size={11} className="animate-spin" />
                ) : (
                  <Trash2 size={11} />
                )}
                {isDel ? "Removing..." : "Remove"}
              </button>
            )}
          </div>
          {hasImage && !isUp && (
            <p className="text-green-600 text-xs mt-1.5 font-medium">
              ✓ Image set
            </p>
          )}
        </div>
      </div>
    );
  };

  // ── Colour picker field ───────────────────────────────
  const ColourField = ({ label, field, defaultValue, note, preview }) => (
    <div>
      <label className={labelClass}>{label}</label>
      {note && (
        <p className="text-gray-400 text-xs mb-3 leading-relaxed">{note}</p>
      )}
      <div className="flex items-center gap-3 mb-2">
        <input
          type="color"
          value={form[field] || defaultValue}
          onChange={(e) => handleChange(field, e.target.value)}
          className="w-12 h-12 rounded-xl border border-gray-200 cursor-pointer bg-transparent p-1 shrink-0"
        />
        <input
          type="text"
          value={form[field] || defaultValue}
          onChange={(e) => handleChange(field, e.target.value)}
          placeholder={defaultValue}
          className={`${inputClass} flex-1`}
        />
      </div>
      {preview && (
        <div
          className="h-8 rounded-xl"
          style={{ background: form[field] || defaultValue }}
        />
      )}
    </div>
  );

  return (
    <div className="max-w-2xl">

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-gray-900 font-bold text-base">Site Settings</h2>
        <p className="text-gray-400 text-xs mt-0.5">
          Changes apply across the entire website after saving
        </p>
      </div>

      <div className="flex flex-col gap-6">

        {/* ── BRAND INFO ─────────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h3 className="text-gray-900 font-bold text-xs uppercase tracking-widest mb-5">
            Brand Information
          </h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Business Name *</label>
              <input
                type="text"
                value={form.business_name || ""}
                onChange={(e) => handleChange("business_name", e.target.value)}
                placeholder="e.g. Bovic Collections"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Tagline</label>
              <input
                type="text"
                value={form.tagline || ""}
                onChange={(e) => handleChange("tagline", e.target.value)}
                placeholder="e.g. Premium fashion for Men, Women & Kids"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Site Title *</label>
              <input
                type="text"
                value={form.site_title || ""}
                onChange={(e) => handleChange("site_title", e.target.value)}
                placeholder="e.g. Bovic Collections — Fashion & Lifestyle"
                className={inputClass}
              />
              <p className="text-gray-400 text-xs mt-1">
                Appears in the browser tab and search engine results
              </p>
            </div>
          </div>
        </div>

        {/* ── CONTACT INFO ───────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h3 className="text-gray-900 font-bold text-xs uppercase tracking-widest mb-5">
            Contact Information
          </h3>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Phone Number</label>
                <input
                  type="text"
                  value={form.phone || ""}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+234 000 000 0000"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>WhatsApp Number</label>
                <input
                  type="text"
                  value={form.whatsapp || ""}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                  placeholder="2348012345678"
                  className={inputClass}
                />
                <p className="text-gray-400 text-xs mt-1">
                  International format without + e.g. 2348012345678
                </p>
              </div>
            </div>
            <div>
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                value={form.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="hello@yourbrand.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Address</label>
              <input
                type="text"
                value={form.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="e.g. Lagos, Nigeria"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* ── COLOURS ────────────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h3 className="text-gray-900 font-bold text-xs uppercase tracking-widest mb-2">
            Brand Colours
          </h3>
          <p className="text-gray-400 text-xs mb-6 leading-relaxed">
            The primary colour automatically generates shades used across
            buttons, accents, badges, and gradients throughout the site.
          </p>

          <div className="flex flex-col gap-6">
            {/* Primary colour */}
            <ColourField
              label="Primary Colour"
              field="brand_color_1"
              defaultValue="#1d4ed8"
              preview
              note="Used for buttons, links, accents, and badges. Shades are generated automatically — no need to pick multiple."
            />

            {/* Shade preview grid */}
            <div>
              <p className="text-gray-400 text-xs font-medium mb-2">
                Auto-generated shades
              </p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Light", key: "--brand-shade-light" },
                  { label: "Medium", key: "--brand-shade-medium" },
                  { label: "Dark", key: "--brand-shade-dark" },
                  { label: "Darker", key: "--brand-shade-darker" },
                ].map((shade) => (
                  <div key={shade.key} className="text-center">
                    <div
                      className="h-8 rounded-lg mb-1"
                      style={{
                        background: `var(${shade.key})`,
                      }}
                    />
                    <p className="text-gray-400 text-xs">{shade.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Footer colour */}
            <ColourField
              label="Footer Background Colour"
              field="footer_color"
              defaultValue="#111827"
              preview
              note="Controls the background colour of the site footer. Dark colours work best for contrast."
            />
          </div>
        </div>

        {/* ── LOGO & FAVICON ─────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h3 className="text-gray-900 font-bold text-xs uppercase tracking-widest mb-5">
            Logo & Favicon
          </h3>
          <div className="flex flex-col gap-6">
            <ImageField
              label="Logo"
              fieldKey="logo"
              field="logo_url"
              pathPrefix="logo"
              note="Displayed in the navbar, footer, and admin panel. Supports any shape — square, circular, or wide rectangular."
            />
            <div className="border-t border-gray-100" />
            <ImageField
              label="Favicon"
              fieldKey="favicon"
              field="favicon_url"
              pathPrefix="favicon"
              accept="image/png,image/x-icon,image/svg+xml"
              isSquare
              note="Browser tab icon. PNG or ICO recommended, at least 32×32px."
            />
          </div>
        </div>

        {/* ── HERO IMAGE ─────────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h3 className="text-gray-900 font-bold text-xs uppercase tracking-widest mb-5">
            Hero Background Image
          </h3>
          <ImageField
            label="Hero Image"
            fieldKey="hero"
            field="hero_url"
            pathPrefix="hero"
            previewContain={false}
            note="Full-screen background on the homepage hero. Use a high-quality landscape image."
          />
          {form.hero_url && (
            <div className="mt-4 relative rounded-xl overflow-hidden aspect-video border border-gray-100">
              <img
                src={form.hero_url}
                alt="Hero preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 flex flex-col items-center justify-center text-center p-4">
                <p className="text-white text-sm font-black mb-1">
                  {form.business_name || "DemoStores"}
                </p>
                <p className="text-white/70 text-xs">
                  {form.tagline || "Premium fashion"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── GENDER IMAGES ──────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h3 className="text-gray-900 font-bold text-xs uppercase tracking-widest mb-2">
            Gender Section Images
          </h3>
          <p className="text-gray-400 text-xs mb-5 leading-relaxed">
            Lifestyle images shown in the Shop by Gender section on the
            homepage. Portrait-style images work best.
          </p>
          <div className="flex flex-col gap-6">
            <ImageField
              label="Men's Image"
              fieldKey="men"
              field="men_image_url"
              pathPrefix="genders"
              previewContain={false}
              note="Shown on the Men gender card"
            />
            <div className="border-t border-gray-100" />
            <ImageField
              label="Women's Image"
              fieldKey="women"
              field="women_image_url"
              pathPrefix="genders"
              previewContain={false}
              note="Shown on the Women gender card"
            />
            <div className="border-t border-gray-100" />
            <ImageField
              label="Kids' Image"
              fieldKey="kids"
              field="kids_image_url"
              pathPrefix="genders"
              previewContain={false}
              note="Shown on the Kids gender card"
            />
          </div>
        </div>

        {/* ── SAVE BUTTON ────────────────────────────── */}
        <button
          onClick={handleSave}
          disabled={saving || isAnyUploading || isAnyDeleting}
          className="w-full inline-flex items-center justify-center gap-2 text-white text-sm font-semibold py-4 rounded-2xl transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "var(--brand-1)" }}
        >
          {saving ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Saving Changes...
            </>
          ) : isAnyUploading ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Waiting for uploads...
            </>
          ) : isAnyDeleting ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Removing image...
            </>
          ) : (
            <>
              <Save size={16} />
              Save All Settings
            </>
          )}
        </button>

        {/* ── FEEDBACK ───────────────────────────────── */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-5 py-4 rounded-2xl flex items-center gap-3">
            <span className="text-lg shrink-0">✅</span>
            <span>
              Settings saved successfully! Changes are now live across your site.
            </span>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-5 py-4 rounded-2xl flex items-center gap-3">
            <span className="text-lg shrink-0">❌</span>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteSettings;