/**
 * Union Type to convert various primitives and containers into ZBytes
 */
export type IntoZBytes =
  | ZBytes
  | Uint8Array
  | number[]
  | Array<number>
  | String
  | string
  | boolean;

/**
 * Class to represent an Array of Bytes received from Zenoh
 */
export class ZBytes {
  private buffer: Uint8Array;

  private constructor(buffer: Uint8Array) {
    this.buffer = buffer;
  }

  /**
  * returns the length of the ZBytes buffer
  * 
  * @returns number
  */
  len(): number {
    return this.buffer.length;
  }

  /**
   * returns an empty ZBytes buffer
   * 
   * @returns ZBytes
   */
  empty(): ZBytes {
    return new ZBytes(new Uint8Array());
  }

  /**
   * return the underlying Uint8Array buffer
   * 
   * @returns Uint8Array
   */
  payload(): Uint8Array {
    return this.buffer
  }

  /**
 * Deserialize the unit8array buffer into the desired type
 * 
 * @returns Uint8Array
 */
  // deserialize<T>(d: Deserialize<T>): T {
  //   return d.deserialize(this.buffer);
  // }

  deserialize<T>(func: (buffer: Uint8Array) => T): T {
    return func(this.buffer);
  }

  /**
   * new function to create a ZBytes 
   * 
   * @returns ZBytes
   */
  static new(bytes: IntoZBytes): ZBytes {
    if (bytes instanceof ZBytes) {
      return bytes;
    } else if (bytes instanceof String || typeof bytes === "string") {
      const encoder = new TextEncoder();
      const encoded = encoder.encode(bytes.toString());
      return new ZBytes(encoded);
    } else if (typeof bytes === "boolean") {
      return new ZBytes(Uint8Array.from([bytes === true ? 1 : 0]));
    } else {
      return new ZBytes(Uint8Array.from(bytes));
    }
  }
}

/**
 * Convienence class to convert Zbytes to a string
 * 
 * @returns bool
 */
export function deserialize_bool(buffer: Uint8Array): boolean {
  if (buffer.length != 1) {
    throw "Boolean Deserialization Failed buffer length excepted 1";
  }
  switch (buffer[0]) {
    case 0:
      return false
    case 1:
      return true
    default:
      throw "Boolean Deserialization Failed expected value 0 or 1";
  }
}

/**
 * Convienence class to convert Zbytes to a Unsigned Integer
 * 
 * @returns number | bigint
 */
export function deserialize_uint(buffer: Uint8Array): number | bigint {
  let buff_length = buffer.length;

  if (buffer.length > 8) {
    throw "Unsigned Integer Deserialization Failed buffer length excepted < 8 bytes, actual : " + buffer.length;
  }

  let padded = new Uint8Array(8);
  padded.set(buffer, 0)

  const data_view = new DataView(padded.buffer, padded.byteOffset, padded.byteLength);
  if (buff_length > 4) {
    return data_view.getBigUint64(0, true);
  } else if (buff_length > 2) {
    return data_view.getUint32(0, true);
  } else if (buff_length > 1) {
    return data_view.getUint16(0, true);
  } else {
    return data_view.getUint8(0);
  }
}


/**
 * Convienence class to convert Zbytes to a Signed Integer
 * 
 * @returns number | bigint
 */
export function deserialize_int(buffer: Uint8Array): number | bigint {
  let buff_length = buffer.length;

  if (buffer.length > 8) {
    throw "Signed Integer Deserialization Failed buffer length excepted < 8 bytes, actual : " + buffer.length;
  }

  let padded = new Uint8Array(8);
  padded.set(buffer, 0)

  const data_view = new DataView(padded.buffer, padded.byteOffset, padded.byteLength);
  if (buff_length > 4) {
    return data_view.getBigInt64(0, true);
  } else if (buff_length > 2) {
    return data_view.getInt32(0, true);
  } else if (buff_length > 1) {
    return data_view.getInt16(0, true);
  } else {
    return data_view.getInt8(0);
  }
}

/**
 * Convienence class to convert Zbytes to a Signed Integer
 * 
 * @returns number
 */
export function deserialize_float(buffer: Uint8Array): number {
  let buff_length = buffer.length;

  if (buffer.length > 8) {
    throw "Floating Point Deserialization Failed buffer length excepted < 8 bytes, actual : " + buffer.length;
  }

  let padded = new Uint8Array(8);
  padded.set(buffer, 0)

  const data_view = new DataView(padded.buffer, padded.byteOffset, padded.byteLength);
  if (buff_length > 4) {
    return data_view.getFloat64(0, true);
  } else {
    return data_view.getFloat32(0, true);
  }
}

/**
 * Convienence class to convert Zbytes to a string
 * 
 * @returns string
 */

export function deserialize_string(buffer: Uint8Array): string {
  let decoder = new TextDecoder();
  return decoder.decode(buffer)
}
