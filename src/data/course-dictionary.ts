export {
  filterCourseDictionary,
  getDictionaryEntries,
  getDictionaryEntriesByUnitId,
} from "./course/dictionary";

import { getDictionaryEntries } from "./course/dictionary";

/** Flat dictionary list for DictionaryPage */
export const courseDictionary = getDictionaryEntries();
