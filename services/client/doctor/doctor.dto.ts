import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSpecializationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
