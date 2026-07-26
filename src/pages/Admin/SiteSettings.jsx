import { useState, useRef } from "react";
import { Save, Upload, RefreshCw } from "lucide-react";
import { useSite } from "../../context/SiteContext";
import { updateSiteSettings, uploadFile } from "../../supabaseService";

const SiteSettings = () => {
  const { siteSettings, refreshSettings, setSiteSettings } = useSite();
  const [form, setForm] = useState({ ...siteSettings });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadingOg, setUploadingOg] = useState(false);

  const logoRef = useRef(null);
  const heroRef = useRef(null);
  const faviconRef = useRef(null);
  const ogRef = useRef(null);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
    setError("");
  };

  const handleUpload = async (file, bucket, path, field, setUploading) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(bucket, path, file);
      if (url) {
        setForm((prev) => ({ ...prev, [field]: url }));
      } else {
        setError(`Failed to upload ${field}. Please try again.`);
      }
    } catch (err) {
      setError(`Upload error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.business_name.trim()) {
      setError("Business name is required.");
      return;
    }
    if (!form.site_title.trim()) {
      setError("Site title is required.");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const saved = await updateSiteSettings(form);
      if (saved) {
        setSiteSettings({ ...siteSettings, ...form });
        await refreshSettings();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError("Failed to save settings. Please try again.");
      }
    } catch (err) {
      setError(`Save error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder-gray-400 px-4 py-3 rounded-xl outline-none focus:border-gray-400 transition-colors duration-200";
  const labelClass =
    "text-gray-500 text-xs font-bold uppercase tracking-widest block mb-2";

  const UploadButton = ({
    label,
    previewUrl,
    inputRef,
    uploading,
    accept = "image/*",
    onFileChange,
    isSquare = false,
  }) => (
    <div className="flex items-start gap-4">
      {/* Preview */}
      <div
        className={`shrink-0 bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center ${
          isSquare ? "w-16 h-16 rounded-xl" : "w-24 h-14 rounded-xl"
        }`}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={label}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <span className="text-gray-300 text-xs">No image</span>
        )}
      </div>
      {/* Upload */}
      <div className="flex-1">
        <p className="text-gray-900 text-sm font-semibold mb-1">{label}</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={onFileChange}
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 disabled:opacity-50"
        >
          {uploading ? (
            <RefreshCw size={13} className="animate-spin" />
          ) : (
            <Upload size={13} />
          )}
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
        {previewUrl && (
          <p className="text-gray-400 text-xs mt-1 truncate max-w-xs">
            {previewUrl}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-gray-900 font-bold text-lg">Site Settings</h2>
          <p className="text-gray-400 text-xs mt-0.5">
            Changes apply across the entire website instantly
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "var(--brand-1)" }}
        >
          {saving ? (
            <RefreshCw size={15} className="animate-spin" />
          ) : (
            <Save size={15} />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Success */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
          ✅ Settings saved successfully!
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-8">

        {/* ── BRAND INFO ─────────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h3 className="text-gray-900 font-bold text-sm uppercase tracking-widest mb-5">
            Brand Information
          </h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Business Name *</label>
              <input
                type="text"
                value={form.business_name}
                onChange={(e) => handleChange("business_name", e.target.value)}
                placeholder="e.g. Bovic Collections"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Tagline</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => handleChange("tagline", e.target.value)}
                placeholder="e.g. Premium fashion for Men, Women & Kids"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Site Title *</label>
              <input
                type="text"
                value={form.site_title}
                onChange={(e) => handleChange("site_title", e.target.value)}
                placeholder="e.g. Bovic Collections — Fashion & Lifestyle"
                className={inputClass}
              />
              <p className="text-gray-400 text-xs mt-1">
                This appears in the browser tab and search results
              </p>
            </div>
          </div>
        </div>

        {/* ── CONTACT INFO ───────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h3 className="text-gray-900 font-bold text-sm uppercase tracking-widest mb-5">
            Contact Information
          </h3>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Phone Number</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+234 000 000 0000"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>WhatsApp Number</label>
                <input
                  type="text"
                  value={form.whatsapp}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                  placeholder="2340000000000 (no + or spaces)"
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
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="hello@yourbrand.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="e.g. Lagos, Nigeria"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* ── BRAND COLOURS ──────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h3 className="text-gray-900 font-bold text-sm uppercase tracking-widest mb-2">
            Brand Colours
          </h3>
          <p className="text-gray-400 text-xs mb-5">
            These colours update the entire website instantly — buttons, accents,
            gradients and more.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Primary Colour</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.brand_color_1}
                  onChange={(e) =>
                    handleChange("brand_color_1", e.target.value)
                  }
                  className="w-12 h-12 rounded-xl border border-gray-200 cursor-pointer bg-transparent p-1"
                />
                <input
                  type="text"
                  value={form.brand_color_1}
                  onChange={(e) =>
                    handleChange("brand_color_1", e.target.value)
                  }
                  placeholder="#1d4ed8"
                  className={`${inputClass} flex-1`}
                />
              </div>
              <div
                className="mt-2 h-8 rounded-lg"
                style={{ background: form.brand_color_1 }}
              />
            </div>
            <div>
              <label className={labelClass}>Secondary Colour</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.brand_color_2}
                  onChange={(e) =>
                    handleChange("brand_color_2", e.target.value)
                  }
                  className="w-12 h-12 rounded-xl border border-gray-200 cursor-pointer bg-transparent p-1"
                />
                <input
                  type="text"
                  value={form.brand_color_2}
                  onChange={(e) =>
                    handleChange("brand_color_2", e.target.value)
                  }
                  placeholder="#6366f1"
                  className={`${inputClass} flex-1`}
                />
              </div>
              <div
                className="mt-2 h-8 rounded-lg"
                style={{ background: form.brand_color_2 }}
              />
            </div>
          </div>

          {/* Gradient preview */}
          <div className="mt-4">
            <p className="text-gray-400 text-xs mb-2">Gradient preview</p>
            <div
              className="h-10 rounded-xl"
              style={{
                background: `linear-gradient(90deg, ${form.brand_color_1}, ${form.brand_color_2})`,
              }}
            />
          </div>
        </div>

        {/* ── MEDIA UPLOADS ──────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h3 className="text-gray-900 font-bold text-sm uppercase tracking-widest mb-5">
            Media & Images
          </h3>
          <div className="flex flex-col gap-6">

            {/* Logo */}
            <UploadButton
              label="Logo"
              previewUrl={form.logo_url}
              inputRef={logoRef}
              uploading={uploadingLogo}
              isSquare
              onFileChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleUpload(
                    file,
                    "brand-assets",
                    `logo/${Date.now()}-${file.name}`,
                    "logo_url",
                    setUploadingLogo
                  );
                }
              }}
            />

            <div className="border-t border-gray-100" />

            {/* Hero Image */}
            <UploadButton
              label="Hero Background Image"
              previewUrl={form.hero_url}
              inputRef={heroRef}
              uploading={uploadingHero}
              onFileChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleUpload(
                    file,
                    "brand-assets",
                    `hero/${Date.now()}-${file.name}`,
                    "hero_url",
                    setUploadingHero
                  );
                }
              }}
            />

            <div className="border-t border-gray-100" />

            {/* Favicon */}
            <UploadButton
              label="Favicon"
              previewUrl={form.favicon_url}
              inputRef={faviconRef}
              uploading={uploadingFavicon}
              isSquare
              accept="image/png,image/x-icon,image/svg+xml"
              onFileChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleUpload(
                    file,
                    "brand-assets",
                    `favicon/${Date.now()}-${file.name}`,
                    "favicon_url",
                    setUploadingFavicon
                  );
                }
              }}
            />
            <p className="text-gray-400 text-xs -mt-4">
              Recommended: .png or .ico, at least 32×32px
            </p>

            <div className="border-t border-gray-100" />

            {/* OG Image */}
            <UploadButton
              label="Open Graph / Social Share Image"
              previewUrl={form.og_image_url}
              inputRef={ogRef}
              uploading={uploadingOg}
              onFileChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleUpload(
                    file,
                    "brand-assets",
                    `og/${Date.now()}-${file.name}`,
                    "og_image_url",
                    setUploadingOg
                  );
                }
              }}
            />
            <p className="text-gray-400 text-xs -mt-4">
              Recommended: 1200×630px. Shown when links are shared on WhatsApp,
              Facebook, etc.
            </p>
          </div>
        </div>

        {/* ── SEO / OG URL ───────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h3 className="text-gray-900 font-bold text-sm uppercase tracking-widest mb-2">
            SEO & Open Graph
          </h3>
          <p className="text-gray-400 text-xs mb-5">
            These are used by Google, WhatsApp, and Facebook when your site is
            shared or indexed.
          </p>
          <div>
            <label className={labelClass}>Site URL</label>
            <input
              type="text"
              value={form.og_url}
              onChange={(e) => handleChange("og_url", e.target.value)}
              placeholder="https://yourdomain.com"
              className={inputClass}
            />
            <p className="text-gray-400 text-xs mt-1">
              Your live website URL — used in og:url meta tag
            </p>
          </div>
        </div>

        {/* Save button — bottom */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full inline-flex items-center justify-center gap-2 text-white text-sm font-semibold py-4 rounded-2xl transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "var(--brand-1)" }}
        >
          {saving ? (
            <RefreshCw size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {saving ? "Saving Changes..." : "Save All Settings"}
        </button>
      </div>
    </div>
  );
};

export default SiteSettings;