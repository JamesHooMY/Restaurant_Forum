module.exports = {
  generalErrorHandler(err, req, res, next) {
    if (err instanceof Error) {
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      req.flash('error_messages', `${err}`)
    }
    res.redirect('back')
    next(err)
  },
  // apiErrorHandler(err, res) { // 沒有 req, next 會曝露詳細 server 内的錯誤位置！！！而且 res.json 不會有效果！
  //   if (err instanceof Error) {
  //     return res.status(500).json({
  //       status: 'error',
  //       message: `${err.name}: ${err.message}`,
  //     })
  //   } else {
  //     return res.status(500).json({
  //       status: 'error',
  //       message: `${err}`,
  //     })
  //   }
  // },
  apiErrorHandler(err, req, res, next) {
    if (err instanceof Error) {
      res.status(500).json({
        status: 'error',
        message: `${err.name}: ${err.message}`,
      })
    } else {
      res.status(500).json({
        status: 'error',
        message: `${err}`,
      })
    }
    next(err) // 可以不要，但是上面的 req 和 next 不能刪除！！！會跳出太多錯誤訊息曝露 server 内錯誤的内容，會有危險！
  },
}
