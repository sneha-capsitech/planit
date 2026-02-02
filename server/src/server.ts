import app from './app';
import { connectDB } from './config/db';

import 'dotenv/config';

const port = Number(process.env.PORT || 5000);

async function main() {
  await connectDB();
  app.listen(port, () => console.log(`API running on http://localhost:${port}`));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
