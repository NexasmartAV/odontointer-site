const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');

menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  nav.style.display = open ? 'flex' : '';
  nav.style.position = open ? 'absolute' : '';
  nav.style.top = open ? '76px' : '';
  nav.style.right = open ? '5vw' : '';
  nav.style.flexDirection = open ? 'column' : '';
  nav.style.alignItems = open ? 'flex-end' : '';
  nav.style.padding = open ? '18px' : '';
  nav.style.background = open ? 'var(--cream)' : '';
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    if (!nav.classList.contains('is-open')) return;
    nav.classList.remove('is-open');
    nav.removeAttribute('style');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Abrir menu');
  });
});

const WHATSAPP_NUMBER = '5511988728242';
const overlay = document.querySelector('#concierge-overlay');
const dialog = document.querySelector('.concierge-dialog');
const chat = document.querySelector('#concierge-chat');
const actions = document.querySelector('#concierge-actions');
const typing = document.querySelector('#concierge-typing');
const progress = document.querySelector('.concierge-progress span');
const closeButton = document.querySelector('.concierge-close');
const restartButton = document.querySelector('#concierge-restart');
const launcher = document.querySelector('.concierge-launcher');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const services = {
  'Implantes dentários': 'A avaliação de implantes considera as condições clínicas e as possibilidades de reabilitação antes de qualquer planejamento.',
  'Prótese dentária': 'O planejamento de prótese avalia alternativas de reposição ou reconstrução dentária de acordo com as necessidades de cada caso.',
  'Clareamento dental': 'O clareamento começa com uma avaliação individual para entender as possibilidades e os cuidados adequados ao seu caso.',
  'Facetas': 'O planejamento de facetas considera suas condições clínicas, seus objetivos e as possibilidades indicadas para cada sorriso.',
  'Odontologia miofuncional': 'A odontologia miofuncional avalia funções e hábitos orofaciais relacionados à mastigação, deglutição, respiração e fala.',
  'Harmonização orofacial': 'A harmonização orofacial parte de uma avaliação individual das necessidades funcionais e estéticas, com indicação definida pelo profissional responsável.',
  'Avaliação geral': 'A avaliação inicial é o melhor ponto de partida quando você ainda não sabe qual caminho faz sentido para o seu momento.'
};

let session = {};
let flowToken = 0;
let previousFocus = null;

const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

function greetingForNow() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

function setProgress(value) {
  if (progress) progress.style.width = `${value}%`;
}

function scrollConversation() {
  window.requestAnimationFrame(() => {
    if (chat) chat.scrollTop = chat.scrollHeight;
  });
}

function addMessage(text, sender = 'bot', tone = '') {
  const bubble = document.createElement('div');
  bubble.className = `concierge-message concierge-message-${sender}${tone ? ` concierge-message-${tone}` : ''}`;
  bubble.textContent = text;
  chat?.appendChild(bubble);
  scrollConversation();
  return bubble;
}

function addUserMessage(text) {
  addMessage(text, 'user');
}

function clearActions() {
  if (actions) actions.replaceChildren();
}

async function botSays(messages, next, tone = '') {
  const token = flowToken;
  clearActions();
  for (const message of messages) {
    if (token !== flowToken) return;
    if (typing) typing.hidden = false;
    scrollConversation();
    await wait(reduceMotion ? 0 : 390);
    if (token !== flowToken) return;
    if (typing) typing.hidden = true;
    addMessage(message, 'bot', tone);
    await wait(reduceMotion ? 0 : 90);
  }
  if (token === flowToken && typeof next === 'function') next();
}

function renderOptions(options) {
  clearActions();
  const group = document.createElement('div');
  group.className = 'concierge-choice-grid';
  options.forEach((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = option.emphasis ? 'concierge-choice is-emphasis' : 'concierge-choice';
    button.textContent = option.label;
    button.addEventListener('click', () => {
      group.querySelectorAll('button').forEach((item) => { item.disabled = true; });
      addUserMessage(option.reply || option.label);
      option.onSelect(option.value ?? option.label);
    }, { once: true });
    group.appendChild(button);
  });
  actions?.appendChild(group);
  window.requestAnimationFrame(() => group.querySelector('button')?.focus({ preventScroll: true }));
}

