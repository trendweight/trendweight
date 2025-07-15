import { useState } from "react";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { Heading } from "../ui/Heading";

export function DangerZoneSection() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion
    console.log("Account deletion functionality not implemented yet");
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="p-6">
        <Heading level={2}>Danger Zone</Heading>
        <p className="mb-4 text-sm text-gray-600">
          If you wish to delete your account, you may do so at any time. Your account, your settings, and all your weight data will be deleted from TrendWeight
          servers. If you wish to recreate your account at a later date, you may, but you'll need to reconnect your new account to a scale to redownload any
          weight data from Fitbit or Withings at that time.
        </p>

        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          className="rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
        >
          Delete Account
        </button>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Your Account?"
        description={
          <div className="space-y-2">
            <p>This action will permanently delete:</p>
            <ul className="ml-2 list-inside list-disc space-y-1 text-sm">
              <li>Your account and all settings</li>
              <li>All your weight measurement data</li>
              <li>Your connections to Withings and Fitbit</li>
            </ul>
            <p className="font-semibold">This action cannot be undone.</p>
            <p>If you recreate your account later, you'll need to reconnect your scale to re-download any weight data.</p>
          </div>
        }
        confirmText="Yes, Delete My Account"
        destructive
        onConfirm={handleDeleteAccount}
      />
    </>
  );
}
