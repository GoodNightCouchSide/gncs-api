import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Event from 'App/Models/Event'
import NewEventValidator from 'App/Validators/NewEventValidator'

export default class EventsController {
  // until we don't have a validator, we should keep our requests save this way
  private eventFields = [
    'id',
    'title',
    'description',
    'cover',
    'pre_payment',
    'box_office',
    'venue',
    'links',
    'creator_email',
    'is_public',
  ]

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
      const payload = await request.validate(NewEventValidator)
      // TODO set is_public if user.role equal moderator or admin
      const body = Object.assign(payload, { is_public: false })
      const event = await Event.create(body)
      response.json({ success: true, event })
    } catch (error) {
      response.badRequest(error)
    }
  }

  // update one event with id
  public async update({ request, response }: HttpContextContract) {
    const event = await Event.findByOrFail('id', request.param('id'))
    const body = request.only(this.eventFields)

    await event.merge(body).save()
    response.json({ success: true, event })
  }

  // delete one event with id
  public async destroy({ request, response }: HttpContextContract) {
    const event = await Event.findByOrFail('id', request.param('id'))
    await event?.delete()

    response.json({ success: true })
  }
}
