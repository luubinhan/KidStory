import React, { forwardRef } from "react";

export const PageCover = forwardRef<HTMLDivElement, { children: React.ReactNode }>((props, ref) => {
  return (
    <div className="page page-cover bg-yellow-400 shadow-2xl rounded-r-3xl" ref={ref} data-density="hard">
      <div className="page-content isolate overflow-hidden">{props.children}</div>
    </div>
  );
});

PageCover.displayName = "PageCover";
