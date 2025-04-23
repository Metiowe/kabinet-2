// lib/appwrite.js

import { Client, Account } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // ⛔️ Oder dein Selfhost: http://localhost:8090/v1
  // .setProject("66e6c1540027dbae0e79"); // 🆔 Project-ID aus Appwrite-Dashboard
  .setProject("6807afaa003e6d4f2148"); // 🆔 Project-ID aus Appwrite-Dashboard leichtes

const account = new Account(client);

export { account };
