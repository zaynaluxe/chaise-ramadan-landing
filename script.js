const form = document.getElementById("contactForm");
const success = document.getElementById("successMessage");
const error = document.getElementById("errorMessage");
const btn = document.getElementById("submitBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  btn.disabled = true;
  btn.textContent = "جاري الإرسال...";

  const quantity = parseInt(document.getElementById("quantity").value);
  let value = 199;
  
  if (quantity === 2) value = 300;
  if (quantity === 3) value = 450;

  const data = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    city: document.getElementById("city").value,
    quantity: quantity,
  };

  try {
    const res = await fetch("/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (result.success) {
      // ✅ UNIQUEMENT ICI : Le pixel Purchase se déclenche après confirmation réussie
      if (typeof fbq !== 'undefined') {
        fbq('track', 'Purchase', {
          content_name: 'Chaise Pliable Ramadan',
          content_ids: ['chaise_ramadan'],
          content_type: 'product',
          value: value,
          currency: 'MAD',
          num_items: quantity
        });
      }
      
      // Afficher le message de confirmation
      success.style.display = "block";
      error.style.display = "none";
      form.reset();
      
      // Scroll vers le message de succès
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      console.log('✅ Événement Purchase envoyé à Facebook avec valeur:', value, 'MAD');
    } else {
      throw new Error();
    }
  } catch (err) {
    error.style.display = "block";
    success.style.display = "none";
    
    console.log('❌ Erreur lors de la soumission - Aucun événement Purchase envoyé');
  }

  btn.disabled = false;
  btn.textContent = "اطلب الآن - الدفع عند الاستلام 🛒";
});

// Scroll vers le formulaire quand on clique sur l'icône flottante
const floatingIcon = document.querySelector('.floating-order-icon');
if (floatingIcon) {
  floatingIcon.addEventListener('click', () => {
    const formSection = document.querySelector('.form-section');
    formSection.scrollIntoView({ behavior: 'smooth' });
  });
}

// Ouvrir WhatsApp
const whatsappIcon = document.querySelector('.floating-whatsapp-icon');
if (whatsappIcon) {
  whatsappIcon.addEventListener('click', () => {
    window.open('https://wa.me/212671934735', '_blank');
  });
}