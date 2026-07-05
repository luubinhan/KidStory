import { useState } from "react";
import { Settings } from "lucide-react";
import { cn } from "../../lib/utils";
import { SettingsModal } from "./SettingsModal";

type SettingsTriggerProps = {
  className?: string;
};

export function SettingsTrigger({ className }: SettingsTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600 transition-colors hover:bg-sky-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2",
          className,
        )}
        aria-label="Cài đặt"
      >
        <Settings className="size-5" aria-hidden />
      </button>
      {open && <SettingsModal onClose={() => setOpen(false)} />}
    </>
  );
}
