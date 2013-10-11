$(document).ready(function(){
    //http://jsfiddle.net/mBzVR/4/
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    var lineWidth = context.lineWidth;
    var drawingSurfaceImageData,
        mousedown = {},
        rubberbandRect = {},
        dragging = false,
        ctx = canvas.getContext('2d'),
        painting = false,
        lastX = 0,
        lastY = 0;
$("#fontsize0").removeClass("textoutline");
$("#fontsize1").removeClass("textoutline");
$("#fontsize2").removeClass("textoutline");
$("#fontsize3").removeClass("textoutline");
$("#fontsize4").removeClass("textoutline");
$("#fontsize5").removeClass("textoutline");
     


        
    paintbrush(); //tool preset
    $('#brushbox').css('display','block').css({'top':'120px','left':'56px'});//brushbox preset
    $('#1b').mousedown(select);
   // $('#3a').mousedown(bucket);
    $('#3b').mousedown(spray);
    $('#4a').mousedown(paintbrush);
    $('#4b').mousedown(pencil);
    $('#4b').dblclick(fatbits);  
    $('#5b').mousedown(eraser);
    $('#5a').mousedown(drawlines);
    $('#6a').mousedown(function(){drawrect(false)});
    $('#6b').mousedown(function(){drawrect(true)});
    $('#8a').mousedown(function(){drawcircle(false)});
    $('#8b').mousedown(function(){drawcircle(true)});
    $('#7a').mousedown(function(){drawroundedrect(false)});
    $('#7b').mousedown(function(){drawroundedrect(true)});
    $('#9a').mousedown(function(){drawjellybean(false)});
    $('#10a').mousedown(polygon);
    $('#10b').mousedown(fillpolygon);
    //$('#4b').dblclick(doubleclickpencil);  



    function fatbits () {
        
    }

     
    function changeWidth2(){
        if(($('#checkbox0').hasClass('checked')) || ($('#line0').hasClass('checked'))){
            lineThickness = 1;
            context.lineWidth = 1;
        }
        if(($('#checkbox1').hasClass('checked')) || ($('#line1').hasClass('checked'))){
            lineThickness = 1;
            context.lineWidth = 1;
        }  
        if(($('#checkbox2').hasClass('checked')) || ($('#line2').hasClass('checked'))){
            lineThickness = 3;
            context.lineWidth = 3;
        } 
        if(($('#checkbox3').hasClass('checked')) || ($('#line3').hasClass('checked'))){
            lineThickness = 5;
            context.lineWidth = 5;
        } 
        if(($('#checkbox4').hasClass('checked')) || ($('#line4').hasClass('checked'))){
            lineThickness = 8;
            context.lineWidth = 8;
        } 
    }
   /*function bucket(){

    $('#myCanvas').mouseup(function(event){
        var stuff = context.getImageData(0,0,canvas.width,canvas.height);
       var pixelData = context.getImageData(event.offsetX, event.offsetY, 1, 1).data;
        console.log(pixelData[1]);
    });
   })*/  

function select(){
        context.lineWidth = 1;
// Functions..........................................................
        function drawRubberbandShape(loc) {
            CanvasRenderingContext2D.prototype.dashedLineTo = function (fromX, fromY, toX, toY, pattern) {
            var lt = function (a, b) { return a <= b; };
            var gt = function (a, b) { return a >= b; };
            var capmin = function (a, b) { return Math.min(a, b); };
            var capmax = function (a, b) { return Math.max(a, b); };
           
            var checkX = { thereYet: gt, cap: capmin };
            var checkY = { thereYet: gt, cap: capmin };
           
            if (fromY - toY > 0) {
              checkY.thereYet = lt;
              checkY.cap = capmax;
            }
            if (fromX - toX > 0) {
              checkX.thereYet = lt;
              checkX.cap = capmax;
            }
           
            this.moveTo(fromX, fromY);
            var offsetX = fromX;
            var offsetY = fromY;
            var idx = 0, dash = true;
            while (!(checkX.thereYet(offsetX, toX) && checkY.thereYet(offsetY, toY))) {
              var ang = Math.atan2(toY - fromY, toX - fromX);
              var len = pattern[idx];
           
              offsetX = checkX.cap(toX, offsetX + (Math.cos(ang) * len));
              offsetY = checkY.cap(toY, offsetY + (Math.sin(ang) * len));
           
              if (dash) this.lineTo(offsetX, offsetY);
              else this.moveTo(offsetX, offsetY);
           
              idx = (idx + 1) % pattern.length;
              dash = !dash;
            }
          }  
            context.beginPath();
            context.dashedLineTo(mousedown.x,mousedown.y,loc.x,mousedown.y,[5,5]);
            context.dashedLineTo(loc.x,mousedown.y,loc.x,loc.y,[5,5]);
            context.dashedLineTo(mousedown.x,mousedown.y,mousedown.x,loc.y,[5,5]);
            context.dashedLineTo(mousedown.x,loc.y,loc.x,loc.y,[5,5]);
            context.stroke();
      }
        function updateRubberband(loc) {
            updateRubberbandRectangle(loc);
          drawRubberbandShape(loc);
        }
        canvas.onmousedown = function (e) {
            var loc = windowToCanvas(e.clientX, e.clientY);
            e.preventDefault(); // Prevent cursor change
            saveDrawingSurface();
            mousedown.x = loc.x;
            mousedown.y = loc.y;
           

            mouseX = e.pageX - this.offsetLeft - 182;
            mouseY = e.pageY - this.offsetTop - 158;
            console.log(mouseX);
            console.log(mouseY);
            dragging = true;
      
        };
        canvas.onmousemove = function (e) {
            var loc;
            if (dragging) {
                e.preventDefault(); // Prevent selections
                loc = windowToCanvas(e.clientX, e.clientY);
                restoreDrawingSurface();
                updateRubberband(loc);
            }
        };  
            var selection = document.getElementById('selected');
            var ctx = selection.getContext('2d');
        canvas.onmouseup = function (e) {
            loc = windowToCanvas(e.clientX, e.clientY);
            restoreDrawingSurface();
            updateRubberband(loc);
            dragging = false;
            //gets width and height of selection
            w = Math.abs(loc.x - mousedown.x);
            h = Math.abs(loc.y - mousedown.y);
            //displays new canvas for the selection to be drawn
            $('#selected').show();
            $('#selected').html('<canvas id="selected" width='+w+' height='+h+'></canvas>')
            //selected area is copied from original canvas
            //dragging selection top left to bottom right
            if (loc.x > mousedown.x && loc.y > mousedown.y){
                $('#selected').css('left',mouseX).css('top',mouseY);
                ctx.drawImage(canvas, mousedown.x, mousedown.y, w, h, 0, 0, w, h);
                 context.clearRect(mousedown.x - 5 , mousedown.y - 5, w + 10, h + 10);
            }
            //top right to bottom left
            else if (loc.x < mousedown.x && loc.y > mousedown.y){
                $('#selected').css('left',mouseX - w).css('top',mouseY);
                ctx.drawImage(canvas, mousedown.x, loc.y, w, h, 0, 0, w, h);
                 context.clearRect( mousedown.x, loc.y, w + 5, h + 5);
            }
            //bottom left to top right
            else if (loc.x > mousedown.x && loc.y < mousedown.y){
                $('#selected').css('left',mouseX).css('top',mouseY - h);
                ctx.drawImage(canvas, mousedown.y, loc.x, w, h, 0, 0, w, h);
                 context.clearRect(mousedown.y, loc.x, w + 5, h + 5);
            }
            //bottom right to top left
            else if (loc.x < mousedown.x && loc.y < mousedown.y){
                $('#selected').css('left',mouseX - w).css('top',mouseY - h);
                ctx.drawImage(canvas, loc.x, loc.y, w, h, 0, 0, w, h);
                context.clearRect(loc.x, loc.y, w + 5, h + 5);
            }


            //new canvas is made draggable
            $('#selected').draggable();
            var top = parseInt($('#selected').css('top'));
            var left = parseInt($('#selected').css('left'));
            //after dragging new canvas
            $('#selected').mouseup(function(){
                console.log(left);
                console.log(top);
                //find top and left position of canvas
                var offsetX = parseInt($('.canvas').css('left'));
                var offsetY = parseInt($('.canvas').css('top'));
                //adjust top and left position of selection in relation to main canvas
                var left2 = -offsetX + parseInt($('#selected').css('left'));
                var top2 =  -offsetY + parseInt($('#selected').css('top'));
                //draw the image from selection back onto main canvas in new position
                ctx.save();
                context.drawImage(selection, 0, 0, selection.width, selection.height,left2 , top2, w, h);
                ctx.clearRect(0,0, selection.height + 1, selection.width+ 5);
                ctx.restore();
                $('#selected').hide();
            });
            
            //hides new canvas and copies its image for placing back onto main canvas
            /*$('#selected').mouseup(function(){
                $('#selected').hide();
                var top = parseInt($('#selected').css('top'));
                var left = parseInt($('#selected').css('left'));
                var width = $('#selected').width();
                var height = $('#selected').height();
                console.log(width);
                console.log(top);
              context.drawImage(selection, 0, 0, selection.width, selection.height, top, left, width, height);
            });*/
            //clears area underneath selection
            //context.clearRect(mousedown.x, mousedown.y, w, h);
        };
    }
    $('#selected').css('display','none');
function paintbrushsmall (){

        canvas.onmousedown = function(e) {
            painting = true;
            ctx.fillStyle = "pattern";
             lastX = e.pageX - canvas.offsetLeft - 88;
            lastY = e.pageY - canvas.offsetTop - 55;
        };

        canvas.onmouseup = function(e){
            painting = false;
        }

        canvas.onmousemove = function(e) {
            if (painting) {
                mouseX = e.pageX - this.offsetLeft - 88;
                mouseY = e.pageY - this.offsetTop - 55;

                // find all points between        
                var x1 = mouseX,
                    x2 = lastX,
                    y1 = mouseY,
                    y2 = lastY;


                var steep = (Math.abs(y2 - y1) > Math.abs(x2 - x1));
                if (steep){
                    var x = x1;
                    x1 = y1;
                    y1 = x;

                    var y = y2;
                    y2 = x2;
                    x2 = y;
                }
                if (x1 > x2) {
                    var x = x1;
                    x1 = x2;
                    x2 = x;

                    var y = y1;
                    y1 = y2;
                    y2 = y;
                }

                var dx = x2 - x1,
                    dy = Math.abs(y2 - y1),
                    error = 0,
                    de = dy / dx,
                    yStep = -1,
                    y = y1;

                if (y1 < y2) {
                    yStep = 1;
                }

                lineThickness = 1;
                var fillpattern = new Image();
                var choice = $('#innerimagetable').attr('brushpattern');
                fillpattern.src = choice;
                var pattern = ctx.createPattern(fillpattern, 'repeat');
                ctx.fillCircle = function(x, y, radius) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.arc(x+1, y+1, radius, 0, Math.PI * 2, false);
                };

                for (var x = x1; x < x2; x++) {
                   
                    ctx.fillStyle = pattern;
                    if (steep) {
                        radius;
                        ctx.fillCircle(y, x, radius);
                    } 
                    else {
                        radius;
                        ctx.fillCircle(x, y, radius);
                    }
                    error += de;
                    if (error >= 0.5) {
                        y += yStep;
                        error -= 1.0;
                    }
                    ctx.fill();
                }
                lastX = mouseX;
                lastY = mouseY;
            }
        }
    }

    $('#spraydesign').mousedown(function(){
        $('#myCanvas').css({"cursor":"url(groupofdots.png), default"});
        largeDotif = function(ctx, x, y, lineThickness) {
            lineThickness = 1;
            ctx.fillRect(y + 5, x, lineThickness , lineThickness );
            ctx.fillRect(y + 1, x + 3, lineThickness , lineThickness );
            ctx.fillRect(y + 11, x + 3, lineThickness , lineThickness );
            ctx.fillRect(y + 7, x + 5, lineThickness , lineThickness );
            ctx.fillRect(y, x + 7, lineThickness , lineThickness );
            ctx.fillRect(y + 5, x + 9, lineThickness , lineThickness );
            ctx.fillRect(y + 11, x + 9, lineThickness , lineThickness );
            ctx.fillRect(y + 2, x + 12, lineThickness , lineThickness );
            ctx.fillRect(y + 9, x + 12, lineThickness , lineThickness );
        }
        largeDotelse = function(ctx, x, y, lineThickness) { 
            lineThickness = 1;
            ctx.fillRect(x, y + 5, lineThickness , lineThickness );
            ctx.fillRect(x + 3, y + 1,  lineThickness , lineThickness );
            ctx.fillRect(x + 3, y + 11,  lineThickness , lineThickness );
            ctx.fillRect(x + 5, y + 7,  lineThickness , lineThickness );
            ctx.fillRect(x + 7, y,  lineThickness , lineThickness );
            ctx.fillRect(x + 9, y + 5,  lineThickness , lineThickness );
            ctx.fillRect(x + 9, y + 11,  lineThickness , lineThickness );
            ctx.fillRect(x + 12, y + 2,  lineThickness , lineThickness );
            ctx.fillRect(x + 12, y + 9,  lineThickness , lineThickness );
        }
        $('#brushbox').css('display','block').css({'top':'88px','left':'248px'});
        spraydesign();
        if (spraydesign){
            $('#4a').mousedown(spraydesign);
        }
    });
    $('#dot').mousedown(function(){
        $('#myCanvas').css({"cursor":"url(largerdot.png), default"});
        largeDotif = function(ctx, x, y, lineThickness) {
            lineThickness = 2
            ctx.fillRect(y - 1, x, lineThickness , lineThickness );
        }
        largeDotelse = function(ctx, x, y, lineThickness) { 
            lineThickness = 2
            ctx.fillRect(x - 1, y, lineThickness , lineThickness );
        }
        $('#brushbox').css('display','block').css({'top':'120px','left':'248px'});
        spraydesign();
        if (spraydesign){
            $('#4a').mousedown(spraydesign);
        }
    });


    $('#dottedhorizontalline').mousedown(function(){
        $('#myCanvas').css({"cursor":"url(largehorizontaldotted.png), default"});
        largeDotif = function(ctx, x, y, lineThickness) {
            lineThickness = 1;
            for (i=0;i<16;i+=3){
                ctx.fillRect(y + i, x , lineThickness , lineThickness );
            }
        }
        largeDotelse = function(ctx, x, y, lineThickness) { 
            lineThickness = 1;
            for (i=0;i<16;i+=3){
                ctx.fillRect(x + i, y, lineThickness , lineThickness );
            }
        }
        $('#brushbox').css('display','block').css({'top':'56px','left':'248px'});
        spraydesign();
        if (spraydesign){
            $('#4a').mousedown(spraydesign);
        }
    });
    $('#dottedverticalline').mousedown(function(){
        $('#myCanvas').css({"cursor":"url(largeverticaldotted.png), default"});
        largeDotif = function(ctx, x, y, lineThickness) {
            lineThickness = 1;
            for (i=0;i<16;i+=3){
                ctx.fillRect(y, x + i, lineThickness , lineThickness );
            }
        }
        largeDotelse = function(ctx, x, y, lineThickness) { 
            lineThickness = 1;
            for (i=0;i<16;i+=3){
                ctx.fillRect(x, y + i, lineThickness , lineThickness );
            }      
        }
        $('#brushbox').css('display','block').css({'top':'24px','left':'248px'});
        spraydesign();
        if (spraydesign){
            $('#4a').mousedown(spraydesign);
        }
    });
    $('#smalldottedrighttiltline').mousedown(function(){
        $('#myCanvas').css({"cursor":"url(smalldottedline.png), default"});
        largeDotif = function(ctx, x, y, lineThickness) {
            lineThickness = 1;
            ctx.fillRect(y, x, lineThickness , lineThickness );  
        }
         largeDotelse = function(ctx, x, y, lineThickness) { 
            lineThickness = 1;
            ctx.fillRect(x, y, lineThickness , lineThickness );
        }
        $('#brushbox').css('display','block').css({'top':'120px','left':'216px'});
        spraydesign();
        if (spraydesign){
            $('#4a').mousedown(spraydesign);
        }
    });
    $('#mediumdottedrighttiltline').mousedown(function(){
        $('#myCanvas').css({"cursor":"url(mediumtiltdotted.png), default"});
        largeDotif = function(ctx, x, y, lineThickness) {
            ctx.fillRect(y, x + 4, lineThickness , lineThickness );
            ctx.fillRect(y + 2, x + 2, lineThickness , lineThickness );
            ctx.fillRect(y + 4, x, lineThickness , lineThickness ); 
        }
        largeDotelse = function(ctx, x, y, lineThickness) { 
            ctx.fillRect(x, y + 4, lineThickness , lineThickness );
            ctx.fillRect(x + 2, y + 2, lineThickness , lineThickness );
            ctx.fillRect(x + 4, y, lineThickness , lineThickness );    
        }
        $('#brushbox').css('display','block').css({'top':'88px','left':'216px'});
        spraydesign();
        if (spraydesign){
            $('#4a').mousedown(spraydesign);
        }
    });

    function spraydesign () {
        var choice = $('#innerimagetable').attr('brushpattern');
        lineThickness = 1;
        var fillpattern = new Image();
        fillpattern.src = choice;
        var pattern = ctx.createPattern(fillpattern, 'repeat');
        
        canvas.onmousedown = function(e) {
            painting = true;
            ctx.fillStyle = pattern;
            lastX = e.pageX - canvas.offsetLeft - 88;
            lastY = e.pageY - canvas.offsetTop - 55;
        };

        canvas.onmouseup = function(e){
            painting = false;
        }

        canvas.onmousemove = function(e) {
            var fillpattern = new Image();
                var choice = $('#innerimagetable').attr('brushpattern');
                fillpattern.src = choice;
                var pattern = ctx.createPattern(fillpattern, 'repeat');
                ctx.fillRect;
            if (painting) {
                mouseX = e.pageX - this.offsetLeft - 88;
                mouseY = e.pageY - this.offsetTop - 55;

                // find all points between        
                var x1 = mouseX,
                    x2 = lastX,
                    y1 = mouseY,
                    y2 = lastY;


                var steep = (Math.abs(y2 - y1) > Math.abs(x2 - x1));
                if (steep){
                    var x = x1;
                    x1 = y1;
                    y1 = x;

                    var y = y2;
                    y2 = x2;
                    x2 = y;
                }
                if (x1 > x2) {
                    var x = x1;
                    x1 = x2;
                    x2 = x;

                    var y = y1;
                    y1 = y2;
                    y2 = y;
                }

                var dx = x2 - x1,
                    dy = Math.abs(y2 - y1),
                    error = 0,
                    de = dy / dx,
                    yStep = -1,
                    y = y1;

                if (y1 < y2) {
                    yStep = 1;
                }

                lineThickness = 1;

                
                for (var x = x1; x < x2; x++) {
            if (steep) {
    
                largeDotif(ctx, x, y, lineThickness);
            }
            else {
                largeDotelse(ctx, x, y, lineThickness);
            }
        

                    error += de;
                    if (error >= 0.5) {
                        y += yStep;
                        error -= 1.0;
                    }
                    ctx.fillStyle = pattern;
                    ctx.fill();
                }
                lastX = mouseX;
                lastY = mouseY;
            }
        }
    }
    var largeDotif;
    var largeDotelse;
    $('#largedottedrighttiltline').mousedown(function(){
        $('#myCanvas').css({"cursor":"url(largetiltdotted.png), default"});
        largeDotif = function(ctx, x, y, lineThickness) {
            ctx.fillRect(y, x + 10, lineThickness , lineThickness );
            ctx.fillRect(y + 2, x + 8, lineThickness , lineThickness );
            ctx.fillRect(y + 4, x + 6, lineThickness , lineThickness );
            ctx.fillRect(y + 6, x + 4, lineThickness , lineThickness );
            ctx.fillRect(y + 8, x + 2, lineThickness , lineThickness );
        }
        largeDotelse = function(ctx, x, y, lineThickness) {
            ctx.fillRect(x, y +9,  lineThickness , lineThickness );
            ctx.fillRect(x + 2, y + 8,  lineThickness , lineThickness );
            ctx.fillRect(x + 4, y + 6,  lineThickness , lineThickness );
            ctx.fillRect(x + 6, y + 4,  lineThickness , lineThickness );
            ctx.fillRect(x + 8, y + 2,  lineThickness , lineThickness ); 
        }
        console.log(largeDotif);
        $('#brushbox').css('display','block').css({'top':'56px','left':'216px'});
        spraydesign();
        if (spraydesign){
            $('#4a').mousedown(spraydesign);
        }
    });

    $('#xldottedrighttiltline').mousedown(function(){
        $('#myCanvas').css({"cursor":"url(xldottedrighttiltline.png), default"});
        largeDotif = function(ctx, x, y, lineThickness) {
            for (i=-2, j=16;i<15, j>-1;i+=2, j-=2){
                ctx.fillRect(y + i, x + j, lineThickness , lineThickness );
            }
        }
        largeDotelse = function(ctx, x, y, lineThickness) {
            for (i=-2, j=16;i<15, j>-1;i+=2, j-=2){
                ctx.fillRect(x + i, y + j, lineThickness , lineThickness );
            }
        }
        console.log(largeDotif);
        $('#brushbox').css('display','block').css({'top':'24px','left':'216px'});
        spraydesign();
        if (spraydesign){
            $('#4a').mousedown(spraydesign);
        }
    });

    $('#smallhorizontalline').mousedown(function(){
        largeDotif = function(ctx, x, y, lineThickness) {
            for (i=-1;i<3;i++){
                ctx.fillRect(y + i, x, lineThickness , lineThickness );
            }
        }  
        largeDotelse = function(ctx, x, y, lineThickness) { 
            for (i=-1; i<3; i++) {                   
                ctx.fillRect(x + i, y, lineThickness , lineThickness );
            }    
        }
        $('#myCanvas').css({"cursor":"url(brushshapes/smallhorizontalline.png), default"});
        $('#brushbox').css('display','block').css({'top':'120px','left':'184px'});
        spraydesign();
        if (spraydesign){
            $('#4a').mousedown(spraydesign);
        }
    });



    $('#mediumhorizontalline').mousedown(function(){
        largeDotif = function(ctx, x, y, lineThickness) {  
            for (i=-1; i<6; i++) {                   
                ctx.fillRect(y + i, x, lineThickness , lineThickness );
            }
        }
         largeDotelse = function(ctx, x, y, lineThickness) { 
            for (i=-1; i<6; i++) {                   
                ctx.fillRect(x + i, y, lineThickness , lineThickness );
            }
        }
        $('#myCanvas').css({"cursor":"url(brushshapes/mediumhorizontalline.png), default"});
        $('#brushbox').css('display','block').css({'top':'88px','left':'184px'});
        spraydesign();
        if (spraydesign){
            $('#4a').mousedown(spraydesign);
        }
    });
    $('#largehorizontalline').mousedown(function(){
        largeDotif = function(ctx, x, y, lineThickness) {   
        lineThickness = 2; 
            for (i=-1; i<10; i++) {                   
                ctx.fillRect(y + i, x, lineThickness , lineThickness );
            }
        }
        largeDotelse = function(ctx, x, y, lineThickness) { 
            lineThickness = 2; 
            for (i=-1; i<10; i++) {                   
                ctx.fillRect(x + i, y, lineThickness , lineThickness );
            }
        }
        $('#myCanvas').css({"cursor":"url(largehorizontalline.png), default"});
        $('#brushbox').css('display','block').css({'top':'56px','left':'184px'});
        spraydesign();
        if (spraydesign){
            $('#4a').mousedown(spraydesign);
        }
    });
    $('#xlhorizontalline').mousedown(function(){
        largeDotif = function(ctx, x, y, lineThickness) { 
            for (i=-1; i<16; i++) {                   
                ctx.fillRect(y + i, x, lineThickness , lineThickness );
            }
        }  
        largeDotelse = function(ctx, x, y, lineThickness) { 
            lineThickness = 2;
            for (i=-1; i<15; i++) {                   
                ctx.fillRect(x + i, y, lineThickness , lineThickness );
            }
        }
        $('#myCanvas').css({"cursor":"url(xlhorizontalline.png), default"});
        $('#brushbox').css('display','block').css({'top':'24px','left':'184px'});
        spraydesign();
        if (spraydesign){
            $('#4a').mousedown(spraydesign);
        }
    });


    $('#smallverticalline').mousedown(function(){
        largeDotif = function(ctx, x, y, lineThickness) { 
            for (i=0; i<4; i++) {                   
                ctx.fillRect(y, x + i, lineThickness , lineThickness );
            }
        }
        largeDotelse = function(ctx, x, y, lineThickness) { 
            for (i=0; i<4; i++) {                   
                ctx.fillRect(x , y + i, lineThickness , lineThickness );
            }
        }
        $('#myCanvas').css({"cursor":"url(brushshapes/smallverticalline.png), default"});
        $('#brushbox').css('display','block').css({'top':'120px','left':'152px'});
        spraydesign();
        if (spraydesign){
            $('#4a').mousedown(spraydesign);
        }
    });
    $('#mediumverticalline').mousedown(function(){
        largeDotif = function(ctx, x, y, lineThickness) { 
            for (i=0; i<8; i++) {                   
                ctx.fillRect(y, x + i, lineThickness , lineThickness );
            }
        }
        largeDotelse = function(ctx, x, y, lineThickness) { 
            for (i=0; i<8; i++) {                   
                ctx.fillRect(x , y + i, lineThickness , lineThickness );
            }
        }
        $('#myCanvas').css({"cursor":"url(brushshapes/mediumverticalline.png), default"});
        $('#brushbox').css('display','block').css({'top':'88px','left':'152px'});
        spraydesign();
        if (spraydesign){
            $('#4a').mousedown(spraydesign);
        }
    });

    $('#largeverticalline').mousedown(function(){
        largeDotif = function(ctx, x, y, lineThickness) { 
            lineThickness = 2;
            for (i=0; i<12; i++) {                   
                ctx.fillRect(y, x + i, lineThickness , lineThickness );
            }
        }
        largeDotelse = function(ctx, x, y, lineThickness) { 
            lineThickness = 2;
            for (i=0; i<12; i++) {                   
                ctx.fillRect(x , y + i, lineThickness , lineThickness );
            }
        }
        $('#myCanvas').css({"cursor":"url(largeverticalline.png), default"});
        $('#brushbox').css('display','block').css({'top':'56px','left':'152px'});
        spraydesign();
        if (spraydesign){
            $('#4a').mousedown(spraydesign);
        }
    });
    $('#xlverticalline').mousedown(function(){
        largeDotif = function(ctx, x, y, lineThickness) { 
            lineThickness = 2;
            for (i=0; i<16; i++) {                   
                ctx.fillRect(y, x + i, lineThickness , lineThickness );
            }
        }
        largeDotelse = function(ctx, x, y, lineThickness) { 
            lineThickness = 2;
            for (i=0; i<16; i++) {                   
                ctx.fillRect(x , y + i, lineThickness , lineThickness );
            }
        }
        $('#myCanvas').css({"cursor":"url(xlverticalline.png), default"});
        $('#brushbox').css('display','block').css({'top':'24px','left':'152px'});
        
        spraydesign();
        if (spraydesign){
            $('#4a').mousedown(spraydesign);
        }
    });


    $('#smalllefttiltline').mousedown(function(){
        largeDotif = function(ctx, x, y, lineThickness) { 
            ctx.fillRect(y, x-1, lineThickness , lineThickness );
            ctx.fillRect(y, x, lineThickness , lineThickness );
            ctx.fillRect(y + 1, x, lineThickness , lineThickness );
            ctx.fillRect(y + 1, x + 1, lineThickness , lineThickness );
            ctx.fillRect(y + 2, x + 1, lineThickness , lineThickness );
            ctx.fillRect(y + 2, x + 2, lineThickness , lineThickness );
        }   
        largeDotelse = function(ctx, x, y, lineThickness) {
            for (i=0, j=-1;i<3, j<2;i++, j++){
                ctx.fillRect(x + i, y + j, lineThickness , lineThickness );
            }
            for (i=0, j=0;i<3, j<3;i++, j++){
                ctx.fillRect(x + i, y + j, lineThickness , lineThickness );
            }
        } 
        $('#myCanvas').css({"cursor":"url(brushshapes/smalllefttiltline.png), default"});
        $('#brushbox').css('display','block').css({'top':'120px','left':'120px'});
        spraydesign();
        if (spraydesign){
            $('#4a').mousedown(spraydesign);
        }
    });


    $('#mediumlefttiltline').mousedown(function(){
        largeDotif = function(ctx, x, y, lineThickness) { 
            for (i=0, j=-1;i<6, j<5;i++, j++){
                ctx.fillRect(y + i, x + j, lineThickness , lineThickness );
            }
            for (i=0, j=0;i<5, j<5;i++, j++){
                ctx.fillRect(y + i, x + j, lineThickness , lineThickness );
            }
        }
        largeDotelse = function(ctx, x, y, lineThickness) {
            for (i=0, j=-1;i<6, j<5;i++, j++){
                ctx.fillRect(x + i, y + j, lineThickness , lineThickness );
            }
            for (i=0, j=0;i<5, j<5;i++, j++){
                ctx.fillRect(x + i, y + j, lineThickness , lineThickness );
            }   
        }
        $('#myCanvas').css({"cursor":"url(brushshapes/mediumlefttiltline.png), default"});
        $('#brushbox').css('display','block').css({'top':'88px','left':'120px'});
        $('#brushestable').find('td').removeClass();
            $(this).addClass('active');
            spraydesign();
            if (spraydesign){
                $('#4a').mousedown(spraydesign);
            }
    });


    $('#largelefttiltline').mousedown(function(){
        largeDotif = function(ctx, x, y, lineThickness) { 
            for (i=0, j=-1;i<10, j<10;i++, j++){
                ctx.fillRect(y + i, x + j, lineThickness , lineThickness );
            }
            for (i=0, j=0;i<10, j<10;i++, j++){
                ctx.fillRect(y + i, x + j, lineThickness , lineThickness );
            }
        }
        largeDotelse = function(ctx, x, y, lineThickness) {
            for (i=0, j=-1;i<10, j<9;i++, j++){
                ctx.fillRect(x + i, y + j, lineThickness , lineThickness );
            }
            for (i=0, j=0;i<10, j<10;i++, j++){
                ctx.fillRect(x + i, y + j, lineThickness , lineThickness );
            } 
        }
            $('#myCanvas').css({"cursor":"url(brushshapes/largelefttiltline.png), default"});
            $('#brushbox').css('display','block').css({'top':'56px','left':'120px'});
            $('#brushestable').find('td').removeClass();
            $(this).addClass('active');
            spraydesign();
            if (spraydesign){
                $('#4a').mousedown(spraydesign);
            }
        });

    $('#xllefttiltline').mousedown(function(){
        largeDotif = function(ctx, x, y, lineThickness) { 
            for (i=0, j=-1;i<15, j<14;i++, j++){
                ctx.fillRect(y + i, x + j, lineThickness , lineThickness );
            }
            for (i=0, j=0;i<15, j<15;i++, j++){
                ctx.fillRect(y + i, x + j, lineThickness , lineThickness );
            }
        }
        largeDotelse = function(ctx, x, y, lineThickness) {
            for (i=0, j=-1;i<15, j<14;i++, j++){
                ctx.fillRect(x + i, y + j, lineThickness , lineThickness );
            }
            for (i=0, j=0;i<15, j<15;i++, j++){
                ctx.fillRect(x + i, y + j, lineThickness , lineThickness );
            } 
        }
        $('#myCanvas').css({"cursor":"url(brushshapes/xllefttiltline.png), default"});
        $('#brushbox').css('display','block').css({'top':'24px','left':'120px'});
        spraydesign();
        if (spraydesign){
            $('#4a').mousedown(spraydesign);
        }
    });

    $('#smallrighttiltline').mousedown(function(){
        largeDotif = function(ctx, x, y, lineThickness) { 
            ctx.fillRect(y, x + 2, lineThickness , lineThickness );
            ctx.fillRect(y + 1, x + 2, lineThickness , lineThickness );
            ctx.fillRect(y + 1, x + 1, lineThickness , lineThickness );
            ctx.fillRect(y + 2, x + 1, lineThickness , lineThickness );
            ctx.fillRect(y + 2, x, lineThickness , lineThickness );
            ctx.fillRect(y + 3, x, lineThickness , lineThickness );
        }
        largeDotelse = function(ctx, x, y, lineThickness) {
            ctx.fillRect( x + 2, y, lineThickness , lineThickness );
            ctx.fillRect( x + 2, y + 1, lineThickness , lineThickness );
            ctx.fillRect( x + 1, y + 1, lineThickness , lineThickness );
            ctx.fillRect( x + 1, y + 2, lineThickness , lineThickness );
            ctx.fillRect( x, y + 2, lineThickness , lineThickness );
            ctx.fillRect( x, y + 3, lineThickness , lineThickness );
        }
        $('#myCanvas').css({"cursor":"url(brushshapes/smallrighttiltcur.png), default"});
        $('#brushbox').css('display','block').css({'top':'120px','left':'88px'});
        spraydesign();
        if (spraydesign){
            $('#4a').mousedown(spraydesign);
        }
    });

    $('#mediumrighttiltline').mousedown(function(){
        largeDotif = function(ctx, x, y, lineThickness) { 
            for (i=0, j=5;i<6, j>-1;i++, j--){
                ctx.fillRect(y + i, x + j, lineThickness , lineThickness );
            }
            for (i=1, j=5;i<7, j>-1;i++, j--){
                ctx.fillRect(y + i, x + j, lineThickness , lineThickness );
            }
        }
        largeDotelse = function(ctx, x, y, lineThickness) {
            for (i=0, j=5;i<6, j>-1;i++, j--){
                ctx.fillRect(x + i, y + j, lineThickness , lineThickness );
            }
            for (i=1, j=5;i<7, j>-1;i++, j--){
                ctx.fillRect(x + i, y + j, lineThickness , lineThickness );
            }
        }
        $('#myCanvas').css({"cursor":"url(brushshapes/mediumrighttilt.png), default"});
        $('#brushbox').css('display','block').css({'top':'88px','left':'88px'});
        spraydesign();
        if (spraydesign){
            $('#4a').mousedown(spraydesign);
        }
    });


    $('#largerighttiltline').mousedown(function(){
        largeDotif = function(ctx, x, y, lineThickness) {  
            for (i=1, j=7;i<10, j>-2;i++, j--){
                ctx.fillRect(y + i, x + j, lineThickness , lineThickness );
            }
            for (i=2, j=7;i<10, j>-1;i++, j--){
                ctx.fillRect(y + i, x + j, lineThickness , lineThickness );
            }
        }
        largeDotelse = function(ctx, x, y, lineThickness) {
            for (i=1, j=7;i<10, j>-2;i++, j--){
                ctx.fillRect(x + i, y + j, lineThickness , lineThickness );
            }
            for (i=2, j=7;i<7, j>-1;i++, j--){
                ctx.fillRect(x + i, y + j, lineThickness , lineThickness );
            }
        }
        $('#myCanvas').css({"cursor":"url(brushshapes/largerighttiltline.png), default"});
        $('#brushbox').css('display','block').css({'top':'56px','left':'88px'});
        spraydesign();
        if (spraydesign){
            $('#4a').mousedown(spraydesign);
        }
    });
    $('#xlrighttiltline').mousedown(function(){
        largeDotif = function(ctx, x, y, lineThickness) { 
            lineThickness = 2;
            for (i=2, j=12;i<16, j>-2;i++, j--){
                ctx.fillRect(y + i, x + j, lineThickness , lineThickness );
            }
            for (i=2, j=12;i<15, j>-1;i++, j--){
                ctx.fillRect(y + i, x + j, lineThickness , lineThickness );
            }
        }
        largeDotelse = function(ctx, x, y, lineThickness) {
            lineThickness = 2;
            for (i=2, j=12;i<16, j>-2;i++, j--){
                ctx.fillRect(x + i, y + j, lineThickness , lineThickness );
            }
            for (i=2, j=12;i<15, j>-1;i++, j--){
                ctx.fillRect(x + i, y + j, lineThickness , lineThickness );
            }
        }
        $('#myCanvas').css({"cursor":"url(brushshapes/xlrighttiltcursor.png), default"});
        $('#brushbox').css('display','block').css({'top':'24px','left':'88px'});
        spraydesign();
        if (spraydesign){
            $('#4a').mousedown(spraydesign);
        }
    });

//circular brushes
    var radius;
    $('#smallcircle').mousedown(function(){
        radius = 2;
        $('#brushbox').css('display','block').css({'top':'120px','left':'56px'});
        paintbrushsmall();
        if ( paintbrushsmall){
            $('#4a').mousedown( paintbrushsmall);
            $('#myCanvas').css({"cursor":"url(brushshapes/smallcirclecursor.png), default"});
        }
    });
    $('#mediumcircle').mousedown(function(){
        radius = 4;
        $('#brushbox').css('display','block').css({'top':'88px','left':'56px'});
        paintbrushsmall();
        if ( paintbrushsmall){
            $('#4a').mousedown( paintbrushsmall);
            $('#myCanvas').css({"cursor":"url(brushshapes/mediumcirclecursor.png), default"});
        }
    });
    $('#largecircle').mousedown(function(){
        radius = 6;
        $('#brushbox').css('display','block').css({'top':'56px','left':'56px'});
        paintbrushsmall();
        if ( paintbrushsmall){
            $('#4a').mousedown( paintbrushsmall);
            $('#myCanvas').css({"cursor":"url(brushshapes/largecirclecursor.png), default"});
        }
    });
    $('#xlcircle').mousedown(function(){
        radius = 8;
        $('#brushbox').css('display','block').css({'top':'24px','left':'56px'});
        paintbrushsmall();
        if ( paintbrushsmall){
            $('#4a').mousedown( paintbrushsmall);
            $('#myCanvas').css({"cursor":"url(brushshapes/xlcirclecursor.png), default"});
        }    
    });
//square brushes
    var lineThickness;
    $('#smallsquare').mousedown(function(){
        lineThickness = 5;
        $('#brushbox').css('display','block').css({'top':'120px','left':'24px'});
        squarebrushsmall();
        if (squarebrushsmall){
            $('#4a').mousedown(squarebrushsmall);
            $('#myCanvas').css({"cursor":"url(smallsquarecursor.png), default"});
        }
    });
    $('#mediumsquare').mousedown(function(){
        lineThickness = 20;
        $('#brushbox').css('display','block').css({'top':'88px','left':'24px'});
        squarebrushsmall();
        if (squarebrushsmall){
            $('#4a').mousedown(squarebrushsmall);
            $('#myCanvas').css({"cursor":"url(mediumsquarecursor.png), default"});
        }
    });
    $('#largesquare').mousedown(function(){
        lineThickness = 30;
        $('#brushbox').css('display','block').css({'top':'56px','left':'24px'});
        squarebrushsmall();
        if (squarebrushsmall){
            $('#4a').mousedown(squarebrushsmall);
            $('#myCanvas').css({"cursor":"url(largesquarecursor.png), default"});
          }   
    });
    $('#xlsquare').mousedown(function(){
        lineThickness = 40;
        $('#brushbox').css('display','block').css({'top':'24px','left':'24px'});
        squarebrushsmall();
        if (squarebrushsmall){
            $('#4a').mousedown(squarebrushsmall);
            $('#myCanvas').css({"cursor":"url(xlsquarecursor.png), default"});
        }
    });
    

    function squarebrushsmall () {
      
        $('#myCanvas').css({"cursor":"url(smallsquarecursor.png), default"});
        canvas.onmousedown = function(e) {
            painting = true;
            lastX = e.pageX - canvas.offsetLeft - 88;
            lastY = e.pageY - canvas.offsetTop - 55;
        };

        canvas.onmouseup = function(e){
            painting = false;
        }

        canvas.onmousemove = function(e) {
            if (painting) {
                mouseX = e.pageX - this.offsetLeft - 88;
                mouseY = e.pageY - this.offsetTop - 55;

                // find all points between        
                var x1 = mouseX,
                    x2 = lastX,
                    y1 = mouseY,
                    y2 = lastY;


                var steep = (Math.abs(y2 - y1) > Math.abs(x2 - x1));
                if (steep){
                    var x = x1;
                    x1 = y1;
                    y1 = x;

                    var y = y2;
                    y2 = x2;
                    x2 = y;
                }
                if (x1 > x2) {
                    var x = x1;
                    x1 = x2;
                    x2 = x;

                    var y = y1;
                    y1 = y2;
                    y2 = y;
                }

                var dx = x2 - x1,
                    dy = Math.abs(y2 - y1),
                    error = 0,
                    de = dy / dx,
                    yStep = -1,
                    y = y1;

                if (y1 < y2) {
                    yStep = 1;
                }

                
                var fillpattern = new Image();
                var choice = $('#innerimagetable').attr('brushpattern');
                fillpattern.src = choice;
                var pattern = ctx.createPattern(fillpattern, 'repeat');
                ctx.fillSquare = function(x, y, radius) {
                ctx.beginPath();
                ctx.moveTo(x-1, y-8);
                ctx.lineTo(x, y, radius, 0, Math.PI * 2, false);
                };
            
                for (var x = x1; x < x2; x++) {
                    ctx.fillStyle = pattern;
                    if (steep) {
                        lineThickness;
                        ctx.fillRect(y, x, lineThickness , lineThickness );
                    } else {
                        lineThickness;
                        ctx.fillRect(x, y, lineThickness , lineThickness );
                    }

                    error += de;
                    if (error >= 0.5) {
                        y += yStep;
                        error -= 1.0;
                    }
                    ctx.fillStyle = pattern;
                    ctx.fill();
                }
                lastX = mouseX;
                lastY =  mouseY;
            }
        }
    }
    
    function spray (){
        var choice = $('#innerimagetable').attr('brushpattern');
        lineThickness = 1;
        var fillpattern = new Image();
        fillpattern.src = choice;
        var pattern = ctx.createPattern(fillpattern, 'repeat');
        canvas.onmousedown = function(e) {
            painting = true;
            ctx.fillStyle = pattern;
           lastX = e.pageX - canvas.offsetLeft - 88;
            lastY = e.pageY - canvas.offsetTop - 55;
        };

        canvas.onmouseup = function(e){
            painting = false;
        }

        canvas.onmousemove = function(e) {
            var fillpattern = new Image();
                var choice = $('#innerimagetable').attr('brushpattern');
                fillpattern.src = choice;
                var pattern = ctx.createPattern(fillpattern, 'repeat');
                ctx.fillRect;
            if (painting) {
                mouseX = e.pageX - this.offsetLeft - 88;
                mouseY = e.pageY - this.offsetTop - 55;

                // find all points between        
                var x1 = mouseX,
                    x2 = lastX,
                    y1 = mouseY,
                    y2 = lastY;


                var steep = (Math.abs(y2 - y1) > Math.abs(x2 - x1));
                if (steep){
                    var x = x1;
                    x1 = y1;
                    y1 = x;

                    var y = y2;
                    y2 = x2;
                    x2 = y;
                }
                if (x1 > x2) {
                    var x = x1;
                    x1 = x2;
                    x2 = x;

                    var y = y1;
                    y1 = y2;
                    y2 = y;
                }

                var dx = x2 - x1,
                    dy = Math.abs(y2 - y1),
                    error = 0,
                    de = dy / dx,
                    yStep = -1,
                    y = y1;

                if (y1 < y2) {
                    yStep = 1;
                }

                lineThickness = 1;
            

                for (var x = x1; x < x2; x++) {
                    if (steep) {
                        ctx.fillRect(y - 7 , x +2, lineThickness , lineThickness);
                        ctx.fillRect(y -7, x - 2, lineThickness , lineThickness);
                        ctx.fillRect(y - 6, x + 5, lineThickness , lineThickness);
                        ctx.fillRect(y + 8, x + 4, lineThickness , lineThickness);
                        ctx.fillRect(y, x + 6, lineThickness , lineThickness);
                        ctx.fillRect(y + 6, x + 8, lineThickness , lineThickness );
                        ctx.fillRect(y + 12, x + 8, lineThickness , lineThickness );
                        ctx.fillRect(y + 3, x + 12, lineThickness , lineThickness );
                        ctx.fillRect(y + 10, x + 12, lineThickness , lineThickness );
                    } 
                    else {
                                                ctx.fillRect(x, y, lineThickness , lineThickness );

                    }
                    error += de;
                    if (error >= 0.5) {
                        y += yStep;
                        error -= 1.0;
                    }
                }
                lastX = mouseX;
                lastY = mouseY;
            }
        }
    }


    function paintbrush (){

      
        lineThickness = 1;

        canvas.onmousedown = function(e) {
            painting = true;
            ctx.fillStyle = "pattern";
            lastX = e.pageX - canvas.offsetLeft - 88;
            lastY = e.pageY - canvas.offsetTop - 55;
        };

        canvas.onmouseup = function(e){
            painting = false;
        } 

        canvas.onmousemove = function(e) {
            if (painting) {
                mouseX = e.pageX - canvas.offsetLeft - 88;
                mouseY = e.pageY - canvas.offsetTop - 55;

                // find all points between        
                var x1 = mouseX,
                    x2 = lastX,
                    y1 = mouseY,
                    y2 = lastY;


                var steep = (Math.abs(y2 - y1) > Math.abs(x2 - x1));
                if (steep){
                    var x = x1;
                    x1 = y1;
                    y1 = x;

                    var y = y2;
                    y2 = x2;
                    x2 = y;
                }
                if (x1 > x2) {
                    var x = x1;
                    x1 = x2;
                    x2 = x;

                    var y = y1;
                    y1 = y2;
                    y2 = y;
                }

                var dx = x2 - x1,
                    dy = Math.abs(y2 - y1),
                    error = 0,
                    de = dy / dx,
                    yStep = -1,
                    y = y1;

                if (y1 < y2) {
                    yStep = 1;
                }

                lineThickness = 1;
                var fillpattern = new Image();
                var choice = $('#innerimagetable').attr('brushpattern');
                fillpattern.src = choice;
                var pattern = ctx.createPattern(fillpattern, 'repeat');
                ctx.fillCircle = function(x, y, radius) {
                ctx.beginPath();
                
                ctx.arc(x+1, y+1, radius, 0, Math.PI * 2, false);
                };

                for (var x = x1; x < x2; x++) {
                    
                    var radius = 2; // or whatever
                    
                    ctx.fillStyle = pattern;
                    if (steep) {
                        ctx.fillCircle(y, x, radius);
                    } 
                    else {
                        ctx.fillCircle(x, y, radius);
                    }
                    error += de;
                    if (error >= 0.5) {
                        y += yStep;
                        error -= 1.0;
                    }
                    ctx.fill();
                }
                lastX = mouseX;
                lastY = mouseY;
            }
        }
    }
    function pencil () {
        lineThickness = 1;


        if (($('#4b').attr('src')) == ("images/4bi.png")) {
            for (i=0; i<5; i++) { 
                $('#checkbox'+i+'cell').mousedown(pencil);
            }
            for (i=0; i<5; i++) { 
                $('#line'+i+'cell').mousedown(pencil);
            }
        }

        canvas.onmousedown = function(e) {
            painting = true;
            ctx.fillStyle = "#000000";
            lastX = e.pageX - this.offsetLeft - 88;
            lastY = e.pageY - this.offsetTop - 55;
        };

        canvas.onmouseup = function(e){
            painting = false;
        }

        canvas.onmousemove = function(e) {
            if (painting) {
                mouseX = e.pageX - this.offsetLeft - 88;
                mouseY = e.pageY - this.offsetTop - 55;

                // find all points between        
                var x1 = mouseX,
                    x2 = lastX,
                    y1 = mouseY,
                    y2 = lastY;


                var steep = (Math.abs(y2 - y1) > Math.abs(x2 - x1));
                if (steep){
                    var x = x1;
                    x1 = y1;
                    y1 = x;

                    var y = y2;
                    y2 = x2;
                    x2 = y;
                }
                if (x1 > x2) {
                    var x = x1;
                    x1 = x2;
                    x2 = x;

                    var y = y1;
                    y1 = y2;
                    y2 = y;
                }

                var dx = x2 - x1,
                    dy = Math.abs(y2 - y1),
                    error = 0,
                    de = dy / dx,
                    yStep = -1,
                    y = y1;

                if (y1 < y2) {
                    yStep = 1;
                }

            
            

                for (var x = x1; x < x2; x++) {
                    if (steep) {
                        ctx.fillRect(y, x, lineThickness , lineThickness );
                    } 
                    else {
                        ctx.fillRect(x, y, lineThickness , lineThickness );
                    }
                    error += de;
                    if (error >= 0.5) {
                        y += yStep;
                        error -= 1.0;
                    }
                }
                lastX = mouseX;
                lastY = mouseY;
            }
        }
    }
    function drawjellybean (dofill){

        changeWidth2();


        if (($('#9a').attr('src')) == ("images/9ai.png")) {
            for (i=0; i<5; i++) { 
                $('#checkbox'+i+'cell').mousedown(drawjellybean);
            }
            for (i=0; i<5; i++) { 
                $('#line'+i+'cell').mousedown(drawjellybean);
            }
        }

        canvas.onmousedown = function(e) {
            painting = true;
            ctx.fillStyle = "#000000";
             lastX = e.pageX - canvas.offsetLeft - 88;
            lastY = e.pageY - canvas.offsetTop - 55;
        };

        canvas.onmouseup = function(e){
            painting = false;
        }

        canvas.onmousemove = function(e) {
            if (painting) {
                mouseX = e.pageX - this.offsetLeft - 88;
                mouseY = e.pageY - this.offsetTop - 55;

                // find all points between        
                var x1 = mouseX,
                    x2 = lastX,
                    y1 = mouseY,
                    y2 = lastY;


                var steep = (Math.abs(y2 - y1) > Math.abs(x2 - x1));
                if (steep){
                    var x = x1;
                    x1 = y1;
                    y1 = x;

                    var y = y2;
                    y2 = x2;
                    x2 = y;
                }
                if (x1 > x2) {
                    var x = x1;
                    x1 = x2;
                    x2 = x;

                    var y = y1;
                    y1 = y2;
                    y2 = y;
                }

                var dx = x2 - x1,
                    dy = Math.abs(y2 - y1),
                    error = 0,
                    de = dy / dx,
                    yStep = -1,
                    y = y1;

                if (y1 < y2) {
                    yStep = 1;
                }

            
            

                for (var x = x1; x < x2; x++) {
                    if (steep) {
                        ctx.fillRect(y, x, lineThickness , lineThickness );
                    } 
                    else {
                        ctx.fillRect(x, y, lineThickness , lineThickness );
                    }
                    error += de;
                    if (error >= 0.5) {
                        y += yStep;
                        error -= 1.0;
                    }
                }
                lastX = mouseX;
                lastY = mouseY;
            }
        }
    }

    function eraser () {
        lineThickness = 17;

        canvas.onmousedown = function(e) {
            painting = true;
            ctx.fillStyle = "#ffffff";
            lastX = e.pageX - this.offsetLeft - 90;
            lastY = e.pageY - this.offsetTop - 57;
        };

        canvas.onmouseup = function(e){
            painting = false;
        }

        canvas.onmousemove = function(e) {
            if (painting) {
                mouseX = e.pageX - this.offsetLeft - 90;
                mouseY = e.pageY - this.offsetTop - 57;

                // find all points between        
                var x1 = mouseX,
                    x2 = lastX,
                    y1 = mouseY,
                    y2 = lastY;


                var steep = (Math.abs(y2 - y1) > Math.abs(x2 - x1));
                if (steep){
                    var x = x1;
                    x1 = y1;
                    y1 = x;

                    var y = y2;
                    y2 = x2;
                    x2 = y;
                }
                if (x1 > x2) {
                    var x = x1;
                    x1 = x2;
                    x2 = x;

                    var y = y1;
                    y1 = y2;
                    y2 = y;
                }

                var dx = x2 - x1,
                    dy = Math.abs(y2 - y1),
                    error = 0,
                    de = dy / dx,
                    yStep = -1,
                    y = y1;

                if (y1 < y2) {
                    yStep = 1;
                }

                lineThickness = 17;
            

                for (var x = x1; x < x2; x++) {
                    if (steep) {
                        ctx.fillRect(y, x, lineThickness , lineThickness );
                    } else {
                        ctx.fillRect(x, y, lineThickness , lineThickness );
                    }

                    error += de;
                    if (error >= 0.5) {
                        y += yStep;
                        error -= 1.0;
                    }
                }
                lastX = mouseX;
                lastY =  mouseY;
            }
        }
    }
    function drawlines (){

        if (($('#5a').attr('src')) == ("images/5ai.png")) {
            for (i=0; i<5; i++) { 
                $('#checkbox'+i+'cell').mousedown(drawlines2);
            }
            for (i=0; i<5; i++) { 
                $('#line'+i+'cell').mousedown(drawlines2);
            }
        }
        drawlines2();
    }
    function drawlines2 (){
        context.lineWidth = 1;
        changeWidth2();
        function windowToCanvas(x, y) {
            var bbox = canvas.getBoundingClientRect();
            return { x: x - bbox.left * (canvas.width / bbox.width),
                y: y - bbox.top * (canvas.height / bbox.height) };
            }
        // Save and restore drawing surface...................................
        function saveDrawingSurface() {
            drawingSurfaceImageData = context.getImageData(0, 0,
            canvas.width,
            canvas.height);
        }
        function restoreDrawingSurface() {
            context.putImageData(drawingSurfaceImageData, 0, 0);
        }
        // Rubber bands.......................................................
        function updateRubberbandRectangle(loc) {
            
            context.strokeStyle = "rbg(0, 0, 0)";
            rubberbandRect.width = Math.abs(loc.x - mousedown.x);
            rubberbandRect.height = Math.abs(loc.y - mousedown.y);
            if (loc.x > mousedown.x) rubberbandRect.left = mousedown.x;
            else rubberbandRect.left = loc.x;
            if (loc.y > mousedown.y) rubberbandRect.top = mousedown.y;
            else rubberbandRect.top = loc.y;
            context.stroke()
        }
        function drawRubberbandShape(loc) {
            
            context.lineCap = "square";
            context.strokeStyle = "rbg(0, 0, 0)";
            context.beginPath();
            context.moveTo(mousedown.x, mousedown.y);
            context.lineTo(loc.x, loc.y);
            context.stroke();
        }
        function updateRubberband(loc) {
            updateRubberbandRectangle(loc);
            drawRubberbandShape(loc);
        }
    // Canvas event handlers..............................................
        canvas.onmousedown = function (e) {
            var loc = windowToCanvas(e.clientX, e.clientY);
            e.preventDefault(); // Prevent cursor change
            saveDrawingSurface();
            mousedown.x = loc.x;
            mousedown.y = loc.y;
            dragging = true;
        };
        canvas.onmousemove = function (e) {
            var loc;
            if (dragging) {
            e.preventDefault(); // Prevent selections
            loc = windowToCanvas(e.clientX, e.clientY);
            restoreDrawingSurface();
            updateRubberband(loc);
        }
        };
        canvas.onmouseup = function (e) {
            loc = windowToCanvas(e.clientX, e.clientY);
            restoreDrawingSurface();
            updateRubberband(loc);
            dragging = false;
        };
    }
    
    function drawrect (dofill){

        if ((($('#6b').attr('src')) == ("images/6bi.png")) || (($('#6a').attr('src')) == ("images/6ai.png")) ) {
            for (i=0; i<5; i++) { 
                $('#checkbox'+i+'cell').mousedown(function(){return drawrect2(dofill)});
            }
            for (i=0; i<5; i++) { 
                $('#line'+i+'cell').mousedown(function(){return drawrect2(dofill)});
            }
        }
        drawrect2(dofill);
    }

 function windowToCanvas(x, y) {
            var bbox = canvas.getBoundingClientRect();
            return { x: x - bbox.left * (canvas.width / bbox.width),
                     y: y - bbox.top * (canvas.height / bbox.height) };
        }
        // Save and restore drawing surface...................................
        function saveDrawingSurface() {
            drawingSurfaceImageData = context.getImageData(0, 0,canvas.width,canvas.height);
        }
        function restoreDrawingSurface() {
            context.putImageData(drawingSurfaceImageData, 0, 0);
        }
           function updateRubberbandRectangle(loc) {
            context.strokeStyle = "rbg(0, 0, 0)";
            rubberbandRect.width = Math.abs(loc.x - mousedown.x);
            rubberbandRect.height = Math.abs(loc.y - mousedown.y);
            if (loc.x > mousedown.x) rubberbandRect.left = mousedown.x;
            else rubberbandRect.left = loc.x;
            if (loc.y > mousedown.y) rubberbandRect.top = mousedown.y;
            else rubberbandRect.top = loc.y;
            context.stroke();
        }
    function drawrect2 (dofill){
        context.lineWidth = 1;
        changeWidth2();
    
        // Rubber bands.......................................................

        function drawRubberbandShape(loc) {
            var fillpattern = new Image();
            fillpattern.src = $('#innerimagetable').attr('brushpattern');
            var pattern = context.createPattern(fillpattern, 'repeat');
            context.lineJoin = "miter";
            context.lineCap = "square";
            context.fillStyle = pattern;
            context.strokeStyle = "rbg(0, 0, 0)";
            context.beginPath();
            context.moveTo(mousedown.x, mousedown.y);
            context.lineTo(loc.x, mousedown.y);
            context.lineTo(loc.x, loc.y);
            context.moveTo(mousedown.x, mousedown.y);
            context.lineTo(mousedown.x, loc.y);
            context.lineTo(loc.x, loc.y);
            if (dofill)context.fill();
            context.stroke();
        }
        function updateRubberband(loc) {
            updateRubberbandRectangle(loc);
            drawRubberbandShape(loc);
        }

    // Canvas event handlers..............................................
        canvas.onmousedown = function (e) {
            var loc = windowToCanvas(e.clientX, e.clientY);
            e.preventDefault(); // Prevent cursor change
            saveDrawingSurface();
            mousedown.x = loc.x;
            mousedown.y = loc.y;
            dragging = true;
        };
        canvas.onmousemove = function (e) {
            var loc;
            if (dragging) {
                e.preventDefault(); // Prevent selections
                loc = windowToCanvas(e.clientX, e.clientY);
                restoreDrawingSurface();
                updateRubberband(loc);
            }
        };
        canvas.onmouseup = function (e) {
            var loc = windowToCanvas(e.clientX, e.clientY);
            restoreDrawingSurface();
            updateRubberband(loc);
            dragging = false;
        };
    }



    function drawcircle (dofill){

        if ((($('#8b').attr('src')) == ("images/8bi.png")) || (($('#8a').attr('src')) == ("images/8ai.png"))) {
            for (i=0; i<5; i++) { 
                $('#checkbox'+i+'cell').mousedown(function(){return drawcircle2(dofill)});
            }
            for (i=0; i<5; i++) { 
                $('#line'+i+'cell').mousedown(function(){return drawcircle2(dofill)});
            }
        }

        drawcircle2(dofill);
    }

    function drawcircle2 (dofill){
        context.lineWidth = 1;
        changeWidth2();
// Functions.........................................................    
        function drawRubberbandShape(loc){
             var fillpattern = new Image();
            fillpattern.src = $('#innerimagetable').attr('brushpattern');
            var pattern = context.createPattern(fillpattern, 'repeat');
             if(canvas.getContext) {
                var ctx = canvas.getContext('2d');
                drawEllipse(ctx, mousedown.x, mousedown.y, loc.x - mousedown.x, loc.y - mousedown.y);
            }

            function drawEllipse(ctx, x, y, w, h) {
                var kappa = .5522848;
                  ox = (w / 2) * kappa, // control point offset horizontal
                  oy = (h / 2) * kappa, // control point offset vertical
                  xe = x + w,           // x-end
                  ye = y + h,           // y-end
                  xm = x + w / 2,       // x-middle
                  ym = y + h / 2;       // y-middle
                context.fillStyle = pattern;
                context.strokeStyle = "rbg(0, 0, 0)";
                ctx.beginPath();
                ctx.moveTo(x, ym);
                ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
                ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
                ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
                ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
                ctx.closePath();
                if (dofill)context.fill();
                ctx.stroke();
            }
        }
        function updateRubberband(loc){
            updateRubberbandRectangle(loc);
            drawRubberbandShape(loc);
        }
    // Guidewires.........................................................

    // Canvas event handlers..............................................
        canvas.onmousedown = function (e) {
            var loc = windowToCanvas(e.clientX, e.clientY);
            e.preventDefault(); // Prevent cursor change
            saveDrawingSurface();
            mousedown.x = loc.x;
            mousedown.y = loc.y;
            dragging = true;
        };
        canvas.onmousemove = function (e) {
            var loc;
            if (dragging) {
                e.preventDefault(); // Prevent selections
                loc = windowToCanvas(e.clientX, e.clientY);
                restoreDrawingSurface();
                updateRubberband(loc);
            }
        };
        canvas.onmouseup = function (e) {
            loc = windowToCanvas(e.clientX, e.clientY);
            restoreDrawingSurface();
            updateRubberband(loc);
            dragging = false;
        };
    }
    
    function drawroundedrect (dofill) {

        if ((($('#7a').attr('src')) == ("images/7ai.png")) || (($('#7b').attr('src')) == ("images/7bi.png")) ) {
            for (i=0; i<5; i++) { 
                $('#checkbox'+i+'cell').mousedown(function(){drawroundedrect2(dofill)});
            }
            for (i=0; i<5; i++) { 
                $('#line'+i+'cell').mousedown(function(){drawroundedrect2(dofill)});
            }
        }

        drawroundedrect2(dofill);
    }
    
    function drawroundedrect2 (dofill) {
        context.lineWidth = 1;
        changeWidth2();
// Functions..........................................................
        var fillpattern = new Image();
        fillpattern.src = $('#innerimagetable').attr('brushpattern');
        var pattern = context.createPattern(fillpattern, 'repeat');
        function drawRubberbandShape(loc) {
         context.lineJoin = "round";
            context.lineCap = "round";
            context.strokeStyle = 'black';
            context.beginPath();
            //top left btm right
            if ((loc.x > mousedown.x) && (loc.y > mousedown.y)) {
                context.moveTo(mousedown.x + 3, mousedown.y - 3);
                context.lineTo(loc.x - 3, mousedown.y - 3);
                context.moveTo(loc.x + 3, mousedown.y + 3);
                context.lineTo(loc.x + 3, loc.y - 3);
                context.moveTo(mousedown.x - 3 , mousedown.y + 3);
                context.lineTo(mousedown.x -3 , loc.y - 3);
                context.moveTo(mousedown.x + 3 , loc.y + 3);
                context.lineTo(loc.x -3 , loc.y + 3); 
                //top left
                context.moveTo(mousedown.x - 3, mousedown.y + 3);
                context.lineTo(mousedown.x - 2, mousedown.y + 2); 
                context.lineTo(mousedown.x - 2, mousedown.y + 1); 
                context.lineTo(mousedown.x - 1, mousedown.y); 
                context.lineTo(mousedown.x , mousedown.y - 1); 
                context.lineTo(mousedown.x + 1, mousedown.y - 2);
                context.lineTo(mousedown.x + 2, mousedown.y - 2); 
                context.lineTo(mousedown.x + 2, mousedown.y - 2); 
                context.lineTo(mousedown.x + 3, mousedown.y - 3);
                //top right 
                context.moveTo(loc.x - 3, mousedown.y - 3); 
                context.lineTo(loc.x - 2, mousedown.y - 2);
                context.lineTo(loc.x - 1, mousedown.y - 2); 
                context.lineTo(loc.x , mousedown.y - 1); 
                context.lineTo(loc.x + 1, mousedown.y); 
                context.lineTo(loc.x + 2, mousedown.y + 1);
                context.lineTo(loc.x + 2, mousedown.y + 2);
                context.lineTo(loc.x + 3, mousedown.y + 3);
                //bottom left    
                context.moveTo(mousedown.x - 3, loc.y - 3); 
                context.lineTo(mousedown.x - 2, loc.y - 2); 
                context.lineTo(mousedown.x - 2, loc.y - 1); 
                context.lineTo(mousedown.x - 1, loc.y);
                context.lineTo(mousedown.x, loc.y + 1);
                context.lineTo(mousedown.x + 1, loc.y + 2);  
                context.lineTo(mousedown.x + 2, loc.y + 2);  
                context.lineTo(mousedown.x + 3, loc.y + 3);
                //bottom right 
                context.moveTo(loc.x - 3, loc.y + 3);
                context.lineTo(loc.x - 2, loc.y + 2); 
                context.lineTo(loc.x - 1, loc.y + 2);
                context.lineTo(loc.x, loc.y + 1);
                context.lineTo(loc.x + 1, loc.y);
                context.lineTo(loc.x + 2, loc.y - 1);
                context.lineTo(loc.x + 2, loc.y - 2);
                context.lineTo(loc.x + 3, loc.y - 3);
            }
        //dragging top right to btm left
            else if (loc.x < mousedown.x && loc.y > mousedown.y) {
                context.fillStyle = "black";
                //lines 
                //top line
                context.moveTo(mousedown.x - 3, mousedown.y - 3);
                context.lineTo(loc.x + 3, mousedown.y - 3);
                //left vert
                context.moveTo(loc.x - 3, mousedown.y + 3);
                context.lineTo(loc.x - 3, loc.y - 3);
                //right vert
                context.moveTo(mousedown.x +3, mousedown.y + 3);
                context.lineTo(mousedown.x + 3, loc.y - 3);
                //bottom line
                context.moveTo(mousedown.x - 3 , loc.y + 3);
                context.lineTo(loc.x  + 3 , loc.y + 3); 
                //top right
                context.moveTo(mousedown.x - 3, mousedown.y - 3); 
                context.lineTo(mousedown.x - 2, mousedown.y - 2);
                context.lineTo(mousedown.x - 1, mousedown.y - 2); 
                context.lineTo(mousedown.x , mousedown.y - 1); 
                context.lineTo(mousedown.x + 1, mousedown.y); 
                context.lineTo(mousedown.x + 2, mousedown.y + 1);
                context.lineTo(mousedown.x + 2, mousedown.y + 2);
                context.lineTo(mousedown.x + 3, mousedown.y + 3);
                //top left
                context.moveTo(loc.x - 3, mousedown.y + 3);
                context.lineTo(loc.x - 2, mousedown.y + 2); 
                context.lineTo(loc.x - 2, mousedown.y + 1); 
                context.lineTo(loc.x - 1, mousedown.y); 
                context.lineTo(loc.x , mousedown.y - 1); 
                context.lineTo(loc.x + 1, mousedown.y - 2);
                context.lineTo(loc.x + 2, mousedown.y - 2); 
                context.lineTo(loc.x + 2, mousedown.y - 2); 
                context.lineTo(loc.x + 3, mousedown.y - 3);
                //bottom right
                context.moveTo(mousedown.x - 3, loc.y + 3);
                context.lineTo(mousedown.x - 2, loc.y + 2); 
                context.lineTo(mousedown.x - 1, loc.y + 2);
                context.lineTo(mousedown.x, loc.y + 1);
                context.lineTo(mousedown.x + 1, loc.y);
                context.lineTo(mousedown.x + 2, loc.y - 1);
                context.lineTo(mousedown.x + 2, loc.y - 2);
                context.lineTo(mousedown.x + 3, loc.y - 3);
                //bottom left
                context.moveTo(loc.x - 3, loc.y - 3); 
                context.lineTo(loc.x - 2, loc.y - 2); 
                context.lineTo(loc.x - 2, loc.y - 1); 
                context.lineTo(loc.x - 1, loc.y);
                context.lineTo(loc.x, loc.y + 1);
                context.lineTo(loc.x + 1, loc.y + 2);  
                context.lineTo(loc.x + 2, loc.y + 2);  
                context.lineTo(loc.x + 3, loc.y + 3);
                context.fill();
            }
            //dragging btm left to top right
            else if (loc.x > mousedown.x && loc.y < mousedown.y) {
                //lines 
                //bottom
                context.moveTo(mousedown.x + 3, mousedown.y + 3 );
                context.lineTo(loc.x - 3, mousedown.y + 3);
                //right vert
                context.moveTo(loc.x + 3, mousedown.y - 3);
                context.lineTo(loc.x + 3, loc.y + 3);
                //left
                context.moveTo(mousedown.x - 3 , mousedown.y - 3);
                context.lineTo(mousedown.x - 3 , loc.y + 3);
                //top
                context.moveTo(mousedown.x + 3 , loc.y - 3);
                context.lineTo(loc.x -3 , loc.y - 3); 
                // 
                //bottom left
                context.moveTo(mousedown.x - 3, mousedown.y - 3);
                context.lineTo(mousedown.x - 2, mousedown.y - 2); 
                context.lineTo(mousedown.x - 2, mousedown.y - 1); 
                context.lineTo(mousedown.x - 1, mousedown.y); 
                context.lineTo(mousedown.x , mousedown.y + 1); 
                context.lineTo(mousedown.x + 1, mousedown.y + 2);
                context.lineTo(mousedown.x + 2, mousedown.y + 2); 
                context.lineTo(mousedown.x + 2, mousedown.y + 2); 
                context.lineTo(mousedown.x + 3, mousedown.y + 3); 


                //bottom right
                context.moveTo(loc.x - 3, mousedown.y + 3); 
                context.lineTo(loc.x - 2, mousedown.y + 2);
                context.lineTo(loc.x - 1, mousedown.y + 2); 
                context.lineTo(loc.x , mousedown.y + 1); 
                context.lineTo(loc.x + 1, mousedown.y); 
                context.lineTo(loc.x + 2, mousedown.y - 1);
                context.lineTo(loc.x + 2, mousedown.y - 2);
                context.lineTo(loc.x + 3, mousedown.y - 3);
               //top left
                context.moveTo(mousedown.x - 3, loc.y + 3); 
                context.lineTo(mousedown.x - 2, loc.y + 2); 
                context.lineTo(mousedown.x - 2, loc.y + 1); 
                context.lineTo(mousedown.x - 1, loc.y);
                context.lineTo(mousedown.x, loc.y - 1);
                context.lineTo(mousedown.x + 1, loc.y - 2);  
                context.lineTo(mousedown.x + 2, loc.y - 2);  
                context.lineTo(mousedown.x + 3, loc.y - 3); 
               //top right
                context.moveTo(loc.x - 3, loc.y - 3);
                context.lineTo(loc.x - 2, loc.y - 2); 
                context.lineTo(loc.x - 1, loc.y - 2);
                context.lineTo(loc.x, loc.y - 1);
                context.lineTo(loc.x + 1, loc.y);
                context.lineTo(loc.x + 2, loc.y + 1);
                context.lineTo(loc.x + 2, loc.y + 2);
                context.lineTo(loc.x + 3, loc.y + 3);
                context.fill();
            }
            //for draggig btm right to top left
            else if ((loc.x < mousedown.x) && (loc.y < mousedown.y)) {
                //lines
                //bottom
                context.moveTo(mousedown.x - 3, mousedown.y + 3);
                context.lineTo(loc.x + 3, mousedown.y + 3);
                //left
                context.moveTo(loc.x - 3, mousedown.y - 3);
                context.lineTo(loc.x - 3, loc.y + 3);
                //right
                context.moveTo(mousedown.x + 3 , mousedown.y - 3);
                context.lineTo(mousedown.x + 3 , loc.y + 3);
                //top
                context.moveTo(mousedown.x - 3, loc.y - 3);
                context.lineTo(loc.x + 3, loc.y - 3 ); 
                //corners
                //bottom right
                context.moveTo(mousedown.x + 3, mousedown.y - 3);
                context.lineTo(mousedown.x + 2, mousedown.y - 2); 
                context.lineTo(mousedown.x + 2, mousedown.y - 1); 
                context.lineTo(mousedown.x + 1, mousedown.y); 
                context.lineTo(mousedown.x , mousedown.y + 1); 
                context.lineTo(mousedown.x - 1, mousedown.y + 2);
                context.lineTo(mousedown.x - 2, mousedown.y + 2); 
                context.lineTo(mousedown.x - 2, mousedown.y + 2); 
                context.lineTo(mousedown.x - 3, mousedown.y + 3);
               //bottom left
                context.moveTo(loc.x + 3, mousedown.y + 3); 
                context.lineTo(loc.x + 2, mousedown.y + 2);
                context.lineTo(loc.x + 1, mousedown.y + 2); 
                context.lineTo(loc.x , mousedown.y + 1); 
                context.lineTo(loc.x - 1, mousedown.y); 
                context.lineTo(loc.x - 2, mousedown.y - 1);
                context.lineTo(loc.x - 2, mousedown.y - 2);
                context.lineTo(loc.x - 3, mousedown.y - 3); 
              
                //top right
                context.moveTo(mousedown.x + 3, loc.y + 3); 
                context.lineTo(mousedown.x + 2, loc.y + 2); 
                context.lineTo(mousedown.x + 2, loc.y + 1); 
                context.lineTo(mousedown.x + 1, loc.y);
                context.lineTo(mousedown.x, loc.y - 1);
                context.lineTo(mousedown.x - 1, loc.y - 2);  
                context.lineTo(mousedown.x - 2, loc.y - 2);  
                context.lineTo(mousedown.x - 3, loc.y - 3);   
              
                //top left
                context.moveTo(loc.x + 3, loc.y - 3);
                context.lineTo(loc.x + 2, loc.y - 2); 
                context.lineTo(loc.x + 1, loc.y - 2);
                context.lineTo(loc.x, loc.y - 1);
                context.lineTo(loc.x - 1, loc.y);
                context.lineTo(loc.x - 2, loc.y + 1);
                context.lineTo(loc.x - 2, loc.y + 2);
                context.lineTo(loc.x - 3, loc.y + 3);
            }
            else {
                context.moveTo(mousedown.x , mousedown.y);
                context.lineTo(mousedown.x , loc.y);
                context.lineTo(loc.x , loc.y);
                context.fill();
            }
            context.fill();
        }
        function updateRubberband(loc) {
            updateRubberbandRectangle(loc);
            drawRubberbandShape(loc);
        }
        canvas.onmousedown = function (e) {
            var loc = windowToCanvas(e.clientX, e.clientY);
            e.preventDefault(); // Prevent cursor change
            saveDrawingSurface();
            mousedown.x = loc.x;
            mousedown.y = loc.y;
            dragging = true;
        };
        canvas.onmousemove = function (e) {
            var loc;
            if (dragging) {
                e.preventDefault(); // Prevent selections
                loc = windowToCanvas(e.clientX, e.clientY);
                restoreDrawingSurface();
                updateRubberband(loc);
            }
        };
        canvas.onmouseup = function (e) {
            loc = windowToCanvas(e.clientX, e.clientY);
            restoreDrawingSurface();
            updateRubberband(loc);
            dragging = false;
        };
    }
    
    function polygon (){
      if (($('#10a').attr('src')) == ("images/10ai.png")) {
            for (i=0; i<5; i++) { 
                $('#checkbox'+i+'cell').mousedown(polygon2);
            }
            for (i=0; i<5; i++) { 
                $('#line'+i+'cell').mousedown(polygon2);
            }
        }
        polygon2();
    }

    function polygon2 (){
        changeWidth2();
        function drawRubberbandShape(loc) {
            context.lineJoin = "miter";
            context.lineCap = "square";
            context.strokeStyle = "rbg(0, 0, 0)";
            context.beginPath();
            context.moveTo(mousedown.x, mousedown.y);
            context.lineTo(loc.x, loc.y);
            context.stroke();
        }
        function updateRubberband(loc) {
            updateRubberbandRectangle(loc);
            drawRubberbandShape(loc);
        }
    // Canvas event handlers..............................................
            canvas.onmousedown = function (e) {
                var loc = windowToCanvas(e.clientX, e.clientY);
                e.preventDefault(); // Prevent cursor change
                saveDrawingSurface();
                mousedown.x = loc.x;
                mousedown.y = loc.y;
                dragging = true;
            };
            canvas.onmousemove = function (e) {
                var loc;
                if (dragging) {
                e.preventDefault(); // Prevent selections
                loc = windowToCanvas(e.clientX, e.clientY);
                restoreDrawingSurface();
                updateRubberband(loc);
                }
            };
            canvas.onmouseup = function (e) {
                loc = windowToCanvas(e.clientX, e.clientY);
                restoreDrawingSurface();
                updateRubberband(loc);
                dragging = true;
            };
            canvas.ondblclick = function (e) {
                loc = windowToCanvas(e.clientX, e.clientY);
                restoreDrawingSurface();
                updateRubberband(loc);
                dragging = false;
                
            };
    }

function fillpolygon (){
      if (($('#10a').attr('src')) == ("images/10ai.png")) {
            for (i=0; i<5; i++) { 
                $('#checkbox'+i+'cell').mousedown(fillpolygon2);
            }
            for (i=0; i<5; i++) { 
                $('#line'+i+'cell').mousedown(fillpolygon2);
            }
        }
        fillpolygon2();
    }

    function fillpolygon2 (){
        changeWidth2();
        function drawRubberbandShape(loc) {
            context.lineJoin = "miter";
            context.lineCap = "square";
            context.strokeStyle = "rbg(0, 0, 0)";
            context.beginPath();
            context.moveTo(mousedown.x, mousedown.y);
            var positionarray = [];
            positionarray.push(mousedown.x, mousedown.y);   
            context.lineTo(loc.x, loc.y);
            console.log(positionarray);
            canvas.ondblclick = function (e) {
                loc = windowToCanvas(e.clientX, e.clientY);
                restoreDrawingSurface();
                updateRubberband(loc);
                dragging = false;
                context.lineJoin = "miter";
                context.lineCap = "square";
                context.strokeStyle = "rbg(0, 0, 0)";
                context.beginPath();
                context.moveTo(loc.x, loc.y);
                context.lineTo (positionarray[0]);
                context.stroke();
            };
            context.stroke();
            context.fill();
        }
        function updateRubberband(loc) {
            updateRubberbandRectangle(loc);
            drawRubberbandShape(loc);
        }
    // Canvas event handlers..............................................
            canvas.onmousedown = function (e) {
                var loc = windowToCanvas(e.clientX, e.clientY);
                e.preventDefault(); // Prevent cursor change
                saveDrawingSurface();
                mousedown.x = loc.x;
                mousedown.y = loc.y;
                dragging = true;
        
            };
            canvas.onmousemove = function (e) {
                var loc;
                if (dragging) {
                e.preventDefault(); // Prevent selections
                loc = windowToCanvas(e.clientX, e.clientY);
                restoreDrawingSurface();
                updateRubberband(loc);
            }
            };
            canvas.onmouseup = function (e) {
                loc = windowToCanvas(e.clientX, e.clientY);
                restoreDrawingSurface();
                updateRubberband(loc);
                dragging = true;
            };
    }



































    //puzzle code belwo

  /*for (i=1;i<17;i++) {
   if (($("#space" +i).src) == "images/16.png") {

   }

  } */

  $("#puzzle").mouseup(puzzleo) 
  function puzzleo () {
    $("#gamepic").show();
    $("#gametable").show();
  

  

    $("#space12").one('mousedown', (function () {
      $("#slot16").attr('src', "images/12.png");
      $("#slot12").attr('src', "images/16.png");
    }));

    if ($("#slot1").attr('src') == "images/16.png") {
      $("#space2").one('mousedown',(function() {
        $('#slot1').attr('src', $('#slot2').attr('src'));
        $('#slot2').attr('src', "images/16.png");
        setTimeout(function(){
          if ($("#slot1").attr('src') != "images/16.png") {
            $("#space5").one('mousedown',(function() {
              $('#slot1').attr('src', $('#slot1').attr('src'));
              $('#slot5').attr('src', $('#slot5').attr('src'));
              puzzleo;
            }))
          }
        },100);
        puzzleo;
      }))
    }
    if ($("#slot1").attr('src') == "images/16.png") {
      $("#space5").one('mousedown',(function() {
        $('#slot1').attr('src', $('#slot5').attr('src'));
        $('#slot5').attr('src', "images/16.png");
        puzzleo;
      }))
    }
  };

$('#alarmdiv, #alarmdrop').hide();



  //preset checkmarks when page loads
  $('#plain, #fscheck12, #fontcheck2, #stylecheck6, #stylecheck0').show();
  //inverses checkmark images in font/fontsize/style dropdowns
  for(i=0;i<7;i++){
    $('#font'+ i).hover(
      function(){$(this).find("img").attr('src',"images/checkfsi.png")},
      function(){$(this).find("img").attr('src',"images/checkfs.png");
    });
  }

 for(i=0;i<9;i++){
    $('#fontsize'+ i).hover(
      function(){$(this).find("img").attr('src',"images/checkfsi.png")},
      function(){$(this).find("img").attr('src',"images/checkfs.png");
    });
  }
    $('#style > ul > li').hover(
        function(){$(this).find("img:not(.symbol)").attr('src',"images/checkfsi.png")},
        function(){$(this).find("img:not(.symbol)").attr('src',"images/checkfs.png");
    });
  //display pop-up when paintbrush is dblclicked
    $('#brush').dblclick(function(){
        $('#overlay').show();
        brushPopup();
    });
    $('#brushShape').mouseup(function(){
        $('#overlay').css("display","block");
        setTimeout(brushPopup2, 500);
    });

  
  function brushPopup2(){
        $('#brushespopup').show().removeClass();
        $('.rowlines, #closecanvastable').hide();
        $('#brushespopup').css('z-index','10010');
        setTimeout(restoffunction, 1);
        function restoffunction() {
            $('#brushestable').mousedown(function(){
                $('#overlay').hide();
                $(document).one('mouseup', function(){
                $('#brushespopup').hide().addClass('hidden');
                    if($('#brushespopup').hasClass('hidden')){
                      $('.rowlines, #closecanvastable').show();
                    }
                $('#overlay').hide();
                $('#brushespopup').css('z-index','5000');
                });
            });
        }
    }
    function brushPopup(){
        $('#brushespopup').show().removeClass();
        $('.rowlines, #closecanvastable').hide();
        $('#brushespopup').css('z-index','10010');
        $('#brushestable').mousedown(function(){
                $('#overlay').hide();
                $(document).one('mouseup', function(){
                $('#brushespopup').hide().addClass('hidden');
                    if($('#brushespopup').hasClass('hidden')){
                      $('.rowlines, #closecanvastable').show();
                    }
                $('#overlay').hide();
                $('#brushespopup').css('z-index','5000');
                });
            });
    }
    
  var currentButton = "#4a";
  var clicked = ["#4a"];
    $('.tools').find('img').mousedown(function(){
        setCurrent();
        switchImg(currentButton);
        clicked.push('#' + $(this).attr('id'));
        console.log(clicked);
        for(i=0;i<11;i++){
          var id = $(this).attr('id');
          $('#'+i+'a').attr('src','images/'+i+'a.png');
          $('#'+i+'b').attr('src','images/'+i+'b.png');
          $(this).attr('src','images/'+id+'i.png');
        }
        $('.tools').find('img').mousedown(function(){
          if ($(this).attr('id') == '5b' && $('#5b').attr('src') == 'images/5b.png'){
            $('#5b').attr('src', 'images/5bi.png');
          }
          if (clicked.length - 1 == '#5b'){
            $('#5b').mousedown(function(){
              $('5b').attr('src','images/5bi.png');
            });
          }
        }); 
        $(document).mouseup( function () {
                if ($("#2a").attr('src') == "images/2a.png") {
                    $('#myCanvas').draggable();
                    $('#myCanvas').draggable('disable');
                }  
            });
    });
    //clears canvas when eraser is dbl clicked
    $('#eraser').dblclick(function(){
      eraserClearCanvas();
      function eraserClearCanvas(){
        var sourceX = 3.09 * parseInt($('#viewBox').css('left'));
        var sourceY = 2.98 * parseInt($('#viewBox').css('top'));
        console.log(sourceX);
        console.log(sourceY);
        console.log($('#canvasbox').width())
        var canvas = $("#myCanvas");
        var context = canvas.get(0).getContext("2d");
        context.clearRect(sourceX, sourceY, $('#canvasbox').width(), $('#canvasbox').height());
        if ($('#5b').attr('src') == 'images/5bi.png'){
          $('#5b').attr('src','images/5b.png');
        }
        var lastActive = clicked[clicked.length-3];
        $(lastActive).attr('src', $(lastActive).attr('dos')).trigger('mousedown');
        console.log(lastActive);
        clicked = [lastActive];
      }
    });

    //var currentButton = "#4a";

  function setCurrent(){// set currentButton to the new id and hilite it. If there is already a current button, unhilite it.
    if(this!=currentButton) { // if they are already the same, then don't bother
      if(currentButton) {switchImg(currentButton);} // if current button is already set, then unset it
      currentButton=this;
      switchImg(currentButton);
    }
  }

  function switchImg(element) { // switch the object attribute values for 'src' and 'dos'
    $(element).attr({
      'src': $(element).attr('dos') 
      , 'dos': $(element).attr('src') 
    });
  };

  //switchImg(currentButton); //set the first button to be ready to go

  //for(i=1; i<=10;i++){//set up all of the buttons
   // $("#"+i+"a").bind("mousedown",setCurrent);
  //  $("#"+i+"b").bind("mousedown",setCurrent);
  //};


  //prevent highlighting when dragging mouse in IE
  $('body').addClass('notTyping');
  if ($('body').hasClass('notTyping')){
    $(document).mousedown(function(event){
      event.preventDefault();
    });
  }

  //fontsize menu checkmarks
  function fscheckadd(fsize) {
    $('#fscheck9,#fscheck10, #fscheck12, #fscheck14, #fscheck18, #fscheck24, #fscheck36, #fscheck48, #fscheck72').css("display","none");
    $('#fscheck'+fsize).css("display","block");
  }

  var myfontsize = [9,10,12,14,18,24,36,48,72];
  for(i=0;i<9;i++){
    myfun = function(fsval){return function(){fscheckadd(fsval);}}(myfontsize[i]);
    $('#fontsize'+i).mouseup(myfun);
  }
//font menu checkmarks
function fontcheckadd(font) {
    $('#fontcheck0,#fontcheck1, #fontcheck2, #fontcheck3, #fontcheck4, #fontcheck5, #fontcheck6').css("display","none").removeClass('checkedfont');
    $('#fontcheck'+font).css("display","block").addClass('checkedfont');
  }

  var myfont = [0,1,2,3,4,5,6];
  for(i=0;i<7;i++){
    myfunfont = function(fsvalfont){return function(){fontcheckadd(fsvalfont);}}(myfont[i]);
    $('#font'+i).mouseup(myfunfont);
  }

  //checkmarks for style dropdown
  var checkMarks = $('#style > ul > li:not(#style7, #style8, #alignleft)');
   $('#stylecheck0').addClass('checked');
  checkMarks.mouseup(function(){
    if($(this).find('img:not(.symbol)').attr('id') == 'stylecheck0'){
      $('#style > ul > li:not(#stylecheck0, #style7, #style8, #alignleft)').find('img:not(.symbol)').hide();
      $(this).find('img:not(.symbol)').show().addClass('checked');
      checkMarks.find('img:not(#stylecheck0, .symbol)').removeClass('checked');
    }
    else if(!$(this).find('img').hasClass('checked')){
      $(this).find('img:not(.symbol, .checked)').css('display','block').addClass('checked');
      $('#stylecheck0').hide().removeClass('checked');
    }
    else if(checkMarks.find('img:not(#stylecheck0, #stylecheck6, #stylecheck7, #stylecheck8)').hasClass('checked')){
      $(this).find('img:not(.symbol)').css('display','none').removeClass('checked');
      $('#stylecheck0').hide().removeClass('checked');
    }
    else {
      $(this).find('img:not(.symbol, .checked)').css('display','block').addClass('checked');
      $('#stylecheck0').hide().removeClass('checked');
    }
  });
  $('#style7, #style8, #alignleft').mouseup(function(){
    $('#style7,#style, #alignleft').find('img:not(.symbol)').hide();
    $(this).find('img:not(.symbol)').show();
      for(i=0;i<9;i++){
        if($('#stylecheck' + i).hasClass('checked')){
          $('#stylecheck' + i).css('display','block');
        }
      }
  });

  //goodies checkmarks
  $('.goodiesCheck').hide();
  $('#fatbits, #grid').mouseup(function(){
    $('.goodiesCheck').hide();
    $(this).find('img').show();
  }).hover(function(){//changes source to inverse check on hover
    $(this).find('img').attr('src', 'images/checkfsi.png')},
    function(){$(this).find('img').attr('src', 'images/checkfs.png');
    });

  /*function style0check () {
    $('#stylecheck0,#stylecheck1, #stylecheck2, #stylecheck3, #stylecheck4, #stylecheck5').css("display","none");
      $('#stylecheck0').css("display","block");
  }
  $('#style0').mouseup(style0check);

  function style1check () {
    $('#stylecheck0').css("display","none");
      $('#stylecheck1').css("display","block");
  }
  $('#style1').mouseup(style1check);

  function style2check () {
    $('#stylecheck0').css("display","none");
      $('#stylecheck2').css("display","block");
  }
  $('#style2').mouseup(style2check);

  function style3check () {
    $('#stylecheck0').css("display","none");
      $('#stylecheck3').css("display","block");
  }
  $('#style3').mouseup(style3check);

  function outlinecheck () {
    $('#stylecheck0').css("display","none");
      $('#stylecheck4').css("display","block");
  }
  $('#outline').mouseup(outlinecheck);

  function shadowcheck () {
    $('#stylecheck0').css("display","none");
      $('#stylecheck5').css("display","block");
  }
  $('#shadow').mouseup(shadowcheck);
    

   function alignleftcheck () {
    $('#stylecheck7, #stylecheck8').css("display","none");
      $('#stylecheck6').css("display","block");
  }
  $('#alignleft').mouseup(alignleftcheck); 

  function style7check () {
    $('#stylecheck6, #stylecheck8').css("display","none");
      $('#stylecheck7').css("display","block");
  }
  $('#style7').mouseup(style7check);

  function style8check () {
    $('#stylecheck6, #stylecheck7').css("display","none");
      $('#stylecheck8').css("display","block");
  }
  $('#style8').mouseup(style8check);
*/
  //dropdown menu section
  $('ul.nav-sub').hide();

  $('.list, #applebutton').mousedown(dropdown);
  $('#file').mousedown(dropdownfile);
  $('#edit').mousedown(dropdownedit);
  $('#goodies').mousedown(dropdowngoodies);
  $('#font').mousedown(dropdownfont);
  $('#fontsize').mousedown(dropdownfontsize);
  $('#style').mousedown(dropdownstyle);
  $('#applebutton').mousedown(dropdownapple);

  function dropdownfile () {
    $('#filedrop').show();
  }
  function dropdownedit () {
    $('#editdrop').show();
  }
   function dropdowngoodies () {
    $('#goodiesdrop').show();
    
  }
  function dropdownfont () {
    $('#fontdrop').show();
    
  }
   function dropdownfontsize () {
    $('#fontsizedrop').show();

  }
   function dropdownstyle () {
    $('#styledrop').show();
  }
  function dropdownapple () {
    $('#appledrop').show();
  }

  function dropdown () {
    $('#file').hover(drophoverfile);
    $('#edit').hover(drophoveredit);
    $('#goodies').hover(drophovergoodies);
    $('#font').hover(drophoverfont);
    $('#fontsize').hover(drophoverfontsize);
    $('#style').hover(drophoverstyle);
    $('#applebutton').hover(drophoverapple);
  }

  function drophoverfile () {
    $('ul.nav-sub').hide();
    $('#filedrop').show();
    }

  function drophoveredit () {
    $('ul.nav-sub').hide();
    $('#editdrop').show();
  }

  function drophovergoodies () {
    $('ul.nav-sub').hide();
    $('#goodiesdrop').show();
  }

  function drophoverfont () {
    $('ul.nav-sub').hide();
    $('#fontdrop').show();
  }

  function drophoverfontsize () {
    $('ul.nav-sub').hide();
    $('#fontsizedrop').show();
  }

  function drophoverstyle () {
    $('ul.nav-sub').hide();
    $('#styledrop').show();
  }

  function drophoverapple () {
    $('ul.nav-sub').hide();
    $('#appledrop').show();
  }

  function drophover2 () {
    $('ul.nav-sub').hide()
  }

//dropdown hovering for chrome
    $('.nav-sub li').hover(function(){
      $(this).not('.inactive, .dottedline').css({'background':'black','color':'white'});
      }, function(){
      $(this).not('.inactive, .dottedline').css({'background':'white','color':'black'});
    });
//sets outlined text to white on mouseout
    $('.outline').hover(function(){
      $(this).css({'background':'black','color':'blue'}).removeClass('outline').removeClass('9').removeClass('10').addClass("textoutline");
      console.log($(this).attr("class"));
      }, function(){
      $(this).css({'background':'white','color':'white'}).removeClass("textoutline");
    });

  function listhover(){
    var currentId = '#' + $(this).attr('id');
    $(currentId + 'blackmenuside').css('display','block');
  }

  function navmainitemsmousedownhover(){
    $('.list').hover(navmainitemshover).hover(listhover);
    $('#applebutton').hover(applehover);
  }
  function navmainitemshover(){

    $('.list').css({"background":"no-repeat right center","color":"black"});
    $(this).css({"background":"black","color":"white"});
    $('#applebutton').attr('src', "applebuttonh.png");
    $('.blackmenuside').hide();
  }
  
  function applehover(){
    $('#applebutton').attr('src', "applebuttoni.png");
    $('.list').css({"background":"no-repeat right center","color":"black"});
    $('.blackmenuside').hide();
  }

  function inverse(){ 
    $('#applebutton').attr('src', "images/applebuttoni.png")
    $('.list').hover(navmainitemshover).hover(listhover);
    $('#applebutton').hover(applehover);
  };

  $('#applebutton').bind("mousedown", inverse);


  $(document).mouseup(function(){
    $('.blackmenuside').hide();
  });
  
  var navitems = new Array();
  navitems[0] = "#file";
  navitems[1] = "#edit";
  navitems[2] = "#goodies";
  navitems[3] = "#font";
  navitems[4] = "#fontsize";
  navitems[5] = "#style";

  for (i=0;i<navitems.length;i++){
    $(navitems[i]).mousedown(function() {
      $(this).css({"background":"black","color":"white"});
      navmainitemsmousedownhover ();
    });
  }

//displays blackmenuside image for each main list item
  $('.list').mousedown(function(){
      var currentId = '#' + $(this).attr('id');
      $(currentId + 'blackmenuside').show();
  });
  
  $('ul.nav-sub').mouseup(function() {

    $(this).hide();
    $(this).show();
  });
  
  $(document).not('#editPattern').mouseup(function() {
    $('.list').css({"background":"no-repeat right center","color":"black"})
              .hover(hover2)
              .hover(drophover2);
    $('#applebutton').attr('src', "images/applebuttonh.png")
                     .hover(applehover2)
                     .hover(drophover2);
    $('#file').mousedown(dropdownfile);
  });

$('#editPattern').mouseup(function(){
    $('#goodies').hover(function(){
        $(this).css({'background':'black','color':'white'});
    });
    $('#goodies').trigger('hover');
    $('#okEdits').mouseup(function(){
        $('.nav-main').unbind('hover');
    });
});

 

  function hover2 () {
    $(this).css({"background":"no-repeat right center","color":"black"});
    $('.blackmenuside').hide();
  }
  function applehover2 () {
    $('#applebutton').attr('src', "images/applebuttonh.png")
  }

  /*function flashing1 () {
    var myVar;
    function unset (){clearInterval(myVar);}
    $('#fontdrop').mouseout(unset);
    $(document).mousedown(unset);
    $('#myCanvas').hover(unset);
    function cleardropinterval () {
      clearInterval(myVar);
    }
    $('#edit').hover(cleardropinterval);
  
    var myVarmonaco0;
    var myVarmonaco1;
    var myVarmonaco2;
    var myVarmonaco3;
    var myVarmonaco4;
    var myVarmonaco5;
    var myVarmonaco6;
    var myVarmonaco7;
    var myVarmonaco8;
    var myVarmonaco9;
    
    var myVarmonacoclear0;

    function flashmonaco () {
      $('#fontdrop').show();
      myVar=setInterval(function(){$('#fontdrop').hide()}, 500);
      myVarmonaco0=setInterval(function(){$('#font4').css({"background":"white","color":"black"})}, 50);
      myVarmonaco1=setInterval(function(){$('#font4').css({"background":"black","color":"white"})}, 100);
      myVarmonaco2=setInterval(function(){$('#font4').css({"background":"white","color":"black"})}, 150);
      myVarmonaco3=setInterval(function(){$('#font4').css({"background":"black","color":"white"})}, 200);
      myVarmonaco4=setInterval(function(){$('#font4').css({"background":"white","color":"black"})}, 250);
      myVarmonaco5=setInterval(function(){$('#font4').css({"background":"black","color":"white"})}, 300);
      myVarmonaco6=setInterval(function(){$('#font4').css({"background":"white","color":"black"})}, 350);
      myVarmonaco7=setInterval(function(){$('#font4').css({"background":"black","color":"white"})}, 400);
      myVarmonaco8=setInterval(function(){$('#font4').css({"background":"white","color":"black"})}, 450);
      myVarmonaco9=setInterval(function(){$('#font4').css({"background":"black","color":"white"})}, 500);
      myVarmonacoclear0=setInterval(function(){clearInterval(myVarmonaco0, myVarmonaco1, myVarmonaco2, myVarmonaco3, myVarmonaco4, myVarmonaco5, myVarmonaco6, myVarmonaco7, myVarmonaco8, myVarmonaco9);},600);

      function cleartotalmonaco () {
        clearInterval(myVarmonacoclear0);
        clearInterval(myVarmonaco0);
        clearInterval(myVarmonaco1);
        clearInterval(myVarmonaco2);
        clearInterval(myVarmonaco3);
        clearInterval(myVarmonaco4);
        clearInterval(myVarmonaco5);
        clearInterval(myVarmonaco6);
        clearInterval(myVarmonaco7);
        clearInterval(myVarmonaco8);
        clearInterval(myVarmonaco9);
      }
      $('#edit').hover(cleartotalmonaco);
    }
    $('#font4').mouseup(flashmonaco);
  }
  $('#font').mousedown(flashing1);
  */
  //for changing fill pattern
  function changeImage2() { 
    $('#innerimagetable').css("background-image", "url('images/pattern2.jpg')").css("background-position", "2px 2px");
    $('#innerimagetable').attr('brushpattern', "images/pattern2.jpg");
  }
 function changeImage3() { 
    $('#innerimagetable').css("background-image", "url('images/pattern3.jpg')").css("background-position", "0px 3px");
    $('#innerimagetable').attr('brushpattern', "images/pattern3.jpg");
  }
  function changeImage7() { 
    $('#innerimagetable').css("background-image", "url('images/pattern7.jpg')").css("background-position", "2px 2px");
    $('#innerimagetable').attr('brushpattern', "images/pattern7.jpg");
  }
  function changeImage9() { 
    $('#innerimagetable').css("background-image", "url('images/pattern9.jpg')").css("background-position", "2px 2px");
    $('#innerimagetable').attr('brushpattern', "images/pattern9.jpg");
  }
  function changeImage10() { 
    $('#innerimagetable').css("background-image", "url('images/pattern10.jpg')").css("background-position", "6px 2px");
    $('#innerimagetable').attr('brushpattern', "images/pattern10.jpg");
  }
  function changeImage11() { 
    $('#innerimagetable').css("background-image", "url('images/pattern11.jpg')").css("background-position", "6px 2px");
    $('#innerimagetable').attr('brushpattern', "images/pattern11.jpg");
  }

 

  function changeImage(){
    id = $(this).attr('id');
    $('#innerimagetable').css("background-position", "2px 3px").css("background-image", "url('images/" +id+ ".jpg')");
    $('#innerimagetable').attr('brushpattern', "images/"+id+".jpg");
  };

  for (i=1; i<=1; i++) {
    $('#pattern' + i).mousedown(changeImage);
  }  

  for (i=3; i<=6; i++) {
    $('#pattern' + i).mousedown(changeImage);
  }  
  for (i=8; i<=8; i++) {
    $('#pattern' + i).mousedown(changeImage);
  }  

  for (i=12; i<=38; i++) {
    $('#pattern' + i).mousedown(changeImage);
  }  
  $("#pattern2").mousedown(changeImage2);
  $("#pattern3").mousedown(changeImage3);
  $("#pattern7").mousedown(changeImage7);
  $("#pattern9").mousedown(changeImage9);
  $("#pattern10").mousedown(changeImage10);
  $("#pattern11").mousedown(changeImage11);

//tool buttons
  var currentButton = "#4a";

  function setCurrent(){// set currentButton to the new id and hilite it. If there is already a current button, unhilite it.
    if(this!=currentButton) { // if they are already the same, then don't bother
      if(currentButton) {switchImg(currentButton);} // if current button is already set, then unset it
      currentButton=this;
      switchImg(currentButton);
    }
  }

  function switchImg(element) { // switch the object attribute values for 'src' and 'dos'
    $(element).attr({
      'src': $(element).attr('dos') 
      , 'dos': $(element).attr('src') 
    });
  };

  switchImg(currentButton); //set the first button to be ready to go

  for(i=1; i<=10;i++){//set up all of the buttons
    $("#"+i+"a").bind("mousedown",setCurrent);
    $("#"+i+"b").bind("mousedown",setCurrent);
  };
     //for adding checkmarks next to selected line thickness
  function addcheck0() {
    $('#linethicknesscheck').css("top", "273px") 
    $('#checkbox0').addClass('checked');
      for(i=1;i<5;i++){
        $('#checkbox' + i).removeClass('checked');
      };
  }
  function addcheck1() {
    $('#linethicknesscheck').css("top", "283px") 
    $('#checkbox1').addClass('checked');
    $('#checkbox0').removeClass('checked');
      for(i=2;i<5;i++){
       $('#checkbox'+i).removeClass('checked');
      };
  }
  function addcheck2() {
    $('#linethicknesscheck').css("top", "294px") 
    $('#checkbox2').addClass('checked');
    $('#checkbox0, #checkbox1, #checkbox3, #checkbox4').removeClass('checked');
  }
  function addcheck3() {
    $('#linethicknesscheck').css("top", "306px") 
    $('#checkbox3').addClass('checked');
    $('#checkbox4').removeClass('checked');
      for(i=0;i<3;i++){
        $('#checkbox'+i).removeClass('checked');
      };
  }
  
  function addcheck4() {
    $('#linethicknesscheck').css("top", "320px");
    $('#checkbox4').addClass('checked');
      for(i=0;i<4;i++){
        $('#checkbox'+i).removeClass('checked');
      };
  }

  //adds 'checked' to checkbox0 when page loads
  $('#checkbox0').addClass('checked');
  //sets paintbrush cursor when page loads
  $('#myCanvas').css({"cursor":"url(paintbrushb.png), url(paintbrushb.cur), default"});
  //changes cursor for tools 6a through 10a when line thickness is changed
  function changeCur(){
    var tool = $('.tools').find('img');
    if ($(tool).hasClass('active')){//check to see if button is active
      if ($('#checkbox0').hasClass('checked') || $('#checkbox1').hasClass('checked')){
        $('#myCanvas').css({"cursor":"url(line2cross.png), default"});
      }      
      else if ($('#checkbox2').hasClass('checked')){
        $('#myCanvas').css({"cursor":"url(line3cross.png), default"});
      }
      else if ($('#checkbox3').hasClass('checked')){
        $('#myCanvas').css({"cursor":"url(line4cross.png), default"});
      }
      else if ($('#checkbox4').hasClass('checked')){
        $('#myCanvas').css({"cursor":"url(line5cross.png), default"});
      }
    }
  }
  //remove class active from all tools if a non-shape tool is clicked
  $('.tools').find('img:not(.shape)').mouseup(function(){
    $('.tools').find('img').removeClass('active');
  });
  //runs changeCur when a shape tool button is active
  $('.shape').mouseup(function(){
    $('.shape').removeClass('active');
    $(this).addClass('active');
    var toolID = $(this).attr('id')
      if ($('#' + toolID).attr('src') == "images/" + toolID + "i.png"){
        changeCur();
      }
  });
  //runs changeCur and addcheck when line thickness is changed
  $('.thickness').mousedown(function(){
    var id = $(this).attr('id');
    if (id == "checkbox0" || id == "line0") addcheck0();
    else if (id == "checkbox1" || id == "line1") addcheck1();
    else if (id == "checkbox2" || id == "line2") addcheck2();
    else if (id == "checkbox3" || id == "line3") addcheck3();
    else if (id == "checkbox4" || id == "line4") addcheck4();
    changeCur();
  });

   function startTime() {
        var today=new Date();
        var h = today.getHours();
        var y= Math.abs(h-12);
        var m=today.getMinutes();
        var s=today.getSeconds();
        // add a zero in front of numbers<10
        m=checkTime(m);
        s=checkTime(s);
         if (h - 12 < 0){
          document.getElementById('txt').innerHTML=y+":"+m+":"+s+" AM";
        }
        else {
          document.getElementById('txt').innerHTML=y+":"+m+":"+s+" PM"; 
        }
        t=setTimeout(function(){startTime()},500);
      }
      function checkTime(i) {
        if (i<10) {
          i="0" + i;
        }
        return i;
      }
      
      
      var hour = 12
      var minutes = 0
      var seconds = 0
      function writeTime(){
        if(minutes > 9 && minutes < 60){
          document.getElementById('txt4').innerHTML=hour+":"+minutes+":0"+seconds;
        }
        if(minutes >= 0 && minutes < 10){
            document.getElementById('txt4').innerHTML=hour+":0"+minutes+":0"+seconds;
        }
      }
      function defaultAlarm(){
        document.getElementById('txt4').innerHTML=hour+":0"+minutes+":0"+seconds;
      }
      defaultAlarm();
      //decrement hours
      $('#4b').mousedown(function(){
        if(hour < 13 && hour > 0){
          hour = hour - 1;
          writeTime();
        }
        if(hour < 1){//resets hour back to 12
          hour = 12;
          writeTime();
        }
      });
      //decrement minutes
      $('#3b').mousedown(function(){
        if(minutes < 60 && minutes >= 0){
          minutes = minutes - 1;
          writeTime();
        }
        if(minutes < 1){
          minutes = 59;
        }
        writeTime();
      });
      //increment hours
      $('#5b').mousedown(function(){
        if(hour < 13 && hour > 0){
          hour = hour + 1;
          writeTime();
        }
        if (hour > 12){
          hour = 1;
        }
        writeTime();
      });
      //increment hours
       $('#6b').mousedown(function(){
           if (minutes < 60 && minutes >= 0){
              minutes = minutes + 1;
              writeTime();
        }
        if (minutes > 59){
          minutes = 0;
        }
        writeTime();
      });
 //save file pop-up after clicking 'yes'
  $('#yesSave').mousedown(function(){
    $(this).css({'background':'black','color':'white'});//inverse background/text when button pressed
    $('#yesSave').hover
      (function(){$(this).css({'background':'black','color':'white'})},//keeps it inverse while mousein
      function(){$(this).css({'background':'white','color':'black'});//changes back when mouse leaves
    });
    $(document).mouseup(function(){
      $('#yesSave').unbind('hover');//prevents hover event inside of button if mouseup outside of it
    });
  });
  $('#imageLink').mouseup(function(){
    var dataUrl = canvas.toDataURL();
    $('#imageLink').attr('href', dataUrl)
    //var dataUrl = canvas.toDataURL();
    //$('#textArea').text(dataUrl);
    console.log(dataUrl);
    console.log('go');
});

  

  $('.nav-sub').find('li')
    
    .mouseup(function(){
      
      $(this).parent().unbind('hover');
    var that = $(this).attr('id');
    var x = 1;                     
    function flash (that) {  
      setTimeout(function() { 
        setTimeout(function (){
           $('#' + that).addClass('flashing1').removeClass('flashing2');
           
        },40);
        setTimeout(function (){
          
          $('#' + that).removeClass('flashing1').addClass('flashing2');
        },80);              
        x++;                   
        if (x < 5) {           
           flash(that);         
        } 
      },120);  
    
    }        

    flash(that);
    hideSub(that);
    function hideSub(that){
    setTimeout(function(){
      $('.nav-sub').hide();
      $('.nav-sub').find('li').removeAttr('class');
      //$('#' + that).trigger('mouseout');
      //$('.nav-sub').find('li').css({'background':'none','color':'black'});
    },500);  
    }       
  });

//copies canvas image to secondary canvas
    //my version
        /*var newCanvas = $('#scaledCanvas')
        var destCtx = newCanvas.get(0).getContext("2d");
        destCtx.scale(.5,.5);
        $('#hand').dblclick(function(){
            destCtx.clearRect(0, 0, newCanvas.width() * 2, newCanvas.height() * 2);
            destCtx.drawImage(canvas, 0, 0);
        });*/
    //from stackoverflow
    $('#hand').dblclick(showPage);
    $('#showPage').mouseup(function(){
        setTimeout(showPage,500);

    });
    function showPage(){
        $('#overlay').show();
        $('.canvas').hide();
        var canvas = document.getElementById('myCanvas');
        var context = canvas.getContext('2d');
        var newCanvas = document.getElementById('scaledCanvas');
        var destCtx = newCanvas.getContext('2d');
        destCtx.clearRect(0, 0, newCanvas.width, newCanvas.height);
        //save the current state of this canvas' drawing mode
        destCtx.save();
        destCtx.scale(.32,.33);
        destCtx.drawImage(canvas, 0, 0);
        //restore destCtx to a 1,1 scale (and also 0,0 origin and 0 rotation)
        destCtx.restore();
        console.log($('.canvas').css('left'));
        console.log($('.canvas').css('top'));
        console.log($('#viewBox').position());
        var canvasLeft = parseInt($('.canvas').css('left')) / -3.09;
        var canvasTop = parseInt($('.canvas').css('top')) / -2.98
        $('#viewBox').css('left', canvasLeft).css('top', canvasTop);
        $('#canvasbox').css('z-index','10500');
    }
    function divShow(){
        $('#patternchangeboxdiv').show();
        $('#closecanvastable').hide();
        $('.rowlines').hide();
    }
    $('.rightbrushtable').dblclick(function () {
        divShow();
    });
    $('#editPattern').mouseup(function(){
        $('#overlay').show();
        $('#patternchangeboxdiv').css('z-index','10010');
        setTimeout(divShow, 500);

    });
    $('#okEdits, #cancelEdits, #okMirrors, #noneMirrors').mousedown(function(){
        $(this).css({'background':'black','color':'white'});//inverse background/text when button pressed
        $(this).hover
          (function(){$(this).css({'background':'black','color':'white'})},//keeps it inverse while mousein
          function(){$(this).css({'background':'white','color':'black'});//changes back when mouse leaves
        });
        $(document).mouseup(function(){
          $('#okEdits, #cancelEdits, #okMirrors, #noneMirrors').unbind('hover');//prevents hover event inside of button if mouseup outside of it
        });
    });
    $('#okEdits, #cancelEdits, #okMirrors, #noneMirrors').mouseup(function(){
        $(this).css({'background':'white','color':'black'});
        $('#patternchangeboxdiv').hide();
        $('#closecanvastable').show();
        $('.rowlines').show();
        $('#Mirrors').hide();
        $('#overlay').hide();
        $('#patternchangeboxdiv').css('z-index', '601')
    });
    $('#editMirror').mouseup(function(){
        $('#overlay').css("display","block");
       setTimeout(mirrors, 500);
    });
    function mirrors(){
        $('#Mirrors').show();
        $('#closecanvastable').hide();
        $('.rowlines').hide();
        //$('.list').find('li').css({'background':'black','color':'white'});
    }
});























