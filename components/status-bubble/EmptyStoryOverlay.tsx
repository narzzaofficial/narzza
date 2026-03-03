type EmptyStoryOverlayProps = {
  onClose: () => void;
};

export function EmptyStoryOverlay({ onClose }: EmptyStoryOverlayProps) {
  return (
    <div className="fixed inset-0 z-140" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
      <button
        type="button"
        aria-label="Tutup status populer"
        className="absolute inset-0"
        onClick={onClose}
      />
      <div className="relative flex h-full items-center justify-center px-4">
        <div
          className="w-full max-w-md rounded-2xl border p-5 text-center"
          style={{
            background: "var(--surface)",
            borderColor: "var(--surface-border)",
          }}
        >
          <p className="text-sm" style={{ color: "var(--text-primary)" }}>
            Belum ada konten populer untuk status ini.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 rounded-full border px-4 py-1.5 text-xs transition"
            style={{
              borderColor: "var(--surface-border)",
              color: "var(--text-secondary)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-border)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
