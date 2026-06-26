import { useMemo, useState } from "react";
import { courseProfile } from "../data/course";
import { courseDictionary, filterCourseDictionary } from "../data/course-dictionary";
import {
  CourseBottomNav,
  CoursePageHeader,
  DictionaryGrid,
  DictionaryPageTitle,
  DictionarySearchField,
} from "../components/course";

export default function DictionaryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(courseDictionary[0]?.id ?? null);

  const filteredEntries = useMemo(
    () => filterCourseDictionary(searchQuery, courseDictionary),
    [searchQuery],
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-sky-50 to-blue-100/80 pt-4 pb-24">
      <div className="mx-auto max-w-lg">
        <DictionaryPageTitle />
        <DictionarySearchField value={searchQuery} onChange={setSearchQuery} />
        <DictionaryGrid
          entries={filteredEntries}
          selectedId={selectedId}
          onSelect={setSelectedId}
          searchQuery={searchQuery}
        />
      </div>
      <CourseBottomNav />
    </div>
  );
}
