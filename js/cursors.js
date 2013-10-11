$(document).ready(function() {
 //alternate cursor 
  $('#1a').mousedown(function() {
    $('#myCanvas').css({"cursor":"url(lassopng.png), url(lasso2.cur), default"});
  });
  $('#1b').mousedown(function() {
    $('#myCanvas').css({"cursor":"url(selectiona.cur) 5 5, url(selection.cur), default"});
  });
  $('#2a').mousedown(function() {
    $('#myCanvas').css({"cursor":"url(handpng.png), url(hand2.cur), default"});
  });
  $('#2b').mousedown(function() {
    $('#myCanvas').css({"cursor":"url(textcursor.cur), url(cursor/textcursor.cur), default"});
  });
  $('#3a').mousedown(function() {
    $('#myCanvas').css({"cursor":"url(bucketpng.png), url(bucket.cur), default"});
  });
  $('#3b').mousedown(function() {
    $('#myCanvas').css({"cursor":"url(spray.cur), url(cursor/spray.cur), default"});
  });
  //$('#4a').mousedown(function() {
  //  $('#myCanvas').css({"cursor":"url(paintbrushb.png), url(paintbrushb.cur), default"});
  //});
  $('#4b').mousedown(function() {
    $('#myCanvas').css({"cursor":"url(pencila.png) 1 14, url(pencil.cur), default"});
  });
  $('#5a').mousedown(function() {
    $('#myCanvas').css({"cursor":"url(spray.cur), url(cursor/spray.cur), default"});
  });
  $('#5b').mousedown(function() {
    $('#myCanvas').css({"cursor":"url(eraserpng.png), url(eraser.cur), default"});
  });
});