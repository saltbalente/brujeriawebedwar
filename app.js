const revealItems = document.querySelectorAll(".reveal");
const commentsHost = document.querySelector("[data-fb-comments]");
const lazyHeroVideo = document.querySelector(".hero-media video[data-src-mobile]");
const lazyClosingVideo = document.querySelector(".closing-video-frame video[data-src-mobile]");
const mysticBar = document.querySelector(".mystic-bar");
const commentWhatsAppPanel = document.querySelector(".comment-whatsapp-panel");
const commentWhatsAppForm = document.querySelector("[data-comment-whatsapp-form]");
const commentWhatsAppInput = document.querySelector("[data-comment-whatsapp-input]");
const consultationPromo = document.querySelector(".scroll-promo--consultas");
const fraudPromo = document.querySelector(".scroll-promo--fraude");
const guidanceSection = document.querySelector("#guidance");
const processSection = document.querySelector(".process");
const closingVideoSection = document.querySelector(".closing-video");
const whatsappBaseUrl = "https://wa.me/573012887371?text=";
let thirdCommentTrigger = null;

const toggleMysticBar = () => {
  if (!mysticBar) return;
  mysticBar.classList.toggle("is-visible", window.scrollY > 60);
};

const setThirdCommentTrigger = () => {
  if (!commentsHost) return;
  thirdCommentTrigger = commentsHost.querySelectorAll(".fb-comment")[2] || null;
};

const initCommentPanelObserver = () => {
  if (!commentWhatsAppPanel || !thirdCommentTrigger) return;

  const commentObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const shouldShow = entry.isIntersecting;
        commentWhatsAppPanel.classList.toggle("is-visible", shouldShow);
        document.body.classList.toggle("has-comment-panel", shouldShow);
      });
    },
    { rootMargin: "0px 0px -40% 0px", threshold: 0.1 }
  );

  commentObserver.observe(thirdCommentTrigger);
};

const initScrollPromoObservers = () => {
  if (!consultationPromo || !fraudPromo || !guidanceSection || !processSection || !closingVideoSection) return;

  const consultObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        consultationPromo.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    { rootMargin: "0px 0px -70% 0px", threshold: 0.1 }
  );

  const fraudObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        fraudPromo.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    { rootMargin: "0px 0px -70% 0px", threshold: 0.1 }
  );

  consultObserver.observe(guidanceSection);
  fraudObserver.observe(processSection);

  const closingObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          consultationPromo.classList.remove("is-visible");
          fraudPromo.classList.remove("is-visible");
        }
      });
    },
    { threshold: 0.1 }
  );

  closingObserver.observe(closingVideoSection);
};

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

toggleMysticBar();
window.addEventListener("scroll", toggleMysticBar, { passive: true });
window.addEventListener("resize", toggleMysticBar);

if (commentWhatsAppForm && commentWhatsAppInput) {
  commentWhatsAppForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const message = commentWhatsAppInput.value.trim();
    if (!message) {
      commentWhatsAppInput.focus();
      return;
    }

    const whatsappUrl = `${whatsappBaseUrl}${encodeURIComponent(
      `Hola, quiero enviar este comentario:\n\n${message}`
    )}`;

    window.open(whatsappUrl, "_blank", "noopener");
  });
}

