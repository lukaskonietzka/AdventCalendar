import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { validateCalendarContent } from './content-validator.mjs';

const contentDirectory = join(process.cwd(), 'src', 'content');

try {
  const files = (await readdir(contentDirectory)).filter((file) =>
    file.endsWith('.json'),
  );
  const errors = [];
  for (const file of files) {
    try {
      const content = JSON.parse(
        await readFile(join(contentDirectory, file), 'utf8'),
      );
      errors.push(...validateCalendarContent(content, file));
    } catch (error) {
      errors.push(`${file}: invalid JSON (${error.message}).`);
    }
  }

  if (errors.length > 0) throw new Error(`\n${errors.join('\n')}`);
  console.log(`Validated ${files.length} content file(s).`);
} catch (error) {
  console.error('Content validation failed:', error);
  process.exitCode = 1;
}
