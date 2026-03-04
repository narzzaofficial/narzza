"use client";
import { ThemeLogo } from "./ThemeLogo";

const DrawerHeader = ({ onClose }: { onClose: () => void }) => {
  return (
   <div className="drawer-header flex items-center justify-between pb-5 border-b border-slate-700/50">

  {/* Brand */}
  <div className="flex items-center gap-3">
    <ThemeLogo className="w-24 object-contain transition-transform hover:scale-105" />

    <div>
      <p className="text-base sm:text-lg font-semibold text-slate-50 leading-none">
        Narzza
      </p>
      <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
        Media Digital
      </p>
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
