$(document).ready(function(){
//I make a games_list from which we will work.
  var games_list = [];

/*This is how (or at least one of several ways) an AJAX request can be made.
  It takes a JSON object which should have url, type, data, success, and error 
  (others are possible some are optional).
  
  When the data comes back the success function should deal with it.
  
*/
  
   var opts = '{"maxplayers":"2"}';
   console.log(opts.toString());
   
  $.ajax({
    
    url: 'api/games',
    
    type: "GET",
    
    //for a simple GET request this will turn into url parameters api/games?key=value
    //data: {"numresults":10},
    
    success: function(data){
      
      games_list = data;
      
      for (var i = 0; i < data.length; i++) {
      /* 
      This is where we do "jQuery" templating, we could of course use underscore templating too.
      Note that I'm using "i" as the index for the current game, I'm using "data-index" to store that i and 
      to reference it in "games_list" later when specific data is needed.
      */
          $('#jq-games').append("<li class=\"game\" title=\""+data[i].description+
          "\" data-index="+i+
          "><span class=\"thumb_wrapper\"><img class=\"thumb\" src=\"http:"
          +data[i].thumbnail+"\"/></span><span class=\"txt\">"+data[i].game+ " :: "+data[i].playingtime 
          +" minutes</span></li>");
      };
      
      /*
      So this next snippet has the heart of how to use jQuery for specific item 
      issues, and you can maybe begin to imagine how difficult it would be to now 
      delete a game from the list.
      */
      
      $("#jq-games .game").click(function(ev){
        //ev.currentTarget will be the element that was clicked.
        //data-index will have the "i" I left there from the above function
        var j = parseInt($(ev.currentTarget).attr('data-index'));
        var game_json = games_list[j];
        alert(game_json.game + " :: "+game_json.playingtime + " minutes, upto " + game_json.maxplayers + " players");
      });
    
    }, 
    
    error: function(){
      $('body').html("Error happened");
    }
    
  });
  
  //Button ajax
  
  document.getElementById("search_btn").onclick=(function(event){
    var e = errorCheck();
     if(e==""){
       //ajax command - mostly duplicate code but wasn't sure how to make ajax a function to do what I wanted.
        var games_list = [];
        var opts = createParameters();
        $('#jq-games').empty();
        $.ajax({
    
           url: 'api/games',
           type: "GET",
           //for a simple GET request this will turn into url parameters api/games?key=value
           data: opts,
            success: function(data){
              games_list = data;
              
              if(data.length==0)$('#jq-games').append("<li>No games found</li>");
              for (var i = 0; i < data.length; i++) {
              /* 
              This is where we do "jQuery" templating, we could of course use underscore templating too.
              Note that I'm using "i" as the index for the current game, I'm using "data-index" to store that i and 
              to reference it in "games_list" later when specific data is needed.
              */
                  $('#jq-games').append("<li class=\"game\" title=\""+data[i].description+
                  "\" data-index="+i+
                  "><span class=\"thumb_wrapper\"><img class=\"thumb\" src=\"http:"
                  +data[i].thumbnail+"\"/></span><span class=\"txt\">"+data[i].game+ " :: "+data[i].playingtime 
                  +" minutes</span></li>");
              };
              
              /*
              So this next snippet has the heart of how to use jQuery for specific item 
              issues, and you can maybe begin to imagine how difficult it would be to now 
              delete a game from the list.
              */
              
              $("#jq-games .game").click(function(ev){
                //ev.currentTarget will be the element that was clicked.
                //data-index will have the "i" I left there from the above function
                var j = parseInt($(ev.currentTarget).attr('data-index'));
                var game_json = games_list[j];
                alert(game_json.game + " :: "+game_json.playingtime + " minutes, upto " + game_json.maxplayers + " players");
              });
    
             }, 
            error: function(){
              $('body').html("Error happened");
          }
          });
     }
    else alert(e);
  });
  
  function errorCheck(){
    var error = "";
    //check Rec Players Field
    if(getRecPlayersReq()){
      var num = parseInt(getRecPlayersReq(), 10);
      if(isNaN(num))error +=">Recommended Number of Players must be a number\n";
      if(num <1)error+=">Recommended Number Players must be at least 1\n";
    }
    //check minimum ranking
    if(getMinimumRatingReq()){
      num = parseInt(getMinimumRatingReq(),10);
      if(isNaN(num))error+=">Minimum Rating must be a number\n";
      if(num <1)error+=">Minimum Rating must be at least 1\n";
    }
    return error;
  }
  
  function getRecPlayersReq(){
    return document.getElementById("recplayers_req").value;
  }
  
   function getMinimumRatingReq(){
    return document.getElementById("rating_req").value;
  }
  
  function getNumRatingSelected(){
     var sel = document.getElementById("numresults");
     return sel.options[sel.selectedIndex].value;
  }
  
  function getContains(){
    return document.getElementById("contains_req").value;
  }
  
  function createParameters(){
    var r = {};
    r.numresults = getNumRatingSelected();
    if(getRecPlayersReq())r.bggbestplayers = getRecPlayersReq();
    if(getMinimumRatingReq())r.minranking = getMinimumRatingReq();
    if(getContains())r.contains = getContains();
    console.log(r);
    return r;
  }
  
    /* 
  This set of snippets is where I demonstrate using CSS state classes to change 
  a view. This could be done both in backbone and angular by having multiple 
  views for the same model. 
  */
  
  $("#gridmode").click(function(){
    $(".txt").hide();
    $(".game").removeClass("line");
  });
  
  $("#listmode").click(function(){
      $(".txt").show();
      $(".game").addClass("line");
  });
  
  $('#help').mouseover(function(){
    alert("You can filter the board game results with the following parameters; the optimal players for a game (a number), the minimum ranking of how good of a game you want (1 being the highest), or searching a game by what its name contains.")
  });
});
