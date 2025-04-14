import { airtable } from "~/server/utils/airtable";
import AirtableError from "airtable/lib/airtable_error";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id", { decode: true });

  if (!id) {
    setResponseStatus(event, 404);
    return;
  }

  try {
    const record = await airtable("Projet").find(id);

    if (!record) {
      throw createError({
        statusCode: 404,
        statusMessage: "Project not found",
      });
    }

    const comments = record.get("CommentairesProjet") || [];

    return comments;
  } catch (error) {
    if (error instanceof AirtableError) {
      throw createError({
        statusCode: error.statusCode,
        message: error.statusCode === 404 ? "Project not found" : error.message,
      });
    }
  }
}

);
