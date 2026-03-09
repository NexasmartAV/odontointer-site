(function () {
  var body = document.body;
  var header = document.querySelector(".site-header");
  var nav = document.querySelector(".site-nav");
  var navToggle = document.querySelector(".site-nav__toggle");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".site-nav__list a[href]"));
  var footerPanels = document.querySelectorAll(".site-footer-panel");
  var revealItems = document.querySelectorAll("[data-reveal]");
  var forms = document.querySelectorAll("[data-contact-form]");
  var buttons = document.querySelectorAll(".site-button[href]");
  var path = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  var currentPage = path === "" ? "index.html" : path;
  var isHomePage = currentPage === "index.html";

  if (body) {
    body.classList.add("site-reveal-ready");
  }

  function closeNav() {
    if (!nav || !navToggle) {
      return;
    }

    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  function openNav() {
    if (!nav || !navToggle) {
      return;
    }

    nav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
  }

  function setActiveLink(activeLink) {
    navLinks.forEach(function (link) {
      if (link === activeLink) {
        link.classList.add("is-active");
      } else {
        link.classList.remove("is-active");
      }
    });
  }

  function smoothScrollTo(target) {
    if (!target) {
      return;
    }

    var headerOffset = header ? header.offsetHeight + 18 : 0;
    var targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: "smooth"
    });
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      if (nav.classList.contains("is-open")) {
        closeNav();
      } else {
        openNav();
      }
    });
  }

  document.addEventListener("click", function (event) {
    if (!nav || !nav.classList.contains("is-open")) {
      return;
    }

    if (nav.contains(event.target)) {
      return;
    }

    closeNav();
  });

  navLinks.forEach(function (link) {
    var href = link.getAttribute("href") || "";

    if (href.charAt(0) === "#" && isHomePage) {
      link.addEventListener("click", function (event) {
        var target = document.querySelector(href);

        if (!target) {
          return;
        }

        event.preventDefault();
        smoothScrollTo(target);
        history.replaceState(null, "", href);
        setActiveLink(link);
        closeNav();
      });
      return;
    }

    link.addEventListener("click", function () {
      closeNav();
    });
  });

  if (isHomePage) {
    var sectionLinks = navLinks.filter(function (link) {
      var href = link.getAttribute("href") || "";
      return href.charAt(0) === "#";
    });

    if ("IntersectionObserver" in window && sectionLinks.length) {
      var sectionObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) {
              return;
            }

            var activeLink = sectionLinks.find(function (link) {
              return link.getAttribute("href") === "#" + entry.target.id;
            });

            if (activeLink) {
              setActiveLink(activeLink);
            }
          });
        },
        {
          rootMargin: "-35% 0px -45% 0px",
          threshold: 0.15
        }
      );

      sectionLinks.forEach(function (link) {
        var section = document.querySelector(link.getAttribute("href"));
        if (section) {
          sectionObserver.observe(section);
        }
      });
    }
  }

  if (!isHomePage) {
    if (currentPage === "produtos.html") {
      var aboutLink = navLinks.find(function (link) {
        return (link.getAttribute("href") || "").toLowerCase().indexOf("#sobre-clinica") !== -1;
      });

      if (aboutLink) {
        setActiveLink(aboutLink);
      }
    }

    navLinks.forEach(function (link) {
      var href = (link.getAttribute("href") || "").toLowerCase();
      if (!href || href.charAt(0) === "#") {
        return;
      }

      if (href.split("#")[0] === currentPage) {
        setActiveLink(link);
      }
    });
  } else {
    var currentHash = window.location.hash || "#home";
    var hashLink = navLinks.find(function (link) {
      return link.getAttribute("href") === currentHash;
    });

    if (hashLink) {
      setActiveLink(hashLink);
    }
  }

  if (footerPanels.length) {
    Array.prototype.forEach.call(footerPanels, function (panel) {
      panel.innerHTML =
        '<div class="site-footer-grid">' +
          '<div class="site-footer-block">' +
            '<span class="site-section-label">Odonto Inter</span>' +
            '<h2>Odontologia premium com acolhimento, clareza e confian&ccedil;a em Alphaville.</h2>' +
            '<p>Uma cl&iacute;nica pensada para oferecer atendimento humano, ambiente elegante e planejamento cuidadoso para cada sorriso.</p>' +
          "</div>" +
          '<div class="site-footer-block">' +
            "<h3>Contato</h3>" +
            "<p>WhatsApp: (11) 98872-8242</p>" +
            "<p>Telefone: (11) 4191-0732</p>" +
          "</div>" +
          '<div class="site-footer-block">' +
            "<h3>Endere&ccedil;o</h3>" +
            "<p>Alameda Rio Negro, 911 sala 601</p>" +
            "<p>Edif&iacute;cio Omega</p>" +
            "<p>Alphaville - Barueri - SP</p>" +
          "</div>" +
        "</div>" +
        '<div class="site-footer-meta">' +
          '<div class="site-footer-social" aria-label="Redes sociais da Odonto Inter">' +
            '<a href="https://www.instagram.com/odontointeroficial/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">' +
              '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2.2A2.8 2.8 0 0 0 4.2 7v10A2.8 2.8 0 0 0 7 19.8h10a2.8 2.8 0 0 0 2.8-2.8V7A2.8 2.8 0 0 0 17 4.2H7zm10.5 1.6a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2.2A2.8 2.8 0 1 0 12 15a2.8 2.8 0 0 0 0-5.6z"></path></svg>' +
            "</a>" +
            '<a href="https://wa.me/5511988728242?text=Vim%20do%20site%20e%20quero%20agendar%20uma%20consulta" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">' +
              '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20zm4.4-5.7c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.5.6c-.2.2-.3.2-.6.1a6.6 6.6 0 0 1-3.2-2.8c-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.4.1-.6l-.8-1.8c-.1-.3-.3-.3-.6-.3h-.5c-.2 0-.5.1-.7.3a2.2 2.2 0 0 0-.7 1.6c0 1 .7 2 1 2.4.1.1 1.9 3 4.7 4.1 2.8 1.2 2.8.8 3.3.7.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.5-.3z"></path></svg>' +
            "</a>" +
          "</div>" +
          '<a class="site-button site-button--whatsapp" href="https://wa.me/5511988728242?text=Vim%20do%20site%20e%20quero%20agendar%20uma%20avaliacao" target="_blank" rel="noopener noreferrer">Agendar avalia&ccedil;&atilde;o</a>' +
        "</div>";
    });
  }

  Array.prototype.forEach.call(buttons, function (button) {
    var href = button.getAttribute("href") || "";
    if (href.indexOf("wa.me") !== -1) {
      button.classList.add("site-button--whatsapp");
    }
  });

  if (revealItems.length) {
    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(revealItems, function (item) {
        item.classList.add("is-visible");
      });
    } else {
      var revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          });
        },
        {
          rootMargin: "0px 0px -10% 0px",
          threshold: 0.12
        }
      );

      Array.prototype.forEach.call(revealItems, function (item) {
        revealObserver.observe(item);
      });
    }
  }

  Array.prototype.forEach.call(forms, function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var nome = (form.querySelector('[name="nome"]') || {}).value || "";
      var telefone = (form.querySelector('[name="telefone"]') || {}).value || "";
      var procedimento = (form.querySelector('[name="procedimento"]') || {}).value || "";
      var mensagem = (form.querySelector('[name="mensagem"]') || {}).value || "";
      var text =
        "Ol&aacute;, vim pelo site da Odonto Inter e gostaria de solicitar contato.\n\n" +
        "Nome: " + nome + "\n" +
        "Telefone: " + telefone + "\n" +
        "Procedimento de interesse: " + procedimento + "\n" +
        "Mensagem: " + mensagem;

      window.open(
        "https://wa.me/5511988728242?text=" + encodeURIComponent(text),
        "_blank",
        "noopener"
      );
    });
  });
})();
