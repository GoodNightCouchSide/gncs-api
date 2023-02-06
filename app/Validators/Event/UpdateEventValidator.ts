import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateEventValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string.optional([rules.unique({ table: 'events', column: 'title' })]),
    date: schema.date.optional({ format: 'iso' }),
    headliner: schema.string.optional(),
    support: schema.string.optional(),
    description: schema.string.optional(),
    box_office: schema.string.optional(),
    pre_payment: schema.string.optional(),
    alternative_address: schema.string.optional(),
    // TODO: only allowed if the create a moderator or admin
    is_public: schema.boolean.optional(),
    venue_id: schema.string.optional([rules.exists({ table: 'venues', column: 'id' })]),
    event_links: schema.string.optional(),
  })

  public messages: CustomMessages = {
    'title.required': 'title is required to create an event',
    'title.unique': 'title already exists',
    'venue_id.exists': 'Referenced venue does not exist',
    'creator_email.email': 'Please enter a valid email address',
    'creator_email.exists': 'Referenced user does not exist',
  }
}
