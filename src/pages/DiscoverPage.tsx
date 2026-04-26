import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { books } from "../data/books";
import { motion } from "motion/react";
import appIcon from "../assets/app-icon.png";

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <header className="sticky top-0 z-20 px-4 py-3 mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 bg-white border-b border-slate-200/60">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 min-w-0">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="shrink-0 flex items-center justify-center"
          >
            <img src={appIcon} alt="KidStory - By Luu Binh An" className="w-14 h-14" />
          </motion.div>
          <div className="min-w-0 text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              KidStory
            </h1>
            <p className="text-sm text-slate-600 line-clamp-2 sm:line-clamp-1">
              Learn English with fun stories and interactive pictures!
            </p>
          </div>
          <Link
            to="/games"
            className="shrink-0 inline-flex items-center rounded-xl border-2 border-slate-100 bg-[#f4f4f4] px-3 py-2 text-sm font-semibold text-slate-700 hover:border-yellow-400 hover:text-yellow-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 transition-colors"
          >
            Games
          </Link>
        </div>
        <div className="relative w-full sm:flex-1 sm:min-w-0 sm:max-w-md lg:max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search for a story..."
            className={`block w-full pl-10 py-2.5 sm:py-3 bg-[#f4f4f4] border-2 border-slate-100 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-yellow-100 focus:border-yellow-400 transition-all text-base ${searchQuery ? "pr-10" : "pr-3"}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search stories"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 rounded-r-xl sm:rounded-r-2xl"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          ) : null}
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks.map((book, index) => (
            <motion.div
              key={book.id}
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
                  <p className="text-slate-600 line-clamp-2 flex-1">
                    {book.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-slate-500">No stories found. Try searching for something else!</p>
          </div>
        )}
      </div>
    </div>
  );
}
