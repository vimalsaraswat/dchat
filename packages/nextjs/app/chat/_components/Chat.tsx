"use client";

import { useEffect, useState } from "react";
import { Database } from "@tableland/sdk";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface Message {
  id: number;
  sender: string;
  message: string;
  timestamp: string;
}

export default function Chat({
  chat,
  user,
  chainId,
}: {
  chat: {
    id: number;
    friend: string;
  };
  user: string;
  chainId?: number;
}) {
  const [message, setMessage] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    refresh();
    const intervalId = setInterval(refresh, 10000);
    return () => clearInterval(intervalId);
  });

  const { writeContractAsync, isMining } = useScaffoldWriteContract("Chat");

  const db = new Database();

  async function refresh() {
    try {
      if (chat.id !== undefined || chainId !== undefined) {
        const { results } = await db.prepare(`SELECT * FROM chat_${chainId}_${chat.id};`).all();
        setMessages(results as unknown as Message[]);
        console.log(`Read data from table '${chat.id}':\n`, results);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  }

  return (
    <section className="w-full rounded-l card-body ml-0 space-y-4">
      <h2 className="card-title">{chat.friend}</h2>
      <div className="card-actions justify-end"></div>

      <section className="space-y-3 max-h-[34rem] grow overflow-y-scroll">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat ${String(message.sender) === user.toLowerCase() ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-bubble chat-bubble-secondary">{message.message}</div>
            <div className="chat-footer opacity-50 text-xs text-muted">
              {new Date(Number(message.timestamp) * 1000).toLocaleString()}
            </div>
          </div>
        ))}
      </section>
      <form
        action={async () => {
          try {
            await writeContractAsync({
              functionName: "sendMessage",
              args: [message, BigInt(chat.id)],
            });
            setMessage("");
          } catch (e) {
            console.error("Error sending message:", e);
          }
        }}
        className="flex max-w-sm mx-auto rounded-full"
      >
        <input
          type="text"
          placeholder="Message"
          className="input bg-base-200 input-bordered w-full rounded-e"
          onChange={e => setMessage(e.target.value)}
          value={message}
          required
        />
        <button type="submit" className="btn rounded-s btn-primary" disabled={isMining || !user}>
          {isMining ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <ArrowUpIcon className="h-4 w-4 cursor-pointer" aria-hidden="true" />
          )}
        </button>
      </form>
    </section>
  );
}