function renderTextInput({ label, placeholder, buttonLabel = 'Continuar', optional = false, multiline = false, maxLength = 120, onSubmit }) {
  clearActions();
  const form = document.createElement('form');
  form.className = 'concierge-input-form';

  const visibleLabel = document.createElement('label');
  visibleLabel.textContent = label;
  const field = document.createElement(multiline ? 'textarea' : 'input');
  field.placeholder = placeholder;
  field.maxLength = maxLength;
  field.autocomplete = multiline ? 'off' : 'given-name';
  field.rows = multiline ? 3 : undefined;
  visibleLabel.appendChild(field);

  const error = document.createElement('span');
  error.className = 'concierge-input-error';
  error.setAttribute('role', 'status');

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'concierge-input-submit';
  submit.textContent = buttonLabel;

  form.append(visibleLabel, error, submit);

  if (optional) {
    const skip = document.createElement('button');
    skip.type = 'button';
    skip.className = 'concierge-input-skip';
    skip.textContent = 'Continuar sem acrescentar';
    skip.addEventListener('click', () => {
      addUserMessage('Prefiro continuar sem acrescentar.');
      onSubmit('');
    }, { once: true });
    form.appendChild(skip);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = field.value.replace(/\s+/g, ' ').trim();
    if (!optional && value.length < 2) {
      error.textContent = 'Digite pelo menos dois caracteres para continuar.';
      field.focus();
      return;
    }
    addUserMessage(value || 'Sem observações adicionais.');
    onSubmit(value);
  });

  actions?.appendChild(form);
  window.requestAnimationFrame(() => field.focus({ preventScroll: true }));
}

function showMainChoices() {
  setProgress(12);
  renderOptions([
    { label: 'Agendar uma avaliação', onSelect: beginIntent, emphasis: true },
    { label: 'Conhecer os tratamentos', onSelect: beginIntent },
    { label: 'Já sou paciente', onSelect: beginIntent },
    { label: 'Falar com a recepção', onSelect: beginIntent },
    { label: 'Urgência odontológica', onSelect: beginIntent }
  ]);
}

function resetConcierge(prefill = {}) {
  flowToken += 1;
  session = {
    intent: '',
    name: '',
    service: '',
    timeframe: '',
    period: '',
    subject: '',
    note: ''
  };
  chat?.replaceChildren();
  clearActions();
  if (typing) typing.hidden = true;
  setProgress(5);

  botSays([
    `${greetingForNow()}! Que bom ter você aqui.`,
    'Sou a Concierge Digital da Odonto Inter. Vou entender o que você precisa e organizar seu contato com a nossa equipe.'
  ], () => {
    if (prefill.service) {
      addUserMessage(`Quero conversar sobre ${prefill.service}.`);
      session.intent = 'Conhecer os tratamentos';
      session.service = prefill.service;
      showServiceInformation();
      return;
    }
    if (prefill.intent) {
      addUserMessage(prefill.intent);
      beginIntent(prefill.intent, false);
      return;
    }
    showMainChoices();
  });
}

function beginIntent(intent, saveReply = true) {
  session.intent = intent;
  setProgress(25);
  if (saveReply === false) {
    // The initiating choice was already represented in the conversation.
  }

  if (intent === 'Agendar uma avaliação') {
    askName('Perfeito. Vou preparar um pedido de avaliação do seu jeito.');
    return;
  }
  if (intent === 'Conhecer os tratamentos') {
    botSays(['Claro. Qual possibilidade de cuidado você gostaria de conhecer primeiro?'], showServiceMenu);
    return;
  }
  if (intent === 'Já sou paciente') {
    askName('Que bom ter você de volta. Vou direcionar seu contato para a equipe certa.');
    return;
  }
  if (intent === 'Falar com a recepção') {
    askName('Claro. Vou deixar sua mensagem organizada para a recepção.');
    return;
  }
  if (intent === 'Urgência odontológica') {
    showUrgencyGuidance();
  }
}

function askName(introduction) {
  botSays([introduction, 'Antes de continuar, como você gostaria de ser chamado ou chamada?'], () => {
    renderTextInput({
      label: 'Seu primeiro nome',
      placeholder: 'Digite seu nome',
      maxLength: 40,
      onSubmit: (name) => {
        session.name = name;
        setProgress(42);
        continueAfterName();
      }
    });
  });
}

