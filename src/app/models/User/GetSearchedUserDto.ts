import { FriendRequestFlag } from "src/app/enums/FriendRequestFlag";

export class GetSearchedUserDto{
    profilePicture?: string;
    username!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    friendRequestFlag!: FriendRequestFlag;
}