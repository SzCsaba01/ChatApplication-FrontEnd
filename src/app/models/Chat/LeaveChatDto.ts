import { Guid } from "guid-typescript";

export class LeaveChatDto {
    userId!: Guid;
    chatId!: Guid;
}