function continueAfterName() {
  if (session.intent === 'Agendar uma avaliação') {
    if (session.service) askTimeframe();
    else botSays([`${session.name}, existe algum cuidado específico que você gostaria de conversar na avaliação?`], showSchedulingServices);
    return;
  }
  if (session.intent === 'Já sou paciente') {
    botSays([`${session.name}, qual é o assunto principal do seu contato?`], showPatientSubjects);
    return;
  }
  if (session.intent === 'Falar com a recepção' || session.intent === 'Conhecer os tratamentos') {
    askOptionalNote();
    return;
  }
  if (session.intent === 'Urgência odontológica') {
    showSummary();
  }
}

function showSchedulingServices() {
  renderOptions([
    ...Object.keys(services).map((service) => ({
      label: service,
      onSelect: (value) => {
        session.service = value;
        setProgress(57);
        askTimeframe();
      }
    })),
    {
      label: 'Ainda não sei',
      onSelect: () => {
        session.service = 'A definir na avaliação';
        setProgress(57);
        askTimeframe();
      }
    }
  ]);
}

function showServiceMenu() {
  renderOptions(Object.keys(services).map((service) => ({
    label: service,
    onSelect: (value) => {
      session.service = value;
      setProgress(40);
      showServiceInformation();
    }
  })));
}

function showServiceInformation() {
  botSays([services[session.service] || services['Avaliação geral'], 'Como você prefere seguir?'], () => {
    renderOptions([
      {
        label: 'Quero agendar uma avaliação',
        onSelect: () => {
          session.intent = 'Agendar uma avaliação';
          if (session.name) askTimeframe();
          else askName('Ótimo. Vou organizar sua preferência para a equipe.');
        },
        emphasis: true
      },
      {
        label: 'Quero falar com a equipe',
        onSelect: () => {
          session.intent = 'Conhecer os tratamentos';
          if (session.name) askOptionalNote();
          else askName('Combinado. Vou preparar uma conversa com a equipe.');
        }
      },
      {
        label: 'Ver outro tratamento',
        onSelect: () => {
          session.service = '';
          botSays(['Sem problema. Escolha outra possibilidade:'], showServiceMenu);
        }
      }
    ]);
  });
}

function askTimeframe() {
  botSays(['Quando você gostaria de receber uma opção de horário?'], () => {
    renderOptions([
      { label: 'Nos próximos dias', onSelect: saveTimeframe },
      { label: 'Nesta semana', onSelect: saveTimeframe },
      { label: 'Na próxima semana', onSelect: saveTimeframe },
      { label: 'Sem preferência', onSelect: saveTimeframe }
    ]);
  });
}

function saveTimeframe(value) {
  session.timeframe = value;
  setProgress(72);
  botSays(['E qual período costuma ser melhor para você?'], () => {
    renderOptions([
      { label: 'Manhã', onSelect: savePeriod },
      { label: 'Tarde', onSelect: savePeriod },
      { label: 'Sem preferência', onSelect: savePeriod }
    ]);
  });
}

function savePeriod(value) {
  session.period = value;
  setProgress(84);
  askOptionalNote();
}

function showPatientSubjects() {
  renderOptions([
    { label: 'Agendamento ou remarcação', onSelect: saveSubject },
    { label: 'Dúvida sobre acompanhamento', onSelect: saveSubject },
    { label: 'Documentos e informações', onSelect: saveSubject },
    { label: 'Outro assunto', onSelect: saveSubject }
  ]);
}

function saveSubject(value) {
  session.subject = value;
  setProgress(70);
  askOptionalNote();
}

function askOptionalNote() {
  botSays(['Quer acrescentar alguma informação breve para a equipe? Evite incluir exames ou dados de saúde neste campo.'], () => {
    renderTextInput({
      label: 'Mensagem opcional',
      placeholder: 'Escreva apenas o essencial',
      buttonLabel: 'Preparar meu atendimento',
      optional: true,
      multiline: true,
      maxLength: 180,
      onSubmit: (note) => {
        session.note = note;
        showSummary();
      }
    });
  });
}

function showUrgencyGuidance() {
  setProgress(35);
  botSays([
    'Entendi. Este atendimento digital não realiza avaliação clínica nem substitui um serviço de urgência.',
    'Se houver trauma importante, sangramento intenso ou dificuldade para respirar ou engolir, procure atendimento de emergência imediatamente. Em emergência médica, ligue 192.'
  ], () => {
    renderOptions([
      {
        label: 'Quero chamar a recepção',
        onSelect: () => {
          session.subject = 'Solicito retorno sobre urgência odontológica';
          askName('Vou preparar um contato direto com a recepção, sem fazer perguntas clínicas.');
        },
        emphasis: true
      },
      {
        label: 'Voltar ao início',
        onSelect: () => resetConcierge()
      }
    ]);
  }, 'alert');
}

