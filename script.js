(function(){
  var irc = require('irc');

  var userList = {};

  var client = new irc.Client('chat.freenode.net', 'Goldie', {
    channels: ['#schnitzelwirt']
  });

  function send(){
    var message = document.getElementById("message").value.replace(/(<([^>]+)>)/ig,"")
    $("#message").val("");
    if(message != ''){
      $("#chat").append('<div>You: ' + message + '</div>');
      client.say("#schnitzelwirt", message);
      scrollDown();
    }
  }

  client.addListener('message#schnitzelwirt', function (name, message) {
      $("#chat").append('<div>' + name + ': ' + message + '</div>');
      scrollDown();
  });
  client.addListener('message', function (name, to, message) {
      if(to == 'schnitzelwirt') return;
      $("#chat").append('<div>' + name + ' say to you: ' + message + '</div>');
      scrollDown();
  });

  client.addListener('join', function (channel, name) {
      $("#chat").append('<div class="logg">' + name + " just joined " + channel + '</div>');

      userList[name] = '';
      refreshUserList();
      scrollDown();
  });

  client.addListener('quit', function (name, reason, channels, message) {
      $("#chat").append('<div class="logg">' + name + " just left " + channels + '</div>');

      delete userList[name];
      refreshUserList();
      scrollDown();
  });

  client.addListener('names#schnitzelwirt', function (names){
    userList = names
  });

  function refreshUserList() {
    $('#users').html('');
    for (var name in userList) {
      $('#users').append('<div>' + name + '</div>'); 
    };
  }

  $("#message").on("click keyup", function (e) {
    if (e.keyCode == 13) {
      send();
    }
  });

  function scrollDown(){
    $("#chat").animate({ scrollTop: $('#chat')[0].scrollHeight}, 1000);
  }

})()