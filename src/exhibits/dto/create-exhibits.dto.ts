import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateExhibitsDto {
  @ApiProperty({ example: 'post description' })
  @IsString()
  @IsNotEmpty({ message: "Опис не може бути порожнім" })
  description: string;
}