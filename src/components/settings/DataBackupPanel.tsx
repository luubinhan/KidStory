import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { useUserProgress } from "../../contexts/UserProgressContext";
import {
  exportDatabase,
  formatBackupFilename,
  importDatabase,
} from "../../lib/dbExportImport";
import { downloadBlob } from "../../lib/downloadBlob";

const IMPORT_CONFIRM_MESSAGE =
  "Import sẽ thay thế toàn bộ dữ liệu hiện tại. Bạn có chắc muốn tiếp tục?";

type DataBackupPanelProps = {
  compact?: boolean;
};

export function DataBackupPanel({ compact = false }: DataBackupPanelProps) {
  const { reloadProgress } = useUserProgress();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);

  const handleExport = async () => {
    setStatus(null);
    setBusy(true);
    try {
      const blob = await exportDatabase();
      downloadBlob(blob, formatBackupFilename());
      setStatus({ type: "success", message: "Đã xuất file backup." });
    } catch {
      setStatus({ type: "error", message: "Xuất file thất bại. Thử lại." });
    } finally {
      setBusy(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!window.confirm(IMPORT_CONFIRM_MESSAGE)) return;

    setStatus(null);
    setBusy(true);
    try {
      await importDatabase(file);
      await reloadProgress();
      setStatus({ type: "success", message: "Đã import dữ liệu thành công." });
    } catch (err) {
      const message =
        err instanceof Error && err.message.includes("Expected database")
          ? "File không hợp lệ."
          : "Import thất bại. Thử lại.";
      setStatus({ type: "error", message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {!compact && (
        <p className="text-sm text-slate-600">
          Sao lưu tiến độ học (coins, diamonds, unit, inventory) ra file để chuyển sang thiết bị
          hoặc trình duyệt khác.
        </p>
      )}

      <div className="flex flex-wrap gap-8 justify-center">
        <button
          type="button"
          onClick={() => void handleExport()}
          disabled={busy}
          className="cursor-pointer aspect-square flex flex-col items-center gap-4 justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-700 disabled:opacity-50"
        >
          <Download className="size-10" aria-hidden />
          <div className="text-lg">
            Export backup
          </div>
        </button>
        <button
          type="button"
          onClick={handleImportClick}
          disabled={busy}
          className="cursor-pointer aspect-square flex flex-col items-center gap-4 justify-center rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 transition-colors hover:bg-sky-50 disabled:opacity-50"
        >
          <Upload className="size-10" aria-hidden />
          <div className="text-lg">
            Import backup
          </div>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={(e) => void handleFileChange(e)}
        />
      </div>

      {status && (
        <p
          className={
            status.type === "success"
              ? "text-sm font-medium text-emerald-600"
              : "text-sm font-medium text-red-600"
          }
          role="status"
        >
          {status.message}
        </p>
      )}
    </div>
  );
}
