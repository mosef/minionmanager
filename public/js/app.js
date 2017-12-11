function hideSignUp() {
    $(".js-form-hide").hide();
}
function closeSignUp() {
    $(".fa").on("click", function(e) {
        e.preventDefault();
        $(".js-form-hide")
        .hide();
    })
}
function signUp() {
    $(".sign-up-btn").on("click", function(e) {
        e.preventDefault();
        $(".js-form-hide")
        .show();
        $(".form-button").empty().append(`<button class="submit-btn register">REGISTER</button>`);
    })
}
function logIn() {
    $(".login-btn").on("click", function(e) {
        e.preventDefault();
        $(".js-form-hide")
        .show();
        $(".form-button").empty().append(`<button class="submit-btn login">LOGIN</button>`);
    })
}
function loginSubmit() {
    $(".js-register-form").on( 'click', '.login', function(e) {
        e.preventDefault();
        const usernameField = $(".js-register-form #user-name").val();
        const passField = $(".js-register-form #user-pass").val();
        $.ajax({
            url: "/register/authenticate",
            method: "POST",
            contentType: 'application/json', 
            dataType: 'json',
            data: JSON.stringify({
                username: usernameField,
                password: passField
            }),
            success: (data)=> {
                let token = data.token;
                let username = usernameField;
                localStorage.setItem('username', username);
                localStorage.setItem('currentUser', token);
                location.href = '/account.html';
            },
            error: (err)=> {
                console.error(err)
            }
        })
    })
}
function registerSumbit () {
    $(".js-register-form").on( 'click', '.register', function(e) {
        e.preventDefault();
        const usernameField = $(".js-register-form #user-name").val();
        const passField = $(".js-register-form #user-pass").val();
        $.ajax({
            url: "/register/sign-up",
            method: "POST",
            contentType: 'application/json', 
            dataType: 'json',
            data: JSON.stringify({
                username: usernameField,
                password: passField
            }),
            success: (data)=> {
                const usernameField = $(".js-register-form #user-name").val();
                const passField = $(".js-register-form #user-pass").val();
                $.ajax({
                    url: "/register/authenticate",
                    method: "POST",
                    contentType: 'application/json', 
                    dataType: 'json',
                    data: JSON.stringify({
                        username: usernameField,
                        password: passField
                    }),
                    success: (data)=> {
                        let token = data.token;
                        let username = usernameField;
                        localStorage.setItem('username', username);
                        localStorage.setItem('currentUser', token);
                        location.href = '/account.html';
                    },
                    error: (err)=> {
                        console.error(err)
                    }
                })
            },
            error: (err)=> {
                console.error(err)
            }
        })
    })
}

$(function() {
    hideSignUp();
    signUp();
    closeSignUp();
    registerSumbit();
    loginSubmit();
    logIn();
});
