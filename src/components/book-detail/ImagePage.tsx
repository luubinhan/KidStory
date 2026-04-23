import React, { forwardRef } from "react";

export const ImagePage = forwardRef<HTMLDivElement, { image: string; pageNum: number }>((props, ref) => {
  return (
    <div className="page bg-white" ref={ref}>
      <div className="page-content isolate">
        <img
          src={props.image}
          alt="Story illustration"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
          draggable={false}
          referrerPolicy="no-referrer"
        />
        <div className="pointer-events-none absolute bottom-4 left-6 z-10 text-slate-300 font-mono text-sm">
          {props.pageNum}
        </div>
      </div>
    </div>
  );
});

ImagePage.displayName = "ImagePage";
