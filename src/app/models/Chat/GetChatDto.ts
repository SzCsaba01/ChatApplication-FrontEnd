import { Guid } from "guid-typescript";
import { GetMessageDto } from "../Message/GetMessageDto";
import { GetUserDto } from "../User/GetUserDto";

export class GetChatDto{
    chatId!: Guid;
    user!: GetUserDto;
    chatName!: string;
    chatPicture!: string;
    users!: GetUserDto[];
    chatAdmins!: GetUserDto[];
}