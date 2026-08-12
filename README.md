# Academic Jekyll Homepage

这个版本是 GitHub Pages / Jekyll 项目结构，接近你截图里的学术主页仓库组织方式。

## 目录说明

- `_config.yml`: GitHub Pages / Jekyll 配置。
- `index.md`: 首页内容，主要用 Markdown 编辑。
- `_data/profile.yml`: 姓名、学校、邮箱、头像、GitHub、Google Scholar 等个人信息。
- `_data/navigation.yml`: 左侧导航链接。
- `_layouts/`: 页面外壳模板。
- `_includes/`: 可复用组件，例如侧边栏和论文卡片。
- `_pages/`: 独立页面，例如 Publications。
- `_publications/`: 每篇论文一个 Markdown 文件。
- `_posts/`: 博客或新闻文章，可不用。
- `assets/css/main.css`: 页面样式。
- `assets/images/`: 头像和论文缩略图。
- `files/`: CV、PDF、补充材料等文件。

## 部署方式

把本目录下所有文件上传到 `izhe666.github.io` 仓库根目录。GitHub Pages 会自动用 Jekyll 构建。

仓库根目录应该看到这些文件和文件夹：

```text
_config.yml
_data/
_includes/
_layouts/
_pages/
_publications/
_posts/
_sass/
assets/
files/
index.md
Gemfile
README.md
```

部署成功后访问：

```text
https://izhe666.github.io/
```

## 平时怎么改

- 改个人资料：编辑 `_data/profile.yml`。
- 改首页文字、News、服务和兴趣：编辑 `index.md`。
- 添加论文：在 `_publications/` 里复制一个 `.md` 文件并修改 front matter。
- 替换头像：把头像放到 `assets/images/`，然后修改 `_data/profile.yml` 的 `avatar`。
- 添加 CV：把 PDF 放到 `files/cv.pdf`，然后把 `_data/profile.yml` 中的 `cv` 改成 `/files/cv.pdf`。
