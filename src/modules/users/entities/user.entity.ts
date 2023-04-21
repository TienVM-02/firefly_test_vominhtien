import { GeometryTransformer } from 'src/common/types/geometryTransformer';
import { BaseEntity } from 'src/modules/base/base.entity';
import { Column, Entity } from 'typeorm';
import { Point } from 'geojson';
import { Min, Max } from 'class-validator';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @Min(1)
  @Max(100)
  age: number;

  @Column({
    name: 'Coordinate',
    type: 'geometry',
    spatialFeatureType: 'Point',
    transformer: new GeometryTransformer(),
  })
  coordinate: Point;
}
