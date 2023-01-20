import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

import VenueFactory from 'Database/factories/VenueFactory'

test.group('Venues', (group) => {
  // We use the Database global transactions to have a clean database state in-between tests.
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    await VenueFactory.createMany(2)
    return () => Database.rollbackGlobalTransaction()
  })

  /*
   * READ
   */
  test('get a list of venues', async ({ client, assert }) => {
    const response = await client.get('/api/venues')
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
    const allVenues = await client.get('/api/venues')
    const { id } = allVenues.body().venues[0]

    const venueResponse = await client.get(`/api/venues/${id}`)
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
    const venueResponse = await client.get('/api/venues/e25264cc-7a89-420d-bb74-23c4162b3616')
    venueResponse.assertStatus(404)
  })

  /*
   * CREATE
   */
  test('create an venue with all allowed fields', async ({ client, assert }) => {
    const response = await client.post('/api/venues').json({
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

  test('create an venue with an too long zip', async ({ client, assert }) => {
    const response = await client.post('/api/venues').json({
      name: 'Invalid Venue',
      description: 'Description of a Venue',
      street: 'Musterstraße',
      streetNumber: '7a',
      postCode: '123456789',
      city: 'Berlin',
    })

    assert.equal(response.body().errors[0].message, 'Die Postleitzahl darf nur 5 Zeichen haben')
    assert.isUndefined(response.body().success)
  })

  /*
   * UPDATE
   */
  test('update a venue completely', async ({ client, assert }) => {
    const allVenues = await client.get('/api/venues')
    const venue = allVenues.body().venues[0]

    const newValues = {
      name: 'Tacocat',
      description: 'This is an updated description',
      street: 'Milky Way',
      street_number: '1312',
      post_code: '67890',
      city: 'Bubblegum',
    }

    const response = await client.put(`/api/venues/${venue.id}`).json({
      ...newValues,
      streetNumber: newValues.street_number,
      postCode: newValues.post_code,
    })
    const updatedVenue = response.body().venue

    assert.isTrue(response.body().success)
    assert.include(updatedVenue, newValues)
  })

  test('update one field of a venue', async ({ client, assert }) => {
    const allVenues = await client.get('/api/venues')
    const venue = allVenues.body().venues[0]

    const response = await client.put(`/api/venues/${venue.id}`).json({
      description: 'This is an updated description',
    })

    assert.isTrue(response.body().success)
    assert.equal(response.body().venue.description, 'This is an updated description')
    assert.equal(response.body().venue.name, venue.name)
    assert.equal(response.body().venue.street, venue.street)
    assert.equal(response.body().venue.city, venue.city)
  })

  test('update an venue with an too short zip', async ({ client, assert }) => {
    const allVenues = await client.get('/api/venues')
    const venue = allVenues.body().venues[0]

    const response = await client.put(`/api/venues/${venue.id}`).json({
      postCode: '123',
    })

    assert.equal(
      response.body().errors[0].message,
      'Die Postleitzahl muss aus mindestens 5 Zeichen bestehen'
    )
    assert.isUndefined(response.body().success)
  })

  /*
   * DELETE
   */
  test('delete an event', async ({ client, assert }) => {
    const allVenues = await client.get('/api/venues')
    const { id } = allVenues.body().venues[0]

    const response = await client.delete(`/api/venues/${id}`)
    assert.isTrue(response.body().success)
    assert.notExists(response.body().venue)
  })
})
