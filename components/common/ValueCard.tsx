interface ValueCardProps {
  title: string;
  description: string;
}

export default function ValueCard({ title, description }: ValueCardProps) {
  return (
    <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-4">
      <b className="text-blue-900">{title}</b>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
