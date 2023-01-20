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

  test('get a list of venues', async ({ client, assert }) => {
    const response = await client.get('/api/venues')
    response.assertStatus(200)
    assert.isTrue(response.body().success)

    const venues = response.body().venues
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
})
