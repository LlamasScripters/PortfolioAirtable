// server/api/projects/[id].get.js

import { airtable } from '~/server/utils/airtable';
import { mapAirtableProjetToProject } from '~/server/api/projects/map-airtable-projet-to-project';

export default defineEventHandler(async (event) => {
  const name = decodeURIComponent(event.context.params.id);

  try {
    const records = await airtable('Projet').select({
      filterByFormula: `{Nom} = "${name}"`
    }).firstPage();

    if (!records || records.length === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Project not found' });
    }

    const project = mapAirtableProjetToProject(records[0]);

    console.log('Project récupéré :', project);
    return project;

  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Erreur serveur' });
  }
});

