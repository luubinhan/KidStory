import { Link } from "react-router-dom";
import { motion } from "motion/react";
import type { Book } from "../../types/book";

type DiscoverBookCardProps = {
  book: Book;
  index: number;
};

export function DiscoverBookCard({ book, index }: DiscoverBookCardProps) {
  return (
    <motion.div
      className="h-full"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        to={`/book/${book.id}`}
        className="group flex h-full flex-col rounded-r-3xl bg-white overflow-hidden border-2 border-slate-50 shadow-md hover:border-yellow-400 hover:shadow-xl hover:shadow-yellow-100/50 transition-all duration-300"
      >
        <div className="aspect-[2/2.5] shrink-0 overflow-hidden relative">
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
            <span className="text-white font-bold text-lg">Read Now →</span>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-yellow-600 transition-colors line-clamp-2">
            {book.title}
          </h3>
          <p className="text-slate-600 line-clamp-2 flex-1">{book.description}</p>
        </div>
      </Link>
    </motion.div>
  );
}
