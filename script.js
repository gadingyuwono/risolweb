// Mengaktifkan animasi AOS (biar elemen muncul halus)
AOS.init({ duration: 750, once: true, offset: 120 });

// Ambil tombol menu dan elemen-elemen ikon
const hambtn = document.getElementById("hambtn");
const mobileMenu = document.getElementById("mobileMenu");
const hambsvg = document.getElementById("hambsvg");
const path1 = document.getElementById("path1");

// Ubah ikon menu (garis jadi silang, silang jadi garis)
function setMenuIcon(open) {
  if (open) {
    // Bentuk "X"
    path1.setAttribute("d", "M6 6L18 18M6 18L18 6");
    path1.setAttribute("stroke-linecap", "round");
  } else {
    // Bentuk tiga garis
    path1.setAttribute("d", "M4 7h16M4 12h16M4 17h16");
  }
}

// Klik tombol → buka/tutup menu
hambtn.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");
  hambtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  setMenuIcon(isOpen);
});

// Tombol scroll otomatis ke bagian "cara"
document.getElementById("scrollDemo").addEventListener("click", () => {
  document.getElementById("cara").scrollIntoView({ behavior: "smooth" });
});

// Ambil input jumlah risol dan elemen cart
const inputSayur = document.getElementById("input-sayur");
const inputMayo = document.getElementById("input-mayo");
const cartCount = document.getElementById("cart-count");
const cartSub = document.getElementById("cart-sub");
const cartOrder = document.getElementById("cart-order");

// Harga item
const price = { sayur: 2000, mayo: 3000 };

// Update keranjang (hitung jumlah & total harga)
function updateCart() {
  const s = Math.max(0, parseInt(inputSayur.value) || 0);
  const m = Math.max(0, parseInt(inputMayo.value) || 0);
  const totalItems = s + m;
  const sub = s * price.sayur + m * price.mayo;

  cartCount.innerText = totalItems;
  cartSub.innerText = `Rp${sub.toLocaleString()}`;
}

// Tombol tambah (+)
document.querySelectorAll(".inc").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.for;
    const input = document.getElementById("input-" + key);
    input.value = Math.max(0, parseInt(input.value || 0) + 1);
    updateCart();
    animatePulse(input); // animasi kecil biar terasa hidup
  });
});

// Tombol kurang (–)
document.querySelectorAll(".dec").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.for;
    const input = document.getElementById("input-" + key);
    input.value = Math.max(0, parseInt(input.value || 0) - 1);
    updateCart();
    animatePulse(input);
  });
});

// Tombol "Pesan" → kirim ke WhatsApp
cartOrder.addEventListener("click", () => {
  const s = parseInt(inputSayur.value) || 0;
  const m = parseInt(inputMayo.value) || 0;

  if (s === 0 && m === 0) return alert("Keranjang kosong — tambahkan terlebih dahulu 😊");

  sendWhatsapp({ sayur: s, mayo: m });
});

// Animasi input saat berubah (kecil memantul)
function animatePulse(el) {
  if (window.gsap) {
    gsap.fromTo(
      el,
      { scale: 0.96 },
      { scale: 1, duration: 0.28, ease: "elastic.out(1,0.6)" }
    );
  }
}

// Animasi saat halaman selesai loading
window.addEventListener("load", () => {
  document.querySelectorAll(".float-up").forEach((el) => el.classList.add("loaded"));

  if (window.gsap) {
    gsap.from("header img", {
      y: -8,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    });
  }
});

// Menunda updateCart supaya tidak terlalu sering saat user mengetik
[inputSayur, inputMayo].forEach((inp) => {
  let t;
  inp.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(updateCart, 120);
  });
});

updateCart(); // jalankan pertama kali

// Menyalin nomor rekening ke clipboard
function copyRekening() {
  const rekening = document.getElementById("rekening").innerText;

  // Clipboard baru (aman)
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(rekening).then(() => {
      const toast = document.getElementById("toast");
      toast.style.opacity = "1";
      setTimeout(() => { toast.style.opacity = "0"; }, 2000);
    });
  } else {
    // Cara lama (backup)
    const ta = document.createElement("textarea");
    ta.value = rekening;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);

    const toast = document.getElementById("toast");
    toast.style.opacity = "1";
    setTimeout(() => { toast.style.opacity = "0"; }, 2000);
  }
}

// Mengecek elemen mana yang melewati lebar layar (debug layout)
function logOverflowingElements() {
  const vw = document.documentElement.clientWidth;
  const els = [...document.querySelectorAll("*")].filter((el) => el.scrollWidth > vw + 1);
  return els;
}

// Opsi lokasi pertemuan
const meetingOption = document.getElementById("meeting-location-option");
const meetingInput = document.getElementById("meeting-location-input");

// Tampilkan input jika pilih "Lainnya"
meetingOption.addEventListener("change", () => {
  if (meetingOption.value === "Lainnya") {
    meetingInput.classList.remove("hidden");
  } else {
    meetingInput.classList.add("hidden");
    meetingInput.value = "";
  }
});

// Kirim pesan WA lengkap dengan data customer
function sendWhatsapp(items) {
  const phone = "6288299607239";
  const s = items.sayur || 0;
  const m = items.mayo || 0;

  // Ambil data customer
  const name = document.getElementById("customer-name").value.trim();
  if (!name) return alert("Nama wajib diisi 😊");

  const address = document.getElementById("customer-address").value.trim() || "-";
  const date = document.getElementById("booking-date").value || "-";
  const pickup = document.getElementById("pickup-option").value;

  // Lokasi meeting
  const meeting =
    meetingOption.value === "Lainnya"
      ? meetingInput.value || "-"
      : meetingOption.value;

  const total = s * price.sayur + m * price.mayo;

  // Format pesan WA
  const note = encodeURIComponent(
    `Halo Risolweb! Saya mau pesan:
- Risol Sayur: ${s} pcs
- Risol Mayo: ${m} pcs
Total: Rp${total.toLocaleString()}

Data Pemesan:
- Nama: ${name}
- Alamat: ${address}
- Tanggal Booking: ${date}
- Opsi: ${pickup}
- Lokasi Pertemuan: ${meeting}

Mohon konfirmasi & instruksi pembayaran. Terima kasih!`
  );

  // Buka WhatsApp
  const url = `https://wa.me/${phone}?text=${note}`;
  window.open(url, "_blank");
}