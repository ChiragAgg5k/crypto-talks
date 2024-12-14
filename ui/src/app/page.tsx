"use client";

import { useUser } from "@/components/AuthContext";
import { AuthDialog } from "@/components/AuthDialog";
import { ChatInterface } from "@/components/ChatInterface";
import { CryptoNews } from "@/components/CryptoNews";
import { CryptoTicker } from "@/components/CryptoTicker";
import { FeaturedCoins } from "@/components/FeaturedCoins";
import { PriceChart } from "@/components/PriceChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveSubscriber } from "@/lib/appwrite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Github, Globe, Twitter } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const queryClient = new QueryClient();

const Index = () => {
  const user = useUser();

  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await saveSubscriber(subscriberEmail);

      toast.success("Success!", {
        description: "You are now subscribed to our newsletter.",
      });
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-crypto-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-crypto-purple blur-[120px] animate-pulse opacity-30" />
          <div className="absolute top-1/4 right-0 w-72 h-72 bg-crypto-accent blur-[120px] animate-pulse opacity-30 [animation-delay:1000ms]" />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-crypto-purple blur-[120px] animate-pulse opacity-30 [animation-delay:2000ms]" />

          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
        </div>

        <div className="container py-8 space-y-12 relative z-10">
          <div className="flex justify-end">
            <AuthDialog />
          </div>

          <div className="relative text-center space-y-6 py-16">
            <div className="absolute inset-0 bg-gradient-to-r from-crypto-purple/10 to-crypto-accent/10 blur-3xl -z-10" />

            <h1 className="text-4xl md:text-7xl font-bold crypto-gradient bg-clip-text text-transparent animate-fade-up [text-wrap:balance]">
              Crypto Talks
            </h1>
            {user.current ? (
              <p className="text-crypto-gray text-lg md:text-xl max-w-2xl mx-auto animate-fade-up [animation-delay:200ms] [text-wrap:balance]">
                Hello,{" "}
                <span className="text-white">
                  {user.current.name.split(" ")[0]}!
                </span>{" "}
                Let's get you talking about crypto. You can start by asking any
                question about crypto from our agent below.
              </p>
            ) : (
              <p className="text-crypto-gray text-lg md:text-xl max-w-2xl mx-auto animate-fade-up [animation-delay:200ms] [text-wrap:balance]">
                Your AI-powered crypto companion. Get real-time insights, market
                analysis, and predictions for any cryptocurrency.
              </p>
            )}

            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]">
              <div className="absolute inset-0 bg-crypto-purple/5 rounded-full blur-[100px]" />
              <div className="absolute inset-0 bg-crypto-accent/10 rounded-full blur-[100px] animate-pulse" />
            </div>
          </div>

          <div className="animate-fade-in [animation-delay:400ms]">
            <CryptoTicker />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="animate-fade-up [animation-delay:600ms]">
              <PriceChart />
            </div>
            <div className="animate-fade-up [animation-delay:800ms]">
              <ChatInterface coinId={"any cryptocurrency"} />
            </div>
          </div>

          <div className="space-y-6 animate-fade-up [animation-delay:1000ms]">
            <h2 className="text-2xl font-bold crypto-gradient bg-clip-text text-transparent">
              Featured Cryptocurrencies
            </h2>
            <FeaturedCoins />
          </div>

          <div className="space-y-6 animate-fade-up [animation-delay:1200ms]">
            <h2 className="text-2xl font-bold crypto-gradient bg-clip-text text-transparent">
              Latest Crypto News
            </h2>
            <CryptoNews />
          </div>

          <footer className="mt-24 glass-card p-8 animate-fade-up [animation-delay:1400ms]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-left">
                <h3 className="text-lg font-semibold crypto-gradient bg-clip-text text-transparent mb-4">
                  Crypto Talks
                </h3>
                <p className="text-sm text-crypto-gray">
                  Your AI-powered crypto companion for real-time insights and
                  market analysis.
                </p>
              </div>

              <div className="text-left md:col-span-2">
                <h4 className="text-lg font-semibold mb-4">
                  Subscribe to Crypto Updates
                </h4>
                <p className="text-sm text-crypto-gray mb-4">
                  Get the latest insights, market analysis, and crypto
                  predictions delivered to your inbox.
                </p>
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div className="flex gap-4 flex-col md:flex-row">
                    <Input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      required
                      disabled={isLoading}
                      value={subscriberEmail}
                      onChange={(e) => setSubscriberEmail(e.target.value)}
                      className="glass-card w-full md:w-2/3 bg-crypto-card/30"
                    />
                    <Button
                      type="submit"
                      className="w-full md:w-auto crypto-gradient"
                      disabled={isLoading}
                    >
                      {isLoading ? "Subscribing..." : "Subscribe Now"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            <div className="mt-8 flex flex-col md:flex-row justify-between items-end gap-4 pt-8 border-t border-white/10 text-center text-sm text-crypto-gray">
              <p>
                © {new Date().getFullYear()} Crypto Talks. All rights reserved.
              </p>
              <div className="flex space-x-4 text-crypto-gray">
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.chiragaggarwal.tech/"
                >
                  <Globe className="hover:text-white transition-all duration-300" />
                </Link>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/ChiragAgg5k"
                >
                  <Github className="hover:text-white transition-all duration-300" />
                </Link>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://x.com/ChiragAgg5k"
                >
                  <Twitter className="hover:text-white transition-all duration-300" />
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default Index;
