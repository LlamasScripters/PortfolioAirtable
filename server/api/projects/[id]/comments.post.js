import { airtable } from "~/server/utils/airtable";
import { z } from "zod";
import AirtableError from "airtable/lib/airtable_error";

const createCommentBodySchema = z.object({
    contenu: z.string().min(1, "Commentaire requis"),
    user: z.object({
        id: z.string().min(1, "ID utilisateur requis"),
        nom: z.string().min(1, "Nom requis"),
        prenom: z.string().min(1, "Prénom requis"),
        role: z.array(z.string()).min(1, "Rôle requis"),
    }).optional(),
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
        const { user, contenu } = body;
        if (!user.role.includes("Administrateur")) {
            throw createError({ statusCode: 403, statusMessage: "Accès refusé" });
        }

        const record = await airtable("Projet").find(id);
        if (!record) {
            throw createError({
                statusCode: 404,
                statusMessage: "Project not found",
            });
        }

        const newComment = await airtable("tblqtA6q0zT4bpCXQ").create({ 
            fldcSvBzLfDrZwxsh: contenu,
            fldiWk9BsRrwbIav6: [record.id],
            fldJ8TBUIChUKhVOi: [user.id],
        })

        return newComment;

    } catch (error) {
        if (error instanceof AirtableError) {
            throw createError({
                statusCode: error.statusCode,
                message: error.statusCode === 404 ? "Project not found" : error.message,
            });
        }
    }
});
