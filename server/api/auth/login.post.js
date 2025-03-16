import bcrypt from 'bcryptjs'
import { airtable } from '~/server/utils/airtable'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  const [user] = await airtable('tblXBbJeIuDATbZ0r')
    .select({ filterByFormula: `{fldSl0elMfDrnO4jx} = "${email}"` })
    .firstPage()

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Email incorrect.' })
  }

  const hashedPassword = user.fields['Password'] 

  if (!hashedPassword) {
    throw createError({ statusCode: 500, statusMessage: 'Erreur interne : Mot de passe introuvable.' })
  }

  const validPassword = await bcrypt.compare(password, hashedPassword)

  if (!validPassword) {
    throw createError({ statusCode: 401, statusMessage: 'Mot de passe incorrect.' })
  }

  const loggedUser = {
    id: user.id,
    email: user.fields.Email,
    nom: user.fields.Nom,
    prenom: user.fields.Prenom,
    role: user.fields.Rôle
  }
  
  console.log(loggedUser)
  return { loggedUser }
})
