import { Guid } from "guid-typescript";

export class UserSearchDto{
    searcherId!: Guid;
    search!: string;
    page!: number;
}