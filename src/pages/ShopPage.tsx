import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { CoinDisplay } from "../components/progress/CoinDisplay";

export default function ShopPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80 pb-24">
      <div className="mx-auto max-w-lg px-4 py-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/achievements"
            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Achievements
          </Link>
          <CoinDisplay />
        </div>

        <div className="mt-16 flex flex-col items-center text-center">
          <div className="flex size-20 items-center justify-center rounded-3xl bg-violet-100 text-violet-600">
            <ShoppingBag className="size-10" aria-hidden />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-slate-800">Shop</h1>
          <p className="mt-2 max-w-xs text-slate-600">
            Coming soon — spend your coins on fun items!
          </p>
        </div>
      </div>
    </div>
  );
}
