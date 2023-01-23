import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateArtistValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string.optional([rules.unique({ table: 'artist', column: 'name' })]),
    genre: schema.string.optional(),
    description: schema.string.optional(),
    links: schema.string.optional(),
    logo: schema.string.optional([rules.url()]),
    members: schema.string.optional(),
    musicLabel: schema.string.optional(),
  })

  public messages: CustomMessages = {
    'name.required': 'Name of the Artist is required to create a new Artist',
  }
}
