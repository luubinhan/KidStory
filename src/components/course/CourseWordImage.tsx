import { cn } from "../../lib/utils";

type CourseWordImageProps = {
  imageUrl: string;
  translation: string;
  alt?: string;
  className?: string;
  fallbackClassName?: string;
};

export function CourseWordImage({
  imageUrl,
  alt = "",
  className,
  fallbackClassName,
  translation = "?",
}: CourseWordImageProps) {
  if (!imageUrl) {
    return (
      <span
        className={cn(
          "flex size-24 items-center justify-center rounded-xl font-semibold text-4xl",
          fallbackClassName,
        )}
        aria-hidden
      >
        {translation}
      </span>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={cn("size-32 rounded-xl object-cover", className)}
    />
  );
}
