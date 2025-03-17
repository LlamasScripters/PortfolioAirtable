export const useTechnologies = async () => {
  const technologiesFetchResult = await useFetch("/api/technologies");
  return technologiesFetchResult;
};
