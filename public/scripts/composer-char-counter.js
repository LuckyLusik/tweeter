// Counts symbols typed in the textarea
$(document).ready(function() {
  $( ".new-tweet form textarea" ).on( "keyup", function() {
    const tweetArea = $(this);
    const len = tweetArea.val().length;
    const counter = tweetArea.siblings("footer").find(".counter");
    counter.text(140 - len);

    // If a tweet too long - counter turns in red
    if (len > 140) {
      counter.addClass("warning");
    } else {
      counter.removeClass("warning");
    }
  });
});

