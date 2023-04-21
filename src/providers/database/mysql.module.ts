import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Admin123@',
      database: 'db_test_firefly',
      entities: [__dirname + '/../../modules/**/*.entity.{ts,js}'],
      synchronize: true,
      logging: false,
      legacySpatialSupport: false,
    }),
  ],
})
export class MySQLModule {}
