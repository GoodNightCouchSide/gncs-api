import Route from '@ioc:Adonis/Core/Route'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'
import roles from 'App/constants/roles'

import Application from '@ioc:Adonis/Core/Application'

Route.group(() => {
  Route.group(() => {
    Route.post('/login', 'AuthController.login')
    Route.post('/register', 'AuthController.register')
    Route.post('/logout', 'AuthController.logout').middleware('auth:api')
  }).prefix('auth')

  Route.resource('events', 'EventsController')
    .middleware({
      index: [],
      show: [],
      store: [],
      update: ['auth'],
      destroy: ['auth'],
    })
    .apiOnly()

  Route.resource('venues', 'VenuesController')
    .middleware({
      index: [],
      show: [],
      store: ['auth', `hasRole:${roles.ADMIN},${roles.MODERATOR}`],
      update: ['auth', `hasRole:${roles.ADMIN},${roles.MODERATOR}`],
      destroy: ['auth', `hasRole:${roles.ADMIN},${roles.MODERATOR}`],
    })
    .apiOnly()

  Route.get('/health', async ({ response }: HttpContextContract) => {
    const report = await HealthCheck.getReport()
    return report.healthy
      ? response.ok({ ...report, version: Application.version!.toString() })
      : response.badRequest(report)
  })
}).prefix('_api')
