  function nameFile(filename){
    $('#filename').html('<span>' + filename + '</span>');//replace 'untitled' with new file name
    var nameInPixels = $('#filename').find('span').width();//find length of new name in pixels
    var padSize = (414 - (nameInPixels + 6))/2;//calculate left and right padding
    $('#filename').css('left', padSize + 'px')//centers the new filename based on padding
      .css('width', (nameInPixels +6) + 'px')
      .css({'background':'white','color':'black'}).css('text-align','center');
  }

  function restore(){
    $("#contents").show().addClass('visible1').removeClass('hidden');
    $("#saveClose").hide();
    $(".rowlines").show();
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width(), canvas.height());
    nameFile('untitled');
    $("#newcanvas, #openfile").removeClass('active').addClass('inactive');
    $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin, #undo, #pasteItem, #menu_sCut, #menu_intro, #showPage').removeClass('inactive');
  }



  function hideContents(){
    $('#contents').hide().addClass('hidden').removeClass('visible');
  }

  function hideContentsQuit (){
    $('.content').hide();
    $("#newcanvas, #openfile").removeClass('inactive').addClass('active');
    $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin').addClass('inactive');
  }

  function hideContentsSave (){
    //$('.content').hide();
    $("#newcanvas, #openfile").removeClass('inactive').addClass('active');
    $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin').addClass('inactive');
  }

  function hideContentsNoDraw (){
    $('#closecanvastable').removeClass('hidden');
    $('#contents').hide().addClass('hidden').removeClass('visible');
    $("#newcanvas, #openfile").removeClass('inactive').addClass('active');
    $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin').addClass('inactive');
  }

   //hides 'untitled' bar lines
  function hidelines(){
    $('.rowlines, #closecanvastable').hide();
  }

  function hideIntro(){
    $('#intro').hide().css({'background':'white','color':'black'});
    $('#intro').removeClass('showing').addClass('notShowing');
  }
  function hideShortcut(){
    $('#shortcut').hide().css({'background':'white','color':'black'});
    $('#shortcut').removeClass('showing').addClass('notShowing');
  }

  function showtable(){
    $("#closecanvastable").show();
  }

  function showtableCancel(){
    $("#closecanvastable").show();
    $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin').removeClass('inactive').addClass('active');
    $('#newcanvas, #openfile').removeClass('active').addClass('inactive');
  }

  function showquitBox(){
    $('#quitClose').show().css('z-index','10005');
    $('#overlay').show();
  }

  function showquitBoxClose(){
    $('#cl0sefile').show().css('z-index', '10001');
  }


 function clearCanvas(context){
    context.fillStyle = 'white';
    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.closePath();
    context.fill();
    context.fillStyle = 'black';
  }

  ////////////////////////////////////////////brings up save box
  //keeps canvas open after table8 mouseup
  function keepCanvasSave(){
    //$('#contents').css('display','block').removeClass('hidden');
  }
  function keepOpenSave(){
    //$('.content').show();
  }

  function saveFile(){
    $('#overlay').show();
    $('#saveIt, #saveDrive').addClass('inactive');//grays out button
    $(this).css({'background':'white','color':'black'});//sets colors of 1st save button back to original state
    $(document).unbind('mousedown');//disables preventDefault() in order to eneable typing
    $('#saveCancel').mousedown(function(){
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

    // interactions

    $('#typed').keyup(function() {//grays/ungrays form save button depending on input length
      var nameString = $(this).val().length; 
      //console.log(nameString);
      if(nameString && !$('#saveEject').hasClass('inactive'))$('#saveIt').removeClass('inactive').addClass('saveActive');
      else {
        $('#saveIt').removeClass('saveActive').addClass('inactive');
        $('#saveYes').unbind();
      }
      if($('#saveIt').hasClass('saveActive')){//if button isn't grayed out
        $('#saveYes').mousedown(function(){//when 2nd save button pressed..
          $(this).mouseup(function(){//button released..
            $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin').removeClass('inactive').addClass('active');
            $("#newcanvas, #openfile").removeClass('active').addClass('inactive');
            $('#saveYes, #yesClose, #yesSave').css({'background':'white','color':'black'})//original colors
            var fileName = $("#typed").val();//value of the text field
            $('#savedocumentdiv').hide();//hide 2nd popup
            $('#overlay').hide();
            $('.rowlines, #closecanvastable').show();//hide window bar lines & small box
            nameFile(fileName);
            /*$('#filename').html('<span>'+fileName+'</span>');//replace 'untitled' with new file name
            var nameInPixels = $('#filename').find('span').width();//find length of new name in pixels
            var padSize = (414 - (nameInPixels + 6))/2;//calculate left and right padding
            $('#filename').css('left', padSize + 'px')//centers the new filename based on padding
              .css('width', (nameInPixels +6) + 'px')
              .css({'backgroud':'white','color':'black'}).css('text-align','center');*/
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

  function showsaveBox(){
    $('#saveClose').show();
    $('#saveClose').css('z-index','10005');
  }
 
  //keeps canvas open after table8 mouseup
  function keepCanvas(){
    $('#contents').show().removeClass('hidden').addClass('visible');
  }

  function test() {
    //$('#overlay').hide();
    $('#contents').css('display','none').removeClass('visible').addClass('hidden');
    $("#newcanvas, #openfile").removeClass('inactive').addClass('active');
    $('#closefile, #saveAs, #savefile, #revert, #printdraft, #printfin, #editdrop li, #menu_intro, #showPage, #menu_sCut').addClass('inactive');
    $('#file').css({'background':'white','color':'black'});
    $('#fileblackmenuside').hide();
  }

  function restoreCanvasIntro(){
    $("#intro").show();
    $('#intro').removeClass('notShowing').addClass('showing');
  }

  function restoreCanvasShortcut(){
    $("#shortcut").show();
    $("#shortcut").removeClass('notShowing').addClass('showing');
  }

