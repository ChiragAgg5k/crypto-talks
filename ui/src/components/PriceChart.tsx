import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";

interface PriceChartProps {
  data: Array<{ timestamp: string; price: number }>;
  className?: string;
}

export const PriceChart = ({ data, className }: PriceChartProps) => {
  return (
    <div className={cn("w-full h-[300px] glass-card p-4", className)}>
      <h3 className="text-lg font-medium mb-4">Bitcoin Price (30 Days)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="timestamp"
            stroke="#64748B"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#64748B"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="glass-card p-2">
                    <p className="text-sm text-white">
                      ${payload[0].value?.toLocaleString()}
                    </p>
                    <p className="text-xs text-crypto-gray">
                      {payload[0].payload.timestamp}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#8B5CF6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};