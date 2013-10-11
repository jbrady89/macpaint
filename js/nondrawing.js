// register onLoad event with anonymous function
// disable image dragging
window.ondragstart = function() { return true; } ;
$(document).ready(function(){
  //adjusts the viewbox div based on main canvas location
  var vBoxStartLeft = $('#vbContainer').css('left');//viewbox starting positions
  var vBoxStartTop = $('#vbContainer').css('top');
  $('.canvas').mouseup(function(){
    var canvasLeft = parseInt($('.canvas').css('left')) / -3.1; //set viewbox position based on canvas position
    var canvasTop = parseInt($('.canvas').css('top')) / -2.8;
    $('#vbContainer').css('left', canvasLeft + 'px').css('top', canvasTop + 'px');
    console.log($('#vbContainer').css('left'), $('#vbContainer').css('top'));
  });
  $('#yesScaled, #cancelScaled').mousedown(function(){//enables hover after mousedown on button
    //$(this).css('z-index', 9000);
    $(this).css({'background':'black','color':'white'});
    $(this).hover(
      function(){$(this).css({'background':'black','color':'white'})},
      function(){$(this).css({'background':'white','color':'black'});
    });
    $('#cancelScaled').mouseup(function(){
      var vbLastLeft = parseInt($('.canvas').css('left')) / -3.1; //set viewbox position based on canvas position
      var vbLastTop = parseInt($('.canvas').css('top')) / -2.8;
      $('.canvas').show();
      $('#vbContainer').css({'left': vbLastLeft,'top': vbLastTop})//returns viewbox to most recent position
    });
    $(document).mouseup(function(){
      $('#yesScaled, #cancelScaled').css({'background':'white','color':'black'});
      $('#yesScaled, #cancelScaled').unbind('hover');
    });
  });
   $('#yesScaled').mouseup(function(){
      console.log($('#vbContainer').css('left'), $('#vbContainer').css('top'));
      console.log($('.canvas').css('left'));
      $(this).css({'background':'white','color':'black'});
      var sourceX = -3.1 * parseInt($('#vbContainer').css('left'));//set canvas position based on viewbox position
      var sourceY = -2.8 * parseInt($('#vbContainer').css('top'));
      
      $('.canvas').css({'top':sourceY,'left': sourceX});
      $('.canvas').show();
    });
  if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){//ie specific code for dragging the viewBox
    $('#viewBox').mousedown(function(){
      $('#vbContainer').trigger('mousedown');
      $('#vbContainer').draggable({containment: '#scaledCanvas'});
    });
  }
  $('#vbContainer').draggable({containment: '#scaledCanvas'});
  $('#about').mouseup(function(){
    setTimeout(aboutPopup, 500);
    function aboutPopup(){
      $('#aboutDiv').show();
    }
    $('#aboutOk').mousedown(function(){
      $('#aboutOk').css({'background':'black','color':'white'})
      $(this).hover(function(){ $(this).css({'background':'black','color':'white'})},
        function(){$(this).css({'background':'white','color':'black'});
      });
      $(document).mouseup(function(){
        $('#aboutOk').unbind('hover');
      });
      $('#aboutOk').mouseup(function(){
        $('#aboutDiv').hide();
        $(this).css({'background':'white','color':'black'});
      });
    });
  });
});