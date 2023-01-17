import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Event from 'App/Models/Event'
import CreateEventValidator from 'App/Validators/Event/CreateEventValidator'
import UpdateEventValidator from 'App/Validators/Event/UpdateEventValidator'

export default class EventsController {
  // get all events
  public async index({ response }: HttpContextContract) {
    const events = await Event.query()
    response.json({ success: true, events })
  }

  // get one event per id
  public async show({ request, response }: HttpContextContract) {
    const event = await Event.findByOrFail('id', request.param('id'))
    response.json({ success: true, event })
  }

  // post one event
  public async store({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(CreateEventValidator)
      // TODO set is_public if user.role equal moderator or admin
      // TODO create_email must not be handed over, must be taken over via the auth
      const event = await Event.create(payload)
      response.json({ success: true, event })
    } catch (error) {
      response.badRequest(error)
    }
  }

  // update one event with id
  public async update({ request, response }: HttpContextContract) {
    const event = await Event.findByOrFail('id', request.param('id'))
    const payload = await request.validate(UpdateEventValidator)

    await event.merge(payload).save()
    response.json({ success: true, event })
  }

  // delete one event with id
  public async destroy({ request, response }: HttpContextContract) {
    const event = await Event.findByOrFail('id', request.param('id'))
    await event?.delete()

    response.json({ success: true })
  }
}