function summaryRows() {
  return [
    ['Nome', session.name],
    ['Motivo', session.intent],
    ['Interesse', session.service],
    ['Quando', session.timeframe],
    ['Período', session.period],
    ['Assunto', session.subject],
    ['Observação', session.note]
  ].filter(([, value]) => Boolean(value));
}

function buildWhatsAppMessage() {
  const lines = [
    'Olá, equipe Odonto Inter!',
    'Vim pela Concierge Digital do site.',
    '',
    ...summaryRows().map(([label, value]) => `${label}: ${value}`),
    '',
    'Gostaria de continuar o atendimento e confirmar os próximos passos.'
  ];
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

function showSummary() {
  setProgress(100);
  const firstName = session.name ? `, ${session.name}` : '';
  botSays([`Tudo pronto${firstName}. Organizei seu pedido para você não precisar começar a conversa do zero.`], () => {
    clearActions();
    const card = document.createElement('div');
    card.className = 'concierge-summary';

    const heading = document.createElement('div');
    heading.className = 'concierge-summary-heading';
    heading.innerHTML = '<span>Resumo do atendimento</span><strong>Pronto para enviar</strong>';
    card.appendChild(heading);

    const list = document.createElement('dl');
    summaryRows().forEach(([label, value]) => {
      const term = document.createElement('dt');
      const description = document.createElement('dd');
      term.textContent = label;
      description.textContent = value;
      list.append(term, description);
    });
    card.appendChild(list);

    const whatsappButton = document.createElement('button');
    whatsappButton.type = 'button';
    whatsappButton.className = 'concierge-whatsapp-button';
    whatsappButton.innerHTML = '<span>Continuar no WhatsApp</span><b aria-hidden="true">↗</b>';
    whatsappButton.addEventListener('click', () => {
      window.open(buildWhatsAppMessage(), '_blank', 'noopener,noreferrer');
    });

    const assurance = document.createElement('p');
    assurance.className = 'concierge-summary-assurance';
    assurance.textContent = 'Você poderá revisar a mensagem no WhatsApp antes de enviá-la. O agendamento será confirmado pela equipe.';

    card.append(whatsappButton, assurance);
    actions?.appendChild(card);
    window.requestAnimationFrame(() => whatsappButton.focus({ preventScroll: true }));
  });
}

function openConcierge(prefill = {}) {
  if (!overlay) return;
  previousFocus = document.activeElement;
  overlay.hidden = false;
  document.body.classList.add('concierge-is-open');
  window.requestAnimationFrame(() => overlay.classList.add('is-open'));
  launcher?.classList.remove('is-inviting');
  resetConcierge(prefill);
  window.setTimeout(() => closeButton?.focus({ preventScroll: true }), reduceMotion ? 0 : 180);
}

function closeConcierge() {
  if (!overlay) return;
  flowToken += 1;
  if (typing) typing.hidden = true;
  overlay.classList.remove('is-open');
  document.body.classList.remove('concierge-is-open');
  window.setTimeout(() => {
    overlay.hidden = true;
    if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
  }, reduceMotion ? 0 : 220);
}

document.querySelectorAll('[data-concierge-open]').forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    openConcierge();
  });
});

document.querySelectorAll('[data-concierge-intent]').forEach((trigger) => {
  trigger.addEventListener('click', () => openConcierge({ intent: trigger.dataset.conciergeIntent }));
});

document.querySelectorAll('[data-concierge-service]').forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    openConcierge({ service: trigger.dataset.conciergeService });
  });
});

closeButton?.addEventListener('click', closeConcierge);
restartButton?.addEventListener('click', () => resetConcierge());
overlay?.addEventListener('click', (event) => {
  if (event.target === overlay) closeConcierge();
});

document.addEventListener('keydown', (event) => {
  if (overlay?.hidden) return;
  if (event.key === 'Escape') {
    closeConcierge();
    return;
  }
  if (event.key !== 'Tab' || !dialog) return;
  const focusable = [...dialog.querySelectorAll('button:not([disabled]), input, textarea, a[href]')]
    .filter((element) => element.offsetParent !== null);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

window.setTimeout(() => {
  if (overlay?.hidden) launcher?.classList.add('is-inviting');
}, reduceMotion ? 0 : 3200);
