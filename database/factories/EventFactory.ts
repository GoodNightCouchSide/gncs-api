import Event from '../../app/Models/Event'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Event, ({ faker }: any) => {
  const dateFrom = new Date()
  const dateTo = new Date()
  dateTo.setDate(dateTo.getDate() + Math.round(5))
  const support = new Array(5).fill(null).map(() => faker.random.word())
  return {
    title: faker.random.word(),
    date: faker.date.between(dateFrom.toISOString(), dateTo.toISOString()),
    headliner: faker.random.word(),
    support: JSON.stringify(support),
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
