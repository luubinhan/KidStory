import { tileBackgroundPosition } from "../../../lib/picturePuzzle";
import { cn } from "../../../lib/utils";

type PicturePuzzleTileProps = {
  tileId: number;
  imageSrc: string;
  className?: string;
};

export function PicturePuzzleTile({ tileId, imageSrc, className }: PicturePuzzleTileProps) {
  const { xPercent, yPercent } = tileBackgroundPosition(tileId);

  return (
    <div
      className={cn("size-full bg-slate-200 bg-no-repeat", className)}
      style={{
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: "300% 300%",
        backgroundPosition: `${xPercent}% ${yPercent}%`,
      }}
      aria-hidden
    />
  );
}
