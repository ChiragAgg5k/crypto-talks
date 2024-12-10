import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChatInterface } from "./ChatInterface";

interface CoinDialogProps {
  coin: {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    total_volume: number;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CoinDialog = ({ coin, open, onOpenChange }: CoinDialogProps) => {
  if (!coin) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-none text-white max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <img src={coin.image} alt={coin.name} className="w-8 h-8" />
            <div>
              <span className="text-xl">{coin.name}</span>
              <span className="text-sm text-crypto-gray ml-2 uppercase">
                {coin.symbol}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Market Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-crypto-gray">Current Price</span>
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
                <span className="text-crypto-gray">24h Volume</span>
                <span className="font-medium">
                  ${(coin.total_volume / 1e6).toFixed(2)}M
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Chat about {coin.name}</h3>
            <ChatInterface
              initialMessage={`Ask me anything about ${coin.name}!`}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
