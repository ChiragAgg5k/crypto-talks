import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

interface NewsItem {
  id: string;
  guid: string;
  imageurl: string;
  title: string;
  url: string;
  source: string;
  body: string;
  published_on: number;
  categories: string;
}

export const CryptoNews = () => {
  const { data: news, isLoading, error } = useQuery({
    queryKey: ["crypto-news"],
    queryFn: async () => {
      console.log("Fetching crypto news...");
      const response = await fetch(
        "https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=popular"
      );
      const data = await response.json();
      return data.Data as NewsItem[];
    },
  });

  if (error) {
    console.error("Error fetching news:", error);
    return (
      <div className="text-crypto-gray">
        Unable to load news at this time. Please try again later.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="glass-card p-4">
            <Skeleton className="h-32 w-full mb-4" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {news?.slice(0, 6).map((item) => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Card className="glass-card p-4 h-full hover:scale-[1.02] transition-all animate-fade-up group">
            <div className="space-y-2">
              <h3 className="font-medium group-hover:text-crypto-purple transition-colors line-clamp-1">
                {item.title}
              </h3>
              <p className="text-sm text-crypto-gray line-clamp-1">{item.body}</p>
              <div className="flex items-center justify-between text-xs text-crypto-gray mt-2">
                <span>{item.source}</span>
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </Card>
        </a>
      ))}
    </div>
  );
};