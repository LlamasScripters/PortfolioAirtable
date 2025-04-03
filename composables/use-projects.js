/**
 * @param {import("~/server/api/projects/index.get").ProjectsQuery} options
 */
export const useProjects = async (options = {}) => {
  const { technologies = [] } = options;

  const query = {};

  if (technologies && technologies.length > 0) {
    query.technologies = technologies;
  }

  const projectsFetchResult = await useFetch("/api/projects", {
    query,
    key: "projects",
  });

  return projectsFetchResult;
};
