import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BarChartIcon,
  DollarSignIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";
import { useState } from "react";
import { ChatInterface } from "./ChatInterface";

interface CoinDetails {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
}

interface CoinDialogProps {
  coin: CoinDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CoinDialog = ({ coin, open, onOpenChange }: CoinDialogProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!coin) return null;

  const formatCurrency = (value: number) =>
    value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });

  const formatPercentage = (value: number) => `${value.toFixed(2)}%`;

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    return formatCurrency(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-none text-white max-w-5xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <img src={coin.image} alt={coin.name} className="w-10 h-10" />
            <div>
              <span className="text-2xl font-bold">{coin.name}</span>
              <span className="text-sm text-crypto-gray ml-2 uppercase">
                {coin.symbol}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 bg-opacity-20 bg-white mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="market-stats">Market Stats</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Price</h3>
                  <div
                    className={`flex items-center ${
                      coin.price_change_percentage_24h >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {coin.price_change_percentage_24h >= 0 ? (
                      <ArrowUpIcon className="mr-1" />
                    ) : (
                      <ArrowDownIcon className="mr-1" />
                    )}
                    {formatPercentage(coin.price_change_percentage_24h)}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-crypto-gray">Current Price</span>
                    <span className="font-medium">
                      {formatCurrency(coin.current_price)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-crypto-gray">24h High</span>
                    <span className="font-medium">
                      {formatCurrency(coin.high_24h)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-crypto-gray">24h Low</span>
                    <span className="font-medium">
                      {formatCurrency(coin.low_24h)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Market Performance</h3>
                  <div
                    className={`flex items-center ${
                      coin.market_cap_change_percentage_24h >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {coin.market_cap_change_percentage_24h >= 0 ? (
                      <TrendingUpIcon className="mr-1" />
                    ) : (
                      <TrendingDownIcon className="mr-1" />
                    )}
                    {formatPercentage(coin.market_cap_change_percentage_24h)}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-crypto-gray">Market Cap</span>
                    <span className="font-medium">
                      {formatMarketCap(coin.market_cap)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-crypto-gray">Market Cap Rank</span>
                    <span className="font-medium">#{coin.market_cap_rank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-crypto-gray">24h Volume</span>
                    <span className="font-medium">
                      {formatMarketCap(coin.total_volume)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="market-stats">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <DollarSignIcon className="mr-2" /> Supply Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-crypto-gray">Circulating Supply</span>
                    <span className="font-medium">
                      {coin.circulating_supply.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-crypto-gray">Total Supply</span>
                    <span className="font-medium">
                      {coin.total_supply.toLocaleString()}
                    </span>
                  </div>
                  {coin.max_supply && (
                    <div className="flex justify-between">
                      <span className="text-crypto-gray">Max Supply</span>
                      <span className="font-medium">
                        {coin.max_supply.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <BarChartIcon className="mr-2" /> All-Time Performance
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-crypto-gray">All-Time High</span>
                    <div className="text-right">
                      <span className="font-medium block">
                        {formatCurrency(coin.ath)}
                      </span>
                      <span
                        className={`text-xs ${
                          coin.ath_change_percentage >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {formatPercentage(coin.ath_change_percentage)} from ATH
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-crypto-gray">ATH Date</span>
                    <span className="font-medium">
                      {new Date(coin.ath_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-crypto-gray">All-Time Low</span>
                    <div className="text-right">
                      <span className="font-medium block">
                        {formatCurrency(coin.atl)}
                      </span>
                      <span
                        className={`text-xs ${
                          coin.atl_change_percentage >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {formatPercentage(coin.atl_change_percentage)} from ATL
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chat">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Chat about {coin.name}</h3>
              <ChatInterface coinId={coin.id} />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
