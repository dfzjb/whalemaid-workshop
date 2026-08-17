#!/usr/bin/env node
// 扫描 skins/<id>/<version>.zip → 重建 docs/index.json（v1 schema）
// 用法: node .github/scripts/build-index.mjs
import { readdir, readFile, stat, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');
const skinsDir = path.join(repoRoot, 'skins');
const docsDir = path.join(repoRoot, 'docs');
const indexFile = path.join(docsDir, 'index.json');

// 每个皮肤目录下放 manifest.json（作者或维护者提交）：
// { "id": "...", "displayName": "...", "author": "...", "license": "...",
//   "summary": "...", "tags": [...], "official": true/false }
// version 取 zip 文件名（<version>.zip）；zip 内 manifest 的 id 必须与目录一致（由 verify 强制）

async function sha256(file) {
  const buf = await readFile(file);
  return createHash('sha256').update(buf).digest('hex');
}

async function main() {
  await mkdir(docsDir, { recursive: true });
  const skins = [];

  let dirs = [];
  try {
    dirs = await readdir(skinsDir, { withFileTypes: true });
  } catch {
    dirs = [];
  }

  for (const d of dirs) {
    if (!d.isDirectory()) continue;
    const id = d.name;
    if (!/^[a-z0-9][a-z0-9-]{1,31}$/.test(id)) continue;
    const idDir = path.join(skinsDir, id);
    const zips = (await readdir(idDir)).filter((f) => f.endsWith('.zip'));
    if (zips.length === 0) continue;
    // 取最高版本 zip
    zips.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    const version = zips[zips.length - 1].replace(/\.zip$/, '');
    const zipPath = path.join(idDir, `${version}.zip`);
    const sizeBytes = (await stat(zipPath)).size;
    const hash = await sha256(zipPath);

    // manifest.json 可选；缺省用 id 生成占位
    let manifest = {};
    try {
      manifest = JSON.parse(await readFile(path.join(idDir, 'manifest.json'), 'utf8'));
    } catch { /* optional */ }

    const downloadUrl = `https://dfzjb.github.io/whalemaid-workshop/skins/${id}/${version}.zip`;
    const thumbnail = `thumbnails/${id}.png`;

    skins.push({
      id: manifest.id ?? id,
      displayName: manifest.displayName ?? id,
      author: manifest.author ?? 'unknown',
      version,
      license: manifest.license ?? 'CC-BY-NC-4.0',
      summary: manifest.summary ?? '',
      tags: manifest.tags ?? [],
      stateCount: manifest.stateCount,
      frameCount: manifest.frameCount,
      thumbnail,
      downloadUrl,
      sha256: hash,
      sizeBytes,
      uploadedAt: new Date().toISOString(),
      official: manifest.official ?? false,
    });
  }

  skins.sort((a, b) => a.id.localeCompare(b.id));
  const index = {
    version: 1,
    updatedAt: new Date().toISOString(),
    skins,
  };
  await writeFile(indexFile, JSON.stringify(index, null, 2) + '\n', 'utf8');
  console.log(`index.json rebuilt: ${skins.length} skin(s)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
