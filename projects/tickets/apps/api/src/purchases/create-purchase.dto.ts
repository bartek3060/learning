import { IsInt, Max, Min } from 'class-validator';

export class CreatePurchaseDto {
  @IsInt()
  @Min(1)
  @Max(10)
  quantity!: number;
}
