import Factory from '@ioc:Adonis/Lucid/Factory'
import Artist from 'App/Models/Artist'

export default Factory.define(Artist, ({ faker }: any) => {
  // random number between 1 and 5
  let i = Math.floor(Math.random() * 6 + 1)
  const genres = new Set<string>()
  while (i > 0) {
    const genre = faker.music.genre()
    if (genres.has(genre)) continue
    genres.add(genre)
    i--
  }

  const links: string[] = new Array(Math.floor(Math.random() * 3 + 1))
    .fill(null)
    .map(() => faker.internet.url())

  const members = new Array(Math.floor(Math.random() * 5 + 1))
    .fill(null)
    .map(() => faker.name.fullName())

  return {
    name: faker.random.word(),
    genre: Array.from(genres),
    description: faker.random.words(20),
    links,
    members,
    musicLabel: faker.random.word(),
    logo: faker.internet.url(),
  }
}).build()
