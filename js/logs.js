// Form Login
const form_login = document.getElementById("form_login");
if (form_login) {
    form_login.onsubmit = async function (e) {
    e.preventDefault();
    // Initialize Btn and Form
    const btn_submit = document.querySelector("#form_login button[type='submit']");
    const formData = new FormData(form_login);
    // Disable Login Btn
    btn_submit.innerHTML = '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...';
    btn_submit.disabled = true;
    // Use credential to check database


    var email = document.getElementsByName("email")[0].value;
    var password = document.getElementsByName("password")[0].value;

    // Perform login validation
    if (email === "email" && password === "pass") {
        // Login successful
        // Redirect the user to the application logs page or perform any other desired action
       getPrompts();
      } else {
        // Login failed
        // Display an error message or perform any other desired action
        alert("Invalid email or password. Please try again.");

        btn_submit.innerHTML = 'Login';
        btn_submit.disabled = false;
        return;
      }
      


   
    // Store Token for Backend Laravel API access
    //sessionStorage.setItem('token', response.token);
    alertMessages("success", "Successfully logged in account!");
    // Hide Login Form and Show Prompts Table
    const div_login = document.getElementById("div_login");
    const div_prompts = document.getElementById("div_prompts");
    div_login.classList.add('d-none');
    div_prompts.classList.remove('d-none');
    div_prompts.classList.add('d-flex');
    // Enable Login Btn
    btn_submit.innerHTML = 'Login';
    btn_submit.disabled = false;
    // Load Table
    getPrompts();
  };
}

// Btn Logout
const btn_logout = document.getElementById('btn_logout');
if (btn_logout) {
    btn_logout.onclick = async function () {
        alertMessages("success", "Successfully logged out account!");
        btn_logout.innerHTML = '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...';
        btn_logout.disabled = true;

        const div_login = document.getElementById("div_login");
        const div_prompts = document.getElementById("div_prompts");
        div_login.classList.remove('d-none');
        div_login.classList.add('d-flex');
        div_prompts.classList.remove('d-flex');
        div_prompts.classList.add('d-none');
        // Clear Login Form Fields
        const field_email = document.querySelector("#form_login input[name='email']");
        const field_password = document.querySelector("#form_login input[name='password']");
        const invalid_email = document.getElementById("invalid_email");
        const invalid_password = document.getElementById("invalid_password");
        invalid_email.innerHTML = '';
        field_email.value = '';
        field_email.classList.remove('is-invalid');
        invalid_password.innerHTML = '';
        field_password.value = '';
        field_password.classList.remove('is-invalid');
        // Enable Logout Btn
        btn_logout.innerHTML = 'Logout';
        btn_logout.disabled = false;
    }
}

// Read Prompts from SupaBase
async function getPrompts () {
    const response = await window.axios.supaBase('get');

    let htmlResult = '';
    Object.keys(response).forEach(count => {
        let created_at = new Date(response[count].created_at).toLocaleString('en-US', { timeZone: 'Asia/Manila' });
        htmlResult += '<tr>' +
            '<th scope="row">' +  response[count].prompt_id + '</th>' +
            '<td>' + response[count].sentence + '</td>' +
            '<td>' + response[count].sentence_corrected + '</td>' +
            '<td>' + created_at + '</td>' +
            '<td>' + 
                '<div class="btn-group" role="group">' +
                    '<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">' +
                        'Action' +
                    '</button>' +
                    '<ul class="dropdown-menu">' +
                        '<li><a id="btn_prompts_del" class="dropdown-item" href="#" name="' + response[count].prompt_id + '">Remove</a></li>' +
                    '</ul>' +
                '</div>' +
        '</tr>';
    });
    // Display Result in Table
    const tbody = document.getElementById('tbl_prompts');
    tbody.innerHTML = htmlResult;
}

// Set Btn Delete Prompt Click functionality from Table Prompts
const tbl_prompts = document.getElementById('tbl_prompts');
if (tbl_prompts) {
    tbl_prompts.onclick = async function (e) {
        if(e.target && e.target.id == "btn_prompts_del") {
            const id = e.target.name;
            const response = await window.axios.supaBase('delete', id);
            console.log(response);
            
            alertMessages("success", "Successfully deleted id " + id + '!');
            getPrompts();
        }
    };
}
