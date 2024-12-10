import { useQuery } from "@tanstack/react-query";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface Coin {
  id: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export const CryptoTicker = () => {
  const { data: coins } = useQuery({
    queryKey: ["trending-coins"],
    queryFn: async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&sparkline=false",
      );
      return response.json() as Promise<Coin[]>;
    },
  });

  return (
    <div className="flex gap-4 overflow-x-auto py-2 animate-fade-in items-center justify-center">
      {coins?.map((coin) => (
        <div
          key={coin.id}
          className="glass-card px-4 py-2 flex items-center gap-2 min-w-[200px]"
        >
          <span className="text-sm font-medium uppercase">{coin.symbol}</span>
          <span className="text-sm">
            ${coin.current_price.toLocaleString()}
          </span>
          <span
            className={`text-xs flex items-center ${
              coin.price_change_percentage_24h >= 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {coin.price_change_percentage_24h >= 0 ? (
              <ArrowUpIcon className="w-3 h-3" />
            ) : (
              <ArrowDownIcon className="w-3 h-3" />
            )}
            {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
};
