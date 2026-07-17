import { CourseBottomNav, CourseHowToPlayFab } from "../components/course";
import { ShopItemCard } from "../components/shop/ShopItemCard";
import { CurrencyDisplay } from "../components/progress/CurrencyDisplay";
import { SHOP_ITEMS } from "../data/shopItems";
import { canAffordShopItem } from "../lib/userProgressLogic";
import { useUserProgress } from "../contexts/UserProgressContext";
import { Link } from "react-router";

export default function DoreamonShopPage() {
  const { progress, isLoading, buyShopItem, getItemQuantity } = useUserProgress();

  return (
    <div className="relative min-h-[calc(100vw*1.777)] bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80 pb-24 bg-top bg-no-repeat bg-[url(/map/doreamon.webp)] bg-size-[100vw_auto]">
      <div className="mx-auto max-w-lg px-4 py-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Link className="cursor-pointer rounded-xl items-center px-2 py-2 transition-colors candy-glass-btn--idle" to="/assets">Farm</Link>
          </div>
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
      <CourseHowToPlayFab />
    </div>
  );
}
