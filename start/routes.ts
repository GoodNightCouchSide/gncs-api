import Route from '@ioc:Adonis/Core/Route'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.group(() => {
  Route.group(() => {
    Route.post('/login', 'AuthController.login')
    Route.post('/register', 'AuthController.register')
  }).prefix('auth')

  // Route.group(() => {
  //   Route.get('/', 'EventsController.index')
  //   Route.post('/', 'EventsController.store')
  //   Route.get('/:id', 'EventsController.show')
  // }).prefix('events')
  Route.resource('events', 'EventsController').apiOnly()

  Route.get('/health', async ({ response }: HttpContextContract) => {
    const report = await HealthCheck.getReport()
    return report.healthy ? response.ok(report) : response.badRequest(report)
  })
}).prefix('api')
