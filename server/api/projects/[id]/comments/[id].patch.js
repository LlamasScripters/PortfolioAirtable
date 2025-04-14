import { airtable } from "~/server/utils/airtable";
import { z } from "zod";
import AirtableError from "airtable/lib/airtable_error";

const updateCommentBodySchema = z.object({
    id: z.string().min(1, "ID commentaire requis"),
    contenu: z.string().min(1, "Commentaire requis"),
});

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, "id", { decode: true });

    if (!id) {
        setResponseStatus(event, 404);
        return;
    }

    const eventBody = await readBody(event);

    const bodyParseResult = updateCommentBodySchema.safeParse(eventBody);

    if (!bodyParseResult.success) {
        setResponseStatus(event, 422);
        return bodyParseResult.error.flatten().fieldErrors;
    }

    const body = bodyParseResult.data;

    try {
        const { id: commentId, contenu } = body;
        const record = await airtable("tblqtA6q0zT4bpCXQ").find(commentId);
        if (!record) {
            throw createError({
                statusCode: 404,
                statusMessage: "Comment not found",
            });
        }

        const updatedComment = await airtable("tblqtA6q0zT4bpCXQ").update(commentId, { 
            fldcSvBzLfDrZwxsh: contenu,
            fld9Ep4nuARSnfPSM: new Date().toISOString(),
        });

        return updatedComment;

    } catch (error) {
        if (error instanceof AirtableError) {
            throw createError({
                statusCode: error.statusCode,
                message: error.statusCode === 404 ? "Comment not found" : error.message,
            });
        }
    }
});