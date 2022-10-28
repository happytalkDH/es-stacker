export class TypeConverter {
  static boolToYn(flag, defaultValue = null): string {
    if (flag === undefined || flag === null) return defaultValue;
    return flag ? 'Y' : 'N';
  }

  static boolToInt(flag, defaultValue = null): number {
    if (flag === undefined || flag === null) return defaultValue;
    return flag ? 1 : 0;
  }

  static nullToEmptyString(value): string {
    return value === null ? '' : value;
  }

  static bigint(value): bigint {
    try {
      return BigInt(value);
    } catch (e) {
      return null;
    }
  }

  static stringToTimestamp(value: string): number {
    return new Date(value).getTime() || null;
  }

  static getKeyByValue(object: object, value: any): any {
    return Object.keys(object).find((key) => object[key] === value);
  }
}
