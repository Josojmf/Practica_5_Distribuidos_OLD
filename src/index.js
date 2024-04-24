const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;
const NTP = require("ntp-time").Client;
const client = new NTP("a.st1.ntp.br", 123, { timeout: 5000 });
async function sync() {
  try {
    const timeNTP = await client.syncTime();
    io.emit(
      "chat message",
      "NTP Server sync time:" + JSON.stringify(timeNTP.time)
    );
    return JSON.stringify(timeNTP.time);
  } catch (error) {
    console.error("ERROR-------------------------", error);
    io.emit("chat message", "");
  }
}

app.get("/", (_req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on("chat message", (_msg) => {
    const _ntpRes = sync().then((time) => {
      return time;
    });

    const  timeAPIURL = "http://worldtimeapi.org/api/timezone/Europe/Madrid";
    const _apiRes = fetch(timeAPIURL)
      .then((response) => response.json())
      .then(
        (data) =>
          io.emit(
            "chat message",
            "API Server sync time:" + new Date(data.datetime)
          ),
        io.emit("chat message", "Local time:" + new Date()),
      );
  });
});



http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
