declare module '@ioc:Adonis/Core/Validator' {
  interface Rules {
    isAdminOrModerator(roleId?: string): Rule
  }
}
