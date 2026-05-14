# NeoLog Personal Blog

一个可直接部署到 GitHub Pages 的静态个人博客首页。

## 文件结构

- `index.html`：页面结构
- `styles.css`：科技简约风格样式
- `script.js`：鼠标拖动粒子效果

## GitHub Pages 部署

1. 在 GitHub 创建一个仓库。
2. 把当前目录内容提交并推送到仓库。
3. 进入仓库 `Settings -> Pages`。
4. Source 选择 `Deploy from a branch`，Branch 选择 `main / root`。
5. 如果要绑定自己的域名，在 Pages 的 `Custom domain` 里填写域名。

如果使用自定义域名，建议在仓库根目录添加 `CNAME` 文件，内容只写你的域名，例如：

```txt
example.com
```
