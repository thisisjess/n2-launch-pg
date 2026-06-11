import React, { useState, useEffect } from "react";
import { Lock } from "lucide-react";

// Import the official n² logo from the brand assets (matches MDMi_Asset_Overview_V5.pdf)
import n2Logo from "../../imports/Mobile/b336fb71f2d2247dadd41666e98bffac92058c9f.png";

interface PasswordGateProps {
  children: React.ReactNode;
}

/**
 * Password-protected splash screen for the n2ition launch page preview.
 *
 * - Uses the official N² red circle logo from the MDMi brand assets.
 * - Styled to match the n2ition launch page (Work Sans, DM Sans, #d70321 red, etc.).
 * - Client-side only (sessionStorage) — convenient preview protection, not real security.
 * - Password configurable via Vercel env var VITE_DEMO_PASSWORD (falls back to "n2preview").
 *
 * Once unlocked in a browser tab/session, the gate is bypassed until the tab is closed.
 */
export default function PasswordGate({ children }: PasswordGateProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Change this default or (better) set VITE_DEMO_PASSWORD in Vercel project env vars
  // for Production + Preview environments.
  const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD || "thisisjess";

  // Restore access from this browser session
  useEffect(() => {
    const hasAccess = sessionStorage.getItem("n2ition_preview_access") === "granted";
    if (hasAccess) {
      setUnlocked(true);
    }
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    setIsSubmitting(true);

    // Small delay for button loading state
    setTimeout(() => {
      if (password.trim() === DEMO_PASSWORD) {
        sessionStorage.setItem("n2ition_preview_access", "granted");
        setUnlocked(true);
        setError("");
        setPassword("");
      } else {
        setError("Incorrect password. Please try again.");
        setPassword("");
      }
      setIsSubmitting(false);
    }, 180);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (error) setError("");
  };

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Brand header with official n² logo */}
        <div className="text-center mb-10">
          <img
            src={n2Logo}
            alt="n²ition"
            className="h-20 w-20 mx-auto mb-6"
            draggable={false}
          />
          <div className="font-['Work_Sans'] font-bold text-5xl tracking-[-0.025em] text-black">
            N²ITION
          </div>
          <div className="font-['Roboto_Mono'] text-[10px] text-[#6f6f6f] tracking-[2px] mt-1 mb-2">
            BACKED BY MDMi
          </div>
          <div className="inline-block px-3 py-0.5 rounded-full bg-[#d70321] text-white text-[10px] font-['DM_Sans'] font-bold tracking-[0.15em] mt-3">
            PRIVATE PREVIEW
          </div>
        </div>

        {/* Gate card */}
        <div className="bg-white border border-[#e9e9e9] rounded-3xl p-8 shadow-sm">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#f8f8f8] mb-4">
              <Lock className="w-5 h-5 text-[#d70321]" />
            </div>
            <h2 className="font-['Work_Sans'] font-bold text-2xl tracking-tight mb-2">
              Enter access password
            </h2>
            <p className="text-[#6f6f6f] text-sm leading-relaxed max-w-[28ch] mx-auto">
              This preview of the n2ition launch experience is restricted to authorized reviewers.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isSubmitting) {
                    handleSubmit();
                  }
                }}
                placeholder="Password"
                className="w-full bg-white border border-[#e9e9e9] focus:border-[#d70321] focus:ring-0 rounded-full px-6 py-[17px] font-['Work_Sans'] text-[15px] placeholder:text-[#9a9a9a] outline-none transition-colors"
                autoFocus
                autoComplete="off"
                disabled={isSubmitting}
                aria-label="Preview access password"
              />
              {error && (
                <p className="text-[#d70321] text-sm mt-2 px-1 font-['DM_Sans']">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !password.trim()}
              className="w-full bg-[#d70321] hover:bg-[#b0021b] active:bg-[#8c0118] disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-full font-['DM_Sans'] font-bold text-[15px] tracking-[-0.1px] transition-all flex items-center justify-center gap-2"
              onClick={() => handleSubmit()}
            >
              {isSubmitting ? "Verifying…" : "Enter Preview"}
            </button>
          </form>

          <p className="text-center text-[#9a9a9a] text-[10px] font-['Roboto_Mono'] tracking-[0.5px] mt-6">
            n2ition • Early Access
          </p>
        </div>

        <p className="text-center text-[10px] text-[#9a9a9a] mt-6 font-['Roboto_Mono'] tracking-[0.5px]">
          This is a lightweight client-side gate for preview purposes only.
        </p>
      </div>
    </div>
  );
}
