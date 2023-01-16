import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateEventValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string.optional([rules.unique({ table: 'events', column: 'title' })]),
    description: schema.string.optional(),
    box_office: schema.string.optional(),
    pre_payment: schema.string.optional(),
    alternative_address: schema.string.optional(),
    cover: schema.string.optional([rules.url()]),
    venue_id: schema.string.optional([
      rules.uuid(),
      rules.exists({ table: 'venues', column: 'id' }),
    ]),
    links: schema.string.optional(),
  })

  public messages: CustomMessages = {
    '*': (field, rule) => {
      return `${rule} validation error on ${field}`
    },
    'title.required': 'title is required to create an event',
  }
}
