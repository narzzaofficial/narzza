type StorySidePreviewProps = {
  label: string;
  title?: string;
  takeaway?: string | null;
  storyType?: string;
  onClick: () => void;
};

export function StorySidePreview({
  label,
  title,
  takeaway,
  storyType,
  onClick,
}: StorySidePreviewProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="pointer-events-auto hidden w-50 shrink-0 cursor-pointer rounded-2xl border p-4 text-left opacity-60 backdrop-blur-sm transition hover:opacity-90 xl:block"
      style={{
        background: "var(--story-card-bg)",
        borderColor: "var(--story-card-border)",
      }}
    >
      <p
        className="text-[10px] uppercase tracking-wider"
        style={{ color: "var(--story-subtext)" }}
      >
        {label}
      </p>

      {title ? (
        <>
          <p
            className="mt-2 overflow-hidden text-sm font-semibold leading-snug [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"
            style={{ color: "var(--story-title)" }}
          >
            {title}
          </p>

          {takeaway && (
            <div
              className="mt-2.5 rounded-lg border px-2.5 py-2 text-[10px] leading-relaxed"
              style={{
                borderColor: "var(--story-takeaway-border)",
                background: "var(--story-takeaway-bg)",
                color: "var(--story-takeaway-text)",
              }}
            >
              {takeaway}
            </div>
          )}
        </>
      ) : (
        storyType && (
          <p className="text-sm" style={{ color: "var(--story-subtext)" }}>
            {storyType}
          </p>
        )
      )}
    </button>
  );
}
