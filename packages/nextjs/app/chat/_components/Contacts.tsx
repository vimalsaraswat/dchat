"use client";

import React, { useState } from "react";
import { Address as AddressType } from "viem";
import { Address, AddressInput } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

type ChatRoom = {
  id: number;
  members: [AddressType, AddressType];
};

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

  const { data: chatRooms } = useScaffoldReadContract({
    contractName: "Chat",
    functionName: "getChatRooms",
    args: [user],
    watch: true,
  });

  const { writeContractAsync, isMining } = useScaffoldWriteContract("Chat");

  return (
    <section className="w-full max-w-md modal-box aspect-[9/16] space-y-4">
      <form
        action={async () => {
          try {
            await writeContractAsync({
              functionName: "createChatRoom",
              args: [newFriend],
            });
          } catch (e) {
            console.error("Error creating chat room:", e);
          }
        }}
        className="flex"
      >
        <AddressInput
          placeholder="Friend's Address"
          onChange={value => setNewFriend(value as AddressType)}
          value={newFriend ?? ""}
        />
        <button type="submit" className="btn btn-primary" disabled={isMining || !user}>
          {isMining ? <span className="loading loading-spinner loading-sm"></span> : <>Add</>}
        </button>
      </form>
      <ul className="space-y-2 w-full">
        {chatRooms?.map((room: ChatRoom, i: React.Key) => {
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
