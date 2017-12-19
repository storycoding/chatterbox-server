// YOUR CODE HERE:

class ChatterBox {
  constructor(server = 'http://localhost:3000/classes/messages') {
    this.server = server;
    this.lastUpdate = 0;
    this.username = window.location.search.length > 0 ? window.location.search.match(/\?username=(.*)/)[1] : 'username';
    this.rooms = [];
  }

  init () {
    var returnObj = $.get(this.server, (data) => {
      _(data.results).each((messageData) => {
        this.lastUpdate = Date.parse(messageData.updatedAt);
        var message = {};
        message.text = messageData.text;
        message.username = messageData.username;
        message.roomname = messageData.roomname;
        message.updatedAt = Date.parse(messageData.updatedAt);
              
        if (message.username !== undefined) {

          message.text = message.text === undefined ? '' : message.text;
          message.roomname = message.roomname === undefined ? '' : message.roomname;
          this.renderMessage(message);
          this.addRoom(message.roomname);
        }
        $('.username').on('click', function(event) {
          console.log('clicked');
        });// {
          //console.log("Clicked");
        //});//this.handleUsernameClick.bind(this));
      });
    //this.roomName = 'Welcome';
    //this.addRoom(this.roomName);
    //this.changeRoom(this.roomName);
    });
  }

  //param: roomname:string
  addRoom (roomname) {
    if (!_(this.rooms).contains(roomname) && roomname.length > 0) {
      this.rooms.push(roomname);

      var roomnameNode = document.createElement('option');  //<div class="username">${message.username}</div>
      roomnameNode.classList.add( 'roomoption');
      roomnameNode.appendChild(document.createTextNode(roomname));

      $('#roomSelect').append(roomnameNode);
    }
  }

  changeRoom (roomname) {
    this.roomName = roomname;
    this.renderRoom(this.roomName);
    $('#roomSelect').val(this.roomName);
  }
     
  //param: message object with strings
  send (message) {
    $.ajax({
      url: this.server,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(message),
      success: (data) => {
        console.log('chatterbox: Message sent', data);
      },
      error: (data) => {
        console.error('chatterbox: Failed to send message', data); //throws error here
      }
    });    
  }

  fetch () {
  //'where={"username":"hank"}
    $.ajax({
      url: this.server,
      type: 'GET',
      //data: 'order=-updatedAt',
      success: (data) => {
        _(data.results).each((messageData) => {
          if (Date.parse(messageData.updatedAt) > this.lastUpdate) {
            this.lastUpdate = Date.parse(messageData.updatedAt);
            var message = {};
            message.text = messageData.text;
            message.username = messageData.username;
            message.roomname = messageData.roomname;
            //message.updatedAt = Date.parse(messageData.updatedAt);

            message.username = message.username === undefined ? '' : message.username;
            message.text = message.text === undefined ? '' : message.text;
            message.roomname = message.roomname === undefined ? '' : message.roomname;

            this.renderMessage(message);
            this.addRoom(message.roomname);
          }
        });
      },
      error: (data) => {
        console.log('chatterbox: Failed to receive data', data);
      }
    });
  }

  escapeString(string) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(string));  //<div class="username">${message.username}</div>
    return div.innerHTML;
  }
  
  renderMessage(message) {
    var username = document.createElement('div');  //<div class="username">${message.username}</div>
    username.classList.add('username');
    username.appendChild(document.createTextNode(message.username));

    var roomname = document.createElement('div');  //<div class="username">${message.username}</div>
    roomname.classList.add( 'roomname');
    roomname.appendChild(document.createTextNode(message.roomname));

    var text = document.createElement('div');  //<div class="username">${message.username}</div>
    text.classList.add( 'text');
    text.appendChild(document.createTextNode(message.text));

    var updatedAt = document.createElement('div');  //<div class="username">${message.username}</div>
    updatedAt.classList.add( 'updatedAt');
    updatedAt.appendChild(document.createTextNode(message.updatedAt));


    //console.log(username)
    //var text = `<div class='text'>${message.text}</div>`;

    if (message.roomname === this.roomname) {
      roomname.classList.remove('hide');
    } else {
      roomname.classList.add('hide');
    }
    // var created = `<div class='createdat'>${message.createdAt}</div>`;
    // var updated = `<div class='updatedat'>${message.updatedAt}</div>`;
    // var message = document.createElement('div');
    // message.appendChild(username);
    // message.appendChild(text)

    
    var messageNode = document.createElement('div');  //<div class="username">${message.username}</div>
    messageNode.classList.add('message');
    messageNode.appendChild(username);
    messageNode.appendChild(text);
    messageNode.appendChild(roomname);
    messageNode.appendChild(updatedAt);



    $('#chats').prepend(messageNode);
    
  }

  clearMessages() {
    $('#chats').children().remove();
  }

  renderRoom(roomname) {
    var escapedRoomName = this.escapeString(roomname);
  
    var $roomMessages = $('.message');

    $roomMessages.addClass('hide');
    var $rooms = $roomMessages.filter(function() {
      var $this = $(this);
      var $child = $this.find('.roomname');
      var val = $child.text();
      return (val === escapedRoomName);
    });
    //set visibility to visible
    $rooms.removeClass('hide');
    this.roomName = escapedRoomName;
    $('#roomSelect').val(this.roomName);

  }

  handleUsernameClick(event) {
    console.log('clicked');
  }
}  

var app = new ChatterBox();
app.init();
app.fetch();

  
$(document).ready(function() {
    

  setInterval(app.fetch.bind(app), 3000);

  $('#sendMessage').on('click', function(event) {
    var message = {};
    var $messageField = $('#messageField');
    
    message.username = app.username;
    message.text = $messageField.val();
    message.roomname = app.roomName;

    $messageField.val('');
    app.send(message);
  });
  $('#createroom').on('click', function(event) {
    
    var roomName = (prompt('What do you want to call the room?') || 'lobby');
    app.addRoom(roomName);
    app.changeRoom(roomName);
  });
  $('#roomSelect').change(function(event) {
    var roomName = $(this).find(':selected').val();
    app.changeRoom(roomName);
  });

  //app.handleUsernameClick.bind(app));
    //$.get('http://parse.sfm6.hackreactor.com/chatterbox/classes/messages').then(console.log);
});

  

