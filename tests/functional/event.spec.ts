import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import Drive from '@ioc:Adonis/Core/Drive'
import { file } from '@ioc:Adonis/Core/Helpers'

import EventFactory from 'Database/factories/EventFactory'
import VenueFactory from 'Database/factories/VenueFactory'
import UserFactory from 'Database/factories/UserFactory'
import roles from 'App/constants/roles'
import Role from 'App/Models/Role'

test.group('Events', (group) => {
  // We use the Database global transactions to have a clean database state in-between tests.
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    await EventFactory.createMany(2)
    return () => Database.rollbackGlobalTransaction()
  })

  const eventProperties = [
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
    'event_links',
    'creator_email',
    'is_public',
    'created_at',
    'updated_at',
  ]

  /*
   * GET Events
   */
  test('get a list of events', async ({ client, assert }) => {
    const response = await client.get('/_api/events')
    const events = response.body().events

    response.assertStatus(200)
    assert.isTrue(response.body().success)

    assert.lengthOf(events, 2)
    assert.onlyProperties(events[0], eventProperties)
  })

  test('get one event', async ({ client, assert }) => {
    const allEvents = await client.get('/_api/events')
    const { id } = allEvents.body().events[0]
    const eventResponse = await client.get(`/_api/events/${id}`)

    eventResponse.assertStatus(200)
    assert.isTrue(eventResponse.body().success)
    assert.onlyProperties(eventResponse.body().event, eventProperties)
  })

  test('get a non-existing event', async ({ client }) => {
    const eventResponse = await client.get('/_api/events/e25264cc-7a89-420d-bb74-23c4162b3616')
    eventResponse.assertStatus(404)
  })

  /*
   * CREATE Events
   */
  test('create an event with all allowed fields', async ({ client, assert }) => {
    // ARRANGE
    const venue = await VenueFactory.create()
    const userRole = await Role.findByOrFail('name', roles.USER)
    const user = await UserFactory.merge({
      roleId: userRole.id,
    }).create()

    const fakeDrive = Drive.fake()
    const eventCover = await file.generatePng('1mb')

    // ACT
    const response = await client
      .post('/_api/events')
      .withCsrfToken()
      .fields({
        title: 'Test Event',
        date: new Date().toISOString(),
        headliner: 'Super nice Band',
        description: 'description of testEvent',
        support: 'rocking racoons',
        pre_payment: '33 Euro',
        box_office: '34',
        event_links: 'https://www.test-location.de',
        alternative_address: 'test',
        creator_email: user.email,
        venue_id: venue.id,
      })
      .file('cover', eventCover.contents, { filename: eventCover.name })

    // ASSERT
    assert.isTrue(response.body().success)
    assert.properties(response.body().event, eventProperties)
    assert.isTrue(await fakeDrive.exists(eventCover.name))

    Drive.restore()
  })

  test('create an event without title', async ({ client, assert }) => {
    const response = await client.post('/_api/events').withCsrfToken().json({
      description: 'test event description',
    })

    assert.equal(response.status(), 422)
    assert.equal(response.body().message.errors[0].message, 'title is required to create an event')
  })

  test('create an event that title is not unique', async ({ client, assert }) => {
    // ARRANGE
    const eventBody = {
      title: 'testTitleEvent',
      date: new Date().toISOString(),
      headliner: 'Test Headliner',
    }

    // ACT
    const response1 = await client.post('/_api/events').withCsrfToken().json(eventBody)
    const response2 = await client.post('/_api/events').withCsrfToken().json(eventBody)

    // ASSERT
    assert.isTrue(response1.body().success)
    assert.equal(response2.status(), 422)
    assert.equal(response2.body().message.errors[0].message, 'title already exists')
  })

  test('create an event with not existing venue reference', async ({ client, assert }) => {
    const response = await client.post('/_api/events').withCsrfToken().json({
      title: 'wrongVenueEvent',
      date: new Date().toISOString(),
      headliner: 'Test Headliner',
      venue_id: '36fc7b37-e04d-4e51-9f9e-a3cc13488239',
    })

    assert.equal(response.status(), 422)
    assert.equal(response.body().message.errors[0].message, 'Referenced venue does not exist')
  })

  test('create an event with wrong creator reference', async ({ client, assert }) => {
    const response = await client.post('/_api/events').withCsrfToken().json({
      title: 'wrongcreatorEvent',
      date: new Date().toISOString(),
      headliner: 'Test Headliner',
      creator_email: 'some.fake@mail.com',
    })

    assert.equal(response.status(), 422)
    assert.equal(response.body().message.errors[0].message, 'Referenced user does not exist')
  })

  test('create an event with wrong email type for creator_email', async ({ client, assert }) => {
    const response = await client.post('/_api/events').withCsrfToken().json({
      title: 'wrongCreatorEmailEvent',
      date: new Date().toISOString(),
      headliner: 'Test Headliner',
      creator_email: 'NoValidEmailAddress',
    })
    assert.equal(response.status(), 422)
    assert.equal(response.body().message.errors[0].message, 'Please enter a valid email address')
  })

  /*
   * UPDATE Events
   */
  test('update the whole event', async ({ client, assert }) => {
    // ARRANGE
    await EventFactory.create()
    const allEvents = await client.get('/_api/events')
    const { id } = allEvents.body().events[0]

    const venue = await VenueFactory.create()

    const fakeDrive = Drive.fake()
    const eventCover = await file.generatePng('1mb')

    // ACT
    const requestBody = {
      title: 'Super New Title',
      // date: '2023-01-20T01:06:21.812+01:00', TODO: mock the date
      headliner: 'Update a Headliner',
      support: '["Support Band 1", "Support Band 2", "Support Band 3"]',
      description: 'A new description for the Super new Event',
      pre_payment: '24 €',
      box_office: '25 Tacken',
      event_links: 'https://www.new-test-location.de',
      alternative_address: 'somewhere else',
      is_public: false,
      venue_id: venue.id,
    }
    const response = await client
      .put(`/_api/events/${id}`)
      .withCsrfToken()
      .file('cover', eventCover.contents, { filename: eventCover.name })
      .fields(requestBody)
    const updatedEvent = response.body().event

    // ASSERT
    assert.isTrue(response.body().success)
    assert.include(updatedEvent, requestBody)
    assert.isTrue(await fakeDrive.exists(eventCover.name))

    Drive.restore()
  })

  test('update only a event title', async ({ client, assert }) => {
    await EventFactory.create()
    const allEvents = await client.get('/_api/events')
    const { id } = allEvents.body().events[0]

    const response = await client.put(`/_api/events/${id}`).withCsrfToken().json({
      title: 'This is a brand new title',
    })
    assert.isTrue(response.body().success)
    assert.equal(response.body().event.title, 'This is a brand new title')
  })

  test('update the cover with a too large image', async ({ client, assert }) => {
    // ARRANGE
    await EventFactory.create()
    const allEvents = await client.get('/_api/events')
    const { id } = allEvents.body().events[0]
    const eventCover = await file.generatePng('3mb')

    // ACT
    const response = await client
      .put(`/_api/events/${id}`)
      .withCsrfToken()
      .file('cover', eventCover.contents, { filename: eventCover.name })

    // ASSERT
    assert.isFalse(response.body().success)
    assert.equal(response.body().message.errors[0].message, 'The file size must be under 2mb')

    Drive.restore()
  })

  // TODO: this does not work
  // test('not allowed to override the event creator email', async ({ client, assert }) => {
  //   await EventFactory.create()
  //   const allEvents = await client.get('/_api/events')
  //   const { id, createEmail } = allEvents.body().events[0]

  //   const userRole = await Role.findByOrFail('name', roles.USER)
  //   const creator = await UserFactory.merge({
  //     roleId: userRole.id,
  //   }).create()

  //   const requestBody = {
  //     creator_email: creator.email,
  //   }
  //   const response = await client.put(`/_api/events/${id}`).withCsrfToken().json(requestBody)

  //   assert.isTrue(response.body().success)
  //   assert.equal(response.body().event.create_email, createEmail)
  // })

  /*
   * DELETE Events
   */
  test('delete an event with admin user', async ({ client, assert }) => {
    await EventFactory.create()
    const userRole = await Role.findByOrFail('name', roles.ADMIN)
    const adminUser = await UserFactory.merge({
      roleId: userRole.id,
    }).create()
    const allEvents = await client.get('/_api/events')
    const { id } = allEvents.body().events[0]

    const response = await client.delete(`/_api/events/${id}`).withCsrfToken().loginAs(adminUser)
    assert.isTrue(response.body().success)
    assert.notExists(response.body().event)
  })

  test('delete an event with moderator user', async ({ client, assert }) => {
    await EventFactory.create()
    const userRole = await Role.findByOrFail('name', roles.MODERATOR)
    const adminUser = await UserFactory.merge({
      roleId: userRole.id,
    }).create()
    const allEvents = await client.get('/_api/events')
    const { id } = allEvents.body().events[0]

    const response = await client.delete(`/_api/events/${id}`).withCsrfToken().loginAs(adminUser)
    response.assertStatus(403)
    assert.equal(response.body().message, 'You are not authorized to perform this action')
  })

  test('delete an event without authentication', async ({ client, assert }) => {
    await EventFactory.create()
    const allEvents = await client.get('/_api/events')
    const { id } = allEvents.body().events[0]

    const response = await client.delete(`/_api/events/${id}`).withCsrfToken()
    response.assertStatus(403)
    assert.include(response.body().message, 'E_UNAUTHORIZED_ACCESS: Unauthorized access')
    assert.isFalse(response.body().success)
  })
})
