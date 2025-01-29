//
// Copyright (c) 2025 ZettaScale Technology
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0, or the Apache License, Version 2.0
// which is available at https://www.apache.org/licenses/LICENSE-2.0.
//
// SPDX-License-Identifier: EPL-2.0 OR Apache-2.0
//
// Contributors:
//   ZettaScale Zenoh Team, <zenoh@zettascale.tech>
//

import { ZBytes, ZBytesSerializer, ZBytesDeserializer, ZSerializeable, ZDeserializeable, zserialize, zdeserialize, ZArrayType, ZPrimitiveType, ZMapType, ZObjectType } from "@eclipse-zenoh/zenoh-ts";


class MyStruct implements ZSerializeable, ZDeserializeable {
    v1: bigint;
    v2: string;
    v3: number[];

    constructor(v1?: bigint, v2?: string, v3?: number[]) {
        if (typeof v1 !== `undefined`) {
            this.v1 = v1;
        }
        if (typeof v2 !== `undefined`) {
            this.v2 = v2;
        }
        if (typeof v3 !== `undefined`) {
            this.v3 = v3;
        }
    }
    serialize_with_zserializer(serializer: ZBytesSerializer): void {
        serializer.serialize(this.v1)
        serializer.serialize(this.v2)
        serializer.serialize(this.v3)
    }
    deserialize_with_zdeserializer(deserializer: ZBytesDeserializer): void {
        this.v1 = deserializer.deserialize(ZPrimitiveType.BigInt)
        this.v2 = deserializer.deserialize(ZPrimitiveType.String)
        this.v3 = deserializer.deserialize(ZArrayType.create(ZPrimitiveType.Number))
    }

    to_string(): string {
        return JSON.stringify(this, (_, v) => typeof v === 'bigint' ? v.toString() : v)
    }

}

export async function main() {
    // using raw data
    // string
    {
        let input = "test"
        let payload = new ZBytes(input)
        let output = payload.to_string()
        console.log(`Input: ${input}, Output: ${output}`)
    }

    // Uint8Array
    {
        let input = new Uint8Array([1, 2, 3, 4])
        let payload = new ZBytes(input)
        let output = payload.to_bytes()
        console.log(`Input: ${input}, Output: ${output}`)
    }

    // serialization
    // array
    {
        let input = [0.5, 1.0, 3.0, 5.5]
        let payload = zserialize(input)
        let output = zdeserialize(ZArrayType.create(ZPrimitiveType.Number), payload)
        console.log(`Input: ${input}, Output: ${output}`)
    }

    // serialization
    // map
    {
        let input = new Map<bigint, string>()
        input.set(0n, "abc")
        input.set(1n, "def")
        let payload = zserialize(input)
        let output = zdeserialize(ZMapType.create(ZPrimitiveType.BigInt, ZPrimitiveType.String), payload)
        console.log(`Input:`)
        console.table(input)
        console.log(`Output:`)
        console.table(output)
    }

    // Custom serialization / deserialization
    {
        let input = new MyStruct(1234n, "test", [1, 2, 3, 4])
        let payload = zserialize(input)
        let output: MyStruct = zdeserialize(ZObjectType.create(new MyStruct), payload)
        console.log(`Input: ${input.to_string()}, Output: ${output.to_string()}`)
    }
}

main();