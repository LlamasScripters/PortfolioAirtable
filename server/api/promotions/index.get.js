export default defineEventHandler(async () => {
    const promotions = await airtable('Promotion').select().all()
    return promotions
  })