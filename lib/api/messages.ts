import type { Message, MessageCreatePayload, MessageStatus } from "@/types/messages";

export async function fetchMessages(opts?: {
  status?: MessageStatus;
  type?: "bug" | "suggestion";
}): Promise<Message[]> {
  const params = new URLSearchParams();
  if (opts?.status) params.set("status", opts.status);
  if (opts?.type) params.set("type", opts.type);
  const res = await fetch(`/api/messages?${params}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Gagal memuat pesan");
  return res.json();
}

export async function sendMessage(payload: MessageCreatePayload): Promise<Message> {
  const res = await fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Gagal mengirim pesan");
  }
  return res.json();
}

export async function updateMessageStatus(
  id: string,
  status: MessageStatus
): Promise<Message> {
  const res = await fetch(`/api/messages/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Gagal update status");
  return res.json();
}

export async function deleteMessage(id: string): Promise<void> {
  const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Gagal hapus pesan");
}

