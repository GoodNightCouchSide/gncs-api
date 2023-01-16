import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import EventFactory from 'Database/factories/EventFactory'
import VenueFactory from 'Database/factories/VenueFactory'
import UserFactory from 'Database/factories/UserFactory'

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

    const events = response.body().events
    assert.lengthOf(events, 2)
    assert.properties(events[0], [
      'id',
      'title',
      'description',
      'cover',
      'pre_payment',
      'box_office',
      'venue_id',
      'links',
      'creator_email',
      'is_public',
      'created_at',
      'updated_at',
    ])
  })

  test('get one event', async ({ client, assert }) => {
    const allEvents = await client.get('/api/events')
    const { id } = allEvents.body().events[0]

    const eventResponse = await client.get(`/api/events/${id}`)
    eventResponse.assertStatus(200)
    assert.isTrue(eventResponse.body().success)

    assert.properties(eventResponse.body().event, [
      'id',
      'title',
      'description',
      'cover',
      'pre_payment',
      'box_office',
      'venue_id',
      'links',
      'creator_email',
      'is_public',
      'created_at',
      'updated_at',
    ])
  })

  test('get a non-existing event', async ({ client }) => {
    const eventResponse = await client.get('/api/events/e25264cc-7a89-420d-bb74-23c4162b3616')
    eventResponse.assertStatus(404)
  })

  test('create an event', async ({ client, assert }) => {
    const venue = await VenueFactory.create()
    const user = await UserFactory.create()

    const response = await client.post('/api/events').json({
      title: 'testEvent',
      description: 'description of testEvent',
      cover: 'https://link-to-cover.de',
      pre_payment: '33 Euro',
      box_office: '34',
      links: 'https://www.test-location.de',
      alternative_address: 'test',
      creator_email: user.email,
      venue_id: venue.id,
    })
    assert.isTrue(response.body().success)
    assert.properties(response.body().event, [
      'id',
      'title',
      'description',
      'cover',
      'pre_payment',
      'box_office',
      'venue_id',
      'alternative_address',
      'links',
      'is_public',
      'creator_email',
      'created_at',
      'updated_at',
    ])
  })

  test('create basic event', async ({ client, assert }) => {
    const response = await client.post('/api/events').json({
      title: 'testEvent',
    })
    assert.isTrue(response.body().success)
    assert.properties(response.body().event, [
      'id',
      'title',
      'is_public',
      'created_at',
      'updated_at',
    ])
  })

  test('create an event without title', async ({ client, assert }) => {
    const response = await client.post('/api/events').json({
      description: 'test event description',
    })
    assert.equal(response.status(), 400)
    response.assertBody({
      flashToSession: false,
      messages: {
        errors: [
          {
            field: 'title',
            message: 'title is required to create an event',
            rule: 'required',
          },
        ],
      },
    })
  })

  test('create an event that title is not unique', async ({ client, assert }) => {
    const eventBody = {
      title: 'testEvent',
    }
    const response1 = await client.post('/api/events').json(eventBody)
    assert.isTrue(response1.body().success)
    const response2 = await client.post('/api/events').json(eventBody)
    assert.equal(response2.status(), 400)
    response2.assertBody({
      flashToSession: false,
      messages: {
        errors: [
          {
            field: 'title',
            message: 'unique validation error on title',
            rule: 'unique',
          },
        ],
      },
    })
  })

  test('create an event with wrong venue reference', async ({ client, assert }) => {
    const response = await client.post('/api/events').json({
      title: 'testEvent',
      venue_id: '36fc7b37-e04d-4e51-9f9e-a3cc13488239',
    })
    assert.equal(response.status(), 400)
    response.assertBody({
      flashToSession: false,
      messages: {
        errors: [
          {
            field: 'venue_id',
            message: 'exists validation error on venue_id',
            rule: 'exists',
          },
        ],
      },
    })
  })

  test('create an event with wrong uuid type for venue', async ({ client, assert }) => {
    const response = await client.post('/api/events').json({
      title: 'testEvent',
      venue_id: 'fakeUUID',
    })
    assert.equal(response.status(), 400)
    response.assertBody({
      flashToSession: false,
      messages: {
        errors: [
          {
            field: 'venue_id',
            message: 'uuid validation error on venue_id',
            rule: 'uuid',
          },
          {
            field: 'venue_id',
            message: 'exists validation error on venue_id',
            rule: 'exists',
          },
        ],
      },
    })
  })

  test('create an event with wrong creator reference', async ({ client, assert }) => {
    const response = await client.post('/api/events').json({
      title: 'testEvent',
      creator_email: 'some.fake@mail.com',
    })
    assert.equal(response.status(), 400)
    response.assertBody({
      flashToSession: false,
      messages: {
        errors: [
          {
            field: 'creator_email',
            message: 'exists validation error on creator_email',
            rule: 'exists',
          },
        ],
      },
    })
  })

  test('create an event with wrong email type for creator_email', async ({ client, assert }) => {
    const response = await client.post('/api/events').json({
      title: 'testEvent',
      creator_email: 'NoValidEmailAddress',
    })
    assert.equal(response.status(), 400)
    response.assertBody({
      flashToSession: false,
      messages: {
        errors: [
          {
            field: 'creator_email',
            message: 'email validation error on creator_email',
            rule: 'email',
          },
          {
            field: 'creator_email',
            message: 'exists validation error on creator_email',
            rule: 'exists',
          },
        ],
      },
    })
  })

  test('update an event', async ({ client, assert }) => {
    await EventFactory.create()
    const allEvents = await client.get('/api/events')
    const { id } = allEvents.body().events[0]

    const response = await client.put(`/api/events/${id}`).json({
      title: 'This is a brand new title',
    })
    assert.isTrue(response.body().success)
    assert.equal(response.body().event.title, 'This is a brand new title')
  })

  test('delete an event', async ({ client, assert }) => {
    await EventFactory.create()
    const allEvents = await client.get('/api/events')
    const { id } = allEvents.body().events[0]

    const response = await client.delete(`/api/events/${id}`)
    assert.isTrue(response.body().success)
    assert.notExists(response.body().event)
  })
})
