import { cn } from "../../lib/utils";

type CourseWordImageProps = {
  imageUrl: string;
  alt?: string;
  className?: string;
  fallbackClassName?: string;
};

export function CourseWordImage({
  imageUrl,
  alt = "",
  className,
  fallbackClassName,
}: CourseWordImageProps) {
  if (!imageUrl) {
    return (
      <span
        className={cn(
          "flex size-16 items-center justify-center rounded-xl bg-slate-100 text-xs font-semibold text-slate-400",
          fallbackClassName,
        )}
        aria-hidden
      >
        ?
      </span>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={cn("size-16 rounded-xl object-cover", className)}
    />
  );
}
