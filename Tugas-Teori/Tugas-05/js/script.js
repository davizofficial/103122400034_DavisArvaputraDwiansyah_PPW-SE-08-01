/**
 * Puskesmas Sehat - Main JavaScript & jQuery Script
 * Praktikum Perancangan dan Pemrograman Web (Tugas-05)
 * 
 * Implementasi:
 * 1. Vanilla JavaScript:
 *    - Array of Objects: daftarDokter & antreanPasien
 *    - Fungsi Pemrosesan Data: hitungTotalDokter, filterDokter, sortDokter, tambahPasien, hapusPasien, hitungAntreanAktif
 *    - Struktur Kendali: Perulangan (forEach/for) dan Percabangan (if/else) untuk dynamic DOM rendering
 * 2. jQuery:
 *    - Event Handling: click, submit, keyup, change
 *    - Efek & Animasi: slideToggle, fadeIn, fadeOut, animate (smooth scroll)
 *    - Interaksi Dinamis: Tambah data pendaftaran & Hapus baris antrean pasien dengan animasi
 */

/* ==========================================================================
   1. DATA LAYER (VANILLA JS - ARRAY OF OBJECTS)
   ========================================================================== */

/**
 * Data dummy master daftar dokter & jadwal praktik
 * @type {Array<Object>}
 */
const daftarDokter = [
    {
        id: 1,
        nama: "Dr. Budi Santoso",
        spesialis: "Dokter Umum",
        kategori: "umum",
        pengalaman: 10,
        hari: "Senin - Kamis",
        jam: "08:00 - 13:00 WIB",
        ruang: "Ruang Poli 1",
        status: "Tersedia",
        badgeColor: "bg-emerald-100 text-emerald-800"
    },
    {
        id: 2,
        nama: "Dr. Siti Nurhaliza",
        spesialis: "Dokter Anak",
        kategori: "anak",
        pengalaman: 8,
        hari: "Senin, Rabu, Jumat",
        jam: "08:30 - 12:00 WIB",
        ruang: "Ruang KIA-KB",
        status: "Tersedia",
        badgeColor: "bg-amber-100 text-amber-800"
    },
    {
        id: 3,
        nama: "Dr. Ahmad Wijaya",
        spesialis: "Dokter Gigi",
        kategori: "gigi",
        pengalaman: 7,
        hari: "Senin - Jumat",
        jam: "08:00 - 13:00 WIB",
        ruang: "Ruang Gigi",
        status: "Tersedia",
        badgeColor: "bg-blue-100 text-blue-800"
    },
    {
        id: 4,
        nama: "Dr. Rini Wulandari",
        spesialis: "Dokter Kandungan",
        kategori: "kandungan",
        pengalaman: 9,
        hari: "Selasa & Kamis",
        jam: "09:00 - 12:30 WIB",
        ruang: "Ruang USG",
        status: "Sedang Praktik",
        badgeColor: "bg-rose-100 text-rose-800"
    },
    {
        id: 5,
        nama: "Dr. Hendra Gunawan",
        spesialis: "Penyakit Dalam",
        kategori: "penyakit-dalam",
        pengalaman: 12,
        hari: "Senin & Kamis",
        jam: "10:00 - 14:00 WIB",
        ruang: "Ruang Poli 2",
        status: "Tersedia",
        badgeColor: "bg-indigo-100 text-indigo-800"
    },
    {
        id: 6,
        nama: "Dr. Eka Putri",
        spesialis: "Perawat Profesional",
        kategori: "umum",
        pengalaman: 6,
        hari: "Setiap Hari",
        jam: "24 Jam (UGD)",
        ruang: "Ruang UGD",
        status: "Tersedia",
        badgeColor: "bg-teal-100 text-teal-800"
    }
];

/**
 * Data dummy live antrean pendaftaran pasien hari ini
 * @type {Array<Object>}
 */
let antreanPasien = [
    {
        id: "antrean-1",
        noAntrean: "A-001",
        nama: "Ahmad Dahlan",
        nik: "3302261205900001",
        layanan: "Pemeriksaan Umum",
        jamDaftar: "08:15 WIB",
        status: "Menunggu"
    },
    {
        id: "antrean-2",
        noAntrean: "B-002",
        nama: "Siti Rahmawati",
        nik: "3302265507950002",
        layanan: "Imunisasi",
        jamDaftar: "08:30 WIB",
        status: "Dipanggil"
    },
    {
        id: "antrean-3",
        noAntrean: "C-003",
        nama: "Rian Hidayat",
        nik: "3302262103880003",
        layanan: "Gigi & Mulut",
        jamDaftar: "08:45 WIB",
        status: "Menunggu"
    }
];

