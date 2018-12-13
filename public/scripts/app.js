/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

function createTweetElement(tweetData) {
  var $tweet = $("<article>").addClass("tweet-container");
  $tweet.append("<header>");
  var $header = $tweet.find("header");
  var $img = $header.append(`<img src="${tweetData.user.avatars.small}">`);
  var $h2 = $header.append(`<h2>${tweetData.user.name}</h2>`)
  var $p = $header.append(`<p class="nickname">${tweetData.user.handle}</p>`);
  var $div = $tweet.append(`<div><p>${escape(tweetData.content.text)}</p></div>`);
  $tweet.append("<footer>");
  var $footer = $tweet.find("footer");
  var timeAgo = moment(tweetData.created_at).fromNow();
  var $p2 = $footer.append(`<p>${timeAgo}</p>`);
  var $img_like = $footer.append('<img src="/images/like.png" class="icons">');
  var $img_repost = $footer.append('<img src="/images/repost.png" class="icons">');
  var $img_flag = $footer.append('<img src="/images/flag.png" class="icons">');
  return $tweet;
}



// const data = [
//   {
//     "user": {
//       "name": "Newton",
//       "avatars": {
//         "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
//         "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
//         "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
//       },
//       "handle": "@SirIsaac"
//     },
//     "content": {
//       "text": "If I have seen further it is by standing on the shoulders of giants"
//     },
//     "created_at": 1461116232227
//   },
//   {
//     "user": {
//       "name": "Descartes",
//       "avatars": {
//         "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
//         "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
//         "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
//       },
//       "handle": "@rd" },
//     "content": {
//       "text": "Je pense , donc je suis"
//     },
//     "created_at": 1461113959088
//   },
//   {
//     "user": {
//       "name": "Johann von Goethe",
//       "avatars": {
//         "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
//         "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
//         "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
//       },
//       "handle": "@johann49"
//     },
//     "content": {
//       "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
//     },
//     "created_at": 1461113796368
//   }
// ];

function renderTweets(tweets) {
  // loops through tweets
    // calls createTweetElement for each tweet
    // takes return value and appends it to the tweets container
    for (let arr of tweets) {
      var $tweet = createTweetElement(arr);
      $('#tweets-container').prepend($tweet);
      $('.new-tweet form textarea').val("");
      $('.new-tweet form footer .counter').text("140");
    }

}

function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

$(document).ready(function() {
  function loadTweets() {
    $.ajax('/tweets', { method: 'GET' })
    .then(function (moreTweets) {
      renderTweets(moreTweets);
    });
  }
  loadTweets();

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

  $( "#button-compose" ).click(function() {
    $(".new-tweet").slideToggle("slow");
    $("#tweet-form textarea").focus();
  });

});

$( ".new-tweet form textarea" ).on( "keyup", function() {
  $("#tweet-mistake").slideUp();
  $(".mistake-remove").remove();
});






