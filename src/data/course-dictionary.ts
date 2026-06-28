export {
  filterCourseDictionary,
  getDictionaryEntries,
  getDictionaryEntriesByUnitId,
} from "./course";

import { getDictionaryEntries } from "./course";

/** Flat dictionary list for DictionaryPage */
export const courseDictionary = getDictionaryEntries();
