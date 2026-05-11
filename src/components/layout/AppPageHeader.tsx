import type { ReactNode } from "react";
import { SiteHeaderPrimaryNav } from "./SiteHeaderPrimaryNav";

type AppPageHeaderProps = {
  trailing?: ReactNode;
  /** Passed through to the brand link wrapper */
  animatedBrand?: boolean;
};

export function AppPageHeader({ trailing, animatedBrand = true }: AppPageHeaderProps) {
  return (
    <header className="sticky top-0 z-20 px-4 py-3 mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 bg-white border-b border-slate-200/60">
      <SiteHeaderPrimaryNav animatedBrand={animatedBrand} />
      {trailing ?? null}
    </header>
  );
}
