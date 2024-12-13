import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCopilotReadable } from "@copilotkit/react-core";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownIcon, ArrowUpIcon, InfoIcon } from "lucide-react";

interface Coin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
}

const API_KEY = process.env.COINGECKO_API_KEY;

export const CryptoTicker = () => {
  const {
    data: coins,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["trending-coins"],
    queryFn: async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&sparkline=false",
        {
          headers: {
            "x-cg-demo-api-key": API_KEY || "",
          } as HeadersInit,
        },
      );
      return response.json() as Promise<Coin[]>;
    },
  });

  useCopilotReadable({
    value: coins,
    description:
      "Top 5 trending cryptocurrencies by market cap. The coins are objects with id, symbol, name, current_price, price_change_percentage_24h, market_cap, total_volume, high_24h, and low_24h.",
  });

  if (isLoading) {
    return <div className="text-center py-4">Loading cryptocurrencies...</div>;
  }

  if (isError || !coins || !Array.isArray(coins)) {
    return (
      <div className="text-center py-4 text-red-500">Error fetching coins</div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex gap-4 overflow-x-auto py-2 animate-fade-in items-center justify-center">
        {coins.map((coin) => (
          <Tooltip key={coin.id}>
            <TooltipTrigger asChild>
              <div className="glass-card px-4 py-2 flex items-center gap-2 min-w-[200px] cursor-help">
                <span className="text-sm font-medium uppercase">
                  {coin.symbol}
                </span>
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
                <InfoIcon className="w-4 h-4 ml-1 text-gray-500" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="w-64 p-4 bg-glass backdrop-blur-lg shadow-lg rounded-lg">
              <div className="space-y-2">
                <h3 className="font-bold text-lg">
                  {coin.name} ({coin.symbol.toUpperCase()})
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-600">Current Price:</p>
                    <p className="font-semibold">
                      ${coin.current_price.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">24h Change:</p>
                    <p
                      className={`font-semibold ${
                        coin.price_change_percentage_24h >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">24h High:</p>
                    <p>${coin.high_24h.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">24h Low:</p>
                    <p>${coin.low_24h.toLocaleString()}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Market Cap:</p>
                    <p>${coin.market_cap.toLocaleString()}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">24h Volume:</p>
                    <p>${coin.total_volume.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};
