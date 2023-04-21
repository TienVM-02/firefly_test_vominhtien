import { ApiProperty } from '@nestjs/swagger';

export class Coordinate {
  @ApiProperty()
  public lattitude: number;
  @ApiProperty()
  public longitude: number;
}

export class UpdateUserDTO {
  @ApiProperty({ nullable: true, default: '' })
  firstname: string;

  @ApiProperty({ nullable: true, default: '' })
  lastname: string;

  @ApiProperty()
  age: number;

  @ApiProperty({ nullable: true })
  coordinate: Coordinate;
}
