/**
 * Mini-games catalog for Games V2 (distinct from quiz GameTopic content).
 */

export type GameV2 = {
  id: string;
  name: string;
  path: string;
  coinReward: number;
  diamondReward: number;
  /** Optional; when absent, card uses pond gradient placeholder */
  thumbnailSrc?: string;
};
