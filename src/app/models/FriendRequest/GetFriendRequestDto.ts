import { FriendRequestFlag } from "src/app/enums/FriendRequestFlag";

export class GetFriendRequestDto{
    senderName!: string;
    senderProfilePicture!: string;
    friendRequestFlag!: FriendRequestFlag;
    createdAt!: Date;
}