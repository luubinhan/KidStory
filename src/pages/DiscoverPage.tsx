import { useMemo, useState } from "react";
import { books } from "../data/books";
import {
  DiscoverBookCard,
  DiscoverEmptyState,
  DiscoverPageHeader,
  StorySearchField,
} from "../components/discover";

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBooks = useMemo(
    () =>
      books.filter((book) => book.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery],
  );

  return (
    <div>
      <header className="sticky top-0 z-20 px-4 py-3 mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 bg-white border-b border-slate-200/60">
        <DiscoverPageHeader />
        <StorySearchField value={searchQuery} onChange={setSearchQuery} />
      </header>
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks.map((book, index) => (
            <DiscoverBookCard key={book.id} book={book} index={index} />
          ))}
        </div>

        {filteredBooks.length === 0 ? <DiscoverEmptyState /> : null}
      </div>
    </div>
  );
}
