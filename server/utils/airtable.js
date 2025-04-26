import Airtable from "airtable";
// console.log(process.env.AIRTABLE_API_KEY);

// Airtable.configure({
//   apiKey: process.env.AIRTABLE_API_KEY,
// })

export const airtableConfig = {
  apiKey: process.env.AIRTABLE_API_KEY,
  baseId: "app3D5w7tTwAbc5zU",
  tables: {
    Promotion: "tblJOMoBrge6JVJLD",
    Projet: {
      id: "tbleuWV8Bu2aaPIFq",
      views: {
        all: "viwgbC7Ro9qXhX6h5",
        onlyVisible: "viwhEvK5Q5gXQs6Gn",
        onlyNonVisible: "viwjNyOt1SEHindDc",
      },
    },
    Utilisateur: "tblXBbJeIuDATbZ0r",
    Technologie: "tbleKvC3U1t4pElc1",
    CommentairesProjet: "tblqtA6q0zT4bpCXQ",
  },
};

export const airtable = Airtable.base(airtableConfig.baseId);
