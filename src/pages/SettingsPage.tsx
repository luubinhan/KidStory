import { CourseBottomNav, CourseHowToPlayFab } from "../components/course";
import { DataBackupPanel } from "../components/settings/DataBackupPanel";

export default function SettingsPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80 pb-24">
      <div className="mx-auto max-w-lg px-4 py-6">
        <div />

        <h1 className="mt-6 text-2xl font-bold text-sky-900">Settings</h1>

        <section className="mt-8 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-sky-100">
          <h2 className="text-base font-bold text-slate-800">Data Backup</h2>
          <div className="mt-3">
            <DataBackupPanel />
          </div>
        </section>
      </div>
      <CourseBottomNav />
      <CourseHowToPlayFab />  
    </div>
  );
}
