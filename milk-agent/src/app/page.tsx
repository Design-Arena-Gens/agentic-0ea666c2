"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Milk,
  PhoneCall,
  Sparkles,
} from "lucide-react";

type Sender = "agent" | "customer";

type Message = {
  id: string;
  sender: Sender;
  text: string;
  timestamp: string;
};

const agentName = "Ananya from MilkyWay Fresh";

const openingLines = [
  "Good morning! Ananya here from MilkyWay Fresh. Did I catch you at a convenient moment?",
  "Hi there! This is Ananya with MilkyWay Fresh dairy. May I take sixty seconds to share why thousands of families trust us every morning?",
  "Namaste! You're speaking with Ananya from MilkyWay Fresh. I'd love to quickly show how we make your milk runs effortless.",
];

const quickFacts = [
  "100% pure A2-certified farm milk",
  "Sunrise doorstep delivery, even on Sundays",
  "Tested for antibiotics and adulteration thrice daily",
  "Flexible pause and resume through WhatsApp",
];

const objectionHandlers: Record<string, string> = {
  price:
    "I understand price matters. Remember, you're getting single-origin A2 milk, chilled within 30 minutes of milking. Most customers happily switch because the freshness is unmistakable and we include the glass bottle deposit.",
  expensive:
    "Great question. Rather than discounting quality, we add value: nutritionist-curated meal plans, replacement guarantee, and a loyalty program that gives back every quarter.",
  delivery:
    "Delivery is our biggest strength. We assign you a dedicated rider, share live delivery confirmation, and offer a 5:30–7:00 AM delivery window that we hit 98.6% of the time.",
  taste:
    "Taste seals the deal for most families. Because the herd is grass-fed and the milk is never recombined, you get natural sweetness. Plus, our first delivery is a tasting hamper on the house.",
  trial:
    "Absolutely. I can book a 3-day trial combo with full credit if you convert. Shall I reserve the first crate for tomorrow morning?",
  busy:
    "No problem, I respect your time. Let me highlight the essentials in 30 seconds: pure A2 milk, temperature-controlled delivery, and zero-questions-asked replacement. Would it help if I WhatsApp a quick summary and call back at your preferred slot?",
};

const followUpPrompts = [
  "What's the current milk source in your home?",
  "Do you prefer toned, full cream, or something specialised like lactose-free?",
  "Any little ones or elders at home whose nutrition is top priority?",
];

const closingPitch =
  "Let's get you started with our bestseller — 2 liters of A2 cow milk and probiotic curd for just ₹299 on a no-strings 3-day trial. I can reserve a morning delivery slot right now. Should I go ahead?";

const suggestionButtons = [
  {
    label: "Tell me about your milk",
    prompt:
      "Give me a sharp elevator pitch about the milk quality and delivery.",
  },
  {
    label: "What's the pricing?",
    prompt: "Break down your pricing and trial options.",
  },
  {
    label: "Handle delivery concerns",
    prompt: "I'm worried about delivery reliability.",
  },
  {
    label: "Convince me fast",
    prompt: "Give me your fastest convincing pitch.",
  },
];

const formatTime = () =>
  new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());

const randomPick = (items: string[]) =>
  items[Math.floor(Math.random() * items.length)];

const normalizeText = (text: string) => text.toLowerCase();

const detectKeyword = (input: string, keywords: string[]) =>
  keywords.some((key) => normalizeText(input).includes(key));

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const generateAgentResponse = (input: string, depth: number) => {
  const normalized = normalizeText(input);

  if (depth === 0) {
    return `${randomPick(openingLines)}\n\n${closingPitch}`;
  }

  if (!input.trim()) {
    return "I didn't quite catch that. Could you repeat what you'd like to know about MilkyWay Fresh?";
  }

  if (detectKeyword(normalized, ["price", "cost", "rupee", "rs", "₹"])) {
    return (
      objectionHandlers.price +
      "\n\nWe start at ₹89 per liter with weekly subscription rewards that bring it effectively down to ₹82. Trial deliveries are complimentary."
    );
  }

  if (
    detectKeyword(normalized, ["delivery", "late", "timing", "logistics"])
  ) {
    return (
      objectionHandlers.delivery +
      "\n\nWould you prefer a 5:30 AM or 6:15 AM drop slot? I can lock it in."
    );
  }

  if (detectKeyword(normalized, ["taste", "flavor", "quality"])) {
    return (
      objectionHandlers.taste +
      "\n\nIn fact, our sommelier-style tasting notes: hint of sweetness, creamy mouthfeel, zero aftertaste."
    );
  }

  if (detectKeyword(normalized, ["trial", "sample", "test"])) {
    return (
      objectionHandlers.trial +
      "\n\nI'll arrange a welcome call from our nutritionist as well."
    );
  }

  if (detectKeyword(normalized, ["busy", "later", "not now", "call back"])) {
    return (
      objectionHandlers.busy +
      "\n\nLet me know a better time and I'll make sure to ring you then."
    );
  }

  if (detectKeyword(normalized, ["no", "not interested"])) {
    return "I hear you. Since quality dairy is a daily decision, I'll WhatsApp you a one-pager. If freshness becomes a priority, just reply 'MILK' and I'll personally assist.";
  }

  if (detectKeyword(normalized, ["yes", "okay", "sure", "go ahead"])) {
    return "Fantastic! I'll book the 3-day starter hamper and share payment options via WhatsApp in two minutes. Expect your first crate tomorrow before sunrise. Welcome to the MilkyWay Fresh family!";
  }

  return `${followUpPrompts[depth % followUpPrompts.length]}\n\nA quick reminder: ${randomPick(
    quickFacts,
  )}.`;
};

