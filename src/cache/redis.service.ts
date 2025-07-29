import { Logger } from '@nestjs/common';
import { SetOptions } from '@redis/client';
import { injectable } from 'inversify';
import { createClient } from 'redis';
import { appConfig } from '../config';

@injectable()
export class RedisService {
  private readonly logger = new Logger('RedisService');
  private readonly redis = createClient({
    url: appConfig.redisUrl,
  });

  constructor() {
    this.connect();
  }

  async connect() {
    try {
      await this.redis.connect();
      this.logger.log('Successfully connected to Redis');
    } catch (err) {
      this.logger.error("Can't connect to Redis:");
      this.logger.error(err);
      throw err;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async set(key: string, value: Record<string, any>, options?: SetOptions) {
    const json = JSON.stringify(value);

    return this.redis.set(key, json, options);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async get<T extends Record<string, any>>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);

    if (value === null) {
      return null;
    }

    return JSON.parse(value);
  }

  async delete(key: string) {
    return this.redis.del(key);
  }
}
