import { ASSETS } from "../../constants/images";
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
        "rounded-full p-3 w-[20vw] h-[14vw] transition-all absolute text-center",    
        !isOwned && "backdrop-blur-sm "    
      )}
      style={{
        top: item.position.y,
        left: item.position.x,
      }}
    >
      <div className={cn("relative mx-auto aspect-square w-full max-w-[120px]",
      )}>
        {!isOwned && (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="size-full rounded-xl object-contain"
          />
        )}
        
        {isOwned && (
          <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">
            {quantity}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={onBuy}
        disabled={!canAfford || isLoading}
        className={cn(
          "mt-3 cursor-pointer rounded-xl py-2 px-6 text-lg font-bold transition-colors",
          canAfford && !isLoading
            ? "bg-sky-500 text-white hover:bg-sky-600"
            : "cursor-not-allowed bg-slate-200 text-slate-400",
          isOwned && "bg-transparent opacity-80 hover:opacity-100 hover:bg-transparent"
        )}
      >
        <span className="flex items-center justify-center gap-1">
          {!isOwned && (
            <>{item.name}</>
          )}
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
