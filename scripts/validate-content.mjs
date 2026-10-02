import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const contentDirectory = join(process.cwd(), 'src', 'content');

try {
  const files = (await readdir(contentDirectory)).filter((file) =>
    file.endsWith('.json'),
  );
  for (const file of files)
    JSON.parse(await readFile(join(contentDirectory, file), 'utf8'));
  console.log(`Validated ${files.length} content file(s).`);
} catch (error) {
  console.error('Content validation failed:', error);
  process.exitCode = 1;
}
