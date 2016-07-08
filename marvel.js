console.log('hello there');

function fetchJSON(url) {
  return fetch(url).then(function(response) {
    var contentType = response.headers.get("content-type");
    if(contentType && contentType.indexOf("application/json") !== -1) {
      return response.json();
    } else {
      console.log("Oops, we haven't got JSON!");
    }
  });
}

function marvelFactory(config) {
  return function(path) {
    var timestamp = new Date().getTime();
    var hash = md5.create();
    hash.update(timestamp + config.privateKey + config.publicKey);
    hash.hex();
    var url = config.hosttitle + '/v' + config.version + '/public' + path + '?limit=100' + '&apikey=' + config.publicKey + '&ts=' + timestamp + '&hash=' + hash;
    console.log(url);

    return fetchJSON(url);
  }
}

// Get an instance of the marvel api
var marvel = marvelFactory({
  hosttitle: 'http://gateway.marvel.com',
  publicKey: 'c5ebb123335240358c2744cde0f38b7e',
  privateKey: 'cff3343714de139da0173348487355979eda8406',
  version: '1'
});


function $(selector) {
  return document.querySelector(selector);
}

$.create = function(elementtitle) {
  return document.createElement(elementtitle);
}

$.createText = function(text) {
  return document.createTextNode(text);
}

$.setAttribute = function(el, attr, value) { // this
  return el.setAttribute(attr, value);
};

$.appendChild = function(parentElement, childElement) {
  return parentElement.appendChild(childElement);
}

function makeFilePath(path, extension) {
  return path + '.' + extension;
}

function marvelImageFound(path) {
  return (path !== 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg');
}

marvel('/comics').then(function(json) {
  console.log(json);
  var container = $('comics');

  var noImageArray = json.data.results.filter(function(comic){

    var comicContainer = $.create('comic');

    var imgPath = makeFilePath(comic.thumbnail.path, comic.thumbnail.extension);
    var title = comic.title;

    var img = $.create('img');
    $.setAttribute(img, 'src', imgPath);

    var titleTag = $.create('comic-title');

    var titleTextNode = $.createText(title);
    var titleLinkNode = $.create('a');

    $.setAttribute(titleLinkNode, 'href', 'https://www.google.com/#q=' + encodeURIComponent(title));
    $.appendChild(titleLinkNode, titleTextNode);

    $.appendChild(titleTag, titleLinkNode);

    $.appendChild(comicContainer, titleTag);
    $.appendChild(comicContainer, img);

    var imgFound = marvelImageFound(imgPath);
    if(imgFound) {
      $.appendChild(container, comicContainer);
    }
    return !imgFound;

  });

});