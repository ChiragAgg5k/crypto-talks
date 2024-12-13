"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCopilotChat } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import { SendIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface ChatInterfaceProps {
  initialMessage?: string;
}

export const ChatInterface = ({
  initialMessage = "Ask me anything about cryptocurrencies!",
}: ChatInterfaceProps) => {
  const [input, setInput] = useState("");

  const { visibleMessages, appendMessage, isLoading } = useCopilotChat({
    makeSystemMessage: (contextString, additionalInstructions) => {
      contextString += `
      You are a helpful crypto assistant bot. You are able to answer questions about cryptocurrencies. DO NOT respond to any questions that are not related to cryptocurrencies.
      ${additionalInstructions}`;
      return contextString;
    },
  });

  const messages = visibleMessages.map((message: any) => ({
    text: message.content,
    isUser: message.role === Role.User,
  }));

  console.log(messages);

  useEffect(() => {
    if (messages.length === 0) {
      appendMessage(
        new TextMessage({
          content: initialMessage,
          role: Role.Assistant,
        }),
      );
    }
  }, [appendMessage, initialMessage]);

  const handleSend = () => {
    if (!input.trim()) return;

    appendMessage(
      new TextMessage({
        content: input,
        role: Role.User,
      }),
    );

    setInput("");
  };

  return (
    <div className="glass-card h-[400px] flex flex-col">
      <div className="p-4 overflow-y-auto flex-1">
        {messages.map(
          (message, index) =>
            message.text.trim() && (
              <div
                key={index}
                className={`mb-4 ${
                  message.isUser ? "ml-auto" : "mr-auto"
                } w-fit animate-fade-up`}
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
            ),
        )}
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
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="crypto-gradient"
            disabled={isLoading}
          >
            <SendIcon className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
