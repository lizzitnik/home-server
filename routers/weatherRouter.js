const express = require("express")
const axios = require("axios")
const router = express.Router()

const CLIENT_ID = 'LlBbtSsQo19j5ILXGtecu'

const SECRET_KEY = 'bdLkrSQbNEGSgCUyaqLJfpbHSk8cEmyznxiZtu0R'

router.get("/location/:lat/:lng", (req, res, next) => {
  const { lat, lng } = req.params
  const WEATHER_URL = `https://api.aerisapi.com/forecasts/${lat},${lng}?client_id=${CLIENT_ID}&client_secret=${SECRET_KEY}`
  axios(`${WEATHER_URL}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(data => {
      res.json(data.data)
    })
    .catch(err => {
      console.log(err)
    })
})

module.exports = router