if (commentsHost) {
  const femaleAvatars = Array.from({ length: 26 }, (_, index) => `images/avatars/w${index + 1}.jpg`);
  const maleAvatars = Array.from({ length: 26 }, (_, index) => `images/avatars/m${index + 1}.jpg`);

  const femaleNames = [
    "María Camila",
    "Laura Sofía",
    "Diana Paola",
    "Andrea Juliana",
    "Paola Andrea",
    "Carolina Pérez",
    "Sofía Martínez",
    "Juliana Rojas",
    "Valentina Gómez",
    "Natalia Herrera",
    "Melissa Vargas",
    "Camila Moreno",
    "Daniela Castro",
    "Alejandra Ruiz",
    "Luisa Fernanda",
    "Katherine Díaz",
    "Mónica Torres",
    "Sara León",
  ];

  const maleNames = [
    "Juan David",
    "Andrés Felipe",
    "Carlos Andrés",
    "Sebastián Torres",
    "Miguel Ángel",
    "Santiago López",
    "Felipe Ramírez",
    "José Manuel",
    "Daniel Rojas",
    "Luis Fernando",
    "Javier Gutiérrez",
    "Ricardo Pérez",
    "Mateo Salazar",
    "Esteban Gil",
    "Nicolás Herrera",
    "Tomás Cárdenas",
    "Diego Romero",
    "Álvaro Gómez",
  ];

  const times = [
    "hace 23 horas",
    "hace 2 dias",
    "hace 4 dias",
    "hace 6 dias",
    "hace 1 semana",
    "hace 2 semanas",
    "hace 3 semanas",
    "hace 1 mes",
    "hace 2 meses",
    "hace 3 meses",
    "hace 5 meses",
    "hace 8 meses",
  ];

  const cities = [
    "Newark, NJ",
    "Phoenix, AZ",
    "Austin, TX",
    "Orlando, FL",
    "San Diego, CA",
    "Denver, CO",
    "Charlotte, NC",
    "Nashville, TN",
    "Seattle, WA",
    "Las Vegas, NV",
    "Columbus, OH",
    "San Antonio, TX",
    "Boston, MA",
    "Portland, OR",
    "Detroit, MI",
    "Tampa, FL",
    "Baltimore, MD",
    "Milwaukee, WI",
    "Sacramento, CA",
    "Oklahoma City, OK",
    "Kansas City, MO",
    "El Paso, TX",
    "Louisville, KY",
    "Raleigh, NC",
    "Omaha, NE",
    "Minneapolis, MN",
    "Cleveland, OH",
    "New Orleans, LA",
    "Salt Lake City, UT",
    "Pittsburgh, PA",
    "Honolulu, HI",
    "Richmond, VA",
    "Birmingham, AL",
    "Boise, ID",
    "Fresno, CA",
    "Tulsa, OK",
    "Albuquerque, NM",
    "Anchorage, AK",
    "Reno, NV",
    "Greensboro, NC",
    "St. Louis, MO",
    "Bakersfield, CA",
    "Madison, WI",
    "Des Moines, IA",
    "Little Rock, AR",
    "Spokane, WA",
    "Huntsville, AL",
    "Chattanooga, TN",
    "Knoxville, TN",
    "Fort Worth, TX",
    "Virginia Beach, VA",
  ];

  const texts = [
    "Me respondieron rápido y me explicaron qué trabajo encajaba con mi caso.",
    "Estaba confundida y la consulta fue directa, con pasos claros desde el inicio.",
    "Había distancia con mi pareja y la orientación fue concreta y sin vueltas.",
    "Me explicaron el proceso en privado y con detalles que sí se entienden.",
    "Quería recuperar contacto y me dieron una guía sencilla para comenzar.",
    "Había una tercera persona y me dijeron qué hacer según mi situación.",
    "La atención fue clara y rápida, sin perder tiempo ni rodeos.",
    "Solo quería una respuesta concreta y me la dieron en el primer mensaje.",
    "Me ayudaron a diferenciar entre amarre, unión y reconciliación.",
    "La consulta me dejó tranquila porque entendí lo que sí podían hacer.",
    "Tenía miedo de escribir, pero el trato fue respetuoso y serio.",
    "Me dijeron cómo avanzar y qué esperar en los siguientes días.",
  ];

  const textsMale = [
    "Me respondieron rápido y me explicaron qué trabajo encajaba con mi caso.",
    "Estaba confundido y la consulta fue directa, con pasos claros desde el inicio.",
    "Había distancia con mi pareja y la orientación fue concreta y sin vueltas.",
    "Me explicaron el proceso en privado y con detalles que sí se entienden.",
    "Quería recuperar contacto y me dieron una guía sencilla para comenzar.",
    "Había una tercera persona y me dijeron qué hacer según mi situación.",
    "La atención fue clara y rápida, sin perder tiempo ni rodeos.",
    "Solo quería una respuesta concreta y me la dieron en el primer mensaje.",
    "Me ayudaron a diferenciar entre amarre, unión y reconciliación.",
    "La consulta me dejó tranquilo porque entendí lo que sí podían hacer.",
    "Tenía miedo de escribir, pero el trato fue respetuoso y serio.",
    "Me dijeron cómo avanzar y qué esperar en los siguientes días.",
  ];

  const buildComment = (index) => {
    const isFemale = index % 2 === 0;
    const name = isFemale
      ? femaleNames[(index / 2) % femaleNames.length]
      : maleNames[((index - 1) / 2) % maleNames.length];
    const avatar = isFemale
      ? femaleAvatars[(index / 2) % femaleAvatars.length]
      : maleAvatars[((index - 1) / 2) % maleAvatars.length];
    const text = isFemale
      ? texts[index % texts.length]
      : textsMale[index % textsMale.length];
    const time = times[index % times.length];
    const city = cities[index % cities.length];
    const likes = 1 + ((index * 3) % 12);
    const replies = index % 5 === 0 ? 1 + (index % 2) : 0;

    return {
      name,
      avatar,
      text,
      time,
      city,
      likes,
      replies,
    };
  };

  const renderComments = () => {
    if (commentsHost.dataset.loaded === "true") return;
    const fragment = document.createDocumentFragment();

    Array.from({ length: 51 }, (_, index) => buildComment(index)).forEach((comment) => {
      const item = document.createElement("li");
      item.className = "fb-comment";

      const avatar = document.createElement("figure");
      avatar.className = "fb-avatar";
      const img = document.createElement("img");
      img.src = comment.avatar;
      img.alt = `Avatar de ${comment.name}`;
      img.loading = "lazy";
      img.decoding = "async";
      avatar.appendChild(img);

      const main = document.createElement("div");
      main.className = "fb-comment-main";

      const header = document.createElement("header");
      header.className = "fb-comment-meta";

      const name = document.createElement("strong");
      name.className = "fb-comment-name";
      name.textContent = `${comment.name} · ${comment.city}`;

      const time = document.createElement("time");
      time.className = "fb-comment-time";
      time.dateTime = "2026-03-22T05:00:00Z";
      time.textContent = comment.time;

      const text = document.createElement("p");
      text.className = "fb-comment-text";
      text.textContent = comment.text;

      const footer = document.createElement("footer");
      footer.className = "fb-comment-actions";

      const likes = document.createElement("span");
      likes.textContent = `${comment.likes} me gusta`;

      const replies = document.createElement("span");
      if (comment.replies) {
        replies.textContent = `${comment.replies} respuesta`;
      }

      const reply = document.createElement("span");
      reply.textContent = "Responder";

      const reactions = document.createElement("span");
      reactions.className = "fb-comment-reactions";
      reactions.innerHTML = '<i aria-hidden="true"></i>Reacciones';

      header.appendChild(name);
      header.appendChild(time);
      footer.appendChild(likes);
      if (comment.replies) footer.appendChild(replies);
      footer.appendChild(reply);
      footer.appendChild(reactions);
      main.appendChild(header);
      main.appendChild(text);
      main.appendChild(footer);
      item.appendChild(avatar);
      item.appendChild(main);
      fragment.appendChild(item);
    });

    commentsHost.appendChild(fragment);
    commentsHost.dataset.loaded = "true";
    setThirdCommentTrigger();
    initCommentPanelObserver();
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    renderComments();
  } else {
    const commentsObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            renderComments();
            obs.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    commentsObserver.observe(commentsHost);
  }

  setThirdCommentTrigger();
  initCommentPanelObserver();
}

