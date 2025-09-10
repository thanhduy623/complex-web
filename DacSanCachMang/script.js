// Dữ liệu ô chữ 15x15
const grid = [
    ['Y', 'U', 'Ê', 'X', 'A', 'N', 'V', 'A', 'R', 'V', 'K', 'M', 'U', 'Ô', 'Đ'],
    ['L', 'N', 'A', 'X', 'A', 'N', 'N', 'N', 'B', 'G', 'I', 'X', 'K', 'Â', 'C'],
    ['E', 'Q', 'Ư', 'A', 'I', 'E', 'I', 'R', 'A', 'U', 'M', 'Ă', 'N', 'G', 'X'],
    ['Đ', 'K', 'V', 'G', 'C', 'Ă', 'I', 'Ư', 'Y', 'O', 'C', 'D', 'U', 'Ô', 'U'],
    ['Ư', 'H', 'K', 'C', 'H', 'Á', 'O', 'B', 'Ẹ', 'Ô', 'H', 'Ơ', 'Ư', 'E', 'K'],
    ['C', 'O', 'T', 'D', 'È', 'O', 'Ư', 'Đ', 'E', 'D', 'Â', 'X', 'X', 'X', 'Ơ'],
    ['H', 'A', 'I', 'U', 'T', 'U', 'L', 'V', 'Ă', 'U', 'M', 'Ơ', 'Ê', 'Â', 'O'],
    ['B', 'I', 'V', 'Ô', 'H', 'I', 'R', 'G', 'M', 'X', 'X', 'R', 'R', 'N', 'O'],
    ['S', 'M', 'M', 'B', 'Ạ', 'K', 'Ô', 'N', 'U', 'Ô', 'À', 'C', 'M', 'R', 'I'],
    ['S', 'Ì', 'T', 'R', 'C', 'Đ', 'N', 'G', 'Ố', 'Ô', 'O', 'Ơ', 'L', 'Ă', 'Ư'],
    ['T', 'H', 'Ị', 'T', 'H', 'Ộ', 'P', ' V', 'I', 'Ệ', 'T', 'M', 'I', 'N', 'H'],
    ['R', 'Ấ', 'Ô', 'V', 'H', 'K', 'A', 'A', 'V', 'Ư', 'Â', 'N', 'G', 'E', 'K'],
    ['O', 'P', 'Ơ', 'X', 'Ã', 'H', 'V', 'Ê', 'Ừ', 'X', 'T', 'Ắ', 'O', 'H', 'D'],
    ['P', 'D', 'A', 'M', 'N', 'Q', 'Ư', 'B', 'N', 'D', 'T', 'M', 'H', 'B', 'C'],
    ['Ô', 'H', 'X', 'S', 'L', 'O', 'K', 'D', 'G', 'Ơ', 'B', 'L', 'C', 'R', 'P']
];

// Danh sách từ khóa
const keys = [
    { word: "THỊT HỘP VIỆT MINH", start: [11, 1], end: [11, 15] },
    { word: "KHOAI MÌ HẤP", start: [4, 2], end: [13, 2] },
    { word: "CHÈ THẠCH HÃN", start: [4, 5], end: [14, 5] },
    { word: "MUỐI VỪNG", start: [8, 9], end: [15, 9] },
    { word: "CƠM NẮM", start: [9, 14], end: [14, 14] },
    { word: "CHÁO BẸ", start: [5, 4], end: [5, 9] },
    { word: "RAU MĂNG", start: [3, 8], end: [3, 14] },
    { word: "KIM CHÂM XÀO", start: [1, 11], end: [10, 11] }
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
