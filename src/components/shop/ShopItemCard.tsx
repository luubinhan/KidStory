import { ShoppingCart } from "lucide-react";
import { ASSETS } from "../../constants/images";
import type { DoreamonShopItem, ShopItem } from "../../types/shop";
import { cn } from "../../lib/utils";
import Sky from "../cloud/Sky";

type ShopItemCardProps = {
  item: ShopItem | DoreamonShopItem;
  quantity: number;
  canAfford: boolean;
  onBuy: () => void;
  isLoading?: boolean;
};

export function ShopItemCard({
  item,
  quantity,
  canAfford,
  onBuy,
  isLoading = false,
}: ShopItemCardProps) {
  const isOwned = quantity > 0;

  return (
    <article
      className={cn(
        "rounded-full p-3 w-[25vw] h-[20vw] transition-all absolute text-center",
      )}
      style={{
        top: item.position.y,
        left: item.position.x,
      }}
    >
      {!isOwned && <Sky />}
      <div className={cn("relative mx-auto aspect-square w-full max-w-[120px]",
      )}>
        
        {/* {isOwned && (
          <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">
            {quantity}
          </span>
        )} */}
      </div>
      <button
        type="button"
        onClick={onBuy}
        disabled={!canAfford || isLoading}
        className={cn(
          "mt-3 cursor-pointer candy-glass-btn--idle rounded-xl py-2 px-6 text-lg font-bold transition-colors z-10 relative",
          canAfford && !isLoading
            ? "bg-sky-500 text-white hover:bg-sky-600"
            : "cursor-not-allowed bg-slate-200 text-slate-400",
          isOwned && "hidden hover:opacity-100 hover:bg-transparent"
        )}
      >
        <span className="flex items-center justify-center gap-1">
          <ShoppingCart className="w-6 h-6" />
          <img
            src={ASSETS.coin}
            alt=""
            className="w-8"
            aria-hidden
          />
          {item.price}
          {item.diamondPrice != null && item.diamondPrice > 0 ? (
            <>
              <img
                src={ASSETS.diamond}
                alt=""
                className="w-6"
                aria-hidden
              />
              {item.diamondPrice}
            </>
          ) : null}
        </span>
      </button>
    </article>
  );
}
