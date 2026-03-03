const DrawerHeader = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="drawer-header flex items-center justify-between pb-4">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-lg ring-1 ring-cyan-400/30">
          N
        </div>
        <div>
          <p className="drawer-brand-name text-sm font-bold leading-none">Narzza</p>
          <p className="drawer-brand-sub text-[10px] leading-none mt-0.5">Media Digital</p>
        </div>
      </div>

      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup navigasi"
        className="drawer-close-btn flex h-8 w-8 items-center justify-center rounded-xl"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default DrawerHeader;