// Nomor urut antrean berikutnya
let counterUrutAntrean = 4;


/* ==========================================================================
   2. LOGIC LAYER (VANILLA JS FUNCTIONS)
   ========================================================================== */

/**
 * Fungsi menghitung total dokter dalam data
 * @param {Array} data
 * @returns {number}
 */
function hitungTotalDokter(data) {
    if (!Array.isArray(data)) return 0;
    return data.length;
}

/**
 * Fungsi menghitung total antrean pasien yang berstatus aktif
 * @returns {number}
 */
function hitungAntreanAktif() {
    return antreanPasien.length;
}

/**
 * Fungsi memfilter dokter berdasarkan kategori dan kata kunci pencarian
 * @param {string} kategori
 * @param {string} keyword
 * @returns {Array}
 */
function filterDokterData(kategori = "semua", keyword = "") {
    let hasil = daftarDokter;

    // Percabangan Filter Kategori
    if (kategori !== "semua") {
        hasil = hasil.filter(function (doc) {
            return doc.kategori === kategori;
        });
    }

    // Percabangan Filter Keyword Pencarian
    if (keyword.trim() !== "") {
        const query = keyword.toLowerCase().trim();
        hasil = hasil.filter(function (doc) {
            return doc.nama.toLowerCase().includes(query) ||
                   doc.spesialis.toLowerCase().includes(query) ||
                   doc.ruang.toLowerCase().includes(query);
        });
    }

    return hasil;
}

/**
 * Fungsi mengurutkan data dokter berdasarkan kriteria
 * @param {Array} data
 * @param {string} sortKey
 * @returns {Array}
 */
function sortDokterData(data, sortKey = "default") {
    // Buat salinan array agar tidak memutasi langsung
    const salinan = [...data];

    if (sortKey === "nama-asc") {
        salinan.sort(function (a, b) {
            return a.nama.localeCompare(b.nama);
        });
    } else if (sortKey === "nama-desc") {
        salinan.sort(function (a, b) {
            return b.nama.localeCompare(a.nama);
        });
    } else if (sortKey === "pengalaman-desc") {
        salinan.sort(function (a, b) {
            return b.pengalaman - a.pengalaman;
        });
    }

    return salinan;
}

/**
 * Fungsi menambah pasien baru ke daftar antrean
 * @param {Object} pasienBaru
 * @returns {Object}
 */
function tambahPasienBaru(pasienBaru) {
    // Tentukan kode antrean berdasarkan jenis layanan
    let prefix = "A";
    if (pasienBaru.layanan.includes("Imunisasi")) prefix = "B";
    else if (pasienBaru.layanan.includes("Gigi")) prefix = "C";
    else if (pasienBaru.layanan.includes("Laboratorium")) prefix = "D";

    const formattedNo = prefix + "-" + String(counterUrutAntrean).padStart(3, "0");
    counterUrutAntrean++;

    const jamSekarang = new Date();
    const jamString = String(jamSekarang.getHours()).padStart(2, "0") + ":" +
                      String(jamSekarang.getMinutes()).padStart(2, "0") + " WIB";

    const itemAntrean = {
        id: "antrean-" + Date.now(),
        noAntrean: formattedNo,
        nama: pasienBaru.nama,
        nik: pasienBaru.nik,
        layanan: pasienBaru.layanan,
        jamDaftar: jamString,
        status: "Menunggu"
    };

    antreanPasien.push(itemAntrean);
    return itemAntrean;
}

/**
 * Fungsi menghapus antrean pasien berdasarkan ID
 * @param {string} id
 * @returns {boolean}
 */
function hapusPasienById(id) {
    const indeks = antreanPasien.findIndex(function (item) {
        return item.id === id;
    });

    if (indeks !== -1) {
        antreanPasien.splice(indeks, 1);
        return true;
    }
    return false;
}


/* ==========================================================================
   3. RENDER LAYER (DYNAMIC DOM RENDERING VIA JAVASCRIPT)
   ========================================================================== */

/**
 * Render kartu profil dokter ke DOM (#daftarDokter)
 * Menggunakan perulangan forEach dan percabangan if/else
 * @param {Array} data
 */
