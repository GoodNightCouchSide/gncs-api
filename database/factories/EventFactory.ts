import Factory from '@ioc:Adonis/Lucid/Factory'
import { DateTime } from 'luxon'

import Event from '../../app/Models/Event'
import { createAttachmentImage } from './Helpers'

export const EventFactory = Factory.define(Event, async ({ faker }: any) => {
  const support = new Array(5).fill(null).map(() => faker.random.word())
  const coverImage = await createAttachmentImage(`${faker.random.alphaNumeric(10)}.png`)

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
    // creator_email: faker.internet.email(),
    is_public: true,
  }
}).build()
