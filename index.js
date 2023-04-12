const express = require("express");
const app = express();
const fs = require('fs')
const path = require('path')
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'))
})
app.get("/video", (req, res) => {
  const videoPath = "./SecretInvasion.mp4";
//   console.log("videopath", videoPath)
  const videoStat = fs.statSync(videoPath);

//   console.log(videoStat);

  const fileSize = videoStat.size;
//   console.log(fileSize)

  const videoRange = req.headers.range;
//   console.log(req.headers.range)

  if (videoRange) {
    // console.log("we got here")
    const parts = videoRange.replace(/bytes=/, "").split("-");

    const start = parseInt(parts[0], 10);
    console.log(start)

    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    console.log("end", end)

    const chunkSize = (end - start) + 1;
    // console.log("chunkSize", chunkSize)
    const file = fs.createReadStream(videoPath);

    console.log(`bytes ${start}-${end}/${fileSize}`)
    const header = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, header);
    file.pipe(res);
  } else {
    const head = {
        'Content-:Length' : fileSize,
        'Content-Type': 'video/mp4'
    };

    res.writeeHead(200, head)
    fs.createReadStream(videoPath).pipe(res)
  }
});

app.listen(5000, () => {
  console.log("server is running");
});
