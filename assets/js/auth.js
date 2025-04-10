document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // Lấy giá trị từ các trường
    let email = document.getElementById('loginEmail').value.trim();
    let password = document.getElementById('loginPassword').value;
    let emailInput = document.getElementById('loginEmail');
    let passwordInput = document.getElementById('loginPassword');
    
    // Reset thông báo lỗi và trạng thái input
    document.getElementById('loginEmailError').textContent = '';
    document.getElementById('loginPasswordError').textContent = '';
    emailInput.classList.remove('invalid');
    passwordInput.classList.remove('invalid');
    
    let isValid = true;
    
    // Validate Email 
    if (!email) {
        document.getElementById('loginEmailError').textContent = 'Email không được để trống';
        emailInput.classList.add('invalid');
        isValid = false;
    } else if (!email.includes('@') || !email.includes('.')) {
        document.getElementById('loginEmailError').textContent = 'Email không hợp lệ';
        emailInput.classList.add('invalid');
        isValid = false;
    }
    
    // Validate Mật khẩu
    if (!password) {
        document.getElementById('loginPasswordError').textContent = 'Mật khẩu không được để trống';
        passwordInput.classList.add('invalid');
        isValid = false;
    }
    
    if (isValid) {
        // kiểm tra tài khoản của admin
        if (email === 'admin@gmail.com' && password === 'admin1234') {
            // sweet alert đăng nhập thành công admin
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Admin đăng nhập thành công !!!",
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                window.location.href = '/assets/pages/admin/dashboard.html';
            });
            return;
        }


        // Kiểm tra tài khoản user thường
        let storedUser = localStorage.getItem('user_' + email);
        if (!storedUser) {
            document.getElementById('loginEmailError').textContent = 'Email chưa được đăng ký';
            emailInput.classList.add('invalid');
            return;
        }
        
        let userData = JSON.parse(storedUser);
        if (userData.password !== password) {
            document.getElementById('loginPasswordError').textContent = 'Mật khẩu không đúng';
            passwordInput.classList.add('invalid');
            return;
        }
        // sweet alert đăng nhập thành công người dùng
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Người dùng đăng nhập thành công !!!",
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            window.location.href = '../../index.html';
        });
        
    }
});
