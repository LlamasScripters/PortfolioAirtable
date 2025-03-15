import Airtable from 'airtable'
console.log(process.env.AIRTABLE_API_KEY)

// Airtable.configure({
//   apiKey: process.env.AIRTABLE_API_KEY,
// })

export const airtable = Airtable.base('app3D5w7tTwAbc5zU')