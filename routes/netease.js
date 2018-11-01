const router = require('koa-router')()

const {
  createWebAPIRequest,
  request
} = require('./../utils/util')

router.get('/163/search', async (ctx, next) => {
  const cookie = ctx.get('Cookie') ? ctx.get('Cookie') : ''
  const keywords = ctx.query.keywords
  const type = ctx.query.type || 1
  const limit = +ctx.query.limit || 20
  const page = ctx.query.page ? (+ctx.query.page ) : 1
  const offset = ctx.query.page ? (+ctx.query.page  - 1) * limit : 0

  // *(type)* 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频
  const data = {
    csrf_token: '',
    limit,
    type,
    s: keywords,
    offset
  }

  let res = await createWebAPIRequest(
    'music.163.com',
    '/weapi/search/get',
    'POST',
    data,
    cookie,
  )

  const songs = JSON.parse(res).result.songs.map(item => {
    return {
      id: item.id,
      name: item.name,
      album: item.album.name,
      artist: item.artists.map(item => item.name).join(' '),
      platform: '163'
    }
  })

  ctx.body = {
    data: {
      songs,
      total: JSON.parse(res).result.songCount,
      limit,
      page,
    },
    status: 0
  }
})

router.get('/163/music/url', async (ctx, next) => {
  const id = ctx.query.id;
  const br = ctx.query.br || 999000;
  const data = {
    ids: [id],
    br: br,
    csrf_token: ""
  };
  const cookie = ctx.get("Cookie") ? ctx.get("Cookie") : "";

  const res = await createWebAPIRequest(
    "music.163.com",
    "/weapi/song/enhance/player/url",
    "POST",
    data,
    cookie
  );

  ctx.body = {
    url: JSON.parse(res).data[0].url,
    status: 0
  }
})

module.exports = router