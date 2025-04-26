/**
 * @param {import("~/server/api/projects/index.get").ProjectsQuery} searchParams
 */
export const useProjects = (searchParams = {}) => {
  const { technologies = [] } = searchParams;

  const headers = useRequestHeaders(["cookie"]);

  const query = {};

  if (technologies && technologies.length > 0) {
    query.technologies = technologies;
  }

  const projectsFetchResult = useFetch("/api/projects", {
    query,
    key: "projects",
    headers,
  });

  return projectsFetchResult;
};
