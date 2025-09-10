// Dữ liệu ô chữ 15x15
// Dữ liệu ô chữ 15x15
const grid = [
    ['Y', 'L', 'E', 'Đ', 'Ư', 'C', 'H', 'B', 'S', 'S', 'T', 'R', 'O', 'P', 'Ô'],
    ['U', 'N', 'Q', 'K', 'H', 'O', 'A', 'I', 'M', 'Ì', 'H', 'Ấ', 'P', 'D', 'H'],
    ['Ê', 'A', 'Ư', 'V', 'K', 'T', 'I', 'V', 'M', 'T', 'Ị', 'Ô', 'Ơ', 'A', 'X'],
    ['X', 'X', 'A', 'G', 'C', 'D', 'U', 'Ô', 'B', 'R', 'T', 'V', 'X', 'M', 'S'],
    ['A', 'A', 'I', 'C', 'H', 'È', 'T', 'H', 'Ạ', 'C', 'H', 'H', 'Ã', 'N', 'L'],
    ['N', 'N', 'E', 'Ă', 'Á', 'O', 'U', 'I', 'K', 'Đ', 'Ộ', 'K', 'H', 'Q', 'O'],
    ['V', 'N', 'I', 'I', 'O', 'Ư', 'L', 'R', 'Ô', 'N', 'P', 'A', 'V', 'Ư', 'K'],
    ['A', 'N', 'R', 'Ư', 'B', 'Đ', 'V', 'G', 'N', 'G', 'V', 'A', 'Ê', 'B', 'D'],
    ['R', 'B', 'A', 'Y', 'Ẹ', 'E', 'Ă', 'M', 'U', 'Ố', 'I', 'V', 'Ừ', 'N', 'G'],
    ['V', 'G', 'U', 'O', 'Ô', 'D', 'U', 'X', 'Ô', 'Ô', 'Ệ', 'Ư', 'X', 'D', 'Ơ'],
    ['K', 'I', 'M', 'C', 'H', 'Â', 'M', 'X', 'À', 'O', 'T', 'Â', 'T', 'T', 'B'],
    ['M', 'X', 'Ă', 'D', 'Ơ', 'X', 'Ơ', 'R', 'C', 'Ơ', 'M', 'N', 'Ắ', 'M', 'L'],
    ['U', 'K', 'N', 'U', 'Ư', 'X', 'Ê', 'R', 'M', 'L', 'I', 'G', 'O', 'H', 'C'],
    ['Ô', 'Â', 'G', 'Ô', 'E', 'X', 'Â', 'N', 'R', 'Ă', 'N', 'E', 'H', 'B', 'R'],
    ['Đ', 'C', 'X', 'U', 'K', 'Ơ', 'O', 'O', 'I', 'Ư', 'H', 'K', 'D', 'C', 'P'],
];

// Danh sách từ khóa
const keys = [
    { word: "THỊT HỘP VIỆT MINH", start: [1, 11], end: [15, 11] },
    { word: "KHOAI MÌ HẤP", start: [2, 4], end: [2, 13] },
    { word: "CHÈ THẠCH HÃN", start: [5, 4], end: [5, 14] },
    { word: "MUỐI VỪNG", start: [9, 8], end: [9, 15] },
    { word: "CƠM NẮM", start: [12, 9], end: [12, 14] },
    { word: "CHÁO BẸ", start: [4, 5], end: [9, 5] },
    { word: "RAU MĂNG", start: [8, 3], end: [14, 3] },
    { word: "KIM CHÂM XÀO", start: [11, 1], end: [11, 10] }
];

let foundKeys = new Set();
let startTime = new Date();

// Âm thanh
const soundCorrect = new Audio("sounding-correct.mp3");
const soundWinner = new Audio("sounding-winner.mp3");

// Render bảng
const crossword = document.getElementById("crossword");

for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.textContent = grid[i][j];
        cell.dataset.row = i + 1;
        cell.dataset.col = j + 1;
        cell.addEventListener("click", handleClick);
        crossword.appendChild(cell);
    }
}

function handleClick(e) {
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);

    let foundNew = false;

    keys.forEach(key => {
        if (isInsideWord(row, col, key)) {
            if (!foundKeys.has(key.word)) {
                foundNew = true; // vừa tìm ra từ mới
            }
            highlightWord(key);
            foundKeys.add(key.word);
        }
    });

    if (foundNew) {
        if (foundKeys.size === keys.length) {
            // đủ 8/8 -> phát winner + popup
            soundWinner.play();
            showPopup();
        } else {
            // chưa đủ -> phát correct
            soundCorrect.play();
        }
    }
}

function isInsideWord(row, col, key) {
    const [r1, c1] = key.start;
    const [r2, c2] = key.end;

    if (r1 === r2) {
        return row === r1 && col >= Math.min(c1, c2) && col <= Math.max(c1, c2);
    }
    if (c1 === c2) {
        return col === c1 && row >= Math.min(r1, r2) && row <= Math.max(r1, r2);
    }
    return false;
}

function highlightWord(key) {
    const [r1, c1] = key.start;
    const [r2, c2] = key.end;

    if (r1 === r2) { // ngang
        for (let c = Math.min(c1, c2); c <= Math.max(c1, c2); c++) {
            const cell = document.querySelector(`.cell[data-row="${r1}"][data-col="${c}"]`);
            if (cell) cell.classList.add("found");
        }
    } else if (c1 === c2) { // dọc
        for (let r = Math.min(r1, r2); r <= Math.max(r1, r2); r++) {
            const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c1}"]`);
            if (cell) cell.classList.add("found");
        }
    }
}

function showPopup() {
    const finishTime = new Date();
    const hh = String(finishTime.getHours()).padStart(2, "0");
    const mm = String(finishTime.getMinutes()).padStart(2, "0");
    const ss = String(finishTime.getSeconds()).padStart(2, "0");

    // Thời gian hoàn thành (chỉ giờ:phút:giây)
    document.getElementById("time-finish").textContent =
        "Thời gian hoàn thành: " + hh + ":" + mm + ":" + ss;

    // Timestamp (ngày + giờ đầy đủ)
    const day = String(finishTime.getDate()).padStart(2, "0");
    const month = String(finishTime.getMonth() + 1).padStart(2, "0");
    const year = finishTime.getFullYear();
    document.getElementById("time-stamp").textContent =
        "Hoàn thành lúc: " + day + "/" + month + "/" + year + " " + hh + ":" + mm + ":" + ss;

    document.getElementById("popup").classList.remove("hidden");
}

function closePopup() {
    document.getElementById("popup").classList.add("hidden");
}


