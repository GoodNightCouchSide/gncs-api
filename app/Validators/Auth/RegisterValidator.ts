import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string([rules.unique({ table: 'users', column: 'username' })]),
    email: schema.string([rules.email(), rules.unique({ table: 'users', column: 'email' })]),
    password: schema.string([rules.minLength(8)]),
  })

  public messages: CustomMessages = {
    'username.required': 'Der Benutzername muss angegeben werden',
    'username.unique': 'Der Benutzername wird bereits benutzt',
    'email.required': 'Die Email Adresse muss angegeben werden',
    'email.unique': 'Die Email Adresse ist nicht mehr verfügbar',
    'password.required': 'Das Password muss angegeben werden',
  }
}