initScrollPromoObservers();

if (lazyHeroVideo) {
  const loadHeroVideo = () => {
    if (lazyHeroVideo.dataset.loaded === "true") return;

    const useMobile = window.matchMedia("(max-width: 919px)").matches;
    const source = document.createElement("source");
    source.type = "video/mp4";
    source.src = useMobile
      ? lazyHeroVideo.dataset.srcMobile
      : lazyHeroVideo.dataset.srcDesktop;

    lazyHeroVideo.appendChild(source);
    lazyHeroVideo.load();
    lazyHeroVideo.dataset.loaded = "true";
  };

  const scheduleLoad = () => loadHeroVideo();

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    scheduleLoad();
  } else if ("requestIdleCallback" in window) {
    window.requestIdleCallback(scheduleLoad, { timeout: 1500 });
  } else {
    window.setTimeout(scheduleLoad, 1200);
  }
}

if (lazyClosingVideo) {
  const loadClosingVideo = () => {
    if (lazyClosingVideo.dataset.loaded === "true") return;

    const useMobile = window.matchMedia("(max-width: 919px)").matches;
    const source = document.createElement("source");
    source.type = "video/mp4";
    source.src = useMobile
      ? lazyClosingVideo.dataset.srcMobile
      : lazyClosingVideo.dataset.srcDesktop;

    lazyClosingVideo.appendChild(source);
    lazyClosingVideo.load();
    lazyClosingVideo.dataset.loaded = "true";
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    loadClosingVideo();
  } else {
    const closingObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadClosingVideo();
            obs.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    closingObserver.observe(document.querySelector(".closing-video"));
  }
}