const initialMessage: Message = {
  id: "welcome",
  sender: "agent",
  text: `${randomPick(openingLines)}\n\n${closingPitch}`,
  timestamp: formatTime(),
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const signatureOpener = useMemo(() => randomPick(openingLines), []);

  const agentStats = useMemo(
    () => [
      {
        label: "Conversions this week",
        value: "43",
        icon: <CheckCircle2 className="h-5 w-5" />,
      },
      {
        label: "Avg. call length",
        value: "03m 12s",
        icon: <PhoneCall className="h-5 w-5" />,
      },
      {
        label: "Customer rating",
        value: "4.9/5",
        icon: <Sparkles className="h-5 w-5" />,
      },
    ],
    [],
  );

  useEffect(() => {
    const container = document.getElementById("message-container");
    container?.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const customerMessage: Message = {
      id: createId(),
      sender: "customer",
      text: trimmed,
      timestamp: formatTime(),
    };
    setMessages((prev) => [...prev, customerMessage]);
    setInput("");

    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          sender: "agent",
          text: generateAgentResponse(
            trimmed,
            prev.filter((m) => m.sender === "agent").length,
          ),
          timestamp: formatTime(),
        },
      ]);
      setIsTyping(false);
    }, 750);
  };

  const injectPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-100 text-zinc-900">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-12 lg:flex-row">
        <aside className="flex flex-col gap-6 rounded-3xl border border-orange-200 bg-white/80 p-6 shadow-xl backdrop-blur lg:w-80">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg">
              <Milk className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-orange-500">
                Hyper-Confident Closer
              </p>
              <h2 className="text-xl font-semibold leading-tight">
                {agentName}
              </h2>
            </div>
          </div>
          <div className="rounded-2xl bg-orange-50 p-4 text-sm text-orange-900 shadow-inner">
            <p className="font-semibold">Signature opener</p>
            <p>{signatureOpener}</p>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Quick selling points
            </p>
            <ul className="space-y-2 text-sm text-zinc-700">
              {quickFacts.map((fact) => (
                <li
                  key={fact}
                  className="flex items-start gap-2 rounded-lg border border-orange-100 bg-white/70 p-3"
                >
                  <ArrowRight className="mt-0.5 h-4 w-4 text-orange-500" />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Call performance snapshot
            </p>
            <div className="grid gap-3">
              {agentStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-white/70 p-4 shadow-sm"
                >
                  <span className="text-orange-500">{stat.icon}</span>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-zinc-500">
                      {stat.label}
                    </p>
                    <p className="text-lg font-semibold text-zinc-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 p-4 text-sm text-white shadow-lg">
            <p className="font-semibold">Closing pitch</p>
            <p>{closingPitch}</p>
          </div>
        </aside>

        <main className="flex flex-1 flex-col gap-6 rounded-3xl border border-orange-100 bg-white/80 p-6 shadow-xl backdrop-blur">
          <header className="flex flex-col gap-2 border-b border-orange-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow">
                <PhoneCall className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-zinc-900">
                  MilkyWay Fresh Calling Console
                </h1>
                <p className="text-sm text-zinc-600">
                  Simulate conversations with {agentName.split(" ")[0]}, the boldest dairy closer in
                  Mumbai.
                </p>
              </div>
            </div>
          </header>

          <section
            id="message-container"
            className="flex-1 space-y-3 overflow-y-auto rounded-3xl border border-orange-100 bg-white/70 p-6 shadow-inner"
          >
            {messages.map((message) => (
              <article
                key={message.id}
                className={`flex flex-col gap-1 ${
                  message.sender === "agent" ? "items-start" : "items-end"
                }`}
              >
                <div
                  className={`max-w-xl rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md ${
                    message.sender === "agent"
                      ? "bg-orange-500/90 text-white"
                      : "bg-zinc-100 text-zinc-900"
                  }`}
                >
                  <p className="whitespace-pre-line">{message.text}</p>
                </div>
                <span className="text-xs uppercase tracking-wide text-zinc-400">
                  {message.sender === "agent" ? agentName : "You"} ·{" "}
                  {message.timestamp}
                </span>
              </article>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Sparkles className="h-4 w-4 animate-pulse text-orange-500" />
                <span>
                  {agentName.split(" ")[0]} is crafting the perfect response…
                </span>
              </div>
            )}
          </section>

          <section className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Quick prompts
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestionButtons.map((suggestion) => (
                <button
                  key={suggestion.label}
                  type="button"
                  onClick={() => injectPrompt(suggestion.prompt)}
                  className="rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-orange-400 hover:bg-orange-50"
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          </section>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 rounded-2xl border border-orange-200 bg-white/90 p-2 shadow-lg"
          >
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask Ananya about the milk, delivery, pricing…"
              rows={2}
              className="flex-1 resize-none rounded-xl border border-transparent bg-white px-4 py-2 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-300/60"
            />
            <button
              type="submit"
              className="flex h-10 items-center gap-2 rounded-xl bg-orange-500 px-4 text-sm font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300/60"
              disabled={isTyping}
            >
              <Sparkles className="h-4 w-4" />
              Pitch
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
