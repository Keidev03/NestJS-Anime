import { IsNumberString, IsOptional } from "class-validator";

export class PaginationFavouriteDTO {

    @IsOptional()
    @IsNumberString()
    page: number;

    @IsOptional()
    @IsNumberString()
    limit: number;
}