type GameQuestionImageProps = {
  src: string;
};

export function GameQuestionImage({ src }: GameQuestionImageProps) {
  return (
    <div className="aspect-[7/4] w-full overflow-hidden rounded-xl bg-slate-100 mb-5">
      <img
        src={src}
        alt=""
        className="h-full w-full object-cover"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
