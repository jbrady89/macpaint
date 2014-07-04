window.drawn = false;

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
        lastY = 0,
        mouseX,
        mouseY,
        canvas2 = document.getElementById('cursorcanvas'),
        // ctx2 = canvas2.getContext('2d'),
        temp = document.getElementById('temp'),
        temp2 = document.getElementById('temp2'),
        temp2Ctx = temp2.getContext('2d'),
        tempCtx = temp.getContext('2d'),
        lastCur = [],
        points = [],
        drop = false;

    paintbrush(); //paintbrush active when page loads

    //brushbox preset
    $('#brushbox').css({
        'display':'block',
        'top':'120px',
        'left':'56px'
    });

    // tool buttons
    $('#1b').mousedown(select);
    $('#3a').mousedown(bucket);
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
    $('#9b').mousedown(function(){drawjellybean(true)});
    $('#10a').mousedown(function(){polygon(false)});
    $('#10b').mousedown(function(){polygon(true)});

    $('.tools').find('td').not('#5b').mouseup(function(){
        lastCur.push($('#myCanvas').css('cursor'));
    });
    //context.fillStyle = 'rgb(255,255,255)';
    //context.fillRect(0, 0, canvas.width, canvas.height);
    var outlineLayerData;
    function bucket(){
        console.log('bucket');
        "use strict";

        var context,
            canvasWidth = 414,
            canvasHeight = 239,
            curColor = {r: 0, g: 0, b: 0},
            drawingAreaX = 0,
            drawingAreaY = 0,
            drawingAreaWidth,
            drawingAreaHeight,
            colorLayerData,
            outlineLayerData,
            totalLoadResources = 3,
            curLoadResNum = 0,

            // Clears the canvas.
            clearCanvas = function () {

                context.clearRect(0, 0, canvas.width, canvas.height);
            },

            // Draw the elements on the canvas
            redraw = function () {
                console.log('redraw');
                clearCanvas();
                context.putImageData(outlineLayerData, 0, 0);
                console.log('clear');
            },

            matchOutlineColor = function (r, g, b, a) {

                return (r + g + b < 100 && a === 255);
            },

            matchStartColor = function (pixelPos, startR, startG, startB) {

                var r = outlineLayerData.data[pixelPos],
                    g = outlineLayerData.data[pixelPos + 1],
                    b = outlineLayerData.data[pixelPos + 2],
                    a = outlineLayerData.data[pixelPos + 3];

                // If current pixel of the outline image is black
                if (matchOutlineColor(r, g, b, a)) {
                    return false;
                }

                // If the current pixel matches the clicked color
                if (r === startR && g === startG && b === startB) {
                    return true;
                }

                // If current pixel matches the new color
                if (r === curColor.r && g === curColor.g && b === curColor.b) {
                    return false;
                }

                return true;
            },

            colorPixel = function (pixelPos, r, g, b, a) {

                outlineLayerData.data[pixelPos] = r;
                outlineLayerData.data[pixelPos + 1] = g;
                outlineLayerData.data[pixelPos + 2] = b;
                outlineLayerData.data[pixelPos + 3] = a !== undefined ? a : 255;
            },

            floodFill = function (startX, startY, startR, startG, startB) {
                console.log('fill');
                var newPos,
                    x,
                    y,
                    pixelPos,
                    reachLeft,
                    reachRight,
                    drawingBoundLeft = drawingAreaX,
                    drawingBoundTop = drawingAreaY,
                    drawingBoundRight = drawingAreaX + drawingAreaWidth - 1,
                    drawingBoundBottom = drawingAreaY + drawingAreaHeight - 1,
                    pixelStack = [[startX, startY]];

                while (pixelStack.length) {

                    newPos = pixelStack.pop();
                    x = newPos[0];
                    y = newPos[1];

                    // Get current pixel position
                    pixelPos = (y * canvasWidth + x) * 4;

                    // Go up as long as the color matches and are inside the canvas
                    while (y >= drawingBoundTop && matchStartColor(pixelPos, startR, startG, startB)) {
                        y -= 1;
                        pixelPos -= canvasWidth * 4;
                    }

                    pixelPos += canvasWidth * 4;
                    y += 1;
                    reachLeft = false;
                    reachRight = false;

                    // Go down as long as the color matches and in inside the canvas
                    while (y <= drawingBoundBottom && matchStartColor(pixelPos, startR, startG, startB)) {
                        y += 1;
                        colorPixel(pixelPos, curColor.r, curColor.g, curColor.b);

                        if (x > drawingBoundLeft) {
                            if (matchStartColor(pixelPos - 4, startR, startG, startB)) {
                                if (!reachLeft) {
                                    // Add pixel to stack
                                    pixelStack.push([x - 1, y]);
                                    reachLeft = true;
                                }
                            } else if (reachLeft) {
                                reachLeft = false;
                            }
                        }

                        if (x < drawingBoundRight) {
                            if (matchStartColor(pixelPos + 4, startR, startG, startB)) {
                                if (!reachRight) {
                                    // Add pixel to stack
                                    pixelStack.push([x + 1, y]);
                                    reachRight = true;
                                }
                            } else if (reachRight) {
                                reachRight = false;
                            }
                        }

                        pixelPos += canvasWidth * 4;
                    }
                }
            },

            // Start painting with paint bucket tool starting from pixel specified by startX and startY
            paintAt = function (startX, startY) {
                console.log('painting!');
                var pixelPos = (startY * canvasWidth + startX) * 4,
                    r = outlineLayerData.data[pixelPos],
                    g = outlineLayerData.data[pixelPos + 1],
                    b = outlineLayerData.data[pixelPos + 2],
                    a = outlineLayerData.data[pixelPos + 3];
                    //console.log(r,g,b,a);
                    //console.log(pixelPos)
                if (r === curColor.r && g === curColor.g && b === curColor.b) {
                    console.log('same');
                    // Return because trying to fill with the same color
                    return;
                }

                if (matchOutlineColor(r, g, b, a)) {
                    console.log('outline');
                    // Return because clicked outline
                    return;
                }

                floodFill(startX, startY, r, g, b);

                redraw();
            },

            // Add mouse event listeners to the canvas
            createMouseEvents = function () {

                $('#myCanvas').mousedown(function (e) {
                    console.log('mousedown');
                    // Mouse down location
                    var mouseX = e.pageX - this.offsetLeft -88,
                        mouseY = e.pageY - this.offsetTop - 55;
                        console.log(mouseX, mouseY);
                        //console.log(context.getImageData(mouseX,mouseY, 1, 1))
                    if ((mouseY > drawingAreaY && mouseY < drawingAreaY + drawingAreaHeight) && (mouseX <= drawingAreaX + drawingAreaWidth)) {
                        // Mouse click location on drawing area
                        console.log('inside');
                        paintAt(mouseX, mouseY);
                        console.log(context.getImageData(mouseX,mouseY, 1,1));
                    }
                });
            },

            // Calls the redraw function after all neccessary resources are loaded.
            resourceLoaded = function () {
                createMouseEvents();
            },

            // Creates a canvas element, loads images, adds events, and draws the canvas for the first time.
            init = function () {
                context = canvas.getContext("2d"); // Grab the 2d canvas context
                // Note: The above code is a workaround for IE 8 and lower. Otherwise we could have used:
                //     context = document.getElementById('canvas').getContext("2d");
                drawingAreaX = 0,
                drawingAreaY = 0,
                drawingAreaWidth = canvas.width;
                drawingAreaHeight = canvas.height;
                outlineLayerData = context.getImageData(0, 0, canvasWidth, canvasHeight);
                resourceLoaded();
            };
        init();
    }

    /******************/
    /* Tool Selection */
    /******************/
    
    var currentButton = "#4a";
    var clicked = ["#4a"];
    $('.tools').find('img').mousedown(function(){
        setCurrent();
        switchImg(currentButton);
        clicked.push('#' + $(this).attr('id'));
        for(i=0;i<11;i++){
          var id = $(this).attr('id');
          $('#'+i+'a').attr('src','css/img/'+i+'a.png');
          $('#'+i+'b').attr('src','css/img/'+i+'b.png');
          $(this).attr('src','css/img/'+id+'i.png');
        }
        $('.tools').find('img').mousedown(function(){
          if ($(this).attr('id') == '5b' && $('#5b').attr('src') == 'css/img/5b.png') $('#5b').attr('src', 'css/img/5bi.png');
          if (clicked.length - 1 == '#5b') $('#5b').mousedown(function(){ $('5b').attr('src','css/img/5bi.png')});
        }); 
        $(document).mouseup(function () {
            if ($("#2a").attr('src') == "css/img/2a.png") {
                $('#myCanvas').draggable();
                $('#myCanvas').draggable('disable');
            }  
        });
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
            'src': $(element).attr('dos'), 
            'dos': $(element).attr('src') 
        });
    };

//prevent highlighting when dragging mouse in IE
   
    //$('#applebutton').mousedown(function(event){event.preventDefault()});
    
    //tool buttons
    var currentButton = "#4a";

    function setCurrent(){// set currentButton to the new id and hilite it. If there is already a current button, unhilite it.
        if(this!=currentButton) { // if they are already the same, then don't bother
            if(currentButton) {switchImg(currentButton);} // if current button is already set, then unset it
            currentButton=this;
            switchImg(currentButton);
        }
    }

    function switchImg(element){ // switch the object attribute values for 'src' and 'dos'
        $(element).attr({
          'src': $(element).attr('dos'),
          'dos': $(element).attr('src') 
        });
    }

    switchImg(currentButton); //set the first button to be ready to go

    for(i=1; i<=10;i++){//set up all of the buttons
        $("#"+i+"a").bind("mousedown",setCurrent);
        $("#"+i+"b").bind("mousedown",setCurrent);
    }

    //remove class active from all tools if a non-shape tool is clicked
    $('.tools').find('img:not(.shape)').mouseup(function(){
        $('.tools').find('img').removeClass('active');
    });
//runs changeCur when a shape tool button is active
    $('.shape').mousedown(function(){
        $('.shape').removeClass('active');
        $(this).addClass('active');
        var toolID = $(this).attr('id')
          if ($('#' + toolID).attr('src') == "css/img/" + toolID + "i.png") changeCur();
    });

    /*************/
    /* End Tools */
    /*************/

