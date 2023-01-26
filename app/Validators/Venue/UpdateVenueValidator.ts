import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateVenueValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string.optional({ trim: true }),
    description: schema.string.optional({ trim: true }),
    street: schema.string.optional({ trim: true }),
    streetNumber: schema.string.optional([rules.minLength(1), rules.maxLength(5), rules.trim()]),
    postCode: schema.string.optional([rules.minLength(5), rules.maxLength(5), rules.trim()]),
    city: schema.string.optional({ trim: true }),
    url: schema.string.optional([rules.url(), rules.trim()]),
    capacity: schema.number.optional(),
  })

  public messages: CustomMessages = {
    'postCode.maxLength': 'Die Postleitzahl darf nur 5 Zeichen haben',
    'postCode.minLength': 'Die Postleitzahl muss aus mindestens 5 Zeichen bestehen',
  }
}
