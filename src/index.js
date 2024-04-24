const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;
const NTP = require("ntp-time").Client;
const client = new NTP("a.st1.ntp.br", 3001, { timeout: 5000 });
async function sync() {
  try {
    const timeNTP = await client.syncTime();
    io.emit("chat message", "NTP SERVER TIME: " +timeNTP.time);
    return JSON.stringify(timeNTP.time);
  } catch (error) {
    console.error("ERROR-------------------------", error);
  }
}

app.get("/", (_req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on("chat message", (_msg) => {
    sync();

    const timeAPIURL = "http://worldtimeapi.org/api/timezone/Europe/Madrid";
    const _apiRes = fetch(timeAPIURL)
      .then((res) => res.json())
      .then((data) => io.emit("chat message", data.datetime));
  });
});

http.listen(port, () => {
  console.log(`Sync Chat Server running at http://localhost:${port}/`);
});
