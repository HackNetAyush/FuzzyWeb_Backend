const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
app.use(express.json());

app.use(cors());

// const ssl_cmd = "nmap --script ssl-enum-ciphers -p 443 {url}"

app.get("/", (req, res) => {
  res.send("Hellooooo");
});

app.post("/scanURL", (req, res) => {
  const { url, scanType } = req.body;

  if (scanType === "subdomain") {
    const subdomain_scan = `truncate -s 0 subd.txt && subfinder -d ${url} -o subd.txt`;

    exec(subdomain_scan, (error, stdout, stderr) => {
      if (error) {
        console.error(error);
        return res.status(500).send("Error scanning URL");
      }

      console.log("stdout: ", stdout);
      console.error("stderr: ", stderr);

      // Reading the file after the subdomain scan completes
      fs.readFile("./subd.txt", "utf8", (err, data) => {
        if (err) {
          console.error("Error reading file:", err);
          return res.status(500).send("Error reading file.");
        }

        // Split the file content into lines
        const lines = data.split("\n").filter((line) => line.trim() !== "");

        console.log("Lines:", lines); // Array of lines
        res.json({ data: lines });
        // res.send(`File lines: ${lines.join(", ")}`);
        // res.send(`{data: ${lines}}`);
      });
    });
  } else if (scanType === "ssl") {
    console.log("Running SSL Scan");
    const cmd = `nmap --script ssl-enum-ciphers -p 443 ${url} -oX sslReport.xml  && python xml_to_json.py -x sslReport.xml -o sslReport.json `;

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(error);
        return res.status(500).send("Error scanning URL");
      }

      console.log("stdout: ", stdout);
      console.error("stderr: ", stderr);

      // Reading the file after the subdomain scan completes
      // fs.readFile("./subd.txt", "utf8", (err, data) => {
      //   if (err) {
      //     console.error("Error reading file:", err);
      //     return res.status(500).send("Error reading file.");
      //   }

      //   // Split the file content into lines
      //   const lines = data.split("\n").filter((line) => line.trim() !== "");

      //   console.log("Lines:", lines); // Array of lines
      //   res.json({ data: lines });
      //   // res.send(`File lines: ${lines.join(", ")}`);
      //   // res.send(`{data: ${lines}}`);
      // });
    });
  } else {
    res.status(400).send("Invalid scanType");
  }

  console.log("URL: ", url);
  console.log("ScanType: ", scanType);
});

app.listen(3000, () => {
  console.log("Server started");
});
