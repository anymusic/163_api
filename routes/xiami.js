const router = require('koa-router')()
router.prefix('/api')

const axios = require('axios')

function handleProtocolRelativeUrl(url) {
  var regex = /^.*?\/\//;
  var result = url.replace(regex, 'http://');
  return result;
}

function caesar(location) {
  var num = location[0];
  var avg_len = Math.floor(location.slice(1).length / num);
  var remainder = location.slice(1).length % num;

  var result = [];
  for (var i = 0; i < remainder; i++) {
    var line = location.slice(i * (avg_len + 1) + 1, (i + 1) * (avg_len + 1) + 1);
    result.push(line);
  }

  for (var i = 0; i < num - remainder; i++) {
    var line = location.slice((avg_len + 1) * remainder).slice(i * avg_len + 1, (i + 1) * avg_len + 1);
    result.push(line);
  }

  var s = [];
  for (var i = 0; i < avg_len; i++) {
    for (var j = 0; j < num; j++) {
      s.push(result[j][i]);
    }
  }

  for (var i = 0; i < remainder; i++) {
    s.push(result[i].slice(-1));
  }

  return unescape(s.join('')).replace(/\^/g, '0');
}

function getSongs(keywords, limit, page) {
  return new Promise((resolve, reject) => {
    const url = `http://api.xiami.com/web?v=2.0&app_key=1&key=${keywords}&page=${page}&limit=${limit}&r=search/songs`
    axios.get(url, {
      headers: {
        Host: 'api.xiami.com',
        Origin: 'http://www.xiami.com/',
        Referer: 'http://www.xiami.com/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Listen1/1.8.0 Chrome/59.0.3071.115 Electron/1.8.8 Safari/537.36'
      }
    }).then(
      res => {
        let songs = res.data.data.songs.map(item => {
          return {
            id: item.song_id,
            name: item.song_name,
            album: item.album_name,
            artist: item.artist_name,
            platform: 'xiami'
          }
        })

        resolve({
          songs,
          total: res.data.data.total,
          limit,
          page,
        })
      }
    ).catch(err => {
      reject()
    })
  })
}

router.get('/xiami/search', async (ctx, next) => {
  const keywords = ctx.query.keywords
  const limit = +ctx.query.limit || 20
  const page = +ctx.query.page || 1
  const data = await getSongs(encodeURIComponent(keywords), limit, page)

  ctx.body = {
    data,
    status: 0
  }
})


function getSongUrl(id) {
  var url = `https://www.xiami.com/song/playlist/id/${id}/object_name/default/object_id/0/cat/json`

  return new Promise((resolve, reject) => {
    axios.get(url, {
      headers: {
        origin: 'http://www.xiami.com/',
        referer: 'http://www.xiami.com/',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Listen1/1.8.0 Chrome/59.0.3071.115 Electron/1.8.8 Safari/537.36'
      },
    }).then(response => {
      const data = response.data
      const location = data.data.trackList[0].location
      const url = handleProtocolRelativeUrl(caesar(location))
      resolve(url)
    }).catch(err => {
      reject()
    })
  })
}

router.get('/xiami/music/url', async (ctx, next) => {
  const id = ctx.query.id
  const url = await getSongUrl(id)
  ctx.body = {
    url,
    status: 0
  }
})

module.exports = router