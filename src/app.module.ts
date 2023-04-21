import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MySQLModule } from './providers/database/mysql.module';
import { UserModule } from './modules/users/user.module';
import { GoongMapConfigModule } from './config/goong-map/config.module';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    MySQLModule,
    UserModule,
    GoongMapConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
