type GameQuestionImageProps = {
  src: string;
};

export function GameQuestionImage({ src }: GameQuestionImageProps) {
  return (
    <div className="mt-4 aspect-[7/4] w-full opacity-80 mask-[url('https://luubinhan.github.io/KidStory/images/mask.svg')] size-64 overflow-hidden mb-5 flex items-center justify-center rounded-xl backdrop-brightness-90"
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <img
        src={src}
        alt=""
        className="rounded-xl object-cover hidden  size-64 "
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
