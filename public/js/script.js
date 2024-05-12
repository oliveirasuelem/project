


function changeForm(formType) {
    if (formType === 'register') {
        document.getElementById('registerForm').classList.add('active');
        document.getElementById('loginForm').classList.remove('active');
    } else {
        document.getElementById('registerForm').classList.remove('active');
        document.getElementById('loginForm').classList.add('active');
    }
}

function validateForm(formType) {
    var username = document.getElementById('registerUsername').value.trim();
    var email = document.getElementById('registerEmail').value.trim();
    var password = document.getElementById('registerPassword').value.trim();
    var confirmPassword = document.getElementById('registerConfirmPassword').value.trim();
    var phoneNumber = document.getElementById('number').value.trim();
    var gender = document.getElementById('registerGender').value;
    var dob = document.getElementById('registerDob').value;

    // Reset all error messages
    document.getElementById('errorUsername').innerHTML = '';
    document.getElementById('errorEmail').innerHTML = '';
    document.getElementById('errorPassword').innerHTML = '';
    document.getElementById('errorConfirmPassword').innerHTML = '';
    document.getElementById('errorPhoneNumber').innerHTML = '';
    document.getElementById('errorGender').innerHTML = '';
    document.getElementById('errorDob').innerHTML = '';
    document.getElementById('errorAllFields').innerHTML = '';

    // Check if all required fields are filled
    if (!username ||!email || !password || !confirmPassword || !phoneNumber || !gender || !dob) {
        $("#registerUsername, #registerEmail, #registerPassword, #registerConfirmPassword, #number, #registerGender, #registerDob").css({"border-color": "#ff3333", "border-width": "2px"});
        document.getElementById('errorAllFields').innerHTML = 'All fields are required for registration.';
        return false;
    }
      // Username validation
      var usernameRegex = /^[a-z0-9\s]{3,15}$/;
      if (!usernameRegex.test(username)) {
          $("#registerUsername").css({"border-color": "#ff3333", "border-width": "2px"});
          document.getElementById('errorUsername').innerHTML = 'Username must start with a lowercase letter,be 3-15 characters long, allowing spaces and numbers."';
          return false;
      }

     // Email validation
        var emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
     if (!emailRegex.test(email)) {
        $("#registerEmail").css({"border-color": "#ff3333", "border-width": "2px"});
         document.getElementById('errorEmail').innerHTML = 'Invalid email address.';
         return false;
     }

        if (!/(?=.*\d)(?=.*[A-Z]).{8,}/.test(password)) {
        $("#registerPassword").css({"border-color": "#ff3333", "border-width": "2px"});
        document.getElementById('errorPassword').innerHTML = 'Password must be at least 8 characters, contain at least one number, and at least one uppercase letter.';
        return false;
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
        $("#registerConfirmPassword").css({"border-color": "#ff3333", "border-width": "2px"});
        document.getElementById('errorConfirmPassword').innerHTML = 'Password and confirm password must match.';
        return false;
    }

   

    // Check if phone number has the correct format (9 digits)
    var rePhoneNumber = (/^(080|081|082|083|084|085|086|087|088|089)[0-9]{7}$/);
    if (!rePhoneNumber.test(phoneNumber)) {
        $("#number").css({"border-color": "#ff3333", "border-width": "2px"});
        document.getElementById('errorPhoneNumber').innerHTML = ' Please enter a valid number starting with 08.Phone number must consist of 10 digits.';
        return false;
    }

    // Check if the user is at least 18 years old
    var today = new Date();
    var birthDate = new Date(dob);
    var age = today.getFullYear() - birthDate.getFullYear();

    if (age < 18) {
        $("#registerDob").css({"border-color": "#ff3333", "border-width": "2px"});
        document.getElementById('errorDob').innerHTML = 'You must be at least 18 years old.';
        return false;
    }

    // Additional validation logic can be added here

    // If everything is valid, you can proceed with the form submission
    return true;
}






    // JQuery focus out function
     
    $("#registerUsername, #registerEmail, #registerPassword, #registerConfirmPassword, #number, #registerGender, #registerDob").focusout(function() {
         $("#registerUsername, #registerEmail, #registerPassword, #registerConfirmPassword, #number, #registerGender, #registerDob").css({"border-color": "#ccc", "border-width": "1px"});
         document.getElementById('errorAllFields').innerHTML = '';
    
    });

   
    $("#registerUsername").focusout(function() {
        $("#registerUsername").css({"border-color": "#ccc", "border-width": "1px"});
        document.getElementById('errorUsername').innerHTML = '';
    });
    
    
    $("#registerEmail").focusout(function() {
        $("#registerEmail").css({"border-color": "#ccc", "border-width": "1px"});
        document.getElementById('errorEmail').innerHTML = '';
    });

    $("#registerPassword").focusout(function() {
        $("#registerPassword").css({"border-color": "#ccc", "border-width": "1px"});
        document.getElementById('errorPassword').innerHTML = '';
    });

    $("#registerConfirmPassword").focusout(function() {
        $("#registerConfirmPassword").css({"border-color": "#ccc", "border-width": "1px"});
        document.getElementById('errorConfirmPassword').innerHTML = '';
    });

    $("#number").focusout(function() {
        $("#number").css({"border-color": "#ccc", "border-width": "1px"});
        document.getElementById('errorPhoneNumber').innerHTML = '';
    });

    $("#registerDob").focusout(function() {
        $("#registerDob").css({"border-color": "#ccc", "border-width": "1px"});
        document.getElementById('errorDob').innerHTML = '';
    });


       
       // Function validation Login Form
       
    function validateLoginForm() {
        var loginUsername = document.getElementById('loginUsername').value.trim();
        var loginEmail = document.getElementById('loginEmail').value.trim();
        var loginPassword = document.getElementById('loginPassword').value.trim();

        // Reset all error messages
        document.getElementById('errorLoginUsername').innerHTML = '';
        document.getElementById('errorLoginEmail').innerHTML = '';
        document.getElementById('errorLoginPassword').innerHTML = '';
        

        //check is username is empty
        if (!loginUsername) {
            $("#loginUsername").css({"border-color": "#ff3333", "border-width": "2px"});
            document.getElementById('errorLoginUsername').innerHTML = 'Please enter your username.';
            return false;
        }
        //validation username
        var usernameRegex = /^[a-z0-9\s]{3,15}$/;
        if (!usernameRegex.test(loginUsername)) {
            $("#LoginUsername").css({"border-color": "#ff3333", "border-width": "2px"});
            document.getElementById('errorLoginUsername').innerHTML = 'Invalid username.';
            return false;
        }
        // Check if login email is empty
        if (!loginEmail) {
            $("#loginEmail").css({"border-color": "#ff3333", "border-width": "2px"});
            document.getElementById('errorLoginEmail').innerHTML = 'Please enter your email.';
            return false;
        }

        // Email validation
        var emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        if (!emailRegex.test(loginEmail)) {
            $("#loginEmail").css({"border-color": "#ff3333", "border-width": "2px"});
            document.getElementById('errorLoginEmail').innerHTML = 'Invalid email address.';
            return false;
        }

        // Check if login password is empty
        if (!loginPassword) {
            $("#loginPassword").css({"border-color": "#ff3333", "border-width": "2px"});
            document.getElementById('errorLoginPassword').innerHTML = 'Please enter your password.';
            return false;
        }

        if  (!/(?=.*\d)(?=.*[A-Z]).{8,}/.test(loginPassword)) {
            $("#loginPassword").css({"border-color": "#ff3333", "border-width": "2px"});
            document.getElementById('errorLoginPassword').innerHTML = 'Password must be at least 8 characters, contain at least one number, and at least one uppercase letter.';
            return false;
        }

        // Additional validation logic can be added here

        // If everything is valid, you can proceed with the login
        return true;
    }

    $("#loginUsername").focusout(function() {
        $("#loginUsername").css({"border-color": "#ccc", "border-width": "1px"});
        document.getElementById('errorLoginUsername').innerHTML = '';
    });

    $("#loginEmail").focusout(function() {
        $("#loginEmail").css({"border-color": "#ccc", "border-width": "1px"});
        document.getElementById('errorLoginEmail').innerHTML = '';
    });

    $("#loginPassword").focusout(function() {
        $("#loginPassword").css({"border-color": "#ccc", "border-width": "1px"});
        document.getElementById('errorLoginPassword').innerHTML = '';
    });
    
    
    
  


 