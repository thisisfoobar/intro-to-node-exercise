const fs = require("fs");
const process = require("process");
const axios = require("axios");

/** determin if output should be console or file */
function writeFile(text, out) {
  if (out) {
    fs.appendFile(out, `${text}\n`, "utf8", function (err) {
      if (err) {
        console.error(`Couldn't write ${out}: ${err}`);
        process.exit(1);
      }
    });
  } else {
    console.log(text);
  }
}

function cat(path, out) {
  fs.readFile(path, "utf8", function (err, data) {
    if (err) {
      console.error(`Error reading ${path}:`, err);
      process.exit(1);
    } else {
      writeFile(data, out);
    }
  });
}

async function webCat(url, out) {
  try {
    const response = await axios.get(url);
    writeFile(response.data, out);
  } catch (err) {
    console.error(`Error fetching ${url}`, err);
    process.exit(1);
  }
}

let path;
let out;

// if (process.argv[2] === '--out') {
//     out = process.argv[3]
//     path = process.argv[4]
// } else {
//     path = process.argv[2]
// }
function webOrFile() {
  if (path.slice(0, 4) === "http") {
    webCat(path, out);
  } else {
    cat(path, out);
  }
}

if (process.argv[2] === "--out") {
  out = process.argv[3];
  for (let i = 4; i < process.argv.length; i += 1) {
    path = process.argv[i];
    webOrFile();
  }
} else {
  for (let i = 2; i < process.argv.length; i += 1) {
    path = process.argv[i];
    webOrFile();
  }
}
