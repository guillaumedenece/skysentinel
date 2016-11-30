module.exports.send = send;
//Load the request module
var request = require('request');

function send(data)
{
  //Lets configure and request
  request({
    url: 'http://127.0.0.1:3000/', //URL to hit
    qs: {from: 'GSInfos', time: +new Date()}, //Query string data
    method: 'POST',
    //Lets post the following key/values as form
    json: data
  }, answer_send
);
}

function answer_send(error, res, body)
{
  if(error)
  {
    console.log(error);
  }
  else
  {
    console.log(res.statusCode, body);
  }
}
