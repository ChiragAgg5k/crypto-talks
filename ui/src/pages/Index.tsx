import { ChatInterface } from "@/components/ChatInterface";
import { CryptoNews } from "@/components/CryptoNews";
import { CryptoTicker } from "@/components/CryptoTicker";
import { FeaturedCoins } from "@/components/FeaturedCoins";
import { PriceChart } from "@/components/PriceChart";

const Index = () => {
  return (
    <div className="min-h-screen bg-crypto-dark text-white relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-crypto-purple blur-[120px] animate-pulse opacity-30" />
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-crypto-accent blur-[120px] animate-pulse opacity-30 [animation-delay:1000ms]" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-crypto-purple blur-[120px] animate-pulse opacity-30 [animation-delay:2000ms]" />
        
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="container py-8 space-y-12 relative z-10">
        {/* Enhanced Hero Section */}
        <div className="relative text-center space-y-6 py-16">
          {/* Background gradient effect */}
          {/* <div className="absolute inset-0 bg-gradient-to-r from-crypto-purple/10 to-crypto-accent/10 blur-3xl -z-10" /> */}
          
          {/* Animated title */}
          <h1 
            className="text-4xl md:text-7xl font-bold crypto-gradient bg-clip-text text-transparent 
                       animate-fade-up [text-wrap:balance]"
          >
            Crypto Talks
          </h1>
          
          {/* Animated subtitle with delayed entrance */}
          <p 
            className="text-crypto-gray text-lg md:text-xl max-w-2xl mx-auto 
                       animate-fade-up [animation-delay:200ms] [text-wrap:balance]"
          >
            Your AI-powered crypto companion. Get real-time insights, market analysis, and
            predictions for any cryptocurrency.
          </p>
          
          {/* Decorative elements */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]">
            <div className="absolute inset-0 bg-crypto-purple/20 rounded-full blur-[100px]" />
            <div className="absolute inset-0 bg-crypto-accent/10 rounded-full blur-[100px] animate-pulse" />
          </div>
        </div>

        {/* Enhanced Price Ticker with fade-in animation */}
        <div className="animate-fade-in [animation-delay:400ms]">
          <CryptoTicker />
        </div>

        {/* Enhanced Chart Section with staggered animations */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="animate-fade-up [animation-delay:600ms]">
            <PriceChart />
          </div>
          <div className="animate-fade-up [animation-delay:800ms]">
            <ChatInterface />
          </div>
        </div>

        {/* Enhanced Featured Cryptocurrencies Section */}
        <div className="space-y-6 animate-fade-up [animation-delay:1000ms]">
          <h2 className="text-2xl font-bold crypto-gradient bg-clip-text text-transparent">
            Featured Cryptocurrencies
          </h2>
          <FeaturedCoins />
        </div>

        {/* New Crypto News Section */}
        <div className="space-y-6 animate-fade-up [animation-delay:1200ms]">
          <h2 className="text-2xl font-bold crypto-gradient bg-clip-text text-transparent">
            Latest Crypto News
          </h2>
          <CryptoNews />
        </div>
      </div>
    </div>
  );
};

export default Index;