import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import EventFactory from 'Database/factories/EventFactory'
import VenueFactory from 'Database/factories/VenueFactory'
import UserFactory from 'Database/factories/UserFactory'
import Roles from 'App/Enums/Roles'

test.group('Events', (group) => {
  // We use the Database global transactions to have a clean database state in-between tests.
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    await EventFactory.createMany(2)
    return () => Database.rollbackGlobalTransaction()
  })

  /**
   * GET Events
   */
  test('get a list of events', async ({ client, assert }) => {
    const response = await client.get('/api/events')
    response.assertStatus(200)
    assert.isTrue(response.body().success)

    const events = response.body().events
    assert.lengthOf(events, 2)
    assert.onlyProperties(events[0], [
      'id',
      'title',
      'date',
      'headliner',
      'support',
      'description',
      'cover',
      'pre_payment',
      'box_office',
      'venue_id',
      'alternative_address',
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

    assert.onlyProperties(eventResponse.body().event, [
      'id',
      'title',
      'date',
      'headliner',
      'support',
      'description',
      'cover',
      'pre_payment',
      'box_office',
      'venue_id',
      'alternative_address',
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

  /**
   * CREATE Events
   */
  test('create an event with all allowed fields', async ({ client, assert }) => {
    const venue = await VenueFactory.create()
    const user = await UserFactory.create()

    const response = await client.post('/api/events').withCsrfToken().json({
      title: 'testEvent',
      date: new Date().toISOString(),
      headliner: 'Super nice Band',
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
      'date',
      'headliner',
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

  test('create basic event with only required fields', async ({ client, assert }) => {
    const body = {
      title: 'testEvent',
      date: new Date().toISOString(),
      headliner: 'Nice Headliner',
    }
    const response = await client.post('/api/events').withCsrfToken().json(body)
    assert.isTrue(response.body().success)
    Object.keys(body).map((key) => {
      if (key === 'date') {
        return assert.equal(
          new Date(response.body().event[key]).toISOString,
          new Date(body[key]).toISOString
        )
      }
      assert.propertyVal(response.body().event, key, body[key])
    })
  })

  test('create an event without title', async ({ client, assert }) => {
    const response = await client.post('/api/events').withCsrfToken().json({
      description: 'test event description',
    })

    assert.equal(response.status(), 422)
    assert.equal(response.body().errors[0].message, 'title is required to create an event')
  })

  test('create an event that title is not unique', async ({ client, assert }) => {
    const eventBody = {
      title: 'testEvent',
      date: new Date().toISOString(),
      headliner: 'Test Headliner',
    }
    const response1 = await client.post('/api/events').withCsrfToken().json(eventBody)
    const response2 = await client.post('/api/events').withCsrfToken().json(eventBody)

    assert.isTrue(response1.body().success)
    assert.equal(response2.status(), 422)
    assert.equal(response2.body().errors[0].message, 'title already exists')
  })

  test('create an event with wrong venue reference', async ({ client, assert }) => {
    const response = await client.post('/api/events').withCsrfToken().json({
      title: 'testEvent',
      date: new Date().toISOString(),
      headliner: 'Test Headliner',
      venue_id: '36fc7b37-e04d-4e51-9f9e-a3cc13488239',
    })

    assert.equal(response.status(), 422)
    assert.equal(response.body().errors[0].message, 'Referenced venue does not exist')
  })

  test('create an event with wrong creator reference', async ({ client, assert }) => {
    const response = await client.post('/api/events').withCsrfToken().json({
      title: 'testEvent',
      date: new Date().toISOString(),
      headliner: 'Test Headliner',
      creator_email: 'some.fake@mail.com',
    })

    assert.equal(response.status(), 422)
    assert.equal(response.body().errors[0].message, 'Referenced user does not exist')
  })

  test('create an event with wrong email type for creator_email', async ({ client, assert }) => {
    const response = await client.post('/api/events').withCsrfToken().json({
      title: 'testEvent',
      date: new Date().toISOString(),
      headliner: 'Test Headliner',
      creator_email: 'NoValidEmailAddress',
    })
    assert.equal(response.status(), 422)
    assert.equal(response.body().errors[0].message, 'Please enter a valid email address')
  })

  /**
   * UPDATE Events
   */
  test('update only a event title', async ({ client, assert }) => {
    await EventFactory.create()
    const allEvents = await client.get('/api/events')
    const { id } = allEvents.body().events[0]

    const response = await client.put(`/api/events/${id}`).withCsrfToken().json({
      title: 'This is a brand new title',
    })
    assert.isTrue(response.body().success)
    assert.equal(response.body().event.title, 'This is a brand new title')
  })

  test('update only a event description', async ({ client, assert }) => {
    await EventFactory.create()
    const allEvents = await client.get('/api/events')
    const { id } = allEvents.body().events[0]

    const response = await client.put(`/api/events/${id}`).withCsrfToken().json({
      description: 'This is a brand new description',
    })
    assert.isTrue(response.body().success)
    assert.equal(response.body().event.description, 'This is a brand new description')
  })

  test('update the whole event', async ({ client, assert }) => {
    await EventFactory.create()
    const allEvents = await client.get('/api/events')
    const { id } = allEvents.body().events[0]
    const venue = await VenueFactory.create()

    const requestBody = {
      title: 'Super New Title',
      date: '2023-01-20T01:06:21.812',
      headliner: 'Update a Headliner',
      support: '["Support Band 1", "Support Band 2", "Support Band 3"]',
      description: 'A new description for the Super new Event',
      cover: 'https://link-to-ohter-webseit.de',
      pre_payment: '24 €',
      box_office: '25 Tacken',
      links: 'https://www.new-test-location.de',
      alternative_address: 'somewhere else',
      is_public: false,
      venue_id: venue.id,
    }
    const response = await client.put(`/api/events/${id}`).withCsrfToken().json(requestBody)
    assert.isTrue(response.body().success)
    Object.keys(requestBody).forEach((key) => {
      if (key === 'date') {
        // TODO Github use different time zone for this postgres and add a wrong timezone to the date
        assert.equal(response.body().event[key].slice(0, 23), requestBody[key])
        return
      }
      assert.equal(response.body().event[key], requestBody[key])
    })
  })

  test('not allowed to override the event creator email', async ({ client, assert }) => {
    await EventFactory.create()
    const allEvents = await client.get('/api/events')
    const { id, createEmail } = allEvents.body().events[0]

    const creator = await UserFactory.create()

    const requestBody = {
      creator_email: creator.email,
    }
    const response = await client.put(`/api/events/${id}`).withCsrfToken().json(requestBody)
    assert.isTrue(response.body().success)
    assert.equal(response.body().event.create_email, createEmail)
  })

  test('delete an event with admin user', async ({ client, assert }) => {
    await EventFactory.create()
    const adminUser = await UserFactory.merge({ roleName: Roles.ADMIN }).create()
    const allEvents = await client.get('/api/events')
    const { id } = allEvents.body().events[0]

    const response = await client.delete(`/api/events/${id}`).loginAs(adminUser)
    assert.isTrue(response.body().success)
    assert.notExists(response.body().event)
  })

  test('delete an event with moderator user', async ({ client, assert }) => {
    await EventFactory.create()
    const adminUser = await UserFactory.merge({ roleName: Roles.MODERATOR }).create()
    const allEvents = await client.get('/api/events')
    const { id } = allEvents.body().events[0]

    const response = await client.delete(`/api/events/${id}`).loginAs(adminUser)
    response.assertStatus(401)
    assert.equal(response.body().errors[0].message, 'This is restricted to admin users')
  })

  test('delete an event without authentication', async ({ client, assert }) => {
    await EventFactory.create()
    const allEvents = await client.get('/api/events')
    const { id } = allEvents.body().events[0]

    const response = await client.delete(`/api/events/${id}`).withCsrfToken()
    response.assertStatus(401)
    assert.equal(response.body().errors[0].message, 'E_UNAUTHORIZED_ACCESS: Unauthorized access')
  })
})
