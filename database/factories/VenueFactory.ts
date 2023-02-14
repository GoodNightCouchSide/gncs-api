import Venue from 'App/Models/Venue'
import Factory from '@ioc:Adonis/Lucid/Factory'

export const VenueFactory = Factory.define(Venue, ({ faker }) => {
  return {
    name: faker.random.word(),
    description: faker.random.words(),
    street: faker.address.street(),
    streetNumber: String(faker.random.numeric(2)),
    postCode: String(faker.random.numeric(5)),
    city: faker.address.city(),
    url: faker.internet.url(),
    capacity: faker.datatype.number(333),
  }
}).build()
