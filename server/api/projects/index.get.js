import { z } from "zod";
import { mapAirtableProjetToProject } from "./map-airtable-projet-to-project";

const projectsQuerySchema = z.object({
  technologies:
    // union to handle query params with single value in technologies
    z
      .union([z.string().transform((str) => [str]), z.array(z.string())])
      .optional(),
});

/**
 * @typedef {z.infer<typeof projectsQuerySchema>} ProjectsQuery
 */

export default defineEventHandler(async (event) => {
  // const authorizationHeader = getRequestHeader(event, "Authorization")
  const queryParseResult = await getValidatedQuery(event, (query) =>
    projectsQuerySchema.safeParse(query)
  );

  if (!queryParseResult.success) {
    console.error("Invalid query params:", queryParseResult.error);

    // Invalid query params means we should return an empty array
    return [];
  }

  const technologies = await $fetch("/api/technologies");

  const query = queryParseResult.data;

  const queryOptions = {
    view: airtableConfig.tables.Projet.views.default,
  };

  if (query.technologies && query.technologies.length > 0) {
    const technologyFilters = query.technologies.map(
      (tech) => `FIND('${tech}', ARRAYJOIN({Technologies}, ",")) > 0`
    );

    queryOptions.filterByFormula = `OR(${technologyFilters.join(",")})`;
  }

  const airtableProjects = await airtable(airtableConfig.tables.Projet.id)
    .select({
      ...queryOptions,
    })
    .all();

  const projects = airtableProjects
    .map((airtableProject) => mapAirtableProjetToProject(airtableProject))
    .map((project) => ({
      ...project,
      technologies: project.technologies.map((tech) =>
        technologies.find((t) => t.id === tech)
      ),
    }));

  return projects;
});
