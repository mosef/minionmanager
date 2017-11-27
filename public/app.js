function registerSumbit () {
    $(".js-register-form").submit(e=> {
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
                console.log(data)
            },
            error: (err)=> {
                console.error(err)
            }
        })
    })
}

function 



registerSumbit();