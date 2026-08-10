const SO_HANG = 15;
const SO_COT = 6;

const SO_LUONG_THEO_COT = [9, 10, 10, 10, 10, 11];

let maTranVanChoi = [];

let khoaBang = false;
let hangChienThangHienTai = null;

let daPhatGanThang = new Set();
let daPhatChienThang = new Set();

let amThanhDangPhat = null;

window.addEventListener("DOMContentLoaded", () => {

    document
        .getElementById("btnTaoMoi")
        .addEventListener(
            "click",
            hienThiPopupXacNhanTaoMoi
        );

    document
        .getElementById("btnHuyTaoMoi")
        .addEventListener(
            "click",
            dongPopupXacNhanTaoMoi
        );

    document
        .getElementById("btnXacNhanTaoMoi")
        .addEventListener(
            "click",
            () => {

                dongPopupXacNhanTaoMoi();

                khoiTaoVanChoi();
            }
        );

    document
        .getElementById("btnDongPopup")
        .addEventListener("click", () => {

            document
                .getElementById("popupChienThang")
                .classList.remove("popup-hien");

            dungTatCaAmThanh();
        });

    khoiTaoVanChoi();
});

/*
====================================================
DỪNG TOÀN BỘ ÂM THANH
====================================================
*/

function dungTatCaAmThanh() {

    const dsAudio =
        document.querySelectorAll("audio");

    dsAudio.forEach(audio => {

        audio.pause();

        audio.currentTime = 0;
    });

    amThanhDangPhat = null;
}

/*
====================================================
PHÁT ÂM THANH ĐỘC QUYỀN
====================================================
*/

function phatAmThanhDocQuyen(idAudio) {

    const audio =
        document.getElementById(idAudio);

    if (!audio) return;

    if (
        amThanhDangPhat &&
        amThanhDangPhat !== audio
    ) {

        amThanhDangPhat.pause();

        amThanhDangPhat.currentTime = 0;
    }

    audio.pause();
    audio.currentTime = 0;

    amThanhDangPhat = audio;

    audio.play().catch(() => {});

    audio.onended = () => {

        if (amThanhDangPhat === audio) {

            amThanhDangPhat = null;
        }
    };
}

/*
====================================================
KHỞI TẠO VÁN CHƠI
====================================================
*/

function khoiTaoVanChoi() {

    dungTatCaAmThanh();

    document
        .getElementById("popupChienThang")
        .classList.remove("popup-hien");

    khoaBang = false;
    hangChienThangHienTai = null;

    daPhatGanThang.clear();
    daPhatChienThang.clear();

    maTranVanChoi = taoMaTranVanChoi();

    hienThiBang();
}

/*
====================================================
TẠO MA TRẬN 15 x 6
====================================================
*/

function taoMaTranVanChoi() {

    const maTran = [];

    for (let hang = 0; hang < SO_HANG; hang++) {

        maTran.push([]);

        for (let cot = 0; cot < SO_COT; cot++) {

            maTran[hang].push({
                so: null,
                coSo: false,
                daChon: false
            });
        }
    }

    taoDanhDauCacViTri(maTran);

    chonNgauNhienCacSo(maTran);

    return maTran;
}

/*
====================================================
MỖI HÀNG ĐÚNG 4 SỐ
====================================================
*/

function taoDanhDauCacViTri(maTran) {

    let taoThanhCong = false;

    while (!taoThanhCong) {

        /*
        reset
        */

        for (let hang = 0; hang < SO_HANG; hang++) {

            for (let cot = 0; cot < SO_COT; cot++) {

                maTran[hang][cot].coSo = false;
            }
        }

        const quotaCot = [9, 10, 10, 10, 10, 11];

        const soTrongHang =
            new Array(SO_HANG).fill(0);

        taoThanhCong = true;

        /*
        Mỗi hàng phải đủ 4 số
        */

        for (let hang = 0; hang < SO_HANG; hang++) {

            for (let lan = 0; lan < 4; lan++) {

                const cotHopLe = [];

                for (
                    let cot = 0;
                    cot < SO_COT;
                    cot++
                ) {

                    if (
                        quotaCot[cot] > 0 &&
                        !maTran[hang][cot].coSo
                    ) {

                        cotHopLe.push(cot);
                    }
                }

                if (
                    cotHopLe.length === 0
                ) {

                    taoThanhCong = false;
                    break;
                }

                const cotDuocChon =
                    cotHopLe[
                        Math.floor(
                            Math.random() *
                            cotHopLe.length
                        )
                    ];

                maTran[hang][cotDuocChon].coSo =
                    true;

                quotaCot[cotDuocChon]--;

                soTrongHang[hang]++;
            }

            if (!taoThanhCong) {
                break;
            }
        }

        if (!taoThanhCong) {
            continue;
        }

        /*
        kiểm tra quota cột
        */

        for (
            let cot = 0;
            cot < SO_COT;
            cot++
        ) {

            if (quotaCot[cot] !== 0) {

                taoThanhCong = false;
                break;
            }
        }

        /*
        kiểm tra hàng
        */

        if (taoThanhCong) {

            for (
                let hang = 0;
                hang < SO_HANG;
                hang++
            ) {

                if (
                    soTrongHang[hang] !== 4
                ) {

                    taoThanhCong = false;
                    break;
                }
            }

            // CHECK
            console.table(
                maTran.map((hang, index) => ({
                    hang: index + 1,
                    soLuong: hang.filter(o => o.coSo).length
                }))
            );
        }
    }
}

