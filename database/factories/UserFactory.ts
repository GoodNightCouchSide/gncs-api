import Factory from '@ioc:Adonis/Lucid/Factory'

import User from 'App/Models/User'

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
    name: faker.internet.userName(),
    // TODO set default role
  }
}).build()
