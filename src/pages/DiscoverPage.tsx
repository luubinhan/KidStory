import { useMemo, useState } from "react";
import { books } from "../data/books";
import { DiscoverBookCard, DiscoverEmptyState, StorySearchField } from "../components/discover";
import { AppPageHeader } from "../components/layout";

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBooks = useMemo(
    () =>
      books.filter((book) => book.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery],
  );

  return (
    <div>
      <AppPageHeader trailing={<StorySearchField value={searchQuery} onChange={setSearchQuery} />} />
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
