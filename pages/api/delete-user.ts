import { Client, Users } from "node-appwrite";

export default async function handler(
  req: { method: string; body: { userId: any } },
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: { (arg0: { error?: any; success?: boolean }): any; new (): any };
    };
  }
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Nur POST erlaubt" });
  }

  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "❗ userId fehlt" });
  }

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

  const users = new Users(client);

  try {
    await users.delete(userId);
    return res.status(200).json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
