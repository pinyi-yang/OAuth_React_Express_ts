import express from 'express';
const router = express.Router();
import User from '../models/user';
import axios from 'axios';

// GET /api/:id/repose
router.get('/:id/repos', (req, res) => {
  console.log('get to backend to get repos');
  let config ={
    headers: {
      'Authorization': `Bearer ${req.user.accessToken}`, //access from session
      'User-Agent': 'OAuth_Express_React_boilerplate' //app name
    }
  }

  axios.get(`http://api.github.com/user/repos`, config)
    .then((response) => {
      res.json(response.data);
    }).catch(err => {
      console.log(err);
    })  
});

export default router;