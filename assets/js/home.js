// Hàm cập nhật dịch vụ trên trang chủ
function updateHomeServices() {
    // Lấy dữ liệu dịch vụ từ localStorage
    const services = JSON.parse(localStorage.getItem('services')) || [];

    // Lấy container chứa các card dịch vụ
    const cardContainer = document.querySelector('.row');
    if (!cardContainer) return;
    // Xóa tất cả card hiện tại
    cardContainer.innerHTML = '';

    // Tạo card mới cho mỗi dịch vụ
    services.forEach(service => {
        const cardHtml = `
            <div class="col-md-4">
                <div class="card">
                    <img src="${service.image}" class="card-img-top" alt="${service.name}">
                    <div class="card-body">
                        <h5 class="card-title">${service.name}</h5>
                        <p class="card-text">${service.description}</p>
                        <a href="/assets/pages/booking/schedule.html" class="btn btn-primary">Đặt lịch</a>
                    </div>
                </div>
            </div>
        `;
        cardContainer.innerHTML += cardHtml;
    });
}

// Gọi hàm cập nhật khi trang được tải
document.addEventListener('DOMContentLoaded', updateHomeServices); 