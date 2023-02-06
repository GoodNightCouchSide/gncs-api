import Factory from '@ioc:Adonis/Lucid/Factory'
import Drive from '@ioc:Adonis/Core/Drive'
import { file } from '@ioc:Adonis/Core/Helpers'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import { DateTime } from 'luxon'

import Event from '../../app/Models/Event'

export default Factory.define(Event, async ({ faker }: any) => {
  const support = new Array(5).fill(null).map(() => faker.random.word())

  // Create an instance of attachment and mark image as persisted
  const coverImage = new Attachment({
    extname: 'png',
    mimeType: 'image/png',
    size: 10 * 1000,
    name: `${faker.random.alphaNumeric(10)}.png`,
  })
  coverImage.isPersisted = true

  // Persist the file using Drive.
  await Drive.put(coverImage.name, (await file.generatePng('1mb')).contents)

  return {
    title: faker.random.word(),
    date: DateTime.fromJSDate(faker.date.past(2)),
    headliner: faker.random.word(),
    support: JSON.stringify(support),
    description: faker.random.word(),
    cover: coverImage,
    pre_payment: (faker.random.numeric(5) + faker.random.numeric(3)).toString(),
    box_office: (faker.random.numeric(5) + faker.random.numeric(3)).toString(),
    venue: faker.random.numeric(),
    event_links: faker.random.words(),
    creator: faker.random.numeric(),
    is_public: true,
  }
}).build()
