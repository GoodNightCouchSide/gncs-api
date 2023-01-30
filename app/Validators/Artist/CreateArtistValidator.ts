import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateArtistValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string(),
    genre: schema.array([rules.minLength(1)]).members(schema.string()),
    description: schema.string.optional(),
    links: schema.array().members(schema.string()),
    logo: schema.string.optional([rules.url()]),
    members: schema.array().members(schema.string()),
    music_label: schema.string.optional(),
  })

  public messages: CustomMessages = {
    'name.required': 'Der Name des Artist angegeben werden.',
    'genre.required': 'Es muss mindestens ein Genre angegeben werden.',
  }
}
