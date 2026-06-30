type GameQuestionImageProps = {
  src: string;
};

export function GameQuestionImage({ src }: GameQuestionImageProps) {
  return (
    <div className="aspect-[7/4] w-full overflow-hidden mb-5 flex items-center justify-center">
      <img
        src={src}
        alt=""
        className="rounded-xl object-cover size-64"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
