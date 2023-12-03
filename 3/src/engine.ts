import { findValidNumbers } from "./part1";

var http = require("http");
var fs = require("fs");

const host = "localhost";
const port = 8000;

const server = http.createServer(function (
  req: any,
  res: {
    writeHead: (
      arg0: number,
      arg1: {
        "Content-Type": string;
        "Content-Length": number;
        Expires: string;
      }
    ) => void;
    end: (arg0: string) => void;
  }
) {
  var html = buildHtml(req);

  res.writeHead(200, {
    "Content-Type": "text/html",
    "Content-Length": html.length,
    Expires: new Date().toUTCString(),
  });
  res.end(html);
});
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});

function buildHtml(req: any) {
  const useExample = true;
  const filePath = useExample ? "input-example1.1.txt" : "input.txt";
  const input = fs.readFileSync(filePath, "utf8");

  const lines: string[] = input.split("\n");

  const { symbolSet, parsedLines } = findValidNumbers(lines);
  const numCoordSet = new Set<string>();
  parsedLines.forEach((pl, i) => {
    pl.numbersInLine.forEach((numInLine) => {
      for (
        let numIndex = 0;
        numIndex < numInLine.number.toString().length;
        numIndex++
      ) {
        if (numInLine.number === 4)
          console.log(numInLine, i, `${i},${numInLine.index + numIndex}`);
        numCoordSet.add(`${i},${numInLine.index + numIndex}`);
      }
    });
  });

  var header = "";
  //console.log(lines);
  // console.log(numCoordSet.has(`${8},${32}`));

  var body = lines
    .map((line, i) => {
      return `<code>${line
        .split("")
        .map(
          (char, j) =>
            `<span class="${i},${j}" ${
              symbolSet.has(`${i},${j}`)
                ? 'style="color:red;font-weight:bold"'
                : ""
            } ${char === "." ? 'style="color:gray;font-weight:lighter"' : ""}
            ${
              numCoordSet.has(`${i},${j}`)
                ? 'style="color:green;font-weight:bold"'
                : ""
            }>${char}</span>`
        )
        .join(" ")}</code>`;
    })
    .join("<br/>");

  return (
    "<!DOCTYPE html>" +
    "<html><head>" +
    header +
    "</head><body>" +
    body +
    "</body></html>"
  );
}
