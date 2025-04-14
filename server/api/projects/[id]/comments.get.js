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

    const commentsrecords = await airtable('CommentairesProjet').select({
      filterByFormula: `{Nom Projet} = "${record.fields.Nom}"`
    }).firstPage();

    // const commentsrecords = await airtable('CommentairesProjet').select({
    //   filterByFormula: `SEARCH("${id}", {Projet})`,
    // }).firstPage();

    const comments = commentsrecords.map((record) => {
      return {
        id: record.id,
        fields: record.fields,
      };
    });
    
    return {comments: comments};
    
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
