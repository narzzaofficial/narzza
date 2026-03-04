export type MessageType = "bug" | "suggestion";

export type MessageStatus = "unread" | "read" | "archived";

export type Message = {
  _id?: string;
  id: string;         // nanoid / uuid
  type: MessageType;
  status: MessageStatus;

  // shared
  name: string;       // optional display name / "Anonim"
  email: string;      // optional
  message: string;    // main body

  // bug-specific
  pageUrl?: string;   // auto-filled from window.location

  // suggestion-specific
  contentType?: "Artikel" | "Tutorial" | "Riset" | "Buku" | "Roadmap" | "Produk" | "Lainnya";
  title?: string;     // suggested content title/idea

  createdAt: number;  // Date.now()
};

export type MessageCreatePayload = Omit<Message, "_id" | "id" | "status" | "createdAt">;

