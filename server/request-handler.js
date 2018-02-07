var url = require('url');
var fs = require('fs');
var path = require('path');



var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};
var data = [];


var requestHandler = (request, response) => {
  
  var respond = (statusCode, headers, endData) => {
    response.writeHead(statusCode, headers);
    response.end(endData);
  };
  

  
  const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'aplication/font-sfnt'
  };
  
  
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  
  var statusCode;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';
  
  //filter url to get rid of the username
  
  //parse url
  const parsedUrl = url.parse(request.url);
  
  /* console.log(parsedUrl) ==
  Url {
  protocol: null,
  slashes: null,
  auth: null,
  host: null,
  port: null,
  hostname: null,
  hash: null,
  search: null,
  query: null,
  pathname: '/arglebargle',
  path: '/arglebargle',
  href: '/arglebargle' }
  */
  
  
  //define generalized path
  let pathname = parsedUrl.pathname;
  // console.log("pathname: " + pathname);
  // console.log("requesturl:" + request.url);
  
  //if get & empty url
  if (request.method === 'GET' && pathname === '/') {
    statusCode = 200;
    headers['Content-Type'] = 'text/html';
    response.writeHead(statusCode, headers);
  
    //respond  with index
    fs.readFile('../client/index.html', function(err, data) {
      if (err) {
        throw err;
      } 
      response.end(data);
    });
    
  //if file doesn't exist & it's class/messages
  } else if (request.method === 'GET' && request.url.slice(0, 17) === '/classes/messages') {
    //handle request (GET & POST)
    respond(200, headers, JSON.stringify({results: data}));
    
    //if file exists && GET method
  } else if (request.method === 'GET') {
    //send that file
    pathname = `../client${pathname}`;
    fs.readFile(pathname, function(err, data) {
      if (err) {
        respond(404, headers, `Error getting the file: ${err}.`);
      } else {
        const ext = path.parse(pathname).ext;
        //console.log(ext);
        response.setHeader('Content-Type', mimeType[ext] || 'text/plain');
        respond(200, headers, data);
      }
    });
    //use readfile
    
    
    /*
    /bower_components/jquery/dist/jquery.js
    
    path.parse('/home/user/dir/file.txt');
// Returns:
// { root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }

    
      } else {
        // based on the URL path, extract the file extention. e.g. .js, .doc, ...
        const ext = path.parse(pathname).ext;
        // if the file is found, set Content-type and send data
        response.setHeader('Content-type', mimeType[ext] || 'text/plain' );
        response.end(data);
      }
    });
    
    */
    
    
    
    
  } else if (request.method === 'POST' && pathname === '/classes/messages') {
    statusCode = 201; 

    var body = [];
  
    request.on('error', (err) => {
      console.error(err);
      
    }).on('data', (chunk) => {
      body.push(chunk);
      
    }).on('end', () => {
      body = JSON.parse(Buffer.concat(body).toString());
      if (typeof body !== 'object' || body.username === undefined || body.text === undefined) {
        console.log(body);
        statusCode = 400;
        
      } else {
        body.createdAt = new Date();
        data.push(body);
      }
      respond(statusCode, headers); 
    });
    
    
    //else if options request
  } else if (request.method === 'OPTIONS') {
    //handle request
    respond(200, headers);
    
    
    //else 
  } else {
    //return 404
    respond(404, headers);

  }
  
  
  

  // response.statusCode = 500;
  // response.end(`Error getting the file: ${err}.`);
// else {
//   // based on the URL path, extract the file extention. e.g. .js, .doc, ...
//   const ext = path.parse(pathname).ext;
//   // if the file is found, set Content-type and send data
//   response.setHeader('Content-type', mimeType[ext] || 'text/plain' );
//   response.end(data);
// }  
    
    
    
};


exports.requestHandler = requestHandler;
