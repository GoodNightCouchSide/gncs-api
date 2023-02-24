import Event from 'App/Models/Event'
import Role from 'App/Models/Role'
import User from 'App/Models/User'

export class EventPermissionService {
  /**
   * Check if the user allowed to update or delete an Event,
   * Admin and Moderator it is allowed to modify any event.
   * Guest and login user can only modify own events,
   * that create by himself and that is not yet published.
   * @param event Event
   * @param user User or undefined
   * @returns Promise<boolean> If Allowed to modify Event
   */
  public static async isAllowedToModifyEvent(
    event: Event,
    user: User | undefined
  ): Promise<boolean> {
    // not logged in users are not allowed to modify an event
    // TODO a guest with access token can modify theirs one created event
    if (!user) return false

    // Admins and moderators can modify any event
    if (await Role.isAdminOrModerator(user.roleId)) return true

    // if the event not yet public and the event creator  is the user
    // than can the USERS (later also GUEST) modify this event
    if (!event.isPublic && event.creatorEmail === user.email) return true
    return false
  }
}
