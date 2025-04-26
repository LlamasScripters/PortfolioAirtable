import { jwtVerify } from "jose/jwt/verify";

/**
 *
 * @param {string} token
 * @param {string} secret
 */
export async function checkToken(token, secret) {
  if (typeof token !== "string") {
    return false;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    return payload;
  } catch (error) {
    return false;
  }
}
