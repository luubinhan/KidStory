import { CoinDisplay } from "./CoinDisplay";
import { DiamondDisplay } from "./DiamondDisplay";
import { cn } from "../../lib/utils";

type CurrencyDisplayProps = {
  className?: string;
  size?: "sm" | "md";
};

export function CurrencyDisplay({ className, size = "md" }: CurrencyDisplayProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <CoinDisplay size={size} />
      <DiamondDisplay size={size} />
    </div>
  );
}
