const router = require('koa-router')()
const axios = require('axios')

function getSongs(keywords, limit, page) {
  return new Promise((resolve, reject) => {
    const url = `http://i.y.qq.com/s.music/fcgi-bin/search_for_qq_cp?g_tk=938407465&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&w=${keywords}&zhidaqu=1&catZhida=1&t=0&flag=1&ie=utf-8&sem=1&aggr=0&perpage=${limit}&n=20&p=${page}&remoteplace=txt.mqq.all&_=1459991037831`
    axios.get(url, {
      headers: {
        Host: 'i.y.qq.com',
        Origin: 'http://y.qq.com/',
        Referer: 'http://y.qq.com/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'
      }
    }).then(
      res => {     
        const songs = res.data.data.song.list.map(item => {
          return {
            id: item.songmid,
            name: item.songname,
            album: item.albumname,
            artist: item.singer.map(item => item.name).join(' '),
            platform: 'qq'
          }
        })
        
        resolve({
          songs,
          total: res.data.data.song.totalnum,
          limit,
          page,
        })
      }
    ).catch(err => {
      reject()
    })
  })
}

router.get('/qq/search', async (ctx, next) => {
  const keywords = ctx.query.keywords
  const limit = +ctx.query.limit || 30
  const page = +ctx.query.page || 1
  const data = await getSongs(encodeURIComponent(keywords), limit, page)
  ctx.body = {
    data,
    status: 0
  }
})

function getSongUrl(id) {
  var url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg' +
    '?g_tk=195219765' +
    '&loginUin=1297716249&hostUin=0&format=json&inCharset=utf8' +
    '&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0' +
    '&cid=205361747' +
    '&uin=1297716249&songmid=' + id +
    '&filename=C400' + id + '.m4a&guid=7332953645';

  return new Promise((resolve, reject) => {
    axios.get(url, {
      headers: {
        Host: 'i.y.qq.com',
        Origin: 'http://y.qq.com/',
        Referer: 'http://y.qq.com/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'
      },
    }).then(response => {
      const data = response.data;
      const token = data.data.items[0].vkey;
      const url = 'http://dl.stream.qqmusic.qq.com/C400' + id +
        '.m4a?vkey=' + token +
        '&uin=1297716249&fromtag=0&guid=7332953645';
      resolve(url)
    }).catch(err => {
      reject()
    })
  })
}

router.get('/qq/music/url', async (ctx, next) => {
  const id = ctx.query.id;
  const url = await getSongUrl(id)
  ctx.body = {
    url,
    status: 0
  }
})

module.exports = router