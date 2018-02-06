# Contribute

## 日常开发

```
npm run build
```

## 发布前

1. 修改 `package.json` 中的 `version`, 可以使用 `npm version`
2. 修改 `CHANGELOG.md`

然后运行如下命令

```
npm run release
```

提交代码，打 Tag

```
git add .
git commit
git tag vx.x.x
```

发布到 NPM

```
npm publish --access=public
```

推送到 GitHub

```
git push origin master
git push origin --tags
```
