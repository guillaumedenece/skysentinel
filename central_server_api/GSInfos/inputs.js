module.exports.receive = receive;

function receive(req, res)
{
  res.send('Request received');
  console.log("POST to centralserver received:");
  console.log(req.body);
  console.log("");
}
