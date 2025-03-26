const baseUrl = "https://tarmeezacademy.com/api/v1"



function setupUI() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token == null) {
        // user is not logged in (guest)
        document.getElementById("login-btn").style.display = 'block';
        document.getElementById("register-btn").style.display = 'block';
        document.getElementById("logout-btn").style.display = 'none';
        if (document.getElementById("add-btn") != null) {
            document.getElementById("add-btn").style.display = 'none'; // hide the add post button for guests
            // document.getElementById("add-btn").style.setProperty("display", "none", "important");
        }
        

        document.getElementById("profile-image-navbar").style.display = 'none';
        document.getElementById("profile-image-navbar").style.display = 'none';
        document.getElementById("username-navbar").style.display = 'none';
    }
    else {
        document.getElementById("login-btn").style.display = 'none';
        document.getElementById("register-btn").style.display = 'none';
        document.getElementById("logout-btn").style.display = 'block';
        if(document.getElementById("add-btn") != null) {
            document.getElementById("add-btn").style.display = 'grid'; // show the add post button for guests
        }
        

        document.getElementById("profile-image-navbar").src = user.profile_image;
        document.getElementById("username-navbar").innerHTML = '@' + user.username;
        document.getElementById("profile-image-navbar").style.display = 'block';
        document.getElementById("username-navbar").style.display = 'block';
    }
}


// Auth Functions //

function loginBtnClicked() {
    const username = document.getElementById("login-username-input").value;
    const password = document.getElementById("login-password-input").value;
    console.log("username is " + username + " password is " + password);
    axios.post(`${baseUrl}/login`, {
            "username": username,
            "password": password
    })
    .then((response) => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        const loginModal = document.getElementById("loginModal");
        const loginModalInstance = bootstrap.Modal.getInstance(loginModal)
        loginModalInstance.hide();
        showAlert('You have successfully logged in!', 'success');
        setupUI(); // hide the 'login' and 'register' buttons, and show the 'logout' button
    })
    .catch(error => {
        showAlert(error.response.data.message, 'danger');
    })
}

function registerBtnClicked() {
    const name = document.getElementById("register-name-input").value;
    const username = document.getElementById("register-username-input").value;
    const password = document.getElementById("register-password-input").value;
    const profileImage = document.getElementById("register-profile-image-input").files[0];

    let formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("name", name);
    formData.append("image", profileImage);

    const headers = {
        "Content-Type": "multipart/form-data"
    };

    console.log("name is " + name + " username is " + username + " password is " + password);
    axios.post(`${baseUrl}/register`, formData, 
        {
            "headers": headers
        }
    )
    .then((response) => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        const registerModal = document.getElementById("registerModal");
        const registerModalInstance = bootstrap.Modal.getInstance(registerModal)
        registerModalInstance.hide();
        showAlert('You have successfully registered!', 'success');
        setupUI();
    })
    .catch(error => {
        showAlert(error.response.data.message, 'danger');
    })
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showAlert('You have successfully logged out!', 'success');
    setupUI();
}

// Auth Functions //



function showAlert(message, type) {
    const alertPlaceholder = document.getElementById('successAlert')
    const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert" style="width: 600px;">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
    }

    appendAlert(message, type);

    // Hiding the alert
    // const alertToHide = bootstrap.Alert.getOrCreateInstance('#successAlert')
    // setTimeout(function(){
    //     alertToHide.close();
    // },3000); 
    
}