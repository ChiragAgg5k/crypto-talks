"use client";

import { useCopilotReadable } from "@copilotkit/react-core";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
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
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  const {
    data: news,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["crypto-news"],
    queryFn: async () => {
      const response = await fetch(
        `https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=popular&limit=${6}`,
      );
      const data = await response.json();
      return data.Data.slice(0, 6) as NewsItem[];
    },
  });

  const fetchArticleSummary = async (article: string) => {
    setIsSummaryLoading(true);
    setGeneratedSummary(null);

    try {
      const response = await fetch("/api/generate-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ article }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await response.json();
      setGeneratedSummary(data.summary);
    } catch (error) {
      console.error("Error fetching summary:", error);
      setGeneratedSummary("Unable to generate summary at this time.");
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleNewsClick = (item: NewsItem) => {
    setSelectedNews(item);
    setIsDialogOpen(true);
    fetchArticleSummary(item.body);
  };

  useCopilotReadable({
    value: news?.map((item) => item.body.slice(0, 200)),
    description:
      "The latest news about cryptocurrencies. The news is an array of objects with id, guid, imageurl, title, url, source, body, published_on, and categories.",
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
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <Accordion type="single" collapsible className="space-y-4">
        {news?.slice(0, 6).map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="glass-card border-none"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline group transition-colors duration-300 ease-in-out">
              <div className="flex items-center gap-4 text-left">
                <ChevronRight className="h-4 w-4 shrink-0 text-crypto-purple transition-transform duration-300 ease-in-out group-data-[state=open]:rotate-90" />
                <div>
                  <h3 className="font-medium group-hover:text-crypto-purple transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-xs text-crypto-gray">{item.source}</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent
              className="px-4 pb-3 
                data-[state=open]:animate-accordion-down 
                data-[state=closed]:animate-accordion-up
                overflow-hidden"
            >
              <div className="space-y-4">
                <p className="text-sm text-crypto-gray line-clamp-3">
                  {item.body}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleNewsClick(item)}
                    className="text-sm text-crypto-purple hover:text-crypto-accent transition-colors"
                  >
                    View Summary
                  </button>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-crypto-purple hover:text-crypto-accent transition-colors"
                  >
                    Read Full Article
                  </a>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {selectedNews?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="p-4 rounded-lg bg-crypto-card/50">
              <h4 className="text-sm font-medium mb-2 text-crypto-purple">
                AI Summary
              </h4>
              <div className="text-sm text-crypto-gray">
                {isSummaryLoading ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-crypto-gray/20 rounded mb-2"></div>
                    <div className="h-4 bg-crypto-gray/20 rounded mb-2 w-11/12"></div>
                    <div className="h-4 bg-crypto-gray/20 rounded w-10/12"></div>
                  </div>
                ) : (
                  <ReactMarkdown
                    components={{
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-crypto-purple hover:text-crypto-accent transition-colors"
                        >
                          {children}
                        </a>
                      ),
                      p: ({ children }) => <p className="mb-2">{children}</p>,
                    }}
                  >
                    {generatedSummary ||
                      selectedNews?.body.slice(0, 200) + "..."}
                  </ReactMarkdown>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-crypto-gray">
              <span>{selectedNews?.source}</span>
              <a
                href={selectedNews?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-crypto-purple hover:text-crypto-accent transition-colors"
              >
                Read Full Article
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
