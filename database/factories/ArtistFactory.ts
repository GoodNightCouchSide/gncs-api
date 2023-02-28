import Factory from '@ioc:Adonis/Lucid/Factory'
import Artist from 'App/Models/Artist'
import { createAttachmentImage, getLinks, getMusicGenres, getRandomNames } from './Helpers'

export default Factory.define(Artist, async ({ faker }: any) => {
  const genres = getMusicGenres(faker)
  const links = getLinks(faker, 2)
  const members = getRandomNames(faker, 4)
  const logo = await createAttachmentImage(`${faker.random.alphaNumeric(10)}.png`)
  return {
    name: faker.random.word(),
    genre: Array.from(genres),
    description: faker.random.words(20),
    links,
    members,
    musicLabel: faker.random.word(),
    logo,
  }
}).build()
