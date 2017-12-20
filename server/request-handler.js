/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

//define handleRequest // it's expected by the specs

var fs = require('fs');


var messages = {

  results: []

};


// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

                                                    //node also handles the objects we send back
var requestHandler = function(request, response) { // node creates the request object for us
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //

  const { method, url } = request;

  console.log(`method: ${method}`);
  console.log(`url: ${url}`);

  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.
  var statusCode = 200;


  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = 'application/json'; // it's recognized content type keyword // check google for content type JSON
  

    //check if the url is exactly /classes/messages


  


  if (method === 'POST') {    

    //setup a request handler event for data chunks
    request.on('data', (dataChunk) => {

      let message = JSON.parse(dataChunk);

      if (message) { // beware for invalid formats / check later
        
        message.createdAt = (new Date()).toString();
        message.updatedAt = message.createdAt;
        console.log(`Message Received (user): ${message.username}`);   
        console.log(`Message Received (room): ${message.roomname}`);   
        console.log(`Message Received (text): ${message.text}`);   
        console.log(`Message Received At: ${message.createdAt}`);  
        //write the messages on the file...
        
        //use fs to read file
        fs.readFile('server/messages.json', function(err, data) { //////////// 
          console.log('Data', data);
          //grab data and parse json string into messages object
          let messages = JSON.parse(data);
          console.log(messages);
          //push new message into messages.results
          messages.results.push(message);
          //stringify messages object
          //write the string to the same file/dir
          messages = JSON.stringify(messages);
          fs.writeFile('server/messages.json', messages, function(err) {
            if (err) {
              console.error(err);
            } else {
              console.log('Messages updated');
            }
          });
        });
      //ACCEPT ANY MESSAGE
      }
      
    });

    request.on('end', (data) => {
      
      console.log('Data', data);
      // console.log('message username = ' + message.username);
      statusCode = 201;
      headers['Content-Type'] = 'plain/text';
      console.log(headers);
      response.writeHead(statusCode, headers); // this is what we're sending back, throwing the fake error
      response.end();     
    
    });
  }

  if (method === 'GET') {

    if (url === '/classes/messages') {
      // .writeHead() writes to the request line and headers of the response,
      // which includes the status and all headers.
      statusCode = 200;
      headers = defaultCorsHeaders;
      headers['Content-Type'] = 'application/json'; // it's recognized content type keyword // check google for content type JSON
        
      response.writeHead(statusCode, headers);

      // Make sure to always call response.end() - Node may not send
      // anything back to the client until you do. The string you pass to
      // response.end() will be the body of the response - i.e. what shows
      // up in the browser.
      //
      // Calling .end "flushes" the response's internal buffer, forcing
      // node to actually send all the data over to the client.
      console.log(`delivered : ${JSON.stringify(messages)}`);
      response.end(JSON.stringify(messages));

    }
    if (url === '/') { 
      console.log('request for /');

      fs.writeFile('mynewfile3.txt', 'Hello content!', function(err) {
        if (err) {
          throw err;
        }
        console.log('Saved');
      });
      fs.readFile('client/index.html', function(err, data) { ////////////
        response.writeHead(200, {'Content-Type': 'text/html'});
        console.error(err);
        console.log('Data', data);
        response.write(data);
        response.end();
      });
    }
    if (url === '/styles/styles.css') { 
      console.log('getting style.css');

      fs.readFile('client/styles/styles.css', function(err, data) { ////////////
        console.log('Data for style.css');
        response.writeHead(200, {'Content-Type': 'text/css'});
        console.error(err);
        console.log('Data', data);
        response.write(data);
        response.end();
      });
    }
    if (url === '/scripts/app.js') { 
      console.log('getting app.js');
      fs.readFile('client/scripts/app.js', function(err, data) { ////////////
        console.log('Data for app.js');
        response.writeHead(200, {'Content-Type': 'text/javascript'});
        console.error(err);
        console.log('Data', data);
        response.write(data);
        response.end();
      });
    }

    if (url === '/bower_components/jquery/dist/jquery.js') { 
      console.log('getting jquery.js');
      fs.readFile('client/bower_components/jquery/dist/jquery.js', function(err, data) { ////////////
        console.log('Data for jquery.js');
        response.writeHead(200, {'Content-Type': 'text/javascript'});
        console.error(err);
        console.log('Data', data);
        response.write(data);
        response.end();
      });
    } 
    
    if (url === '/bower_components/underscore/underscore.js') { 
      console.log('getting underscore.js');
      fs.readFile('client/bower_components/underscore/underscore.js', function(err, data) { ////////////
        console.log('Data for underscore.js');
        response.writeHead(200, {'Content-Type': 'text/javascript'});
        console.error(err);
        console.log('Data', data);
        response.write(data);
        response.end();
      });
    } 
  } 

  if (method === 'OPTIONS') {
    response.writeHead(statusCode, headers);
    response.end();
  }


  
};



module.exports = {
  requestHandler: requestHandler
};