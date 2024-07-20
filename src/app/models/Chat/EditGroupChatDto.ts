import { Guid } from "guid-typescript";

export class EditGroupChatDto{
    userId!: Guid;
    chatId!: Guid;
    chatName!: string;
    usersToBeAdded!: string[];
    adminsToBeAdded!: string[];
    membersToBeRemoved!: string[];
}