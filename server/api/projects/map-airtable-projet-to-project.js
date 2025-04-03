// Project: map AirtableProjet to Project

/**
 * @typedef {{
 * url: string,
 * width: number,
 * height: number
 * }} AirtableImageThumbnail
 */

/**
 * @typedef {{
 * id: string,
 * width: number,
 * height: number,
 * url: string,
 * filename: string,
 * size: number,
 * type: string,
 * thumbnails: {
 *   small: AirtableImageThumbnail,
 *   large: AirtableImageThumbnail,
 *   full: AirtableImageThumbnail
 * }
 * }} AirtableImage
 */

/**
 * @typedef {{
 * id: string,
 * fields: {
 * Nom: string,
 * Description: string,
 * Technologies: string[],
 * 'Lien Projet': string,
 * Promotion: string[],
 * Etudiant: string[],
 * 'Catégories': string[],
 * IsProjetVisible: boolean,
 * 'Nombre de like': number,
 * Visuels: AirtableImage[],
 * }
 * }} AirtableProjet
 */

/**
 * @typedef {{
 * id: string,
 * name: string,
 * description: string,
 * technologies: string[],
 * img: string,
 * url: string,
 * promotion: string,
 * likes: number
 * visible: boolean
 * }} Project
 */

/**
 * Maps an AirtableProjet object to a Project object
 * @param {AirtableProjet} airtableProjet
 * @returns {Project}
 */
export function mapAirtableProjetToProject(airtableProjet) {
  return {
    id: airtableProjet.id,
    name: airtableProjet.fields.Nom,
    description: airtableProjet.fields.Description,
    technologies: airtableProjet.fields.Technologies,
    img: airtableProjet.fields.Visuels?.[0]?.url || "",
    url: airtableProjet.fields["Lien Projet"],
    promotion: airtableProjet.fields.Promotion[0] ?? "N/A",
    likes: airtableProjet.fields["Nombre de like"],
    visible: airtableProjet.fields.IsProjetVisible,
  };
}
