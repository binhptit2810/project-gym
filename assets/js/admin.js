document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // Lấy giá trị từ các trường
    let email = document.getElementById('loginEmail').value.trim();
    let password = document.getElementById('loginPassword').value;
    // Reset thông báo lỗi
    document.getElementById('loginEmailError').textContent = '';
    document.getElementById('loginPasswordError').textContent = '';
    let isValid = true;
    // Validate Email 
    if (!email) {
        document.getElementById('loginEmailError').textContent = 'Email không được để trống';
        isValid = false;
    } else if (!email.includes('@') || !email.includes('.')) {
        document.getElementById('loginEmailError').textContent = 'Email không hợp lệ';
        isValid = false;
    }
    // Validate Mật khẩu
    if (!password) {
        document.getElementById('loginPasswordError').textContent = 'Mật khẩu không được để trống';
        isValid = false;
    }
    if (isValid) {
        // Kiểm tra nếu là tài khoản admin
        if (email === 'admin@gmail.com' && password === 'admin1234') {
            // alert('Đăng nhập thành công!');
            window.location.href = '/assets/pages/admin/dashboard.html';
            return;
        }

        // Kiểm tra tài khoản user thường
        let storedUser = localStorage.getItem('user_' + email);
        if (!storedUser) {
            document.getElementById('loginEmailError').textContent = 'Email chưa được đăng ký';
            return;
        }
        let userData = JSON.parse(storedUser);
        if (userData.password !== password) {
            document.getElementById('loginPasswordError').textContent = 'Mật khẩu không đúng';
            return;
        }
        alert('Đăng nhập thành công!');
        window.location.href = '/index.html';
    }
});