// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10 <0.9.0;

import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";
import { ERC721Holder } from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import { TablelandDeployments } from "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import { SQLHelpers } from "@tableland/evm/contracts/utils/SQLHelpers.sol";

struct ChatRoom {
	uint256 id;
	address[2] members;
}

contract Chat is ERC721Holder {
	// mapping(address => string) private userName;
	mapping(address => ChatRoom[]) chatRooms;
	string private constant _TABLE_PREFIX = "chat";

	// Let anyone insert into the table
	function sendMessage(string memory message, uint256 roomId) external {
		require(
			_checkUserInChatRoom(msg.sender, roomId),
			"User is not in this chat room"
		);

		TablelandDeployments.get().mutate(
			address(this),
			roomId,
			SQLHelpers.toInsert(
				_TABLE_PREFIX,
				roomId,
				"sender, message, timestamp",
				string.concat(
					SQLHelpers.quote(Strings.toHexString(msg.sender)),
					",",
					SQLHelpers.quote(message),
					",",
					SQLHelpers.quote(Strings.toString(block.timestamp))
				)
			)
		);
	}

	// Function to create a new chat room
	function createChatRoom(address participant) public {
		uint256 roomId = _createChatRoom();

		ChatRoom memory room = ChatRoom(roomId, [msg.sender, participant]);

		chatRooms[msg.sender].push(room);
		chatRooms[participant].push(room);
	}

	function _createChatRoom() internal returns (uint256) {
		uint256 roomId = TablelandDeployments.get().create(
			address(this),
			SQLHelpers.toCreateFromSchema(
				"id integer primary key,"
				"sender text,"
				"message text,"
				"timestamp text",
				_TABLE_PREFIX
			)
		);
		return roomId;
	}

	// Chech if user in a chat room
	function _checkUserInChatRoom(
		address user,
		uint256 id
	) internal view returns (bool) {
		ChatRoom[] memory rooms = chatRooms[user];

		for (uint i = 0; i < rooms.length; i++) {
			if (rooms[i].id == id) {
				return true;
			}
		}

		return false;
	}

	// // Delete a message from the room by ID
	// function deleteMessage(uint256 id, uint256 roomId) external {
	// require(
	// 	_checkUserInChatRoom(msg.sender, roomId),
	// 	"User is not in this chat room"
	// );
	// 	// Specify filters for which row to delete
	// 	string memory filters = string.concat("id=", Strings.toString(id));
	// 	// Mutate a row at `id`
	// 	TablelandDeployments.get().mutate(
	// 		address(this),
	// 		roomId,
	// 		SQLHelpers.toDelete(_TABLE_PREFIX, roomId, filters)
	// 	);
	// }

	// Return caller's chat rooms
	function getChatRooms(
		address addr
	) external view returns (ChatRoom[] memory) {
		// require();
		return chatRooms[addr];
	}

	// Return the table name
	function getTableName(uint256 id) external view returns (string memory) {
		return SQLHelpers.toNameFromId(_TABLE_PREFIX, id);
	}
}
