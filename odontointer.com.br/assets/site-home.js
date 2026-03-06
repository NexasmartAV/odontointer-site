(function () {
  var items = document.querySelectorAll("[data-reveal]");
  var forms = document.querySelectorAll("[data-contact-form]");
  var menuItems = document.querySelectorAll(".cs-menu .cs-menu-items");
  var buttons = document.querySelectorAll(".site-button[href]");
  var heroActions = document.querySelectorAll(".site-hero .site-actions .site-button");
  var homeTreatmentButtons = document.querySelectorAll(".site-home-treatments .site-button--inline");
  var homeHighlightButtons = document.querySelectorAll(".site-treatments-highlight .site-button");
  var embeddedCta = document.querySelector(".site-embedded-cta");
  var footerGhostButtons = document.querySelectorAll(".site-footer-panel .site-button--ghost");
  var footerPanels = document.querySelectorAll(".site-footer-panel");
  var path = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  var pageMap = {
    "": "index.html",
    "index.html": "index.html",
    "produtos.html": "produtos.html",
    "quem-somos.html": "produtos.html",
    "botox.html": "botox.html",
    "clareamento.html": "clareamento.html",
    "facetas.html": "facetas.html",
    "entre-em-contato.html": "entre-em-contato.html"
  };
  var currentPage = pageMap[path] || path;

  if (menuItems.length) {
    menuItems.forEach(function (menu) {
      var links = menu.querySelectorAll("a[href]");

      links.forEach(function (link) {
        var item = link.parentElement;
        var href = (link.getAttribute("href") || "").toLowerCase();

        if (!item || !href || href.indexOf("http") === 0 || href.indexOf("tel:") === 0 || href.indexOf("wa.me") !== -1) {
          return;
        }

        if (href === currentPage) {
          item.classList.add("cs-is-active");
        } else if (!item.classList.contains("site-nav-cta")) {
          item.classList.remove("cs-is-active");
        }
      });

    });
  }

  if (buttons.length) {
    buttons.forEach(function (button) {
      var href = button.getAttribute("href") || "";
      var parent = button.parentElement;

      if (href.indexOf("wa.me") !== -1 && !(parent && parent.classList.contains("site-nav-cta"))) {
        button.classList.add("site-button--whatsapp");
      }
    });
  }

  if (footerPanels.length) {
    footerPanels.forEach(function (panel) {
      panel.innerHTML =
        '<div class="site-footer-grid">' +
          '<div class="site-footer-block">' +
            '<span class="site-section-label">Odonto Inter</span>' +
            '<h2>Odontologia premium com acolhimento, clareza e confianca em Alphaville.</h2>' +
            '<p>Uma clinica pensada para oferecer atendimento humano, ambiente elegante e planejamento cuidadoso para cada sorriso.</p>' +
          '</div>' +
          '<div class="site-footer-block">' +
            '<h3>Contato</h3>' +
            '<p>WhatsApp: (11) 98872-8242</p>' +
            '<p>Telefone: (11) 4191-0732</p>' +
          '</div>' +
          '<div class="site-footer-block">' +
            '<h3>Endereco</h3>' +
            '<p>Alameda Rio Negro, 911 sala 601</p>' +
            '<p>Edificio Omega</p>' +
            '<p>Alphaville - Barueri - SP</p>' +
          '</div>' +
        '</div>' +
        '<div class="site-footer-meta">' +
          '<div class="site-footer-social" aria-label="Redes sociais da Odonto Inter">' +
            '<a href="https://www.instagram.com/odontointeroficial/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">' +
              '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2.2A2.8 2.8 0 0 0 4.2 7v10A2.8 2.8 0 0 0 7 19.8h10a2.8 2.8 0 0 0 2.8-2.8V7A2.8 2.8 0 0 0 17 4.2H7zm10.5 1.6a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2.2A2.8 2.8 0 1 0 12 15a2.8 2.8 0 0 0 0-5.6z"/></svg>' +
            '</a>' +
            '<a href="https://wa.me/5511988728242?text=Vim%20do%20site%20e%20quero%20agendar%20uma%20consulta" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">' +
              '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20zm4.4-5.7c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.5.6c-.2.2-.3.2-.6.1a6.6 6.6 0 0 1-3.2-2.8c-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.4.1-.6l-.8-1.8c-.1-.3-.3-.3-.6-.3h-.5c-.2 0-.5.1-.7.3a2.2 2.2 0 0 0-.7 1.6c0 1 .7 2 1 2.4.1.1 1.9 3 4.7 4.1 2.8 1.2 2.8.8 3.3.7.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.5-.3z"/></svg>' +
            '</a>' +
          '</div>' +
          '<a class="site-button" href="https://wa.me/5511988728242?text=Vim%20do%20site%20e%20quero%20agendar%20uma%20avaliacao" target="_blank" rel="noopener noreferrer">Agendar avaliacao</a>' +
        '</div>';
    });
  }

  if (heroActions.length >= 2) {
    heroActions[0].href = "entre-em-contato.html";
    heroActions[0].textContent = "Agendar avaliacao";
    heroActions[0].classList.remove("site-button--whatsapp");

    heroActions[1].href = "produtos.html";
    heroActions[1].textContent = "Conhecer a clinica";
    heroActions[1].classList.remove("site-button--ghost", "site-button--whatsapp");
    heroActions[1].classList.add("site-button--secondary");
  }

  if (homeTreatmentButtons.length) {
    homeTreatmentButtons.forEach(function (button) {
      button.classList.add("site-button--secondary");
      button.classList.remove("site-button--whatsapp", "site-button--ghost");
    });

    if (homeTreatmentButtons[4]) {
      homeTreatmentButtons[4].textContent = "Ver detalhes";
    }

    if (homeTreatmentButtons[5]) {
      homeTreatmentButtons[5].textContent = "Entender melhor";
    }
  }

  if (homeHighlightButtons.length) {
    homeHighlightButtons.forEach(function (button) {
      button.classList.add("site-button--secondary");
      button.classList.remove("site-button--whatsapp", "site-button--ghost");
    });
  }

  if (embeddedCta) {
    var label = embeddedCta.querySelector(".site-section-label");
    var title = embeddedCta.querySelector("h2");
    var paragraph = embeddedCta.querySelector("p");
    var ctaButton = embeddedCta.querySelector(".site-button");

    if (label) {
      label.textContent = "Experiencia da clinica";
    }

    if (title) {
      title.textContent = "Um ambiente pensado para acolher, orientar e tratar com clareza.";
    }

    if (!paragraph) {
      paragraph = document.createElement("p");
      if (title && title.parentNode) {
        title.parentNode.appendChild(paragraph);
      }
    }

    if (paragraph) {
      paragraph.textContent = "Antes de qualquer decisao, a proposta e entender seu caso com calma e indicar o caminho mais adequado para o seu sorriso.";
    }

    if (ctaButton) {
      ctaButton.href = "produtos.html";
      ctaButton.textContent = "Conhecer a clinica";
      ctaButton.classList.add("site-button--secondary");
      ctaButton.classList.remove("site-button--whatsapp", "site-button--ghost");
    }
  }

  if (footerGhostButtons.length) {
    footerGhostButtons.forEach(function (button) {
      button.classList.add("site-button--secondary");
      button.classList.remove("site-button--ghost");
    });
  }

  if (items.length) {
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: "0px 0px -10% 0px",
          threshold: 0.12
        }
      );

      items.forEach(function (item) {
        observer.observe(item);
      });
    }
  }

  if (!forms.length) {
    return;
  }

  forms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var nome = (form.querySelector('[name="nome"]') || {}).value || "";
      var telefone = (form.querySelector('[name="telefone"]') || {}).value || "";
      var procedimento = (form.querySelector('[name="procedimento"]') || {}).value || "";
      var mensagem = (form.querySelector('[name="mensagem"]') || {}).value || "";
      var texto =
        "Ola, vim pelo site da Odonto Inter e gostaria de solicitar contato.%0A%0A" +
        "Nome: " + encodeURIComponent(nome) + "%0A" +
        "Telefone: " + encodeURIComponent(telefone) + "%0A" +
        "Procedimento de interesse: " + encodeURIComponent(procedimento) + "%0A" +
        "Mensagem: " + encodeURIComponent(mensagem);

      window.open("https://wa.me/5511988728242?text=" + texto, "_blank", "noopener");
    });
  });
})();
