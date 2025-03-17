const mockProjects = [
  {
    id: "proj1",
    title: "Portfolio Website",
    description:
      "A modern portfolio website with dark theme and responsive design",
    tech: ["rec1", "rec2"], // JavaScript and React
    img: "https://picsum.photos/800/600?random=1",
    url: "https://portfolio.example.com",
  },
  {
    id: "proj2",
    title: "Backend API Service",
    description:
      "RESTful API service with authentication and database integration",
    tech: ["rec3", "rec4"], // Node.js and Python
    img: "https://picsum.photos/800/600?random=2",
    url: "https://api.example.com",
  },
  {
    id: "proj3",
    title: "Containerized Microservices",
    description:
      "Microservices architecture using containers and orchestration",
    tech: ["rec3", "rec5"], // Node.js and Docker
    img: "https://picsum.photos/800/600?random=3",
    url: "https://microservices.example.com",
  },
];

export default defineEventHandler(async () => {
  // const projects = await airtable(airtableConfig.tables.Projet).select().all();
  // return projects;
  return mockProjects;
});
