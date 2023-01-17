import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateOrUpdateVenueValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }),
    description: schema.string.optional({ trim: true }),
    street: schema.string({ trim: true }),
    streetNumber: schema.string({ trim: true }),
    postCode: schema.string([rules.minLength(5), rules.maxLength(5), rules.trim()]),
    city: schema.string({ trim: true }),
  })
}
