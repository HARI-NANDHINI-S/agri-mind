import React, { useState, useRef, useEffect } from "react";
import client from "../../api/client";
import { ChatMessage } from "../../types";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Bot, User, Send, Sparkles } from "lucide-react";

const AIAssistant: React.FC = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      session_id: "default",
      sender: "ASSISTANT",
      content: "Hello! I am your AgriMind AI Agriculture Assistant. Ask me anything about crop choices, leaf disease prevention, soil fertilizer dosages, weather tips, or market price strategies!",
      created_at: new Date().toISOString(),
    },
  ]);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");

    // Optimistic user message append
    const tempUserMsg: ChatMessage = {
      id: Math.random().toString(),
      session_id: sessionId || "default",
      sender: "USER",
      content: userText,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const res = await client.post("/assistant/chat", {
        message: userText,
        session_id: sessionId,
      });
      setSessionId(res.data.data.session_id);
      setMessages(res.data.data.history);
    } catch {
      const errorMsg: ChatMessage = {
        id: Math.random().toString(),
        session_id: sessionId || "default",
        sender: "ASSISTANT",
        content: "Sorry, I am having trouble connecting right now. Please try asking again.",
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-800 flex items-center gap-2">
          <Bot className="h-7 w-7 text-primary-700" /> AgriMind AI Agriculture Assistant
        </h1>
        <p className="text-sm text-neutral-500 font-medium mt-1">Conversational AI support for agronomy, disease management, and market guidance</p>
      </div>

      {/* Chat Container */}
      <Card className="h-[600px] flex flex-col p-0 overflow-hidden border border-neutral-200">
        {/* Chat History Box */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === "USER" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.sender === "USER" ? "bg-neutral-800 text-white" : "bg-primary-700 text-white shadow"
                }`}
              >
                {msg.sender === "USER" ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              </div>

              <div
                className={`max-w-lg p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === "USER"
                    ? "bg-neutral-900 text-white rounded-tr-none"
                    : "bg-white border border-neutral-200 text-neutral-800 shadow-sm rounded-tl-none"
                }`}
              >
                <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, "<br/>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium italic pl-11">
              <Sparkles className="h-3.5 w-3.5 animate-spin text-primary-600" /> AgriMind Assistant is thinking...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-neutral-200 flex items-center gap-3">
          <Input
            placeholder="Ask about crops, diseases, fertilizer dosage, weather, market rates..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" loading={loading} className="flex items-center gap-2">
            <Send className="h-4 w-4" /> Send
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AIAssistant;
