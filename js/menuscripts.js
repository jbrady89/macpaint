$(document).ready(function(){

  /*** Items in file dropdown ***/

  // new 
  $('#newcanvas').mouseup(function(){
    setTimeout(restore, 500);
    showtable();
    $('#closecanvastable').mouseup(function(){
      hideContents();
    });
  });
  function restore(){
    $("#contents").show().addClass('visible1').removeClass('hidden');
    $("#saveClose").hide();
    $(".rowlines").show();
    $("#newcanvas, #openfile").removeClass('active').addClass('inactive');
    $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin, #undo, #pasteItem, #menu_sCut, #menu_intro, #showPage').removeClass('inactive');
  }
  function showtable(){
    $("#closecanvastable").show();

  }
  function hideContents(){
    $('#contents').hide().addClass('hidden').removeClass('visible');
  }
  $('#myCanvas').mousedown(function(){
    $('#newcanvas').mouseup(function(){
      setTimeout(restore, 500);
      showtable();
      $('#closecanvastable').mouseup(function(){
        hideContents();
        $('#overlay').hide();
      });
    });
  });

  /*function restore(){
    $("#contents").show().addClass('visible1').removeClass('hidden');
    $("#saveClose").css('display','none');
    $(".rowlines").css('display','block');
    $("#newcanvas, #openfile").removeClass('active').addClass('inactive');
    $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin').removeClass('inactive');
  }
  function showtable(){
    $("#closecanvastable").show();
    
  }
  function hideContents(){
    $('#contents').hide().addClass('hidden').removeClass('visible');
  }*/

  ////////////////////////////////////////////close canvas after 'no'
  var canvas = $("#myCanvas");
  var context = canvas.get(0).getContext("2d");
  $('#noSave').mousedown(function(){
    $('#noSave').css({'background':'black','color':'white'});
  });
  $('#noSave').mouseup(function(){
    $('#closecanvastable').removeClass('hidden');
    $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin').addClass('inactive');
    $('#noSave').css({'background':'white','color':'black'});
    clearCanvas(context);
    $('#checkbox, #contents, #saveClose').css('display','none');
    $('#contents').addClass('hidden').removeClass('visible');
    $('.rowlines').show();
    $('#newcanvas, #openfile').removeClass('inactive').addClass('active');
    $('#overlay').hide();
  });

  ////////////////////////////////////////////Quit menu item
  $('#myCanvas').mousedown(function(){
    console.log('true');
    $('#contents').removeClass('visible1');
    $('#exitMP').mouseup(function(){

      if(($('#contents').hasClass('visible1')) || ($('#contents').hasClass('hidden'))){
        setTimeout(hideContentsSave, 500);
      }
      else {
        setTimeout(keepCanvasSave,500);
        setTimeout(showquitBox,500);
        setTimeout(hidelinesSave,500);
        setTimeout(keepOpenSave,500);
      }
    });
  });


////////////////////////////////////////////brings up save box
    function hideContentsSave (){
      $('.content').hide();
      $("#newcanvas, #openfile").removeClass('inactive').addClass('active');
      $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin').addClass('inactive');
    }
    function showquitBox(){
      $('#quitClose').show().css('z-index','10005');
      $('#overlay').show();
    }
  //hides 'untitled' bar lines
    function hidelinesSave(){
      $('.rowlines, #closecanvastable').hide();
    }
  //keeps canvas open after table8 mouseup
    function keepCanvasSave(){
    $('#contents').css('display','block').removeClass('hidden');
    }
    function keepOpenSave(){
      $('.content').show();
    }

  ////////////////////////////////////////////"Quit" pop-up No
  var canvas = $("#myCanvas");
  var context = canvas.get(0).getContext("2d");

  $('#closecanvastable').mousedown(function(){
    $('#contents').show().removeClass('hidden').addClass('visible');
  });
  $('#noQuit').mousedown(function(){
    $('#noQuit').css({'background':'black','color':'white'});
  });
  $('#noQuit').mouseup(function(){
    if ($('#saveEject').hasClass('inactive')) {
      $('#overlay').show();
      $('#discPopup').show().css('z-index','10005').click(function(){
        $(this).hide().css('z-index','');
        $('#overlay').hide();
        $('#saveEject').removeClass('inactive');
      });
      $('#contents, .content').show();
      $('#contents').removeClass('hidden').addClass('visible');
      $('#noQuit').css({'background':'white','color':'black'});
      $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin').removeClass('inactive').addClass('active');
      $('#newcanvas, #openfile').removeClass('active').addClass('inactive');
      $('#quitClose').hide();
      $('#file').css({'background':'white','color':'black'});
      $('#fileblackmenuside').hide();
      $('#closecanvastable, .rowlines').show();
    }
    else {
      $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin').removeClass('active').addClass('inactive');
      $('#noQuit').css({'background':'white','color':'black'});
      clearCanvas(context);
      $('#checkbox, #contents, #quitClose, .content').hide();
      $('#contents').removeClass('visible').addClass('hidden');
      $('.rowlines').show();
      $('#overlay').hide();
      $('#quitClose').css('z-index', '');
      $('#newcanvas, #openfile').removeClass('inactive').addClass('active');
    }
  });
  function clearCanvas(context){
    context.fillStyle = 'white';
    context.beginPath();
    context.rect(0, 0, canvas.width(), canvas.height());
    context.closePath();
    context.fill();
    context.fillStyle = 'black';
  }
  /*function NoclearCanvas(){
      context.clearRect(0, 0, canvas.width(), canvas.height());
  }*/

////////////////////////////////////////////clicking 'cancel' on 'quit'
  $('#cancelQuit').mousedown(function(){
    $('#cancelQuit').css({'background':'black','color':'white'});
    $('#cancelQuit').hover(
      function(){$(this).css({'background':'black','color':'white'})}, 
      function(){$(this).css({'background':'white','color':'black'});
    });
  });
  $(document).mouseup(function(){
    $('#cancelQuit').unbind('hover');
  });
  $('#cancelQuit').mouseup(function(){
    showtableCancel();
    $('#closecanvastable').removeClass('hidden');
    $('#cancelQuit').css({'background':'white','color':'black'})
    $('#quitClose').hide().css('z-index','');;
    $('.rowlines').show();
    $('#overlay').hide();
  });
  function showtableCancel(){
    $("#closecanvastable").show();
    $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin').removeClass('inactive').addClass('active');
    $('#newcanvas, #openfile').removeClass('active').addClass('inactive');
  }
////////////////////////////////////////////clicking 'yes' on 'quit'
  $('#yesQuit').mousedown(function(){
    $('#yesQuit').css({'background':'black','color':'white'});
    $('#yesQuit').hover(
      function(){$(this).css({'background':'black','color':'white'})}, 
      function(){$(this).css({'background':'white','color':'black'});
    });
  });
  $(document).mouseup(function(){
    $('#yesQuit').unbind('hover');
  });
  $('#yesQuit').mouseup(function(){
    //showtableYes();
    $('#yesQuit').css({'background':'white','color':'black'});
    $('#quitClose').hide().css('z-index','');
  });
  function showtableYes(){
    $("#closecanvastable").show();
  }

  $('#savefile, #saveAs').mouseup(function(){
    if (! ($(this).hasClass('inactive'))) {
      $('#overlay').show();
      setTimeout(saveFile,500);
    }
  });
  function saveFile(){
    $('#overlay').show();
    $('#saveIt, #saveDrive').addClass('inactive');//grays out button
    $(this).css({'background':'white','color':'black'});//sets colors of 1st save button back to original state
    $(document).unbind('mousedown');//disables preventDefault() in order to eneable typing
      $('#saveCancel').mousedown(function(){
        $('#saveCancel').css({'background':'black','color':'white'});//invert colors
        $('#saveCancel').hover(//intialize hover
          function(){$(this).css({'background':'black','color':'white'})},//inverse while mousein
          function(){$(this).css({'background':'white','color':'black'});//original when mouseout
        });
        $(document).mouseup(function(){
            $('#saveCancel').unbind('hover');//prevents hover event inside of button if mouseup outside of it
        });
        $('#saveCancel').mouseup(function(){
          $('#overlay').hide();
          $('#savedocumentdiv').hide();//hide 2nd popup
          $('.rowlines, #closecanvastable').show();
          $('#saveCancel').css({'background':'white','color':'black'});
          $('#yesClose, #yesSave').css({'background':'white','color':'black'});
          $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin').removeClass('inactive').addClass('active');
          $("#newcanvas, #openfile").removeClass('active').addClass('inactive');
        });
    });
    $('#saveClose').hide();//hides initial popup
    $('.saveDivs, #filenametext').show().css('z-index','10002');//shows new popup
    $('#savedocumentdiv, #savedocument').show().addClass('formshowing').css('z-index','10001');//shows form
    $('#typed').focus().css('cursor','default').css('font-family','Chicago'); //click inside text box to start the blinking cursor
    //http://stackoverflow.com/questions/2132172/disable-text-highlighting-on-double-click-in-jquery
    //used this to disable highlighting of text when dblclicking inside the save-file text box
    
    /*$.extend($.fn.disableTextSelect = function() {
        return this.each(function(){
            if($.browser.mozilla){//Firefox
                $(this).css('MozUserSelect','none');
            }else if($.browser.msie){//IE
                $(this).bind('selectstart',function(){return false;});
            }else{//Opera, etc.
                $(this).mousedown(function(){return false;});
            }
        });
    });*/
    //$('input').disableTextSelect();//No text selection on input elements(text box)
    $('#typed').keyup(function() {//grays/ungrays form save button depending on input length
      var nameString = $(this).val().length; 
      console.log(nameString);
      if(nameString && !$('#saveEject').hasClass('inactive'))$('#saveIt').removeClass('inactive').addClass('saveActive');
      else {
        $('#saveIt').removeClass('saveActive').addClass('inactive');
        $('#saveYes').unbind();
      }
      if($('#saveIt').hasClass('saveActive')){//if button isn't grayed out
        $('#saveYes').mousedown(function(){//when 2nd save button pressed..
          $('#saveYes').css({'background':'black','color':'white'});//invert colors
          $('#saveYes').hover(//intialize hover
            function(){$(this).css({'background':'black','color':'white'})},//inverse while mousein
            function(){$(this).css({'background':'white','color':'black'});//original when mouseout
          });
          $(document).mouseup(function(){
            $('#saveYes').unbind('hover');//prevent hover from firing after mouseup outside of button
          });
          $(this).mouseup(function(){//button released..
            $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin').removeClass('inactive').addClass('active');
            $("#newcanvas, #openfile").removeClass('active').addClass('inactive');
            $('#saveYes, #yesClose, #yesSave').css({'background':'white','color':'black'})//original colors
            var fileName = $("#typed").val();//value of the text field
            $('#savedocumentdiv').hide();//hide 2nd popup
            $('#overlay').hide();
            $('.rowlines, #closecanvastable').show();//hide window bar lines & small box
            $('#filename').html('<span>'+fileName+'</span>');//replace 'untitled' with new file name
            var nameInPixels = $('#filename').find('span').width();//find length of new name in pixels
            var padSize = (414 - (nameInPixels + 6))/2;//calculate left and right padding
            $('#filename').css('left', padSize + 'px')//centers the new filename based on padding
              .css('width', (nameInPixels +6) + 'px')
              .css({'backgroud':'white','color':'black'}).css('text-align','center');
            $(document).mousedown(function(event){//rebinds it
              event.preventDefault();
            });
          });
        });
      }
        //else if ($('#saveIt').hasClass('inactive')){
          //  $('#saveYes').unbind();
        //}
    });
  }

////////////////////////////////////////////Clicking 'no' on 'quit' popup
  $('#noQuit').mousedown(function(){
    $('#noQuit').css({'background':'black','color':'white'});
    $('#noQuit').hover(
      function(){$(this).css({'background':'black','color':'white'})}, 
      function(){$(this).css({'background':'white','color':'black'});
    });
    $(document).mouseup(function(){
      $('#noQuit').unbind('hover');
    });
  });
  $('#noQuit').mouseup(function(){
    $('#noQuit').unbind('hover');
  });

////////////////////////////////////////////Clicking Close after drawing

  $('#myCanvas').mousedown(function(){
    $('#closefile').mouseup(function(){
      $('#overlay').show();
      setTimeout(keepCanvasClose,500);
      setTimeout(showquitBoxClose,500);
      setTimeout(hidelinesClose,500);
    });
  });
//brings up save box
  function showquitBoxClose(){
    $('#cl0sefile').show().css('z-index', '10001');
  }
//hides 'untitled' bar lines
  function hidelinesClose(){
    $('.rowlines, #closecanvastable').hide();
  }
//keeps canvas open after table8 mouseup
  function keepCanvasClose(){
    $('#contents').show().removeClass('hidden').addClass('visible');
  }

////////////////////////////////////////////Clicking Close prior to any drawing
  $('#closefile').mouseup(function(){
    setTimeout(hideContentsNoDraw,500);
  });
  function hideContentsNoDraw (){
    $('#cl0sefile').hide();
    $('#contents').css('display','none').removeClass('visible').addClass('hidden');
    $("#newcanvas, #openfile").removeClass('inactive').addClass('active');
    $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin, #editdrop li, #menu_intro, #showPage, #menu_sCut').addClass('inactive');
  }

  ////////////////////////////////////////////Cancel Closing
  $('#cancelClose').mousedown(function(){
    $('#cancelClose').css({'background':'black','color':'white'});
    $('#cancelClose').hover(
      function(){$(this).css({'background':'black','color':'white'})}, 
      function(){$(this).css({'background':'white','color':'black'});
    });
  });
  $(document).mouseup(function(){
    $('#cancelClose').unbind('hover');
  });
  $('#cancelClose').mouseup(function(){
    $("#closecanvastable").show();
    $('#cancelClose').css({'background':'white','color':'black'})
    $('#cl0sefile, #overlay').hide();
    $('.rowlines').show();
    $('#newcanvas, #openfile').removeClass('active').addClass('inactive');
    $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin').removeClass('inactive').addClass('active');
  });
  /*function Cancelshowtable(){
    $("#closecanvastable").show();
  }*/

////////////////////////////////////////////No save before closing
  $('#noClose, #yesClose').mousedown(function(){
    $(this).css({'background':'black','color':'white'});
    $(this).hover(
      function(){$(this).css({'background':'black','color':'white'})}, 
      function(){$(this).css({'background':'white','color':'black'});
    });
    $(document).mouseup(function(){
      $('#noClose, #yesClose').unbind('hover');
    });
  });
  $('#noClose, #yesClose').mouseup(function(){
    $(this).unbind('hover');
    $(this).css({'background':'white','color':'black'});
    $('#cl0sefile').hide();
  });
///clicking eject in save pop-up

  $('#saveEject').mousedown(function(){
    $(this).css({'background':'black','color':'white'});
    $(this).hover(
      function(){$(this).css({'background':'black','color':'white'})}, 
      function(){$(this).css({'background':'white','color':'black'});
    });
    $(document).mouseup(function(){
      $('#saveEject').unbind('hover');
    });
  });
  $('#saveEject').mouseup(function(){
    $(this).unbind('hover');
    $(this).css({'background':'white','color':'black'}).addClass('inactive');
    $('#saveIt').removeClass('active').addClass('inactive');
    $('#saveYes').unbind();
  });
////////////////////////////////////////////revert menu item
  $('#revert').mouseup(function(){
    if (! ($(this).hasClass('inactive'))){
      $('#revertdiv').show().css('z-index', '10001');
      $('#overlay').show();
      $('.rowlines, #closecanvastable').hide();
      $('#yesRevert').mousedown(function(){
        $(this).css({'background':'black','color':'white'});
          $('#yesRevert').hover(
            function(){$(this).css({'background':'black','color':'white'})}, 
            function(){$(this).css({'background':'white','color':'black'});
          });
        $('#yesRevert').mouseup(function(){
          console.log('yes')
          $(this).css({'background':'white','color':'black'});
          $('#revertdiv').hide();
          $('.rowlines, #closecanvastable').show();
          $('#yesRevert, #cancelRevert').unbind('hover');
          clearCanvas(context);
          $('#overlay').hide();
        });
          /*function clearCanvasRevert(){
            context.clearRect(0, 0, canvas.width(), canvas.height());
          }*/
        $('#revertdiv').mouseup(function(){
          $('#yesRevert, #cancelRevert').unbind('hover');
        });
      });
      $('#cancelRevert').mousedown(function(){
        $(this).css({'background':'black','color':'white'});
        $('#cancelRevert').hover(
          function(){$(this).css({'background':'black','color':'white'})}, 
          function(){$(this).css({'background':'white','color':'black'});
        });
        $('#cancelRevert').mouseup(function(){
          $(this).css({'background':'white','color':'black'});
          $('#revertdiv, #overlay').hide();
          $('.rowlines, #closecanvastable').show();
          $('#cancelRevert, #yesRevert').unbind('hover');
        });  
        $('#revertdiv').mouseup(function(){
          $('#yesRevert, #cancelRevert').unbind('hover');
        });      
      });
    }
  });  

  $('#exitMP').mouseup(function(){
      setTimeout(hideContentsQuit, 500);
  });
  
  function hideContentsQuit (){
    $('.content').hide();
    $("#newcanvas, #openfile").removeClass('inactive').addClass('active');
    $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin').addClass('inactive');
  }

/***End File menu***/

/***Goodies***/

////////////////////////////////////////////intro menu item
  $('#intro').addClass('notShowing')
  $('#menu_intro').mouseup(function(){
    $('#overlay').show();
    if($('#shortcut').hasClass('notShowing')){
      setTimeout(restoreCanvasIntro,500);
    }
  });
  function restoreCanvasIntro(){
    $("#intro").show();
    $('#intro').removeClass('notShowing').addClass('showing');
  }
  $('#introbutton').mousedown(function(){
    $('#introbutton').css({'background':'black','color':'white'});
  });
  $('#introbutton').mouseup(function(){
    hideIntro();
    $('#introbutton').css({'background':'white','color':'black'});
    $('#overlay').hide();
  });
  function hideIntro(){
    $('#intro').hide().css({'background':'white','color':'black'});
    $('#intro').removeClass('showing').addClass('notShowing');
  }

////////////////////////////////////////////shortcut menu item
  $('#shortcut').addClass('notShowing');
  $('#menu_sCut').mouseup(function(){
    $('#overlay').show();
    if($('#intro').hasClass('notShowing')){
      setTimeout(restoreCanvasShortcut,500);
    }
  });

  function restoreCanvasShortcut(){
    $("#shortcut").show();
    $("#shortcut").removeClass('notShowing').addClass('showing');
  }

  $('#sCutbutton').mousedown(function(){
    $('#sCutbutton').css({'background':'black','color':'white'});
  });

  $('#sCutbutton').mouseup(function(){
    hideShortcut();
    $('#overlay').hide();
    $('#sCutbutton').css({'background':'white','color':'black'});
  });
  function hideShortcut(){
    $('#shortcut').hide().css({'background':'white','color':'black'});
    $('#shortcut').removeClass('showing').addClass('notShowing');
  }

/***End Goodies***/

/***Close Box inside Filname bar***/
////////////////////////////////////////////save pop-up when top-left box is clicked after drawing
  var drawn;
  $('#myCanvas').mousedown(function(drawn){
    canvas.onmousemove = function(){
      drawn = true;
    }
    $('#closecanvastable').mouseup(function(){
      $('#overlay').show();
      if (drawn){
        keepCanvas();
        showsaveBox();
        hidelines();
        drawn = false;
      }
    });
  });
  //brings up save box
  function showsaveBox(){
    $('#saveClose').show();
    $('#saveClose').css('z-index','10005');
  }
  //hides 'untitled' bar lines
  function hidelines(){
    $('.rowlines, #closecanvastable').hide();
  }
  //keeps canvas open after table8 mouseup
  function keepCanvas(){
    $('#contents').show().removeClass('hidden').addClass('visible');
  }

//hide contents div after no drawing
  $('#closecanvastable').mouseup(function(){
    hideContentsNoDraw();
  });
  function hideContentsNoDraw (){
    $('#closecanvastable').removeClass('hidden');
    $('#contents').hide().addClass('hidden').removeClass('visible');
    $("#newcanvas, #openfile").removeClass('inactive').addClass('active');
    $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin').addClass('inactive');
  }

  ////////////////////////////////////////////controls "No" button hover

  $('#noSave').mousedown(function(){
    $('#noSave').hover(
      function(){$(this).css({'background':'black','color':'white'})}, 
      function(){$(this).css({'background':'white','color':'black'});
    });
    $(document).mouseup(function(){
      $('#noSave').unbind('hover');
    });
  });
  $('#noSave').mouseup(function(){
    $('#noSave').unbind('hover');
  });


////////////////////////////////////////////restore canvas lines after 'cancel'
  $('#cancelSave').mousedown(function(){
    $('#cancelSave').css({'background':'black','color':'white'});
    $('#cancelSave').hover(
      function(){$(this).css({'background':'black','color':'white'})}, 
      function(){$(this).css({'background':'white','color':'black'});
    });
  });
  $(document).mouseup(function(){
      $('#cancelSave').unbind('hover');//prevents hover event inside of button if mouseup outside of it
  });
  $('#cancelSave').mouseup(function(){
    $("#closecanvastable").show().removeClass('hidden');
    $('#cancelSave').css({'background':'white','color':'black'})
    $('#saveClose').hide();
    $('.rowlines').show();
    $('#overlay').hide();
    $('#newcanvas, #openfile').removeClass('active').addClass('inactive');
    $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin').removeClass('inactive').addClass('active');
  });
  /*function showSymboltable(){
    $("#closecanvastable").show();
  }*/

////////////////////////////////////////////save file and export canvas image as base64 png
  $('#yesQuit, #yesSave, #yesClose').mouseup(function(){
    $('#cl0sefile').hide();
    saveFile();
    context.drawImage(canvas, 0, 0);
    var goo = canvas.toDataURL("image/png");
  });
  

//brings up menu after clicking top left canvas box
  var canvas = $("#myCanvas");
  var context = canvas.get(0).getContext("2d");
  $('#closecanvastable').mousedown(function(){
    $('#contents').show();
  });
  $('#noClose').mousedown(function(){
    $('#noClose').css({'background':'black','color':'white'});
  });
  $('#noClose').mouseup(function(){
    $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin').addClass('inactive');
    $('#noClose').css({'background':'white','color':'black'});
    clearCanvas(context);
    $('#checkbox, #contents, #cl0sefile, #overlay').hide();
    $('#contents').addClass('hidden').removeClass('visible');
    $('.rowlines').show();
    $('#newcanvas, #openfile').removeClass('inactive');
  });
  /*function SymbolclearCanvas(){
      context.clearRect(0, 0, canvas.width(), canvas.height());
  }*/


  //displays the overlay to capture clicks
  $('#introbutton, #sCutbutton, #okMirrors, #noneMirrors, #yesScaled, #cancelScaled').click(function(){
    $('#overlay').hide();
    $('#canvasbox').css('z-index','550')
  });

  //inverse shadow on word shadow to white when hover
  $('#shadowdiv').hover(
    function(){$(this).addClass('whiteShadow')},
    function(){$(this).removeClass('whiteShadow')
  }).css({'width': $('#styledrop').width(), 'left': '-10px'});

});