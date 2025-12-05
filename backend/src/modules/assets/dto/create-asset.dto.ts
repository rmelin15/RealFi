import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
  IsUUID,
} from 'class-validator';
import { AssetCategory, RiskRating } from '@prisma/client';

export class CreateAssetDto {
  @ApiProperty({ example: 'Downtown Coffee Shop Franchise' })
  @IsString()
  name: string;

  @ApiProperty({ enum: AssetCategory, example: 'COFFEE_SHOP' })
  @IsEnum(AssetCategory)
  category: AssetCategory;

  @ApiProperty({
    example: 'Premium coffee shop franchise located in downtown financial district',
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 'New York, NY' })
  @IsString()
  locationRegion: string;

  @ApiProperty({ example: 'uuid-of-sponsor-org' })
  @IsUUID()
  sponsorOrgId: string;

  @ApiProperty({ example: 10000 })
  @IsNumber()
  @Min(1)
  totalShares: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0.01)
  pricePerShare: number;

  @ApiProperty({ example: 'USD', required: false })
  @IsString()
  @IsOptional()
  currency?: string;

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

  @ApiProperty({ example: 12.5, required: false })
  @IsNumber()
  @IsOptional()
  projectedApy?: number;

  @ApiProperty({ enum: RiskRating, example: 'MEDIUM', required: false })
  @IsEnum(RiskRating)
  @IsOptional()
  riskRating?: RiskRating;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ required: false, type: [Object] })
  @IsArray()
  @IsOptional()
  documents?: any[];

  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsOptional()
  highlights?: string[];
}


















