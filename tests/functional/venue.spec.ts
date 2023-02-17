import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import { VenueFactory } from 'Database/factories/VenueFactory'
import { createTestUser } from '../testHelpers/createTestUser'

test.group('Venues', (group) => {
  let adminUser
  let unauthorizedUser

  const VENUE_ROUTE = '/_api/venues'

  // We use the Database global transactions to have a clean database state in-between tests.
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    await VenueFactory.createMany(2)

    const testAccount = await createTestUser()
    unauthorizedUser = testAccount.userUser
    adminUser = testAccount.adminUser
    return () => Database.rollbackGlobalTransaction()
  })

  /*
   * READ
   */
  test('get a list of venues', async ({ client, assert }) => {
    const response = await client.get(VENUE_ROUTE)
    const venues = response.body().venues

    response.assertStatus(200)
    assert.isTrue(response.body().success)
    assert.lengthOf(venues, 2)
    assert.properties(venues[0], [
      'id',
      'name',
      'description',
      'street',
      'street_number',
      'post_code',
      'city',
      'created_at',
      'updated_at',
    ])
  })

  test('get one venue', async ({ client, assert }) => {
    const allVenues = await client.get(VENUE_ROUTE)
    const { id } = allVenues.body().venues[0]

    const venueResponse = await client.get(`/_api/venues/${id}`)
    venueResponse.assertStatus(200)
    assert.isTrue(venueResponse.body().success)

    assert.properties(venueResponse.body().venue, [
      'id',
      'name',
      'description',
      'street',
      'street_number',
      'post_code',
      'city',
      'created_at',
      'updated_at',
    ])
  })

  test('get a non-existing venue', async ({ client }) => {
    const venueResponse = await client.get('/_api/venues/e25264cc-7a89-420d-bb74-23c4162b3616')
    venueResponse.assertStatus(404)
  })

  /*
   * CREATE
   */
  test('create an venue, authorized', async ({ client, assert }) => {
    const response = await client.post(VENUE_ROUTE).withCsrfToken().loginAs(adminUser).json({
      name: 'Venue',
      description: 'Description of a Venue',
      street: 'Musterstraße',
      streetNumber: '7a',
      postCode: '12345',
      city: 'Berlin',
    })

    assert.isTrue(response.body().success)
    assert.properties(response.body().venue, [
      'id',
      'name',
      'description',
      'street',
      'street_number',
      'post_code',
      'city',
      'created_at',
      'updated_at',
    ])
  })

  test('create an venue without authentication', async ({ client, assert }) => {
    const response = await client.post(VENUE_ROUTE).withCsrfToken().loginAs(unauthorizedUser).json({
      name: 'Venue',
      description: 'Description of a Venue',
      street: 'Musterstraße',
      streetNumber: '7a',
      postCode: '12345',
      city: 'Berlin',
    })

    response.assertStatus(403)
    assert.isFalse(response.body().success)
    assert.equal(response.body().message, 'You are not authorized to perform this action')
  })

  test('create an venue without authentication: not logged in', async ({ client, assert }) => {
    const response = await client.post(VENUE_ROUTE).withCsrfToken().json({
      name: 'Venue',
      description: 'Description of a Venue',
      street: 'Musterstraße',
      streetNumber: '7a',
      postCode: '12345',
      city: 'Berlin',
    })

    assert.isFalse(response.body().success)
    assert.include(response.body().message, 'E_UNAUTHORIZED_ACCESS: Unauthorized access')
  })

  test('create an venue with an too long zip', async ({ client, assert }) => {
    const response = await client.post(VENUE_ROUTE).withCsrfToken().loginAs(adminUser).json({
      name: 'Invalid Venue',
      description: 'Description of a Venue',
      street: 'Musterstraße',
      streetNumber: '7a',
      postCode: '123456789',
      city: 'Berlin',
    })

    assert.equal(
      response.body().message.errors[0].message,
      'Die Postleitzahl darf nur 5 Zeichen haben'
    )
    assert.isFalse(response.body().success)
  })

  /*
   * UPDATE
   */
  test('update a venue completely', async ({ client, assert }) => {
    // ARRANGE
    const allVenues = await client.get(VENUE_ROUTE)
    const venue = allVenues.body().venues[0]

    const newValues = {
      name: 'Tacocat',
      description: 'This is an updated description',
      street: 'Milky Way',
      street_number: '1312',
      post_code: '67890',
      city: 'Bubblegum',
      url: 'www.rocko.com',
      capacity: 333,
    }

    // ACT
    const response = await client
      .put(`${VENUE_ROUTE}/${venue.id}`)
      .withCsrfToken()
      .loginAs(adminUser)
      .json({
        ...newValues,
        streetNumber: newValues.street_number,
        postCode: newValues.post_code,
      })

    // ASSERT
    const updatedVenue = response.body().venue

    assert.isTrue(response.body().success)
    assert.include(updatedVenue, newValues)
  })

  test('update a venue without authentication', async ({ client, assert }) => {
    const allVenues = await client.get(VENUE_ROUTE)
    const venue = allVenues.body().venues[0]

    const response = await client
      .put(`${VENUE_ROUTE}/${venue.id}`)
      .withCsrfToken()
      .loginAs(unauthorizedUser)
      .json({
        description: 'This is an updated description',
      })

    response.assertStatus(403)
    assert.isFalse(response.body().success)
    assert.equal(response.body().message, 'You are not authorized to perform this action')
  })

  test('update one field of a venue', async ({ client, assert }) => {
    const allVenues = await client.get(VENUE_ROUTE)
    const venue = allVenues.body().venues[0]

    const response = await client
      .put(`${VENUE_ROUTE}/${venue.id}`)
      .withCsrfToken()
      .loginAs(adminUser)
      .json({
        description: 'This is an updated description',
      })

    assert.isTrue(response.body().success)
    assert.equal(response.body().venue.description, 'This is an updated description')
    assert.equal(response.body().venue.name, venue.name)
    assert.equal(response.body().venue.street, venue.street)
    assert.equal(response.body().venue.city, venue.city)
  })

  test('update an venue with an too short zip', async ({ client, assert }) => {
    const allVenues = await client.get(VENUE_ROUTE)
    const venue = allVenues.body().venues[0]

    const response = await client
      .put(`${VENUE_ROUTE}/${venue.id}`)
      .withCsrfToken()
      .loginAs(adminUser)
      .json({
        postCode: '123',
      })

    assert.equal(
      response.body().message.errors[0].message,
      'Die Postleitzahl muss aus mindestens 5 Zeichen bestehen'
    )
    assert.isFalse(response.body().success)
  })

  /*
   * DELETE
   */
  test('delete an event', async ({ client, assert }) => {
    const allVenues = await client.get(VENUE_ROUTE)
    const { id } = allVenues.body().venues[0]

    const response = await client.delete(`${VENUE_ROUTE}/${id}`).withCsrfToken().loginAs(adminUser)

    assert.isTrue(response.body().success)
    assert.notExists(response.body().venue)
  })

  test('delete an event as unauthorized', async ({ client, assert }) => {
    // ARRANGE
    const allVenues = await client.get(VENUE_ROUTE)
    const { id } = allVenues.body().venues[0]

    // ACT
    const response = await client
      .delete(`${VENUE_ROUTE}/${id}`)
      .withCsrfToken()
      .loginAs(unauthorizedUser)

    // ASSERT
    response.assertStatus(403)
    assert.isFalse(response.body().success)
    assert.equal(response.body().message, 'You are not authorized to perform this action')
  })
})
