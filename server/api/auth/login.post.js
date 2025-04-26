import bcrypt from "bcryptjs";
import { z } from "zod";
import { airtable } from "~/server/utils/airtable";
import { SignJWT } from "jose/jwt/sign";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const loginParseResult = loginSchema.safeParse(body);

  if (!loginParseResult.success) {
    console.error("Invalid login params:", loginParseResult.error);
    throw createError({
      statusCode: 401,
      statusMessage: "L'adresse email ou le mot de passe est incorrect.",
    });
  }

  const { email, password } = loginParseResult.data;

  const [user] = await airtable("tblXBbJeIuDATbZ0r")
    .select({ filterByFormula: `{fldSl0elMfDrnO4jx} = "${email}"` })
    .firstPage();

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Email incorrect." });
  }

  const hashedPassword = user.fields["Password"];

  if (!hashedPassword) {
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur interne : Mot de passe introuvable.",
    });
  }

  const validPassword = await bcrypt.compare(password, hashedPassword);

  if (!validPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: "Mot de passe incorrect.",
    });
  }

  const loggedUser = {
    id: user.id,
    email: user.fields.Email,
    nom: user.fields.Nom,
    prenom: user.fields.Prenom,
    role: user.fields.Rôle,
  };

  const payload = {
    id: loggedUser.id,
    role: loggedUser.role,
  };

  const { JWT_SECRET } = useRuntimeConfig(event);

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30days")
    .sign(new TextEncoder().encode(JWT_SECRET));

  setCookie(event, "token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 30 * 24 * 60 * 60,
  });

  return { loggedUser };
});
