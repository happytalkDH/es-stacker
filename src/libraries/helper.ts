import * as fs from 'fs';

export class Helper {
  static async delay(delayMs): Promise<void> {
    return await new Promise((resolve) => {
      setTimeout(() => resolve(), delayMs);
    });
  }

  static getMbiSecretKey(key: string): string {
    const contents = fs.readFileSync(
      process.env.SECRET_PATH ?? '/home/secret/mbi_secret.ini',
      { encoding: 'utf8' },
    );
    const regex = new RegExp(`${key}[\\s]*=[\\s]*([^\\r\\n\\s]+)`, 'm');
    const matches = contents.match(regex);
    return matches?.[1] ?? null;
  }

  static bufferToString(bufferItems: Uint8Array): string {
    return bufferItems ? Buffer.concat([bufferItems]).toString('utf-8') : null;
  }
}
