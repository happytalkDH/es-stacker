import 'dotenv/config';
import { ENV, isDevEnv } from '../env';
import { mysql } from './module/mysql';
import { MysqlConfig } from '../example/config/mysql';

export const moblieCsMasterConfig: MysqlConfig = {
    host: ENV.HT_RDB.MASTER.HOST ?? 'localhost',
    port: ENV.HT_RDB.MASTER.PORT ?? 3306,
    database: ENV.HT_RDB.MASTER.DATABASE ?? 'mobile_cs',
    user: ENV.HT_RDB.MASTER.USERNAME ?? 'user',
    password: ENV.HT_RDB.MASTER.PASSWORD ?? 'user@votmdnjem',
    timezone: ENV.MYSQL_TIMEZONE ?? 'Asia/Seoul',
    charset: ENV.HT_RDB.MASTER.PASSWORD ?? 'user@votmdnjem',
    connectionLimit: parseInt(process.env?.CONNECTION_LIMIT || '10', 10),
    queueLimit: parseInt(process.env?.QUEUE_LIMIT || '0', 10),
    namedPlaceholders: false,
};

export const moblieCsSlaveConfig: MysqlConfig = {
    host: ENV.HT_RDB.,
    port: parseInt(process.env?.MYSQL_PORT || '3306', 10),
    database: process.env?.MYSQL_DATABASE,
    user: process.env?.MYSQL_USER,
    password: process.env?.MYSQL_PASSWORD,
    timezone: process.env?.MYSQL_TIMEZONE as TimeZone,
    charset: process.env?.MYSQL_CHARSET ?? 'utf8mb4',
    connectionLimit: parseInt(process.env?.CONNECTION_LIMIT || '10', 10),
    queueLimit: parseInt(process.env?.QUEUE_LIMIT || '0', 10),
    namedPlaceholders: false,
};

export async function happytalkRepositoryConnectionHandler() {
    try {
        await mysql.connect(htMysqlConfig);
    } catch (e) {
        console.error(e);
    }
}


(async () => {
    try {
        console.log(`start`);
        const dummyStore = new DummyStore();
        await dummyStore.connect(mysqlConfig);

        console.log(`append ${dummyCount} items`);
        await dummyStore.appendDummyData(dummyCount);

        await dummyStore.disconnect();
        console.log(`complete`);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