/*
====================================================
GÁN SỐ NGẪU NHIÊN
====================================================
*/

function chonNgauNhienCacSo(maTran) {

    const dsSoTheoCot = [
        taoMangSo(1, 9),
        taoMangSo(10, 19),
        taoMangSo(20, 29),
        taoMangSo(30, 39),
        taoMangSo(40, 49),
        taoMangSo(50, 60)
    ];

    dsSoTheoCot.forEach(tronMang);

    for (let cot = 0; cot < SO_COT; cot++) {

        let indexSo = 0;

        for (let hang = 0; hang < SO_HANG; hang++) {

            if (maTran[hang][cot].coSo) {

                maTran[hang][cot].so =
                    dsSoTheoCot[cot][indexSo];

                indexSo++;
            }
        }
    }
}

/*
====================================================
HIỂN THỊ BẢNG
====================================================
*/

function hienThiBang() {

    const bang =
        document.getElementById("bangLoTo");

    bang.innerHTML = "";

    maTranVanChoi.forEach((duLieuHang, chiSoHang) => {

        const divHang =
            document.createElement("div");

        divHang.className = "hang";

        if (
            chiSoHang === 2 ||
            chiSoHang === 5 ||
            chiSoHang === 8 ||
            chiSoHang === 11
        ) {
            divHang.classList.add("hang-ngat");
        }

        duLieuHang.forEach((o, chiSoCot) => {

            const divO =
                document.createElement("div");

            divO.className = "o-so";

            if (o.so === null) {

                divO.classList.add("o-rong");

            } else {

                divO.textContent = o.so;

                if (o.daChon) {

                    divO.classList.add("o-da-chon");
                }

                divO.addEventListener(
                    "click",
                    () => xuLyChonO(
                        chiSoHang,
                        chiSoCot
                    )
                );
            }

            divHang.appendChild(divO);
        });

        bang.appendChild(divHang);
    });

    theoDoiTrangThaiChon();
}

/*
====================================================
CHỌN Ô
====================================================
*/

function xuLyChonO(hang, cot) {

    const o =
        maTranVanChoi[hang][cot];

    if (o.so === null) {
        return;
    }

    if (
        khoaBang &&
        hang !== hangChienThangHienTai
    ) {
        return;
    }

    o.daChon = !o.daChon;

    hienThiBang();
}

/*
====================================================
THEO DÕI TRẠNG THÁI

3 số = gần thắng
4 số = thắng
====================================================
*/

function theoDoiTrangThaiChon() {

    const cacHang =
        document.querySelectorAll(".hang");

    let coHangChienThang = false;

    cacHang.forEach((elementHang, indexHang) => {

        let tongDaChon = 0;

        const daySo = [];

        maTranVanChoi[indexHang].forEach(o => {

            if (o.so !== null) {

                daySo.push(o.so);

                if (o.daChon) {

                    tongDaChon++;
                }
            }
        });

        elementHang.classList.remove(
            "hang-gan-thang",
            "hang-chien-thang"
        );

        if (tongDaChon === 3) {

            elementHang.classList.add(
                "hang-gan-thang"
            );

            if (!daPhatGanThang.has(indexHang)) {

                daPhatGanThang.add(indexHang);

                phatAmThanhGanThang();
            }

        } else {

            daPhatGanThang.delete(indexHang);
        }

        if (tongDaChon === 4) {

            elementHang.classList.add(
                "hang-chien-thang"
            );

            coHangChienThang = true;

            hangChienThangHienTai =
                indexHang;

            if (!daPhatChienThang.has(indexHang)) {

                daPhatChienThang.add(indexHang);

                phatAmThanhChienThang();

                hienThiThongBaoChienThang(
                    daySo
                );
            }

        } else {

            daPhatChienThang.delete(indexHang);
        }
    });

    khoaBang = coHangChienThang;

    if (!coHangChienThang) {

        hangChienThangHienTai = null;
    }
}

/*
====================================================
POPUP CHIẾN THẮNG
====================================================
*/

function hienThiThongBaoChienThang(daySo) {

    document
        .getElementById("daySoChienThang")
        .textContent =
        daySo.join(" - ");

    document
        .getElementById("popupChienThang")
        .classList.add("popup-hien");
}

/*
====================================================
POPUP XÁC NHẬN TẠO MỚI
====================================================
*/

function hienThiPopupXacNhanTaoMoi() {

    document
        .getElementById("popupXacNhan")
        .classList.add("popup-hien");
}

function dongPopupXacNhanTaoMoi() {

    document
        .getElementById("popupXacNhan")
        .classList.remove("popup-hien");
}

/*
====================================================
ÂM THANH
====================================================
*/

function phatAmThanhGanThang() {

    phatAmThanhDocQuyen(
        "soundGanThang"
    );
}

function phatAmThanhChienThang() {

    phatAmThanhDocQuyen(
        "soundChienThang"
    );
}

/*
====================================================
HÀM HỖ TRỢ
====================================================
*/

function taoMangSo(min, max) {

    const ds = [];

    for (let i = min; i <= max; i++) {

        ds.push(i);
    }

    return ds;
}

function tronMang(mang) {

    for (
        let i = mang.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [mang[i], mang[j]] =
            [mang[j], mang[i]];
    }
}