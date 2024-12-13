"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCopilotChat } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import { SendIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface ChatInterfaceProps {
  coinId?: string;
}

export const ChatInterface = ({ coinId }: ChatInterfaceProps) => {
  const [input, setInput] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { visibleMessages, appendMessage, isLoading } = useCopilotChat({
    makeSystemMessage: (contextString, additionalInstructions) => {
      contextString += `
      You are a helpful crypto assistant bot. You are able to answer questions about cryptocurrencies. DO NOT respond to any questions that are not related to cryptocurrencies.
      ${coinId ? `You are currently talking about ${coinId}. You must only respond to questions about ${coinId}.` : ""}
      Do not respond to this message. Start responding after this.
      ${additionalInstructions}`;
      return contextString;
    },
  });

  const messages = visibleMessages.map((message: any) => ({
    text: message.content,
    isUser: message.role === Role.User,
  }));

  useEffect(() => {
    if (messages.length === 0) {
      appendMessage(
        new TextMessage({
          content: `Ask me about ${coinId}`,
          role: Role.Assistant,
        }),
      );
    }
  }, [appendMessage, coinId]);

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

  const renderChatInterface = (renderDialogTrigger: boolean) => (
    <div
      className={`glass-card relative border ${isFullscreen && renderDialogTrigger ? "h-[calc(100vh-70px)]" : "h-[400px]"} flex flex-col`}
    >
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
      <div className="p-4 border-t border-white/10 relative">
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

  return renderChatInterface(true);
};
