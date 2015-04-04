// register onLoad event with anonymous function
// disable image dragging
window.ondragstart = function() { return true; } ;
$(document).ready(function(){
  //adjusts the viewbox div based on main canvas location
  //var vBoxStartLeft = $('#vbContainer').css('left');//viewbox starting positions
  //var vBoxStartTop = $('#vbContainer').css('top');
  $('.canvas').mouseup(function(){
    //var canvasLeft = parseInt($('.canvas').css('left')) / -3.06; //set viewbox position based on canvas position
    //var canvasTop = parseInt($('.canvas').css('top')) / -3.10;
    //$('#vbContainer').css('left', canvasLeft + 'px').css('top', canvasTop + 'px');
    //console.log($('#vbContainer').css('left'), $('#vbContainer').css('top'));
  });
  $('#yesScaled, #cancelScaled').mousedown(function(){//enables hover after mousedown on button
    //$(this).css('z-index', 9000);
    $(this).css({'background':'black','color':'white'});
    $(this).hover(
      function(){$(this).css({'background':'black','color':'white'})},
      function(){$(this).css({'background':'white','color':'black'});
    });
    /*$('#cancelScaled').mouseup(function(){
      var vbLastLeft = parseInt($('.canvas').css('left')) / -3.1; //set viewbox position based on canvas position
      var vbLastTop = parseInt($('.canvas').css('top')) / -2.8;
      $('.canvas').show();
      $('#vbContainer').css({'left': vbLastLeft,'top': vbLastTop})//returns viewbox to most recent position
    });*/
    $(document).mouseup(function(){
      $('#yesScaled, #cancelScaled').css({'background':'white','color':'black'});
      $('#yesScaled, #cancelScaled').unbind('hover');
    });
  });
  /*$('#yesScaled').mouseup(function(){
      console.log('show new area');
      //console.log($('#vbContainer').css('left'), $('#vbContainer').css('top'));
      console.log($('.canvas').css('left'));
      $(this).css({'background':'white','color':'black'});
      var left = parseInt($('#vbContainer').css('left'), 10) * -3.3;
      var top = parseInt($('#vbContainer').css('top'), 10) * -3.3;
      $('.canvas').css({'top': top,'left': left});
      $('.canvas').show();
  });*/
  if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){//ie specific code for dragging the viewBox
    $('#viewBox').mousedown(function(){
      $('#vbContainer').trigger('mousedown');
      $('#vbContainer').draggable({
          containment: '#scaledCanvas',
          drag: function(){
            vbLeft = parseInt($(this).css('left'), 10);
            vbTop = parseInt($(this).css('top'), 10);
            console.log('left: ' + vbLeft, 'top: ' + vbTop);
          }

        });
    });
  }
  $('#vbContainer').draggable({
      containment: '#scaledCanvas',
        start: function(){
          vbStart = {
            'left': parseInt($(this).css('left'), 10),
            'top': parseInt($(this).css('top'), 10)
          };
        },
        drag: function(){
          vbLeft = parseInt($(this).css('left'), 10);
          vbTop = parseInt($(this).css('top'), 10);
          console.log('left: ' + vbLeft, 'top: ' + vbTop);
        }
      });
  $('#about').mouseup(function(){
    setTimeout(aboutPopup, 500);
    function aboutPopup(){
      $('#aboutDiv').show();
      $('#applebutton').attr('src', 'css/img/applebuttoni.png');
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
        $('#applebutton').attr('src', 'css/img/applebuttonh.png');
        $(this).css({'background':'white','color':'black'});
      });
    });
  });

  $('#alarm').on('mouseup', function(){
    setTimeout(function(){
      $('#alarmDiv').show();

    }, 500);
  });
});