function renderDokterCards(data) {
    const kontainer = document.getElementById("daftarDokter");
    const pesanKosong = document.getElementById("pesanDokterKosong");
    const badgeTotal = document.getElementById("badgeTotalDokter");

    if (!kontainer) return;

    // Perbarui badge total dokter
    if (badgeTotal) {
        badgeTotal.textContent = `${hitungTotalDokter(data)} Dokter Ditemukan`;
    }

    // Percabangan: jika data kosong
    if (data.length === 0) {
        kontainer.innerHTML = "";
        if (pesanKosong) pesanKosong.classList.remove("hidden");
        return;
    }

    if (pesanKosong) pesanKosong.classList.add("hidden");

    let html = "";
    // Perulangan forEach untuk me-render kartu dokter secara dinamis
    data.forEach(function (doc) {
        html += `
            <div class="kartu-dokter bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition duration-300 text-center border border-gray-100 cursor-pointer" 
                 data-id="${doc.id}" data-kategori="${doc.kategori}">
                <div class="w-24 h-24 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <i class="fas fa-user-md text-white text-3xl"></i>
                </div>
                <h4 class="text-xl font-bold text-emerald-800 mb-1">${doc.nama}</h4>
                <p class="text-emerald-600 font-semibold mb-2 text-sm">${doc.spesialis}</p>
                <p class="text-gray-500 text-xs mb-3">Pengalaman: <span class="font-semibold text-gray-700">${doc.pengalaman} Tahun</span></p>
                <div class="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                    <span><i class="far fa-calendar-alt text-emerald-600 mr-1"></i> ${doc.hari}</span>
                    <span class="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium">${doc.status}</span>
                </div>
            </div>
        `;
    });

    kontainer.innerHTML = html;
}

/**
 * Render tabel jadwal dokter ke DOM (#tbodyJadwalDokter)
 * Menggunakan perulangan forEach
 * @param {Array} data
 */
