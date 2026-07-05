import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CourseBottomNav } from "../components/course";
import { ShopItemCard } from "../components/shop/ShopItemCard";
import { CurrencyDisplay } from "../components/progress/CurrencyDisplay";
import { SHOP_ITEMS } from "../data/shopItems";
import { canAffordShopItem } from "../lib/userProgressLogic";
import { useUserProgress } from "../contexts/UserProgressContext";

export default function AssetsPage() {
  const { progress, isLoading, buyShopItem, getItemQuantity } = useUserProgress();

  return (
    <div className="relative min-h-[calc(100vw*3/2)] bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80 pb-24 bg-center bg-top bg-[url(/map/assets.png)] bg-size-[100vw_auto]">
      <div className="mx-auto max-w-lg px-4 py-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/course"
            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Explore
          </Link>
          <CurrencyDisplay />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {SHOP_ITEMS.map((item) => (
            <ShopItemCard
              key={item.id}
              item={item}
              quantity={getItemQuantity(item.id)}
              canAfford={!isLoading && canAffordShopItem(progress, item.id)}
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
