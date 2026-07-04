import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CourseBottomNav } from "../components/course";
import { ShopItemCard } from "../components/shop/ShopItemCard";
import { CoinDisplay } from "../components/progress/CoinDisplay";
import { SHOP_ITEMS } from "../data/shopItems";
import { useUserProgress } from "../contexts/UserProgressContext";

export default function AssetsPage() {
  const { coins, isLoading, buyShopItem, getItemQuantity } = useUserProgress();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80 pb-24">
      <div className="mx-auto max-w-lg px-4 py-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/course"
            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Study
          </Link>
          <CoinDisplay />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-slate-800">Assets</h1>
        <p className="mt-1 text-sm text-slate-600">
          Dùng coin để mua động vật và công trình cho nông trại của bạn!
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {SHOP_ITEMS.map((item) => (
            <ShopItemCard
              key={item.id}
              item={item}
              quantity={getItemQuantity(item.id)}
              canAfford={!isLoading && coins >= item.price}
              isLoading={isLoading}
              onBuy={() => {
                void buyShopItem(item.id);
              }}
            />
          ))}
        </div>
      </div>
      <CourseBottomNav />
    </div>
  );
}
