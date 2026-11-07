/**
 * Puskesmas Sehat - Main JavaScript & jQuery Script
 * Praktikum Perancangan dan Pemrograman Web
 * 
 * Fitur Interaktif:
 * 1. Mobile Menu Toggle (Responsif Navbar)
 * 2. Tombol Scroll Kembali ke Atas (Back-to-Top Button)
 * 3. Filter & Pencarian Interaktif Dokter (dokter.html)
 * 4. Validasi & Penanganan Form Pendaftaran (pendaftaran.html)
 * 5. Validasi & Penanganan Form Kontak (kontak.html)
 * 6. Modal / Lightbox Pratinjau Galeri (galeri.html)
 * 7. Efek Animasi & Notifikasi Universal (Modal Alert)
 */

$(document).ready(function () {
    console.log("Puskesmas Sehat JavaScript & jQuery loaded successfully!");

    /* ========================================================
       1. RESPONSIVE MOBILE MENU
       ======================================================== */
    $("#mobile-menu-btn").on("click", function () {
        $("#mobile-menu").slideToggle(200);
    });

    /* ========================================================
       2. BACK TO TOP BUTTON (DYNAMIC INJECTION)
       ======================================================== */
    // Tambahkan tombol Back-to-Top ke halaman jika belum ada
    if ($("#backToTopBtn").length === 0) {
        $("body").append(`
            <button id="backToTopBtn" 
                class="hidden fixed bottom-6 right-6 bg-emerald-600 hover:bg-emerald-700 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50 focus:outline-none"
                title="Kembali ke atas">
                <i class="fas fa-chevron-up text-lg"></i>
            </button>
        `);
    }

    // Tampilkan tombol saat scroll melebihi 300px
    $(window).on("scroll", function () {
        if ($(this).scrollTop() > 300) {
            $("#backToTopBtn").fadeIn(200).removeClass("hidden");
        } else {
            $("#backToTopBtn").fadeOut(200);
        }
    });

    // Aksi klik untuk kembali ke atas dengan smooth scroll
    $(document).on("click", "#backToTopBtn", function () {
        $("html, body").animate({ scrollTop: 0 }, 400);
    });

    /* ========================================================
       3. MODAL ALERT UNIVERSAL (Tepat di Tengah Layar)
       ======================================================== */
    // Template modal universal untuk menampilkan feedback yang ramah pengguna
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
                        <button id="closeModalBtn" class="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-2.5 rounded-lg transition duration-200 shadow-md hover:shadow-lg focus:outline-none">
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        `);
    }

    // Fungsi pembantu menampilkan modal selalu tepat di tengah layar
    function showModal(title, message, isSuccess = true) {
        const iconContainer = $("#modalIconContainer");
        if (isSuccess) {
            iconContainer.html('<i class="fas fa-check text-white"></i>').removeClass("bg-red-500").addClass("bg-emerald-500");
        } else {
            iconContainer.html('<i class="fas fa-exclamation text-white"></i>').removeClass("bg-emerald-500").addClass("bg-red-500");
        }

        $("#modalTitle").text(title);
        $("#modalBody").html(message);
        
        // Memastikan modal ditampilkan dengan flexbox agar tepat di tengah layar (horizontal & vertikal)
        $("#universalModal").css({ "display": "flex" }).hide().fadeIn(200);
        setTimeout(function () {
            $("#modalCard").removeClass("scale-95").addClass("scale-100");
        }, 50);
    }

    // Event listener untuk menutup modal
    $(document).on("click", "#closeModalBtn, #universalModal", function (e) {
        if (e.target.id === "universalModal" || e.target.id === "closeModalBtn" || $(e.target).closest("#closeModalBtn").length) {
            $("#modalCard").removeClass("scale-100").addClass("scale-95");
            $("#universalModal").fadeOut(200);
        }
    });

    /* ========================================================
       4. PENCARIAN & FILTER TIM DOKTER (dokter.html)
       ======================================================== */
    // Fitur pencarian nama dokter atau spesialisasi
    $("#cariDokter").on("keyup", function () {
        const keyword = $(this).val().toLowerCase().trim();
        $(".kartu-dokter").filter(function () {
            const text = $(this).text().toLowerCase();
            $(this).toggle(text.indexOf(keyword) > -1);
        });

        cekDokterDitemukan();
    });

    // Fitur filter kategori dokter lewat tombol pill
    $(".filter-dokter-btn").on("click", function () {
        $(".filter-dokter-btn").removeClass("bg-emerald-600 text-white").addClass("bg-emerald-100 text-emerald-800");
        $(this).removeClass("bg-emerald-100 text-emerald-800").addClass("bg-emerald-600 text-white");

        const kategori = $(this).data("kategori");
        if (kategori === "semua") {
            $(".kartu-dokter").show();
        } else {
            $(".kartu-dokter").each(function () {
                const spesialis = $(this).data("kategori");
                if (spesialis === kategori) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }

        cekDokterDitemukan();
    });

    // Helper pesan jika dokter tidak ditemukan
    function cekDokterDitemukan() {
        const tampak = $(".kartu-dokter:visible").length;
        if (tampak === 0) {
            $("#pesanDokterKosong").show();
        } else {
            $("#pesanDokterKosong").hide();
        }
    }

    /* ========================================================
       5. FORM VALIDASI & SUBMIT PENDAFTARAN (pendaftaran.html)
       ======================================================== */
    $("#formPendaftaran").on("submit", function (e) {
        e.preventDefault();

        const nama = $("#pendaftaranNama").val().trim();
        const nik = $("#pendaftaranNik").val().trim();
        const email = $("#pendaftaranEmail").val().trim();
        const telp = $("#pendaftaranTelp").val().trim();
        const alamat = $("#pendaftaranAlamat").val().trim();
        const gender = $("#pendaftaranGender").val();
        const tanggalLahir = $("#pendaftaranTanggal").val();
        const layanan = $("#pendaftaranLayanan").find("option:selected").text();

        // Validasi NIK (16 digit angka)
        const regexNik = /^[0-9]{16}$/;
        if (!regexNik.test(nik)) {
            showModal("Validasi Gagal", "Nomor Identitas (NIK) harus berupa 16 digit angka.", false);
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

        // Sukses pendaftaran
        const ringkasan = `
            <div class="text-left bg-emerald-50 p-4 rounded-lg mt-2 space-y-1 text-sm border border-emerald-200">
                <p><strong>Nama:</strong> ${nama}</p>
                <p><strong>NIK:</strong> ${nik}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Telepon:</strong> ${telp}</p>
                <p><strong>Layanan Dipilih:</strong> ${layanan}</p>
            </div>
            <p class="mt-4 text-emerald-800">Pendaftaran Anda berhasil tercatat! Tim kami akan segera mengirimkan konfirmasi antrean ke WhatsApp dan Email Anda.</p>
        `;

        showModal("Pendaftaran Berhasil!", ringkasan, true);
        this.reset();
    });

    /* ========================================================
       6. FORM VALIDASI & SUBMIT KONTAK (kontak.html)
       ======================================================== */
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
            <p class="mt-2 text-sm text-gray-600">Pesan Anda dengan topik <em>"${subjek}"</em> telah kami terima. Kami akan segera menghubungi Anda kembali melalui email: <strong>${email}</strong>.</p>
        `;

        showModal("Pesan Terkirim!", pesanSukses, true);
        this.reset();
    });

    /* ========================================================
       7. PREVIEW MODAL GALERI (galeri.html)
       ======================================================== */
    $(".kartu-galeri").on("click", function () {
        const judul = $(this).find(".judul-galeri").text().trim();
        const ikonHtml = $(this).find(".ikon-galeri").html();
        const deskripsi = $(this).data("deskripsi") || "Fasilitas dan kegiatan Puskesmas Sehat yang senantiasa siap melayani masyarakat.";

        const kontenModal = `
            <div class="text-emerald-600 text-6xl my-4 text-center">
                ${ikonHtml}
            </div>
            <p class="text-gray-700 text-center">${deskripsi}</p>
        `;

        showModal(judul, kontenModal, true);
    });

    /* ========================================================
       8. PILIH PAKET MEMBER (member.html)
       ======================================================== */
    $(".btn-pilih-paket").on("click", function () {
        const paket = $(this).data("paket");
        showModal(
            "Paket Member Dipilih",
            `Anda telah memilih paket <strong>${paket}</strong>. Halaman akan mengarahkan ke form pendaftaran member.`,
            true
        );
    });
});
