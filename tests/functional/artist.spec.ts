import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import ArtistFactory from 'Database/factories/ArtistFactory'

test.group('Artist', (group) => {
  // We use the Database global transactions to have a clean database state in-between tests.
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    await ArtistFactory.createMany(2)
    return () => Database.rollbackGlobalTransaction()
  })

  /**
   * GET Artists
   */
  test('get a list of artist', async ({ client, assert }) => {
    const response = await client.get('/api/artists')
    response.assertStatus(200)
    assert.isTrue(response.body().success)
    const artists = response.body().artists
    assert.lengthOf(artists, 2)
    assert.onlyProperties(artists[0], [
      'id',
      'name',
      'genre',
      'description',
      'links',
      'logo',
      'members',
      'music_label',
      'created_at',
      'updated_at',
    ])
  })

  test('get one artist', async ({ client, assert }) => {
    const allArtist = await client.get('/api/artists')
    const { id } = allArtist.body().artists[0]

    const artistResponse = await client.get(`/api/artists/${id}`)
    artistResponse.assertStatus(200)
    assert.isTrue(artistResponse.body().success)

    assert.onlyProperties(artistResponse.body().artist, [
      'id',
      'name',
      'genre',
      'description',
      'links',
      'logo',
      'members',
      'music_label',
      'created_at',
      'updated_at',
    ])
  })

  test('get a non-existing artist', async ({ client }) => {
    const artistResponse = await client.get('/api/artists/e25264cc-7a89-420d-bb74-23c4162b3616')
    artistResponse.assertStatus(404)
  })

  /**
   * CREATE Artists
   */
  test('create an artist with all allowed fields', async ({ client, assert }) => {
    const response = await client
      .post('/api/artists')
      .withCsrfToken()
      .json({
        name: 'Example Artist',
        genre: ['Punk', 'Slug'],
        description: 'This is a description of the Artist',
        links: ['http://artist.bandcomap.com'],
        logo: 'https://url-to-logo.com',
        members: ['Hans', 'Peter', 'Dieter'],
        music_label: 'NiceMusicRecords',
      })
    assert.isTrue(response.body().success)
    assert.properties(response.body().artist, [
      'id',
      'name',
      'genre',
      'description',
      'links',
      'logo',
      'members',
      'music_label',
      'created_at',
      'updated_at',
    ])
  })
})
