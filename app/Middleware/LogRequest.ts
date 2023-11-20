import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'

export default class LogRequest {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    response.response.on('finish', () => {
      Logger.debug(
        `-> ${request.method()}: ${request.url()} end with status: ${response.response.statusCode}`
      )
    })
    await next()
  }
}
