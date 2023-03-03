import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import ArtistFactory from 'Database/factories/ArtistFactory'
import { createTestUser } from '../testHelpers/createTestUser'
import Drive from '@ioc:Adonis/Core/Drive'
import { file } from '@ioc:Adonis/Core/Helpers'
import { compareValues } from '../testHelpers/assertHelper'

test.group('Artist', (group) => {
  let adminUser
  let unauthorizedUser
  const ARTISTS_ROUTE = '/_api/artists'

  // We use the Database global transactions to have a clean database state in-between tests.
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    await ArtistFactory.createMany(2)

    const testAccount = await createTestUser()
    unauthorizedUser = testAccount.userUser
    adminUser = testAccount.adminUser
    return () => Database.rollbackGlobalTransaction()
  })

  /**
   * GET Artists
   */
  test('get a list of artist', async ({ client, assert }) => {
    const response = await client.get(ARTISTS_ROUTE)
    response.assertStatus(200)
    assert.isTrue(response.body().success)
    const artists = response.body().artists
    assert.lengthOf(artists, 2)
    assert.onlyProperties(artists[0], [
      'id',
      'name',
      'genres',
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
    const allArtist = await client.get(ARTISTS_ROUTE)
    const { id } = allArtist.body().artists[0]

    const artistResponse = await client.get(`${ARTISTS_ROUTE}/${id}`)
    artistResponse.assertStatus(200)
    assert.isTrue(artistResponse.body().success)

    assert.onlyProperties(artistResponse.body().artist, [
      'id',
      'name',
      'genres',
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
    const artistResponse = await client.get(`${ARTISTS_ROUTE}/e25264cc-7a89-420d-bb74-23c4162b3616`)
    artistResponse.assertStatus(404)
  })

  /**
   * CREATE Artists
   */
  test('create an artist with all allowed fields', async ({ client, assert }) => {
    // ARRANGE
    const fakeDrive = Drive.fake()
    const artistLogo = await file.generatePng('1mb')
    const body = {
      name: 'Example Artist',
      genres: ['Punk', 'Slug'],
      description: 'This is a description of the Artist',
      links: ['http://artist.bandcomap.com', 'http://artist.bandcomap.com'],
      members: ['Hans', 'Peter', 'Dieter'],
      music_label: 'NiceMusicRecords',
    }

    // ACT
    const response = await client
      .post(ARTISTS_ROUTE)
      .withCsrfToken()
      .loginAs(adminUser)
      .fields(body)
      .file('logo', artistLogo.contents, { filename: artistLogo.name })

    // ASSERT
    assert.isTrue(response.body().success)
    const artist = response.body().artist
    assert.properties(artist, [
      'id',
      'name',
      'genres',
      'description',
      'links',
      'logo',
      'members',
      'music_label',
      'created_at',
      'updated_at',
    ])
    compareValues(assert, artist, body)
    assert.isTrue(await fakeDrive.exists(artistLogo.name))

    Drive.restore()
  })

  /*
   * UPDATE artists
   */
  test('update the whole artist', async ({ client, assert }) => {
    // ARRANGE
    const allArtists = await client.get(ARTISTS_ROUTE)
    const { id } = allArtists.body().artists[0]

    const fakeDrive = Drive.fake()
    const artistLogo = await file.generatePng('1mb')

    // ACT
    const requestBody = {
      name: 'Example Artist',
      genres: ['Punk', 'Slug'],
      description: 'This is a description of the Artist',
      links: ['http://artist.bandcomap.com', 'http://artist.bandcomap.com'],
      members: ['Hans', 'Peter', 'Dieter'],
      music_label: 'NiceMusicRecords',
    }

    const response = await client
      .put(`${ARTISTS_ROUTE}/${id}`)
      .withCsrfToken()
      .loginAs(adminUser)
      .file('logo', artistLogo.contents, { filename: artistLogo.name })
      .fields(requestBody)
    const updateArtist = response.body().artist

    // ASSERT
    assert.isTrue(response.body().success)
    compareValues(assert, updateArtist, requestBody)
    assert.isTrue(await fakeDrive.exists(artistLogo.name))

    Drive.restore()
  })

  test('update an artist without authentication', async ({ client, assert }) => {
    const allArtists = await client.get(ARTISTS_ROUTE)
    const { id } = allArtists.body().artists[0]

    const response = await client
      .put(`${ARTISTS_ROUTE}/${id}`)
      .withCsrfToken()
      .loginAs(unauthorizedUser)
      .json({
        name: 'This is a brand new artist name',
      })

    response.assertStatus(403)
    assert.isFalse(response.body().success)
    assert.equal(response.body().message, 'You are not authorized to perform this action')
  })

  /*
   * DELETE artists
   */
  test('delete an artist with admin user', async ({ client, assert }) => {
    const allArtist = await client.get(ARTISTS_ROUTE)
    const { id } = allArtist.body().artists[0]

    const response = await client
      .delete(`${ARTISTS_ROUTE}/${id}`)
      .withCsrfToken()
      .loginAs(adminUser)
    assert.isTrue(response.body().success)
    assert.notExists(response.body().artist)
  })

  test('delete an artist, unauthorized', async ({ client, assert }) => {
    const allArtists = await client.get(ARTISTS_ROUTE)
    const { id } = allArtists.body().artists[0]
    const response = await client
      .delete(`${ARTISTS_ROUTE}/${id}`)
      .withCsrfToken()
      .loginAs(unauthorizedUser)

    response.assertStatus(403)
    assert.equal(response.body().message, 'You are not authorized to perform this action')
  })
})
