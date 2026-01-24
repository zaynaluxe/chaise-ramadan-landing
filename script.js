const form = document.getElementById("contactForm");
const success = document.getElementById("successMessage");
const error = document.getElementById("errorMessage");
const btn = document.getElementById("submitBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  btn.disabled = true;

  const data = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    city: document.getElementById("city").value,
    quantity: document.getElementById("quantity").value,
  };

  try {
    const res = await fetch("/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (result.success) {
      success.style.display = "block";
      error.style.display = "none";
      form.reset();
    } else {
      throw new Error();
    }
  } catch {
    error.style.display = "block";
    success.style.display = "none";
  }

  btn.disabled = false;
});

// Add click event listener to floating order icon to scroll to form
const floatingIcon = document.querySelector('.floating-order-icon');
floatingIcon.addEventListener('click', () => {
  const formSection = document.querySelector('.form-section');
  formSection.scrollIntoView({ behavior: 'smooth' });
});

// Add click event listener to floating WhatsApp icon
const whatsappIcon = document.querySelector('.floating-whatsapp-icon');
whatsappIcon.addEventListener('click', () => {
  window.open('https://wa.me/212671934735', '_blank');
});
