"use client";

import { useState } from "react";
import Chat from "./_components/Chat";
import Contacts from "./_components/Contacts";
import { useAccount } from "wagmi";

export default function Home() {
  const { address: connectedAddress, connector } = useAccount();
  const [chainId, setChainId] = useState<number>();
  const [currentChatRoom, setCurrentChatRoom] = useState<{
    id: number;
    friend: string;
  }>();

  connector?.getChainId().then(id => setChainId(id));

  return (
    <div className="grow">
      {connectedAddress && (
        <div className="card mx-8 md:mx-20 lg:mx-36 mt-4 card-side bg-base-100 shadow-xl">
          <Contacts user={connectedAddress} setChat={setCurrentChatRoom} />
          {currentChatRoom && <Chat user={connectedAddress} chat={currentChatRoom} chainId={chainId} />}
        </div>
      )}
    </div>
  );
}
