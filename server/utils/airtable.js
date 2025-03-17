import Airtable from "airtable";
console.log(process.env.AIRTABLE_API_KEY);

// Airtable.configure({
//   apiKey: process.env.AIRTABLE_API_KEY,
// })

export const airtableConfig = {
  apiKey: process.env.AIRTABLE_API_KEY,
  baseId: "app3D5w7tTwAbc5zU",
  tables: {
    Promotion: "tblJOMoBrge6JVJLD",
    Projet: "tbleuWV8Bu2aaPIFq",
    Utilisateur: "tblXBbJeIuDATbZ0r",
    Technologie: "tbleKvC3U1t4pElc1",
  },
};

export const airtable = Airtable.base(airtableConfig.baseId);
