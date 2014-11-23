/**
 * Floodfill - Linear Floodfill with tolerance in plain Javascript.
 * 
 * Autor: Markus Ritberger
 * Version: 1.0.1 (2012-04-16)
 *      
 * Examples at: http://demos.ritberger.at/floodfill
 * 
 * licensed under MIT license:
 * 
 * Copyright (c) 2012 Markus Ritberger
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in 
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
 * THE SOFTWARE.
 **/

function floodfill_hexToR(h) {
    return parseInt((floodfill_cutHex(h)).substring(0,2),16)
}
function floodfill_hexToG(h) {
    return parseInt((floodfill_cutHex(h)).substring(2,4),16)
}
function floodfill_hexToB(h) {
    return parseInt((floodfill_cutHex(h)).substring(4,6),16)
}
function floodfill_cutHex(h) {
    return (h.charAt(0)=="#") ? h.substring(1,7):h
}

function floodfill_matchTolerance(pixelPos,color,tolerance){
    var rMax = startR + (startR * (tolerance / 100));
    var gMax = startG + (startG * (tolerance / 100));
    var bMax = startB + (startB * (tolerance / 100));

    var rMin = startR - (startR * (tolerance / 100));
    var gMin = startG - (startG * (tolerance / 100));
    var bMin = startB - (startB * (tolerance / 100));
    
    var r = imageData.data[pixelPos];	
    var g = imageData.data[pixelPos+1];	
    var b = imageData.data[pixelPos+2];
  
    return ((
        (r >= rMin && r <= rMax) 
        && (g >= gMin && g <= gMax) 
        && (b >= bMin && b <= bMax)
        )
        && !(r == floodfill_hexToR(color) 
        && g == floodfill_hexToG(color) 
        && b == floodfill_hexToB(color))
        );
}

function floodfill_colorPixel(pixelPos,color){
  imageData.data[pixelPos] = floodfill_hexToR(color);
  imageData.data[pixelPos+1] = floodfill_hexToG(color);
  imageData.data[pixelPos+2] = floodfill_hexToB(color);
  imageData.data[pixelPos+3] = 255;
}

function floodFill(x,y, context, color, tolerance){
   pixelStack = [[x,y]];
   width = context.canvas.width;
   height = context.canvas.height;
   pixelPos = (y*width + x) * 4;
   imageData =  context.getImageData(0, 0, width, height);
   startR = imageData.data[pixelPos];
   startG = imageData.data[pixelPos+1];
   startB = imageData.data[pixelPos+2];
   console.log(startR, startG, startB);
   while(pixelStack.length){
      newPos = pixelStack.pop();
      x = newPos[0];
      y = newPos[1];
      pixelPos = (y*width + x) * 4;
      while(y-- >= 0 && floodfill_matchTolerance(pixelPos,color,tolerance)){
        pixelPos -= width * 4;
      }
      pixelPos += width * 4;
      ++y;
      reachLeft = false;
      reachRight = false;
      while(y++ < height-1 && floodfill_matchTolerance(pixelPos,color,tolerance)){
        floodfill_colorPixel(pixelPos,color);
        if(x > 0){
          if(floodfill_matchTolerance(pixelPos - 4,color,tolerance)) {
            if(!reachLeft){
              pixelStack.push([x - 1, y]);
              reachLeft = true;
            }
          }
          else if(reachLeft){
            reachLeft = false;
          }
        }
        if(x < width-1){
          if(floodfill_matchTolerance(pixelPos + 4,color,tolerance)){
            if(!reachRight){
              pixelStack.push([x + 1, y]);
              reachRight = true;
            }
          }
          else if(floodfill_matchTolerance(pixelPos + 4 -(width *4),color,tolerance)) {
            if(!reachLeft){
              pixelStack.push([x + 1, y - 1]);
              reachLeft = true;
            }
          } 
          else if(reachRight){
            reachRight = false;
          }
        }
        pixelPos += width * 4;
      }
    }
    context.putImageData(imageData, 0, 0);
}