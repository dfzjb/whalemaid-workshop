#!/usr/bin/env node
// 校验 docs/index.json：schema v1 字段完整、downloadUrl/sha256 与真实 zip 一致、id 唯一合法
// 用法: node .github/scripts/verify-index.mjs
import { readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');
const indexFile = path.join(repoRoot, 'docs/index.json');

const LICENSE_ENUM = new Set(['CC0', 'CC-BY-4.0', 'CC-BY-NC-4.0', 'MIT', 'CUSTOM', 'RIGHTS_RESERVED']);
const errors = [];

async function sha256(file) {
  const buf = await readFile(file);
  return createHash('sha256').update(buf).digest('hex');
}

const raw = await readFile(indexFile, 'utf8');
let index;
try { index = JSON.parse(raw); } catch (e) { console.error('index.json 不是合法 JSON'); process.exit(1); }

if (index.version !== 1) errors.push('version 必须为 1');
if (typeof index.updatedAt !== 'string') errors.push('updatedAt 缺失');

const seen = new Set();
for (const [i, s] of (index.skins ?? []).entries()) {
  const tag = `skins[${i}] (${s?.id ?? '?'})`;
  for (const k of ['id', 'displayName', 'author', 'version', 'license', 'summary', 'downloadUrl', 'sha256']) {
    if (typeof s?.[k] !== 'string' || !s[k]) errors.push(`${tag} 缺 ${k}`);
  }
  if (s?.id && !/^[a-z0-9][a-z0-9-]{1,31}$/.test(s.id)) errors.push(`${tag} id 非法`);
  if (s?.id && seen.has(s.id)) errors.push(`${tag} id 重复`);
  if (s?.id) seen.add(s.id);
  if (s?.license && !LICENSE_ENUM.has(s.license)) errors.push(`${tag} license 非法: ${s.license}`);
  if (s?.downloadUrl && !/^https?:\/\//.test(s.downloadUrl)) errors.push(`${tag} downloadUrl 非法`);
  if (s?.sizeBytes !== undefined && (!Number.isInteger(s.sizeBytes) || s.sizeBytes <= 0)) errors.push(`${tag} sizeBytes 非法`);

  // sha256 与本地 zip 一致性（zip 在仓库内时校验）
  if (s?.downloadUrl?.includes('/skins/')) {
    try {
      const m = s.downloadUrl.match(/\/skins\/([^/]+)\/([^/]+)\.zip$/);
      if (m) {
        const zipPath = path.join(repoRoot, 'skins', m[1], `${m[2]}.zip`);
        const actual = await sha256(zipPath);
        if (actual !== s.sha256) errors.push(`${tag} sha256 与 zip 不符`);
        const st = await stat(zipPath);
        if (st.size !== s.sizeBytes) errors.push(`${tag} sizeBytes 与 zip 不符`);
      }
    } catch { errors.push(`${tag} 本地 zip 不存在，无法校验`); }
  }
}

if (errors.length) {
  console.error('校验失败:');
  for (const e of errors) console.error('  -', e);
  process.exit(1);
}
console.log(`index.json 校验通过: ${index.skins.length} skin(s)`);
