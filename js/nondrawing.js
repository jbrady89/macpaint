// register onLoad event with anonymous function
// disable image dragging
window.ondragstart = function() { return true; } ;


$(document).ready(function(){
  vBoxStartLeft = $('#viewBox').css('left');
  vBoxStartTop = $('#viewBox').css('top');
  $('.canvas').mouseup(function(){
    vBoxLeft = parseInt($('#viewBox').css('left'));
    vBoxTop = parseInt($('#viewBox').css('top'));
    var canvasLeft = parseInt($('.canvas').css('left')) / -3.09;
    var canvasTop = parseInt($('.canvas').css('top')) / -2.98
    $('#viewBox').css('left', canvasLeft + 'px').css('top', canvasTop + 'px');
  });
  $('#yesScaled, #cancelScaled').mousedown(function(){
    vBoxLeft = parseInt($('#viewBox').css('left'));
    vBoxTop = parseInt($('#viewBox').css('top'));
    $(this).css({'background':'black','color':'white'});
    $(this).hover(
      function(){$(this).css({'background':'black','color':'white'})},
      function(){$(this).css({'background':'white','color':'black'});
    });
    $('#yesScaled').mouseup(function(){
      $(this).css({'background':'white','color':'black'});
      var sourceX = -3.09 * parseInt($('#viewBox').css('left'));
      var sourceY = -2.98 * parseInt($('#viewBox').css('top'));
      $('.canvas').css('top', sourceY + 'px').css('left', sourceX + 'px');
      $('.canvas').show();
    });
    $('#cancelScaled').mouseup(function(){
      $('.canvas').show();
      $('#viewBox').css({'left':vBoxStartLeft ,'top': vBoxStartTop})
    });
    $(document).mouseup(function(){
      $('#yesScaled, #cancelScaled').css({'background':'white','color':'black'});
      $('#yesScaled, #cancelScaled').unbind('hover');
    });
  });
  $('#viewBox').draggable({containment: '#scaledCanvas'});
/*theDate();
startTime();
      function theDate(){
        var currentDate = new Date()
        var day = currentDate.getDate()
        var month = currentDate.getMonth() + 1
        var year = new Date().getFullYear().toString().substr(2, 2);
        document.getElementById('txt3').innerHTML=month+"/"+day+"/"+year+"";
    }
      $('#alarm').mouseup(function(){
        var grayItems = $('#file, #goodies, #font, #fontsize, #style');
        $('#alarmdiv, #alarmdrop, #inversedate, #txt3').show();
        $('#inverseclock, #inversealarm, #txt2').hide();
        $('.rowlines, #closecanvastable').hide();
        grayItems.addClass('inactive');
        theDate();
        $('#alarmcell').mousedown(function(){
          $('#inverseclock, #inversedate, #txt2, #txt3').hide();
          $('#inversealarm, #txt4').show();
        });
        $('#datecell').mousedown(function(){
          $('#inverseclock, #inversealarm, #txt2').hide();
          $('#inversedate, #txt3').show();
          theDate();
        });
        $('#clockcell').mousedown(function(){
          $('#inversedate, #inversealarm, #txt3').hide();
          $('#inverseclock,#txt2').show()
          startTime2();
        });
        $('#alarmCheckbox').mousedown(function(){
          $('#closeAlarm').show();
          $('#alarmCheckbox').mouseup(function(){
            $('#alarmdiv, #closeAlarm, #alarmdrop').hide();
            $('.rowlines, #closecanvastable').show();
            grayItems.removeClass('inactive');
          });
        });
      });
  $('#myCanvas').hover(function(){
    var el = document.getElementById("myCanvas");
     el.onkeypress = function(evt) {
         var charCode = evt.which;
         var charStr = String.fromCharCode(charCode);
         alert(charStr);
     };
    });
  //Alarm Clock
    function startTime(){
      var currentTime = new Date()
      var hours = currentTime.getHours()
      var minutes = currentTime.getMinutes()
      var seconds = currentTime.getSeconds()
    
    if (minutes < 10)
      minutes = "0" + minutes
      var suffix = "AM";
      if (hours >= 12) {
        suffix = "PM";
        hours = hours - 12;
      }
      if (hours == 0) {
        hours = 12;
      }
      document.getElementById('txt').innerHTML=hours+":"+minutes+":"+seconds+" "+suffix;
      t=setTimeout(function(){startTime()},500);
      document.getElementById('txt2').innerHTML=hours+":"+minutes+":"+seconds+" "+suffix;
      t=setTimeout(function(){startTime2()},500);
    }*/
});