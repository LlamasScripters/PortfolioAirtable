import { airtable } from "~/server/utils/airtable";
import { z } from "zod";
import AirtableError from "airtable/lib/airtable_error";

const createCommentBodySchema = z.object({
    content: z.string().min(1, "Commentaire requis"),
});

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, "id", { decode: true });

    if (!id) {
        setResponseStatus(event, 404);
        return;
    }

    const eventBody = await readBody(event);

    const bodyParseResult = createCommentBodySchema.safeParse(eventBody);

    if (!bodyParseResult.success) {
        setResponseStatus(event, 422);
        return bodyParseResult.error.flatten().fieldErrors;
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

        const comments = record.get("Commentaires") || [];

        comments.push(body.content);

        await record.update({
            Commentaires: comments,
        });

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