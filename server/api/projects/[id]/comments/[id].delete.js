import { airtable } from "~/server/utils/airtable";
import { z } from "zod";
import AirtableError from "airtable/lib/airtable_error";


export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, "id", { decode: true });

    if (!id) {
        setResponseStatus(event, 404);
        return;
    }

    try {
        const record = await airtable("tblqtA6q0zT4bpCXQ").find(id);
        if (!record) {
            throw createError({
                statusCode: 404,
                statusMessage: "Comment not found",
            });
        }

        await airtable("tblqtA6q0zT4bpCXQ").destroy(id);

        return { message: "Comment deleted successfully" };

    } catch (error) {
        if (error instanceof AirtableError) {
            throw createError({
                statusCode: error.statusCode,
                message: error.statusCode === 404 ? "Comment not found" : error.message,
            });
        }
    }
});