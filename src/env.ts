import * as dotenv from 'dotenv';
import { MbiSecret } from './libraries/mbiSecret';

dotenv.config();

const mbiSecret = new MbiSecret(
  process.env.SECRET_PATH ?? '/home/secret/mbi_secret.ini',
);
const NODE_ENV = process.env.NODE_ENV ?? 'development';

export const isDevEnv = NODE_ENV === 'development';
export const ENV = {
  NODE_ENV: NODE_ENV,
  PORT: parseInt(process.env.PORT, 10) ?? 3000,
  TRUST_PROXIES:
    process.env?.TRUST_PROXIES?.split(',').map((ip) => ip.replace(/\s/g, '')) ??
    [],
  HT_DB_SALT_KEY: process.env.HT_DB_SALT_KEY // 해피톡 DB salt key
    ? mbiSecret.decrypt(process.env.HT_DB_SALT_KEY)
    : '',
  HAPPYTALK_CERTIFICATION: process.env.HAPPYTALK_CERTIFICATION
    ? mbiSecret.decrypt(process.env.HAPPYTALK_CERTIFICATION)
    : '',
  HT_MQ_BROKER: {
    HOST: process.env?.HT_MQ_HOST ?? 'https://dev-broker.happytalk.io',
    USER_NAME: process.env?.HT_MQ_BROKER_USER
      ? mbiSecret.decrypt(process.env.HT_MQ_BROKER_USER)
      : null,
    PASSWORD: process.env?.HT_MQ_BROKER_PASSWORD
      ? mbiSecret.decrypt(process.env.HT_MQ_BROKER_PASSWORD)
      : null,
  },
  HT_RDB: {
    LOGGING: process.env.HT_RDB_LOGGING === 'true',
    RETRY_ATTEMPTS: Infinity,
    RETRY_DELAY: 1000,
    CHARSET: process.env.HT_RDB_CHARSET ?? 'utf8mb4_general_ci',
    MASTER: {
      HOST: process?.env?.DB_MOBILE_CS_CUD_HOST
        ? mbiSecret.decrypt(process.env.DB_MOBILE_CS_CUD_HOST)
        : 'localhost',
      PORT: process?.env?.DB_MOBILE_CS_CUD_PORT
        ? parseInt(mbiSecret.decrypt(process.env.DB_MOBILE_CS_CUD_PORT), 10)
        : 3306,
      USERNAME: process?.env?.DB_MOBILE_CS_CUD_USER
        ? mbiSecret.decrypt(process.env.DB_MOBILE_CS_CUD_USER)
        : 'user',
      PASSWORD: process?.env?.DB_MOBILE_CS_CUD_PASSWORD
        ? mbiSecret.decrypt(process.env.DB_MOBILE_CS_CUD_PASSWORD)
        : 'password',
      DATABASE: process?.env?.DB_MOBILE_CS_CUD_DATABASE
        ? mbiSecret.decrypt(process.env.DB_MOBILE_CS_CUD_DATABASE)
        : 'database',
    },
    SLAVES: [
      {
        HOST: process?.env?.DB_MOBILE_CS_READ_HOST
          ? mbiSecret.decrypt(process.env.DB_MOBILE_CS_READ_HOST)
          : 'localhost',
        PORT: process?.env?.DB_MOBILE_CS_READ_PORT
          ? parseInt(mbiSecret.decrypt(process.env.DB_MOBILE_CS_READ_PORT), 10)
          : 3306,
        USERNAME: process?.env?.DB_MOBILE_CS_READ_USER
          ? mbiSecret.decrypt(process.env.DB_MOBILE_CS_READ_USER)
          : 'user',
        PASSWORD: process?.env?.DB_MOBILE_CS_READ_PASSWORD
          ? mbiSecret.decrypt(process.env.DB_MOBILE_CS_READ_PASSWORD)
          : 'password',
        DATABASE: process?.env?.DB_MOBILE_CS_READ_DATABASE
          ? mbiSecret.decrypt(process.env.DB_MOBILE_CS_READ_DATABASE)
          : 'database',
      },
    ],
    MYSQL_TIMEZONE: process.env.MYSQL_TIMEZONE ?? 'Asia/Seoul',
    MYSQL_CHARSET: process.env.MYSQL_CHARSET ?? 'utf8mb4',
  },
};
