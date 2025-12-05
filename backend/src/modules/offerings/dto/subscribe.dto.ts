import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class SubscribeDto {
  @ApiProperty({ example: 1000, description: 'Amount to invest in USD' })
  @IsNumber()
  @Min(1)
  amount: number;
}


















