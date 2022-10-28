import 'dotenv/config';
import '../env';
import { ENV, isDevEnv } from '../env';
// import { happytalkRepositoryConnectionHandler } from './repositories/happytalk/happytalk.module';
// import { mysqlConfig } from './config/mysql';
// import { DummyStore } from './module/dummyStore';
// const dummyCount = parseInt(process.env?.DUMMY_COUNT ?? '100000', 10);

(async () => {
  try {
    console.log(`start_test`);
    console.log(ENV);
    console.log(isDevEnv);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();

