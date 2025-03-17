export const useProjects = async () => {
  const projectsFetchResult = await useFetch("/api/projects");
  return projectsFetchResult;
};
