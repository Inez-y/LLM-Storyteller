const http = require('http');
const url = require('url');
const { getDate } = require("./modules/utils");
const messages = require("./lang/en/en");

const PORT = 3000;
const HOST = 'https://storyteller-us7ph.ondigitalocean.app/';  
const ENDPOINT = "/COMP4537/project/storyteller";

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname === ENDPOINT) {
        const name = parsedUrl.query.name || "Guest";
        const currentTime = getDate();

        const responseMessage = `<p style="color:blue;">${messages.greeting.replace("%s", name)} ${currentTime}</p>`;

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(responseMessage);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
    }
});

server.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}${ENDPOINT}`);
});