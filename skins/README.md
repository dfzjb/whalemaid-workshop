# 皮肤工坊收录说明

本仓库是「小鲸桌宠」皮肤（角色包）的在线分发索引站。收录流程见 [README](../README.md) 与 [审核标准](../审核标准.md)。

## 目录结构

```text
skins/<id>/
├── <version>.zip      # 皮肤包本体（pack-character 产物）
├── manifest.json      # 索引元数据（可选，缺省用占位）
└── thumbnail.png      # 缩略图原图（可选，Action 自动压缩到 ≤100KB）
```

## manifest.json 示例

```json
{
  "id": "gpt-girl",
  "displayName": "小绿（GPT娘）",
  "author": "像素桌宠项目组",
  "license": "CC-BY-NC-4.0",
  "summary": "85 帧全状态第二角色",
  "tags": ["maid", "pixel-art"],
  "stateCount": 36,
  "frameCount": 86,
  "official": true
}
```

## 索引自动重建

合并到 main 后 GitHub Action 自动执行：

1. `build-index.mjs` 扫描 `skins/**/*.zip` → 计算 sha256/size → 重建 `docs/index.json`
2. `verify-index.mjs` 校验 schema / id 唯一 / sha256 与 zip 一致
3. 提交索引变更 → 部署 GitHub Pages（docs/）
