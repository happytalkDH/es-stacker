import * as fs from 'fs';
import * as cryptoJS from 'crypto-js';

type DecConfig = {
  iv: cryptoJS.lib.WordArray;
};

export class MbiSecret {
  private readonly secretKey: string;
  private passKey: cryptoJS.lib.WordArray;
  private decKey: DecConfig;

  constructor(secretPath: string) {
    this.secretKey = MbiSecret.getSecretKey(secretPath);
    this.passKey = MbiSecret.get32ByteKey(this.secretKey);
    this.decKey = MbiSecret.getDecConfig();
  }

  private static getSecretKey(secretPath: string): string | undefined {
    const contents = fs.readFileSync(secretPath, { encoding: 'utf8' });
    const matches = contents.match(
      /ENCRYPT_KEY_CONFIG[\s]*=[\s]*([^\r\n\s]+)/m,
    );

    return matches[1] ?? undefined;
  }

  private static get32ByteKey(key: string): cryptoJS.lib.WordArray {
    const maxLength = 32;
    const keyLength = key.length;
    return cryptoJS.enc.Utf8.parse(
      maxLength - keyLength > 0
        ? key.padEnd(maxLength, String.fromCharCode(0))
        : key.slice(0, maxLength),
    );
  }

  private static getDecConfig(): DecConfig {
    return { iv: cryptoJS.enc.Utf8.parse(String.fromCharCode(0).repeat(16)) };
  }

  private static getDecKeyFromAES(encryptedValue: string) {
    return cryptoJS.lib.CipherParams.create({
      ciphertext: cryptoJS.enc.Base64.parse(encryptedValue),
      formatter: cryptoJS.format.OpenSSL,
    });
  }

  decrypt(encryptedValue): string {
    return cryptoJS.AES.decrypt(
      MbiSecret.getDecKeyFromAES(encryptedValue),
      this.passKey,
      this.decKey,
    ).toString(cryptoJS.enc.Utf8);
  }

  encrypt(value: string, secretKey?: string, useBase64Encode = true): string {
    this.passKey = secretKey ? MbiSecret.get32ByteKey(secretKey) : this.passKey;
    const encryptValue = cryptoJS.AES.encrypt(
      value,
      this.passKey,
      MbiSecret.getDecConfig(),
    ).toString(cryptoJS.format.OpenSSL);

    return useBase64Encode
      ? cryptoJS.enc.Base64.stringify(cryptoJS.enc.Utf8.parse(encryptValue))
      : encryptValue;
  }
}
