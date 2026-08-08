import type { VercelRequest, VercelResponse } from "@vercel/node";
import { app } from "../src/app.js";
import { connectDatabase } from "../src/config/database.js";
import { initFirebaseAdmin } from "../src/config/firebase.js";

let ready: Promise<void> | null = null;

function ensureInitialized(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      await connectDatabase();
      initFirebaseAdmin();
    })();
  }
  return ready;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ensureInitialized();
  return app(req as never, res as never);
}
