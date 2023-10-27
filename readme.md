# url-asset-size

> Get the size of javascript and css of a website

Usage:

```
npx @jantimon/url-asset-size https://www.github.com

Stats for https://www.github.com

JavaScript download size (50 files)
Raw size: 1,744,226 bytes
Gzip size: 278,621 bytes

CSS download size (11 files)
Raw size: 1,114,168 bytes
Gzip size: 86,877 bytes

```

```
npx @jantimon/url-asset-size https://www.github.com --json
{
  "js": {
    "count": 50,
    "raw": 1744226,
    "gzip": 280056
  },
  "css": {
    "count": 11,
    "raw": 1114168,
    "gzip": 134526
  }
}
```