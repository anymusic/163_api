# Anymusic_api

## 用处

- 根据关键字搜索歌曲（包括网易云音乐、虾米音乐以及 QQ 音乐）
- 获取具体歌曲试听地址

## 使用方式 

```bash
# 依赖安装
$ npm install

# 开发环境
$ npm run dev

# 部署
$ npm run prd
```

默认开启 3333 端口，如需其他端口，可以加上 `PORT=xxxx`：

```
$ PORT=4444 npm run dev
$ PORT=4444 npm run prd
```

## API

### 根据关键字搜索歌曲

请求格式：

```
/api/:platform/search?keywords=xx&page=xx&limit=xx
```

- `:platform` 可填 `163`，`xiami` 或者 `qq`，分别对应 网易云音乐，虾米以及 QQ 音乐
- `keywords` 填写关键字（必填）
- `page` 表示分页（选填，默认 1）
- `limit` 表示每页数据（选填，默认 20，由于第三方服务器对该请求有限制，建议使用默认值）

举例：

```
http://localhost:3333/api/qq/search?keywords=林俊杰&page=1
```

返回内容（songs 数组应该是 20 项，此处省略）：

```json
{
  "data": {
    "songs": [
      {
        "id": "001XDFDe27VfFd",
        "name": "御龙三国志",
        "album": "天美十年典藏：全明星音乐特辑",
        "artist": "林俊杰",
        "platform": "qq"
      },
      {
        "id": "0013CxwQ4DRfLX",
        "name": "不能说的秘密 (Live)",
        "album": "梦想的声音第三季 第1期",
        "artist": "林俊杰",
        "platform": "qq"
      }
    ],
    "total": 398,
    "limit": 30,
    "page": 1
  },
  "status": 0
}
```

- `status` 代表该请求状态，如果是 0 则表示成功，失败则返回 1
- `data` 为返回数据
  - `songs` 为歌曲信息
    - `id` 为歌曲 id，用于下个 api 请求歌曲试听链接
    - `name` 为歌曲名
    - `album` 为歌曲所属专辑或其出处
    - `artist` 为该歌曲歌手
    - `platform` 为该歌曲所在平台（`163`，`xiami` 或者 `qq`）
  - `total` 为根据关键字所搜索结果的总数
  - `limit` 同请求时定义
  - `page` 同请求时定义

### 获取具体歌曲试听地址

请求格式：

```
/api/:platform/music/url?id=xx
```

- `:platform` 同上
- `:id` 为歌曲 id，即根据关键字搜索结果中的 id

举例：

```
http://localhost:3333/api/qq/music/url?id=001XDFDe27VfFd
```

返回内容：

```json
{
  "url": "http://dl.stream.qqmusic.qq.com/C400001XDFDe27VfFd.m4a?vkey=D6D18B2AEB3BA80EEEFDE192D8E9831F876BA06F3269AE7BBD63F47C4AA6305AA7AA6D46E0C080A4138E0DE3EF8ED8FE6E734F8AEDF54114&uin=1297716249&fromtag=0&guid=7332953645",
  "status": 0
}
```

- `status` 代表该请求状态，如果是 0 则表示成功，失败则返回 1
- `url` 表示歌曲试听地址

## 参考

感谢以下仓库作者

- [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)
- [listen1_chrome_extension](https://github.com/listen1/listen1_chrome_extension)
