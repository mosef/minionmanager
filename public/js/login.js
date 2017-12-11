function loginSubmit() {
    $(".js-register-form").submit(e=> {
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
                console.log(data.token)
                let token = data.token;
                localStorage.setItem('currentUser', token);
                location.href = '/account.html';
            },
            error: (err)=> {
                console.error(err)
            }
        })
    })
}
$(function() {
	loginSubmit();
});