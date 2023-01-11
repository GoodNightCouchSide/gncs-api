import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import EventFactory from 'Database/factories/EventFactory'

test.group('Events', (group) => {
  // We use the Database global transactions to have a clean database state in-between tests.
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    await EventFactory.createMany(2)

    return () => Database.rollbackGlobalTransaction()
  })

  test('get a list of events', async ({ client, assert }) => {
    const response = await client.get('/api/events')
    response.assertStatus(200)
    assert.isTrue(response.body().success)
    assert.lengthOf(response.body().events, 2)
  })
})
