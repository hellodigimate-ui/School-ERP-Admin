import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PaymentMethodChartProps {
  data: { name: string; value: number }[];
}

export default function PaymentMethodChart({ data }: PaymentMethodChartProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}