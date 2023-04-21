import { ApiProperty } from '@nestjs/swagger';

export class idFilter {
  @ApiProperty()
  id: string;
}

export class nameFilter {
  @ApiProperty()
  name: string;
}

export class locateFilter {
  @ApiProperty()
  id: string;

  @ApiProperty()
  n: number;
}
