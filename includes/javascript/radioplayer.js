$(document).ready(function() {
    init();
    $('input, textarea').placeholder();
  });

var init = function() {
  setupDropdowns();
  setupBindings();
}

var setupDropdowns = function() {
  callDropdowns();
}

var setupBindings = function() {
  $('#theGenre').bind("propertychange keyup input paste", function() {
    search('genre', 'theGenre');
  });
  $('#theArtist').bind("propertychange keyup input paste", function() {
    search('albumartist', 'theArtist');
  });
}

var callDropdowns = function() {
  $.ajax({
    type: "GET",
    url: baseUrlApi + 'item/',
    success: populateDropdowns,
    dataType : "json",
    contentType: "application/json"//,
  });
}

var search = function(criterion, field) {
  $.ajax({
    type: "GET",
    url: baseUrlApi + 'item/query/' + criterion + ':' + $('#' + field).val(),
    success: populatePlaylist,
    dataType : "json",
    contentType: "application/json"
  });
}

var populatePlaylist = function(data) {
  //Randomize order
  data.results.sort(function() {
    return 0.5 - Math.random();
  });
  var playlist = '';
  $.each(data.results, function(index){
    playlist = playlist + '<li><a href="#" data-src="' + baseUrlApi + 'item/' + data.results[index].id + '/file">' + data.results[index].title + '</a></li>';
  });
  $('#wrapper').append('<h1>My ' + $('#theGenre').val() + ' Playlist</em></h1><audio preload></audio><ol id="wrapped">' + playlist + '</ol>');
  initiateAudioJS();
}

var initiateAudioJS = function() { 
    // Setup the player to autoplay the next track
    var a = audiojs.createAll({
      trackEnded: function() {
        var next = $('ol li.playing').next();
        if (!next.length) next = $('ol li').first();
        next.addClass('playing').siblings().removeClass('playing');
        audio.load($('a', next).attr('data-src'));
        audio.play();
      }
    });
    
    // Load in the first track
    var audio = a[0];
        first = $('ol a').attr('data-src');
    $('ol li').first().addClass('playing');
    audio.load(first);

    // Load in a track on click
    $('ol li').click(function(e) {
      e.preventDefault();
      $(this).addClass('playing').siblings().removeClass('playing');
      audio.load($('a', this).attr('data-src'));
      audio.play();
    });
    // Keyboard shortcuts
    $(document).keydown(function(e) {
      var unicode = e.charCode ? e.charCode : e.keyCode;
         // right arrow
      if (unicode == 39) {
        var next = $('li.playing').next();
        if (!next.length) next = $('ol li').first();
        next.click();
        // back arrow
      } else if (unicode == 37) {
        var prev = $('li.playing').prev();
        if (!prev.length) prev = $('ol li').last();
        prev.click();
        // spacebar
      } else if (unicode == 32) {
        audio.playPause();
      }
    })
  };

var populateDropdowns = function(data) {
  populate(data, 'genre', 'theGenre');
  populate(data, 'albumartist', 'theArtist');
}

var populate = function(data, criterion, field) {
  var uniqueNames = [];
  var uniqueItems = [];
  var options = $("#" + field);
  
  //Splitting first
  $.each(data.items, function(index){
    //Up to 3 genres per track, comma-delimited and with spaces
    var tmpString = "data.items[index]." + criterion + ".split(',')";
    var tmpItems = eval(tmpString);
    $.each(tmpItems, function(index2){
      uniqueItems.push(tmpItems[index2].trim());
    });
  });

  //Keeping one of each (ie unique) items
  $.each(uniqueItems, function(i, el){
   if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
  });

  //Sorting alphabetically
  uniqueNames.sort(sortByValue);

  //Building drop down
  $.each(uniqueNames, function(index){
   options.append($("<option />").val(uniqueNames[index]).text(uniqueNames[index]));
  });
}

var sortByValue = function(a, b){
  var aValue = a.toLowerCase();
  var bValue = b.toLowerCase(); 
  return ((aValue < bValue) ? -1 : ((aValue > bValue) ? 1 : 0));
}
