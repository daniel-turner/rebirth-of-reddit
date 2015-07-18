var Data = (function() {

  var HTTP_UNSENT = 0;
  var HTTP_OPENED = 1;
  var HTTP_HEADERS_RECV = 2;
  var HTTP_LOADING = 3;
  var HTTP_DONE = 4;
  var HTTP_STATUS_OK = 200;
  var HTTP_STATUS_NOT_FOUND = 404;
  var HTTP_STATUS_SERVER_ERROR = 500;
  var HTTP_GET = 'GET';

  var httpRequest;

  if(window.XMLHttpRequest) {

    httpRequest = new XMLHttpRequest();
  }

  if(!httpRequest) {

    throw new Error("Could not create httpRequest");
  }

  httpRequest.onreadystatechange = function() {

    if(httpRequest.readyState === HTTP_DONE ) {

      if(httpRequest.status === HTTP_STATUS_OK ) {

        updateUI(httpRequest.responseText);

      } else {

        throw new Error("There was a problem with the request.");
      }
    }
  }

  function loadRandom() {
    httpRequest.open('GET','http://www.reddit.com/r/reactiongifs.json', true);
    httpRequest.send(null);
  };

  function loadMyBoards() {
    httpRequest.open('GET','http://www.reddit.com/r/holdmybeer.json', true);
    httpRequest.send(null);
  };

  function loadGetTheApp() {
    httpRequest.open('GET','http://www.reddit.com/r/earthporn.json', true);
    httpRequest.send(null);
  };

  function updateUI(responseText) {

    var element;
    var data = JSON.parse(responseText);
    var updateData;
    var imageContainer;

    for(var i = 0; i < 4; i++) {

      var randomIndex = Math.floor(Math.random() * data.data.children.length);

      //image

      imageContainer = document.querySelector("#imageContainer" + (i + 1));

      updateData = data.data.children[randomIndex].data.url;

      element = document.querySelector("#image" + (i + 1));

      if(updateData.indexOf("imgur") !== -1) {

        if(updateData.indexOf("/imgur") !== -1) {

          updateData = updateData.replace("/imgur","/i.imgur");

          if((updateData.indexOf(".jpg") === -1) || (updateData.indexOf(".png") === -1)) {

            updateData = updateData + ".jpg";
          }
        }

        if(updateData.indexOf(".gifv") !== -1) {

          updateData = updateData.replace(".gifv", ".gif");
        }

      } else {

        var betterData = data.data.children[randomIndex].data.preview.images[0].source.url

        if(betterData !== null) {

          updateData = betterData;
        }
      }

      element.style.backgroundImage = "url('" + updateData + "')";

      //title
      element = document.querySelector("#title" + (i + 1));
      updateData = data.data.children[randomIndex].data.title;

      if(updateData.length > 120) {

        updateData = updateData.slice(0,120) + "...";
      }

      element.innerHTML = updateData;

      //author author
      element = document.querySelector("#byline" + (i + 1));
      updateData = data.data.children[randomIndex].data.author;

      element.innerHTML = "by " + updateData;

      //age created-> timestamp to 2 days ago
      element = document.querySelector("#age" + (i + 1));

      updateData = data.data.children[randomIndex].data.created;

      element.innerHTML = moment(updateData, "DD").fromNow();

      //views score
      element = document.querySelector("#views" + (i + 1));
      updateData = data.data.children[randomIndex].data.score;

      element.innerHTML = updateData + " views";

      //description lorem ipsum
      element = document.querySelector("#text" + (i + 1));
      updateData = "Lorem ipsum dolor sit amet, consectetur adipisicing elit.";

      element.innerHTML = updateData;
    }
  };

  return {

    loadRandom: loadRandom,
    loadMyBoards: loadMyBoards,
    loadGetTheApp: loadGetTheApp
  }
})()