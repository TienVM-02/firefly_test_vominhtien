import { GoongMapConfigService } from './config.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import * as Joi from 'joi';

/**
 * Import and provide app configuration related classes.
 *
 * @module
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        GOONG_API_KEY: Joi.string().required(),
        GOONG_HOST: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, GoongMapConfigService],
  exports: [ConfigService, GoongMapConfigService],
})
export class GoongMapConfigModule {}
