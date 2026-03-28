# auto-cv

**Job Application Assistant（求职申请助手）** — 面向求职者的 Web 应用：在浏览器中编辑简历（Markdown）、粘贴职位描述（JD），获得结构化的匹配分析与改写建议；MVP 坚持本地优先、无需登录，数据默认保留在浏览器端。

当前仓库包含产品规格、UI 设计方向说明，以及 Pencil 中的高保真界面原型（`.pen`）。

## 文档

| 文档 | 说明 |
|------|------|
| [docs/job-resume-agent-mvp-spec.md](docs/job-resume-agent-mvp-spec.md) | MVP 产品规格：范围、原则、能力与明确非目标 |
| [docs/ui-agent.md](docs/ui-agent.md) | 桌面端 Web UI 方向与屏幕清单（供设计与实现对齐） |

## 仓库结构

```
auto-cv/
├── README.md
├── auto-cv.pen    # Pencil 设计稿（需在 Pencil 中打开编辑）
└── docs/          # 规格与 UI 说明
```

## 在 GitHub 上初始化远程仓库

本机未检测到 [GitHub CLI](https://cli.github.com/)（`gh`）。可按下面任一方式关联 GitHub。

### 方式 A：网页创建 + 推送

1. 在 GitHub 新建仓库：**https://github.com/new**  
   - Repository name 例如：`auto-cv`  
   - 不要勾选「Add a README」（本地已有历史时避免冲突）  
   - 创建后复制页面上的 **HTTPS** 或 **SSH** 地址。

2. 在本地项目目录执行（将 URL 换成你的仓库地址）：

   ```bash
   cd /Users/daniel/Workspace/auto-cv
   git remote add origin https://github.com/<你的用户名>/auto-cv.git
   git push -u origin main
   ```

   若 GitHub 默认分支是 `master`，可先执行：`git branch -M main` 再推送。

### 方式 B：安装 GitHub CLI 后一键创建

```bash
brew install gh
gh auth login
cd /Users/daniel/Workspace/auto-cv
gh repo create auto-cv --public --source=. --remote=origin --push
```

（若远程已存在，只需 `gh repo create` 时在网页创建后仅执行 `git remote add` + `git push`。）

## 许可

若尚未选择许可证，可在仓库 **Settings → General → License** 中补充，或在根目录添加 `LICENSE` 文件。
