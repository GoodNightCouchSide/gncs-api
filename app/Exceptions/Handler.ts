/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  protected statusPages = {
    '403': 'errors/unauthorized',
    '404': 'errors/not-found',
    '500..599': 'errors/server-error',
  }

  public async handle(error: any, ctx: HttpContextContract) {
    // If requests comes from API routes, we need to convert those errors from html renders into api messages

    if (ctx.request.url().includes('/_api/')) {
      if (error.code === 'E_VALIDATION_FAILURE') {
        return ctx.response.status(422).json({
          success: false,
          message: error.messages,
        })
      } else if (error.code === 'E_ROW_NOT_FOUND') {
        return ctx.response.status(404).json({
          success: false,
          message: 'The provided ID does not exist',
        })
      }
      return ctx.response.status(403).json({
        success: false,
        message: error.toString(),
      })
    }

    return super.handle(error, ctx)
  }
}
