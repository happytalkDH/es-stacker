import Client from '@elastic/elasticsearch/lib/client';
import { Config } from './interface/config';
import { ChunkInfo } from './interface/chunkInfo';
import { EsData } from './interface/esItem';
import { Cursor } from './type/cursor';
import { BulkType } from './enum/bulkType';
import { EsErrors } from './enum/esErrors';
import { Events } from './enum/events';
import { EventEmitter } from 'events';
import { Helper } from './libraries/helper';

export default abstract class Stacker {
  protected readonly elasticSearchClient: Client;
  protected readonly config: Config;
  protected readonly eventEmitter: EventEmitter;
  private cursor: Cursor;

  protected constructor(config: Config) {
    this.elasticSearchClient = config.elasticSearchClient;
    this.config = config;
    this.eventEmitter = new EventEmitter();
  }

  public async main() {
    const latestCursor = await this.getCursorCache();
    await this.setCursor(latestCursor, false);

    this.emit(Events.STARTUP, `latest Cursor: ${JSON.stringify(latestCursor)}`);

    while (Infinity) {
      try {
        const chunkInfo = await this.execChunk();
        if (chunkInfo) this.emit(Events.EXECUTED_CHUNK, chunkInfo);
      } catch (e) {
        this.emit(Events.UNCAUGHT_ERROR, e);
        console.error(e);
      }
      await this.delay(this.config.chunkDelay);
    }
  }

  public on(eventName: string | symbol, listener: (...args: any[]) => void) {
    return this.eventEmitter.on(eventName, listener);
  }

  protected async execChunk(): Promise<ChunkInfo> {
    const currentCursor = this.getCursor();
    const latestCursor = await this.getLatestCursor();

    if (JSON.stringify(currentCursor) === JSON.stringify(latestCursor))
      return this.emit(Events.SKIPPED_CHUNK, 'cursor is not changed');

    const items = await this.getItems(currentCursor, latestCursor);

    if (!items.length)
      return this.emit(Events.SKIPPED_CHUNK, 'not found items');

    const latestCursorByItems = this.getLatestCursorByItems(items);

    if (await this.syncItems(items)) await this.setCursor(latestCursorByItems);

    return {
      cursor: {
        current: currentCursor,
        latest: latestCursor,
        latestItems: latestCursorByItems,
      },
      items: items,
    };
  }

  protected abstract getCursorCache(): Promise<Cursor>;
  protected abstract setCursorCache(cursor: Cursor): Promise<boolean>;

  protected getCursor() {
    return this.cursor;
  }

  private async setCursor(
    latestCursor: Cursor,
    setCache = true,
  ): Promise<boolean> {
    if (JSON.stringify(this.getCursor()) === JSON.stringify(latestCursor))
      return true;

    this.cursor = latestCursor;
    return setCache ? await this.setCursorCache(latestCursor) : true;
  }

  /**
   * get storage latest ID
   */
  protected abstract getLatestCursor(): Promise<Cursor>;

  protected abstract getItems(
    startCursor: Cursor,
    endCursor: Cursor,
  ): Promise<EsData[]>;

  protected abstract getLatestCursorByItems(items: EsData[]): Cursor;

  protected async syncItems(items: EsData[]): Promise<boolean> {
    const bulk = [];

    items.forEach((item) => {
      switch (item.type) {
        case BulkType.VERSIONED_DOCUMENT:
          bulk.push({
            index: {
              _index: item.metadata.index,
              _id: item.metadata.id,
              version_type: item.metadata.versionType,
              version: item.metadata.version,
            },
          });
          bulk.push(item.source);
          break;
        case BulkType.DELETE_DOCUMENT:
          bulk.push({
            delete: {
              _index: item.metadata.index,
              _id: item.metadata.id,
            },
          });
          break;
      }
    });

    const bulkResponse = await this.elasticSearchClient.bulk({
      body: bulk,
      refresh: 'wait_for',
    });

    let isFail = false;
    if (bulkResponse?.errors) {
      isFail = true;

      if (bulkResponse?.items?.filter) {
        const errors = bulkResponse.items.filter((action) => {
          const operation = Object.keys(action)[0];
          return (
            action[operation]?.errors && !Stacker.isIgnore(action[operation])
          );
        });
        isFail = errors.length > 0;

        this.emit(
          isFail ? Events.BULK_ERROR : Events.BULK_ERROR_IGNORED,
          bulkResponse,
        );
      } else {
        this.emit(Events.BULK_ERROR, bulkResponse);
      }
    }

    return !isFail;
  }

  private async delay(delay: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, delay);
    });
  }

  private static isIgnore(action: Record<string, any>): boolean {
    //const status = action?.status ?? 0;
    const errorType = action?.error?.type;

    switch (errorType) {
      case EsErrors.VERSION_CONFLICT_ENGINE_EXCEPTION: // status: 409
      case EsErrors.INDEX_NOT_FOUND_EXCEPTION: // status: 404
        return true;
      default:
        return false;
    }
  }

  private emit(event: Events, arg: any): null {
    this.eventEmitter.emit(event, arg);
    return null;
  }
}

(async () => {
  while (Infinity) {
    await Helper.delay(1000);
    console.log('test');
  }
})();
