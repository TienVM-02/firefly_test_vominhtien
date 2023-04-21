import { ApiProperty } from '@nestjs/swagger';

export class Coordinate {
  @ApiProperty()
  public lattitude: number;
  @ApiProperty()
  public longitude: number;
}

export class CreateUserDTO {
  @ApiProperty({ default: '' })
  firstname: string;

  @ApiProperty({ default: '' })
  lastname: string;

  @ApiProperty()
  age: number;

  @ApiProperty()
  coordinate: Coordinate;
}
