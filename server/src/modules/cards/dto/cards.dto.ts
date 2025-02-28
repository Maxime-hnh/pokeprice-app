import { IsInt, IsOptional, IsString, IsUUID, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCardDto {
  @IsUUID()
  uid: string;

  @IsString()
  localId: string;

  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  illustrator?: string;

  @IsOptional()
  @IsString()
  rarity?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  averagePrice?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  highestPrice?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  lowestPrice?: number;

  @IsOptional()
  @IsString()
  ebaySearchContent?: string;

  @IsInt()
  setId: number;
};

export class UpdateCardDto extends PartialType(CreateCardDto) {}