/***************************/
/* Functions for the tools */
/***************************/

    function select(){
        var selection = document.getElementById('selected');
        var theImage = document.getElementById('newselectioncanvas');
        var dottedSelection = selection.getContext('2d');
        var imageSelection = theImage.getContext('2d');
        var march = false;
        var antsData;
        var selectionData;
        context.strokeStyle = 'black';
        lastCur.push($('#myCanvas').css('cursor'));
        //console.log(lastCur);
        //console.log(lastBrushCur);
        $('#myCanvas').css('cursor', lastBrushCur[lastBrushCur.length - 1]);
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
            var dotted = false;
            context.beginPath();
            context.dashedLineTo(mousedown.x,mousedown.y,loc.x,mousedown.y,[5,5]);
            context.dashedLineTo(loc.x,mousedown.y,loc.x,loc.y,[5,5]);
            context.dashedLineTo(mousedown.x,mousedown.y,mousedown.x,loc.y,[5,5]);
            context.dashedLineTo(mousedown.x,loc.y,loc.x,loc.y,[5,5]);
            context.closePath();
            context.stroke();
            var dotted = true;
        }
        function updateRubberband(loc) {
            updateRubberbandRectangle(loc);
            drawRubberbandShape(loc);
        }
        function windowToCanvas(x, y) {
            var bbox = canvas.getBoundingClientRect();
            return { x: x - bbox.left * (canvas.width / bbox.width),
                     y: y - bbox.top * (canvas.height / bbox.height) };
        }
    // Save and restore drawing surface...................................

        function saveDrawingSurface() {
            drawingSurfaceImageData = context.getImageData(0, 0,canvas.width,canvas.height);
            if (drop){
                antsData = dottedSelection.getImageData(0,0, selection.width, selection.height);
                selectionData = imageSelection.getImageData(1,1, theImage.width, theImage.height);
            }
        }
        function restoreDrawingSurface() {
            var offsetX = Math.abs(parseInt($('.canvas').css('left')));
            var offsetY = Math.abs(parseInt($('.canvas').css('top')));
            //adjust top and left position of selection in relation to main canvas
            var left2 = offsetX + parseInt($('#selectionContainer').css('left'));
            var top2 =  offsetY + parseInt($('#selectionContainer').css('top'));
            context.putImageData(drawingSurfaceImageData, 0, 0);
            if(drop){
                dottedSelection.putImageData(antsData, 0,0);
                imageSelection.putImageData(selectionData, 1,1);
                context.drawImage(theImage, left2, top2,$('#selectionContainer').width(),$('#selectionContainer').height());
                temp2Ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
            }
        }
        if (!drop){
            canvas.onmousedown = function (e) {
                points = [];
                var loc = windowToCanvas(e.clientX, e.clientY);
                e.preventDefault(); // Prevent cursor change
                saveDrawingSurface();
                mousedown.x = loc.x;
                mousedown.y = loc.y;
                mouseX = e.pageX - this.offsetLeft - 182;
                mouseY = e.pageY - this.offsetTop - 158;
                points.push(mouseX, mouseY);
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
                march = true;//marching ants are active
                loc = windowToCanvas(e.clientX, e.clientY);
                restoreDrawingSurface();
                updateRubberband(loc);
                dragging = false;
                //clearInterval(marching);
                //gets width and height of selection
                w = Math.abs(loc.x - mousedown.x);
                h = Math.abs(loc.y - mousedown.y);
                //displays new canvas for the selection to be drawn 
                $('#selectionContainer').css({'width':w,'height':h});
                $('#selectionContainer').show();
                $('#selected').width(w);
                $('#newselectioncanvas').width(w - 2);
                $('#newselectioncanvas').height(h - 2);
                $('#selected').height(h);
                $('#selected').show();
                //selected area is copied from original canvas
                //dragging selection top left to bottom right
                context.fillStyle = 'white';
                dottedSelection.strokeStyle = 'black';
                if (loc.x > mousedown.x && loc.y > mousedown.y){
                    //$('#selected').css('left', 1).css('top', 1);
                    $('#selectionContainer').css('left', points[0] ).css('top', points[1]);
                    tempCtx.fillStyle = 'white';
                    imageSelection.drawImage(canvas, mousedown.x + 2, mousedown.y + 2, w - 4, h - 4, 0, 0, theImage.width, theImage.height);
                    context.fillRect(mousedown.x - 1, mousedown.y - 1, selection.width + 1, selection.height + 1);
                    tempCtx.fillRect(mousedown.x - 1, mousedown.y - 1, w + 2, h + 2);
                    dottedSelection.save();
                    context.save();
                    imageSelection.save();
                }
                //top right to bottom left
                else if (loc.x < mousedown.x && loc.y > mousedown.y){
                    $('#selected').css('left',mouseX - w).css('top',mouseY);
                    dottedSelection.drawImage(canvas, mousedown.x, loc.y, w, h, 1, 1, selection.width, selection.height);
                    context.fillRect( mousedown.x, loc.y, w + 5, h + 5);
                    tempCtx.fillRect(mousedown.x - 1, mousedown.y - 1, w + 2, h + 2);
                    dottedSelection.save();
                }
                //bottom left to top right
                else if (loc.x > mousedown.x && loc.y < mousedown.y){
                    $('#selected').css('left',mouseX).css('top',mouseY - h);
                    dottedSelection.drawImage(canvas, mousedown.y, loc.x, w, h, 1, 1, selection.width, selection.height);
                    context.fillRect(mousedown.y, loc.x, w + 5, h + 5);
                    tempCtx.fillRect(mousedown.x - 1, mousedown.y - 1, w + 2, h + 2);
                    dottedSelection.save();
                }
                //bottom right to top left
                else if (loc.x < mousedown.x && loc.y < mousedown.y){
                    $('#selected').css('left',mouseX - w).css('top',mouseY - h);
                    dottedSelection.drawImage(canvas, loc.x, loc.y, w, h, 1, 1, selection.width, selection.height);
                    context.fillRect(loc.x, loc.y, w + 5, h + 5);
                    tempCtx.fillRect(mousedown.x - 1, mousedown.y - 1, w + 2, h + 2);
                    dottedSelection.save();
                }
                //new canvas is made draggable
                var top = parseInt($('#selected').css('top'));
                var left = parseInt($('#selected').css('left'));
                $('#selectionContainer').draggable();
                var clear = false;
                if (march) {//if marching ants are active..
                    $('#clear').mouseup(function(){
                        var selDat = dottedSelection.getImageData(1,1, selection.width, selection.height);
                        $('#selectionContainer').hide();
                        var clear = true;
                    });
                }
                var dragSel;
                $('#selectionContainer').mousedown(function(){
                    var dragSel = false;
                });
                $('#selectionContainer, #selected, #newselectioncanvas').mouseup(function(){
                    var drop = true;
                });
                //after dragging new canvas
                $('#selected').mouseup(function(){
                    var drop = true;
                    var draggedLeft = parseInt($('#selected').css('left'));
                    var draggedTop = parseInt($('#selected').css('top'));
                    //find top and left position of canvas
                    var offsetX = parseInt($('.canvas').css('left'));
                    var offsetY = parseInt($('.canvas').css('top'));
                    //adjust top and left position of selection in relation to main canvas
                    var left2 = -offsetX + parseInt($('#selected').css('left'));
                    var top2 =  -offsetY + parseInt($('#selected').css('top'));
                    //draw the image from selection back onto main canvas in new position
                   // context.drawImage(selection, left2 - 1, top2 - 1, $('#selected').width() + 1, $('#selected').height() + 1);
                });
                //marching ants animation
                CanvasRenderingContext2D.prototype.dashedLine = function(x, y, x2, y2, dashArray, start) {
                    if (!dashArray) dashArray = [10, 5];
                    var dashCount = dashArray.length;
                    var dashSize = 0;
                    dottedSelection.globalCompositeOperation = "xor";
                    for (i = 0; i < dashCount; i++) dashSize += parseInt(dashArray[i]);
                    var dx = (x2 - x),
                        dy = (y2 - y);
                    var slopex = (dy < dx);
                    var slope = (slopex) ? dy / dx : dx / dy;
                    var dashOffSet = dashSize * (1 - (start / 100))
                    if (slopex) {
                        var xOffsetStep = Math.sqrt(dashOffSet * dashOffSet / (1 + slope * slope));
                        x -= xOffsetStep;
                        dx += xOffsetStep;
                        y -= slope * xOffsetStep;
                        dy += slope * xOffsetStep;
                    } else {
                        var yOffsetStep = Math.sqrt(dashOffSet * dashOffSet / (1 + slope * slope));
                        y -= yOffsetStep;
                        dy += yOffsetStep;
                        x -= slope * yOffsetStep;
                        dx += slope * yOffsetStep;
                    }
                    this.moveTo(x, y);
                    var distRemaining = Math.sqrt(dx * dx + dy * dy);
                    var dashIndex = 0,
                        draw = true;
                    while (distRemaining >= 0.1 && dashIndex < 10000) {
                        var dashLength = dashArray[dashIndex++ % dashCount];
                        if (dashLength > distRemaining) dashLength = distRemaining;
                        if (slopex) {
                            var xStep = Math.sqrt(dashLength * dashLength / (1 + slope * slope));
                            x += xStep
                            y += slope * xStep;
                        } else {
                            var yStep = Math.sqrt(dashLength * dashLength / (1 + slope * slope));
                            y += yStep
                            x += slope * yStep;
                        }
                        if (dashOffSet > 0) {
                            dashOffSet -= dashLength;
                            this.moveTo(x, y);
                        } else {
                            this[draw ? 'lineTo' : 'moveTo'](x,y);
                        }
                        distRemaining -= dashLength;
                        draw = !draw;
                    }
                    // Ensure that the last segment is closed for proper stroking
                    this.moveTo(0, 0);
                }
                var dashes = '5 5 5 5';
                var drawDashes = function(x, y, x1, x2) {
                    var temp = document.getElementById('temp');
                    var temp2 = document.getElementById('temp2');
                    var temp2Ctx = temp2.getContext('2d');
                    var tempCtx = temp.getContext('2d');
                    mouseX = e.pageX - this.offsetLeft - 182;
                    mouseY = e.pageY - this.offsetTop - 158;
                    w = Math.abs(loc.x - mousedown.x);
                    h = Math.abs(loc.y - mousedown.y);
                    var dashGapArray = dashes.replace(/^\s+|\s+$/g, '').split(/\s+/);
                    if (!dashGapArray[0] || (dashGapArray.length == 1 && dashGapArray[0] == 0)) return;
                    var sel = dottedSelection.getImageData(2,2, selection.width - 1, selection.height - 1);
                    dottedSelection.clearRect(0,0,selection.width, selection.height);
                    //draws dotted rect using marching ants
                    dottedSelection.beginPath();
                    dottedSelection.dashedLine(1, 1, 1, selection.height - 1, dashGapArray, currentOffset);
                    dottedSelection.dashedLine(1, 1, selection.width - 1,1, dashGapArray, currentOffset);
                    dottedSelection.dashedLine(selection.width - 1, 1, selection.width - 1, selection.height - 1,dashGapArray, currentOffset);
                    dottedSelection.dashedLine(1, selection.height - 1, selection.width, selection.height - 1, dashGapArray, currentOffset);
                    dottedSelection.closePath();
                    dottedSelection.stroke();
                };
                var marching = window.setInterval(dashInterval, 100);
                var currentOffset = 0;
            
                function dashInterval() {
                  drawDashes();
                  currentOffset += 10;
                  if (currentOffset >= 100) currentOffset = 0;
                }
                drop = true;
            }   
        }
        $('#myCanvas').mouseup(function(){
            if (drop){
                context.restore();
                $('#selectionContainer').show();
                $('#selected').hide();
                points = [];
                drop = false;
                march = false;
                return false;
            }
        });
    }//end selection tool

    $('.tools').not('#1b').mouseup(function(){//resets variable so line 169 will equal true
        drop = false;
    });

    // works in other browsers but not chrome..
    $("#2a").mousedown(function(){
      canvas.onmousedown = function() {};
      $('#myCanvas').draggable({disabled: false});
      $('#myCanvas').draggable({containment: '#largebox'});
    });

    function paintbrushsmall (){
        lastCur.push($('#myCanvas').css('cursor'));
        $('#myCanvas').css('cursor', lastBrushCur[lastBrushCur.length - 1]);

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
        $('#myCanvas').css({"cursor":"url(brushshapes/groupofdots.png), default"});
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
        $('#myCanvas').css({"cursor":"url(brushshapes/largerdot.png), default"});
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
        $('#myCanvas').css({"cursor":"url(brushshapes/largehorizontaldotted.png), default"});
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
        $('#myCanvas').css({"cursor":"url(brushshapes/largeverticaldotted.png), default"});
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
        $('#myCanvas').css({"cursor":"url(brushshapes/smalldottedline.png), default"});
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
    //stores cursor of most recent brush shape used
    var lastBrushCur = [];
    $('#brushespopup').find('td').mouseup(function(){
        lastBrushCur.push($('#myCanvas').css('cursor'))
    });
    $('#mediumdottedrighttiltline').mousedown(function(){
        $('#myCanvas').css({"cursor":"url(brushshapes/mediumtiltdotted.png), default"});
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
        ///$('#myCanvas').css('cursor', lastBrushCur[lastBrushCur.length - 1]);
        lastCur.push($('#myCanvas').css('cursor'));
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
                }
                lastX = mouseX;
                lastY = mouseY;
            }
        }
    }
    var largeDotif;
    var largeDotelse;
    $('#largedottedrighttiltline').mousedown(function(){
        $('#myCanvas').css({"cursor":"url(brushshapes/largetiltdotted.png), default"});
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
        $('#brushbox').css('display','block').css({'top':'56px','left':'216px'});
        spraydesign();
        if (spraydesign){
            $('#4a').mousedown(spraydesign);
        }
    });

    $('#xldottedrighttiltline').mousedown(function(){
        $('#myCanvas').css({"cursor":"url(brushshapes/xldottedrighttiltline.png), default"});
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
        $('#myCanvas').css({"cursor":"url(brushshapes/largehorizontalline.png), default"});
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
        $('#myCanvas').css({"cursor":"url(brushshapes/xlhorizontalline.png), default"});
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
        $('#myCanvas').css({"cursor":"url(brushshapes/largeverticalline.png), default"});
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
        $('#myCanvas').css({"cursor":"url(brushshapes/xlverticalline.png), default"});
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
                ctx.fillRect(y + i - 1, x + j - 1, lineThickness , lineThickness );
            }
            for (i=0, j=0;i<10, j<10;i++, j++){
                ctx.fillRect(y + i - 1, x + j - 1, lineThickness , lineThickness );
            }
        }
        largeDotelse = function(ctx, x, y, lineThickness) {
            for (i=0, j=-1;i<10, j<9;i++, j++){
                ctx.fillRect(x + i - 1, y + j - 1, lineThickness , lineThickness );
            }
            for (i=0, j=0;i<10, j<10;i++, j++){
                ctx.fillRect(x + i - 1, y + j - 1, lineThickness , lineThickness );
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
            $('#myCanvas').css({"cursor":"url(css/img/paintbrush.png), url(cursors/paintbrushb.cur), default"});
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
            $('#myCanvas').css({"cursor":"url(brushshapes/smallsquarecursor.png), default"});
        }
    });
    $('#mediumsquare').mousedown(function(){
        lineThickness = 20;
        $('#brushbox').css('display','block').css({'top':'88px','left':'24px'});
        squarebrushsmall();
        if (squarebrushsmall){
            $('#4a').mousedown(squarebrushsmall);
            $('#myCanvas').css({"cursor":"url(brushshapes/mediumsquarecursor.png), default"});
        }
    });
    $('#largesquare').mousedown(function(){
        lineThickness = 30;
        $('#brushbox').css('display','block').css({'top':'56px','left':'24px'});
        squarebrushsmall();
        if (squarebrushsmall){
            $('#4a').mousedown(squarebrushsmall);
            $('#myCanvas').css({"cursor":"url(brushshapes/largesquarecursor.png), default"});
          }   
    });
    $('#xlsquare').mousedown(function(){
        lineThickness = 40;
        $('#brushbox').css('display','block').css({'top':'24px','left':'24px'});
        squarebrushsmall();
        if (squarebrushsmall){
            $('#4a').mousedown(squarebrushsmall);
            $('#myCanvas').css({"cursor":"url(brushshapes/xlsquarecursor.png), default"});
        }
    });
    
    function squarebrushsmall () {
        $('#myCanvas').css({"cursor":"url(brushshapes/smallsquarecursor.png), default"});
        $('#myCanvas').css('cursor', lastBrushCur[lastBrushCur.length - 1])
        lastCur.push($('#myCanvas').css('cursor'));
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
        lastCur.push($('#myCanvas').css('cursor'));
        canvas.onmousedown = function(e) {
            painting = true;
            ctx.fillStyle = pattern;
            lastX = e.pageX - canvas.offsetLeft - 88;
            lastY = e.pageY - canvas.offsetTop - 55;
            canvas.onmouseup = function(e){
                painting = false;
            }       
            canvas.onmousemove = function(e) {
                var fillpattern = new Image();
                var choice = $('#innerimagetable').attr('brushpattern');
                fillpattern.src = choice;
                var pattern = ctx.createPattern(fillpattern, 'repeat');
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

                    ctx.fillStyle = pattern;
                    for (var x = x1; x < x2; x++) {
                        if (steep) {
                            if((mouseY = lastY + 3) || (mouseY = lastY + 6) || (mouseY = lastY + 9) || (mouseY = lastY + 12) || (mouseY = lastY + 15) || (mouseY = lastY + 18) || (mouseY = lastY + 21) || (mouseY = lastY + 24) || (mouseY = lastY + 27) || (mouseY = lastY + 30) || (mouseY = lastY + 33) || (mouseY = lastY + 36)) {
                            ctx.fillRect(y - 2 , x +4, lineThickness , lineThickness);
                            ctx.fillRect(y - 2 , x +8, lineThickness , lineThickness);
                            ctx.fillRect(y - 1 , x +11, lineThickness , lineThickness);
                            ctx.fillRect(y , x +1, lineThickness , lineThickness);
                            ctx.fillRect(y + 1 , x + 5, lineThickness , lineThickness);
                            ctx.fillRect(y + 1 , x + 8, lineThickness , lineThickness);
                            ctx.fillRect(y + 2 , x + 10, lineThickness , lineThickness);
                            ctx.fillRect(y + 2 , x + 13, lineThickness , lineThickness);
                            ctx.fillRect(y + 3 , x + 2, lineThickness , lineThickness);
                            ctx.fillRect(y + 3 , x + 7, lineThickness , lineThickness);
                            ctx.fillRect(y + 4 , x + 4, lineThickness , lineThickness);
                            ctx.fillRect(y + 4 , x + 9, lineThickness , lineThickness);
                            ctx.fillRect(y + 5 , x - 1, lineThickness , lineThickness);
                            ctx.fillRect(y + 5 , x + 6, lineThickness , lineThickness);
                            ctx.fillRect(y + 5 , x + 11, lineThickness , lineThickness);
                            ctx.fillRect(y + 6 , x + 1, lineThickness , lineThickness);
                            ctx.fillRect(y + 6 , x + 14, lineThickness , lineThickness);
                            ctx.fillRect(y + 7 , x + 5, lineThickness , lineThickness);
                            ctx.fillRect(y + 7 , x + 7, lineThickness , lineThickness);
                            ctx.fillRect(y + 8 , x + 3, lineThickness , lineThickness);
                            ctx.fillRect(y + 8 , x + 9, lineThickness , lineThickness);
                            ctx.fillRect(y + 8 , x + 11, lineThickness , lineThickness);
                            ctx.fillRect(y + 9 , x, lineThickness , lineThickness);
                            ctx.fillRect(y + 10 , x + 5, lineThickness , lineThickness);
                            ctx.fillRect(y + 10 , x + 8, lineThickness , lineThickness);
                            ctx.fillRect(y + 11 , x + 12, lineThickness , lineThickness);
                            ctx.fillRect(y + 12 , x + 3, lineThickness , lineThickness);
                            ctx.fillRect(y + 12 , x + 9, lineThickness , lineThickness);
                            ctx.fillRect(y + 13 , x + 6, lineThickness , lineThickness);
                            }
                            else {
                            ctx.fillRect(y - 2 , x +4, lineThickness , lineThickness);
                            ctx.fillRect(y - 2 , x +8, lineThickness , lineThickness);
                            ctx.fillRect(y - 1 , x +11, lineThickness , lineThickness);
                            ctx.fillRect(y , x +1, lineThickness , lineThickness);
                            ctx.fillRect(y + 1 , x + 5, lineThickness , lineThickness);
                            ctx.fillRect(y + 1 , x + 8, lineThickness , lineThickness);
                            ctx.fillRect(y + 2 , x + 10, lineThickness , lineThickness);
                            ctx.fillRect(y + 2 , x + 13, lineThickness , lineThickness);
                            ctx.fillRect(y + 3 , x + 2, lineThickness , lineThickness);
                            ctx.fillRect(y + 3 , x + 7, lineThickness , lineThickness);
                            ctx.fillRect(y + 4 , x + 4, lineThickness , lineThickness);
                            ctx.fillRect(y + 4 , x + 9, lineThickness , lineThickness);
                            ctx.fillRect(y + 5 , x - 1, lineThickness , lineThickness);
                            ctx.fillRect(y + 5 , x + 6, lineThickness , lineThickness);
                            ctx.fillRect(y + 5 , x + 11, lineThickness , lineThickness);
                            ctx.fillRect(y + 6 , x + 1, lineThickness , lineThickness);
                            ctx.fillRect(y + 6 , x + 14, lineThickness , lineThickness);
                            ctx.fillRect(y + 7 , x + 5, lineThickness , lineThickness);
                            ctx.fillRect(y + 7 , x + 7, lineThickness , lineThickness);
                            ctx.fillRect(y + 8 , x + 3, lineThickness , lineThickness);
                            ctx.fillRect(y + 8 , x + 9, lineThickness , lineThickness);
                            ctx.fillRect(y + 8 , x + 11, lineThickness , lineThickness);
                            ctx.fillRect(y + 9 , x, lineThickness , lineThickness);
                            ctx.fillRect(y + 10 , x + 5, lineThickness , lineThickness);
                            ctx.fillRect(y + 10 , x + 8, lineThickness , lineThickness);
                            ctx.fillRect(y + 11 , x + 12, lineThickness , lineThickness);
                            ctx.fillRect(y + 12 , x + 3, lineThickness , lineThickness);
                            ctx.fillRect(y + 12 , x + 9, lineThickness , lineThickness);
                            ctx.fillRect(y + 13 , x + 6, lineThickness , lineThickness);
                            }
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
    }


    function paintbrush (){
        $('#myCanvas').css({"cursor":"url(css/img/paintbrush.png), url(cursors/paintbrushb.cur), default"});
        lastCur.push($('#myCanvas').css('cursor'));
        /*$(document).mousemove(function(){//prevent drawing when mouse moves off canvas
            if ($(this).attr('id') != 'myCanvas') return false;
        });*/
        lineThickness = 1;
        
       // var c=document.getElementById("myCanvas");
        //var ctx=c.getContext("2d");
        //var fillpattern = new Image();

        setFill();
            //pattern = ctx.createPattern( newImg, 'repeat');
        //console.log(newImg);
        //console.log(pattern);
        canvas.onmousedown = function(e) {
            painting = true;
            if (painting = true){
               // $(document).css({"cursor":"url(css/imgpaintbrush.png), url(paintbrushb.cur), default"});
            
            //else $(document).css('cursor','default');
            //delay = setTimeout(function(){
            pattern = ctx.createPattern( newImg, 'repeat');
            //}, 1);
            //console.log(pattern);
            ctx.fillStyle = pattern;
            lastX = e.pageX - canvas.offsetLeft - 88;
            lastY = e.pageY - canvas.offsetTop - 55;
            }
        };
        canvas.onmouseup = function(e){
            painting = false;
            $(document).css('cursor','default');
        }
        canvas.onmousemove = function(e) {
            /*if ($(this).attr('id') != 'myCanvas') {
                return false;
            }*/
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

                ctx.fillCircle = function(x, y, radius){
        ctx.beginPath();
        //var a = e.pageX - 88;
        //var b = e.pageY - 55;
        var cW = $('#canvasbox').width();
        var cH = $('#canvasbox').height();
        var spreadY = cH - y;
        // | two vertical lines
        if ($('#middletop').css('display') == 'block'){
            //var x = x - 91;
            var spreadX = cW - x;
            ctx.arc(x, y, radius, 0, Math.PI * 2, false);
            ctx.arc(spreadX + 180, y+1, radius, 0, Math.PI * 2, false);
            ctx.moveTo(x + 88, y);
            ctx.arc(spreadX + 180,spreadY + 198, radius, 0, Math.PI * 2, false);
            ctx.moveTo(x, y);
            ctx.arc(x,spreadY + 198, radius, 0, Math.PI * 2, false);
            ctx.closePath();
        }
        // - two horizontal lines
        if ($('#leftmiddle').css('display') == 'block'){
            //var y = y - 56;
            var spreadY = cH - y;
            ctx.arc(x, y, radius, 0, Math.PI * 2, false);
            ctx.arc(x + 88, spreadY + 113, radius, 0, Math.PI * 2, false);
        }
        // \ diagonal
        if ($('#lefttop').css('display') == 'block'){
            ctx.arc(x, y, radius, 0, Math.PI * 2, false);
            ctx.moveTo(y+80, x);
            ctx.arc(y + 80, x  - 81, radius, 0, Math.PI * 2, false);
            ctx.moveTo(x - 81,y + 180);
            ctx.arc(spreadY-90, spreadX - 180, radius, 0, Math.PI * 2, false);
        }
        else ctx.arc(x, y, radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
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
        lastCur.push($('#myCanvas').css('cursor'));
        lineThickness = 1;
        if (($('#4b').attr('src')) == ("css/img/4bi.png")) {
            for (i=0; i<5; i++) { 
                $('#checkbox'+i+'cell').mousedown(pencil);
            }
            for (i=0; i<5; i++) { 
                $('#line'+i+'cell').mousedown(pencil);
            }
        }
        canvas.onmousedown = function(e) {
            painting = true;
            var imagedata = ctx.getImageData(e.pageX - this.offsetLeft - 88 , e.pageY - this.offsetTop - 55, 1, 1);
            var data = imagedata.data;
            ////console.log(data)
            //console.log(data);
            if (data[0] == 255) ctx.fillStyle = "black";
            if (data[0] == 0) ctx.fillStyle  = "white";
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
        if (($('#9a').attr('src') == "css/img/9ai.png")|| ($('#9b').attr('src') == 'css/img/9bi.png')) {
            for (i=0; i<5; i++) { 
                $('#checkbox'+i+'cell').mousedown(function(){return drawjellybean2(dofill)});
            }
            for (i=0; i<5; i++) { 
                $('#line'+i+'cell').mousedown(function(){return drawjellybean2(dofill)});
            }
        }
        drawjellybean2(dofill);
    }

    function drawjellybean2(dofill){
        lastCur.push($('#myCanvas').css('cursor'));
        changeWidth2();
        setFill();
        var jellyStart = [];
        var jellyShape = [];
        ctx.beginPath();
        ctx.lineJoin = 'round'
        ctx.lineCap = 'none'
        canvas.onmousedown = function(e) {
            painting = true;
            ctx.fillStyle = 'black';
            lastX = e.pageX - canvas.offsetLeft - 88;
            lastY = e.pageY - canvas.offsetTop - 55;
            jellyStart.push(lastX, lastY);
            ctx.moveTo(jellyStart[0], jellyStart[1]);
        };
        canvas.onmouseup = function(e){
            painting = false;
            //context.lineJoin = 'round'
            pattern = context.createPattern( newImg, 'repeat');
            ctx.fillStyle = pattern;
            //ctx.beginPath();
            ctx.lineTo(jellyStart[0], jellyStart[1]);
            //ctx.lineTo(jellyShape[jellyShape.length - 2], jellyShape[jellyShape.length - 1])
            // look at drawing code from chat app for a way to speed this up
            // add a new line each time in mousemove so it doesn't have to redraw the whole thing on mouseup
            //for(i=0;i<jellyShape.length;i+=2){
              //ctx.lineTo(jellyShape[i],jellyShape[i + 1]);
            //}
            ctx.closePath();
            ctx.stroke();
            if(dofill) {
                console.log('fill');
                console.log(ctx.fillStyle);
                ctx.fill();
            }
            jellyStart = [];
            jellyShape = [];
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
                        ctx.lineTo(y, x, lineThickness , lineThickness );
                        ctx.stroke();
                        jellyShape.push(y,x);
                    } 
                    else {
                        ctx.lineTo(x, y, lineThickness , lineThickness );
                        ctx.stroke();
                        jellyShape.push(x,y);
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
    function windowToCanvas(x, y) {
        var bbox = canvas.getBoundingClientRect();
        return { x: x - bbox.left * (canvas.width / bbox.width),
                 y: y - bbox.top * (canvas.height / bbox.height) };
    }
    // Save and restore drawing surface...................................
    function saveDrawingSurface() {
        drawingSurfaceImageData = ctx.getImageData(0, 0,canvas.width,canvas.height);
    }
    function restoreDrawingSurface() {
        ctx.putImageData(drawingSurfaceImageData, 0, 0);
    }
    function updateRubberbandRectangle(loc) {
        context.strokeStyle = "black";
        rubberbandRect.width = Math.abs(loc.x - mousedown.x);
        rubberbandRect.height = Math.abs(loc.y - mousedown.y);
        if (loc.x > mousedown.x) rubberbandRect.left = mousedown.x;
        else rubberbandRect.left = loc.x;
        if (loc.y > mousedown.y) rubberbandRect.top = mousedown.y;
        else rubberbandRect.top = loc.y;
    }
    function drawlines (){
        if (($('#5a').attr('src')) == ("css/img/5ai.png")) {
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
        lastCur.push($('#myCanvas').css('cursor'));
        context.lineThickness = 1;
        changeWidth2();
        function drawRubberbandShape(loc) {
            context.lineCap = "square";
            context.lineJoin = "miter";
            context.strokeStyle = "black";
            context.beginPath();
            context.moveTo(mousedown.x, mousedown.y);
            context.lineTo(loc.x, loc.y);
            context.closePath();
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
        //console.log('rect');
        changeCur();
        if (($('#6b').attr('src') == "css/img/6bi.png") || ($('#6a').attr('src') == "css/img/6ai.png")) {
            for (i=0; i<5; i++) { 
                $('.thickness').mousedown(function(){return drawrect2(dofill)});
            }
            for (i=0; i<5; i++) { 
                $('#line'+i+'cell').mousedown(function(){return drawrect2(dofill)});
            }
        }
        drawrect2(dofill);
    }
    function drawrect2 (dofill){
        lastCur.push($('#myCanvas').css('cursor'));
        changeWidth2(); 
        setFill();
        // Rubber bands.......................................................
        function drawRubberbandShape(loc) {
            /*var texture = new Image();
            texture.src = 'texture1.png'
            if (texture.src == 'texture1.png') texture.src = 'texture2.png';
            else if (texture.src == 'texture2.png') texture.src = 'texture3.png';
            else if (texture.src == 'texture3.png') texture.src = 'texture4.png';
            var ants = context.createPattern(texture, 'repeat')
            console.log(texture.src);*/
            context.lineJoin = "miter";
            context.lineCap = "square";
            context.fillStyle = pattern;
            context.strokeStyle = "rgba(0, 0, 0, 1.0)";
            context.beginPath();
            context.lineTo(loc.x + .5, mousedown.y + .5);
            context.lineTo(loc.x + .5, loc.y + .5);
            context.lineTo(mousedown.x + .5, loc.y + .5);
            context.lineTo(mousedown.x + .5, mousedown.y + .5);
            context.closePath();
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
            pattern = ctx.createPattern( newImg, 'repeat');
            if (dofill) ctx.fillStyle = pattern;
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
            outlineLayerData = context.getImageData(0, 0, canvas.width, canvas.height);
            dragging = false;
        };
    }
    
    function drawcircle (dofill){

        if ((($('#8b').attr('src')) == ("css/img/8bi.png")) || (($('#8a').attr('src')) == ("css/img/8ai.png"))) {
            for (i=0; i<5; i++) { 
                $('#checkbox'+i+'cell').mousedown(function(){return drawcircle2(dofill)});
            }
            for (i=0; i<5; i++) { 
                $('#line'+i+'cell').mousedown(function(){return drawcircle2(dofill)});
            }
        }
        drawcircle2(dofill);
    }

    function setFill() {
        newImg = new Image();
        newImg.id = 'fill';
        newImg.src = $('#innerimagetable').attr('brushpattern');
    };

    function drawcircle2 (dofill){
        lastCur.push($('#myCanvas').css('cursor'));
        context.lineWidth = 1;
        changeWidth2();
        setFill();
        function drawRubberbandShape(loc){
            var fillpattern = new Image();
            fillpattern.src = $('#innerimagetable').attr('brushpattern');
            var pattern = context.createPattern(fillpattern, 'repeat');
            drawEllipse(context, mousedown.x, mousedown.y, loc.x - mousedown.x, loc.y - mousedown.y);
            
            function drawEllipse(ctx, x, y, w, h) {
                var kappa = .5522848;
                  ox = (w / 2) * kappa, // control point offset horizontal
                  oy = (h / 2) * kappa, // control point offset vertical
                  xe = x + w,           // x-end
                  ye = y + h,           // y-end
                  xm = x + w / 2,       // x-middle
                  ym = y + h / 2;       // y-middle
                context.fillStyle = pattern;
                context.strokeStyle = "rgba(0, 0, 0, 1.0)";
                context.beginPath();
                context.moveTo(x, ym);
                context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
                context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
                context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
                context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
                context.closePath();
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
            pattern = context.createPattern( newImg, 'repeat');
            context.fillStyle = pattern;
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
            outlineLayerData = context.getImageData(0, 0, canvas.width, canvas.height);
            dragging = false;
        };
    }
    
    function drawroundedrect (dofill) {
        if ((($('#7a').attr('src')) == ("css/img/7ai.png")) || (($('#7b').attr('src')) == ("css/img/7bi.png")) ) {
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
        lastCur.push($('#myCanvas').css('cursor'));
        context.lineWidth = 1;
        changeWidth2();
        setFill();
    // Functions..........................................................
        function drawRubberbandShape(loc) {
            context.lineJoin = "round";
            context.lineCap = "round";
            context.strokeStyle = 'black';
            context.beginPath();
            //top left btm right
            if ((loc.x > mousedown.x) && (loc.y > mousedown.y)) {
                context.moveTo(mousedown.x + 3, mousedown.y - 3);
                //top right
                context.lineTo(loc.x - 3, mousedown.y - 3);
                context.lineTo(loc.x - 2, mousedown.y - 2);
                context.lineTo(loc.x - 1, mousedown.y - 2); 
                context.lineTo(loc.x , mousedown.y - 1); 
                context.lineTo(loc.x + 1, mousedown.y); 
                context.lineTo(loc.x + 2, mousedown.y + 1);
                context.lineTo(loc.x + 2, mousedown.y + 2);
                context.lineTo(loc.x + 3, mousedown.y + 3);
                //bottom righta
                context.lineTo(loc.x + 3, loc.y - 3);
                context.lineTo(loc.x + 2, loc.y - 2);
                context.lineTo(loc.x + 2, loc.y - 1);
                context.lineTo(loc.x + 1, loc.y);
                context.lineTo(loc.x, loc.y + 1);
                context.lineTo(loc.x - 1, loc.y + 2);
                context.lineTo(loc.x - 2, loc.y + 2);
                context.lineTo(loc.x - 3, loc.y + 3);
                //bottom left
                context.lineTo(mousedown.x + 3, loc.y + 3);
                context.lineTo(mousedown.x + 2, loc.y + 2);
                context.lineTo(mousedown.x + 1, loc.y + 2);
                context.lineTo(mousedown.x, loc.y + 1);
                context.lineTo(mousedown.x - 1, loc.y);
                context.lineTo(mousedown.x - 2, loc.y - 1); 
                context.lineTo(mousedown.x - 2, loc.y - 2); 
                context.lineTo(mousedown.x - 3, loc.y - 3);
                //top left
                context.lineTo(mousedown.x - 3, mousedown.y + 3);
                context.lineTo(mousedown.x - 2, mousedown.y + 2); 
                context.lineTo(mousedown.x - 2, mousedown.y + 1); 
                context.lineTo(mousedown.x - 1, mousedown.y); 
                context.lineTo(mousedown.x , mousedown.y - 1); 
                context.lineTo(mousedown.x + 1, mousedown.y - 2);
                context.lineTo(mousedown.x + 2, mousedown.y - 2); 
                context.lineTo(mousedown.x + 2, mousedown.y - 2); 
                context.lineTo(mousedown.x + 3, mousedown.y - 3);
                context.closePath();
            }
            //dragging top right to btm left
            else if (loc.x < mousedown.x && loc.y > mousedown.y) {
                context.moveTo(loc.x + 3, mousedown.y - 3);
                //top right
                context.lineTo(mousedown.x - 3, mousedown.y - 3);
                context.lineTo(mousedown.x - 2, mousedown.y - 2);
                context.lineTo(mousedown.x - 1, mousedown.y - 2); 
                context.lineTo(mousedown.x , mousedown.y - 1); 
                context.lineTo(mousedown.x + 1, mousedown.y); 
                context.lineTo(mousedown.x + 2, mousedown.y + 1);
                context.lineTo(mousedown.x + 2, mousedown.y + 2);
                context.lineTo(mousedown.x + 3, mousedown.y + 3);
                //bottom right
                context.lineTo(mousedown.x + 3, loc.y - 3);
                context.lineTo(mousedown.x + 2, loc.y - 2);
                context.lineTo(mousedown.x + 2, loc.y - 1);
                context.lineTo(mousedown.x + 1, loc.y);
                context.lineTo(mousedown.x, loc.y + 1);
                context.lineTo(mousedown.x - 1, loc.y + 2);
                context.lineTo(mousedown.x - 2, loc.y + 2);
                context.lineTo(mousedown.x - 3, loc.y + 3);
                //bottom left
                context.lineTo(loc.x + 3, loc.y + 3);
                context.lineTo(loc.x + 2, loc.y + 2);
                context.lineTo(loc.x + 1, loc.y + 2);
                context.lineTo(loc.x, loc.y + 1);
                context.lineTo(loc.x - 1, loc.y);
                context.lineTo(loc.x - 2, loc.y - 1); 
                context.lineTo(loc.x - 2, loc.y - 2); 
                context.lineTo(loc.x - 3, loc.y - 3);
                //top left
                context.lineTo(loc.x - 3, mousedown.y + 3);
                context.lineTo(loc.x - 2, mousedown.y + 2); 
                context.lineTo(loc.x - 2, mousedown.y + 1); 
                context.lineTo(loc.x - 1, mousedown.y); 
                context.lineTo(loc.x , mousedown.y - 1); 
                context.lineTo(loc.x + 1, mousedown.y - 2);
                context.lineTo(loc.x + 2, mousedown.y - 2); 
                context.lineTo(loc.x + 2, mousedown.y - 2); 
                context.lineTo(loc.x + 3, mousedown.y - 3);
                context.closePath();
            }
            //dragging btm left to top right
            else if (loc.x > mousedown.x && loc.y < mousedown.y) {
                context.moveTo(mousedown.x + 3, loc.y - 3);
                //top right
                context.lineTo(loc.x - 3, loc.y - 3);
                context.lineTo(loc.x - 2, loc.y - 2);
                context.lineTo(loc.x - 1, loc.y - 2); 
                context.lineTo(loc.x , loc.y - 1); 
                context.lineTo(loc.x + 1, loc.y); 
                context.lineTo(loc.x + 2, loc.y + 1);
                context.lineTo(loc.x + 2, loc.y + 2);
                context.lineTo(loc.x + 3, loc.y + 3);
                //bottom right
                context.lineTo(loc.x + 3, mousedown.y - 3);
                context.lineTo(loc.x + 2, mousedown.y - 2);
                context.lineTo(loc.x + 2, mousedown.y - 1);
                context.lineTo(loc.x + 1, mousedown.y);
                context.lineTo(loc.x, mousedown.y + 1);
                context.lineTo(loc.x - 1, mousedown.y + 2);
                context.lineTo(loc.x - 2, mousedown.y + 2);
                context.lineTo(loc.x - 3, mousedown.y + 3);
                //bottom left
                context.lineTo(mousedown.x + 3, mousedown.y + 3);
                context.lineTo(mousedown.x + 2, mousedown.y + 2);
                context.lineTo(mousedown.x + 1, mousedown.y + 2);
                context.lineTo(mousedown.x, mousedown.y + 1);
                context.lineTo(mousedown.x - 1, mousedown.y);
                context.lineTo(mousedown.x - 2, mousedown.y - 1); 
                context.lineTo(mousedown.x - 2, mousedown.y - 2); 
                context.lineTo(mousedown.x - 3, mousedown.y - 3);
                //top left
                context.lineTo(mousedown.x - 3, loc.y + 3);
                context.lineTo(mousedown.x - 2, loc.y + 2); 
                context.lineTo(mousedown.x - 2, loc.y + 1); 
                context.lineTo(mousedown.x - 1, loc.y); 
                context.lineTo(mousedown.x , loc.y - 1); 
                context.lineTo(mousedown.x + 1, loc.y - 2);
                context.lineTo(mousedown.x + 2, loc.y - 2); 
                context.lineTo(mousedown.x + 2, loc.y - 2); 
                context.lineTo(mousedown.x + 3, loc.y - 3);
                context.closePath();
            }
            //for draggig btm right to top left
            else if ((loc.x < mousedown.x) && (loc.y < mousedown.y)) {
                context.moveTo(loc.x + 3, loc.y - 3);
                //top right
                context.lineTo(mousedown.x - 3, loc.y - 3);
                context.lineTo(mousedown.x - 2, loc.y - 2);
                context.lineTo(mousedown.x - 1, loc.y - 2); 
                context.lineTo(mousedown.x , loc.y - 1); 
                context.lineTo(mousedown.x + 1, loc.y); 
                context.lineTo(mousedown.x + 2, loc.y + 1);
                context.lineTo(mousedown.x + 2, loc.y + 2);
                context.lineTo(mousedown.x + 3, loc.y + 3);
                //bottom right
                context.lineTo(mousedown.x + 3, mousedown.y - 3);
                context.lineTo(mousedown.x + 2, mousedown.y - 2);
                context.lineTo(mousedown.x + 2, mousedown.y - 1);
                context.lineTo(mousedown.x + 1, mousedown.y);
                context.lineTo(mousedown.x, mousedown.y + 1);
                context.lineTo(mousedown.x - 1, mousedown.y + 2);
                context.lineTo(mousedown.x - 2, mousedown.y + 2);
                context.lineTo(mousedown.x - 3, mousedown.y + 3);
                //bottom left
                context.lineTo(loc.x + 3, mousedown.y + 3);
                context.lineTo(loc.x + 2, mousedown.y + 2);
                context.lineTo(loc.x + 1, mousedown.y + 2);
                context.lineTo(loc.x, mousedown.y + 1);
                context.lineTo(loc.x - 1, mousedown.y);
                context.lineTo(loc.x - 2, mousedown.y - 1); 
                context.lineTo(loc.x - 2, mousedown.y - 2); 
                context.lineTo(loc.x - 3, mousedown.y - 3);
                //top left
                context.lineTo(loc.x - 3, loc.y + 3);
                context.lineTo(loc.x - 2, loc.y + 2); 
                context.lineTo(loc.x - 2, loc.y + 1); 
                context.lineTo(loc.x - 1, loc.y); 
                context.lineTo(loc.x , loc.y - 1); 
                context.lineTo(loc.x + 1, loc.y - 2);
                context.lineTo(loc.x + 2, loc.y - 2); 
                context.lineTo(loc.x + 2, loc.y - 2); 
                context.lineTo(loc.x + 3, loc.y - 3);
                context.closePath();
            }
            context.stroke();
            if(dofill) context.fill();
        }
        function updateRubberband(loc) {
            updateRubberbandRectangle(loc);
            drawRubberbandShape(loc);
        }
        canvas.onmousedown = function (e) {
            var loc = windowToCanvas(e.clientX, e.clientY);
            e.preventDefault(); // Prevent cursor change
            saveDrawingSurface();
            pattern = context.createPattern( newImg, 'repeat');
            context.fillStyle = pattern;
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

    function polygon (dofill){
        if (($('#10a').attr('src')) == ("css/img/10ai.png")) {
            for (i=0; i<5; i++) { 
                $('#checkbox'+i+'cell').mousedown(function(){
                    return polygon2(dofill);
                });
            }
            for (i=0; i<5; i++) { 
                $('#line'+i+'cell').mousedown(function(){
                    return polygon2(dofill);
                });
            }
        }
        polygon2(dofill);
    }

    function polygon2 (dofill){

        lastCur.push($('#myCanvas').css('cursor'));
        changeWidth2();
        setFill();
        var startPositionarray = [];
        var endPositionarray = [];
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
            startPositionarray.push(mousedown.x, mousedown.y);      
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
            endPositionarray.push(loc.x,loc.y);
            //console.log(endPositionarray);
            //console.log(startPositionarray);
        };
        canvas.ondblclick = function (e) {
            pattern = context.createPattern( newImg, 'repeat');
            loc = windowToCanvas(e.clientX, e.clientY);
            restoreDrawingSurface();
            updateRubberband(loc);
            dragging = false;
            context.lineJoin = "miter";
            context.lineCap = "square";
            context.strokeStyle = "rbg(0, 0, 0)";
            context.fillStyle = pattern;
            context.beginPath();
            //var sourceX = 3.1 * parseInt($('#vbContainer').css('left'));
            //var sourceY = 2.5 * parseInt($('#vbContainer').css('top'));
            //context.fillRect(sourceX, sourceY, $('#canvasbox').width(), $('#canvasbox').height());
            //context.closePath();
            context.fillStyle = pattern;
            context.beginPath();
                context.moveTo(startPositionarray[0], startPositionarray[1]);
                for(i=0;i<endPositionarray.length; i+=2){
                    context.lineTo(endPositionarray[i], endPositionarray[i + 1]);
                }
            context.closePath();
            if (dofill) context.fill();
            endPositionarray = [];
            startPositionarray = [];
        };
    }

    // clears canvas when eraser is dbl clicked
    $('#eraser').dblclick(function(){
        var temp2 = document.getElementById('temp2');
        var temp2Ctx = temp2.getContext('2d');
        //$('#undo').mouseup(function(){
        //    context.drawImage(temp2, 0, 0, canvas.width, canvas.height);
        //});
        eraserClearCanvas();
        if ($('#4a').attr('src') == 'css/img/4ai.png') $('#myCanvas').css('cursor', lastBrushCur[lastBrushCur.length - 1]);
        function eraserClearCanvas(){
            var left = 3.1 * parseInt($('#vbContainer').css('left'));
            var top = 2.8 * parseInt($('#vbContainer').css('top'));
            var canvas = $("#myCanvas")
            var context = canvas.get(0).getContext("2d");
            context.fillStyle = 'white';
            tempCtx.fillStyle = 'white';
            temp2Ctx.fillStyle = 'white';
            context.fillRect(left, top, $('#canvasbox').width() + 5, $('#canvasbox').height() + 5);
            tempCtx.fillRect(left, top, $('#canvasbox').width() + 5, $('#canvasbox').height() + 5);
            temp2Ctx.fillRect(left, top, $('#canvasbox').width() + 5, $('#canvasbox').height() + 5);
            if ($('#5b').attr('src') == 'css/img/5bi.png') $('#5b').attr('src','css/img/5b.png');
            var lastActive = clicked[clicked.length-3];
            //console.log(lastCur);
            //console.log(lastCur[lastCur.length - 3]);
            $('#myCanvas').css('cursor', lastCur[lastCur.length - 1]);
            $(lastActive).attr('src', $(lastActive).attr('dos')).trigger('mousedown');
            if ($(this).attr('id') == '4a'){
                lastCur = [];
                $('#4a').trigger('mousedown');
            }
            changeCur();
            //console.log(lastCur);
            clicked = [lastActive];

            //lastCur = [];
        }
    });

    /****************************/
    /*****End tool functions*****/
    /****************************/


    //puzzle code belwo

  /*for (i=1;i<17;i++) {
   if (($("#space" +i).src) == "css/img/16.png") {

   }

  } 

    $("#puzzle").mouseup(puzzleo) 
    function puzzleo(){
        $("#gamepic").show();
        $("#gametable").show();
        $("#space12").one('mousedown',function(){
            $("#slot16").attr('src', "css/img/12.png");
            $("#slot12").attr('src', "css/img/16.png");
        });
        if ($("#slot1").attr('src') == "css/img/16.png") {
            $("#space2").one('mousedown',function(){
            $('#slot1').attr('src', $('#slot2').attr('src'));
            $('#slot2').attr('src', "css/img/16.png");
            setTimeout(function(){
                if ($("#slot1").attr('src') != "css/img/16.png") {
                    $("#space5").one('mousedown',function(){
                      $('#slot1').attr('src', $('#slot1').attr('src'));
                      $('#slot5').attr('src', $('#slot5').attr('src'));
                      puzzleo;
                    });
                }
            },100);
            puzzleo();
            });
        }
        if ($("#slot1").attr('src') == "css/img/16.png") {
          $("#space5").one('mousedown',function(){
            $('#slot1').attr('src', $('#slot5').attr('src'));
            $('#slot5').attr('src', "css/img/16.png");
            puzzleo;
          });
        }
    };*/

    $('#alarmdiv, #alarmdrop').hide();


//preset checkmarks when page loads
    $('#plain, #fscheck12, #fontcheck2, #stylecheck6, #stylecheck0').show();
//inverses checkmark images in font/fontsize/style dropdowns
    for(i=0;i<7;i++){
        $('#font'+ i).hover(
          function(){$(this).find("img").attr('src',"css/img/checkfsi.png")},
          function(){$(this).find("img").attr('src',"css/img/checkfs.png");
        });
    }

    for(i=0;i<9;i++){
        $('#fontsize'+ i).hover(
          function(){$(this).find("img").attr('src',"css/img/checkfsi.png")},
          function(){$(this).find("img").attr('src',"css/img/checkfs.png");
        });
    }
    $('#style > ul > li').hover(
        function(){$(this).find("img:not(.symbol)").attr('src',"css/img/checkfsi.png")},
        function(){$(this).find("img:not(.symbol)").attr('src',"css/img/checkfs.png");
    });

    /*****************/
    /* Brushes Popup */
    /*****************/

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
                if($('#brushespopup').hasClass('hidden')) $('.rowlines, #closecanvastable').show();
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
            $(document).mouseup(function(){
            $('#brushespopup').hide().addClass('hidden');
            if($('#brushespopup').hasClass('hidden'))$('.rowlines, #closecanvastable').show();
            $('#overlay').hide();
            $('#brushespopup').css('z-index','5000');
            });
        });
    }

    /*********************/
    /* End Brushes Popup */
    /*********************/

    /***********************/
    /* Begin Dropdown Menu */
    /***********************/

//fontsize menu checkmarks
    function fscheckadd(fsize) {
        $('#fscheck9,#fscheck10, #fscheck12, #fscheck14, #fscheck18, #fscheck24, #fscheck36, #fscheck48, #fscheck72').css("display","none");
        $('#fscheck'+fsize).css("display","block");
    }

    var myfontsize = [9,10,12,14,18,24,36,48,72];
    for(i=0; i < 9; i++){
        //http://www.mennovanslooten.nl/blog/post/62
        myfun = function(fsval){
            return function(){
                fscheckadd(fsval);
            }
        }(myfontsize[i]);
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
            if($('#stylecheck' + i).hasClass('checked')) $('#stylecheck' + i).css('display','block');
        }
    });

//goodies checkmarks
    $('.goodiesCheck').hide();
    $('#fatbits, #grid').mouseup(function(){
        $('.goodiesCheck').hide();
        $(this).find('img').show();
    }).hover(//changes source to inverse check on hover
        function(){$(this).find('img').attr('src', 'css/img/checkfsi.png')},
        function(){$(this).find('img').attr('src', 'css/img/checkfs.png');
    });

//dropdown menu section
    $('ul.nav-sub').hide();//sub-menus hidden when page loads

    $('.list, #applebutton').mousedown(dropdown);
    $('#file').mousedown(dropdownfile);
    $('#edit').mousedown(dropdownedit);
    $('#goodies').mousedown(dropdowngoodies);
    $('#font').mousedown(dropdownfont);
    $('#fontsize').mousedown(dropdownfontsize);
    $('#style').mousedown(dropdownstyle);
    $('#applebutton').mousedown(dropdownapple);

    function dropdownfile(){
        $('#filedrop').show();
    }
    function dropdownedit(){
        $('#editdrop').show();
    }
    function dropdowngoodies(){
        $('#goodiesdrop').show();
    }
    function dropdownfont(){
        $('#fontdrop').show();
    }
    function dropdownfontsize(){
        $('#fontsizedrop').show();
    }
    function dropdownstyle(){
        $('#styledrop').show();
    }
    function dropdownapple(){
        $('#appledrop').show();
    }

    function dropdown(){
        $('#file').hover(drophoverfile);
        $('#edit').hover(drophoveredit);
        $('#goodies').hover(drophovergoodies);
        $('#font').hover(drophoverfont);
        $('#fontsize').hover(drophoverfontsize);
        $('#style').hover(drophoverstyle);
        $('#applebutton').hover(drophoverapple);
    }

    function drophoverfile(){
        $('ul.nav-sub').hide();
        $('#filedrop').show();
    }

    function drophoveredit(){
        $('ul.nav-sub').hide();
        $('#editdrop').show();
    }

    function drophovergoodies(){
        $('ul.nav-sub').hide();
        $('#goodiesdrop').show();
    }

    function drophoverfont(){
        $('ul.nav-sub').hide();
        $('#fontdrop').show();
    }

    function drophoverfontsize(){
        $('ul.nav-sub').hide();
        $('#fontsizedrop').show();
    }

    function drophoverstyle(){
        $('ul.nav-sub').hide();
        $('#styledrop').show();
    }

    function drophoverapple(){
        $('ul.nav-sub').hide();
        $('#appledrop').show();
    }

    function drophover2(){
        $('ul.nav-sub').hide()
    }

//dropdown hovering for chrome
    $('.nav-sub li').hover(
        function(){$(this).not('.inactive, .dottedline').css({'background':'black','color':'white'})}, 
        function(){$(this).not('.inactive, .dottedline').css({'background':'white','color':'black'});
    });
//sets outlined text to white on mouseout
    $('.outline').hover(
        function(){$(this).css({'background':'black','color':'black'}).removeClass('9').removeClass('10').addClass("textoutline")}, 
        function(){$(this).css({'background':'white','color':'white'}).removeClass("textoutline");
    });
    $('#shadow').hover(
        function(){$('#shadowdiv').css('filter','DropShadow(Color=#FFFFFF, OffX=1, OffY=1)')},
        function(){$('#shadowdiv').css('filter','DropShadow(Color=#000000, OffX=1, OffY=1)')
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
        $('#applebutton').attr('src', "css/img/applebuttonh.png");
        $('.blackmenuside').hide();
    }
  
    function applehover(){
        $('#applebutton').attr('src', "css/img/applebuttoni.png");
        $('.list').css({"background":"no-repeat right center","color":"black"});
        $('.blackmenuside').hide();
    }

    function inverse(e){ 
        $('#applebutton').attr('src', "css/img/applebuttoni.png");
        $('.list').hover(navmainitemshover).hover(listhover);
        $('#applebutton').hover(applehover);
        e.preventDefault();
    }
    $('#applebutton').bind("mousedown", inverse);

    $(document).mouseup(function(){
        if  ($('#overlay').css('display') == 'block') $('.blackmenuside:not(#fileblackmenuside, #goodiesblackmenuside)').hide();
        else $('.blackmenuside').hide();
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
    });
  
    $(document).mouseup(function() {
        if ($('#overlay').css('display') == 'block') $('.list:not(#goodies, #file)').css({"background":"no-repeat right center","color":"black"});
        else $('.list').css({"background":"no-repeat right center","color":"black"})
              .hover(hover2)
              .hover(drophover2);
        $('#applebutton').attr('src', "css/img/applebuttonh.png")
                     .hover(applehover2)
                     .hover(drophover2);
        $('#file').mousedown(dropdownfile);
        $('ul.nav-sub').hide();
    });

    function hover2(){
        $(this).css({"background":"no-repeat right center","color":"black"});
        $('.blackmenuside').hide();
    }
    function applehover2(){
        $('#applebutton').attr('src', "css/img/applebuttonh.png")
    }

    //stuff related to functions within dropdown menu

    //for changing fill pattern
    function changeImage2(){ 
        $('#innerimagetable').css("background-image", "url('css/img/pattern2.jpg')").css("background-position", "2px 2px");
        //$('#innerimagetable').attr('brushpattern', "css/img/pattern2.jpg");
    }
    function changeImage3(){ 
        $('#innerimagetable').css("background-image", "url('css/img/pattern3.jpg')").css("background-position", "0px 3px");
        $('#innerimagetable').attr('brushpattern', "css/img/pattern3.jpg");
    }
    function changeImage7(){ 
        $('#innerimagetable').css("background-image", "url('css/img/pattern7.jpg')").css("background-position", "2px 2px");
        $('#innerimagetable').attr('brushpattern', "css/img/pattern7.jpg");
    }
    function changeImage9(){ 
        $('#innerimagetable').css("background-image", "url('css/img/pattern9.jpg')").css("background-position", "2px 2px");
        $('#innerimagetable').attr('brushpattern', "css/img/pattern9.jpg");
    }
    function changeImage10(){ 
        $('#innerimagetable').css("background-image", "url('css/img/pattern10.jpg')").css("background-position", "6px 2px");
        $('#innerimagetable').attr('brushpattern', "css/img/pattern10.jpg");
    }
    function changeImage11(){ 
        $('#innerimagetable').css("background-image", "url('css/img/pattern11.jpg')").css("background-position", "6px 2px");
        $('#innerimagetable').attr('brushpattern', "css/img/pattern11.jpg");
    }

    function changeImage(){
        id = $(this).attr('id');
        $('#innerimagetable').css("background-position", "2px 3px").css("background-image", "url('css/img/" +id+ ".jpg')");
        $('#innerimagetable').attr('brushpattern', "css/img/"+id+".jpg");
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

    /***************************/
    /* End select fill pattern */
    /***************************/

    /*****************************/
    /* Line Thickness Checkmarks */
    /*****************************/

    function changeWidth2(){
        if(($('#checkbox0').hasClass('checked')) || ($('#line0').hasClass('checked'))){
            context.lineWidth = 1;        }
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

//for adding checkmarks next to selected line thickness
    function addcheck0(){
        $('#linethicknesscheck').css("top", "273px") 
        $('#checkbox0').addClass('checked');
          for(i=1;i<5;i++){
            $('#checkbox' + i).removeClass('checked');
          };
    }
    function addcheck1(){
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
    $('#myCanvas').css({"cursor":"url(css/img/paintbrush.png), url(cursors/paintbrushb.cur), default"});
//changes cursor for tools 6a through 10a when line thickness is changed
    function changeCur(){
        if ( lastCur.length > 4 ) {
            lastCur = [];
            lastCur.push($('#myCanvas').css('cursor'));
        } else {
             lastCur.push($('#myCanvas').css('cursor'));
        }
        var tool = $('.tools').find('img');
        if ($(tool).hasClass('active')){//check to see if button is active
            if ($('#checkbox0').hasClass('checked') || $('#checkbox1').hasClass('checked')){
                $('#myCanvas').css({"cursor":"url(css/img/line2cross.png), default"});
            }      
            else if ($('#checkbox2').hasClass('checked')){
                $('#myCanvas').css({"cursor":"url(css/img/line3cross.png), default"});
            }
            else if ($('#checkbox3').hasClass('checked')){
                $('#myCanvas').css({"cursor":"url(css/img/line4cross.png), default"});
            }
            else if ($('#checkbox4').hasClass('checked')){
                $('#myCanvas').css({"cursor":"url(css/img/line5cross.png), default"});
            }
        }
    }

    //runs changeCur and addcheck when line thickness is changed
    $('.thickness').mousedown(function(){
        var id = $(this).attr('id');
        if (id == "checkbox0" || id == "line0") addcheck0();
        else if (id == "checkbox1" || id == "line1") addcheck1();
        else if (id == "checkbox2" || id == "line2") addcheck2();
        else if (id == "checkbox3" || id == "line3") addcheck3();
        else if (id == "checkbox4" || id == "line4") addcheck4();
        changeCur();
        changeWidth2();
    });

    /*********************************/
    /* End Line Thickness Checkmarks */
    /*********************************/

    /****************/
    /* Alarm Widget */
    /****************/

//alarm functions
    function startTime(){
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
    function checkTime(i){
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

    /********************/
    /* End Alarm Widget */
    /********************/


    /*****************************/
    /* Begin Save File as Base64 */
    /*****************************/
    

//trying to save file and encode/decode string
    //context.fillStyle = 'white';
    //context.fillRect(0, 0, canvas.width, canvas.height);
    $('#imageLink').mouseup(function(){
        //context.save();
        /*var goo = context.getImageData(0, 0, canvas.width, canvas.height);
        var data = goo.data;
        var base64 = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0', '1', '2', '3', '4', '5', '6', '7','8','9','+','/','?','?','?','?','?','?','?','?','?','?']
        var encode = '';
        var count = 0;
        var enc = 0;
        for(i=0;i<data.length;i+=4){
            enc <<= 1;
            if(data[i]>.5)
                enc |= 1;
            count ++;
            if (count == 8) {
                encode = encode + String.fromCharCode(enc);
                count = 0;
                enc = 0;
            }
        }
        
        var zip = new JSZip();
        zip.file("Hello.txt", "Hello World\n");
        var img = zip.folder("css/img/");
        img.file("smile.gif", imgData, {base64: true});
        var content = zip.generate();
        location.href="data:application/zip;base64,"+content;
        //console.log(zipencode);*/
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

    // convert image to base64 string and open in new tab
    $('#imageLink').mouseup(function(){
        var dataUrl = canvas.toDataURL();
        $('#imageLink').attr('href', dataUrl);
    });
       
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
        //var canvasLeft = parseInt($('.canvas').css('left')) / -3.1;
        //var canvasTop = parseInt($('.canvas').css('top')) / -2.8;
        //$('#vbContainer').css('left', canvasLeft).css('top', canvasTop);
        $('#canvasbox').css('z-index','10500');
        $('#yesScaled, #cancelScaled').mouseup(function(){
            $('#overlay').hide();
        });
    }
    function divShow(patternchoice){
        $('#rightBox').css('background-image' , patternchoice);
        $('#patternchangeboxdiv').show();
        $('#closecanvastable').hide();
        $('.rowlines').hide();
    }
        $('.rightbrushtable td').dblclick(function () {
            var patternchoice = $(this).attr('dosc');
            divShow(patternchoice);
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

        $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').one('mousedown',(function(e) {
            if ( $('#lefttop').css('display') == 'none' & e.pageX > 159 & e.pageY > 103 & e.pageX < 216 & e.pageY < 160 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (2*(e.pageX) - 271)) ) {
                $('#lefttop').css("display","block");
            }
            if ( $('#lefttop').css('display') == 'none' & e.pageX > 215 & e.pageY > 159 & e.pageX < 278 & e.pageY < 216 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY > (0.5*(e.pageX) + 53)) ) {
                $('#lefttop').css("display","block");
            }
            if ( $('#leftbottom').css('display') == 'none' & e.pageX > 159 & e.pageY > 160 & e.pageX < 216 & e.pageY < 217 & (e.pageY > (-0.5*(e.pageX) + 269)) & (e.pageY < (-2*(e.pageX) +593)) ) {
                $('#leftbottom').css("display","block");
            }
            if ( $('#leftbottom').css('display') == 'none' & e.pageX > 215 & e.pageY > 103 & e.pageX < 278 & e.pageY < 160 & (e.pageY < (-0.5*(e.pageX) + 269)) & (e.pageY > (-2*(e.pageX) +593)) ) {
                $('#leftbottom').css("display","block")
            }
            if ( $('#leftmiddle').css('display') == 'none' & e.pageX > 159 & (e.pageY > (0.5*(e.pageX) + 53)) & (e.pageY < (-0.5*(e.pageX) + 269)) ) {
                $('#leftmiddle').css("display","block")
            }
            if ( $('#leftmiddle').css('display') == 'none' & e.pageX > 215 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (-0.5*(e.pageX) + 269)) ) {
                $('#leftmiddle').css("display","block");
            }
             if ( $('#middletop').css('display') == 'none' & e.pageY > 103 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY < (-2*(e.pageX) + 593)) ) {
                $('#middletop').css("display","block");
            }
            if ( $('#middletop').css('display') == 'none' & e.pageY < 217 & (e.pageY > (2*(e.pageX) - 271)) & (e.pageY > (-2*(e.pageX) + 593)) ) {
                $('#middletop').css("display","block");
            }
        }));
       setTimeout(mirrors, 500);
    });
    function mirrors(){
        $('#Mirrors').show();
        $('#closecanvastable').hide();
        $('.rowlines').hide();
        //$('.list').find('li').css({'background':'black','color':'white'});
    }

    //menu flashing
    $('.nav-sub li').mouseup(function() {
        var flashing = true;
        //$('#overlay').show();
        if (!($(this).hasClass('inactive'))) {
        var id = $(this).closest('ul').parent().attr('id');
        //console.log(id);

        $('#'+id+'flashdiv').show()
        $('#'+id+'flashdiv').hover(function() {
            $('#'+id+'drop').show();
            if ( id == 'apple'){
                $('#applebutton').attr('src', 'css/img/applebuttoni.png');
            } else {
                $('#' + id).css({'background':'black','color':'white'});
            }
            $('#' + id + 'blackmenuside').show();
            //console.log(id);
        });
        var count = 0;
        var inversed;
        var _this = this;
        var whiteToBlack = setInterval(function(){
            count += 1;
            //console.log(inversed);
            if ($(_this).css('background-color') == 'rgb(0, 0, 0)') inversed = false;
            else inversed = true;
            if (inversed == true) $(_this).css({'background':'black','color':'white'});
            else $(_this).css({'background':'white','color':'black'});
            if (count == 8) {
                // clearInterval(whiteToBlack);
                $('#'+id+'flashdiv').hide().unbind('hover'); // I don't understand why taking this unbind out breaks it..
                $(_this).css({'background':'white','color':'black'});
                setTimeout(function(){
                    $('.nav-sub').hide();
                    if ($('#aboutDiv').css('display') !== 'block') $('#applebutton').attr('src', 'css/img/applebuttonh.png');
                    if ($('#overlay').css('display') !== 'block') {
                        $('.list').css({'background':'white','color':'black'});
                        $('.blackmenuside').hide();
                    }
                }, 110);
                //$('.nav-sub').hide();
                /*$('#appledrop').one('hover', function () {
                    $('#appledrop').hide();
                });*/
                flashing = false;
                //$('#overlay').hide();
                clearInterval(whiteToBlack);
            }
        }, 63);
    }
    });

    /*$(document).on('mouseup', function(){
        //console.log(this.id);
        //console.log(window.drawn)
    });*/

    
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);

//undo functions
    $(document).mouseup(function(e){
        //console.log(e.target.id);
    });
    $('#tempContainer2').show().css({'position':'absolute','left':'1000px'});
    var y = false;
    var drawn;
    tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
    $('#myCanvas').mousedown(function(){
        //console.log(drawn);
        var x = false; 
        var temp = document.getElementById('temp');
        var temp2 = document.getElementById('temp2');
        var temp2Ctx = temp2.getContext('2d');
        var tempCtx = temp.getContext('2d');
        if (drawn = true) tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height);//current image of canvas drawn to temp canvas with each mousedown
        $('#myCanvas').mousemove(function(){
                y = true;//flag becomes true after drawing
                window.drawn = true;
        });          
        $('#myCanvas').mouseup(function(){
                if (y){
                    temp2Ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);//current image of canvas drawn to temp2 canvas if flag true
                    x = false;
                }
            if (!y) y = true;
        
        });    
        $('#undo').mouseup(function(){
            //console.log(y);
            if (y){
                if (!x){
                   
                    context.drawImage(temp,0,0,canvas.width, canvas.height);//image drawn from temp to main canvas after undo
                    x = true;//flag becomes true after drawing undone;
                }
                else if (x = true) {
              
                    context.drawImage(temp2, 0,0);//images drawn from temp2 to main canvas after redo
                    x = false;//becomes false when drawing redone
                    clear = true;
                }
            }
            if (clear && ($('#selectionContainer').css('display') == 'none')){//undo the clearing of the selection
                $('#selectionContainer').css({'left': points[0] , 'top': points[1]});//positions selection canvas back to pre-dragged location
                var selection = document.getElementById('selected');
                var theImage = document.getElementById('newselectioncanvas');
                var ctx = selection.getContext('2d');
                var imageSelection = theImage.getContext('2d');
                var top = parseInt($('#selectionContainer').css('top'));
                var left = parseInt($('#selectionContainer').css('left'));
                temp2Ctx.fillStyle = 'white';
                temp2Ctx.fillRect(mousedown.x - 1, mousedown.y - 1, w + 2, h + 2);
                $('#selectionContainer').show();
                context.drawImage(temp2, 0,0, canvas.width, canvas.height);
                //var topo = parseInt($('#newselectioncanvas').css('top'));
                //var lefto = parseInt($('#newselectioncanvas').css('left'));
                //context.fillRect(top, left, selection.width, selection.height);//clears area underneath selection canvas
                clear = false;
            }
        });
    });



    $('.rightbrushtable td').mouseup(function(){
        var newpat = document.getElementById('newPat');
        var patCtx = newpat.getContext('2d');
        var newpat2 = document.getElementById('newPat2');
        var pat2Ctx = newpat2.getContext('2d');

        var id = $(this).attr('id');
        //var fillpattern = new Image();
        newImg.src = "css/img/"+id+".jpg";
        //var pattern = patCtx.createPattern(fillpattern, 'repeat');
        //patCtx.fillStyle = pattern;
        patCtx.beginPath();
        patCtx.rect(0, 0, newpat.width, newpat.height);
        patCtx.closePath();
        patCtx.fill();    
        //fillpattern.src = newpat.toDataURL();
        //var p2 = pat2Ctx.createPattern(fillpattern, 'repeat');
        //pat2Ctx.fillStyle = p2;
        pat2Ctx.beginPath();
        pat2Ctx.rect(0,0, newpat2.width, newpat2.height);
        pat2Ctx.closePath();
        pat2Ctx.fill();
    });

    $('#lefttop').mousedown(function(e) {
        //console.log(e.pageX);
        //console.log(e.pageY);
    });

//this makes the lines in the bursh mirrors popup bold and unbold when clicked
    $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mouseup(function () {

//this makes them bold if they are unbolded when clicked
        if ( $('#lefttop').css('display') == 'none' & $('#leftbottom').css('display') == 'none' & $('#leftmiddle').css('display') == 'none' & $('#middletop').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#lefttop').css('display') == 'none' & e.pageX > 159 & e.pageY > 103 & e.pageX < 216 & e.pageY < 160 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (2*(e.pageX) - 271)) ) {
                    $('#lefttop').css("display","block");
                }
                if ( $('#lefttop').css('display') == 'none' & e.pageX > 215 & e.pageY > 159 & e.pageX < 278 & e.pageY < 216 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY > (0.5*(e.pageX) + 53)) ) {
                    $('#lefttop').css("display","block");
                }
            });
        }
        if ( $('#lefttop').css('display') == 'none' & $('#leftbottom').css('display') == 'block' & $('#leftmiddle').css('display') == 'none' & $('#middletop').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#lefttop').css('display') == 'none' & e.pageX > 159 & e.pageY > 103 & e.pageX < 216 & e.pageY < 160 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (2*(e.pageX) - 271)) ) {
                    $('#lefttop').css("display","block");
                }
                if ( $('#lefttop').css('display') == 'none' & e.pageX > 215 & e.pageY > 159 & e.pageX < 278 & e.pageY < 216 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY > (0.5*(e.pageX) + 53)) ) {
                    $('#lefttop').css("display","block");
                }
            });
        }
        if ( $('#lefttop').css('display') == 'none' & $('#leftbottom').css('display') == 'block' & $('#leftmiddle').css('display') == 'block' & $('#middletop').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#lefttop').css('display') == 'none' & e.pageX > 159 & e.pageY > 103 & e.pageX < 216 & e.pageY < 160 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (2*(e.pageX) - 271)) ) {
                    $('#lefttop').css("display","block");
                }
                if ( $('#lefttop').css('display') == 'none' & e.pageX > 215 & e.pageY > 159 & e.pageX < 278 & e.pageY < 216 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY > (0.5*(e.pageX) + 53)) ) {
                    $('#lefttop').css("display","block");
                }
            });
        }
        if ( $('#lefttop').css('display') == 'none' & $('#leftbottom').css('display') == 'block' & $('#leftmiddle').css('display') == 'none' & $('#middletop').css('display') == 'block' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#lefttop').css('display') == 'none' & e.pageX > 159 & e.pageY > 103 & e.pageX < 216 & e.pageY < 160 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (2*(e.pageX) - 271)) ) {
                    $('#lefttop').css("display","block");
                }
                if ( $('#lefttop').css('display') == 'none' & e.pageX > 215 & e.pageY > 159 & e.pageX < 278 & e.pageY < 216 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY > (0.5*(e.pageX) + 53)) ) {
                    $('#lefttop').css("display","block");
                }
            });
        }
        if ( $('#lefttop').css('display') == 'none' & $('#leftbottom').css('display') == 'block' & $('#leftmiddle').css('display') == 'block' & $('#middletop').css('display') == 'block' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#lefttop').css('display') == 'none' & e.pageX > 159 & e.pageY > 103 & e.pageX < 216 & e.pageY < 160 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (2*(e.pageX) - 271)) ) {
                    $('#lefttop').css("display","block");
                }
                if ( $('#lefttop').css('display') == 'none' & e.pageX > 215 & e.pageY > 159 & e.pageX < 278 & e.pageY < 216 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY > (0.5*(e.pageX) + 53)) ) {
                    $('#lefttop').css("display","block");
                }
            });
        }
        if ( $('#lefttop').css('display') == 'none' & $('#leftbottom').css('display') == 'none' & $('#leftmiddle').css('display') == 'block' & $('#middletop').css('display') == 'block' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#lefttop').css('display') == 'none' & e.pageX > 159 & e.pageY > 103 & e.pageX < 216 & e.pageY < 160 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (2*(e.pageX) - 271)) ) {
                    $('#lefttop').css("display","block");
                }
                if ( $('#lefttop').css('display') == 'none' & e.pageX > 215 & e.pageY > 159 & e.pageX < 278 & e.pageY < 216 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY > (0.5*(e.pageX) + 53)) ) {
                    $('#lefttop').css("display","block");
                }
            });
        }
        if ( $('#lefttop').css('display') == 'none' & $('#leftbottom').css('display') == 'none' & $('#leftmiddle').css('display') == 'block' & $('#middletop').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#lefttop').css('display') == 'none' & e.pageX > 159 & e.pageY > 103 & e.pageX < 216 & e.pageY < 160 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (2*(e.pageX) - 271)) ) {
                    $('#lefttop').css("display","block");
                }
                if ( $('#lefttop').css('display') == 'none' & e.pageX > 215 & e.pageY > 159 & e.pageX < 278 & e.pageY < 216 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY > (0.5*(e.pageX) + 53)) ) {
                    $('#lefttop').css("display","block");
                }
            });
        }
        if ( $('#lefttop').css('display') == 'none' & $('#leftbottom').css('display') == 'none' & $('#leftmiddle').css('display') == 'none' & $('#middletop').css('display') == 'block' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#lefttop').css('display') == 'none' & e.pageX > 159 & e.pageY > 103 & e.pageX < 216 & e.pageY < 160 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (2*(e.pageX) - 271)) ) {
                    $('#lefttop').css("display","block");
                }
                if ( $('#lefttop').css('display') == 'none' & e.pageX > 215 & e.pageY > 159 & e.pageX < 278 & e.pageY < 216 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY > (0.5*(e.pageX) + 53)) ) {
                    $('#lefttop').css("display","block");
                }
            });
        }




        if ( $('#leftbottom').css('display') == 'none' & $('#lefttop').css('display') == 'none' & $('#leftmiddle').css('display') == 'none' & $('#middletop').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#leftbottom').css('display') == 'none' & e.pageX > 159 & e.pageY > 160 & e.pageX < 216 & e.pageY < 217 & (e.pageY > (-0.5*(e.pageX) + 269)) & (e.pageY < (-2*(e.pageX) +593)) ) {
                    $('#leftbottom').css("display","block");
                }
                if ( $('#leftbottom').css('display') == 'none' & e.pageX > 215 & e.pageY > 103 & e.pageX < 278 & e.pageY < 160 & (e.pageY < (-0.5*(e.pageX) + 269)) & (e.pageY > (-2*(e.pageX) +593)) ) {
                    $('#leftbottom').css("display","block");
                }
            });
        }
        if ( $('#leftbottom').css('display') == 'none' & $('#lefttop').css('display') == 'block' & $('#leftmiddle').css('display') == 'block' & $('#middletop').css('display') == 'block' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#leftbottom').css('display') == 'none' & e.pageX > 159 & e.pageY > 160 & e.pageX < 216 & e.pageY < 217 & (e.pageY > (-0.5*(e.pageX) + 269)) & (e.pageY < (-2*(e.pageX) +593)) ) {
                    $('#leftbottom').css("display","block");
                }
                if ( $('#leftbottom').css('display') == 'none' & e.pageX > 215 & e.pageY > 103 & e.pageX < 278 & e.pageY < 160 & (e.pageY < (-0.5*(e.pageX) + 269)) & (e.pageY > (-2*(e.pageX) +593)) ) {
                    $('#leftbottom').css("display","block");
                }
            });
        }
        if ( $('#leftbottom').css('display') == 'none' & $('#lefttop').css('display') == 'block' & $('#leftmiddle').css('display') == 'none' & $('#middletop').css('display') == 'block' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#leftbottom').css('display') == 'none' & e.pageX > 159 & e.pageY > 160 & e.pageX < 216 & e.pageY < 217 & (e.pageY > (-0.5*(e.pageX) + 269)) & (e.pageY < (-2*(e.pageX) +593)) ) {
                    $('#leftbottom').css("display","block");
                }
                if ( $('#leftbottom').css('display') == 'none' & e.pageX > 215 & e.pageY > 103 & e.pageX < 278 & e.pageY < 160 & (e.pageY < (-0.5*(e.pageX) + 269)) & (e.pageY > (-2*(e.pageX) +593)) ) {
                    $('#leftbottom').css("display","block");
                }
            });
        }
        if ( $('#leftbottom').css('display') == 'none' & $('#lefttop').css('display') == 'block' & $('#leftmiddle').css('display') == 'block' & $('#middletop').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#leftbottom').css('display') == 'none' & e.pageX > 159 & e.pageY > 160 & e.pageX < 216 & e.pageY < 217 & (e.pageY > (-0.5*(e.pageX) + 269)) & (e.pageY < (-2*(e.pageX) +593)) ) {
                    $('#leftbottom').css("display","block");
                }
                if ( $('#leftbottom').css('display') == 'none' & e.pageX > 215 & e.pageY > 103 & e.pageX < 278 & e.pageY < 160 & (e.pageY < (-0.5*(e.pageX) + 269)) & (e.pageY > (-2*(e.pageX) +593)) ) {
                    $('#leftbottom').css("display","block");
                }
            });
        }
        if ( $('#leftbottom').css('display') == 'none' & $('#lefttop').css('display') == 'block' & $('#leftmiddle').css('display') == 'none' & $('#middletop').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#leftbottom').css('display') == 'none' & e.pageX > 159 & e.pageY > 160 & e.pageX < 216 & e.pageY < 217 & (e.pageY > (-0.5*(e.pageX) + 269)) & (e.pageY < (-2*(e.pageX) +593)) ) {
                    $('#leftbottom').css("display","block");
                }
                if ( $('#leftbottom').css('display') == 'none' & e.pageX > 215 & e.pageY > 103 & e.pageX < 278 & e.pageY < 160 & (e.pageY < (-0.5*(e.pageX) + 269)) & (e.pageY > (-2*(e.pageX) +593)) ) {
                    $('#leftbottom').css("display","block");
                }
            });
        }
        if ( $('#leftbottom').css('display') == 'none' & $('#lefttop').css('display') == 'none' & $('#leftmiddle').css('display') == 'block' & $('#middletop').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#leftbottom').css('display') == 'none' & e.pageX > 159 & e.pageY > 160 & e.pageX < 216 & e.pageY < 217 & (e.pageY > (-0.5*(e.pageX) + 269)) & (e.pageY < (-2*(e.pageX) +593)) ) {
                    $('#leftbottom').css("display","block");
                }
                if ( $('#leftbottom').css('display') == 'none' & e.pageX > 215 & e.pageY > 103 & e.pageX < 278 & e.pageY < 160 & (e.pageY < (-0.5*(e.pageX) + 269)) & (e.pageY > (-2*(e.pageX) +593)) ) {
                    $('#leftbottom').css("display","block");
                }
            });
        }
        if ( $('#leftbottom').css('display') == 'none' & $('#lefttop').css('display') == 'none' & $('#leftmiddle').css('display') == 'none' & $('#middletop').css('display') == 'block' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#leftbottom').css('display') == 'none' & e.pageX > 159 & e.pageY > 160 & e.pageX < 216 & e.pageY < 217 & (e.pageY > (-0.5*(e.pageX) + 269)) & (e.pageY < (-2*(e.pageX) +593)) ) {
                    $('#leftbottom').css("display","block");
                }
                if ( $('#leftbottom').css('display') == 'none' & e.pageX > 215 & e.pageY > 103 & e.pageX < 278 & e.pageY < 160 & (e.pageY < (-0.5*(e.pageX) + 269)) & (e.pageY > (-2*(e.pageX) +593)) ) {
                    $('#leftbottom').css("display","block");
                }
            });
        }

    function leftmiddle () {}
        if ( $('#leftmiddle').css('display') == 'none' & $('#lefttop').css('display') == 'none' & $('#leftbottom').css('display') == 'none' & $('#middletop').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#leftmiddle').css('display') == 'none' & e.pageX > 159 & (e.pageY > (0.5*(e.pageX) + 53)) & (e.pageY < (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","block");
                }
                if ( $('#leftmiddle').css('display') == 'none' & e.pageX > 215 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","block");
                }
            });
        }
        if ( $('#leftmiddle').css('display') == 'none' & $('#lefttop').css('display') == 'block' & $('#leftbottom').css('display') == 'block' & $('#middletop').css('display') == 'block' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#leftmiddle').css('display') == 'none' & e.pageX > 159 & (e.pageY > (0.5*(e.pageX) + 53)) & (e.pageY < (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","block");
                }
                if ( $('#leftmiddle').css('display') == 'none' & e.pageX > 215 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","block");
                }
            });
        }
        if ( $('#leftmiddle').css('display') == 'none' & $('#lefttop').css('display') == 'block' & $('#leftbottom').css('display') == 'none' & $('#middletop').css('display') == 'block' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#leftmiddle').css('display') == 'none' & e.pageX > 159 & (e.pageY > (0.5*(e.pageX) + 53)) & (e.pageY < (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","block");
                }
                if ( $('#leftmiddle').css('display') == 'none' & e.pageX > 215 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","block");
                }
            })
        }
        if ( $('#leftmiddle').css('display') == 'none' & $('#lefttop').css('display') == 'block' & $('#leftbottom').css('display') == 'block' & $('#middletop').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#leftmiddle').css('display') == 'none' & e.pageX > 159 & (e.pageY > (0.5*(e.pageX) + 53)) & (e.pageY < (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","block");
                }
                if ( $('#leftmiddle').css('display') == 'none' & e.pageX > 215 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","block");
                }
            });
        }
        if ( $('#leftmiddle').css('display') == 'none' & $('#lefttop').css('display') == 'block' & $('#leftbottom').css('display') == 'none' & $('#middletop').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#leftmiddle').css('display') == 'none' & e.pageX > 159 & (e.pageY > (0.5*(e.pageX) + 53)) & (e.pageY < (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","block");
                }
                if ( $('#leftmiddle').css('display') == 'none' & e.pageX > 215 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","block");
                }
            });
        }
        if ( $('#leftmiddle').css('display') == 'none' & $('#lefttop').css('display') == 'none' & $('#leftbottom').css('display') == 'block' & $('#middletop').css('display') == 'block' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#leftmiddle').css('display') == 'none' & e.pageX > 159 & (e.pageY > (0.5*(e.pageX) + 53)) & (e.pageY < (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","block");
                }
                if ( $('#leftmiddle').css('display') == 'none' & e.pageX > 215 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","block");
                }
            });
        }
        if ( $('#leftmiddle').css('display') == 'none' & $('#lefttop').css('display') == 'none' & $('#leftbottom').css('display') == 'block' & $('#middletop').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#leftmiddle').css('display') == 'none' & e.pageX > 159 & (e.pageY > (0.5*(e.pageX) + 53)) & (e.pageY < (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","block");
                }
                if ( $('#leftmiddle').css('display') == 'none' & e.pageX > 215 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","block");
                }
            });
        }
        if ( $('#leftmiddle').css('display') == 'none' & $('#lefttop').css('display') == 'none' & $('#leftbottom').css('display') == 'none' & $('#middletop').css('display') == 'block' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#leftmiddle').css('display') == 'none' & e.pageX > 159 & (e.pageY > (0.5*(e.pageX) + 53)) & (e.pageY < (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","block");
                }
                if ( $('#leftmiddle').css('display') == 'none' & e.pageX > 215 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","block");
                }
            });
        }






        if ( $('#middletop').css('display') == 'none' & $('#lefttop').css('display') == 'none' & $('#leftbottom').css('display') == 'none' & $('#leftmiddle').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#middletop').css('display') == 'none' & e.pageY > 103 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY < (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","block");
                }
                if ( $('#middletop').css('display') == 'none' & e.pageY < 217 & (e.pageY > (2*(e.pageX) - 271)) & (e.pageY > (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","block");
                }
            });
        }
        if ( $('#middletop').css('display') == 'none' & $('#lefttop').css('display') == 'block' & $('#leftbottom').css('display') == 'block' & $('#leftmiddle').css('display') == 'block' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#middletop').css('display') == 'none' & e.pageY > 103 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY < (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","block");
                }
                if ( $('#middletop').css('display') == 'none' & e.pageY < 217 & (e.pageY > (2*(e.pageX) - 271)) & (e.pageY > (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","block");
                }
            });
        }
        if ( $('#middletop').css('display') == 'none' & $('#lefttop').css('display') == 'block' & $('#leftbottom').css('display') == 'none' & $('#leftmiddle').css('display') == 'block' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#middletop').css('display') == 'none' & e.pageY > 103 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY < (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","block");
                }
                if ( $('#middletop').css('display') == 'none' & e.pageY < 217 & (e.pageY > (2*(e.pageX) - 271)) & (e.pageY > (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","block");
                }
            });
        }
        if ( $('#middletop').css('display') == 'none' & $('#lefttop').css('display') == 'block' & $('#leftbottom').css('display') == 'block' & $('#leftmiddle').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#middletop').css('display') == 'none' & e.pageY > 103 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY < (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","block");
                }
                if ( $('#middletop').css('display') == 'none' & e.pageY < 217 & (e.pageY > (2*(e.pageX) - 271)) & (e.pageY > (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","block");
                }
            });
        }
        if ( $('#middletop').css('display') == 'none' & $('#lefttop').css('display') == 'block' & $('#leftbottom').css('display') == 'none' & $('#leftmiddle').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#middletop').css('display') == 'none' & e.pageY > 103 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY < (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","block");
                }
                if ( $('#middletop').css('display') == 'none' & e.pageY < 217 & (e.pageY > (2*(e.pageX) - 271)) & (e.pageY > (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","block");
                }
            });
        }
        if ( $('#middletop').css('display') == 'none' & $('#lefttop').css('display') == 'none' & $('#leftbottom').css('display') == 'block' & $('#leftmiddle').css('display') == 'block' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#middletop').css('display') == 'none' & e.pageY > 103 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY < (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","block");
                }
                if ( $('#middletop').css('display') == 'none' & e.pageY < 217 & (e.pageY > (2*(e.pageX) - 271)) & (e.pageY > (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","block");
                }
            });
        }
        if ( $('#middletop').css('display') == 'none' & $('#lefttop').css('display') == 'none' & $('#leftbottom').css('display') == 'block' & $('#leftmiddle').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#middletop').css('display') == 'none' & e.pageY > 103 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY < (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","block");
                }
                if ( $('#middletop').css('display') == 'none' & e.pageY < 217 & (e.pageY > (2*(e.pageX) - 271)) & (e.pageY > (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","block");
                }
            });
        }
        if ( $('#middletop').css('display') == 'none' & $('#lefttop').css('display') == 'none' & $('#leftbottom').css('display') == 'none' & $('#leftmiddle').css('display') == 'block' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#middletop').css('display') == 'none' & e.pageY > 103 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY < (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","block");
                }
                if ( $('#middletop').css('display') == 'none' & e.pageY < 217 & (e.pageY > (2*(e.pageX) - 271)) & (e.pageY > (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","block");
                }
            });
        }
