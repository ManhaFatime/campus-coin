import {

  useEffect,

  useMemo,

  useRef,

  useState,

  type KeyboardEvent,

} from "react";

import {

  Bot,

  Check,

  Mic,

  MicOff,

  Send,

  Sparkles,

  Trash2,

  Volume2,

  VolumeX,

  X,

} from "lucide-react";

import { apiRequest } from "@/services/api";

import { cn } from "@/lib/utils";

type ChatRole = "user" | "assistant";

type ChatLanguage = "english" | "urdu" | "roman-urdu";

type ChatMessage = {

  id: string;

  role: ChatRole;

  text: string;

};

type SpeechRecognitionEventLike = Event & {

  results: ArrayLike<{

    0: {

      transcript: string;

    };

  }>;

};

type SpeechRecognitionErrorEventLike = Event & {

  error?: string;

};

type SpeechRecognitionLike = {

  lang: string;

  continuous: boolean;

  interimResults: boolean;

  start: () => void;

  stop: () => void;

  onresult: ((event: SpeechRecognitionEventLike) => void) | null;

  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;

  onend: (() => void) | null;

};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {

  interface Window {

    SpeechRecognition?: SpeechRecognitionConstructor;

    webkitSpeechRecognition?: SpeechRecognitionConstructor;

  }

}

const STORAGE_KEY = "campus_coin_ai_chat";

type LanguageOption = {

  value: ChatLanguage;

  short: string;

  label: string;

  recognitionLocale: string;

  speechLocale: string;

};

const defaultLanguageOption: LanguageOption = {

  value: "english",

  short: "EN",

  label: "English",

  recognitionLocale: "en-PK",

  speechLocale: "en-PK",

};

const languageOptions: LanguageOption[] = [

  defaultLanguageOption,

  {

    value: "urdu",

    short: "اردو",

    label: "Urdu",

    recognitionLocale: "ur-PK",

    speechLocale: "ur-PK",

  },

  {

    value: "roman-urdu",

    short: "RU",

    label: "Roman Urdu",

    recognitionLocale: "en-PK",

    speechLocale: "en-PK",

  },

];

const quickPrompts: Record<ChatLanguage, string[]> = {

  english: [

    "Help me make a weekly budget",

    "How can I save more this month?",

    "Explain a simple 50/30/20 plan",

    "Motivate me to control spending",

  ],

  urdu: [

    "میرا ہفتہ وار بجٹ بنانے میں مدد کریں",

    "میں اس مہینے زیادہ بچت کیسے کر سکتا ہوں؟",

    "سادہ بجٹ پلان سمجھائیں",

    "خرچ کم کرنے کے لیے حوصلہ دیں",

  ],

  "roman-urdu": [

    "Mera weekly budget banane mein help karo",

    "Is month zyada saving kaise karun?",

    "Simple budget plan samjhao",

    "Mujhe spending control karne ki motivation do",

  ],

};

const welcomeByLanguage: Record<ChatLanguage, string> = {

  english:

    "Hi! I’m Campus AI ✨ Your student money companion. Ask me about budgeting, saving, spending habits, or financial planning.",

  urdu:

    "اسلام علیکم! میں Campus AI ہوں ✨ بجٹ، بچت، خرچ اور مالی منصوبہ بندی کے بارے میں مجھ سے پوچھیں۔",

  "roman-urdu":

    "Assalamualaikum! Main Campus AI hoon ✨ Budget, saving, spending aur financial planning ke bare mein mujh se pooch sakte ho.",

};

function makeId() {

  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

}

