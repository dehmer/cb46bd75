import assert from 'assert'
import { Writable } from 'stream'
import { pipeline } from 'stream/promises'
import { AbstractLevel, AbstractIterator } from "abstract-level"
import { MemoryLevel } from 'memory-level'
import { EntryStream } from "level-read-stream"
import * as R from 'ramda'
import uuid from 'uuid-random'

/**
 * Custom iterator.
 */
class DelegatingIterator extends AbstractIterator {
  constructor(db, iterator, options) {
    super(db, options)
    this.db = db
    this.iterator = iterator
  }

  _next = () => this.iterator.next()
}

/**
 * Custom abstract level (using custom iterator).
 * Overrides only _batch and _iterator.
 */
class DelegatingLevel extends AbstractLevel {
  constructor (db) {
    const encodings = { buffer: true, utf8: true }
    const manifest = { encodings, getMany: false }
    const options = { valueEncoding: 'json' }
    super(manifest, options)
    this.db = db
  }

  _batch = operations => this.db.batch(operations)

  _iterator (options) {
    // iterator :: MemoryIterator
    const iterator = this.db.iterator(options)
    return new DelegatingIterator(this, iterator, options)
  }
}

const expected = 100 // entries
const operations = R
  .range(0, expected)
  .map(() => ({ type: 'put', key: uuid(), value: uuid() }))

const populatedDB = async () => {
  const memoryLevel = new MemoryLevel({ valueEncoding: 'json' })
  const db = new DelegatingLevel(memoryLevel)
  await db.batch(operations)
  return db
}

describe('EntryStream', function () {

  it('[iterator] all', async function () {
    const db = await populatedDB()

    const entries = await db.iterator().all()
    const actual = entries.length
    assert.strictEqual(actual, expected)
  })

  it('[iterator] for/await', async function () {
    const db = await populatedDB()

    const acc = []
    for await (const entry of db.iterator()) acc.push(entry)
    const actual = acc.length
    assert.strictEqual(actual, expected)
  })


  it.skip('[EntryStream] pipeline', async function () {
    const db = await populatedDB()

    let actual = 0
    const writable = new Writable({
      write (chunk, _, next) {
        console.log('[writable]', chunk)
        actual++
        next()
      }
    })

    // FIXME: times out.
    await pipeline(new EntryStream(db), writable)
    assert.strictEqual(actual, expected)
  })

  /**
   * data/end event handlers won't get called.
   */
  it.skip('[EntryStream] events', async function () {
    const db = await populatedDB()

    // FIXME: times out.
    const entries = await new Promise(resolve => {
      const acc = []
      new EntryStream(db)
        .on('data', entry => acc.push(entry))
        .on('data', entry => console.log('[stream]', entry))
        .on('end', () => resolve(acc))
    })

    const actual = entries.length
    assert.strictEqual(actual, expected)
  })
})