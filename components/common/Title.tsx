interface TitleProps {
  text1: string;
  text2: string;
}

export default function Title({ text1, text2 }: TitleProps) {
  return (
    <div className="text-2xl md:text-3xl font-bold text-center">
      <span className="text-blue-900">{text1} </span>
      <span className="text-yellow-500">{text2}</span>
    </div>
  );
}
