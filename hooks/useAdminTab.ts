"use client";
import { useState } from "react";

/**
 * Shared state and save handler for admin tab components.
 * After save, calls onRefresh (which should be scoped to a single entity)
 * to avoid full-page data reload.
 */
export function useAdminTab<T extends { id: number }>(
  endpoint: string,
  successMessage: string,
  flash: (msg: string) => void,
  onRefresh: () => void
) {
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (formData: unknown) => {
    setSaving(true);
    try {
      const res = await fetch(
        editingItem ? `${endpoint}/${editingItem.id}` : endpoint,
        {
          method: editingItem ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (res.ok) {
        flash(successMessage);
        setShowForm(false);
        setEditingItem(null);
        onRefresh(); // scoped single-entity refresh
      } else {
        flash("❌ Gagal simpan");
      }
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item: T) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const startCreate = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  return { editingItem, showForm, saving, handleSave, startEdit, startCreate, cancelForm };
}
