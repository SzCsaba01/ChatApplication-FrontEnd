import { Guid } from "guid-typescript";

export class DeleteFriendDto{
    userId!: Guid;
    friendUserName!: string;
}