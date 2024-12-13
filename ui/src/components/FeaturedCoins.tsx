"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CoinDialog } from "./CoinDialog";
import { Input } from "./ui/input";

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

export const FeaturedCoins = () => {
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: coins, isLoading } = useQuery({
    queryKey: ["featured-coins", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=6&sparkline=false",
        );
        return response.json() as Promise<Coin[]>;
      }

      const searchResponse = await fetch(
        `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(searchQuery)}`,
      );
      const searchResults = await searchResponse.json();

      const coinIds = searchResults.coins
        .slice(0, 6)
        .map((coin: { id: string }) => coin.id)
        .join(",");

      if (!coinIds) return [];

      const marketDataResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&sparkline=false`,
      );
      return marketDataResponse.json() as Promise<Coin[]>;
    },
    staleTime: 1000 * 60 * 5,
  });

  const handleCoinClick = (coin: Coin) => {
    setSelectedCoin(coin);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <Input
          type="text"
          placeholder="Search cryptocurrencies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md glass-card border-white/10 bg-crypto-card/30 text-white placeholder:text-crypto-gray"
        />

        {isLoading ? (
          <div className="text-center text-white">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coins?.length === 0 ? (
              <div className="text-center text-white col-span-full">
                No coins found
              </div>
            ) : (
              coins?.map((coin) => (
                <div
                  key={coin.id}
                  className="glass-card p-4 animate-fade-up cursor-pointer hover:scale-[1.02] transition-transform"
                  onClick={() => handleCoinClick(coin)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                    <div>
                      <h3 className="font-medium">{coin.name}</h3>
                      <p className="text-sm text-crypto-gray uppercase">
                        {coin.symbol}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-crypto-gray">Price</span>
                      <span className="font-medium">
                        ${coin.current_price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-crypto-gray">Market Cap</span>
                      <span className="font-medium">
                        ${(coin.market_cap / 1e9).toFixed(2)}B
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-crypto-gray">Volume (24h)</span>
                      <span className="font-medium">
                        ${(coin.total_volume / 1e6).toFixed(2)}M
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <CoinDialog
        coin={selectedCoin}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
};
