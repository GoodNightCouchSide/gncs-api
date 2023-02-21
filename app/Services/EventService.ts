import Event from 'App/Models/Event'
import Role from 'App/Models/Role'
import User from 'App/Models/User'

export class EventService {
  /**
   * Check if the user allowed to update or delete an Event,
   * that create by himself and that is not yet published.
   * @param event Event
   * @param user User or undefined
   * @returns Promise<boolean> If Allowed to modify Event
   */
  public static async isAllowedModifyOnwEvent(
    event: Event,
    user: User | undefined
  ): Promise<boolean> {
    if (!user) return false
    if (!(await Role.isAllowedToPublishContent(user.roleId))) {
      if (event.creatorEmail !== user.email || event.isPublic) {
        return false
      }
    }
    return true
  }
}
