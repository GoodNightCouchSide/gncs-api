import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import { file } from '@ioc:Adonis/Core/Helpers'
import Drive from '@ioc:Adonis/Core/Drive'

/**
 * Create an instance of attachment and mark image as persisted
 *
 * @param name Image file name
 * @returns AttachmentContract
 */
export const createAttachmentImage = async (name: string) => {
  const image = new Attachment({
    extname: 'png',
    mimeType: 'image/png',
    size: 10 * 1000,
    name,
  })
  image.isPersisted = true

  // Persist the file using Drive.
  await Drive.put(image.name, (await file.generatePng('1mb')).contents)
  return image
}

/**
 * Create an array with random music genres.
 * @param faker
 * @param max number max length of returning array default 5
 * @returns Array<string> Music Genres
 */
export const getMusicGenres = (faker, max = 5) => {
  // random number between min and max
  let genres = new Set<string>()
  let i = Math.floor(Math.random() * (max + 1) + 1)
  while (i > 0) {
    const genre = faker.music.genre()
    if (genres.has(genre)) continue
    genres.add(genre)
    i--
  }
  return genres
}

/**
 * Get random Url links in string array
 * @param faker
 * @param max number max length of returning array
 * @returns Array<string> Url links
 */
export const getLinks = (faker, length): string[] => {
  return new Array(Math.floor(Math.random() * (length + 1) + 1))
    .fill(null)
    .map(() => faker.internet.url())
}

/**
 * Get random Names in string array
 * @param faker
 * @param max number max length of returning array
 * @returns Array<string> Random Full Names
 */
export const getRandomNames = (faker, length): string[] => {
  return new Array(Math.floor(Math.random() * (length + 1) + 1))
    .fill(null)
    .map(() => faker.name.fullName())
}
