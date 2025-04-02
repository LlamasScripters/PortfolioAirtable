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
  const queryParseResult = await getValidatedQuery(event, (query) =>
    projectsQuerySchema.safeParse(query)
  );

  if (!queryParseResult.success) {
    console.error("Invalid query params:", queryParseResult.error);

    // Invalid query params means we should return an empty array
    return [];
  }

  const { technologies } = queryParseResult.data;

  const queryOptions = {
    view: airtableConfig.tables.Projet.views.default,
  };

  if (technologies && technologies.length > 0) {
    const technologyFilters = technologies.map(
      (tech) => `FIND('${tech}', ARRAYJOIN({Technologies}, ",")) > 0`
    );

    queryOptions.filterByFormula = `OR(${technologyFilters.join(",")})`;
  }

  const airtableProjects = await airtable(airtableConfig.tables.Projet.id)
    .select(queryOptions)
    .all();

  const projects = airtableProjects.map((airtableProject) =>
    mapAirtableProjetToProject(airtableProject)
  );

  return projects;
});
