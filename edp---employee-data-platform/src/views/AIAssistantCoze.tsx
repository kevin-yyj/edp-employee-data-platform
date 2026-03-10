import React, { useMemo, useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import { api } from "../lib/api";

const cozeBotId = import.meta.env.VITE_COZE_BOT_ID;
const cozeBaseUrl = import.meta.env.VITE_COZE_BASE_URL || "https://www.coze.cn";

function buildCozeUrl() {
  if (!cozeBotId) return "";
  return `${cozeBaseUrl}/store/agent/${cozeBotId}`;
}

export default function AIAssistantCoze() {
  const cozeUrl = useMemo(() => buildCozeUrl(), []);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string>("");
  const [status, setStatus] = useState("就绪");

  const saveUserMessage = async () => {
    if (!input.trim()) return;
    setStatus("正在记录会话...");
    try {
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        const created = await api.post<any>("/api/ai/sessions", {
          title: input.slice(0, 30),
        });
        currentSessionId = created.id;
        setSessionId(created.id);
      }

      await api.post("/api/ai/messages", {
        sessionId: currentSessionId,
        role: "user",
        content: input,
      });

      setInput("");
      setStatus("已记录，正在 Coze 对话");
    } catch {
      setStatus("记录失败（可能未登录），但你仍可继续在 Coze 对话");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Sparkles className="text-primary" size={20} />
          <h2 className="text-lg font-bold tracking-tight">AI 数据分析助手（Coze）</h2>
        </div>
        <span className="text-xs text-slate-500">{status}</span>
      </header>

      <div className="flex-1 p-6">
        {!cozeUrl ? (
          <div className="h-full flex items-center justify-center border border-dashed border-slate-300 rounded-xl bg-slate-50">
            <div className="text-center max-w-xl p-6">
              <Bot className="mx-auto text-primary mb-3" size={32} />
              <p className="font-semibold">未检测到 Coze 配置</p>
              <p className="text-sm text-slate-500 mt-2">
                请在环境变量里设置 `VITE_COZE_BOT_ID`（可选 `VITE_COZE_BASE_URL`）。
              </p>
            </div>
          </div>
        ) : (
          <iframe
            src={cozeUrl}
            title="EDP Coze AI Assistant"
            className="w-full h-full border border-slate-200 rounded-xl"
            allow="clipboard-read; clipboard-write; microphone"
          />
        )}
      </div>

      <div className="p-6 border-t border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            placeholder="可先输入问题（会写入 EDP 会话日志）..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            onClick={saveUserMessage}
            className="px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
