import { supabase } from "./supabase";

// ── PRODUCTS ──────────────────────────────────────────

export const getProducts = async () => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
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

export const toggleHotDeal = async (id, currentValue) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .update({ hot_deal: !currentValue })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("toggleHotDeal error:", error);
    return null;
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