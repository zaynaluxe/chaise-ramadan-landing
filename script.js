const form = document.getElementById("contactForm");
const success = document.getElementById("successMessage");
const error = document.getElementById("errorMessage");
const btn = document.getElementById("submitBtn");

// Track InitiateCheckout when user focuses on the form
let checkoutTracked = false;
form.addEventListener('focusin', () => {
  if (!checkoutTracked) {
    if (typeof fbq !== 'undefined') {
      fbq('track', 'InitiateCheckout', {
        content_name: 'Chaise Pliable Ramadan',
        content_category: 'Furniture',
        value: 199,
        currency: 'MAD'
      });
    }
    checkoutTracked = true;
  }
});

// Track quantity selection
const quantitySelect = document.getElementById("quantity");
quantitySelect.addEventListener('change', (e) => {
  const quantity = parseInt(e.target.value);
  let value = 199;
  
  if (quantity === 2) value = 300;
  if (quantity === 3) value = 450;
  
  if (typeof fbq !== 'undefined') {
    fbq('track', 'AddToCart', {
      content_name: 'Chaise Pliable Ramadan',
      content_category: 'Furniture',
      content_ids: ['chaise_ramadan'],
      content_type: 'product',
      value: value,
      currency: 'MAD',
      num_items: quantity
    });
  }
});

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
      // Track Lead event (form submission)
      if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
          content_name: 'Chaise Pliable Ramadan',
          content_category: 'Furniture',
          value: value,
          currency: 'MAD',
          predicted_ltv: value * 1.5
        });
        
        // Track Purchase event with complete data
        fbq('track', 'Purchase', {
          content_name: 'Chaise Pliable Ramadan',
          content_ids: ['chaise_ramadan'],
          content_type: 'product',
          value: value,
          currency: 'MAD',
          num_items: quantity,
          // Additional parameters for better conversion tracking
          delivery_category: 'home_delivery',
          predicted_ltv: value * 2
        });
      }
      
      success.style.display = "block";
      error.style.display = "none";
      form.reset();
      
      // Scroll to success message
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      throw new Error();
    }
  } catch (err) {
    error.style.display = "block";
    success.style.display = "none";
    
    // Track failed order attempt
    if (typeof fbq !== 'undefined') {
      fbq('trackCustom', 'OrderFailed', {
        error_type: 'submission_error',
        value: value,
        currency: 'MAD'
      });
    }
  }

  btn.disabled = false;
  btn.textContent = "اطلب الآن - الدفع عند الاستلام 🛒";
});

// Add click event listener to floating order icon to scroll to form
const floatingIcon = document.querySelector('.floating-order-icon');
if (floatingIcon) {
  floatingIcon.addEventListener('click', () => {
    const formSection = document.querySelector('.form-section');
    formSection.scrollIntoView({ behavior: 'smooth' });
    
    // Track button click
    if (typeof fbq !== 'undefined') {
      fbq('trackCustom', 'FloatingButtonClick', {
        button_location: 'floating_icon'
      });
    }
  });
}

// Add click event listener to floating WhatsApp icon
const whatsappIcon = document.querySelector('.floating-whatsapp-icon');
if (whatsappIcon) {
  whatsappIcon.addEventListener('click', () => {
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Contact', {
        contact_method: 'whatsapp'
      });
    }
    window.open('https://wa.me/212671934735', '_blank');
  });
}

// Track scroll depth for better engagement metrics
let scrollTracked = {
  '25': false,
  '50': false,
  '75': false,
  '100': false
};

window.addEventListener('scroll', () => {
  const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  
  if (scrollPercent >= 25 && !scrollTracked['25']) {
    if (typeof fbq !== 'undefined') {
      fbq('trackCustom', 'ScrollDepth', { depth: '25%' });
    }
    scrollTracked['25'] = true;
  }
  
  if (scrollPercent >= 50 && !scrollTracked['50']) {
    if (typeof fbq !== 'undefined') {
      fbq('trackCustom', 'ScrollDepth', { depth: '50%' });
    }
    scrollTracked['50'] = true;
  }
  
  if (scrollPercent >= 75 && !scrollTracked['75']) {
    if (typeof fbq !== 'undefined') {
      fbq('trackCustom', 'ScrollDepth', { depth: '75%' });
    }
    scrollTracked['75'] = true;
  }
  
  if (scrollPercent >= 99 && !scrollTracked['100']) {
    if (typeof fbq !== 'undefined') {
      fbq('trackCustom', 'ScrollDepth', { depth: '100%' });
    }
    scrollTracked['100'] = true;
  }
});