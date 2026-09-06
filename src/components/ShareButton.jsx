import React, { useState } from "react";
import { Share2, Copy, Check, MessageCircle, X as XIcon } from "lucide-react";

// Reusable share control: uses the native share sheet where available
// (mobile browsers), falls back to a small dropdown with WhatsApp, X, and
// copy-link on desktop.
export default function ShareButton({ url, title, text, className = "" }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: title || "TrustGuard Nigeria", text: text || "", url });
      } catch (err) {
        // User cancelled the native share sheet — not an error.
      }
    } else {
      setOpen((o) => !o);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Clipboard API unavailable — nothing more we can do silently.
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text ? text + " " : ""}${url}`)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text || "")}&url=${encodeURIComponent(url)}`;

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border text-sm font-semibold text-text-secondary hover:border-primary hover:text-primary transition-colors"
      >
        <Share2 className="w-4 h-4" /> Share
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-lg z-20 p-2">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-background transition-colors">
              <MessageCircle className="w-4 h-4 text-[#25D366]" /> WhatsApp
            </a>
            <a href={twitterUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-background transition-colors">
              <XIcon className="w-4 h-4" /> X (Twitter)
            </a>
            <button type="button" onClick={copyLink}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-background transition-colors">
              {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
