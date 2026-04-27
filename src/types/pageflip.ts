export type FlipEvent = { data: number };

export type PageFlipApi = {
  flipNext: (corner?: string) => void;
  flipPrev: (corner?: string) => void;
  turnToPage: (index: number) => void;
};

export type FlipBookHandle = { pageFlip: () => PageFlipApi | null };
