// import { airtableConfig } from "~/server/utils/airtable";

const mockTechnologies = [
  {
    id: "rec1",
    name: "JavaScript",
    icon: "https://cdn.iconscout.com/icon/free/png-256/javascript-2752148-2284965.png",
  },
  {
    id: "rec2",
    name: "React",
    icon: "https://cdn.iconscout.com/icon/free/png-256/react-3-1175109.png",
  },
  {
    id: "rec3",
    name: "Node.js",
    icon: "https://cdn.iconscout.com/icon/free/png-256/nodejs-2-226035.png",
  },
  {
    id: "rec4",
    name: "Python",
    icon: "https://cdn.iconscout.com/icon/free/png-256/python-2-226051.png",
  },
  {
    id: "rec5",
    name: "Docker",
    icon: "https://cdn.iconscout.com/icon/free/png-256/docker-226091.png",
  },
];

export default defineEventHandler(async () => {
  // const technologies = await airtable(airtableConfig.tables.Technologie)
  //   .select()
  //   .all();

  // const responseBody = technologies.map((technology) => ({
  //   id: technology.id,
  //   name: technology.fields.Nom,
  //   icon: technology.fields.Icône.at(-1).url,
  // }));

  // return responseBody;
  return mockTechnologies;
});
