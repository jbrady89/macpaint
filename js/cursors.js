$(document).ready(function() {
 //alternate cursor 
  $('#1a').mousedown(function() {
    $('#myCanvas').css({"cursor":"url(css/img/lassopng.png), url(lasso2.cur), default"});
  });
  $('#1b').mousedown(function() {
    $('#myCanvas').css({"cursor":"url(selectiona.cur) 5 5, url(selection.cur), default"});
  });
  $('#2a').mousedown(function() {
    $('#myCanvas').css({"cursor":"url(css/img/handpng.png), url(hand2.cur), default"});
  });
  $('#2b').mousedown(function() {
    $('#myCanvas').css({"cursor":"url(textcursor.cur), url(textcursor.cur), default"});
  });
  $('#3a').mousedown(function() {
    $('#myCanvas').css({"cursor":"url(css/img/bucketpng.png), url(bucket.cur), default"});
  });
  $('#3b').mousedown(function() {
    $('#myCanvas').css({"cursor":"url(spray.cur), url(spray.cur), default"});
  });
  $('#4a').mousedown(function() {
    $('#myCanvas').css({"cursor":"url(css/img/paintbrush.png), url(paintbrushb.cur), default"});
  });
  $('#4b').mousedown(function() {
    $('#myCanvas').css({"cursor":"url(css/img/pencila.png) 1 14, url(pencil.cur), default"});
  });
  $('#5a').mousedown(function() {
    $('#myCanvas').css({"cursor":"url(spray.cur), url(spray.cur), default"});
  });
  $('#5b').mousedown(function() {
    $('#myCanvas').css({"cursor":"url(css/img/eraserpng.png), url(eraser.cur), default"});
  });
});