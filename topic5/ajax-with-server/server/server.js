const express = require('express')
const cors = require('cors')
const employeeRepo = require('./mockData/employeeRepo')

const app = express()
const port = 3000

app.use(cors())

app.get('/employees', (req, res) => {
  res.json(employeeRepo)
})

app.get('/employee/:id', (req, res) => {
  // Note -- boundary checking and responses here could be more robust and 
  // should do things like return clearer HTTP error statuses, etc.; this is simplified 
  // for demo purposes
  const requested = parseInt(req.params.id);
  if (requested > 0 && requested < employeeRepo.length) {
    res.json(employeeRepo[requested])
  } else {
    res.json([])
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})