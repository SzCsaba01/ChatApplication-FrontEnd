import { GetSearchedUserDto } from "./GetSearchedUserDto";

export class UserPaginationDto{
    getSearchedUserDto!: GetSearchedUserDto[];
    numberOfUsers!: number;
    numberOfPages!: number;
}