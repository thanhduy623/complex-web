
// ===================================================
// 🔹 Lấy dữ liệu từ Google Apps Script
// ===================================================
let countSuccess = 0;
let countError = 0;
let countTotal = 0;
let studentList = [];
const GAS_BASE_URL = "https://script.google.com/macros/s/AKfycbxkSeUsdA2B4sXoctEII2_gspAmUmwqiKzfNHXsyxNG5W_zvpozP28AGeSkc6Wv6zYyBw/exec"; // ← Thay bằng URL thật



// ===================================================
// 🔹 Nạp dữ liệu cấu hình từ getShow
// ===================================================
fetch(`${GAS_BASE_URL}?action=getShow`)
    .then(response => response.json())
    .then(data => {
        // 🔹 Cập nhật nội dung văn bản
        document.getElementById('name-up').textContent = data['name-up'] || '';
        document.getElementById('name-current').textContent = data['name-current'] || '';
        document.getElementById('event-type').textContent = data['event-type'] || '';
        document.getElementById('event-name').textContent = data['event-name'] || '';
        document.getElementById('event-date').textContent = data['event-date'] || '';

        // 🔹 Thiết lập biến CSS từ dữ liệu nếu có
        const root = document.documentElement;

        if (data['color-primary']) {
            const colorPrimary = data['color-primary'].startsWith('#')
                ? data['color-primary']
                : `#${data['color-primary']}`;
            root.style.setProperty('--color-primary', colorPrimary);
        }

        if (data['color-secondary']) {
            const colorSecondary = data['color-secondary'].startsWith('#')
                ? data['color-secondary']
                : `#${data['color-secondary']}`;
            root.style.setProperty('--color-secondary', colorSecondary);
        }

        // 🔹 Cập nhật logo nếu có
        if (data.logo) {
            document.getElementById('logo').src = data.logo;
        }

        // 🔹 Cập nhật background nếu có
        if (data.background) {
            document.body.style.backgroundImage = `url(${data.background})`;
        }
    })
    .catch(error => console.error('❌ Lỗi khi tải cấu hình:', error));

// ===================================================
// 🔹 Lấy dữ liệu sinh viên từ getData
// ===================================================
fetch(`${GAS_BASE_URL}?action=getData`)
    .then(response => response.json())
    .then(data => {
        studentList = data;
        console.log("✅ Đã tải dữ liệu sinh viên!");
    })
    .catch(error => console.error("❌ Lỗi khi tải dữ liệu sinh viên:", error));

// ===================================================
// 🔹 Xử lý nhập MSSV
// ===================================================
window.onload = () => {
    const input = document.getElementById('mssv');
    input.focus();
    input.addEventListener('input', handleInput);
};

let lastValue = '';

function handleInput(e) {
    const input = e.target;
    let value = input.value.trim();

    if (value.length === 8 && lastValue.length !== 8) {
        handleCheckMSSV(value);
    }

    if (value.length > 8) {
        const newStart = value.slice(-1);
        input.value = newStart;
        input.classList.add('flash');
        requestAnimationFrame(() => input.classList.remove('flash'));
        input.focus();
    }

    lastValue = input.value;
}

// ===================================================
// 🔹 Xử lý kiểm tra MSSV
// ===================================================
function handleCheckMSSV(mssv) {
    const student = studentList.find(item => item.mssv === mssv);

    if (student) {
        displayStudent(student);
        postAttendance(student.mssv);
    } else {
        displayNotFound(mssv);
    }
}

// ===================================================
// 🔹 Hiển thị dữ liệu sinh viên
// ===================================================
function displayStudent(student) {
    document.getElementById('name').textContent = "Đồng chí: " + student.name;
    document.getElementById('birthday').textContent = student.birthday || "-";
    document.getElementById('faculty').textContent = student.faculty || "-";
    document.getElementById('position').textContent = student.position || "-";
    document.getElementById('location').textContent = student.location || "-";
}

// ===================================================
// 🔹 Hiển thị khi không tìm thấy
// ===================================================
function displayNotFound(mssv) {
    document.getElementById('name').textContent = "Đồng chí: Không tìm thấy dữ liệu";
    document.getElementById('birthday').textContent = "Không tồn tại";
    document.getElementById('faculty').textContent = "Không tồn tại";
    document.getElementById('position').textContent = "Không tồn tại";
    document.getElementById('location').textContent = "Không tồn tại";
}

// ===================================================
// 🔹 Tính checksum request
// ===================================================
function updateCheckSum() {
    document.getElementById('sum-success').textContent = countSuccess;
    document.getElementById('sum-error').textContent = countError;
    document.getElementById('sum-total').textContent = countTotal;
}

// ===================================================
// 🔹 Gửi điểm danh lên Google Apps Script
// ===================================================
function postAttendance(mssv) {
    const payload = new URLSearchParams({
        mssv: mssv,
        eventName: document.getElementById('event-name').textContent,
        timestamp: new Date().toISOString()
    });

    countTotal++;
    updateCheckSum();

    fetch(GAS_BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: payload.toString()
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                countSuccess++;
                console.log("✅ Điểm danh thành công:", mssv);
            } else {
                countError++;
                console.warn("⚠️ Gặp lỗi khi điểm danh:", data.message);
            }

            updateCheckSum();
        })
        .catch(err => {
            countError++;
            updateCheckSum();
            console.error("❌ Lỗi khi gửi điểm danh:", err);
        });
}
