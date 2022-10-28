import { Connection, createConnection } from 'mysql2/promise';

export interface MysqlConfig {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    timezone: string;
    charset: string;
    connectionLimit: number;
    queueLimit: number;
    namedPlaceholders: boolean;
}

export class mysql {
    private conaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaan: Connection;

    public async connect(mysqlConfig: MysqlConfig) {
        try {
            this.conn = await createConnection({
                host: mysqlConfig.host,
                port: mysqlConfig.port,
                database: mysqlConfig.database,
                user: mysqlConfig.user,
                password: mysqlConfig.password,
                timezone: mysqlConfig.timezone,
            });
        } catch (e) {
            console.error(e);
        }
    }

    public async disconnect() {
        try {
            await this.conn.end();
        } catch (e) {
            console.error(e);
        }
    }

}
