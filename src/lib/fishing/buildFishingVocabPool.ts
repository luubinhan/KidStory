import type { CourseUnit } from "../../types/course";
import type { FishingVocabItem } from "../../types/fishing";

export function buildFishingVocabPool(
  units: readonly CourseUnit[],
): FishingVocabItem[] {
  const items: FishingVocabItem[] = [];
  for (const unit of units) {
    for (const w of unit.words) {
      const imageSrc = w.image?.trim();
      if (!imageSrc) continue;
      items.push({
        id: w.id,
        word: w.word,
        imageSrc,
        unitId: unit.id,
        audio: w.audio,
      });
    }
  }
  return items;
}
