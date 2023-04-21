import { GeometryTransformer } from 'src/common/types/geometryTransformer';
import { Column } from 'typeorm';
import { Point } from 'geojson';

export class ResDistanceUser {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @Column({
    name: 'Coordinate',
    type: 'geometry',
    spatialFeatureType: 'Point',
    transformer: new GeometryTransformer(),
  })
  coordinate: Point;

  @Column()
  distance: number;
}
