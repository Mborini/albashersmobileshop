"use client";

import { useState } from "react";

type Message = { sender: "user" | "bot"; text: string };
type Option = { label: string; next?: Option[]; reply?: string };

const options: Option[] = [
  {
    label: "📱 المنتجات",
    next: [
      {
        label: "آيفون 15",
        reply: "آيفون 15 متوفر بعدة ألوان وبسعر يبدأ من 900 دينار.",
      },
      {
        label: "آيفون 14",
        reply: "آيفون 14 متوفر وبخصم خاص حالياً. السعر يبدأ من 800 دينار.",
      },
      {
        label: "آيفون 13",
        reply: "لدينا عدد محدود من آيفون 13 بسعر 700 دينار.",
      },
    ],
  },
  {
    label: "🎧 الإكسسوارات",
    next: [
      {
        label: "كفرات أصلية",
        reply: "لدينا كفرات أصلية بأسعار تبدأ من 15 دينار.",
      },
      { label: "شواحن", reply: "شواحن آيفون أصلية ومتوافقة تبدأ من 20 دينار." },
      { label: "سماعات", reply: "تتوفر سماعات AirPods بأنواعها المختلفة." },
    ],
  },
  {
    label: "🛠️ الصيانة",
    next: [
      {
        label: "تغيير شاشة",
        reply: "تكلفة تغيير الشاشة تبدأ من 80 دينار حسب الموديل.",
      },
      {
        label: "تغيير بطارية",
        reply: "تغيير البطارية الأصلية بسعر يبدأ من 40 دينار.",
      },
      { label: "مشاكل في الشبكة", reply: "نقدم فحص مجاني لمشاكل الشبكة." },
    ],
  },
  {
    label: "❓ أسئلة متكررة",
    next: [
      {
        label: "هل الأجهزة مكفولة؟",
        reply: "نعم، جميع الأجهزة مكفولة لمدة سنة.",
      },
      {
        label: "هل توفرون تقسيط؟",
        reply: "نعم، يوجد تقسيط من خلال شركات معتمدة.",
      },
    ],
  },
  {
    label: "📞 تواصل معنا",
    reply:
      "يمكنك التواصل معنا عبر واتساب: 079xxxxxxx أو زيارتنا في شارع مكة، عمّان.",
  },
];

export default function ChatPopup({ iconOnly = false }: { iconOnly?: boolean }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "مرحباً بك في متجر آيفون! اختر من القائمة:" },
  ]);
  const [currentOptions, setCurrentOptions] = useState<Option[]>(options);

  const handleClick = (option: Option) => {
    const userMsg: Message = { sender: "user", text: option.label };
    setMessages((prev) => [...prev, userMsg]);

    if (option.reply) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: option.reply! },
        ]);
      }, 500);
    }

    if (option.next) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "اختر من القائمة التالية:" },
        ]);
        setCurrentOptions(option.next!);
      }, 600);
    } else {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "هل ترغب في العودة للقائمة الرئيسية؟" },
        ]);
        setCurrentOptions(options);
      }, 3000);
    }
  };

  return (
    <>
      {/* الزر ضمن النافبار */}
  {/* الزر ضمن النافبار */}
<button
  onClick={() => setOpen(!open)}
  className="flex flex-col items-center text-gray-700 hover:text-blue-600"
>
  <img
    src="images/logo/bot.gif" // حط هنا مسار صورة الـ GIF
    alt="Chat Icon"
    className="w-8 h-8"
  />

</button>


      {/* صندوق المحادثة */}
      {open && (
        <div className="fixed bottom-20 right-3 w-80 bg-white rounded-lg shadow-lg custumborder flex flex-col z-50">
          <div className="bg-blue-light text-white p-2 font-bold border rounded-t-full flex justify-between items-center">
            بوت المحل
            <button onClick={() => setOpen(false)}>❌</button>
          </div>

          <div className="p-2 h-64 overflow-y-auto text-sm space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-md ${
                  msg.sender === "user"
                    ? "bg-gray-200 text-right ml-8"
                    : "bg-blue-100 text-left mr-8"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="p-3 border-t flex flex-row flex-wrap gap-2 bg-gray-50 justify-start">
            {currentOptions.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleClick(opt)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-blue-100 transition duration-200"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}