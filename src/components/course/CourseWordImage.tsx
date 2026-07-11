import { cn } from "../../lib/utils";

type CourseWordImageProps = {
  image: string;
  translation: string;
  alt?: string;
  className?: string;
  fallbackClassName?: string;
};

export function CourseWordImage({
  image,
  alt = "",
  className,
  fallbackClassName,
  translation = "?",
}: CourseWordImageProps) {
  if (!image) {
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
      src={image}
      alt={alt}
      className={cn("size-32 rounded-xl object-cover", className)}
    />
  );
}
