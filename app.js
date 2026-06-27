document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------
     1. Sticky Navbar Shrink Effect
     ----------------------------------------- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('shrink');
    } else {
      navbar.classList.remove('shrink');
    }
  });

  /* -----------------------------------------
     2. Mobile Hamburger Menu Toggle
     ----------------------------------------- */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      navToggle.classList.toggle('open');
      
      // Animate hamburger to X
      const hamburger = navToggle.querySelector('.hamburger');
      if (navLinks.classList.contains('active')) {
        hamburger.style.background = 'transparent';
        hamburger.style.setProperty('--tw-bg-opacity', '0');
        // Let CSS handle details if needed, or inline toggle styles:
        hamburger.style.transform = 'rotate(180deg)';
      } else {
        hamburger.style.background = 'var(--text-white)';
        hamburger.style.transform = 'none';
      }
    });

    // Close menu when clicking nav items
    const navItems = document.querySelectorAll('.nav-item, .nav-btn');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('open');
        const hamburger = navToggle.querySelector('.hamburger');
        hamburger.style.background = 'var(--text-white)';
        hamburger.style.transform = 'none';
      });
    });
  }

  /* -----------------------------------------
     3. Revenue Share Calculator & Estimator
     ----------------------------------------- */
  const slider = document.getElementById('contribution-slider');
  const percentageVal = document.getElementById('percentage-val');
  const progressCircle = document.getElementById('progress-circle');
  const tierTitle = document.getElementById('tier-title');
  const tierDesc = document.getElementById('tier-desc');
  const stepLabels = document.querySelectorAll('.step-label');

  const contributionTiers = {
    1: {
      percentage: 15,
      title: "1. Spark Idea (15% Split)",
      desc: "You provide a fully structured pitch document, core theme outline, and basic mechanics definition. We code, design, publish, and market the entire project."
    },
    2: {
      percentage: 25,
      title: "2. Core Prototype (25% Split)",
      desc: "You bring a playable basic prototype (e.g. built in Unity, Godot, or Construct) that demonstrates the main core mechanic or loop. We polish, build out the progression systems, handle UA, and publish."
    },
    3: {
      percentage: 40,
      title: "3. Assets & GDD (40% Split)",
      desc: "You provide a complete Game Design Document along with primary art assets (sprites, 3D models, or high fidelity UI templates). We code the engine, integrate services, and handle publishing."
    },
    4: {
      percentage: 50,
      title: "4. Co-Dev Full (50% Split)",
      desc: "We co-develop the game in a shared repository. You build specific features or design levels while we handle core systems, publishing, marketing, and monetization integration."
    }
  };

  function updateEstimator(val) {
    const tier = contributionTiers[val];
    if (!tier) return;

    // Update text content
    percentageVal.textContent = tier.percentage;
    tierTitle.textContent = tier.title;
    tierDesc.textContent = tier.desc;

    // Update active label styling
    stepLabels.forEach(label => {
      if (parseInt(label.getAttribute('data-step')) === parseInt(val)) {
        label.classList.add('active');
      } else {
        label.classList.remove('active');
      }
    });

    // Animate circular SVG indicator
    // Total circumference of circle (r=40) is 2 * PI * 40 = 251.2
    const totalCircumference = 251.2;
    const offset = totalCircumference - (totalCircumference * (tier.percentage / 100));
    progressCircle.style.strokeDashoffset = offset;
  }

  if (slider) {
    slider.addEventListener('input', (e) => {
      updateEstimator(e.target.value);
    });

    // Sync clicking step labels with slider value
    stepLabels.forEach(label => {
      label.addEventListener('click', () => {
        const targetStep = label.getAttribute('data-step');
        slider.value = targetStep;
        updateEstimator(targetStep);
      });
    });

    // Initialize slider value
    updateEstimator(slider.value);
  }

  /* -----------------------------------------
     4. Form Drag & Drop File Upload
     ----------------------------------------- */
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('concept-file');
  const fileList = document.getElementById('file-list');
  let uploadedFiles = [];

  if (dropZone && fileInput) {
    // Open explorer when clicking drop zone
    dropZone.addEventListener('click', () => fileInput.click());

    // Highlight drop zone on dragover
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      const files = e.dataTransfer.files;
      handleFiles(files);
    });

    fileInput.addEventListener('change', (e) => {
      handleFiles(e.target.files);
    });
  }

  function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!uploadedFiles.some(f => f.name === file.name && f.size === file.size)) {
        uploadedFiles.push(file);
      }
    }
    renderFileList();
  }

  function renderFileList() {
    fileList.innerHTML = '';
    uploadedFiles.forEach((file, index) => {
      const item = document.createElement('div');
      item.className = 'file-item';
      
      // Calculate file size in readable format
      const sizeKB = (file.size / 1024).toFixed(1);
      
      item.innerHTML = `
        <span>📄 ${file.name} (${sizeKB} KB)</span>
        <button type="button" class="file-remove" data-index="${index}">&times;</button>
      `;
      fileList.appendChild(item);
    });

    // Add removal listeners
    document.querySelectorAll('.file-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'));
        uploadedFiles.splice(idx, 1);
        renderFileList();
      });
    });
  }

  /* -----------------------------------------
     5. Pitch Form Submission & Success Modal
     ----------------------------------------- */
  const pitchForm = document.getElementById('pitch-form');
  const successModal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');

  if (pitchForm && successModal) {
    pitchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = pitchForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      // Perform validation checks
      const name = document.getElementById('creator-name').value;
      const email = document.getElementById('creator-email').value;
      const phone = document.getElementById('creator-phone').value;
      const title = document.getElementById('concept-title').value;
      const desc = document.getElementById('concept-desc').value;

      if (name && email && phone && title && desc) {
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        const formData = new FormData(pitchForm);
        
        // Append any manual drag-dropped files
        uploadedFiles.forEach((file) => {
          formData.append('attachments', file);
        });

        fetch(pitchForm.action || 'https://formspree.io/f/xdavqnoo', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        })
        .then(response => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;

          if (response.ok) {
            // Open success modal
            successModal.classList.add('active');
            // Reset form and variables
            pitchForm.reset();
            uploadedFiles = [];
            renderFileList();
          } else {
            alert('Oops! There was a problem submitting your form. Please try again.');
          }
        })
        .catch(error => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          alert('Oops! There was a problem submitting your form. Please check your connection and try again.');
        });
      }
    });

    // Close Modal Event
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
      });
    }

    // Close Modal on clicking outside content area
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
      }
    });
  }

  /* -----------------------------------------
     6. Scroll Reveal Fallback
     ----------------------------------------- */
  if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
    const reveals = document.querySelectorAll('.scroll-reveal');
    const observerOptions = {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    reveals.forEach(el => {
      // Set initial styles for elements
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      observer.observe(el);
    });
  }
});
