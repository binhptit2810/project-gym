// Khởi tạo các biến
let schedules = JSON.parse(localStorage.getItem('schedules')) || [];
let myChart = null;

// Hàm format ngày tháng
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

// Hàm đếm số lượng lịch theo loại
function countSchedulesByType() {
    const counts = {
        gym: 0,
        yoga: 0,
        zumba: 0
    };

    schedules.forEach(schedule => {
        const classType = schedule.class.toLowerCase();
        if (classType in counts) {
            counts[classType]++;
        }
    });

    return counts;
}

// Hàm khởi tạo biểu đồ
function initChart(counts) {
    const ctx = document.getElementById('myChart');
    if (!ctx) {
        console.error('Không tìm thấy canvas element');
        return;
    }
    
    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Gym', 'Yoga', 'Zumba'],
            datasets: [{
                label: 'Số lượng lịch đặt',
                data: [counts.gym, counts.yoga, counts.zumba],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.5)',  // Màu xanh cho Gym
                    'rgba(75, 192, 192, 0.5)',   // Màu xanh lá cho Yoga  
                    'rgba(153, 102, 255, 0.5)'   // Màu tím cho Zumba
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
}

// Hàm cập nhật số liệu thống kê và biểu đồ
function updateStats() {
    const counts = countSchedulesByType();
    
    // Cập nhật số liệu
    document.getElementById('gymCount').textContent = counts.gym;
    document.getElementById('yogaCount').textContent = counts.yoga;
    document.getElementById('zumbaCount').textContent = counts.zumba;

    // Cập nhật biểu đồ
    initChart(counts);
}

// Hàm hiển thị danh sách lịch
function displaySchedules() {
    const tableBody = document.getElementById('scheduleTableBody');
    if (!tableBody) {
        console.error('Không tìm thấy table body element');
        return;
    }
    
    tableBody.innerHTML = '';

    // Lấy giá trị tìm kiếm và lọc
    const searchEmail = document.getElementById('searchEmail')?.value.toLowerCase() || '';
    const filterClass = document.getElementById('filterClass')?.value || '';

    // Lọc dữ liệu
    const filteredSchedules = schedules.filter(schedule => {
        const matchEmail = schedule.email.toLowerCase().includes(searchEmail);
        const matchClass = !filterClass || schedule.class.toLowerCase() === filterClass.toLowerCase();
        return matchEmail && matchClass;
    });

    // Hiển thị dữ liệu đã lọc
    filteredSchedules.forEach((schedule, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${schedule.class}</td>
            <td>${formatDate(schedule.date)}</td>
            <td>${schedule.time}</td>
            <td>${schedule.name}</td>
            <td>${schedule.email}</td>
            <td>
                <button class="btn btn-link text-decoration-none" onclick="editSchedule(${index})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-link text-decoration-none text-danger" onclick="deleteSchedule(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Cập nhật thống kê và biểu đồ
    updateStats();
}

// Hàm xóa lịch
function deleteSchedule(index) {
    Swal.fire({
        title: "Bạn có muốn xoá không?",
        text: "Bạn sẽ không thể hủy bỏ!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Có, xóa nó",
        cancelButtonText: "Hủy"
    }).then((result) => {
        if (result.isConfirmed) {
            schedules.splice(index, 1);
            localStorage.setItem('schedules', JSON.stringify(schedules));
            displaySchedules();
            
            Swal.fire({
                title: "Đã xóa!",
                text: "Lịch tập đã được xóa thành công.",
                icon: "success"
            });
        }
    });
}

// Hàm sửa lịch
function editSchedule(index) {
    window.location.href = `/assets/pages/booking/schedule.html?edit=${index}`;
}

// Khởi tạo trang khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    // Thêm sự kiện cho ô tìm kiếm
    const searchEmail = document.getElementById('searchEmail');
    if (searchEmail) {
        searchEmail.addEventListener('input', displaySchedules);
    }
    
    // Thêm sự kiện cho bộ lọc
    const filterClass = document.getElementById('filterClass');
    if (filterClass) {
        filterClass.addEventListener('change', displaySchedules);
    }
    
    // Hiển thị dữ liệu ban đầu
    displaySchedules();
});