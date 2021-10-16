const axios = require("axios");
const keyToken = '25e2b10fb3dd78611f9fd735e766199db7c38cf0'

const api = axios.create( 
{
  headers: {
    Authorization: `token ${keyToken}`
},
  baseURL: "https://api.brasil.io/v1/dataset/covid19/caso/data/",
});

module.exports = api;