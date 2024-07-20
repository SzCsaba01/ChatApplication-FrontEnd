import { Guid } from "guid-typescript";

export class EditUserDto{
    userId!: Guid;
    userName!: string;
    email!: string;
    firstName!: string;
    lastName!: string;
}