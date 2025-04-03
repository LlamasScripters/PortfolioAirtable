import { airtable } from "~/server/utils/airtable";
import { mapAirtableProjetToProject } from "~/server/api/projects/map-airtable-projet-to-project";
import { z } from "zod";
import AirtableError from "airtable/lib/airtable_error";

const updateProjectBodySchema = z
  .object({
    visible: z.boolean().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "Please provide at least one field to update"
  );

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id", { decode: true });

  if (!id) {
    setResponseStatus(event, 404);
    return;
    // throw createError({ statusCode: 404, message: "Missing project ID" });
  }

  const eventBody = await readBody(event);

  const bodyParseResult = updateProjectBodySchema.safeParse(eventBody);

  if (!bodyParseResult.success) {
    setResponseStatus(event, 422);
    return bodyParseResult.error.flatten().fieldErrors;
    // throw createError({
    //   statusCode: 422,
    //   data: bodyParseResult.error.flatten().fieldErrors,
    // });
  }

  const body = bodyParseResult.data;

  try {
    const record = await airtable("Projet").find(id);

    if (!record) {
      throw createError({
        statusCode: 404,
        statusMessage: "Project not found",
      });
    }

    const recordUpdated = await record.patchUpdate({
      IsProjetVisible: body.visible,
    });

    const projectUpdated = mapAirtableProjetToProject(recordUpdated);
    return projectUpdated;
  } catch (error) {
    if (error instanceof AirtableError) {
      throw createError({
        statusCode: error.statusCode,
        message: error.statusCode === 404 ? "Project not found" : error.message,
      });
    }
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : "Erreur serveur",
    });
  }
});
