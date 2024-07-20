import { Guid } from "guid-typescript";

export class GetMessageDto{
    chatId!: Guid;
    senderUsername!: string;
    senderProfilePicture!: string;
    text!: string;
    createdAt!: Date;
}