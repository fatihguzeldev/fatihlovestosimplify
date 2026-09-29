import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const excluded = new Set(['node_modules', '.git', 'dist', 'output', 'plans']);

export function discoverProjects(directory = root) {
  const projects = [];
  function visit(relative) {
    for (const entry of readdirSync(path.join(directory, relative), { withFileTypes: true })) {
      const child = path.posix.join(relative, entry.name);
      if (entry.isDirectory() && !excluded.has(entry.name) && !entry.name.startsWith('.')) {
        visit(child);
      } else if (entry.isFile() && entry.name === 'project.ts') {
        projects.push(child);
      }
    }
  }
  visit('');
  return projects.sort();
}

export function selectProject(input, projects = discoverProjects()) {
  const requested = input?.replace(/^\.\//, '').replace(/^\//, '');
  if (!requested) {
    if (projects.length === 1) return projects[0];
    throw new Error(`Choose a video with --project <path/to/project.ts>: ${projects.join(', ')}`);
  }
  const project = projects.find((file) => file === requested || file === `${requested}.ts`);
  if (!project) throw new Error(`Unknown project: ${input}`);
  return project;
}

export function outputPaths(
  project,
  outputRoot = process.env.RENDER_OUTPUT_DIR || path.join(root, 'output'),
) {
  const relative = path.dirname(project);
  return {
    directory: path.resolve(outputRoot, '.segments', relative),
    finalFile: path.resolve(outputRoot, `${relative}.mp4`),
  };
}

export function projectArgument() {
  const index = process.argv.indexOf('--project');
  if (index !== -1 && !process.argv[index + 1]) throw new Error('Missing --project value.');
  return selectProject(index === -1 ? undefined : process.argv[index + 1]);
}
