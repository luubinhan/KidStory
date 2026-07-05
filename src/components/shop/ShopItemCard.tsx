import type { ShopItem } from "../../types/shop";
import { cn } from "../../lib/utils";

type ShopItemCardProps = {
  item: ShopItem;
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
        "flex flex-col rounded-2xl border-2 border-slate-200 bg-white p-3 shadow-sm transition-all",
        
      )}
    >
      <div className={cn("relative mx-auto aspect-square w-full max-w-[120px]",
        !isOwned && "opacity-40 grayscale"
      )}>
        <img
          src={item.imageUrl}
          alt={item.name}
          className="size-full rounded-xl object-contain"
        />
        {isOwned && (
          <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">
            {quantity}
          </span>
        )}
      </div>

      <h2 className="mt-2 text-center text-sm font-bold text-slate-800">{item.name}</h2>

      <p className="mt-1 flex items-center justify-center gap-1 text-xs font-semibold text-amber-700">
        <img src="images/coin.png" alt="" className="size-3.5" aria-hidden />
        {item.price}
      </p>
      <button
        type="button"
        onClick={onBuy}
        disabled={!canAfford || isLoading}
        className={cn(
          "mt-3 w-full cursor-pointer rounded-xl py-2 text-xs font-bold transition-colors",
          canAfford && !isLoading
            ? "bg-sky-500 text-white hover:bg-sky-600"
            : "cursor-not-allowed bg-slate-200 text-slate-400",
        )}
      >
        Own
      </button>
    </article>
  );
}
