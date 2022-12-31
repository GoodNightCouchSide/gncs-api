import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Event from 'App/Models/Event'
import { NO_CONTENT, OK } from 'http-status'

export default class EventsController {
  public async index({ response }: HttpContextContract) {
    const events = await Event.query()
    return response.status(OK).json(events)
  }

  public async show({ request, response }: HttpContextContract) {
    const event = await Event.findByOrFail('id', request.param('id'))
    return response.status(OK).json(event)
  }

  public async store({ request, response }: HttpContextContract) {
    const event = await Event.create(request.body())
    return response.json(event)
  }

  public async update({ request, response }: HttpContextContract) {
    const event = await Event.findByOrFail('id', request.param('id'))
    await event.merge(request.body()).save()
    return response.status(OK).json(event)
  }

  public async destroy({ request, response }: HttpContextContract) {
    const event = await Event.findByOrFail('id', request.param('id'))
    await event.delete()
    return response.status(NO_CONTENT).finish()
  }
}
