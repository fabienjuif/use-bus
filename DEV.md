# DEV notes

## Release a new version

1. Edit version in package.json
2. Run `yarn build`
3. Publish `cd pkg && npm publish && cd -`
4. Commit and push

```sh
git add .
git commit -m ':bookmark: v'
git push
```
