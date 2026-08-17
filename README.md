# WhaleMaid 皮肤工坊（whalemaid-workshop）

「小鲸桌宠（WhaleMaid Desktop Pet）」的在线皮肤（角色包）分发索引站。

- **索引站**：https://dfzjb.github.io/whalemaid-workshop/
- **机器索引**：https://dfzjb.github.io/whalemaid-workshop/index.json （桌宠唯一消费的文件）
- **协议**：客户端下载 zip 后强制 sha256 校验 → 走角色包安装校验（pack-validator 四组规则），无代码执行面

## 目录结构

```text
docs/                        # GitHub Pages 站点根
├── index.json               # 机器索引（桌宠消费，见下方 schema）
├── thumbnails/<id>.png      # 卡片缩略图（≤100KB）
└── index.html               # （可选）人类浏览页
skins/<id>/<version>.zip     # 皮肤包本体（≥50MB 改挂 Releases，索引存 attach 链接）
submissions/                 # PR 工作区（合并前暂存）
.github/
├── workflows/build-index.yml    # PR 合并 → 校验 → 重建 index.json → 部署 Pages
├── ISSUE_TEMPLATE/publish.md    # 不会 git 的作者：Issue 表单
└── PULL_REQUEST_TEMPLATE.md     # 会 git 的作者：zip + manifest 摘要
```

## index.json schema（v1）

```jsonc
{
  "version": 1,
  "updatedAt": "ISO8601",
  "skins": [
    {
      "id": "gpt-girl",          // 与包内 character.id 一致，全局唯一
      "displayName": "小绿（GPT娘）",
      "author": "像素桌宠项目组",
      "version": "2.0.0",        // semver，同 id 升级判断依据
      "license": "CC-BY-NC-4.0",
      "summary": "85 帧全状态第二角色",  // ≤60 字
      "tags": ["maid", "pixel-art"],
      "stateCount": 36, "frameCount": 86,
      "thumbnail": "thumbnails/gpt-girl.png",
      "downloadUrl": "https://dfzjb.github.io/whalemaid-workshop/skins/gpt-girl/2.0.0.zip",
      "sha256": "…",
      "sizeBytes": 12345678,
      "uploadedAt": "ISO8601",
      "official": true
    }
  ]
}
```

## 如何收录新皮肤（维护者）

1. 作者按《角色包制作指南》制作并通过 `validate:pack` 自检，提交 zip 到 `skins/<id>/<version>.zip`（PR 或 Issue）
2. 按《审核标准.md》核对（pack-validator 通过 / license 合法 / id 不冲突 / 无 NSFW 侵权素材）
3. 合并 PR → GitHub Action 自动：校验 zip → 生成缩略图 → 计算 sha256/size → 重建 `docs/index.json` → 部署 Pages

## 许可

- 仓库代码/配置：MIT License（见 LICENSE）
- 各皮肤包的 license 以包内 manifest 与索引条目为准（默认推荐 CC BY-NC 4.0）
