"use client";

import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface PriceChartProps {
  className?: string;
}

const TOP_COINS = [
  { id: "bitcoin", name: "Bitcoin" },
  { id: "ethereum", name: "Ethereum" },
  { id: "binancecoin", name: "BNB" },
  { id: "solana", name: "Solana" },
  { id: "ripple", name: "XRP" },
];

export const PriceChart = ({ className }: PriceChartProps) => {
  const [selectedCoin, setSelectedCoin] = useState(TOP_COINS[0].id);

  const { data, isError } = useQuery({
    queryKey: ["coin-history", selectedCoin],
    queryFn: async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${selectedCoin}/market_chart?vs_currency=usd&days=30&interval=daily`,
        );
        if (!response.ok) {
          const errorMessage = await response.text();
          console.error("Error fetching coin data:", errorMessage);
        }
        const data = await response.json();
        return data.prices.map((item: [number, number]) => ({
          timestamp: new Date(item[0]).toLocaleDateString(),
          price: item[1],
        }));
      } catch (error) {
        console.error("Error fetching coin data:", error);
        toast.error("Could not fetch coin data. Please try again later.");
        return [];
      }
    },
  });

  return (
    <div className={cn("w-full h-[400px] glass-card p-4", className)}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Price Chart (30 Days)</h3>
        <Select value={selectedCoin} onValueChange={setSelectedCoin}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TOP_COINS.map((coin) => (
              <SelectItem key={coin.id} value={coin.id}>
                {coin.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="h-[320px]">
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
    </div>
  );
};
