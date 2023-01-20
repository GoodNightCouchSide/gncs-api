import Venue from 'App/Models/Venue'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Venue, ({ faker }) => {
  return {
    name: faker.random.word(),
    description: faker.random.words(),
    street: faker.address.street(),
    streetNumber: faker.random.numeric(),
    postCode: String(faker.random.numeric(5)),
    city: faker.address.city(),
  }
}).build()
