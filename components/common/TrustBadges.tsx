import { ShieldCheck, Zap, Headphones } from "lucide-react";

const badges = [
  {
    icon: ShieldCheck,
    title: "Secure Platform",
    subtitle: "256-bit encryption",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    subtitle: "99.9% uptime",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    subtitle: "Always here to help",
  },
];

export default function TrustBadges() {
  return (
    <section className="py-10 px-4">
      <div
        className="mx-auto max-w-6xl border border-blue-500 rounded-2xl bg-white
        shadow-sm"
      >
        <div className="grid grid-cols-1  sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x">
          {badges.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-4 px-6 py-6 border-blue-500"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center
                  rounded-full border border-blue-200 bg-blue-50 text-blue-600"
                >
                  <Icon size={22} />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
