const express = require("express")
const axios = require("axios")
const router = express.Router()

router.get('/', (req, res, next) => {
  const QUOTES_URL = 'https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en'
  axios(`${QUOTES_URL}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(data => {
    res.send(JSON.stringify(data.data))
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({
      message: err
    })
  })
})

module.exports = router
