/**
 *
 * @param {{
 *  id: string;
 *  role: string[]
 * }} user
 * @returns
 */
export function checkIsAdmin(user) {
  return typeof user === "object" && user.role.includes("Administrateur");
}
