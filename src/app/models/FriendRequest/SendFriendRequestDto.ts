import { Guid } from "guid-typescript";

export class SendFriendRequestDto{
    senderId!: Guid;
    receiverName!: string;
    createdAt!: Date;
}