// Khởi tạo mảng lưu trữ dịch vụ
let services = JSON.parse(localStorage.getItem('services')) || [];

// Thêm dữ liệu mẫu nếu chưa có dữ liệu
if (services.length === 0) {
    services = [
        {
            name: "Gym",
            description: "Tập luyện với các thiết bị hiện đại",
            image: "/assets/img/gym1.png"
        },
        {
            name: "Yoga",
            description: "Thư giãn và cải thiện tâm trí",
            image: "/assets/img/gym2.png"
        },
        {
            name: "Zumba",
            description: "Đốt cháy calories với những điệu nhảy sôi động",
            image: "/assets/img/gym3.png"
        }
    ];
    localStorage.setItem('services', JSON.stringify(services));
    updateHomePageServices();
}

// Hàm cập nhật dịch vụ ở trang chủ
function updateHomePageServices() {
    // Cập nhật các card ở trang chủ
    const cards = document.querySelectorAll('.card');
    if (cards.length > 0) {
        services.forEach((service, index) => {
            if (cards[index]) {
                const card = cards[index];
                card.querySelector('.card-img-top').src = service.image;
                card.querySelector('.card-img-top').alt = service.name;
                card.querySelector('.card-title').textContent = service.name;
                card.querySelector('.card-text').textContent = service.description;
            }
        });
    }
}

// Hàm hiển thị danh sách dịch vụ
function displayServices() {
    const tableBody = document.getElementById('serviceTableBody');
    tableBody.innerHTML = '';
    
    services.forEach((service, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${service.name}</td>
            <td>${service.description}</td>
            <td>
                <img src="${service.image}" alt="${service.name}" style="width: 100px; height: 60px; object-fit: cover;">
            </td>
            <td>
                <button class="btn btn-link text-decoration-none" onclick="editService(${index})">Sửa</button>
                <button class="btn btn-link text-decoration-none text-danger" onclick="deleteService(${index})">Xóa</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Hàm hiển thị form thêm dịch vụ
function showServiceForm() {
    document.getElementById('serviceForm').reset();
    document.querySelector('.modal-title').textContent = 'Thêm dịch vụ mới';
    document.getElementById('serviceForm').removeAttribute('data-edit-index');
    document.getElementById('serviceFormModal').style.display = 'block';
}

// Hàm ẩn form
function hideServiceForm() {
    document.getElementById('serviceFormModal').style.display = 'none';
    // Reset form và thông báo lỗi
    document.getElementById('serviceForm').reset();
    document.querySelectorAll('.error').forEach(error => error.textContent = '');
}

// Hàm sửa dịch vụ
function editService(index) {
    const service = services[index];
    document.querySelector('.modal-title').textContent = 'Sửa dịch vụ';
    document.getElementById('serviceName').value = service.name;
    document.getElementById('serviceDescription').value = service.description;
    document.getElementById('serviceImage').value = service.image;
    document.getElementById('serviceForm').setAttribute('data-edit-index', index);
    document.getElementById('serviceFormModal').style.display = 'block';
}

// Hàm xóa dịch vụ
function deleteService(index) {
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
            services.splice(index, 1);
            localStorage.setItem('services', JSON.stringify(services));
            displayServices();
            updateHomePageServices();
            Swal.fire({
                title: "Đã xóa!",
                text: "Dịch vụ đã được xóa thành công.",
                icon: "success"
            });
        }
    });
}

// Xử lý submit form
document.getElementById('serviceForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Lấy giá trị từ form
    const name = document.getElementById('serviceName').value.trim();
    const description = document.getElementById('serviceDescription').value.trim();
    const image = document.getElementById('serviceImage').value.trim();
    
    // Reset thông báo lỗi
    document.querySelectorAll('.error').forEach(error => error.textContent = '');
    
    let isValid = true;
    
    // Validate dữ liệu
    if (!name) {
        document.getElementById('serviceNameError').textContent = 'Tên dịch vụ không được để trống';
        isValid = false;
    }
    
    if (!description) {
        document.getElementById('serviceDescriptionError').textContent = 'Mô tả không được để trống';
        isValid = false;
    }
    
    if (!image) {
        document.getElementById('serviceImageError').textContent = 'URL hình ảnh không được để trống';
        isValid = false;
    }
    
    if (isValid) {
        const newService = { name, description, image };
        const editIndex = this.getAttribute('data-edit-index');
        
        if (editIndex !== null) {
            // Cập nhật dịch vụ
            services[editIndex] = newService;
        } else {
            // Thêm dịch vụ mới
            services.push(newService);
        }
        
        // Lưu vào localStorage và cập nhật giao diện
        localStorage.setItem('services', JSON.stringify(services));
        displayServices();
        updateHomePageServices();
        hideServiceForm();
        
        // Hiển thị thông báo thành công
        Swal.fire({
            title: editIndex !== null ? "Đã cập nhật!" : "Đã thêm!",
            text: editIndex !== null ? "Dịch vụ đã được cập nhật thành công." : "Dịch vụ mới đã được thêm thành công.",
            icon: "success"
        });
    }
});

// Hiển thị danh sách khi trang được tải
displayServices();

// Thêm sự kiện đóng modal khi click bên ngoài
window.onclick = function(event) {
    const modal = document.getElementById('serviceFormModal');
    if (event.target == modal) {
        hideServiceForm();
    }
} 