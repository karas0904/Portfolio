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

  const closeSidebar = () => {
    sidebar?.classList.remove("active");
    navLinksContainer?.classList.remove("active");
  };

  // Hamburger menu toggle
  const sidebar = document.querySelector(".sidebar");
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      sidebar.classList.toggle("active");
      navLinksContainer.classList.toggle("active");
    });
  }

  // Close sidebar when clicking outside on mobile
  document.addEventListener("click", (event) => {
    if (window.innerWidth > 768) return;
    if (!sidebar?.classList.contains("active")) return;
    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickOnHamburger = hamburger?.contains(event.target);
    if (!isClickInsideSidebar && !isClickOnHamburger) {
      closeSidebar();
    }
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
            closeSidebar();
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

      // Skip items that are meant to be static (e.g., TCS without details yet)
      if (item.getAttribute("data-static") === "true") {
        return;
      }

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

  // Language toggle functionality
  const langBox = document.querySelector(".lang-box");
  const langButtons = document.querySelectorAll(".lang-btn");
  const currentLang = localStorage.getItem("selectedLanguage") || "en";

  // Translations object
  const translations = {
    en: {
      "info-p1":
        "Hi, I'm a software engineer. I've completed my B.Tech in Computer Science and Technology at SRM University, where I maintained a GPA of 9.09.",
      "info-p2":
        "I like to build new projects. For a long time, I believed that completing courses, reading books, and studying PDFs would be enough to master something. But it wasn't until I started creating things myself that I truly understood the power of practical experience. Each project exposed me to new tools, taught me how they function, and showed me how to integrate them effectively. Every entry in my project list represents a step forward a moment where I encountered something new and grew from it.",
      "info-p3":
        "Looking ahead, I'm planning to pursue a Master's degree with a specialization in Artificial Intelligence/Machine Learning or Robotics. My interest in Machine Learning (ML) has been there for quite a long time now. I've built a strong foundation in Python and completed several beginner level ML projects. I've also taken a course diving into the mathematics behind ML believe me, it was challenging! Yet, that complexity fuels my desire to explore further. The more I learn about ML, the more I realize how vast and intricate this field is, pushing me to dig deeper into its theoretical and practical depths.",
      "exp-1":
        "Developed secure and scalable API systems by implementing JWT authentication with refresh token mechanisms. Designed and built robust backend services using FastAPI, and established automated email notification workflows through SMTP integration. Managed database schema evolution and migration processes using Alembic, maintaining data integrity across development and production environments. Enhanced chatbot capabilities by integrating Retrieval-Augmented Generation (RAG) architecture, significantly improving conversational accuracy and context relevance.",
      "exp-2":
        "Collaborated with the Operations Research team to optimize logistics efficiency through innovative strategies, utilizing bin packing algorithms and optimization techniques in Python. Gained hands-on experience in implementing advanced algorithms to solve complex logistical challenges, leading to improved operational workflows.",
      "idea-1":
        "A dating web app exclusively for SRM University<br />students.",
      "idea-2":
        "A website that simplifies setting up directories<br />and repositories.",
      "idea-3":
        "A Google Chrome extension to save code snippets,<br />powered by an ML model.",
      "idea-4":
        "An ML project with Streamlit that suggests resume<br />improvements and shows live job postings.",
      "idea-5":
        "An ML project using KNN regression to predict building energy efficiency.",
    },
    hi: {
      "info-p1":
        "Hi, मैं एक सॉफ्टवेयर इंजीनियर हूँ। मैंने SRM University से Computer Science and Technology में B.Tech किया है, और मेरा GPA 9.09 रहा है।",
      "info-p2":
        "मुझे नए प्रोजेक्ट बनाना बहुत पसंद है। काफी समय तक मुझे लगता था कि कोर्स पूरे करना, किताबें पढ़ना या PDFs देखना ही किसी चीज़ में मास्टरी हासिल करने के लिए काफी है। लेकिन जब तक मैंने खुद चीज़ें बनाना शुरू नहीं किया, तब तक मुझे समझ ही नहीं आया कि असली सीख कहां से आती है। हर प्रोजेक्ट ने मुझे नए टूल्स से मिलवाया, यह सिखाया कि वो कैसे काम करते हैं, और उनको एक-दूसरे के साथ कैसे जोड़ना है। मेरे हर प्रोजेक्ट के पीछे एक छोटा सा कदम है एक ऐसा मोमेंट जब मैंने कुछ नया सीखा और उससे थोड़ा और बेहतर हुआ।",
      "info-p3":
        "आगे चलकर मैं Master's करने की प्लानिंग कर रहा हूँ, खासकर Artificial Intelligence/Machine Learning या Robotics में स्पेशलाइज़ेशन के साथ। ML में मेरी दिलचस्पी काफी समय से है। Python में मेरी अच्छी पकड़ है और मैंने कई beginner level ML प्रोजेक्ट भी किए हैं। इसके अलावा मैंने ML के पीछे की mathematics भी पढ़ी है और सच कहूँ तो, वो काफ़ी कठिन थी! लेकिन शायद वही complexity मुझे और ज्यादा explore करने के लिए push करती है। जितना ML के बारे में सीखता हूँ, उतना ही पता चलता है कि ये फील्ड कितनी विशाल और deep है और यही मुझे इसे और गहराई से समझने के लिए motivate करता है।",
      "exp-1":
        "मैंने secure और scalable API systems बनाए, जहाँ JWT authentication और refresh tokens का इस्तेमाल करके पूरा सिस्टम और भी सुरक्षित बनाया। FastAPI की मदद से मैंने मज़बूत backend services डिज़ाइन और तैयार किए, और SMTP integration के ज़रिए automated email notification workflows भी सेट किए। Database के schema changes और migrations को Alembic से handle किया, जिससे development और production—दोनों में data ठीक से और सुरक्षित बना रहा। इसके अलावा, मैंने chatbot में RAG (Retrieval-Augmented Generation) architecture भी integrate किया, जिससे उसकी conversational accuracy और context समझने की क्षमता काफी बेहतर हो गई।",
      "exp-2":
        "मैंने Operations Research टीम के साथ मिलकर लॉजिस्टिक्स की efficiency बढ़ाने पर काम किया, जहाँ हमने नए ideas और strategies इस्तेमाल किए। Python में bin packing algorithms और optimization techniques लगाकर मैंने काफी practical experience हासिल किया। इस दौरान मुझे advanced algorithms को असली logistical problems पर लागू करने का hands-on exposure मिला, जिससे operational workflows पहले से ज़्यादा smooth और efficient हो गए।",
      "idea-1": "SRM University के students के लिए एक dating web app।",
      "idea-2":
        "एक website जो directories और repositories setup करना आसान बनाती है।",
      "idea-3":
        "Code snippets save करने के लिए एक Google Chrome extension,<br />जो ML model से powered है।",
      "idea-4":
        "Streamlit के साथ एक ML project जो resume में सुधार सुझाता है<br />और live job postings दिखाता है।",
      "idea-5":
        "Building energy efficiency predict करने के लिए KNN regression का इस्तेमाल करने वाला एक ML project।",
    },
    zh: {
      "info-p1":
        "Hi，我是一个软件工程师。本科是在 SRM University 读的计算机科学与技术专业，GPA 是 9.09。",
      "info-p2":
        "我平时特别喜欢做新项目。之前一直觉得，只要把课程看完、书看完、PDF 学完，就能把一门技术学透。但后来我发现，真正的提升还是得靠自己动手做东西。每做一个项目，我都会接触到新的工具，了解它们怎么用、怎么组合在一起。我的每个项目，其实都是我成长的一小步——都是在解决新问题、学到新东西的过程。",
      "info-p3":
        "接下来，我准备申请硕士，方向主要想走人工智能/机器学习或者机器人方向。我对机器学习的兴趣其实很早就有了。Python 基础我打得比较牢，也做过不少入门级的 ML 项目。我还专门学过机器学习背后的数学，说实话，那真的挺难的！但也正是这种'难'，让我更想深入研究。越学机器学习，我越觉得这个领域非常大、非常深，也更激发我继续往下钻。",
      "exp-1":
        "我开发了安全又可扩展的 API 系统，使用 JWT 认证和 refresh token 来提升整体安全性。通过 FastAPI 构建并设计了稳定可靠的后端服务，还通过 SMTP 集成实现了自动化邮件通知流程。数据库的结构变更和迁移我用 Alembic 来管理，保证了开发环境和生产环境中的数据一致性和安全性。另外，我还把 RAG（检索增强生成）架构集成到聊天机器人里，大大提升了对话的准确度和上下文理解能力。",
      "exp-2":
        "我和运筹学团队一起合作，通过一些创新策略来提升物流效率。我们在 Python 中使用了 bin packing 算法和各种优化技术，这让我积累了非常实际的经验。在这个过程中，我把一些高级算法真正应用到复杂的物流问题中，明显改善了整体的运营流程，让工作更加顺畅和高效。",
      "idea-1": "专为 SRM University 学生设计的<br />约会网站应用。",
      "idea-2": "一个简化目录和仓库设置的<br />网站。",
      "idea-3":
        "一个用于保存代码片段的 Google Chrome 扩展，<br />由 ML 模型驱动。",
      "idea-4":
        "一个使用 Streamlit 的 ML 项目，可建议简历改进<br />并显示实时职位发布。",
      "idea-5": "一个使用 KNN 回归预测建筑能源效率的 ML 项目。",
    },
  };

  // Function to update translations
  const updateTranslations = (lang) => {
    const elementsToTranslate = document.querySelectorAll("[data-translate]");
    elementsToTranslate.forEach((element) => {
      const key = element.getAttribute("data-translate");
      if (translations[lang] && translations[lang][key]) {
        // Use innerHTML for elements that may contain HTML tags like <br />
        element.innerHTML = translations[lang][key];
      }
    });
  };

  // Set initial active language
  if (langBox) {
    langBox.setAttribute("data-active", currentLang);
  }

  langButtons.forEach((btn) => {
    if (btn.getAttribute("data-lang") === currentLang) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Set initial translations
  updateTranslations(currentLang);

  // Handle language button clicks
  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedLang = btn.getAttribute("data-lang");

      // Update slider position
      if (langBox) {
        langBox.setAttribute("data-active", selectedLang);
      }

      // Remove active class from all buttons
      langButtons.forEach((b) => b.classList.remove("active"));

      // Add active class to clicked button
      btn.classList.add("active");

      // Save to localStorage
      localStorage.setItem("selectedLanguage", selectedLang);

      // Update HTML lang attribute
      document.documentElement.lang = selectedLang;

      // Update translations
      updateTranslations(selectedLang);

      console.log(`Language changed to: ${selectedLang}`);
    });
  });

  // Set initial HTML lang attribute
  document.documentElement.lang = currentLang;
});
