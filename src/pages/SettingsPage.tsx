import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CourseBottomNav } from "../components/course";
import { DataBackupPanel } from "../components/settings/DataBackupPanel";

export default function SettingsPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80 pb-24">
      <div className="mx-auto max-w-lg px-4 py-6">
        <Link
          to="/course"
          className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Explore
        </Link>

        <h1 className="mt-6 text-2xl font-bold text-sky-900">Cài đặt</h1>

        <section className="mt-8 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-sky-100">
          <h2 className="text-base font-bold text-slate-800">Sao lưu dữ liệu</h2>
          <div className="mt-3">
            <DataBackupPanel />
          </div>
        </section>
      </div>
      <CourseBottomNav />
    </div>
  );
}
