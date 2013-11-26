$(document).ready(function(){
  $('#closecanvastable').mousedown(function(){
    $('#checkbox').css('display','block').addClass('visible');
    $('#closecanvastable').mouseleave(function(){
      if($('#checkbox').hasClass('visible')){
        $('#checkbox').css('display','none').removeClass('visible').addClass('hidden');
      }
    });
    $('#closecanvastable').mouseenter(function(){
      if($('#checkbox').hasClass('hidden')){
        $('#checkbox').css('display','block').removeClass('hidden').addClass('visible');
      }
    });  
    $('#closecanvastable').mouseup(function(){
      $('#checkbox').css('display','none').removeClass('visible').removeClass('hidden');
    });    
    $(document).mouseup(function(){
      $('#checkbox').css('display','none').removeClass('visible').removeClass('hidden');
    }); 
  });


    

  var canvas = $(".rowlines");
  var context = canvas.get(0).getContext("2d");
  function drawdragbar (filename, active) {
    context.lineWidth=0;
    context.strokeStyle="rgb(0,0,0)";
    if (active) {
      for (i=0; i<6; i++){
        context.beginPath();
        context.moveTo(1.5, 3.5 + i*2);
        context.lineTo(412.5, 3.5 + i*2);
        context.closePath();
        context.stroke();
      }
    }
    //this is where the closed box and filename go
  }
  drawdragbar("untitled", true);
});

