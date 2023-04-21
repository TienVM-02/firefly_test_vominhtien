import { registerAs } from '@nestjs/config';

export default registerAs('goong-map', () => ({
  APIKey: process.env.GOONG_API_KEY,
  host: process.env.GOONG_HOST,
}));
