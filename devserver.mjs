import http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';

const port = 8080;
const baseDirectory = url.fileURLToPath(new URL('.', import.meta.url));

http
  .createServer(function (request, response) {
    try {
      var requestUrl = url.parse(request.url);

      // need to use path.normalize so people can't access directories underneath baseDirectory
      var fsPath = path.join(
        baseDirectory,
        path.normalize(requestUrl.pathname)
      );

      console.log(fsPath);

      // Force correct content-type for JavaScript
      // This is a work-around for an issue where
      // es6 modules have "" as content-type.
      if (fsPath.endsWith('.mjs')) {
        response.setHeader('content-type', 'text/javascript');
      }

      var fileStream = fs.createReadStream(fsPath);

      fileStream.pipe(response);
      fileStream.on('open', function () {
        response.writeHead(200);
      });
      fileStream.on('error', function () {
        response.writeHead(404); // assume the file doesn't exist
        response.end();
      });
    } catch (e) {
      response.writeHead(500);
      response.end(); // end the response so browsers don't hang
      console.log(e.stack);
    }
  })
  .listen(port);

console.log('Serving http://localhost:' + port + '/hamlet.html');