function readStoredMessages(): ChatMessage[] {

  if (typeof window === "undefined") {

    return [];

  }

  try {

    const raw = sessionStorage.getItem(STORAGE_KEY);

    if (!raw) {

      return [];

    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {

      return [];

    }

    return parsed.filter(

      (item): item is ChatMessage =>

        item &&

        typeof item.id === "string" &&

        (item.role === "user" || item.role === "assistant") &&

        typeof item.text === "string",

    );

  } catch {

    return [];

  }

}

function ChatShell({

  compact = false,

  onClose,

}: {

  compact?: boolean;

  onClose?: () => void;

}) {

  const [language, setLanguage] =

    useState<ChatLanguage>("english");

  const [messages, setMessages] =

    useState<ChatMessage[]>(() => {

      const stored = readStoredMessages();

      return stored.length

        ? stored

        : [

            {

              id: makeId(),

              role: "assistant",

              text: welcomeByLanguage.english,

            },

          ];

    });

  const [input, setInput] = useState("");

  const [sending, setSending] = useState(false);

  const [listening, setListening] = useState(false);

  const [voiceReplies, setVoiceReplies] = useState(false);

  const [voiceSupported, setVoiceSupported] = useState(true);

  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const activeLanguage = useMemo(

    () =>

      languageOptions.find((item) => item.value === language) ??

      defaultLanguageOption,

    [language],

  );

  useEffect(() => {

    sessionStorage.setItem(

      STORAGE_KEY,

      JSON.stringify(messages.slice(-30)),

    );

  }, [messages]);

  useEffect(() => {

    scrollRef.current?.scrollTo({

      top: scrollRef.current.scrollHeight,

      behavior: "smooth",

    });

  }, [messages, sending]);

  useEffect(() => {

    setVoiceSupported(

      Boolean(

        window.SpeechRecognition ||

          window.webkitSpeechRecognition,

      ),

    );

    return () => {

      recognitionRef.current?.stop();

      window.speechSynthesis?.cancel();

    };

  }, []);

  function speak(text: string) {

    if (!("speechSynthesis" in window) || !text.trim()) {

      return;

    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = activeLanguage.speechLocale;

    utterance.rate = language === "urdu" ? 0.9 : 0.96;

    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();

    const preferredPrefix =

      activeLanguage.speechLocale.split("-")[0]?.toLowerCase() ?? "en";

    const matchingVoice = voices.find((voice) =>

      voice.lang.toLowerCase().startsWith(preferredPrefix),

    );

    if (matchingVoice) {

      utterance.voice = matchingVoice;

    }

    window.speechSynthesis.speak(utterance);

  }

  async function sendMessage(

    rawText?: string,

    fromVoice = false,

  ) {

    const text = (rawText ?? input).trim();

    if (!text || sending) {

      return;

    }

    const historyForApi = messages

      .slice(-12)

      .map((message) => ({

        role: message.role,

        text: message.text,

      }));

    const userMessage: ChatMessage = {

      id: makeId(),

      role: "user",

      text,

    };

    setMessages((current) => [...current, userMessage]);

    setInput("");

    setSending(true);

    try {

      const response = await apiRequest<{

        reply: string;

        model: string;

      }>("/assistant/chat.php", {

        method: "POST",

        body: JSON.stringify({

          message: text,

          language,

          history: historyForApi,

        }),

      });

      const reply = response.data.reply.trim();

      const assistantMessage: ChatMessage = {

        id: makeId(),

        role: "assistant",

        text: reply,

      };

      setMessages((current) => [

        ...current,

        assistantMessage,

      ]);

      if (voiceReplies || fromVoice) {

        window.setTimeout(() => speak(reply), 120);

      }

    } catch (error) {

      setMessages((current) => [

        ...current,

        {

          id: makeId(),

          role: "assistant",

          text:

            error instanceof Error

              ? error.message

              : "I couldn’t connect right now. Please try again.",

        },

      ]);

    } finally {

      setSending(false);

    }

  }

  function startVoiceInput() {

    if (listening) {

      recognitionRef.current?.stop();

      setListening(false);

      return;

    }

    const Recognition =

      window.SpeechRecognition ??

      window.webkitSpeechRecognition;

    if (!Recognition) {

      setVoiceSupported(false);

      return;

    }

    const recognition = new Recognition();

    recognition.lang = activeLanguage.recognitionLocale;

    recognition.continuous = false;

    recognition.interimResults = false;

    recognition.onresult = (event) => {

      const transcript =

        event.results?.[0]?.[0]?.transcript?.trim() ?? "";

      if (transcript) {

        setInput(transcript);

        void sendMessage(transcript, true);

      }

    };

    recognition.onerror = () => {

      setListening(false);

    };

    recognition.onend = () => {

      setListening(false);

      recognitionRef.current = null;

    };

    recognitionRef.current = recognition;

    setListening(true);

    recognition.start();

  }

  function clearConversation() {

    window.speechSynthesis?.cancel();

    const nextMessages: ChatMessage[] = [

      {

        id: makeId(),

        role: "assistant",

        text: welcomeByLanguage[language],

      },

    ];

    setMessages(nextMessages);

  }

  async function copyMessage(message: ChatMessage) {

    try {

      await navigator.clipboard.writeText(message.text);

      setCopiedMessageId(message.id);

      window.setTimeout(() => {

        setCopiedMessageId((current) =>

          current === message.id ? null : current,

        );

      }, 1200);

    } catch {

      // Clipboard access may be unavailable on non-HTTPS pages.

    }

  }

  function handleComposerKeyDown(

    event: KeyboardEvent<HTMLTextAreaElement>,

  ) {

    if (event.key === "Enter" && !event.shiftKey) {

      event.preventDefault();

      void sendMessage();

    }

  }

  return (
    <section
      className={cn(
        "relative isolate flex overflow-hidden border !font-sans",
        "border-[#cbd6ca] bg-[#fffdf8] text-[#1f3529] shadow-[0_24px_70px_rgba(42,65,50,0.14)]",
        "dark:border-[#2a533e] dark:bg-[#06140d] dark:text-[#eef7f0] dark:shadow-[0_30px_90px_rgba(0,0,0,0.46)]",
        compact
          ? "h-[min(620px,calc(100vh-5.5rem))] w-[min(410px,calc(100vw-1rem))] flex-col rounded-[28px]"
          : "min-h-[650px] w-full flex-col rounded-[28px] lg:h-[calc(100vh-13.5rem)] lg:max-h-[760px]",
      )}
      aria-label="Campus AI assistant"
    >
      <div className="pointer-events-none absolute -left-20 -top-24 z-0 size-64 rounded-full bg-[#b8d8b8]/22 blur-3xl dark:bg-emerald-400/[0.07]" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 z-0 size-72 rounded-full bg-[#e7cfbf]/18 blur-3xl dark:bg-emerald-300/[0.04]" />

      <div
        className={cn(
          "relative z-10 shrink-0 border-b px-4 py-4 sm:px-5",
          "border-[#d7d6ca] bg-[linear-gradient(135deg,#f6faef_0%,#fffaf1_56%,#f3f8ef_100%)]",
          "dark:border-[#2b543f] dark:bg-[radial-gradient(circle_at_0%_0%,rgba(105,194,137,0.12),transparent_34%),linear-gradient(135deg,#0b2b1d,#123d2a)]",
          compact ? "" : "lg:px-6 lg:py-5",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={cn(
                "grid shrink-0 place-items-center border shadow-[0_8px_18px_rgba(38,86,58,0.10)]",
                "border-[#bfd1c0] bg-[#e9f4e7] text-[#17643f]",
                "dark:border-[#3d7557] dark:bg-[#163f2c] dark:text-[#a9e4bb]",
                compact ? "size-11 rounded-[15px]" : "size-12 rounded-[17px]",
              )}
            >
              <Sparkles size={compact ? 21 : 23} strokeWidth={2.05} />
            </span>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  className={cn(
                    "truncate !font-sans !font-extrabold !tracking-[-0.035em] !text-[#173226] dark:!text-[#f7fbf8]",
                    compact ? "!text-[18px]" : "!text-[21px]",
                  )}
                >
                  Campus AI
                </h2>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#b8d0bc] bg-white/85 px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] !text-[#236445] shadow-sm dark:border-[#3c7556] dark:bg-[#173d2b] dark:!text-[#a9e0b9]">
                  <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.55)]" />
                  Live
                </span>
              </div>

              <p className="mt-1 truncate !font-sans text-[11px] font-semibold !text-[#5f6d63] dark:!text-[#a7b8ad] sm:text-xs">
                Your multilingual student money companion
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                const next = !voiceReplies;
                setVoiceReplies(next);
                if (!next) window.speechSynthesis?.cancel();
              }}
              className="grid size-9 place-items-center rounded-full border border-[#c5d1c5] bg-white/90 !text-[#245f43] shadow-sm transition hover:border-[#7da98a] hover:bg-[#eef7ed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a9b72]/30 dark:border-[#3c6e52] dark:bg-[#143727] dark:!text-[#b9e0c4] dark:hover:bg-[#1a4430]"
              aria-label={voiceReplies ? "Disable voice replies" : "Enable voice replies"}
              title={voiceReplies ? "Voice replies on" : "Voice replies off"}
            >
              {voiceReplies ? <Volume2 size={17} /> : <VolumeX size={17} />}
            </button>

            <button
              type="button"
              onClick={clearConversation}
              className="grid size-9 place-items-center rounded-full border border-[#c5d1c5] bg-white/90 !text-[#245f43] shadow-sm transition hover:border-[#7da98a] hover:bg-[#eef7ed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a9b72]/30 dark:border-[#3c6e52] dark:bg-[#143727] dark:!text-[#b9e0c4] dark:hover:bg-[#1a4430]"
              aria-label="Clear conversation"
              title="Clear conversation"
            >
              <Trash2 size={16} />
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="grid size-9 place-items-center rounded-full border border-[#c5d1c5] bg-white/90 !text-[#245f43] shadow-sm transition hover:border-[#7da98a] hover:bg-[#eef7ed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a9b72]/30 dark:border-[#3c6e52] dark:bg-[#143727] dark:!text-[#b9e0c4] dark:hover:bg-[#1a4430]"
                aria-label="Close Campus AI"
                title="Close"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-[15px] border border-[#c8d4c8] bg-white/85 p-1 shadow-sm dark:border-[#365f49] dark:bg-[#0e2c1f]">
            {languageOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setLanguage(option.value)}
                title={option.label}
                className={cn(
                  "rounded-[11px] px-3 py-1.5 !font-sans text-[10px] font-extrabold transition",
                  language === option.value
                    ? "bg-[#17653f] !text-white shadow-[0_5px_12px_rgba(23,101,63,0.24)] dark:bg-[#65c687] dark:!text-[#07170f]"
                    : "!text-[#536158] hover:bg-[#edf4eb] hover:!text-[#174c32] dark:!text-[#9fb2a6] dark:hover:bg-[#153b2a] dark:hover:!text-[#edf8f0]",
                )}
              >
                {option.short}
              </button>
            ))}
          </div>

          {!compact && (
            <span className="hidden items-center gap-2 rounded-full border border-[#d6d0c4] bg-white/72 px-3 py-1.5 !font-sans text-[10px] font-semibold !text-[#6d796f] shadow-sm dark:border-[#345c47] dark:bg-white/[0.04] dark:!text-[#9fb1a6] sm:inline-flex">
              <span className="size-1.5 rounded-full bg-[#4a9a68]" />
              Budgeting · Saving · Spending guidance
            </span>
          )}
        </div>
      </div>

      <div
        ref={scrollRef}
        className={cn(
          "relative z-10 min-h-0 flex-1 overflow-y-auto px-4 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-5",
          "bg-[radial-gradient(circle_at_50%_0%,rgba(113,154,120,0.07),transparent_42%),linear-gradient(180deg,#fbfaf5_0%,#f5f0e7_100%)]",
          "dark:bg-[radial-gradient(circle_at_50%_0%,rgba(55,132,88,0.10),transparent_42%),linear-gradient(180deg,#081a12_0%,#06140e_100%)]",
          compact ? "" : "lg:px-6 lg:py-6",
        )}
      >
        <div className={cn("mx-auto flex w-full flex-col gap-4", compact ? "max-w-none" : "max-w-[900px]")}> 
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("group flex", message.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "relative border px-4 py-3.5 !font-sans text-[13px] font-medium leading-6 sm:text-[14px]",
                  compact ? "max-w-[88%]" : "max-w-[76%]",
                  message.role === "user"
                    ? "rounded-[20px] rounded-br-[7px] border-[#246a47] bg-[linear-gradient(135deg,#17653f,#31845c)] shadow-[0_12px_26px_rgba(31,102,65,0.20)] dark:border-[#4c996c] dark:bg-[linear-gradient(135deg,#21744b,#46a06f)]"
                    : "rounded-[20px] rounded-bl-[7px] border-[#d9d1c4] bg-white/95 shadow-[0_12px_28px_rgba(57,68,59,0.08)] dark:border-[#2b513d] dark:bg-[#112d20] dark:shadow-[0_12px_28px_rgba(0,0,0,0.23)]",
                )}
              >
                {message.role === "assistant" && (
                  <div className="mb-2.5 flex items-center gap-2 !font-sans text-[10px] font-extrabold uppercase tracking-[0.12em] !text-[#236847] dark:!text-[#91d6aa]">
                    <span className="grid size-5 place-items-center rounded-md bg-[#e9f3e7] !text-[#236847] dark:bg-[#1a432f] dark:!text-[#91d4a9]">
                      <Bot size={12} />
                    </span>
                    Campus AI
                  </div>
                )}

                <p
                  className={cn(
                    "whitespace-pre-wrap break-words !font-sans",
                    message.role === "user"
                      ? "!text-white dark:!text-white"
                      : "!text-[#26382e] dark:!text-[#edf6ef]",
                  )}
                >
                  {message.text}
                </p>

                {message.role === "assistant" && (
                  <div className="mt-2.5 flex items-center gap-1 opacity-75 transition sm:opacity-0 sm:group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => speak(message.text)}
                      className="grid size-7 place-items-center rounded-lg !text-[#68766d] transition hover:bg-[#edf4ee] hover:!text-[#236847] dark:!text-[#90a297] dark:hover:bg-[#1a432f] dark:hover:!text-[#a8deb8]"
                      aria-label="Read response aloud"
                      title="Read aloud"
                    >
                      <Volume2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => void copyMessage(message)}
                      className="flex h-7 items-center gap-1 rounded-lg px-2 !font-sans text-[10px] font-semibold !text-[#68766d] transition hover:bg-[#edf4ee] hover:!text-[#236847] dark:!text-[#90a297] dark:hover:bg-[#1a432f] dark:hover:!text-[#a8deb8]"
                      aria-label="Copy response"
                      title="Copy"
                    >
                      {copiedMessageId === message.id ? (
                        <><Check size={12} />Copied</>
                      ) : (
                        "Copy"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex justify-start">
              <div className="rounded-[20px] rounded-bl-[7px] border border-[#d9d1c4] bg-white/95 px-4 py-3.5 shadow-sm dark:border-[#2b513d] dark:bg-[#112d20]">
                <div className="flex items-center gap-2">
                  <span className="size-2 animate-pulse rounded-full bg-[#2d8056]" />
                  <span className="size-2 animate-pulse rounded-full bg-[#2d8056] [animation-delay:140ms]" />
                  <span className="size-2 animate-pulse rounded-full bg-[#2d8056] [animation-delay:280ms]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 shrink-0 border-t border-[#d8d0c2] bg-[rgba(255,253,247,0.97)] px-4 pb-4 pt-3.5 backdrop-blur-xl dark:border-[#28513d] dark:bg-[rgba(8,26,18,0.97)] sm:px-5 lg:px-6">
        <div className={cn("mx-auto w-full", compact ? "max-w-none" : "max-w-[900px]")}> 
          <div className="mb-3 flex snap-x gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {quickPrompts[language].map((prompt) => (
              <button
                key={prompt}
                type="button"
                disabled={sending}
                onClick={() => void sendMessage(prompt)}
                className="shrink-0 snap-start rounded-full border border-[#cfc8bb] bg-white/95 px-3.5 py-2 !font-sans text-[10px] font-bold !text-[#304238] shadow-sm transition hover:-translate-y-0.5 hover:border-[#76a486] hover:bg-[#eef6ed] hover:!text-[#1d5c3a] disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#315943] dark:bg-[#123021] dark:!text-[#e1eee4] dark:hover:border-[#579875] dark:hover:bg-[#19422e] sm:text-[11px]"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="flex items-end gap-2 rounded-[22px] border border-[#cbc5b9] bg-white/95 p-2 shadow-[0_10px_28px_rgba(61,69,61,0.08)] transition focus-within:border-[#629578] focus-within:ring-4 focus-within:ring-[#5f9a76]/10 dark:border-[#315943] dark:bg-[#0f2b1e] dark:shadow-[0_12px_30px_rgba(0,0,0,0.22)] dark:focus-within:border-[#599372]">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleComposerKeyDown}
              rows={1}
              maxLength={1500}
              placeholder={
                language === "urdu"
                  ? compact ? "اپنا سوال لکھیں..." : "اپنا سوال یہاں لکھیں..."
                  : language === "roman-urdu"
                    ? compact ? "Apna sawal likho..." : "Apna sawal yahan likho..."
                    : compact ? "Ask Campus AI..." : "Ask Campus AI anything about student money..."
              }
              className="max-h-28 min-h-11 min-w-0 flex-1 resize-none overflow-y-auto bg-transparent px-3 py-2.5 !font-sans text-sm font-medium leading-6 !text-[#26372d] outline-none placeholder:!text-[#7f8a82] dark:!text-[#edf5ef] dark:placeholder:!text-[#93a49a] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            />

            <button
              type="button"
              onClick={startVoiceInput}
              disabled={!voiceSupported || sending}
              className={cn(
                "grid size-10 shrink-0 place-items-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5c9c73]/35 disabled:cursor-not-allowed disabled:opacity-45",
                listening
                  ? "border-rose-300 bg-rose-50 !text-rose-600 shadow-[0_0_0_4px_rgba(244,63,94,0.06)] dark:border-rose-400/30 dark:bg-rose-500/10 dark:!text-rose-300"
                  : "border-[#cbd5cc] bg-[#eef5ee] !text-[#2d6e4d] hover:bg-[#e1ece3] dark:border-[#345d47] dark:bg-[#163726] dark:!text-[#91d0aa] dark:hover:bg-[#1d4631]",
              )}
              aria-label={listening ? "Stop voice input" : "Start voice input"}
              title={!voiceSupported ? "Voice input is not supported in this browser" : listening ? "Listening..." : `Voice input (${activeLanguage.label})`}
            >
              {listening ? <MicOff size={17} /> : <Mic size={17} />}
            </button>

            <button
              type="button"
              onClick={() => void sendMessage()}
              disabled={!input.trim() || sending}
              className="grid size-10 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#17613d,#2e8257)] !text-white shadow-[0_9px_20px_rgba(31,105,70,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(31,105,70,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5c9c73]/45 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-[#9bc6aa] disabled:!text-white/90 dark:bg-[linear-gradient(135deg,#2d8156,#66c486)] dark:!text-[#07170f] dark:disabled:bg-[#315843] dark:disabled:!text-[#8ba294]"
              aria-label="Send message"
              title="Send"
            >
              <Send size={17} />
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between gap-3 px-1 !font-sans text-[9px] font-medium !text-[#6f7c73] dark:!text-[#91a299]">
            <span>AI can make mistakes. Avoid sharing passwords or sensitive financial details.</span>
            {!voiceSupported && <span className="shrink-0 !text-amber-600 dark:!text-amber-300">Voice unavailable</span>}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CampusAiWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-[99990] sm:bottom-6 sm:right-6">
      {open && (
        <div className="absolute bottom-[68px] right-0 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <ChatShell compact onClose={() => setOpen(false)} />
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "group relative grid size-[58px] place-items-center overflow-hidden rounded-[20px] border !text-white transition duration-200",
          "border-[#6d9f7f] bg-[linear-gradient(145deg,#17613d,#2d8256)] shadow-[0_15px_36px_rgba(31,91,61,0.30)]",
          "hover:-translate-y-0.5 hover:shadow-[0_19px_42px_rgba(31,91,61,0.36)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4d8a66]/20",
          "dark:border-[#5a9d73] dark:bg-[linear-gradient(145deg,#145338,#2f8156)]",
          open && "-translate-y-0.5",
        )}
        aria-label={open ? "Close Campus AI" : "Open Campus AI"}
        title="Campus AI"
      >
        <span className="pointer-events-none absolute inset-[5px] rounded-[16px] border border-white/15" />
        <span className="pointer-events-none absolute -right-5 -top-6 size-14 rounded-full bg-white/18 blur-2xl" />
        {open ? (
          <X size={23} strokeWidth={2.1} />
        ) : (
          <span className="relative grid size-10 place-items-center rounded-[14px] border border-white/20 bg-white/10 shadow-inner">
            <Bot size={21} strokeWidth={2.05} />
            <Sparkles size={11} strokeWidth={2.2} className="absolute -right-1 -top-1 !text-emerald-100" />
            <span className="absolute -bottom-1 -right-1 size-2.5 rounded-full border-2 border-[#2d8256] bg-emerald-200 shadow-[0_0_10px_rgba(167,243,208,0.9)] dark:border-[#1d6342]" />
          </span>
        )}
      </button>
    </div>
  );
}

export function CampusAiPage() {
  return (
    <div className="mx-auto w-full max-w-[1380px] !font-sans">
      <div className="mb-5 overflow-hidden rounded-[28px] border border-[#d5d6ca] bg-[linear-gradient(135deg,#f8fbf3_0%,#fffaf2_55%,#f1f7ee_100%)] px-5 py-5 shadow-[0_14px_38px_rgba(50,70,56,0.08)] dark:border-[#2d563f] dark:bg-[radial-gradient(circle_at_15%_0%,rgba(83,174,115,0.12),transparent_36%),linear-gradient(135deg,#0a2519,#103522)] dark:shadow-[0_16px_42px_rgba(0,0,0,0.22)] sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#bfd0c0] bg-white/75 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.13em] !text-[#286a48] shadow-sm dark:border-[#3a684f] dark:bg-[#153426] dark:!text-[#9bd7ae]">
              <Sparkles size={13} />
              AI Money Companion
            </div>
            <h1 className="!font-sans !text-[32px] !font-extrabold !leading-tight !tracking-[-0.045em] !text-[#173126] dark:!text-[#f5faf6] md:!text-[42px]">
              Campus AI
            </h1>
            <p className="mt-2 max-w-2xl !font-sans text-sm font-medium leading-6 !text-[#607067] dark:!text-[#a8b8ae]">
              Your personal finance companion for student life — clear guidance, better habits, and smarter everyday decisions.
            </p>
          </div>
          <div className="inline-flex shrink-0 items-center gap-2 self-start rounded-2xl border border-[#d1c9bc] bg-white/80 px-3.5 py-2 text-[11px] font-semibold !text-[#5f6d64] shadow-sm dark:border-[#355e48] dark:bg-[#122f21] dark:!text-[#aabbb1] sm:self-auto">
            <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.45)]" />
            Gemini powered
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)_240px]">
        <aside className="hidden min-h-[650px] flex-col justify-between rounded-[28px] border border-[#d5d6ca] bg-[linear-gradient(180deg,#fbfcf7_0%,#f5f2e8_100%)] p-5 shadow-[0_14px_34px_rgba(55,70,59,0.07)] dark:border-[#2d563f] dark:bg-[linear-gradient(180deg,#0d2a1d_0%,#08180f_100%)] dark:shadow-[0_16px_36px_rgba(0,0,0,0.24)] xl:flex">
          <div>
            <div className="mx-auto grid size-28 place-items-center rounded-[32px] border border-[#c5d9c6] bg-[radial-gradient(circle_at_35%_25%,#ffffff_0%,#edf7e8_42%,#d8ebd8_100%)] !text-[#17643f] shadow-[0_18px_40px_rgba(34,101,63,0.14)] dark:border-[#3c7355] dark:bg-[radial-gradient(circle_at_35%_25%,#1a4b34_0%,#103522_50%,#0a2116_100%)] dark:!text-[#9fe0b6]">
              <Bot size={48} strokeWidth={1.7} />
            </div>
            <p className="mt-5 !font-sans text-[11px] font-extrabold uppercase tracking-[0.14em] !text-[#2b6b49] dark:!text-[#8fd0a6]">Your AI companion</p>
            <h2 className="mt-2 !font-sans !text-[24px] !font-extrabold !leading-tight !tracking-[-0.035em] !text-[#193126] dark:!text-white">
              Better money habits, one chat at a time.
            </h2>
            <p className="mt-3 !font-sans text-sm leading-6 !text-[#657269] dark:!text-[#9fb0a6]">
              Ask about budgeting, saving, spending patterns, or planning your next goal.
            </p>
          </div>
          <div className="space-y-3">
            {["Student-focused guidance", "Private session history", "English, Urdu & Roman Urdu"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-[#d8d7ca] bg-white/70 px-3 py-3 text-xs font-semibold !text-[#405047] dark:border-[#315843] dark:bg-[#112f20] dark:!text-[#dbe8df]">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#e5f2e4] !text-[#2b6d4a] dark:bg-[#1b4430] dark:!text-[#92d2a9]">
                  <Check size={14} />
                </span>
                {item}
              </div>
            ))}
          </div>
        </aside>

        <ChatShell />

        <aside className="hidden min-h-[650px] flex-col gap-4 xl:flex">
          <div className="rounded-[26px] border border-[#d5d6ca] bg-[linear-gradient(135deg,#f2f8ee,#fffaf1)] p-5 shadow-[0_12px_30px_rgba(54,70,59,0.07)] dark:border-[#2d563f] dark:bg-[linear-gradient(135deg,#0d2d1f,#123b29)] dark:shadow-[0_14px_34px_rgba(0,0,0,0.22)]">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-[#dff0dc] !text-[#17643f] dark:bg-[#1a432f] dark:!text-[#9fdeb5]">
                <Mic size={20} />
              </span>
              <div>
                <p className="!font-sans text-sm font-extrabold !text-[#1f3529] dark:!text-white">Ask by voice</p>
                <p className="mt-1 !font-sans text-xs !text-[#6b786f] dark:!text-[#9eb0a5]">Use the mic inside the chat composer.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[26px] border border-[#d5d6ca] bg-white/80 p-5 shadow-[0_12px_30px_rgba(54,70,59,0.07)] dark:border-[#2d563f] dark:bg-[#0d271b] dark:shadow-[0_14px_34px_rgba(0,0,0,0.22)]">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="!text-[#2a704c] dark:!text-[#93d4aa]" />
              <p className="!font-sans text-sm font-extrabold !text-[#1f3529] dark:!text-white">Popular questions</p>
            </div>
            <div className="mt-4 space-y-2">
              {["How can I save more this month?", "Explain a simple 50/30/20 plan", "Help me control spending", "How should I plan a weekly budget?"].map((item) => (
                <div key={item} className="rounded-2xl border border-[#dfddd3] bg-[#fbfaf6] px-3 py-3 !font-sans text-xs font-semibold leading-5 !text-[#45544b] dark:border-[#315843] dark:bg-[#122f21] dark:!text-[#dce8e0]">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto rounded-[26px] border border-[#c8d9c7] bg-[linear-gradient(145deg,#eaf5e7,#f8f5e9)] p-5 dark:border-[#35634b] dark:bg-[linear-gradient(145deg,#113725,#0b2217)]">
            <p className="!font-sans text-[11px] font-extrabold uppercase tracking-[0.13em] !text-[#2b6c49] dark:!text-[#8fd0a6]">Campus AI</p>
            <p className="mt-2 !font-sans text-sm font-bold leading-6 !text-[#20362a] dark:!text-[#eff7f1]">Smarter decisions. Calmer money habits.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
