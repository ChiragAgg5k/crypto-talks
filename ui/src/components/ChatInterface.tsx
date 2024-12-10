import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon } from "lucide-react";

interface ChatInterfaceProps {
  initialMessage?: string;
}

export const ChatInterface = ({
  initialMessage = "Ask me anything about cryptocurrencies!",
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<
    Array<{ text: string; isUser: boolean }>
  >([{ text: initialMessage, isUser: false }]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, isUser: true }]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "I'm still in development. Check back soon!", isUser: false },
      ]);
    }, 1000);
  };

  return (
    <div className="glass-card h-[400px] flex flex-col">
      <div className="p-4 overflow-y-auto flex-1">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.isUser ? "ml-auto" : "mr-auto"
            } max-w-[80%] animate-fade-up`}
          >
            <div
              className={`p-3 rounded-lg ${
                message.isUser
                  ? "bg-crypto-purple text-white ml-auto"
                  : "bg-crypto-card text-white"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about any cryptocurrency..."
            className="bg-crypto-card border-white/10"
          />
          <Button type="submit" className="crypto-gradient">
            <SendIcon className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
