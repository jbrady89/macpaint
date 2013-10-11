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
    /*
    //var text = "untitled";
     //context.font = "16px serif";
     //context.fillText(text, 187, 14);
     //context.strokeRect(6, 6, 8, 8);
      context.lineWidth = 0;
      context.strokeStyle = "rgb(0, 0, 0)";
      context.beginPath(); // Start the path
      context.moveTo(1.5,3.5); // Set the path origin
      context.lineTo(6.5, 3.5); // Set the path destination
      context.closePath(); // Close the path
      context.stroke(); // Outline the path
      context.beginPath(); // Start the path
      context.moveTo(1.5,5.5); // Set the path origin
      context.lineTo(6.5, 5.5); // Set the path destination
      context.closePath(); // Close the path
      context.stroke(); // Outline the path
      context.beginPath(); // Start the path
      context.moveTo(1.5,7.5); // Set the path origin
      context.lineTo(6.5, 7.5); // Set the path destination
      context.closePath(); // Close the path
      context.stroke();
      context.beginPath(); // Start the path
      context.moveTo(1.5,9.5); // Set the path origin
      context.lineTo(6.5, 9.5); // Set the path destination
      context.closePath(); // Close the path
      context.stroke();
      context.beginPath(); // Start the path
      context.moveTo(1.5,11.5); // Set the path origin
      context.lineTo(6.5, 11.5); // Set the path destination
      context.closePath(); // Close the path
      context.stroke(); // Outline the path
      context.beginPath(); // Start the path
      context.moveTo(1.5,13.5); // Set the path origin
      context.lineTo(6.5, 13.5); // Set the path destination
      context.closePath(); // Close the path
      context.stroke();

      context.beginPath(); // Start the path
      context.moveTo(20.5,3.5); // Set the path origin
      context.lineTo(177.5, 3.5); // Set the path destination
      context.closePath(); // Close the path
      context.stroke();
      context.beginPath(); // Start the path
      context.moveTo(20.5,5.5); // Set the path origin
      context.lineTo(177.5, 5.5); // Set the path destination
      context.closePath(); // Close the path
      context.stroke();
      context.beginPath(); // Start the path
      context.moveTo(20.5,7.5); // Set the path origin
      context.lineTo(177.5, 7.5); // Set the path destination
      context.closePath(); // Close the path
      context.stroke(); // Outline the path
      context.beginPath(); // Start the path
      context.moveTo(20.5,9.5); // Set the path origin
      context.lineTo(177.5, 9.5); // Set the path destination
      context.closePath(); // Close the path
      context.stroke();
      context.beginPath(); // Start the path
      context.moveTo(20.5,11.5); // Set the path origin
      context.lineTo(177.5, 11.5); // Set the path destination
      context.closePath(); // Close the path
      context.stroke(); // Outline the path
      context.beginPath(); // Start the path
      context.moveTo(20.5,13.5); // Set the path origin
      context.lineTo(177.5, 13.5); // Set the path destination
      context.closePath(); // Close the path
      context.stroke();

      context.beginPath(); // Start the path
      context.moveTo(236.5,3.5); // Set the path origin
      context.lineTo(412.5, 3.5); // Set the path destination
      context.closePath(); // Close the path
      context.stroke(); // Outline the path
      context.beginPath(); // Start the path
      context.moveTo(236.5,5.5); // Set the path origin
      context.lineTo(412.5, 5.5); // Set the path destination
      context.closePath(); // Close the path
      context.stroke(); // Outline the path
      context.beginPath(); // Start the path
      context.moveTo(236.5,7.5); // Set the path origin
      context.lineTo(412.5, 7.5); // Set the path destination
      context.closePath(); // Close the path
      context.stroke(); // Outline the path
      context.beginPath(); // Start the path
      context.moveTo(236.5,9.5); // Set the path origin
      context.lineTo(412.5, 9.5); // Set the path destination
      context.closePath(); // Close the path
      context.stroke();
      context.beginPath(); // Start the path
      context.moveTo(236.5,11.5); // Set the path origin
      context.lineTo(412.5, 11.5); // Set the path destination
      context.closePath(); // Close the path
      context.stroke(); // Outline the path
      context.beginPath(); // Start the path
      context.moveTo(236.5,13.5); // Set the path origin
      context.lineTo(412.5, 13.5); // Set the path destination
      context.closePath(); // Close the path
      context.stroke();
      */
});

