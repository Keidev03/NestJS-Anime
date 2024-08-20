import { IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator";

export class SearchAnimeDTO {

     @IsOptional()
     @IsNumberString()
     page: number;

     @IsOptional()
     @IsNumberString()
     limit: number;

     @IsNotEmpty()
     @IsString()
     keyword: string;

     @IsOptional()
     @IsString()
     genre: string;

     @IsOptional()
     @IsString()
     type: string;
}