function renderJadwalTable(data) {
    const tbody = document.getElementById("tbodyJadwalDokter");
    if (!tbody) return;

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="py-8 text-center text-gray-500">
                    <i class="fas fa-calendar-times text-gray-400 text-3xl mb-2 block"></i>
                    Tidak ada jadwal dokter untuk kriteria yang dipilih.
                </td>
            </tr>
        `;
        return;
    }

    let html = "";
    data.forEach(function (doc, index) {
        const bgRow = index % 2 === 1 ? "bg-gray-50" : "bg-white";
        html += `
            <tr class="${bgRow} hover:bg-emerald-50 transition">
                <td class="py-4 px-6 font-semibold text-emerald-900 flex items-center">
                    <i class="fas fa-user-md text-emerald-600 mr-2"></i> ${doc.nama}
                </td>
                <td class="py-4 px-6">
                    <span class="${doc.badgeColor} text-xs px-2.5 py-1 rounded-full font-medium">
                        ${doc.spesialis}
                    </span>
                </td>
                <td class="py-4 px-6 text-gray-700">${doc.hari}</td>
                <td class="py-4 px-6 text-gray-700 font-medium">${doc.jam}</td>
                <td class="py-4 px-6 text-gray-600">${doc.ruang}</td>
                <td class="py-4 px-6">
                    <span class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${doc.status === 'Tersedia' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}">
                        <span class="w-1.5 h-1.5 rounded-full ${doc.status === 'Tersedia' ? 'bg-green-600' : 'bg-amber-600'}"></span>
                        ${doc.status}
                    </span>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

/**
 * Render tabel antrean pendaftaran pasien ke DOM (#tbodyAntreanPasien)
 * Menggunakan perulangan forEach dan percabangan if/else
 */
function renderTabelAntrean() {
    const tbody = document.getElementById("tbodyAntreanPasien");
    const pesanKosong = document.getElementById("pesanAntreanKosong");
    const badgeTotal = document.getElementById("badgeTotalAntrean");

    if (!tbody) return;

    const total = hitungAntreanAktif();
    if (badgeTotal) {
        badgeTotal.textContent = `${total} Pasien`;
    }

    // Percabangan: jika antrean kosong
    if (total === 0) {
        tbody.innerHTML = "";
        if (pesanKosong) pesanKosong.classList.remove("hidden");
        return;
    }

    if (pesanKosong) pesanKosong.classList.add("hidden");

    let html = "";
    antreanPasien.forEach(function (item, index) {
        const bgRow = index % 2 === 1 ? "bg-gray-50" : "bg-white";
        html += `
            <tr id="${item.id}" class="${bgRow} hover:bg-emerald-50 transition">
                <td class="py-4 px-6 font-bold text-emerald-700 text-base">
                    ${item.noAntrean}
                </td>
                <td class="py-4 px-6 font-semibold text-gray-800">
                    ${item.nama}
                    <span class="block text-xs font-normal text-gray-500">NIK: ${item.nik.substring(0, 6)}******${item.nik.substring(12)}</span>
                </td>
                <td class="py-4 px-6 text-gray-700">
                    <span class="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-1 rounded-full font-medium">
                        ${item.layanan}
                    </span>
                </td>
                <td class="py-4 px-6 text-gray-600 font-medium">${item.jamDaftar}</td>
                <td class="py-4 px-6">
                    <span class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${item.status === 'Dipanggil' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}">
                        <span class="w-1.5 h-1.5 rounded-full ${item.status === 'Dipanggil' ? 'bg-amber-600' : 'bg-emerald-600'}"></span>
                        ${item.status}
                    </span>
                </td>
                <td class="py-4 px-6 text-center">
                    <button class="btn-hapus-antrean text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition duration-200 cursor-pointer" 
                            data-id="${item.id}" data-nama="${item.nama}" title="Batalkan Antrean">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}


/* ==========================================================================
   4. JQUERY INTERACTION & EVENT HANDLING LAYER
   ========================================================================== */

$(document).ready(function () {
    console.log("Puskesmas Sehat JavaScript & jQuery Loaded Successfully!");

    /* 4.1 INISIALISASI RENDERING AWAL (JIKA ELEMEN TERSEDIA DI HALAMAN) */
    if ($("#daftarDokter").length) {
        renderDokterCards(daftarDokter);
        renderJadwalTable(daftarDokter);
    }

    if ($("#tbodyAntreanPasien").length) {
        renderTabelAntrean();
    }


    /* 4.2 RESPONSIVE MOBILE MENU TOGGLE (jQuery slideToggle) */
    $("#mobile-menu-btn").on("click", function () {
        $("#mobile-menu").slideToggle(200);
    });


    /* 4.3 BACK TO TOP BUTTON (jQuery fadeIn, fadeOut, animate) */
    if ($("#backToTopBtn").length === 0) {
        $("body").append(`
            <button id="backToTopBtn" 
                class="hidden fixed bottom-6 right-6 bg-emerald-600 hover:bg-emerald-700 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50 focus:outline-none cursor-pointer"
                title="Kembali ke atas">
                <i class="fas fa-chevron-up text-lg"></i>
            </button>
        `);
    }

    $(window).on("scroll", function () {
        if ($(this).scrollTop() > 300) {
            $("#backToTopBtn").fadeIn(200).removeClass("hidden");
        } else {
            $("#backToTopBtn").fadeOut(200);
        }
    });

    $(document).on("click", "#backToTopBtn", function () {
        $("html, body").animate({ scrollTop: 0 }, 400);
    });


    /* 4.4 UNIVERSAL MODAL ALERT (jQuery fadeIn, fadeOut, scale transition) */
    if ($("#universalModal").length === 0) {
        $("body").append(`
            <div id="universalModal" style="display: none;" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                <div class="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 text-center m-auto transform transition-all duration-200 scale-95" id="modalCard">
                    <div id="modalIconContainer" class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl shadow-inner">
                        <!-- Ikon dinamis -->
                    </div>
                    <h3 id="modalTitle" class="text-2xl font-bold text-gray-800 mb-3"></h3>
                    <div id="modalBody" class="text-gray-600 mb-6 text-sm sm:text-base"></div>
                    <div class="flex justify-center">
                        <button id="closeModalBtn" class="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-2.5 rounded-lg transition duration-200 shadow-md hover:shadow-lg focus:outline-none cursor-pointer">
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        `);
    }

    window.showModal = function (title, message, isSuccess = true) {
        const iconContainer = $("#modalIconContainer");
        if (isSuccess) {
            iconContainer.html('<i class="fas fa-check text-white"></i>').removeClass("bg-red-500").addClass("bg-emerald-500");
        } else {
            iconContainer.html('<i class="fas fa-exclamation text-white"></i>').removeClass("bg-emerald-500").addClass("bg-red-500");
        }

        $("#modalTitle").text(title);
        $("#modalBody").html(message);
        
        $("#universalModal").css({ "display": "flex" }).hide().fadeIn(200);
        setTimeout(function () {
            $("#modalCard").removeClass("scale-95").addClass("scale-100");
        }, 50);
    };

    $(document).on("click", "#closeModalBtn, #universalModal", function (e) {
        if (e.target.id === "universalModal" || e.target.id === "closeModalBtn" || $(e.target).closest("#closeModalBtn").length) {
            $("#modalCard").removeClass("scale-100").addClass("scale-95");
            $("#universalModal").fadeOut(200);
        }
    });


    /* 4.5 FILTER, PENCARIAN & SORTIR DOKTER (dokter.html) */
    let currentKategoriDokter = "semua";

    // Tombol Filter Kategori (jQuery on click)
    $(".filter-dokter-btn").on("click", function () {
        $(".filter-dokter-btn").removeClass("bg-emerald-600 text-white").addClass("bg-emerald-100 text-emerald-800");
        $(this).removeClass("bg-emerald-100 text-emerald-800").addClass("bg-emerald-600 text-white");

        currentKategoriDokter = $(this).data("kategori");
        applyDokterFilterAndSort();
    });

    // Input Pencarian Real-Time (jQuery on keyup)
    $("#cariDokter").on("keyup", function () {
        applyDokterFilterAndSort();
    });

    // Dropdown Pengurutan (jQuery on change)
    $("#sortDokter").on("change", function () {
        applyDokterFilterAndSort();
    });

    function applyDokterFilterAndSort() {
        const keyword = $("#cariDokter").val() || "";
        const sortKey = $("#sortDokter").val() || "default";

        // 1. Filter dengan fungsi Vanilla JS
        let hasil = filterDokterData(currentKategoriDokter, keyword);

        // 2. Sort dengan fungsi Vanilla JS
        hasil = sortDokterData(hasil, sortKey);

        // 3. Render dinamis ke DOM
        renderDokterCards(hasil);
        renderJadwalTable(hasil);
    }

    // Modal Detail Dokter saat Kartu Diklik (jQuery on click)
    $(document).on("click", ".kartu-dokter", function () {
        const id = parseInt($(this).data("id"), 10);
        const doc = daftarDokter.find(function (item) {
            return item.id === id;
        });

        if (doc) {
            const detailHtml = `
                <div class="text-left bg-emerald-50 p-4 rounded-xl space-y-2 border border-emerald-200">
                    <p><strong>Spesialisasi:</strong> ${doc.spesialis}</p>
                    <p><strong>Pengalaman:</strong> ${doc.pengalaman} Tahun Melayani</p>
                    <p><strong>Hari Layanan:</strong> ${doc.hari}</p>
                    <p><strong>Jam Praktik:</strong> ${doc.jam}</p>
                    <p><strong>Ruang:</strong> ${doc.ruang}</p>
                    <p><strong>Status Ketersediaan:</strong> <span class="text-emerald-700 font-semibold">${doc.status}</span></p>
                </div>
                <div class="mt-4 text-center">
                    <a href="pendaftaran.html" class="inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 px-6 rounded-lg transition shadow">
                        Daftar Antrean Dokter Ini
                    </a>
                </div>
            `;
            showModal(doc.nama, detailHtml, true);
        }
    });


    /* 4.6 FORM VALIDASI & PENAMBAHAN ANTREAN (pendaftaran.html) */
    $("#formPendaftaran").on("submit", function (e) {
        e.preventDefault();

        const nama = $("#pendaftaranNama").val().trim();
        const nik = $("#pendaftaranNik").val().trim();
        const email = $("#pendaftaranEmail").val().trim();
        const telp = $("#pendaftaranTelp").val().trim();
        const layanan = $("#pendaftaranLayanan").find("option:selected").text();

        // Validasi NIK (16 digit angka)
        const regexNik = /^[0-9]{16}$/;
        if (!regexNik.test(nik)) {
            showModal("Validasi Gagal", "Nomor Identitas (NIK) harus berupa 16 digit angka valid.", false);
            $("#pendaftaranNik").focus();
            return;
        }

        // Validasi Nomor Telepon (minimal 10 digit)
        const regexTelp = /^[0-9+ -]{10,15}$/;
        if (!regexTelp.test(telp)) {
            showModal("Validasi Gagal", "Nomor telepon tidak valid. Masukkan minimal 10 digit angka.", false);
            $("#pendaftaranTelp").focus();
            return;
        }

        // 1. Tambah data dummy baru ke Array antrean
        const itemBaru = tambahPasienBaru({
            nama: nama,
            nik: nik,
            email: email,
            telepon: telp,
            layanan: layanan
        });

        // 2. Render ulang tabel antrean pasien secara dinamis
        renderTabelAntrean();

        // 3. Beri highlight baris baru yang ditambahkan via jQuery animation
        const barisBaru = $(`#${itemBaru.id}`);
        if (barisBaru.length) {
            barisBaru.hide().fadeIn(400);
            barisBaru.addClass("bg-emerald-100");
            setTimeout(function () {
                barisBaru.removeClass("bg-emerald-100");
            }, 2000);
        }

        // 4. Modal notifikasi sukses
        const ringkasan = `
            <div class="text-left bg-emerald-50 p-4 rounded-xl space-y-1.5 text-sm border border-emerald-200">
                <p><strong>Nomor Antrean Anda:</strong> <span class="text-emerald-700 font-bold text-lg">${itemBaru.noAntrean}</span></p>
                <p><strong>Nama Pasien:</strong> ${nama}</p>
                <p><strong>NIK:</strong> ${nik}</p>
                <p><strong>Poli Rujukan:</strong> ${layanan}</p>
                <p><strong>Estimasi Waktu:</strong> ${itemBaru.jamDaftar}</p>
            </div>
            <p class="mt-4 text-emerald-800 text-xs sm:text-sm">Data telah masuk ke <strong>Antrean Pasien Hari Ini</strong> di bawah. Silakan simpan nomor antrean Anda.</p>
        `;

        showModal("Pendaftaran Berhasil!", ringkasan, true);
        this.reset();

        // Smooth scroll ke bagian antrean pasien
        if ($("#antreanSection").length) {
            setTimeout(function () {
                $("html, body").animate({
                    scrollTop: $("#antreanSection").offset().top - 80
                }, 500);
            }, 600);
        }
    });


    /* 4.7 AKSI HAPUS / BATALKAN ANTREAN DUMMY (jQuery on click + fadeOut) */
    $(document).on("click", ".btn-hapus-antrean", function () {
        const id = $(this).data("id");
        const nama = $(this).data("nama");
        const row = $(`#${id}`);

        if (confirm(`Apakah Anda yakin ingin membatalkan antrean untuk pasien: ${nama}?`)) {
            // Efek jQuery fadeOut sebelum menghapus elemen dari DOM
            row.fadeOut(350, function () {
                // Hapus data dari array JavaScript
                hapusPasienById(id);
                // Render ulang status tabel & badge counter
                renderTabelAntrean();
            });
        }
    });


    /* 4.8 FORM VALIDASI & SUBMIT KONTAK (kontak.html) */
    $("#formKontak").on("submit", function (e) {
        e.preventDefault();

        const nama = $("#kontakNama").val().trim();
        const email = $("#kontakEmail").val().trim();
        const subjek = $("#kontakSubjek").val().trim();

        if (nama === "" || email === "" || subjek === "") {
            showModal("Peringatan", "Mohon lengkapi semua kolom yang wajib diisi.", false);
            return;
        }

        const pesanSukses = `
            <p>Terima kasih, <strong>${nama}</strong>!</p>
            <p class="mt-2 text-sm text-gray-600">Pesan Anda dengan topik <em>"${subjek}"</em> telah kami terima. Tim kami akan segera merespons via email: <strong>${email}</strong>.</p>
        `;

        showModal("Pesan Terkirim!", pesanSukses, true);
        this.reset();
    });


    /* 4.9 PREVIEW MODAL GALERI FASILITAS (galeri.html) */
    $(".kartu-galeri").on("click", function () {
        const judul = $(this).find(".judul-galeri").text().trim();
        const ikonHtml = $(this).find(".ikon-galeri").html();
        const deskripsi = $(this).data("deskripsi") || "Fasilitas pelayanan Puskesmas Sehat yang senantiasa siap melayani masyarakat.";

        const kontenModal = `
            <div class="text-emerald-600 text-6xl my-4 text-center">
                ${ikonHtml}
            </div>
            <p class="text-gray-700 text-center leading-relaxed">${deskripsi}</p>
        `;

        showModal(judul, kontenModal, true);
    });


    /* 4.10 PILIH PAKET MEMBER (member.html) */
    $(".btn-pilih-paket").on("click", function () {
        const paket = $(this).data("paket");
        showModal(
            "Paket Member Dipilih",
            `Anda telah memilih paket keanggotaan <strong>${paket}</strong>. Tim administrasi kami akan segera menghubungi Anda untuk melengkapi aktivasi member.`,
            true
        );
    });
});
