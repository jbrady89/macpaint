$(document).ready(function(){
  $('#fontsize2').addClass('active')
  $('#2b').mouseup(function(){
    var sizeSelect;
    changeSize();
    type();
  $("#fontsizedrop").find('li').mouseup(function(){
    $('#fontsizedrop').find('li').removeClass('active');
    $(this).addClass('active');
    console.log(this)
    changeSize();
    type();
  });

function changeSize(){
      $('#applebutton').attr('src', "applebuttoni.png");
      if ($('#fontsize0').hasClass('active')){
        sizeSelect = '9';
      }
       if ($('#fontsize1').hasClass('active')){
        sizeSelect = '10';
      }
       if ($('#fontsize2').hasClass('active')){
        sizeSelect = '12';
      }
       if ($('#fontsize3').hasClass('active')){
        sizeSelect = '14';
      }
       if ($('#fontsize4').hasClass('active')){
        sizeSelect = '18';
      }
       if ($('#fontsize5').hasClass('active')){
        sizeSelect = '24';
      }
       if ($('#fontsize6').hasClass('active')){
        sizeSelect = '36';
      }
       if ($('#fontsize7').hasClass('active')){
        sizeSelect = '48';
      }
       if ($('#fontsize8').hasClass('active')){
        sizeSelect = '72';
      }
    }
   // var sizeSelect = 10;

  
    function type(){
    var canvas = document.getElementById('myCanvas'),
        context = canvas.getContext('2d'),
        fontSelect = 'Chicago',
        strokeStyleSelect = 'black',
        GRID_STROKE_STYLE = 'lightgray',
        GRID_HORIZONTAL_SPACING = 10,
        GRID_VERTICAL_SPACING = 10,
        cursor = new TextCursor(),
        line,
        blinkingInterval,
        BLINK_TIME = 1000,
        BLINK_OFF = 300;
        var fillpattern = new Image();
        fillpattern.src = $('#innerimagetable').attr('brushpattern');
        var pattern = context.createPattern(fillpattern, 'repeat');
        var fillStyleSelect = pattern;
    // General-purpose functions.....................................
     $('.tools').not('#2a').mousedown(function(){
          cursor.erase(context, drawingSurfaceImageData);
          clearInterval(blinkingInterval);
      });
    
    

    function windowToCanvas(x, y) {
       var bbox = canvas.getBoundingClientRect();
       return { x: x - bbox.left * (canvas.width / bbox.width),
                y: y - bbox.top * (canvas.height / bbox.height)
              };
    }

    // Drawing surface...............................................

    function saveDrawingSurface() {
       drawingSurfaceImageData = context.getImageData(0, 0,
                                 canvas.width,
                                 canvas.height);
    }

    // Text..........................................................
     function checkFont(){
      setInterval(function(e){
        setFont();
      }, 1000);
    }
    checkFont();
    var fontStyle;
    function setFont() {
      context.fillStyle = 'black';
      context.strokeStyle = 'white';
      changeSize();
      if ($('#stylecheck2').css('display') == 'block'){//this works with other fonts, but the browser doesn't know how to make Chicago in italics
        console.log('check2');
        var fontStyle = 'italic'
        context.font = fontStyle+' '+sizeSelect+'px'+' '+'san-serif';
        console.log(context.font);
      }
      else if ($('#stylecheck3').css('display') == 'block'){//http://stackoverflow.com/questions/8933840/javascript-canvas-get-simple-font-properties
        var fontStyle = 'underline'
        context.font = fontStyle+' '+sizeSelect+'px'+' '+'san-serif';
      }
      else context.font = sizeSelect + 'pt ' + fontSelect;
      /*if ( $('#stylecheck2').css("display") == "none" ) {
        $('#fscheck9').mouseup(function() {
          changeSize();
          context.font = "italic 9pt Calibri";
        })
        $('#fscheck10').mouseup(function() {
          changeSize();
          context.font = "italic 10pt Calibri";
        })
        $('#fscheck12').mouseup(function() {
          changeSize();
          context.font = "italic 12pt Calibri";
        })
        $('#fscheck14').mouseup(function() {
          changeSize();
          context.font = "italic 14pt Calibri";
        })
        $('#fscheck18').mouseup(function() {
          changeSize();
          context.font = "italic 18pt Calibri";
        })
        $('#fscheck24').mouseup(function() {
          changeSize();
          context.font = "italic 24pt Calibri";
        })
        $('#fscheck36').mouseup(function() {
          changeSize();
          context.font = "italic 36pt Calibri";
        })
        $('#fscheck48').mouseup(function() {
          changeSize();
          context.font = "italic 48pt Calibri";
        })
        $('#fscheck72').mouseup(function() {
          changeSize();
          context.font = "italic 72pt Calibri";
        })
      }*/
    }

    function blinkCursor(x, y) {
      
       clearInterval(blinkingInterval);
       blinkingInterval = setInterval( function (e) {
       cursor.erase(context, drawingSurfaceImageData);
          
          setTimeout( function (e) {
             if (cursor.left == x &&
                cursor.top + cursor.getHeight(context) == y) {
              
                cursor.draw(context, x, y);

             }
          }, 300);
       }, 1000);
    }

    function moveCursor(x, y) {
       cursor.erase(context, drawingSurfaceImageData);
       saveDrawingSurface();
       context.putImageData(drawingSurfaceImageData, 0, 0);

       cursor.draw(context, x, y);
       blinkCursor(x, y);
    }

    // Event handlers................................................

    canvas.onmousedown = function (e) {
       var loc = windowToCanvas(e.clientX, e.clientY),
           fontHeight = context.measureText('W').width;

       fontHeight += fontHeight/6;
       line = new TextLine(loc.x, loc.y);
       moveCursor(loc.x, loc.y);
    };

    fillStyleSelect.onchange = function (e) {
       cursor.fillStyle = fillStyleSelect.value;
       context.fillStyle = fillStyleSelect.value;
    }

    strokeStyleSelect.onchange = function (e) {
       cursor.strokeStyle = strokeStyleSelect.value;
       context.strokeStyle = strokeStyleSelect.value;
    }

    // Key event handlers............................................
  if($('#overlay').css('display') == 'none'){
    console.log('jo');
    document.onkeydown = function (e) {
     
       if (e.keyCode === 8 || e.keyCode === 13) {
          // The call to e.preventDefault() suppresses
          // the browser's subsequent call to document.onkeypress(),
          // so only suppress that call for backspace and enter.
          e.preventDefault();
       }
       
       if (e.keyCode === 8) { // backspace
          context.save();

          line.erase(context, drawingSurfaceImageData);
          line.removeCharacterBeforeCaret();

          moveCursor(line.left + line.getWidth(context),
                     line.bottom);

          line.draw(context);

          context.restore();
       }
    }
       
    document.onkeypress = function (e) {
       var key = String.fromCharCode(e.which);

       if (e.keyCode !== 8 && !e.ctrlKey && !e.metaKey) {
         e.preventDefault(); // no further browser processing

         context.save();

         line.erase(context, drawingSurfaceImageData);
         line.insert(key);

         moveCursor(line.left + line.getWidth(context),
                    line.bottom);

         line.draw(context);

         context.restore();
       }
    }
  }
  else $(window).unbind('keydown');
    // Initialization................................................
    context.lineWidth = 2.0;
    saveDrawingSurface();
    }
  });
});