---
name: 皮肤收录（Issue 通道）
about: 不会用 git 的作者，用此表单提交皮肤收录申请
title: '[皮肤] <皮肤名称>'
labels: ['skin-submission']
assignees: ''
---

## 皮肤信息

- **id**: （如 `my-char`，与包内 manifest 一致，小写字母数字连字符，≤32 字符）
- **displayName**: 
- **author**: 
- **version**: （semver，如 1.0.0）
- **license**: （CC0 / CC-BY-4.0 / CC-BY-NC-4.0 / MIT / CUSTOM / RIGHTS_RESERVED）
- **summary**: （≤60 字）
- **tags**: （逗号分隔，≤10 个）
- **stateCount / frameCount**: 
- **official**: （是否官方出品）

## 自检确认

- [ ] 本地 `validate:pack` 通过（0 错误）
- [ ] license 为枚举内；CUSTOM/RIGHTS_RESERVED 已附 NOTICE.txt
- [ ] 无 NSFW / 侵权素材

## 文件

- **zip 下载链接**：<请提供可直链下载的 zip 地址，或网盘/GitHub Release 链接>
- **缩略图**：<预览图链接>

> 维护者核对《审核标准.md》后入库：校验 zip → 生成缩略图 → 计算 sha256 → 重建 index.json → 部署 Pages。
