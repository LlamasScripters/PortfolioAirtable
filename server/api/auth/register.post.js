import bcrypt from 'bcryptjs'
import { airtable } from '~/server/utils/airtable'

export default defineEventHandler(async (event) => {
  const { email, password, nom, prenom } = await readBody(event)

  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await airtable('tblXBbJeIuDATbZ0r')
    .select({ filterByFormula: `{fldSl0elMfDrnO4jx} = "${email}"` })
    .firstPage()

  if (existingUser.length) {
    throw createError({ statusCode: 400, statusMessage: 'Email déjà utilisé.' })
  }

  const newUser = await airtable('tblXBbJeIuDATbZ0r').create({
    fldSl0elMfDrnO4jx: email,
    fldWfTHQhW8wu3gLZ: hashedPassword,
    fld0PG3UOZoHccKMo: nom,
    fldEmXMOhr14XlNit: prenom,
    fldJmzJVp8frfUpLq: ['Administrateur'], 
  })

  return { id: newUser.id, email }
})
