// Email sending configuration
// Using Formspree for reliable email delivery
console.log("✅ Contact form handler initialized - using Formspree for email delivery");

// Note: Replace YOUR_FORM_ID in the HTML form action with your actual Formspree form ID
// Get your form ID from https://formspree.io/ (free account)

// ==================== Mobile Menu Toggle ==================
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger?.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
});

// Close menu when a link is clicked
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
    });
});

// ==================== Smooth Scrolling ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});

// ==================== Scroll to Top Button ====================
const scrollToTopBtn = document.getElementById("scrollToTop");

window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.opacity = "1";
        scrollToTopBtn.style.pointerEvents = "auto";
    } else {
        scrollToTopBtn.style.opacity = "0";
        scrollToTopBtn.style.pointerEvents = "none";
    }
});

scrollToTopBtn?.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// ==================== Contact Form Handling ====================
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

console.log("Contact form element:", contactForm);
console.log("Form status element:", formStatus);

if (contactForm) {
    console.log("✅ Contact form found!");
} else {
    console.log("❌ Contact form NOT found!");
}

contactForm?.addEventListener("submit", async (e) => {
    console.log("🔔 Form submit event triggered!");
    e.preventDefault();
    
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    console.log("Form Data:", { name, email, subject, message });

    // Validation
    if (!name || !email || !subject || !message) {
        console.log("❌ Form validation failed - empty fields!");
        formStatus.textContent = "❌ Please fill in all fields!";
        formStatus.className = "error";
        return;
    }

    console.log("✅ Form validation passed!");

    // Check if form ID is configured
    const formAction = contactForm.getAttribute("action");
    if (formAction.includes("YOUR_FORM_ID")) {
        formStatus.textContent = "⚠️ Form ID not configured. Please contact the site owner.";
        formStatus.className = "error";
        console.error("❌ Formspree ID not set! Update the form action attribute with your form ID from https://formspree.io/");
        return;
    }

    // Clear previous status
    formStatus.textContent = "";
    formStatus.className = "";

    try {
        formStatus.textContent = "📤 Sending message...";
        formStatus.className = "";

        // Use Formspree's native form submission
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.getAttribute("action"), {
            method: "POST",
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            console.log("✅ Message sent successfully via Formspree!");
            
            // Show success popup
            contactForm.reset();
            showSuccessPopup();
        } else {
            console.error("❌ Formspree error:", response.status);
            formStatus.textContent = "❌ Error: Failed to send message";
            formStatus.className = "error";
            
            // Save locally as backup
            saveMessageLocally(name, email, subject, message);
        }
    } catch (error) {
        console.error("❌ Error sending message:", error);
        formStatus.textContent = "❌ Error: " + error.message;
        formStatus.className = "error";
        
        // Save locally as backup
        saveMessageLocally(name, email, subject, message);
    }
});

// ==================== Success Popup Modal ====================
function showSuccessPopup() {
    // Create modal overlay
    const overlay = document.createElement("div");
    overlay.id = "successOverlay";
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
    `;

    // Create modal box
    const modal = document.createElement("div");
    modal.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 15px;
        text-align: center;
        max-width: 400px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.4s ease;
    `;

    // Add success content
    modal.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
        <h2 style="color: #005f73; margin-bottom: 0.5rem; font-size: 1.8rem;">Successfully Delivered!</h2>
        <p style="color: #666; margin-bottom: 1.5rem; font-size: 1rem;">Your message has been sent successfully. I'll get back to you soon!</p>
        <button id="closePopup" style="
            background: linear-gradient(135deg, #005f73, #00b4d8);
            color: white;
            border: none;
            padding: 10px 30px;
            border-radius: 50px;
            font-size: 1rem;
            cursor: pointer;
            font-weight: 600;
            transition: transform 0.3s ease;
        ">Close</button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Add CSS animations
    const style = document.createElement("style");
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from {
                transform: translateY(50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    // Close popup on button click
    document.getElementById("closePopup").addEventListener("click", () => {
        overlay.style.animation = "fadeIn 0.3s ease reverse";
        setTimeout(() => {
            overlay.remove();
        }, 300);
    });

    // Close popup on background click
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            overlay.style.animation = "fadeIn 0.3s ease reverse";
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }
    });
}

// ==================== Local Backup Storage ====================
function saveMessageLocally(name, email, subject, message) {
    const messages = JSON.parse(localStorage.getItem("portfolio_messages") || "[]");
    messages.push({
        name, email, subject, message,
        timestamp: new Date().toLocaleString()
    });
    localStorage.setItem("portfolio_messages", JSON.stringify(messages));
    console.log("💾 Message saved locally as backup");
}

// ==================== Intersection Observer for Animations ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = "slideInLeft 0.6s ease forwards";
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all project cards and skill categories
document.querySelectorAll(".project-card, .skill-category, .stat").forEach(el => {
    el.style.opacity = "0";
    observer.observe(el);
});

// ==================== Active Navigation Link ====================
window.addEventListener("scroll", () => {
    let current = "";
    const sections = document.querySelectorAll("section");

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute("id");
        }
    });

    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
        }
    });
});

// ==================== Parallax Effect (Optional) ====================
window.addEventListener("scroll", () => {
    const scrollPosition = window.pageYOffset;
    const heroSection = document.querySelector(".hero");
    
    if (heroSection) {
        heroSection.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
    }
});

// ==================== Form Input Validation ====================
const inputs = document.querySelectorAll(".contact-form input, .contact-form textarea");

inputs.forEach(input => {
    input.addEventListener("blur", () => {
        if (input.type === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value) && input.value) {
                input.style.borderColor = "#dc3545";
            } else {
                input.style.borderColor = "";
            }
        }
    });

    input.addEventListener("focus", () => {
        input.style.borderColor = "";
    });
});

// ==================== Lazy Loading Images ====================
if ("IntersectionObserver" in window) {
    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add("loaded");
                imgObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll("img").forEach(img => {
        imgObserver.observe(img);
    });
}

// ==================== Console Welcome Message ====================
console.log("%c Welcome to my portfolio! ", "background: linear-gradient(135deg, #005f73, #00b4d8); color: white; padding: 10px 20px; border-radius: 5px; font-weight: bold; font-size: 14px;");
console.log("%c Feel free to check out my projects and get in touch!", "color: #005f73; font-size: 12px;");
