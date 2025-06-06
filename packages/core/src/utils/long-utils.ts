import { CustomMap, CustomSet, typed } from '@fuman/utils'
import Long from 'long'

import { getRandomInt } from './misc-utils.js'

/**
 * Get a random Long
 *
 * @param unsigned  Whether the number should be unsigned
 */
export function randomLong(unsigned = false): Long {
    const lo = getRandomInt(0xFFFFFFFF)
    const hi = getRandomInt(0xFFFFFFFF)

    return new Long(lo, hi, unsigned)
}

/**
 * Read a Long from a buffer
 *
 * @param buf  Buffer to read from
 * @param unsigned  Whether the number should be unsigned
 * @param le  Whether the number is little-endian
 */
export function longFromBuffer(buf: Uint8Array, unsigned = false, le = true): Long {
    const dv = typed.toDataView(buf)

    if (le) {
        return new Long(dv.getInt32(0, true), dv.getInt32(4, true), unsigned)
    }

    return new Long(dv.getInt32(4, false), dv.getInt32(0, false), unsigned)
}

/**
 * Remove a Long from an array
 *
 * @param arr  Array to remove from
 * @param val  Value to remove
 */
export function removeFromLongArray(arr: Long[], val: Long): boolean {
    for (let i = 0; i < arr.length; i++) {
        const v = arr[i]

        // v === val for the case when the exact same object was passed
        if (v === val || v.eq(val)) {
            arr.splice(i, 1)

            return true
        }
    }

    return false
}

/**
 * Compare two Longs and return -1, 0 or 1,
 * to be used as a comparator function.
 */
export function compareLongs(a: Long, b: Long): number {
    if (a.eq(b)) return 0

    if (a.gt(b)) return 1

    return -1
}

/**
 * Serialize a Long (int64) to its fast string representation:
 * `$high|$low`.
 *
 * This method is about 500* times faster than using `Long.toString()`,
 * and very useful when the string will only ever be used internally
 * (e.g. for keying a map)
 *
 * _\* benchmark result, YMMV_
 *
 * @param val
 */
export function longToFastString(val: Long): string {
    return `${val.low}|${val.high}`
}

/**
 * Parse a Long (int64) from its fast string representation:
 * `$high|$low`.
 *
 * This method is about 2 times faster than using Long.fromString.
 *
 * @param val
 * @param unsigned
 */
export function longFromFastString(val: string, unsigned = false): Long {
    const parts = val.split('|')

    if (parts.length !== 2) throw new Error(`Invalid long fast string: ${val}`)
    const low = Number.parseInt(parts[0])
    const high = Number.parseInt(parts[1])

    if (Number.isNaN(low) || Number.isNaN(high)) {
        throw new TypeError(`Invalid long fast string: ${val}`)
    }

    return new Long(low, high, unsigned)
}

/**
 * Map with Longs as key.
 *
 * Uses fast string representation internally.
 */
export class LongMap<V> extends CustomMap<Long, string, V> {
    constructor() {
        super(longToFastString, longFromFastString)
    }
}

/**
 * Set for Longs.
 *
 * Uses fast string representation internally
 */
export class LongSet extends CustomSet<Long, string> {
    constructor() {
        super(longToFastString, longFromFastString)
    }
}
