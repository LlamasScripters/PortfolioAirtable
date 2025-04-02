import { airtable } from '~/server/utils/airtable';

export default defineEventHandler(async (event) => {
  const { id } = await readBody(event);

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing project ID' });
  }

  // Récupération du projet actuel depuis Airtable
  const currentProject = await airtable('Projet').find(id);

  if (!currentProject) {
    throw createError({ statusCode: 404, statusMessage: 'Project not found' });
  }

  const currentLikes = currentProject.fields['Nombre de like'] || 0;

  // Mise à jour du nombre de likes (+1)
  const updatedRecord = await airtable('Projet').update(id, {
    'Nombre de like': currentLikes + 1
  });

  return { likes: updatedRecord.fields['Nombre de like'] };
});
