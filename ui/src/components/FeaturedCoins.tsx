import { useQuery } from "@tanstack/react-query";
import { TrendingUpIcon } from "lucide-react";

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
}

export const FeaturedCoins = () => {
  const { data: coins } = useQuery({
    queryKey: ["featured-coins"],
    queryFn: async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=6&sparkline=false"
      );
      return response.json() as Promise<Coin[]>;
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {coins?.map((coin) => (
        <div key={coin.id} className="glass-card p-4 animate-fade-up">
          <div className="flex items-center gap-3 mb-3">
            <img src={coin.image} alt={coin.name} className="w-8 h-8" />
            <div>
              <h3 className="font-medium">{coin.name}</h3>
              <p className="text-sm text-crypto-gray uppercase">{coin.symbol}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-crypto-gray">Price</span>
              <span className="font-medium">${coin.current_price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-crypto-gray">Market Cap</span>
              <span className="font-medium">${(coin.market_cap / 1e9).toFixed(2)}B</span>
            </div>
            <div className="flex justify-between">
              <span className="text-crypto-gray">Volume (24h)</span>
              <span className="font-medium">${(coin.total_volume / 1e6).toFixed(2)}M</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};