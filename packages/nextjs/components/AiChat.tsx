"use client";

import { useChat } from "ai/react";
import { ArrowUpIcon, ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";

/**
 * Chat modal which lets you chat with ai.
 */
export const AiChat = () => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    <div>
      <label htmlFor="chat-modal" className="btn bg-gradient-to-r from-indigo-500 to-pink-500 btn-sm font-normal gap-1">
        <ChatBubbleLeftEllipsisIcon className="h-4 w-4" />
        <span>AI</span>
      </label>
      <input type="checkbox" id="chat-modal" className="modal-toggle" />
      <label htmlFor="chat-modal" className="modal cursor-pointer">
        <label className="modal-box relative aspect-[9/16] max-w-sm flex flex-col lg:max-w-md">
          {/* dummy input to capture event onclick on modal box */}
          <input className="h-0 w-0 absolute top-0 left-0" />
          <h3 className="text-xl font-bold mb-3">AI Chat</h3>
          <label htmlFor="chat-modal" className="btn btn-ghost btn-sm btn-circle absolute right-3 top-3">
            ✕
          </label>

          <div className="space-y-3 grow overflow-y-scroll">
            {messages.map(m => (
              <div key={m.id} className={`chat ${m.role === "user" ? "chat-end chat bubble" : "chat-start"}`}>
                <div className="chat-bubble chat-bubble-secondary">{m.content}</div>
              </div>
            ))}
          </div>

          <form className="flex border-2 border-base-300 bg-base-200 rounded-full text-accent" onSubmit={handleSubmit}>
            <input
              className="input input-ghost focus-within:border-transparent focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
              name="prompt"
              value={input}
              placeholder="Ask AI"
              onChange={handleInputChange}
            />
            <button className="btn btn-primary h-[2.2rem] min-h-[2.2rem]" type="submit">
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <ArrowUpIcon className="h-3 w-3 cursor-pointer" aria-hidden="true" />
              )}
            </button>
          </form>
        </label>
      </label>
    </div>
  );
};
