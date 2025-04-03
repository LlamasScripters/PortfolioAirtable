export const useTechnologies = async () => {
  const technologiesFetchResult = await useFetch("/api/technologies", {
    key: "technologies",
  });
  return technologiesFetchResult;
};
