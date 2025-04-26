export default defineEventHandler((event) => {
  // Delete the token cookie
  deleteCookie(event, "token", {
    httpOnly: true,
    secure: true,
  });

  return {
    message: "Déconnecté avec succès",
  };
});
