document.addEventListener("DOMContentLoaded", () => {
  const nameBox = document.querySelector(".name-box");
  const navLinks = document.querySelectorAll(".nav-links a");
  const dropdown = document.querySelector(".dropdown");
  const dropdownContent = document.querySelector(".dropdown-content");
  const dropdownItems = document.querySelectorAll(".dropdown-content li");
  const hamburger = document.querySelector(".hamburger");
  const sidebar = document.querySelector(".sidebar");
  const navLinksContainer = document.querySelector(".nav-links");

  // Hamburger menu toggle
  hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    navLinksContainer.classList.toggle("active");
  });

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
  const ideaObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  ideaBoxes.forEach((box, index) => {
    box.style.transitionDelay = `${index * 0.3}s`;
    ideaObserver.observe(box);
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

  // Experience section
  const experienceSection = document.querySelector("#experience");
  if (experienceSection) {
    const experienceLines = document.querySelectorAll(".experience-line");
    const experienceObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          experienceLines.forEach((line, index) => {
            setTimeout(() => {
              line.classList.add("visible");
            }, index * 200);
          });
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    experienceObserver.observe(experienceSection);
  }
});
