const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('@koa/cors');

const netease = require('./routes/netease')
const xiami = require('./routes/xiami')
const qq = require('./routes/qq')

// via http://www.ruanyifeng.com/blog/2017/08/koa.html
const handler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      // message: err.message
      status: 1
    };
  }
};

app.use(handler)
app.use(cors())

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text'],
  onerror: function (err, ctx) {
    ctx.throw('Body parse error', 422);
  }
}))

app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(netease.routes(), netease.allowedMethods())
app.use(xiami.routes(), xiami.allowedMethods())
app.use(qq.routes(), qq.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});


module.exports = app
