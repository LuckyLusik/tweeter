// Creates a srtucture for a new tweet
function createTweetElement(tweetData) {
  var $tweet = $("<article>").addClass("tweet-container");
  $tweet.append("<header>");
  var $header = $tweet.find("header");
  var $img = $header.append(`<img src="${escape(tweetData.user.avatars.small)}">`);
  var $h2 = $header.append(`<h2>${escape(tweetData.user.name)}</h2>`)
  var $p = $header.append(`<p class="nickname">${escape(tweetData.user.handle)}</p>`);
  var $div = $tweet.append(`<div><p>${escape(tweetData.content.text)}</p></div>`);
  $tweet.append("<footer>");
  var $footer = $tweet.find("footer");

  // "moment" converts value of created_at to the real time
  var timeAgo = moment(tweetData.created_at).fromNow();
  var $p2 = $footer.append(`<p>${timeAgo}</p>`);
  var $img_like = $footer.append('<img src="/images/like.png" class="icons">');
  var $img_repost = $footer.append('<img src="/images/repost.png" class="icons">');
  var $img_flag = $footer.append('<img src="/images/flag.png" class="icons">');
  return $tweet;
}

// Loops through tweets, calls createTweetElement for each tweet,
// takes return value and appends it to the tweets container
function renderTweets(tweets) {
  for (let arr of tweets) {
    var $tweet = createTweetElement(arr);
    $('#tweets-container').prepend($tweet);
    $('.new-tweet form textarea').val("");
    $('.new-tweet form footer .counter').text("140");
  }
}

// Preventing XSS
function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

$(document).ready(function() {

  // Loads tweets with ajax
  function loadTweets() {
    $.ajax('/tweets', { method: 'GET' })
    .then(function (moreTweets) {
      renderTweets(moreTweets);
    });
  }
  loadTweets();

  // Checks if tweet form is empty or too long
  // and provides a warning message. If everything is OK - post a tweet.
  $( "#tweet-form" ).submit(function( event ) {
    var tweetArea = $("#tweet-form textarea");
    var lenT = tweetArea.val().length
    if (lenT === 0) {
      event.preventDefault();
      $('#tweet-mistake').append('<img class="mistake-remove" src="/images/warning.png"></img><p class="mistake-remove">Please, enter something!</p>');
      $("#tweet-mistake").slideDown("slow");
    } else {
        if (lenT > 140) {
          event.preventDefault();
          $('#tweet-mistake').append('<img class="mistake-remove" src="/images/warning.png"></img><p class="mistake-remove">Your tweet is too long...</p>');
          $("#tweet-mistake").slideDown("slow");
        } else {
            var result = $( "#tweet-form" ).serialize();
            event.preventDefault();
            $.post( "/tweets", result, function() {
              loadTweets();
            });
        }
    }
  });

  // On click the form for a new tweet slides down and up.
  // A cursor is in the textarea.
  $("#button-compose").click(function() {
    $(".new-tweet").slideToggle("slow");
    $("#tweet-form textarea").focus();
  });

  // On typing - warning message slides up.
  $( ".new-tweet form textarea" ).on( "keyup", function() {
    $("#tweet-mistake").slideUp();
    $(".mistake-remove").remove();
  });
});


