import { supabase } from "./supabase";

// ── SITE SETTINGS ─────────────────────────────────────

export const getSiteSettings = async () => {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("getSiteSettings error:", error);
    return null;
  }
};

export const updateSiteSettings = async (settings) => {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .upsert(settings)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("updateSiteSettings error:", error);
    return null;
  }
};

// ── PRODUCTS ──────────────────────────────────────────

export const getProducts = async ({ gender, category, sort, showOnly } = {}) => {
  try {
    let query = supabase.from("products").select("*");

    if (gender && gender !== "all") {
      query = query.eq("gender", gender);
    }

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    if (showOnly === "hotDeal") {
      query = query.eq("is_hot_deal", true);
    } else if (showOnly === "newArrival") {
      query = query.eq("is_new_arrival", true);
    } else if (showOnly === "onSale") {
      query = query.not("sale_price", "is", null);
    }

    if (sort === "price_asc") {
      query = query.order("price", { ascending: true });
    } else if (sort === "price_desc") {
      query = query.order("price", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("getProducts error:", error);
    return [];
  }
};

export const getProductById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("getProductById error:", error);
    return null;
  }
};

export const getNewArrivals = async (limit = 8) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_new_arrival", true)
      .eq("in_stock", true)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("getNewArrivals error:", error);
    return [];
  }
};

export const getHotDeals = async (limit = 8) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_hot_deal", true)
      .eq("in_stock", true)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("getHotDeals error:", error);
    return [];
  }
};

export const addProduct = async (product) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .insert([product])
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("addProduct error:", error);
    return null;
  }
};

export const updateProduct = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("updateProduct error:", error);
    return null;
  }
};

export const deleteProduct = async (id) => {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("deleteProduct error:", error);
    return false;
  }
};

// ── ENQUIRIES ─────────────────────────────────────────

export const getEnquiries = async () => {
  try {
    const { data, error } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("getEnquiries error:", error);
    return [];
  }
};

export const addEnquiry = async (enquiry) => {
  try {
    const { data, error } = await supabase
      .from("enquiries")
      .insert([enquiry])
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("addEnquiry error:", error);
    return null;
  }
};

export const updateEnquiryStatus = async (id, status) => {
  try {
    const { data, error } = await supabase
      .from("enquiries")
      .update({ status })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("updateEnquiryStatus error:", error);
    return null;
  }
};

export const deleteEnquiry = async (id) => {
  try {
    const { error } = await supabase
      .from("enquiries")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("deleteEnquiry error:", error);
    return false;
  }
};

// ── STORAGE ───────────────────────────────────────────

export const uploadFile = async (bucket, path, file) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });
    if (error) throw error;
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return urlData.publicUrl;
  } catch (error) {
    console.error("uploadFile error:", error);
    return null;
  }
};