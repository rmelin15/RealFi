import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsObject,
  Min,
} from 'class-validator';
import { LendableAssetType, RevenueModel } from '@prisma/client';

export class CreateLendableAssetDto {
  @ApiProperty({ enum: LendableAssetType, example: 'GPU' })
  @IsEnum(LendableAssetType)
  assetType: LendableAssetType;

  @ApiProperty({ example: 'NVIDIA H100 GPU Cluster' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'High-performance AI compute cluster with 8x H100 GPUs', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'San Francisco, CA' })
  @IsString()
  locationRegion: string;

  @ApiProperty({ example: 'TFLOPs_hour' })
  @IsString()
  capacityUnit: string;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @Min(0)
  capacityMax: number;

  @ApiProperty({ enum: RevenueModel, example: 'REV_SHARE', required: false })
  @IsEnum(RevenueModel)
  @IsOptional()
  revenueModel?: RevenueModel;

  @ApiProperty({ example: 15.5, required: false })
  @IsNumber()
  @IsOptional()
  targetYield?: number;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isBuyToRent?: boolean;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  operatorOrgId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ required: false, type: Object })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}


















