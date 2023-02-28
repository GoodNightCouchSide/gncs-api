import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'

import Event from 'App/Models/Event'
import Role from 'App/Models/Role'
import CreateEventValidator from 'App/Validators/Event/CreateEventValidator'
import CoverUploadValidator from 'App/Validators/Event/CoverUploadValidator'
import UpdateEventValidator from 'App/Validators/Event/UpdateEventValidator'
import { EventPermissionService } from 'App/Services/EventPermissionService'

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
  public async store({ request, response, auth }: HttpContextContract) {
    const payload = await request.validate(CreateEventValidator)
    const event = await Event.create(payload)
    if (auth.user) {
      event.isPublic = await Role.isAllowedToPublishContent(auth.user.roleId)
      event.creatorEmail = auth.user.email
      await event.save()
    }
    const { cover } = await request.validate(CoverUploadValidator)
    event.cover = cover ? Attachment.fromFile(cover) : null

    await event.save()
    response.json({ success: true, event })
  }

  // update one event with id
  public async update({ request, response, auth }: HttpContextContract) {
    const { id } = request.params()
    const event = await Event.findOrFail(id)
    const notAllowed = !(await EventPermissionService.isAllowedToModifyEvent(event, auth.user))
    if (notAllowed) {
      return response.status(403).json({
        success: false,
        message: 'Du hast nicht die Berechtigung dieses Event zu ändern!',
      })
    }
    const payload = await request.validate(UpdateEventValidator)
    await event.merge(payload).save()

    const { cover } = await request.validate(CoverUploadValidator)
    event.cover = cover ? Attachment.fromFile(cover) : null

    // Old file will be removed from the disk as well.
    await event.save()
    response.json({ success: true, event })
  }

  // delete one event with id
  public async destroy({ request, response, auth }: HttpContextContract) {
    const { id } = request.params()
    const event = await Event.findOrFail(id)

    const notAllowed = !(await EventPermissionService.isAllowedToModifyEvent(event, auth.user))
    if (notAllowed) {
      return response.status(403).json({
        success: false,
        message: 'Du hast nicht die Berechtigung dieses Event zu löschen!',
      })
    }
    await event?.delete()

    response.json({ success: true })
  }
}
