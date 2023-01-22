import Route from '@ioc:Adonis/Core/Route'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.group(() => {
  Route.group(() => {
    Route.post('/login', 'AuthController.login')
    Route.post('/register', 'AuthController.register')
    Route.post('/logout', 'AuthController.logout').middleware('auth:api')
  }).prefix('auth')

  Route.resource('events', 'EventsController').apiOnly()

  Route.resource('venues', 'VenuesController').apiOnly()

  Route.get('/health', async ({ response }: HttpContextContract) => {
    const report = await HealthCheck.getReport()
    return report.healthy ? response.ok(report) : response.badRequest(report)
  })
}).prefix('api')
