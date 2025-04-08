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
        // alert('Đăng nhập thành công!');
        window.location.href = '/index.html';
    }
});

// Khởi tạo các biến
let currentPage = 1;
const itemsPerPage = 5;
let filteredSchedules = [];

// Lấy dữ liệu từ localStorage
let schedules = JSON.parse(localStorage.getItem('schedules')) || [];

// Hàm format ngày tháng
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

// Hàm hiển thị danh sách lịch
function displaySchedules() {
    const tableBody = document.getElementById('scheduleTableBody');
    tableBody.innerHTML = '';

    // Tính toán phân trang
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedSchedules = filteredSchedules.slice(startIndex, endIndex);

    // Hiển thị dữ liệu
    paginatedSchedules.forEach((schedule, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${schedule.class}</td>
            <td>${formatDate(schedule.date)}</td>
            <td>${schedule.time}</td>
            <td>${schedule.name}</td>
            <td>${schedule.email}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editSchedule(${startIndex + index})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="action-btn delete-btn" onclick="deleteSchedule(${startIndex + index})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Hiển thị phân trang
    displayPagination();
}

// Hàm hiển thị phân trang
function displayPagination() {
    const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);
    const pageNumbers = document.getElementById('pageNumbers');
    pageNumbers.innerHTML = '';

    // Hiển thị nút Previous
    document.getElementById('prevPage').disabled = currentPage === 1;

    // Hiển thị các số trang
    for (let i = 1; i <= totalPages; i++) {
        const pageNumber = document.createElement('button');
        pageNumber.className = `page-number ${i === currentPage ? 'active' : ''}`;
        pageNumber.textContent = i;
        pageNumber.onclick = () => {
            currentPage = i;
            displaySchedules();
        };
        pageNumbers.appendChild(pageNumber);
    }

    // Hiển thị nút Next
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

// Hàm tìm kiếm và lọc
function filterSchedules() {
    const searchEmail = document.getElementById('searchEmail').value.toLowerCase();
    const filterClass = document.getElementById('filterClass').value;

    filteredSchedules = schedules.filter(schedule => {
        const matchEmail = schedule.email.toLowerCase().includes(searchEmail);
        const matchClass = !filterClass || schedule.class === filterClass;
        return matchEmail && matchClass;
    });

    currentPage = 1;
    displaySchedules();
}

// Hàm xóa lịch
function deleteSchedule(index) {
    Swal.fire({
        title: "Bạn có chắc chắn muốn xóa?",
        text: "Bạn sẽ không thể hoàn tác sau khi xóa!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy"
    }).then((result) => {
        if (result.isConfirmed) {
            schedules.splice(index, 1);
            localStorage.setItem('schedules', JSON.stringify(schedules));
            filteredSchedules = [...schedules];
            displaySchedules();
            updateStats();
            createChart();
            
            Swal.fire(
                "Đã xóa!",
                "Lịch tập đã được xóa thành công.",
                "success"
            );
        }
    });
}

// Hàm sửa lịch
function editSchedule(index) {
    const schedule = schedules[index];
    // Chuyển hướng đến trang đặt lịch với dữ liệu cần sửa
    window.location.href = `/assets/pages/booking/schedule.html?edit=${index}`;
}

// Hàm đếm số lượng lịch theo loại
function countSchedulesByType() {
    const counts = {
        gym: 0,
        yoga: 0,
        zumba: 0
    };

    schedules.forEach(schedule => {
        if (schedule.class.toLowerCase() in counts) {
            counts[schedule.class.toLowerCase()]++;
        }
    });

    return counts;
}

// Cập nhật số liệu thống kê
function updateStats() {
    const counts = countSchedulesByType();
    
    document.getElementById('gymCount').textContent = counts.gym;
    document.getElementById('yogaCount').textContent = counts.yoga;
    document.getElementById('zumbaCount').textContent = counts.zumba;
}

// Tạo biểu đồ
function createChart() {
    const ctx = document.getElementById('scheduleChart').getContext('2d');
    const counts = countSchedulesByType();
    
    // Xóa biểu đồ cũ nếu tồn tại
    if (window.myChart instanceof Chart) {
        window.myChart.destroy();
    }
    
    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Thống kê Gym', 'Thống kê Yoga', 'Thống kê Zumba'],
            datasets: [{
                data: [counts.gym, counts.yoga, counts.zumba],
                backgroundColor: [
                    'rgba(147, 197, 253, 0.5)',  // Light blue
                    'rgba(167, 243, 208, 0.5)',   // Light green
                    'rgba(196, 181, 253, 0.5)'    // Light purple
                ],
                borderWidth: 0,
                barThickness: 40
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#E5E7EB'
                    },
                    ticks: {
                        stepSize: 1,
                        font: {
                            size: 12
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

// Thêm sự kiện cho các nút phân trang
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displaySchedules();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displaySchedules();
    }
});

// Thêm sự kiện cho ô tìm kiếm và bộ lọc
document.getElementById('searchEmail').addEventListener('input', filterSchedules);
document.getElementById('filterClass').addEventListener('change', filterSchedules);

// Khởi tạo trang
function initializeDashboard() {
    filteredSchedules = [...schedules];
    updateStats();
    createChart();
    displaySchedules();
}

// Gọi hàm khởi tạo khi trang được tải
document.addEventListener('DOMContentLoaded', initializeDashboard);