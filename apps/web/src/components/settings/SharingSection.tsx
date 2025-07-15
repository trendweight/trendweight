import { useState } from "react";
import type { UseFormWatch } from "react-hook-form";
import type { SettingsData } from "../../lib/core/interfaces";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { Heading } from "../ui/Heading";

interface SharingSectionProps {
  watch: UseFormWatch<SettingsData>;
}

export function SharingSection({ watch }: SharingSectionProps) {
  const [showNewUrlConfirm, setShowNewUrlConfirm] = useState(false);
  const [copied, setCopied] = useState(false);
  const sharingToken = watch("sharingToken");
  const shareUrl = sharingToken ? `${window.location.origin}/u/${sharingToken}` : null;

  const handleCopy = async () => {
    if (shareUrl) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const handleGenerateNewUrl = () => {
    // TODO: Implement generate new sharing token
    console.log("Generate new URL functionality not implemented yet");
    setShowNewUrlConfirm(false);
  };

  return (
    <>
      <div className="p-6">
        <Heading level={2}>Sharing</Heading>
        <p className="mb-4 text-sm text-gray-600">
          You can give the following personal URL to anyone you'd like to share your charts and stats with. You can also decide at any time to change the URL
          (in case you change your mind).
        </p>

        {shareUrl && (
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 pr-10 text-sm"
                onClick={(e) => e.currentTarget.select()}
              />
              <button
                type="button"
                onClick={handleCopy}
                className="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                title={copied ? "Copied!" : "Copy to clipboard"}
              >
                {copied ? (
                  <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowNewUrlConfirm(true)}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Get a New URL
            </button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={showNewUrlConfirm}
        onOpenChange={setShowNewUrlConfirm}
        title="Generate New Sharing URL?"
        description={
          <div className="space-y-2">
            <p>This will permanently invalidate your current sharing URL:</p>
            <p className="rounded bg-gray-100 p-2 font-mono text-sm">{shareUrl}</p>
            <p>Anyone using the old URL will no longer be able to access your dashboard. This action cannot be undone.</p>
          </div>
        }
        confirmText="Generate New URL"
        destructive
        onConfirm={handleGenerateNewUrl}
      />
    </>
  );
}
