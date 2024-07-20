import { Guid } from "guid-typescript";

export class SendMessageDto{
    chatId!: Guid;
    senderId!: Guid;
    text!: string;
}