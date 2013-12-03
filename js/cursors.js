$(document).ready(function() {
 //alternate cursor 
  $('#1a').mousedown(function() {
    $('#myCanvas').css({"cursor":"url(css/img/lassopng.png), url(cursors/lasso2.cur), default"});
  });
  $('#1b').mousedown(function() {
    $('#myCanvas').css({"cursor":"url(cursors/selectiona.cur) 5 5, url(cursors/selection.cur), default"});
  });
  $('#2a').mousedown(function() {
    $('#myCanvas').css({"cursor":"url(css/img/handpng.png), url(cursors/hand2.cur), default"});
  });
  $('#2b').mousedown(function() {
    $('#myCanvas').css({"cursor":"url(cursors/textcursor.cur), url(cursors/textcursor.cur), default"});
  });
  $('#3a').mousedown(function() {
    $('#myCanvas').css({"cursor":"url(css/img/bucketpng.png), url(cursors/bucket.cur), default"});
  });
  $('#3b').mousedown(function() {
    $('#myCanvas').css({"cursor":"url(cursors/spray.cur), url(cursors/spray.cur), default"});
  });
  $('#4a').mousedown(function() {
    $('#myCanvas').css({"cursor":"url(css/img/paintbrush.png), url(cursors/paintbrushb.cur), default"});
  });
  $('#4b').mousedown(function() {
    $('#myCanvas').css({"cursor":"url(css/img/pencila.png) 1 14, url(cursors/pencil.cur), default"});
  });
  $('#5a').mousedown(function() {
    $('#myCanvas').css({"cursor":"url(cursors/spray.cur), url(cursors/spray.cur), default"});
  });
  $('#5b').mousedown(function() {
    $('#myCanvas').css({"cursor":"url(css/img/eraserpng.png), url(cursors/eraser.cur), default"});
  });
});