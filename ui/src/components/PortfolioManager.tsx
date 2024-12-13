import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getHoldings, saveHoldings } from "@/lib/appwrite";
import { useCopilotReadable } from "@copilotkit/react-core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useUser } from "./AuthContext";

export interface Holding {
  coinId: string;
  amount: number;
}

export const PortfolioManager = () => {
  const user = useUser();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [holdings, setHoldings] = useState<Holding[]>([
    { coinId: "", amount: 0 },
  ]);

  const { data: existingHoldings } = useQuery({
    queryKey: ["holdings", user?.current?.userId],
    queryFn: () => getHoldings(user?.current?.userId!),
    enabled: !!user?.current?.userId,
  });

  const mutation = useMutation({
    mutationFn: (newHoldings: Holding[]) =>
      saveHoldings(user?.current?.userId!, newHoldings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holdings"] });
      toast.success("Your portfolio has been updated");
      setIsOpen(false);
    },
    onError: () => {
      toast.error("Failed to save portfolio");
    },
  });

  const addHolding = () => {
    setHoldings([...holdings, { coinId: "", amount: 0 }]);
  };

  const updateHolding = (
    index: number,
    field: keyof Holding,
    value: string | number,
  ) => {
    const newHoldings = [...holdings];
    newHoldings[index] = {
      ...newHoldings[index],
      [field]: value,
    };
    setHoldings(newHoldings);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(holdings);
  };

  useCopilotReadable({
    value: existingHoldings,
    description:
      "These are the current holdings of the user's crypto portfolio. Each holding is an object with a coinId and amount.",
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-crypto-card/30 hover:bg-crypto-card/40 border-white/10"
        >
          Manage Portfolio
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-none sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-white">
            Your Crypto Portfolio
          </DialogTitle>
          <DialogDescription className="text-crypto-gray">
            Enter your cryptocurrency holdings below
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {holdings.map((holding, index) => (
            <div key={index} className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`coin-${index}`} className="text-white">
                    Coin ID (e.g., bitcoin)
                  </Label>
                  <Input
                    id={`coin-${index}`}
                    value={holding.coinId}
                    onChange={(e) =>
                      updateHolding(index, "coinId", e.target.value)
                    }
                    className="bg-crypto-card/30 border-white/10 text-white mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor={`amount-${index}`} className="text-white">
                    Amount
                  </Label>
                  <Input
                    id={`amount-${index}`}
                    type="number"
                    value={holding.amount}
                    onChange={(e) =>
                      updateHolding(index, "amount", parseFloat(e.target.value))
                    }
                    className="bg-crypto-card/30 border-white/10 text-white mt-2"
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="flex flex-col space-y-4">
            <Button
              type="button"
              variant="outline"
              onClick={addHolding}
              className="bg-crypto-card/30 hover:bg-crypto-card/40 border-white/10"
            >
              Add Another Coin
            </Button>
            <Button
              type="submit"
              className="bg-crypto-purple hover:bg-crypto-accent"
            >
              Save Portfolio
            </Button>
          </div>
        </form>

        {existingHoldings && existingHoldings.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Current Holdings
            </h3>
            <div className="space-y-2">
              {existingHoldings.map((holding: any, index: number) => (
                <div
                  key={index}
                  className="bg-crypto-card/30 p-4 rounded-lg border border-white/10"
                >
                  {holding.holdings.map((h: Holding, i: number) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-crypto-gray">{h.coinId}</span>
                      <span className="text-white">{h.amount}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
