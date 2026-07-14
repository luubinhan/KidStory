import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ASSETS } from "../../constants/images";
import type { GameV2 } from "../../types/gameV2";

type GameV2CardProps = {
  game: GameV2;
  index: number;
};

export function GameV2Card({ game, index }: GameV2CardProps) {
  return (
    <motion.div
      className="h-full"
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.06 }}
    >
      <Link
        to={game.path}
        className="flex h-full flex-col overflow-hidden rounded-2xl border-2 border-slate-100 bg-white shadow-md transition-all duration-300 hover:border-yellow-400 hover:shadow-xl hover:shadow-yellow-100/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2"
      >
        <div className="relative aspect-video overflow-hidden">
          {game.thumbnailSrc ? (
            <img
              src={game.thumbnailSrc}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <div
              className="size-full bg-gradient-to-br from-sky-300 via-cyan-400 to-blue-500"
              aria-hidden
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-blue-600/40 to-transparent" />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <h2 className="text-xl font-bold text-slate-900">{game.name}</h2>
          <div className="mt-auto flex items-center gap-3 text-sm font-semibold text-slate-700">
            <span className="inline-flex items-center gap-1">
              <img src={ASSETS.coin} alt="" className="h-5 w-auto" aria-hidden />
              {game.coinReward}
            </span>
            <span className="inline-flex items-center gap-1">
              <img src={ASSETS.diamond} alt="" className="h-5 w-auto" aria-hidden />
              {game.diamondReward}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
