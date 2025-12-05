import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, Min } from 'class-validator';

export class AddPerformanceDto {
  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  @IsDateString()
  periodStart: string;

  @ApiProperty({ example: '2024-01-31T23:59:59Z' })
  @IsDateString()
  periodEnd: string;

  @ApiProperty({ example: 850.5, description: 'Utilization in capacity units' })
  @IsNumber()
  @Min(0)
  utilizationValue: number;

  @ApiProperty({ example: 5000, description: 'Gross revenue in USD' })
  @IsNumber()
  @Min(0)
  grossRevenue: number;

  @ApiProperty({ example: 500, description: 'Operating expenses in USD', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  expenses?: number;
}


















