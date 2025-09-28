export default class XrmUtilityClass {
  #roles;
  get Roles() {
    if (this.#roles === undefined) {
      this.#roles = Xrm.Utility.getGlobalContext().userSettings.roles.getAll();
    }
    return this.#roles;
  }
  userHasRole(...securityRoles) {
    if (securityRoles.length > 0) {
      return (
        this.Roles.filter((r) => securityRoles.includes(r.name)).length > 0
      );
    }
    return false;
  }
}
