"use client";

import React, { useState } from "react";
import { Address as AddressType } from "viem";
import { Address, AddressInput } from "~~/components/scaffold-eth";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export default function Contacts({
  user,
  setChat,
}: {
  user: AddressType;
  setChat: React.Dispatch<
    React.SetStateAction<
      | {
          id: number;
          friend: string;
        }
      | undefined
    >
  >;
}) {
  const [newFriend, setNewFriend] = useState<AddressType>();

  const { data: chatRooms } = useScaffoldContractRead({
    contractName: "Chat",
    functionName: "getChatRooms",
    args: [user],
    watch: true,
  });

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "Chat",
    functionName: "createChatRoom",
    args: [newFriend],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  return (
    <section className="w-full max-w-md modal-box aspect-[9/16] space-y-4">
      <form action={() => writeAsync()} className="flex">
        <AddressInput
          placeholder="Friend's Address"
          onChange={value => setNewFriend(value as AddressType)}
          value={newFriend ?? ""}
        />
        <button type="submit" className="btn btn-primary" disabled={isLoading || !user}>
          {isLoading ? <span className="loading loading-spinner loading-sm"></span> : <>Add</>}
        </button>
      </form>
      <ul className="space-y-2 w-full">
        {chatRooms?.map((room, i) => {
          const friend = room.members[0] === user ? room.members[1] : room.members[0];
          return (
            <li
              key={i}
              className="w-full btn-link cursor-pointer"
              onClick={() => setChat({ id: Number(room.id), friend: friend })}
            >
              <Address disableAddressLink size="lg" address={friend} />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
