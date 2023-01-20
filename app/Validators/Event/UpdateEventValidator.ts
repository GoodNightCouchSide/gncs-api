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
    // TODO: only allowed if the create a moderator or admin
    is_public: schema.boolean.optional(),
    venue_id: schema.string.optional([rules.exists({ table: 'venues', column: 'id' })]),
    links: schema.string.optional(),
  })

  public messages: CustomMessages = {
    'title.required': 'title is required to create an event',
    'title.unique': 'title already exists',
    'venue_id.exists': 'Referenced venue does not exist',
    'creator_email.email': 'Please enter a valid email address',
    'creator_email.exists': 'Referenced user does not exist',
  }
}
