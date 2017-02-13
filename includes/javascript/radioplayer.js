var currentResponse = "Checksum";

$(document).ready(function() {
    init();
    $('input, textarea').placeholder();
  });

var init = function() {
  setupGenre();
}

var setupGenre = function() {
  //$('#theGenre').bind("propertychange keyup input paste", function() {
    callGenre();
  //});
}

var callGenre = function() {
  $.ajax({
    type: "GET",
    url: baseUrlApi + 'item/',
    data: {},
    //success: populateGenre,
    dataType : "json",
    contentType : "text/plain"
  });
}

var populateGenre = function(data) {
  //alert(Json.Parse(items));
  /*$.each(data.items,function(){
      console.log(this);
  });*/
}

var call = function() {
  $.ajax({
    type: "POST",
    url: baseUrlApi,
    data: JSON.stringify({"method": "GenerateChecksum", "params" : {"stringToHash": $('#stringToHash').val(), "privateKey": $('#privateKey').val()}}),
    beforeSend: function() {
      $('#myModal').modal({
        backdrop: 'static',
        keyboard: false
      });
      $('#myModalFooter').addClass("hide");
      $('#myModalBody').html(
        '<p><img src="'+ baseUrl +'includes/images/ajax-loader.gif"/> One moment please while we process the transaction...</p>'
      );
    },
    success: showResponse,
    complete: function() {
      $('#myModalFooter').removeClass("hide");
      activateResponseTab();
    },
    dataType: "json",
    contentType : "text/plain",
  });
}

var showResponse = function(data) {
  $('#myModalBody').html('');
  $('#myModalBody').append($('<div><ul id="responses" class="nav nav-tabs nav-justified response-tabs"></ul></div>'));

  showResponseElement('Checksum', data);
}

var activateResponseTab = function() {
  $('.response-tabs li').removeClass("active");
  $('#' + currentResponse).addClass("active");
  toggleResponse("response-container", currentResponse);
}

var setResponseTabActions = function() {
  $('.response-tabs li').click(function() {
    currentResponse = $(this).attr('id');
    activateResponseTab();

    return false;
  });
}

var toggleResponse = function(responseClass, currentID) {
  $('.' + responseClass).addClass("hide");
  $('#' + currentID + '-container').removeClass("hide");
}

var showResponseElement = function(header, data) {
  $('#responses').prepend($('<li id="' + header + '"><a href="#">' + header + '</a></li>'));

  //$('#myModalBody').append($('<div id="' + header + '-container" class="response-container"><table id="' + header + '-table" class="table"><thead><tr><th>Field</th><th>Value</th></tr><tbody></tbody></table></div>'));
  $('#myModalBody').append($('<div id="' + header + '-container" class="response-container"></div>'));
  var checksum = "";
  $.each(data, function(key, value){
    switch(key) {
      case "checksum":
        checksum = value;
        break;
    }
  });

  $('#' + header + '-container').append('String to hash (use exact case of items as they appear in xml):<br>');
  $('#' + header + '-container').append('&nbsp;&nbsp;&nbsp;&nbsp;' + $('#stringToHash').val() + "<br>");
  $('#' + header + '-container').append('algorithm:<br>');
  $('#' + header + '-container').append('&nbsp;&nbsp;&nbsp;&nbsp;hmac_sha1(privateKey, stringToHash)<br>');
  $('#' + header + '-container').append('therefore:<br>');
  $('#' + header + '-container').append('&nbsp;&nbsp;&nbsp;&nbsp;checksum = hmac_sha1(<br>');
  $('#' + header + '-container').append("&nbsp;&nbsp;&nbsp;&nbsp;'" + $('#privateKey').val() + "',<br>")
  $('#' + header + '-container').append("&nbsp;&nbsp;&nbsp;&nbsp;'" + $('#stringToHash').val() + "'<br>");
  $('#' + header + '-container').append(')<br>');
  $('#' + header + '-container').append('And checksum is equal to:<br>');
  $('#' + header + '-container').append('&nbsp;&nbsp;&nbsp;&nbsp;' + checksum + '<br>');

  activateResponseTab();
  setResponseTabActions();
}