//make the bold lines reappear when clicked if they disappeared
        if ( $('#lefttop').css('display') == 'block' & $('#leftbottom').css('display') == 'none' & $('#leftmiddle').css('display') == 'none' & $('#middletop').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#lefttop').css('display') == 'block' & e.pageX > 159 & e.pageY > 103 & e.pageX < 216 & e.pageY < 160 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (2*(e.pageX) - 271)) ) {
                    $('#lefttop').css("display","none");
                }
                if ( $('#lefttop').css('display') == 'block' & e.pageX > 215 & e.pageY > 159 & e.pageX < 278 & e.pageY < 216 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY > (0.5*(e.pageX) + 53)) ) {
                    $('#lefttop').css("display","none");
                }
            });
        }
        if ( $('#lefttop').css('display') == 'block' & $('#leftbottom').css('display') == 'block' & $('#leftmiddle').css('display') == 'none' & $('#middletop').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#lefttop').css('display') == 'block' & e.pageX > 159 & e.pageY > 103 & e.pageX < 216 & e.pageY < 160 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (2*(e.pageX) - 271)) ) {
                    $('#lefttop').css("display","none");
                }
                if ( $('#lefttop').css('display') == 'block' & e.pageX > 215 & e.pageY > 159 & e.pageX < 278 & e.pageY < 216 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY > (0.5*(e.pageX) + 53)) ) {
                    $('#lefttop').css("display","none");
                }
            });
        }
        if ( $('#lefttop').css('display') == 'block' & $('#leftbottom').css('display') == 'block' & $('#leftmiddle').css('display') == 'block' & $('#middletop').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#lefttop').css('display') == 'block' & e.pageX > 159 & e.pageY > 103 & e.pageX < 216 & e.pageY < 160 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (2*(e.pageX) - 271)) ) {
                    $('#lefttop').css("display","none");
                }
                if ( $('#lefttop').css('display') == 'block' & e.pageX > 215 & e.pageY > 159 & e.pageX < 278 & e.pageY < 216 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY > (0.5*(e.pageX) + 53)) ) {
                    $('#lefttop').css("display","none");
                }
            });
        }
        if ( $('#lefttop').css('display') == 'block' & $('#leftbottom').css('display') == 'block' & $('#leftmiddle').css('display') == 'none' & $('#middletop').css('display') == 'block' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#lefttop').css('display') == 'block' & e.pageX > 159 & e.pageY > 103 & e.pageX < 216 & e.pageY < 160 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (2*(e.pageX) - 271)) ) {
                    $('#lefttop').css("display","none");
                }
                if ( $('#lefttop').css('display') == 'block' & e.pageX > 215 & e.pageY > 159 & e.pageX < 278 & e.pageY < 216 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY > (0.5*(e.pageX) + 53)) ) {
                    $('#lefttop').css("display","none");
                }
            });
        }
        if ( $('#lefttop').css('display') == 'block' & $('#leftbottom').css('display') == 'block' & $('#leftmiddle').css('display') == 'block' & $('#middletop').css('display') == 'block' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#lefttop').css('display') == 'block' & e.pageX > 159 & e.pageY > 103 & e.pageX < 216 & e.pageY < 160 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (2*(e.pageX) - 271)) ) {
                    $('#lefttop').css("display","none");
                }
                if ( $('#lefttop').css('display') == 'block' & e.pageX > 215 & e.pageY > 159 & e.pageX < 278 & e.pageY < 216 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY > (0.5*(e.pageX) + 53)) ) {
                    $('#lefttop').css("display","none");
                }
            });
        }
        if ( $('#lefttop').css('display') == 'block' & $('#leftbottom').css('display') == 'none' & $('#leftmiddle').css('display') == 'block' & $('#middletop').css('display') == 'block' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#lefttop').css('display') == 'block' & e.pageX > 159 & e.pageY > 103 & e.pageX < 216 & e.pageY < 160 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (2*(e.pageX) - 271)) ) {
                    $('#lefttop').css("display","none");
                }
                if ( $('#lefttop').css('display') == 'block' & e.pageX > 215 & e.pageY > 159 & e.pageX < 278 & e.pageY < 216 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY > (0.5*(e.pageX) + 53)) ) {
                    $('#lefttop').css("display","none");
                }
            });
        }
        if ( $('#lefttop').css('display') == 'block' & $('#leftbottom').css('display') == 'none' & $('#leftmiddle').css('display') == 'block' & $('#middletop').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#lefttop').css('display') == 'block' & e.pageX > 159 & e.pageY > 103 & e.pageX < 216 & e.pageY < 160 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (2*(e.pageX) - 271)) ) {
                    $('#lefttop').css("display","none");
                }
                if ( $('#lefttop').css('display') == 'block' & e.pageX > 215 & e.pageY > 159 & e.pageX < 278 & e.pageY < 216 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY > (0.5*(e.pageX) + 53)) ) {
                    $('#lefttop').css("display","none");
                }
            });
        }
        if ( $('#lefttop').css('display') == 'block' & $('#leftbottom').css('display') == 'none' & $('#leftmiddle').css('display') == 'none' & $('#middletop').css('display') == 'block' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#lefttop').css('display') == 'block' & e.pageX > 159 & e.pageY > 103 & e.pageX < 216 & e.pageY < 160 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (2*(e.pageX) - 271)) ) {
                    $('#lefttop').css("display","none");
                }
                if ( $('#lefttop').css('display') == 'block' & e.pageX > 215 & e.pageY > 159 & e.pageX < 278 & e.pageY < 216 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY > (0.5*(e.pageX) + 53)) ) {
                    $('#lefttop').css("display","none");
                }
            });
        }
        
        if ( $('#leftbottom').css('display') == 'block' & $('#lefttop').css('display') == 'none' & $('#leftmiddle').css('display') == 'none' & $('#middletop').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#leftbottom').css('display') == 'block' & e.pageX > 159 & e.pageY > 160 & e.pageX < 216 & e.pageY < 217 & (e.pageY > (-0.5*(e.pageX) + 269)) & (e.pageY < (-2*(e.pageX) +593)) ) {
                    $('#leftbottom').css("display","none");
                }
                if ( $('#leftbottom').css('display') == 'block' & e.pageX > 215 & e.pageY > 103 & e.pageX < 278 & e.pageY < 160 & (e.pageY < (-0.5*(e.pageX) + 269)) & (e.pageY > (-2*(e.pageX) +593)) ) {
                    $('#leftbottom').css("display","none");
                }
            });
        }
        if ( $('#leftbottom').css('display') == 'block' & $('#lefttop').css('display') == 'block' & $('#leftmiddle').css('display') == 'block' & $('#middletop').css('display') == 'block' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#leftbottom').css('display') == 'block' & e.pageX > 159 & e.pageY > 160 & e.pageX < 216 & e.pageY < 217 & (e.pageY > (-0.5*(e.pageX) + 269)) & (e.pageY < (-2*(e.pageX) +593)) ) {
                    $('#leftbottom').css("display","none");
                }
                if ( $('#leftbottom').css('display') == 'block' & e.pageX > 215 & e.pageY > 103 & e.pageX < 278 & e.pageY < 160 & (e.pageY < (-0.5*(e.pageX) + 269)) & (e.pageY > (-2*(e.pageX) +593)) ) {
                    $('#leftbottom').css("display","none");
                }
            });
        }
        if ( $('#leftbottom').css('display') == 'block' & $('#lefttop').css('display') == 'block' & $('#leftmiddle').css('display') == 'none' & $('#middletop').css('display') == 'block' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#leftbottom').css('display') == 'block' & e.pageX > 159 & e.pageY > 160 & e.pageX < 216 & e.pageY < 217 & (e.pageY > (-0.5*(e.pageX) + 269)) & (e.pageY < (-2*(e.pageX) +593)) ) {
                    $('#leftbottom').css("display","none");
                }
                if ( $('#leftbottom').css('display') == 'block' & e.pageX > 215 & e.pageY > 103 & e.pageX < 278 & e.pageY < 160 & (e.pageY < (-0.5*(e.pageX) + 269)) & (e.pageY > (-2*(e.pageX) +593)) ) {
                    $('#leftbottom').css("display","none");
                }
            });
        }
        if ( $('#leftbottom').css('display') == 'block' & $('#lefttop').css('display') == 'block' & $('#leftmiddle').css('display') == 'block' & $('#middletop').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#leftbottom').css('display') == 'block' & e.pageX > 159 & e.pageY > 160 & e.pageX < 216 & e.pageY < 217 & (e.pageY > (-0.5*(e.pageX) + 269)) & (e.pageY < (-2*(e.pageX) +593)) ) {
                    $('#leftbottom').css("display","none");
                }
                if ( $('#leftbottom').css('display') == 'block' & e.pageX > 215 & e.pageY > 103 & e.pageX < 278 & e.pageY < 160 & (e.pageY < (-0.5*(e.pageX) + 269)) & (e.pageY > (-2*(e.pageX) +593)) ) {
                    $('#leftbottom').css("display","none");
                }
            });
        }
        if ( $('#leftbottom').css('display') == 'block' & $('#lefttop').css('display') == 'block' & $('#leftmiddle').css('display') == 'none' & $('#middletop').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#leftbottom').css('display') == 'block' & e.pageX > 159 & e.pageY > 160 & e.pageX < 216 & e.pageY < 217 & (e.pageY > (-0.5*(e.pageX) + 269)) & (e.pageY < (-2*(e.pageX) +593)) ) {
                    $('#leftbottom').css("display","none");
                }
                if ( $('#leftbottom').css('display') == 'block' & e.pageX > 215 & e.pageY > 103 & e.pageX < 278 & e.pageY < 160 & (e.pageY < (-0.5*(e.pageX) + 269)) & (e.pageY > (-2*(e.pageX) +593)) ) {
                    $('#leftbottom').css("display","none");
                }
            });
        }
        if ( $('#leftbottom').css('display') == 'block' & $('#lefttop').css('display') == 'none' & $('#leftmiddle').css('display') == 'block' & $('#middletop').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#leftbottom').css('display') == 'block' & e.pageX > 159 & e.pageY > 160 & e.pageX < 216 & e.pageY < 217 & (e.pageY > (-0.5*(e.pageX) + 269)) & (e.pageY < (-2*(e.pageX) +593)) ) {
                    $('#leftbottom').css("display","none");
                }
                if ( $('#leftbottom').css('display') == 'block' & e.pageX > 215 & e.pageY > 103 & e.pageX < 278 & e.pageY < 160 & (e.pageY < (-0.5*(e.pageX) + 269)) & (e.pageY > (-2*(e.pageX) +593)) ) {
                    $('#leftbottom').css("display","none");
                }
            });
        }
        if ( $('#leftbottom').css('display') == 'block' & $('#lefttop').css('display') == 'none' & $('#leftmiddle').css('display') == 'none' & $('#middletop').css('display') == 'block' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#leftbottom').css('display') == 'block' & e.pageX > 159 & e.pageY > 160 & e.pageX < 216 & e.pageY < 217 & (e.pageY > (-0.5*(e.pageX) + 269)) & (e.pageY < (-2*(e.pageX) +593)) ) {
                    $('#leftbottom').css("display","none");
                }
                if ( $('#leftbottom').css('display') == 'block' & e.pageX > 215 & e.pageY > 103 & e.pageX < 278 & e.pageY < 160 & (e.pageY < (-0.5*(e.pageX) + 269)) & (e.pageY > (-2*(e.pageX) +593)) ) {
                    $('#leftbottom').css("display","none");
                }
            });
        }

        if ( $('#leftmiddle').css('display') == 'block' & $('#lefttop').css('display') == 'none' & $('#leftbottom').css('display') == 'none' & $('#middletop').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#leftmiddle').css('display') == 'block' & e.pageX > 159 & (e.pageY > (0.5*(e.pageX) + 53)) & (e.pageY < (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","none");
                }
                if ( $('#leftmiddle').css('display') == 'block' & e.pageX > 215 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","none");
                }
            });
        }
        if ( $('#leftmiddle').css('display') == 'block' & $('#lefttop').css('display') == 'block' & $('#leftbottom').css('display') == 'block' & $('#middletop').css('display') == 'block' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#leftmiddle').css('display') == 'block' & e.pageX > 159 & (e.pageY > (0.5*(e.pageX) + 53)) & (e.pageY < (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","none");
                }
                if ( $('#leftmiddle').css('display') == 'block' & e.pageX > 215 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","none");
                }
            });
        }
        if ( $('#leftmiddle').css('display') == 'block' & $('#lefttop').css('display') == 'block' & $('#leftbottom').css('display') == 'none' & $('#middletop').css('display') == 'block' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#leftmiddle').css('display') == 'block' & e.pageX > 159 & (e.pageY > (0.5*(e.pageX) + 53)) & (e.pageY < (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","none");
                }
                if ( $('#leftmiddle').css('display') == 'block' & e.pageX > 215 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","none");
                }
            });
        }
        if ( $('#leftmiddle').css('display') == 'block' & $('#lefttop').css('display') == 'block' & $('#leftbottom').css('display') == 'block' & $('#middletop').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#leftmiddle').css('display') == 'block' & e.pageX > 159 & (e.pageY > (0.5*(e.pageX) + 53)) & (e.pageY < (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","none");
                }
                if ( $('#leftmiddle').css('display') == 'block' & e.pageX > 215 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","none");
                }
            });
        }
        if ( $('#leftmiddle').css('display') == 'block' & $('#lefttop').css('display') == 'block' & $('#leftbottom').css('display') == 'none' & $('#middletop').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#leftmiddle').css('display') == 'block' & e.pageX > 159 & (e.pageY > (0.5*(e.pageX) + 53)) & (e.pageY < (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","none");
                }
                if ( $('#leftmiddle').css('display') == 'block' & e.pageX > 215 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","none");
                }
            });
        }
        if ( $('#leftmiddle').css('display') == 'block' & $('#lefttop').css('display') == 'none' & $('#leftbottom').css('display') == 'block' & $('#middletop').css('display') == 'block' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#leftmiddle').css('display') == 'block' & e.pageX > 159 & (e.pageY > (0.5*(e.pageX) + 53)) & (e.pageY < (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","none");
                }
                if ( $('#leftmiddle').css('display') == 'block' & e.pageX > 215 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","none");
                }
            });
        }
        if ( $('#leftmiddle').css('display') == 'block' & $('#lefttop').css('display') == 'none' & $('#leftbottom').css('display') == 'block' & $('#middletop').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#leftmiddle').css('display') == 'block' & e.pageX > 159 & (e.pageY > (0.5*(e.pageX) + 53)) & (e.pageY < (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","none");
                }
                if ( $('#leftmiddle').css('display') == 'block' & e.pageX > 215 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","none");
                }
            });
        }
        if ( $('#leftmiddle').css('display') == 'block' & $('#lefttop').css('display') == 'none' & $('#leftbottom').css('display') == 'none' & $('#middletop').css('display') == 'block' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#leftmiddle').css('display') == 'block' & e.pageX > 159 & (e.pageY > (0.5*(e.pageX) + 53)) & (e.pageY < (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","none");
                }
                if ( $('#leftmiddle').css('display') == 'block' & e.pageX > 215 & (e.pageY < (0.5*(e.pageX) + 53)) & (e.pageY > (-0.5*(e.pageX) + 269)) ) {
                    $('#leftmiddle').css("display","none");
                }
            });
        }

        if ( $('#middletop').css('display') == 'block' & $('#lefttop').css('display') == 'none' & $('#leftbottom').css('display') == 'none' & $('#leftmiddle').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {

                if ( $('#middletop').css('display') == 'block' & e.pageY > 103 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY < (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","none");
                }
                if ( $('#middletop').css('display') == 'block' & e.pageY < 217 & (e.pageY > (2*(e.pageX) - 271)) & (e.pageY > (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","none");
                }
            });
        }
        if ( $('#middletop').css('display') == 'block' & $('#lefttop').css('display') == 'block' & $('#leftbottom').css('display') == 'block' & $('#leftmiddle').css('display') == 'block' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#middletop').css('display') == 'block' & e.pageY > 103 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY < (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","none");
                }
                if ( $('#middletop').css('display') == 'block' & e.pageY < 217 & (e.pageY > (2*(e.pageX) - 271)) & (e.pageY > (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","none");
                }
            });
        }
        if ( $('#middletop').css('display') == 'block' & $('#lefttop').css('display') == 'block' & $('#leftbottom').css('display') == 'none' & $('#leftmiddle').css('display') == 'block' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#middletop').css('display') == 'block' & e.pageY > 103 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY < (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","none");
                }
                if ( $('#middletop').css('display') == 'block' & e.pageY < 217 & (e.pageY > (2*(e.pageX) - 271)) & (e.pageY > (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","none");
                }
            });
        }
        if ( $('#middletop').css('display') == 'block' & $('#lefttop').css('display') == 'block' & $('#leftbottom').css('display') == 'block' & $('#leftmiddle').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#middletop').css('display') == 'block' & e.pageY > 103 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY < (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","none");
                }
                if ( $('#middletop').css('display') == 'block' & e.pageY < 217 & (e.pageY > (2*(e.pageX) - 271)) & (e.pageY > (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","none");
                }
            });
        }
        if ( $('#middletop').css('display') == 'block' & $('#lefttop').css('display') == 'block' & $('#leftbottom').css('display') == 'none' & $('#leftmiddle').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#middletop').css('display') == 'block' & e.pageY > 103 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY < (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","none");
                }
                if ( $('#middletop').css('display') == 'block' & e.pageY < 217 & (e.pageY > (2*(e.pageX) - 271)) & (e.pageY > (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","none");
                }
            });
        }
        if ( $('#middletop').css('display') == 'block' & $('#lefttop').css('display') == 'none' & $('#leftbottom').css('display') == 'block' & $('#leftmiddle').css('display') == 'block' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#middletop').css('display') == 'block' & e.pageY > 103 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY < (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","none");
                }
                if ( $('#middletop').css('display') == 'block' & e.pageY < 217 & (e.pageY > (2*(e.pageX) - 271)) & (e.pageY > (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","none");
                }
            });
        }
        if ( $('#middletop').css('display') == 'block' & $('#lefttop').css('display') == 'none' & $('#leftbottom').css('display') == 'block' & $('#leftmiddle').css('display') == 'none' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#middletop').css('display') == 'block' & e.pageY > 103 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY < (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","none");
                }
                if ( $('#middletop').css('display') == 'block' & e.pageY < 217 & (e.pageY > (2*(e.pageX) - 271)) & (e.pageY > (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","none");
                }
            });
        }
        if ( $('#middletop').css('display') == 'block' & $('#lefttop').css('display') == 'none' & $('#leftbottom').css('display') == 'none' & $('#leftmiddle').css('display') == 'block' ) {
            $('#MirrorsPic, #lefttop, #leftbottom, #leftmiddle, #middletop').mousedown(function(e) {
                if ( $('#middletop').css('display') == 'block' & e.pageY > 103 & (e.pageY < (2*(e.pageX) - 271)) & (e.pageY < (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","none");
                }
                if ( $('#middletop').css('display') == 'block' & e.pageY < 217 & (e.pageY > (2*(e.pageX) - 271)) & (e.pageY > (-2*(e.pageX) + 593)) ) {
                    $('#middletop').css("display","none");
                }
            });
        }
    });
    $('#okMirrors').click(function(){
        $('#Mirrors').hide();
    });
    $('#noneMirrors').click(function(){
        $('#Mirrors').hide();
        $('#lefttop, #leftbottom, #leftmiddle, #middletop').hide();
    });
    
    /****************/
    /* End Dropdown */
    /****************/

    /***********************/
    /* Select fill pattern */
    /***********************/


});