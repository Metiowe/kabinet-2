// pages/api/check-user.js
import supabaseAdmin from "@/lib/supabaseAdmin"; // <--- das muss rein

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "E-Mail erforderlich." });
  }

  const { data, error } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 100,
  });

  if (error) {
    return res
      .status(500)
      .json({ message: "Fehler beim Abrufen von Benutzern." });
  }

  const match = data.users.find(
    (user) => user.email?.toLowerCase() === email.toLowerCase()
  );

  if (!match) {
    return res.status(200).json({ exists: false });
  }

  const confirmed = !!match.email_confirmed_at;

  return res.status(200).json({ exists: true, confirmed });
}
