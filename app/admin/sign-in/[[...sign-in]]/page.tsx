import { SignIn } from "@clerk/nextjs";

export default function AdminSignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-100">🛠️ Admin Panel</h1>
          <p className="mt-2 text-sm text-slate-400">
            Masuk untuk mengakses panel admin Narzza
          </p>
        </div>
        <SignIn
          fallbackRedirectUrl="/admin"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-slate-900 border border-slate-700/50 shadow-2xl rounded-2xl",
              headerTitle: "text-slate-100",
              headerSubtitle: "text-slate-400",
              formButtonPrimary:
                "bg-cyan-600 hover:bg-cyan-500 text-white font-semibold",
              formFieldInput:
                "bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-500 focus:border-cyan-500",
              formFieldLabel: "text-slate-300",
              identityPreviewText: "text-slate-200",
              identityPreviewEditButton: "text-cyan-400 hover:text-cyan-300",
              footerActionLink: "text-cyan-400 hover:text-cyan-300",
              dividerLine: "bg-slate-700",
              dividerText: "text-slate-500",
              socialButtonsBlockButton:
                "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700",
              socialButtonsBlockButtonText: "text-slate-200",
              alertText: "text-red-400",
            },
          }}
        />
      </div>
    </div>
  );
}

