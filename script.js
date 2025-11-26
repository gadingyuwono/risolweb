AOS.init({ duration: 750, once: true, offset: 120 });

const hambtn = document.getElementById("hambtn");
const mobileMenu = document.getElementById("mobileMenu");
const hambsvg = document.getElementById("hambsvg");
const path1 = document.getElementById("path1");

// Toggle menu icon (hamburger ↔ cross)
function setMenuIcon(open) {
  if (open) {
    path1.setAttribute("d", "M6 6L18 18M6 18L18 6");
    path1.setAttribute("stroke-linecap", "round");
  } else {
    path1.setAttribute("d", "M4 7h16M4 12h16M4 17h16");
  }
}

hambtn.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");
  hambtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  setMenuIcon(isOpen);
});

document.getElementById("scrollDemo").addEventListener("click", () => {
  document.getElementById("cara").scrollIntoView({ behavior: "smooth" });
});

const inputSayur = document.getElementById("input-sayur");
const inputMayo = document.getElementById("input-mayo");
const cartCount = document.getElementById("cart-count");
const cartSub = document.getElementById("cart-sub");
const cartOrder = document.getElementById("cart-order");

const price = { sayur: 2000, mayo: 3000 };

// Update cart total and item count
function updateCart() {
  const s = Math.max(0, parseInt(inputSayur.value) || 0);
  const m = Math.max(0, parseInt(inputMayo.value) || 0);
  const totalItems = s + m;
  const sub = s * price.sayur + m * price.mayo;

  cartCount.innerText = totalItems;
  cartSub.innerText = `Rp${sub.toLocaleString()}`;
}

document.querySelectorAll(".inc").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.for;
    const input = document.getElementById("input-" + key);
    input.value = Math.max(0, parseInt(input.value || 0) + 1);
    updateCart();
    animatePulse(input);
  });
});

document.querySelectorAll(".dec").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.for;
    const input = document.getElementById("input-" + key);
    input.value = Math.max(0, parseInt(input.value || 0) - 1);
    updateCart();
    animatePulse(input);
  });
});

cartOrder.addEventListener("click", () => {
  const s = parseInt(inputSayur.value) || 0;
  const m = parseInt(inputMayo.value) || 0;

  if (s === 0 && m === 0) return alert("Keranjang kosong — tambahkan terlebih dahulu 😊");

  sendWhatsapp({ sayur: s, mayo: m });
});

// Small pulse animation for input change
function animatePulse(el) {
  if (window.gsap) {
    gsap.fromTo(
      el,
      { scale: 0.96 },
      { scale: 1, duration: 0.28, ease: "elastic.out(1,0.6)" }
    );
  }
}

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

// Debounce input to avoid too frequent updates
[inputSayur, inputMayo].forEach((inp) => {
  let t;
  inp.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(updateCart, 120);
  });
});

updateCart();

function copyRekening() {
  const rekening = document.getElementById("rekening").innerText;

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(rekening).then(() => {
      const toast = document.getElementById("toast");
      toast.style.opacity = "1";
      setTimeout(() => { toast.style.opacity = "0"; }, 2000);
    });
  } else {
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

// Debug: find elements overflowing viewport
function logOverflowingElements() {
  const vw = document.documentElement.clientWidth;
  const els = [...document.querySelectorAll("*")].filter((el) => el.scrollWidth > vw + 1);
  return els;
}

const meetingOption = document.getElementById("meeting-location-option");
const meetingInput = document.getElementById("meeting-location-input");

meetingOption.addEventListener("change", () => {
  if (meetingOption.value === "Lainnya") {
    meetingInput.classList.remove("hidden");
  } else {
    meetingInput.classList.add("hidden");
    meetingInput.value = "";
  }
});

// Send WhatsApp message with order info
function sendWhatsapp(items) {
  const phone = "6288299607239";
  const s = items.sayur || 0;
  const m = items.mayo || 0;

  const name = document.getElementById("customer-name").value.trim();
  if (!name) return alert("Nama wajib diisi 😊");

  const address = document.getElementById("customer-address").value.trim() || "-";
  const date = document.getElementById("booking-date").value || "-";
  const pickup = document.getElementById("pickup-option").value;

  const meeting =
    meetingOption.value === "Lainnya"
      ? meetingInput.value || "-"
      : meetingOption.value;

  const total = s * price.sayur + m * price.mayo;

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

  const url = `https://wa.me/${phone}?text=${note}`;
  window.open(url, "_blank");
}
