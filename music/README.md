# 本地音乐目录

把音乐文件放在这个目录，比如：

```txt
music/night-walk.mp3
```

然后打开 `script.js`，在 `tracks` 数组里添加：

```js
{
  title: "Night Walk",
  artist: "本地收藏",
  src: "music/night-walk.mp3",
}
```

推送到 GitHub 后，访客点击首页音乐方块里的“播放”按钮即可播放。
