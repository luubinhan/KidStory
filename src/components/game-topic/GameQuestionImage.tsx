type GameQuestionImageProps = {
  src: string;
};

export function GameQuestionImage({ src }: GameQuestionImageProps) {
  return (
    <div className="mt-4 aspect-[7/4] w-full overflow-hidden mb-5 flex items-center justify-center border-12 border-white rounded-xl bg-white">
      <img
        src={src}
        alt=""
        className="rounded-xl object-cover size-64 "
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
