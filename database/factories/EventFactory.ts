import Event from '../../app/Models/Event'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Event, ({ faker }: any) => {
  return {
    title: faker.random.word(),
    description: faker.random.word(),
    cover: faker.random.numeric(),
    pre_payment: (faker.random.numeric(5) + faker.random.numeric(3)).toString(),
    box_office: (faker.random.numeric(5) + faker.random.numeric(3)).toString(),
    venue: faker.random.numeric(),
    links: faker.random.words(),
    creator: faker.random.numeric(),
    is_public: true,
  }
}).build()
