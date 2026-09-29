import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { discoverProjects, outputPaths, selectProject } from './projects.mjs';

test('discovers videos in any series, excluding dependencies and generated output', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'video-projects-'));
  try {
    const files = [
      'ddia/01/operational-vs-analytical-systems/project.ts',
      'ne ulan bu/redis cache/project.ts',
      'new-series/02/example/project.ts',
      'new-series/node_modules/dependency/project.ts',
      'output/copy/project.ts',
    ];
    for (const file of files) {
      await mkdir(path.dirname(path.join(root, file)), { recursive: true });
      await writeFile(path.join(root, file), '');
    }
    assert.deepEqual(discoverProjects(root), files.slice(0, 3).sort());
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('mirrors the video folder beneath the output root, with isolated segment caches', () => {
  const root = '/tmp/video-output';
  const ddia = outputPaths('ddia/01/operational-vs-analytical-systems/project.ts', root);
  assert.equal(ddia.finalFile, `${root}/ddia/01/operational-vs-analytical-systems.mp4`);
  const first = outputPaths('series one/01/example/project.ts', root);
  const second = outputPaths('series two/01/example/project.ts', root);
  assert.equal(first.finalFile, `${root}/series one/01/example.mp4`);
  assert.notEqual(first.directory, second.directory);
  assert.notEqual(first.finalFile, second.finalFile);
});

test('selects only known projects and requires a choice when there are several', () => {
  const projects = ['ddia/01/example/project.ts', 'new series/02/example/project.ts'];
  assert.equal(selectProject(undefined, [projects[0]]), projects[0]);
  assert.equal(selectProject('/new series/02/example/project', projects), projects[1]);
  assert.equal(selectProject('./ddia/01/example/project.ts', projects), projects[0]);
  assert.throws(() => selectProject(undefined, projects), /--project/);
  assert.throws(() => selectProject('../outside/project.ts', projects), /Unknown project/);
});
