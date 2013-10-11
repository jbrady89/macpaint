/////////////////////////////////////////////"new" menu item
$(document).ready(function(){
  $('#newcanvas').mouseup(function(){
    setTimeout(restore, 500);
    showtable();
    $('#closecanvastable').mouseup(function(){
      hideContents();
    });
  });
  function restore(){
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
  }
  $('#myCanvas').mousedown(function(){
  $('#newcanvas').mouseup(function(){
    setTimeout(restore, 500);
    showtable();
    $('#closecanvastable').mouseup(function(){
      hideContents();
    });
  });
});

  function restore(){
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
  }
////////////////////////////////////////////intro menu item
  $('#intro').addClass('notShowing')
  $('#menu_intro').mouseup(function(){
    $('#overlay').css("display","block");
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
  });
  function hideIntro(){
    $('#intro').hide().css({'background':'white','color':'black'});
    $('#intro').removeClass('showing').addClass('notShowing');
  }

//////////////////////////////////////////shortcut menu item
  $('#shortcut').addClass('notShowing');
  $('#menu_sCut').mouseup(function(){
    $('#overlay').css("display","block");
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
    $('#sCutbutton').css({'background':'white','color':'black'});
  });
  function hideShortcut(){
    $('#shortcut').hide().css({'background':'white','color':'black'});
    $('#shortcut').removeClass('showing').addClass('notShowing');
  }

/////////////////////////////////////save pop-up when top-left box is clicked after drawing
  $('#myCanvas').mousedown(function(){
    $('#closecanvastable').mouseup(function(){
      keepCanvas();
      showsaveBox();
      hidelines();
    });
  });
  //brings up save box
    function showsaveBox(){
      $('#saveClose').show();
    }
  //hides 'untitled' bar lines
    function hidelines(){
      $('.rowlines, #closecanvastable').hide();
    }
  //keeps canvas open after table8 mouseup
    function keepCanvas(){
    $('#contents').css('display','block').removeClass('hidden').addClass('visible');
    }

//hide contents div after no drawing
  $('#closecanvastable').mouseup(function(){
    hideContentsNoDraw();
  });
  function hideContentsNoDraw (){
    $('#closecanvastable').removeClass('hidden');
    $('#contents').css('display','none').addClass('hidden').removeClass('visible');
    $("#newcanvas, #openfile").removeClass('inactive').addClass('active');
    $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin').addClass('inactive');
  }

//close canvas after 'no'
  var canvas = $("#myCanvas");
  var context = canvas.get(0).getContext("2d");

  $('#closecanvastable').mousedown(function(){
    $('#contents').css('display','block');
  });
  $('#noSave').mousedown(function(){
    $('#noSave').css({'background':'black','color':'white'});
  });
  $('#noSave').mouseup(function(){
    $('#closecanvastable').removeClass('hidden');
    $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin').addClass('inactive');
    $('#noSave').css({'background':'white','color':'black'});
    clearCanvas();
    $('#checkbox, #contents, #saveClose').css('display','none');
    $('#contents').addClass('hidden').removeClass('visible');

    $('.rowlines').css('display','block');
    $('#newcanvas, #openfile').removeClass('inactive').addClass('active');

  });
  function clearCanvas(){
    context.clearRect(0, 0, canvas.width(), canvas.height());
  }


//restore canvas lines after 'cancel'
  $('#cancelSave').mousedown(function(){
    $('#cancelSave').css({'background':'black','color':'white'});

    $('#cancelSave').hover(function(e){
      $(this).css({'background':'black','color':'white'});
    }, function(){
      $(this).css({'background':'white','color':'black'});
    });
  });
    $(document).mouseup(function(){
        $('#cancelSave').unbind('hover');//prevents hover event inside of button if mouseup outside of it
    });
  

  $('#cancelSave').mouseup(function(){
    showSymboltable();
    $('#closecanvastable').removeClass('hidden');
    $('#cancelSave').css({'background':'white','color':'black'})
    $('#saveClose').css('display','none');
    $('.rowlines').css('display','block');
    $('#newcanvas, #openfile').removeClass('active').addClass('inactive');
    $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin').removeClass('inactive').addClass('active');
  });
  function showSymboltable(){
    $("#closecanvastable").show();
  }
    


//controls "No" button hover

  $('#noSave').mousedown(function(){
    $('#noSave').hover(function(){
      $(this).css({'background':'black','color':'white'});
    }, function(){
      $(this).css({'background':'white','color':'black'});
    });
    $(document).mouseup(function(){
      $('#noSave').unbind('hover');
    });
  });
  $('#noSave').mouseup(function(){
    $('#noSave').unbind('hover');
  });


///////////////////////////////////////////////Quit menu item
  $('#myCanvas').mousedown(function(){
    $('#contents').removeClass('visible1');
    $('#exitMP').mouseup(function(){
      if(($('#contents').hasClass('visible1')) || ($('#contents').hasClass('hidden'))){
        setTimeout(hideContentsSave, 500);
      }
      else { setTimeout(keepCanvasSave,500);
             setTimeout(showquitBox,500);
             setTimeout(hidelinesSave,500);
             setTimeout(keepOpenSave,500);
      }
    });
  });
  //brings up save box
    function hideContentsSave (){
      $('.content').css('display','none');
      $("#newcanvas, #openfile").removeClass('inactive').addClass('active');
      $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin').addClass('inactive');
    }
    function showquitBox(){
      $('#quitClose').show();
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
      $('.content').css('display','block');
    }

  $('#exitMP').mouseup(function(){
      
    setTimeout(hideContentsQuit, 500);
    
  });
  
  function hideContentsQuit (){
    $('.content').css('display','none');
    $("#newcanvas, #openfile").removeClass('inactive').addClass('active');
    $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin').addClass('inactive');
  }



///////////////////////////////////////"Quit" pop-up No
  var canvas = $("#myCanvas");
  var context = canvas.get(0).getContext("2d");

  $('#closecanvastable').mousedown(function(){
    $('#contents').css('display','block').removeClass('hidden').addClass('visible');
  });
  $('#noQuit').mousedown(function(){
    $('#noQuit').css({'background':'black','color':'white'});
  });
  $('#noQuit').mouseup(function(){
    $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin').addClass('inactive');
    $('#noQuit').css({'background':'white','color':'black'});
    NoclearCanvas();
    $('#checkbox, #contents, #quitClose, .content').css('display','none');
    $('#contents').removeClass('visible').addClass('hidden');
    $('.rowlines').css('display','block');
    $('#newcanvas, #openfile').removeClass('inactive').addclass('active');

  });
  function NoclearCanvas(){
      context.clearRect(0, 0, canvas.width(), canvas.height());
  }

////////////////////////////////////clicking 'cancel' on 'quit'
  $('#cancelQuit').mousedown(function(){
    $('#cancelQuit').css({'background':'black','color':'white'});

    $('#cancelQuit').hover(function(e){
      $(this).css({'background':'black','color':'white'});
    }, function(){
      $(this).css({'background':'white','color':'black'});
    });
  });
  $(document).mouseup(function(){
    $('#cancelQuit').unbind('hover');
  });
  $('#cancelQuit').mouseup(function(){
    showtableCancel();
    $('#closecanvastable').removeClass('hidden');
    $('#cancelQuit').css({'background':'white','color':'black'})
    $('#quitClose').css('display','none');
    $('.rowlines').css('display','block');
  });
  function showtableCancel(){
    $("#closecanvastable").show();
  }
//////////////////////////////////clicking 'yes' on 'quit'
  $('#yesQuit').mousedown(function(){
    $('#yesQuit').css({'background':'black','color':'white'});

    $('#yesQuit').hover(function(e){
      $(this).css({'background':'black','color':'white'});
    }, function(){
      $(this).css({'background':'white','color':'black'});
    });
  });
  $(document).mouseup(function(){
    $('#yesQuit').unbind('hover');
  });
  $('#yesQuit').mouseup(function(){
    showtableYes();
    $('#closecanvastable').removeClass('hidden');
    $('#yesQuit').css({'background':'white','color':'black'})
    $('#quitClose').css('display','none');
    $('.rowlines').css('display','block');
  });
  function showtableYes(){
    $("#closecanvastable").show();
  }

   $('#yesQuit, #yesSave, #yesClose').mouseup(function(){
    saveFile();
    context.drawImage(canvas, 0, 0);
    var goo = canvas.toDataURL("image/png");
    console.log(goo);
  });
   $('#savefile, #saveAs').mouseup(function(){
    setTimeout(saveFile,500)
   });
 function saveFile(){
    $('#saveIt').addClass('inactive');//grays out button
    $(this).css({'background':'white','color':'black'});//sets colors of 1st save button back to original state
    $(document).unbind('mousedown');//disables preventDefault() in order to eneable typing
     $('#saveCancel').mousedown(function(){
        $('#saveCancel').css({'background':'black','color':'white'});//invert colors
        $('#saveCancel').hover//intialize hover
            (function(){$(this).css({'background':'black','color':'white'})},//inverse while mousein
            function(){$(this).css({'background':'white','color':'black'});//original when mouseout
        });
        $(document).mouseup(function(){
            $('#saveCancel').unbind('hover');//prevents hover event inside of button if mouseup outside of it
        });
        $('#saveCancel').mouseup(function(){
            $('#savedocumentdiv').hide();//hide 2nd popup
            $('.rowlines, #closecanvastable').show();
            $('#saveCancel').css({'background':'white','color':'black'});
        });
    });
    $('#saveClose').hide();//hides initial popup
    $('.saveDivs, #filenametext').show();//shows new popup
    $('#savedocumentdiv, #savedocument').show().addClass('formshowing');//shows form
    $('#typed').keyup(function(e) {//grays/ungrays form save button depending on input length
      var nameString = $(this).val().length; 
      console.log(nameString);
      if(nameString){

        $('#saveIt').removeClass('inactive').addClass('saveActive');
      }
      else {
        $('#saveIt').removeClass('saveActive').addClass('inactive');
        $('#saveYes').unbind();

      }
      if($('#saveIt').hasClass('saveActive')){//if button isn't grayed out
        $('#saveYes').mousedown(function(){//when 2nd save button pressed..
          $('#saveYes').css({'background':'black','color':'white'});//invert colors
          $('#saveYes').hover//intialize hover
            (function(){$(this).css({'background':'black','color':'white'})},//inverse while mousein
            function(){$(this).css({'background':'white','color':'black'});//original when mouseout
          });
          $(document).mouseup(function(){
            $('#saveYes').unbind('hover');//prevent hover from firing after mouseup outside of button
          });
          $(this).mouseup(function(){//button released..
            $('#saveYes').css({'background':'white','color':'black'})//original colors
            var fileName = $("#typed").val();//value of the text field
            $('#savedocumentdiv').hide();//hide 2nd popup
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

///////////////////////////////////////////Clicking 'no' on 'quit' popup
  $('#noQuit').mousedown(function(){
    $('#noQuit').css({'background':'black','color':'white'});
    $('#noQuit').hover(function(){
      $(this).css({'background':'black','color':'white'});
    }, function(){
      $(this).css({'background':'white','color':'black'});
    });
    $(document).mouseup(function(){
      $('#noQuit').unbind('hover');
    });
  });
  $('#noQuit').mouseup(function(){
    $('#noQuit').unbind('hover');
  });

//Clicking Close after drawing

  $('#myCanvas').mousedown(function(){
    $('#closefile').mouseup(function(){
      setTimeout(keepCanvasClose,500);
      setTimeout(showquitBoxClose,500);
      setTimeout(hidelinesClose,500);
    });
  });
//brings up save box
    function showquitBoxClose(){
      $('#cl0sefile').show();
    }
//hides 'untitled' bar lines
    function hidelinesClose(){
      $('.rowlines, #closecanvastable').hide();
    }
//keeps canvas open after table8 mouseup
    function keepCanvasClose(){
      $('#contents').css('display','block').removeClass('hidden').addClass('visible');
    }
  


//Clicking Close prior to any drawing

  $('#closefile').mouseup(function(){
    setTimeout(hideContentsNoDraw,500);
  });
  function hideContentsNoDraw (){
    $('#cl0sefile').css('display','none');
    $('#contents').css('display','none').removeClass('visible').addClass('hidden');
    $("#newcanvas, #openfile").removeClass('inactive').addClass('active');
    $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin').addClass('inactive');
  }

//brings up menu after clicking top left canvas box
  var canvas = $("#myCanvas");
  var context = canvas.get(0).getContext("2d");

  $('#closecanvastable').mousedown(function(){
    $('#contents').css('display','block');
  });
  $('#noClose').mousedown(function(){
    $('#noClose').css({'background':'black','color':'white'});
  });
  $('#noClose').mouseup(function(){
    $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin').addClass('inactive');
    $('#noClose').css({'background':'white','color':'black'});
    SymbolclearCanvas();
    $('#checkbox, #contents, #cl0sefile').css('display','none');
    $('#contents').addClass('hidden').removeClass('visible');
    $('.rowlines').css('display','block');
    $('#newcanvas, #openfile').removeClass('inactive');

  });
  function SymbolclearCanvas(){
      context.clearRect(0, 0, canvas.width(), canvas.height());
  }

//Cancel Closing

  $('#cancelClose').mousedown(function(){
    $('#cancelClose').css({'background':'black','color':'white'});

    $('#cancelClose').hover(function(e){
      $(this).css({'background':'black','color':'white'});
    }, function(){
      $(this).css({'background':'white','color':'black'});
    });
  });
  $(document).mouseup(function(){
    $('#cancelClose').unbind('hover');
  });

  $('#cancelClose').mouseup(function(){
    Cancelshowtable();
    $('#cancelClose').css({'background':'white','color':'black'})
    $('#cl0sefile').css('display','none');
    $('.rowlines').css('display','block');
    $('#newcanvas, #openfile').removeClass('active').addClass('inactive');
    $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin').removeClass('inactive').addClass('active');
  });
  function Cancelshowtable(){
    $("#closecanvastable").show();
  }

//No save before closing
  $('#noClose, #yesClose').mousedown(function(){
    $(this).css({'background':'black','color':'white'});
    $(this).hover(function(){
      $(this).css({'background':'black','color':'white'});
    }, function(){
      $(this).css({'background':'white','color':'black'});
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

//revert menu item
  $('#revert').mouseup(function(){
    $('#revertdiv').css('display','block');
    $('.rowlines, #closecanvastable').css('display','none');
    $('#yesRevert').mousedown(function(){
      $(this).css({'background':'black','color':'white'});
        $('#yesRevert').hover(function(){
          $(this).css({'background':'black','color':'white'});
          }, function(){
          $(this).css({'background':'white','color':'black'});
        });
      $('#yesRevert').mouseup(function(){
        $(this).css({'background':'white','color':'black'});
        $('#revertdiv').css('display','none');
        $('.rowlines, #closecanvastable').css('display','block');
        $('#yesRevert, #cancelRevert').unbind('hover');
        clearCanvasRevert();
      });
        function clearCanvasRevert(){
          context.clearRect(0, 0, canvas.width(), canvas.height());
        }
      $('#revertdiv').mouseup(function(){
        $('#yesRevert, #cancelRevert').unbind('hover');
      });
    });
    $('#cancelRevert').mousedown(function(){
      $(this).css({'background':'black','color':'white'});
      $('#cancelRevert').hover(function(){
        $(this).css({'background':'black','color':'white'});
        }, function(){
        $(this).css({'background':'white','color':'black'});
      });
      $('#cancelRevert').mouseup(function(){
        $(this).css({'background':'white','color':'black'});
        $('#revertdiv').css('display','none');
        $('.rowlines, #closecanvastable').css('display','block');
        $('#cancelRevert, #yesRevert').unbind('hover');
      });  
      $('#revertdiv').mouseup(function(){
        $('#yesRevert, #cancelRevert').unbind('hover');
      });      
    });
  });  

  $('#introbutton, #sCutbutton, #okMirrors, #noneMirrors, #yesScaled, #cancelScaled').click(function(){
    $('#overlay').css('display','none');
    $('#canvasbox').css('z-index','550')
  });



});