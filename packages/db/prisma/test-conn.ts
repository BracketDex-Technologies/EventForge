import { PrismaClient } from '@prisma/client';

async function testUrl(name: string, url: string | undefined) {
  console.log(`Testing ${name}: ${url ? 'defined' : 'undefined'}`);
  if (!url) return;
  const prisma = new PrismaClient({
    datasources: {
      db: { url }
    }
  });
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`;
    console.log(`✅ ${name} Success:`, result);
  } catch (err) {
    console.error(`❌ ${name} Failed:`, err);
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  await testUrl('DATABASE_URL', process.env.DATABASE_URL);
  await testUrl('DIRECT_DATABASE_URL', process.env.DIRECT_DATABASE_URL);
}
main()
  .catch(console.error);
