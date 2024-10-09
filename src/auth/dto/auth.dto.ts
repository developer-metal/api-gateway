import { ApiProperty } from '@nestjs/swagger';
export class Auth {
  @ApiProperty()
  code: number;

  @ApiProperty()
  uptime: number;

  @ApiProperty()
  date: string;

  @ApiProperty()
  message: string;
}
