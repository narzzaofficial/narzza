"use client";
import { useState } from "react";
import type { Book } from "@/types/content";
import { BookForm } from "./book-form";
import { useAdminTab } from "@/hooks/useAdminTab";
import { JsonImportModal } from "@/components/JsonImportModal";

const BOOK_SCHEMA = `[
  {
    "title": "Judul Buku",
    "author": "Nama Penulis",
    "cover": "https://example.com/cover.jpg",
    "genre": "Teknologi",
    "pages": 200,
    "rating": 4.5,
    "description": "Deskripsi buku...",
    "chapters": [
      {
        "title": "Bab 1",
        "lines": [
          { "role": "q", "text": "Pertanyaan...", "image": "" },
          { "role": "a", "text": "Jawaban...", "image": "" }
        ]
      }
    ],
    "storyId": null
  }
]`;

type BookTabProps = {
  books: Book[];
  onRefresh: () => void;
  onDelete: (id: number) => void;
  flash: (message: string) => void;
};

export function BookTab({ books, onRefresh, onDelete, flash }: BookTabProps) {
  const {
    editingItem: editingBook,
    showForm,
    handleSave,
    startEdit,
    startCreate,
    cancelForm,
  } = useAdminTab<Book>("/api/books", "✅ Buku Tersimpan!", flash, onRefresh);
  const [showJsonModal, setShowJsonModal] = useState(false);

  async function handleJsonImport(items: unknown[]) {
    let failCount = 0;
    let lastError = "";
    for (const item of items) {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) {
        failCount++;
        try {
          const data = await res.json();
          const fields = data?.details?.fieldErrors;
          lastError = fields
            ? Object.entries(fields)
                .map(([k, v]) => `${k}: ${(v as string[]).join(", ")}`)
                .join(" | ")
            : data?.error ?? `HTTP ${res.status}`;
        } catch {
          lastError = `HTTP ${res.status}`;
        }
      }
    }
    if (failCount > 0)
      return `${failCount} dari ${items.length} buku gagal disimpan. Error: ${lastError}`;
    flash(`✅ ${items.length} Buku berhasil diimport!`);
    onRefresh();
    return null;
  }

  return (
    <div>
      {showJsonModal && (
        <JsonImportModal
          title="Buku"
          schemaHint={BOOK_SCHEMA}
          onImport={handleJsonImport}
          onClose={() => setShowJsonModal(false)}
        />
      )}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Daftar Buku</h2>
        {!showForm && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowJsonModal(true)}
              className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-semibold hover:bg-slate-600"
            >
              + Tambah JSON
            </button>
            <button
              onClick={startCreate}
              className="rounded-lg bg-amber-600/80 hover:bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white"
            >
              + Tambah Buku
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <BookForm
          initialData={editingBook}
          onSave={handleSave}
          onCancel={cancelForm}
        />
      )}

      <div className="space-y-3">
        {books.map((book: Book) => (
          <div
            key={book.id}
            className="glass-panel flex items-center justify-between p-4 rounded-xl"
          >
            <div>
              <div className="flex gap-2 items-center mb-1">
                <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 rounded-full font-bold">
                  {book.genre}
                </span>
                <span className="text-xs text-amber-300">★ {book.rating}</span>
              </div>
              <p className="text-sm font-medium">{book.title}</p>
              <p className="text-xs text-slate-400">
                {book.author} • {book.chapters.length} Bab • {book.pages} Hal
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(book)}
                className="text-xs bg-slate-700 px-3 py-1.5 rounded-lg"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(book.id)}
                className="text-xs bg-red-900/40 px-3 py-1.5 rounded-lg text-red-300"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
