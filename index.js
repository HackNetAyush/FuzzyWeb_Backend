const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hellooooo");
});

app.post("/scanURL", (req, res) => {
  const { url, scanType } = req.body;

  const subdomain_scan = `subfinder -d ${url} -o subd.txt`;

  if (scanType === "subdomain") {
    exec(subdomain_scan, (error, stdout, stderr) => {
      if (error) {
        console.error(error);
        return res.status(500).send("Error scanning url");
      }

      console.log("stdout: ", stdout);
      console.error("stderr: ", stderr);
      //   res.send(`Command output: ${stdout}`);
    });

    fs.readFile("./subd.txt", "utf8", (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return res.status(500).send("Error reading file.");
      }

      // Split the file content into lines
      const lines = data.split("\n").filter((line) => line.trim() !== "");

      console.log("Lines:", lines); // Array of lines

      res.send(`File lines: ${lines.join(", ")}`);
    });
  }

  console.log("URL: ", url);
  console.log("ScanType: ", scanType);
});

app.listen(3000, () => {
  console.log("Server started");
});
