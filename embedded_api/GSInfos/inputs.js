module.exports.receive = receive;

function receive(req, res){
  console.log("GS infos input");
  // console.log(req.body);
  res.send('information received');
  console.log(req.body.doorPosition);
  // console.log(req.body.batteryInfos.ID);
  // console.log(req.body.batteryInfos.voltage.one);
  // console.log(req.body.batteryInfos.voltage.two);
  // console.log(req.body.batteryInfos.voltage.three);
  // console.log(req.body.batteryInfos.plugged);
  // console.log(req.body.batteryInfos.charging);
  // console.log(req.body.batteryInfos.intensity);
  // console.log(req.body.weather.rain);
  // console.log(req.body.weather.temperature);
  // console.log(req.body.weather.humidity);
  // console.log(req.body.weather.windSpeed);
  // console.log(req.body.weather.pressure);
}
