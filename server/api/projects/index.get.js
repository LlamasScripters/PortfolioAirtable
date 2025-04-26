import { z } from "zod";
import { mapAirtableProjetToProject } from "./map-airtable-projet-to-project";
import { checkIsAdmin } from "~/utils/auth/check-is-admin";
import { checkToken } from "../../utils/auth/check-token";

const projectsQuerySchema = z.object({
  technologies:
    // union to handle query params with single value in technologies
    z
      .union([z.string().transform((str) => [str]), z.array(z.string())])
      .optional(),
  show: z.enum(["all", "onlyVisible", "onlyNonVisible"]).default("all"),
});

const payloadSchema = z.object({
  id: z.string(),
  role: z.array(z.string()),
});

/**
 * @typedef {z.infer<typeof projectsQuerySchema>} ProjectsQuery
 */

export default defineEventHandler(async (event) => {
  const { JWT_SECRET } = useRuntimeConfig(event);
  const token = getCookie(event, "token");

  const payload = await checkToken(token, JWT_SECRET);

  const isValidPayload = payloadSchema.safeParse(payload).success;

  const isAdmin = isValidPayload && checkIsAdmin(payload);

  const queryParseResult = await getValidatedQuery(event, (query) =>
    projectsQuerySchema.safeParse(query)
  );

  if (!queryParseResult.success) {
    console.error("Invalid query params:", queryParseResult.error);

    // Invalid query params means we should return an empty array
    return [];
  }

  const query = queryParseResult.data;

  /**
   * Admin can see all projects, but non-admin can only see visible projects
   */
  const projectViewName = isAdmin ? query.show : "onlyVisible";

  const technologies = await $fetch("/api/technologies");

  const queryOptions = {
    view: airtableConfig.tables.Projet.views[projectViewName],
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
