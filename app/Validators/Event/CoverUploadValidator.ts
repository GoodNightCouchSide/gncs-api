import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CoverUploadValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    cover: schema.file.nullableAndOptional({ size: '2mb', extnames: ['jpg', 'jpeg', 'png'] }),
  })

  public messages: CustomMessages = {
    'file.size': 'The file size must be under {{ options.size }}',
    'file.extname': 'The file must have one of {{ options.extnames }} extension names',
  }
}
