// $(document).ready(function() {
// 	if (jQuery) {
// 		alert("JQuery is loaded");
// 	}
// });

$(document).ready(function() {
  $("#contact-form").submit(function(event) {
    var error_count = 0;

    var fullname = $("#fullname").val();
    if (fullname === "") {
      $("#fullname").css("border-color", "#ff3333");
      $("#fullname-error").text("Please enter your name").fadeIn(1200);
      error_count += 1;
    } else {
      $("#fullname-error").fadeOut(1200);
    }

    var email = $("#email").val();
    if (email === "") {
      $("#email").css("border-color", "#ff3333");
      $("#email-error").text("Please enter your email address").fadeIn(1200);
      error_count += 1;
    } else {
      $("#email-error").fadeOut(1200);

      // Validate email format
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        $("#email").css("border-color", "#ff3333");
        $("#email-error").text("Please enter a valid email address").fadeIn(1200);
        error_count += 1;
      }
    }

    var description = $("#description").val();
    if (description === "") {
      $("#description").css("border-color", "#ff3333");
      $("#description-error").text("Please enter a description").fadeIn(1200);
      error_count += 1;
    } else {
      $("#description-error").fadeOut(1200);
    }

    if (error_count > 0) {
      event.preventDefault();
    }

    $("#fullname").focusout(function() {
      $("#fullname").css("border-color", "#dddddd");
      $("#fullname-error").fadeOut(1200);
    });
    $("#email").focusout(function() {
      $("#email").css("border-color", "#dddddd");
      $("#email-error").fadeOut(1200);
    });
    $("#description").focusout(function() {
      $("#description").css("border-color", "#dddddd");
      $("#description-error").fadeOut(1200);
    });
  });

	// Adding heading dropdown

	$('#narrow-menu-title').click(function() {
		$('.narrow-menu ul.nav-links').toggle(500);
	});
});


//  kod