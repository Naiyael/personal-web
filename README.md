# Naiyael Trace | 个人博客

一个可直接部署到 GitHub Pages 的静态个人博客首页，带有粒子动画、深色模式、音乐播放功能。

## 文件结构

```
├── index.html      页面结构（可在此添加 / 修改导航项目）
├── styles.css      样式（深色模式变量、动画、响应式）
├── script.js       交互逻辑（粒子、文章渲染、音乐播放、主题切换）
├── assets/
│   ├── avatar.jpg  个人头像
│   └── icons/      各技术栈图标（SVG）
├── posts/          文章目录（每篇文章一个 .html 文件）
└── music/          音乐目录（放入 .mp3 后即可播放）
```

## 添加 MP3 音乐

1. 将 `.mp3` 文件放入 `music/` 文件夹
2. 在 `script.js` 的 `tracks` 数组里添加：

```js
{
  title: "歌曲名",
  artist: "歌手名",
  src: "music/文件名.mp3",
}
```

3. 推送到 GitHub，访客即可在首页右下角看到音乐播放器

## 添加文章

1. 在 `posts/` 下新建 `.html` 文件作为文章内容页
2. 在 `script.js` 的 `posts` 数组里添加文章元信息：

```js
{
  title: "文章标题",
  date: "2026-05-14",
  updated: "2026-05-14",
  tags: ["标签1", "标签2"],
  cover: "linear-gradient(135deg, #颜色1, #颜色2)",
  summary: "文章摘要（显示在卡片上）",
  url: "posts/文章文件名.html",  // 可选，不填则不显示"阅读全文"
}
```

## GitHub Pages 部署

1. 在 GitHub 创建一个仓库
2. 把当前目录内容提交并推送到仓库
3. 进入仓库 `Settings → Pages`
4. Source 选择 `Deploy from a branch`，Branch 选择 `main / root`
5. 如果要绑定自己的域名，在 Pages 的 `Custom domain` 里填写域名

如果使用自定义域名，建议在仓库根目录添加 `CNAME` 文件，内容只写你的域名：

```
example.com
```
