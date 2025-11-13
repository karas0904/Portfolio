document.addEventListener("DOMContentLoaded", () => {
  // Initialize audio context (will be created on first user interaction)
  let audioContext = null;
  let audioInitialized = false;

  // Function to initialize audio context on first user interaction
  const initAudioContext = () => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume audio context if it's suspended (required by some browsers)
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
    audioInitialized = true;
    return audioContext;
  };

  // Create click sound function using Web Audio API
  const createClickSound = () => {
    // Initialize audio context if not already done
    if (!audioInitialized) {
      initAudioContext();
    }

    // If context still isn't ready, try to initialize it
    if (!audioContext || audioContext.state === "suspended") {
      initAudioContext();
    }

    // If still not ready, return early
    if (!audioContext || audioContext.state === "suspended") {
      return;
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800; // Higher pitch for click sound
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.005,
      audioContext.currentTime + 0.1
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  // Initialize audio context on any user interaction (click, keypress, or mouse movement)
  const initOnInteraction = () => {
    initAudioContext();
    // Remove listeners after first interaction
    document.removeEventListener("click", initOnInteraction);
    document.removeEventListener("keydown", initOnInteraction);
    document.removeEventListener("mousemove", initOnInteraction);
  };

  // Set up listeners to initialize audio on first user interaction
  document.addEventListener("click", initOnInteraction, { once: true });
  document.addEventListener("keydown", initOnInteraction, { once: true });
  document.addEventListener("mousemove", initOnInteraction, { once: true });

  const nameBox = document.querySelector(".name-box");
  const navLinks = document.querySelectorAll(".nav-links a");
  const dropdown = document.querySelector(".dropdown");
  const dropdownContent = document.querySelector(".dropdown-content");
  const dropdownItems = document.querySelectorAll(".dropdown-content li");
  const hamburger = document.querySelector(".hamburger");
  const navLinksContainer = document.querySelector(".nav-links");

  // Add hover sound to navigation links (excluding dropdown items initially)
  navLinks.forEach((link) => {
    // Only add to direct nav links, not dropdown items
    if (!link.closest(".dropdown-content")) {
      let soundPlayed = false;
      link.addEventListener("mouseenter", () => {
        // Try to initialize audio context on first hover
        if (!audioInitialized) {
          initAudioContext();
        }
        if (!soundPlayed) {
          createClickSound();
          soundPlayed = true;
          // Reset after a short delay to allow sound on next hover
          setTimeout(() => {
            soundPlayed = false;
          }, 300);
        }
      });
    }
  });

  // Add hover sound to dropdown items
  const dropdownLinks = document.querySelectorAll(".dropdown-content a");
  dropdownLinks.forEach((link) => {
    let soundPlayed = false;
    link.addEventListener("mouseenter", () => {
      // Try to initialize audio context on first hover
      if (!audioInitialized) {
        initAudioContext();
      }
      if (!soundPlayed) {
        createClickSound();
        soundPlayed = true;
        setTimeout(() => {
          soundPlayed = false;
        }, 300);
      }
    });
  });

  // Hamburger menu toggle
  const sidebar = document.querySelector(".sidebar");
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      sidebar.classList.toggle("active");
      navLinksContainer.classList.toggle("active");
    });
  }

  // Toggle dark mode
  nameBox.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem(
      "darkMode",
      document.body.classList.contains("dark-mode") ? "enabled" : "disabled"
    );
  });

  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
  }

  document.querySelector(".name-box").addEventListener("click", function () {
    this.classList.toggle("clicked");
    const span = this.querySelector("span");
    span.textContent = this.classList.contains("clicked")
      ? "Meritia"
      : "Karmesh";
  });

  // Smooth scrolling with offset
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      if (targetId.startsWith("#")) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const offset = 80;
          const elementPosition =
            targetElement.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
          // Close sidebar on mobile after clicking a link
          if (window.innerWidth <= 768) {
            sidebar.classList.remove("active");
            navLinksContainer.classList.remove("active");
          }
        }
      } else {
        window.location.href = targetId;
      }
    });
  });

  // Dropdown initial state
  dropdownItems.forEach((item) => {
    item.querySelector("a").style.filter = "none";
    item.style.opacity = "0";
    item.style.transform = "translateY(5px)";
  });
  dropdownContent.style.height = "0";

  // Name-box tilt effect
  nameBox.addEventListener("mousemove", (event) => {
    const rect = nameBox.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const boxWidth = rect.width;
    const tiltFactor = (mouseX / boxWidth - 0.5) * 20;
    nameBox.style.transform = `perspective(500px) rotateY(${tiltFactor}deg)`;
  });
  nameBox.addEventListener("mouseleave", () => {
    nameBox.style.transform = "perspective(500px) rotateY(0deg)";
  });

  // Dropdown hover effects
  dropdown.addEventListener("mouseenter", () => {
    const totalHeight = dropdownItems.length * 40;
    dropdownContent.style.height = `${totalHeight}px`;
    dropdownItems.forEach((item, index) => {
      setTimeout(() => {
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
        item.querySelector("a").style.filter = "none";
      }, index * 100);
    });
  });
  dropdown.addEventListener("mouseleave", () => {
    dropdownContent.style.height = "0";
    dropdownItems.forEach((item) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(5px)";
      item.querySelector("a").style.filter = "none";
    });
  });

  // Blur effect for nav links
  const topLevelLinks = document.querySelectorAll(".nav-links > li");
  topLevelLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      topLevelLinks.forEach((otherLink) => {
        otherLink.querySelector("a").style.filter =
          otherLink === link ? "none" : "blur(2px)";
      });
    });
    link.addEventListener("mouseleave", () => {
      topLevelLinks.forEach((otherLink) => {
        otherLink.querySelector("a").style.filter = "none";
      });
    });
  });

  // Intersection Observer for animations
  const observerOptions = { root: null, rootMargin: "0px", threshold: 0.1 };

  // Skills section
  const skillsBoxes = document.querySelectorAll(".skills-box");
  const skillsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  skillsBoxes.forEach((box, index) => {
    box.style.transitionDelay = `${index * 0.3}s`;
    skillsObserver.observe(box);
  });

  // Ideas section
  const ideaBoxes = document.querySelectorAll(".idea-box");
  const ideasGrid = document.querySelector(".ideas-grid");

  // Function to make idea boxes visible
  const makeIdeaBoxesVisible = () => {
    ideaBoxes.forEach((box) => {
      box.classList.add("visible");
    });
  };

  // Check screen size on load
  if (window.innerWidth <= 600) {
    // On mobile (≤ 600px), make all idea boxes visible immediately
    makeIdeaBoxesVisible();
  } else {
    // On larger screens, observe the grid container instead of individual boxes
    // This ensures all boxes animate when the grid comes into view
    if (ideasGrid) {
      const ideaObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // When grid is visible, animate all boxes with reduced delays
              ideaBoxes.forEach((box, index) => {
                // Reduce delay - cap at 0.6s for last box instead of 1.2s
                const delay = Math.min(index * 0.15, 0.6);
                box.style.transitionDelay = `${delay}s`;
                box.classList.add("visible");
              });
              observer.unobserve(entry.target);
            }
          });
        },
        { root: null, rootMargin: "50px", threshold: 0.1 }
      );
      ideaObserver.observe(ideasGrid);
    }
  }

  // Handle resize events to re-evaluate visibility
  window.addEventListener("resize", () => {
    if (window.innerWidth <= 600) {
      makeIdeaBoxesVisible();
    }
  });

  // Info section
  const infoSection = document.querySelector("#info");
  if (infoSection) {
    const infoLines = document.querySelectorAll(".info-line");
    const infoObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          infoLines.forEach((line, index) => {
            setTimeout(() => {
              line.classList.add("visible");
            }, index * 200);
          });
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    infoObserver.observe(infoSection);
  }

  // Experience section dropdowns
  const experienceItems = document.querySelectorAll(".experience-item");
  const experienceMap = document.querySelector(".experience-map");
  const mapIframe = experienceMap?.querySelector("iframe");

  // Ensure all items start collapsed
  experienceItems.forEach((item) => {
    item.classList.remove("active");
  });

  experienceItems.forEach((item) => {
    const header = item.querySelector(".experience-header");

    if (!header) return;

    header.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Close other items
      experienceItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
        }
      });

      // Toggle current item
      item.classList.toggle("active");

      // Handle map visibility - only show when a non-remote experience is expanded
      const isRemote = item.getAttribute("data-remote") === "true";
      const isActive = item.classList.contains("active");

      if (isActive && !isRemote) {
        // Show map only when non-remote experience is expanded
        experienceMap?.classList.remove("hidden");
        // Update map location
        const location = item.getAttribute("data-location");
        if (location && mapIframe) {
          const mapUrl = `https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(
            location + ", India"
          )}&key=AIzaSyDYuVauZk7WRYkk_FlVxt1wFTPSjRdZesk`;
          mapIframe.src = mapUrl;
        }
      } else {
        // Hide map when remote experience is expanded or when item is collapsed
        experienceMap?.classList.add("hidden");
      }
    });
  });

  // Initialize map visibility on load - hide by default
  experienceMap?.classList.add("hidden");
});
