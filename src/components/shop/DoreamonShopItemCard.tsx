import { ShoppingCart } from "lucide-react";
import { ASSETS } from "../../constants/images";
import type { DoreamonShopItem } from "../../types/shop";
import { cn } from "../../lib/utils";

type DoreamonShopItemCardProps = {
  item: DoreamonShopItem;
  quantity: number;
  canAfford: boolean;
  onBuy: () => void;
  isLoading?: boolean;
};

export function DoreamonShopItemCard({
  item,
  quantity,
  canAfford,
  onBuy,
  isLoading = false,
}: DoreamonShopItemCardProps) {
  const isOwned = quantity > 0;

  return (
    <article
      className={cn(
        "flex flex-col items-center rounded-2xl bg-white/70 p-3 text-center shadow-sm backdrop-blur-sm",
        !isOwned && "opacity-80",
      )}
    >
      <div className="relative mx-auto aspect-square w-full max-w-[120px]">
        <img
          src={item.imageUrl}
          alt=""
          className="size-full object-contain"
          aria-hidden
        />
        {isOwned ? (
          <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">
            {quantity}
          </span>
        ) : null}
      </div>
      <h3 className="mt-2 text-sm font-bold text-slate-800">{item.name}</h3>
      <button
        type="button"
        onClick={onBuy}
        disabled={!canAfford || isLoading}
        className={cn(
          "mt-3 cursor-pointer candy-glass-btn--idle rounded-xl px-4 py-2 text-sm font-bold transition-colors",
          canAfford && !isLoading
            ? "bg-sky-500 text-white hover:bg-sky-600"
            : "cursor-not-allowed bg-slate-200 text-slate-400",
        )}
      >
        <span className="flex items-center justify-center gap-1">
          <ShoppingCart className="size-5" />
          <img src={ASSETS.coin} alt="" className="w-6" aria-hidden />
          {item.price}
          <img src={ASSETS.diamond} alt="" className="w-5" aria-hidden />
          {item.diamondPrice}
        </span>
      </button>
    </article>
  );
}
