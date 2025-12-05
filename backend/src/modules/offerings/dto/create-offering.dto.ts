import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsArray,
  IsDateString,
  IsUUID,
  Min,
} from 'class-validator';
import { OfferingType } from '@prisma/client';

export class CreateOfferingDto {
  @ApiProperty({ example: 'uuid-of-asset' })
  @IsUUID()
  assetId: string;

  @ApiProperty({ example: 'Series A Funding Round' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Initial funding round for the asset', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: OfferingType, example: 'EQUITY', required: false })
  @IsEnum(OfferingType)
  @IsOptional()
  offeringType?: OfferingType;

  @ApiProperty({ example: '2024-01-01T00:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ example: '2024-03-01T00:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ example: ['RETAIL', 'ACCREDITED'], required: false })
  @IsArray()
  @IsOptional()
  allowedInvestorTypes?: string[];

  @ApiProperty({ example: ['US', 'CA', 'GB'], required: false })
  @IsArray()
  @IsOptional()
  allowedCountries?: string[];

  @ApiProperty({ example: ['CN', 'RU'], required: false })
  @IsArray()
  @IsOptional()
  restrictedCountries?: string[];

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(1)
  minInvestment: number;

  @ApiProperty({ example: 50000 })
  @IsNumber()
  @Min(1)
  maxInvestment: number;

  @ApiProperty({ example: 1000000 })
  @IsNumber()
  @Min(1)
  targetRaise: number;
}


















