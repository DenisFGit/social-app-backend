import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'test' })
  text: string;
}