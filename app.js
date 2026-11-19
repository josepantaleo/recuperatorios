/*
 * EXAMEN DE JAVASCRIPT - IPEM 146 / Formación Profesional Web
 * Basado en los contenidos del curso:
 * https://josepantaleo.github.io/formacionprofesionalweb/
 *
 * Requiere en el HTML los IDs:
 * theoryQuestions, interpretQuestions, progressText, progressBar,
 * gradeBtn, resetBtn (opcional), score, scoreText, gradeMessage.
 * Mantiene también las pestañas .tab y .section y los botones
 * .solution-btn existentes, si están presentes.
 *
 * IMPORTANTE: el intento único con localStorage se aplica a este navegador
 * y dispositivo. Para impedir que se borre el intento desde otro navegador,
 * incógnito o limpiando los datos, la validación debe realizarse en servidor.
 */

(() => {
  "use strict";

  // Cambiar la versión de la clave cuando el docente publique un examen nuevo.
  const EXAM_KEY = "ipem146_js_recuperatorio_intento_unico_v2";
  const DRAFT_KEY = `${EXAM_KEY}_borrador`;
  const HISTORY_KEY = "ipem146_js_examen_historial_v1";
  const LAYOUT_KEY = `${EXAM_KEY}_orden`;
  const PASS_PERCENT = 70;
  const TEACHER_PASSWORD = "fRANCISCOP6$";

  const theory = [
    { q: "¿Qué tipo de dato es 10?", a: ["string", "number", "boolean"], c: 1, e: "10 es un número." },
    { q: "¿Qué tipo de dato es \"Hola\"?", a: ["number", "string", "boolean"], c: 1, e: "El texto es string." },
    { q: "¿Qué palabra se usa para crear una variable que no cambia?", a: ["let", "const", "for"], c: 1, e: "const declara una variable que no se reasigna." },
    { q: "¿Qué símbolo se usa para sumar?", a: ["+", "-", "*"], c: 0, e: "+" + " suma valores." },
    { q: "¿Qué muestra console.log()?", a: ["Un mensaje en la consola", "Una imagen", "Un botón"], c: 0, e: "console.log muestra información en la consola." },
    { q: "¿Qué valor significa verdadero?", a: ["false", "true", "null"], c: 1, e: "true significa verdadero." },
    { q: "¿Qué palabra se usa para crear una función?", a: ["function", "array", "console"], c: 0, e: "function declara una función." },
    { q: "¿Qué estructura permite tomar una decisión?", a: ["if", "push", "length"], c: 0, e: "if evalúa una condición." },
    { q: "¿Qué se usa para repetir instrucciones?", a: ["for", "const", "return"], c: 0, e: "for permite repetir instrucciones." },
    { q: "¿Cómo se escribe el primer índice de un array?", a: ["1", "0", "-1"], c: 1, e: "El primer elemento está en el índice 0." },
    { q: "¿Qué método agrega un elemento al final de un array?", a: ["pop()", "push()", "map()"], c: 1, e: "push agrega un elemento al final." },
    { q: "¿Cómo se accede al nombre de un objeto alumno?", a: ["alumno.nombre", "nombre.alumno", "alumno-nombre"], c: 0, e: "Se usa el nombre del objeto y la propiedad separados por punto." },
    { q: "¿Qué propiedad indica cuántos elementos hay en un array?", a: ["length", "color", "name"], c: 0, e: "length indica la cantidad de elementos." },
    { q: "¿Qué método convierte un texto a minúsculas?", a: ["toUpperCase()", "toLowerCase()", "trim()"], c: 1, e: "toLowerCase convierte el texto a minúsculas." },
    { q: "¿Qué palabra permite devolver un resultado desde una función?", a: ["return", "console", "if"], c: 0, e: "return devuelve el resultado de la función." }
  ];

  const interpretation = [
    { q: "¿Qué muestra?\n\nlet nombre = \"Ana\";\nconsole.log(nombre);", a: ["nombre", "Ana", "Nada"], c: 1, e: "Se muestra el valor guardado en nombre." },
    { q: "¿Cuánto da?\n\nconsole.log(4 + 2);", a: ["42", "6", "8"], c: 1, e: "4 + 2 es 6." },
    { q: "¿Qué número muestra?\n\nconst numeros = [3, 5, 7];\nconsole.log(numeros[1]);", a: ["3", "5", "7"], c: 1, e: "El índice 1 corresponde al segundo elemento." },
    { q: "¿Qué valor queda?\n\nlet edad = 14;\nedad = 16;\nconsole.log(edad);", a: ["14", "16", "30"], c: 1, e: "La variable edad se actualiza a 16." },
    { q: "¿Qué números muestra?\n\nfor (let i = 1; i <= 3; i++) {\n console.log(i);\n}", a: ["1, 2, 3", "0, 1, 2", "Solo 3"], c: 0, e: "El ciclo muestra 1, 2 y 3." },
    { q: "¿Qué lista queda?\n\nconst colores = [\"rojo\", \"azul\"];\ncolores.push(\"verde\");", a: ["[rojo, azul]", "[rojo, azul, verde]", "[verde]"], c: 1, e: "push agrega verde al final." },
    { q: "¿Qué muestra?\n\nconst producto = { nombre: \"Mouse\" };\nconsole.log(producto.nombre);", a: ["Mouse", "nombre", "producto"], c: 0, e: "Se imprime la propiedad nombre." },
    { q: "¿Qué muestra?\n\nlet nota = 8;\nif (nota >= 6) {\n console.log(\"Aprobado\");\n}", a: ["Desaprobado", "Aprobado", "8"], c: 1, e: "La nota es mayor o igual a 6, por eso entra al if." },
    { q: "¿Qué mensaje se muestra?\n\nlet lluvia = false;\nif (lluvia) {\n console.log(\"Llevar paraguas\");\n} else {\n console.log(\"No llueve\");\n}", a: ["Llevar paraguas", "No llueve", "false"], c: 1, e: "Como lluvia es false, se ejecuta else." },
    { q: "¿Qué imprime?\n\nconsole.log(5 > 3);", a: ["true", "false", "5"], c: 0, e: "5 es mayor que 3, por eso es true." },
    { q: "¿Qué resultado devuelve?\n\nfunction sumar(a, b) {\n return a + b;\n}\nconsole.log(sumar(2, 3));", a: ["23", "5", "2"], c: 1, e: "La función suma los dos valores." },
    { q: "¿Qué texto se forma?\n\nlet saludo = \"Hola\";\nlet nombre = \"Luis\";\nconsole.log(saludo + \" \" + nombre);", a: ["HolaLuis", "Hola Luis", "Luis Hola"], c: 1, e: "Se unen los textos con un espacio." },
    { q: "¿Cuántos elementos tiene?\n\nconst materias = [\"Web\", \"Datos\", \"Inglés\"];\nconsole.log(materias.length);", a: ["2", "3", "4"], c: 1, e: "El array tiene tres elementos." },
    { q: "¿Cuándo aparece el mensaje?\n\nboton.addEventListener(\"click\", () => console.log(\"Hola\"));", a: ["Cuando se hace clic", "Al abrir la página", "Al escribir"], c: 0, e: "El evento click ocurre cuando se presiona el botón." },
    { q: "¿Qué muestra?\n\nlet precio = 100;\nconsole.log(precio * 2);", a: ["100", "200", "102"], c: 1, e: "100 multiplicado por 2 es 200." }
  ];

  const allItems = () => [
    ...theory.map((item, i) => ({ ...item, id: `t-${i}` })),
    ...interpretation.map((item, i) => ({ ...item, id: `i-${i}` }))
  ];

  let answers = {};
  let codeAnswers = {};
  let examLocked = false;
  let isGrading = false;
  let examLayout = null;

  const $ = id => document.getElementById(id);
  const totalQuestions = theory.length + interpretation.length;

  function shuffled(values) {
    const result = [...values];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function makeExamLayout() {
    const options = {};
    [...theory.map((_, i) => `t-${i}`), ...interpretation.map((_, i) => `i-${i}`)].forEach(id => {
      const item = id.startsWith('t-') ? theory[Number(id.slice(2))] : interpretation[Number(id.slice(2))];
      options[id] = shuffled(item.a.map((_, i) => i));
    });
    return {
      theory: shuffled(theory.map((_, i) => i)),
      interpretation: shuffled(interpretation.map((_, i) => i)),
      options
    };
  }

  function loadExamLayout() {
    try {
      const attempt = JSON.parse(localStorage.getItem(EXAM_KEY) || 'null');
      const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
      examLayout = attempt?.layout || draft?.layout || JSON.parse(localStorage.getItem(LAYOUT_KEY) || 'null');
    } catch { examLayout = null; }
    if (!examLayout || !Array.isArray(examLayout.theory) || !Array.isArray(examLayout.interpretation) || !examLayout.options) {
      examLayout = makeExamLayout();
      try { localStorage.setItem(LAYOUT_KEY, JSON.stringify(examLayout)); } catch {}
    }
  }

  function getHistory() {
    try {
      const data = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      return Array.isArray(data) ? data : [];
    } catch { return []; }
  }

  function saveHistory(attempt) {
    const history = getHistory();
    const id = attempt.id || `${attempt.date || Date.now()}_${(attempt.student?.lastName || 'estudiante').toLowerCase()}`;
    attempt.id = id;
    const index = history.findIndex(item => item.id === id);
    if (index >= 0) history[index] = attempt;
    else history.push(attempt);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); }
    catch (error) { console.warn('No se pudo guardar el historial docente:', error); }
  }

  function performanceLabel(score) {
    if (score >= 9) return 'Destacado';
    if (score >= 7) return 'Aprobado';
    if (score >= 6) return 'Próximo a aprobar';
    if (score >= 4) return 'En proceso';
    return 'Desempeño bajo';
  }

  function formatScore(value) {
    return Number(value || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function calculateQuestionStats(history) {
    const items = allItems();
    return items.map((item, index) => {
      const answered = history.filter(attempt => Number.isInteger(attempt.answers?.[item.id]));
      const errors = answered.filter(attempt => attempt.answers[item.id] !== item.c).length;
      return { label: `${index < theory.length ? 'A' : 'B'}${index < theory.length ? index + 1 : index - theory.length + 1}`, errors, total: answered.length, rate: answered.length ? errors / answered.length * 100 : 0 };
    }).sort((a, b) => b.rate - a.rate);
  }

  function calculateABPoints(savedAnswers) {
    const items = allItems();
    let points = 0;
    items.forEach((item, index) => {
      if (savedAnswers?.[item.id] === item.c) points += index < theory.length ? (2 / theory.length) : (4 / interpretation.length);
    });
    return Number(points.toFixed(2));
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function renderQuestions(items, target, prefix) {
    const root = $(target);
    if (!root) return;
    const order = prefix === 't' ? examLayout.theory : examLayout.interpretation;
    root.innerHTML = order.map(originalIndex => {
      const item = items[originalIndex];
      const id = `${prefix}-${originalIndex}`;
      const optionOrder = examLayout.options[id] || item.a.map((_, i) => i);
      return `
      <article class="question" id="${id}">
        <h3><span class="q-number">${order.indexOf(originalIndex) + 1}.</span> ${escapeHTML(item.q.split("\n\n")[0])}</h3>
        ${item.q.includes("\n\n") ? `<pre class="question-code"><code>${escapeHTML(item.q.split("\n\n").slice(1).join("\n\n"))}</code></pre>` : ""}
        <div class="options">
          ${optionOrder.map(originalOption => `
            <label class="option">
              <input type="radio" name="${id}" value="${originalOption}">
              <span>${escapeHTML(item.a[originalOption]).replace(/\n/g, "<br>")}</span>
            </label>
          `).join("")}
        </div>
        <p class="feedback" aria-live="polite"></p>
      </article>`;
    }).join("");

    root.querySelectorAll('input[type="radio"]').forEach(input => {
      input.addEventListener("change", () => {
        if (examLocked) { input.checked = false; return; }
        answers[input.name] = Number(input.value);
        updateProgress();
        saveDraft();
        const message = $("gradeMessage");
        if (message) message.textContent = "";
      });
    });
  }

  function updateProgress() {
    const answeredQuestions = Math.min(totalQuestions, Object.keys(answers).filter(id => /^(t|i)-\d+$/.test(id)).length);
    const answeredExercises = Array.from(document.querySelectorAll(".code-answer"))
      .filter(field => field.value.trim().length > 0).length;
    const totalActivities = totalQuestions + 3;
    const completed = answeredQuestions + answeredExercises;
    if ($("progressText")) $("progressText").textContent = `${completed} de ${totalActivities}`;
    if ($("progressBar")) $("progressBar").style.width = `${completed / totalActivities * 100}%`;
  }

  function initCodeEditors() {
    document.querySelectorAll(".code-answer").forEach((field, index) => {
      field.addEventListener("input", () => {
        codeAnswers[field.id] = field.value;
        updateProgress();
        saveDraft();
      });

      // Impide las acciones habituales de portapapeles dentro de los editores.
      ["paste", "copy", "cut", "drop", "contextmenu"].forEach(eventName => {
        field.addEventListener(eventName, event => event.preventDefault());
      });
      field.addEventListener("keydown", event => {
        const key = event.key.toLowerCase();
        const shortcut = (event.ctrlKey || event.metaKey) && ["v", "c", "x"].includes(key);
        const shiftInsert = event.shiftKey && key === "insert";
        if (shortcut || shiftInsert) {
          event.preventDefault();
        }
      });
    });
  }

  function restoreCodeAnswers(saved = {}) {
    document.querySelectorAll(".code-answer").forEach(field => {
      field.value = typeof saved[field.id] === "string" ? saved[field.id] : "";
      field.disabled = true;
    });
    codeAnswers = { ...saved };
  }

  function renderStudentSummary(savedAnswers, attempt = {}) {
    const root = $("studentSummary");
    if (!root) return;
    const items = allItems();
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    const rows = items.map((item, index) => {
      const selected = savedAnswers?.[item.id];
      const isAnswered = Number.isInteger(selected) && selected >= 0 && selected < item.a.length;
      const isCorrect = isAnswered && selected === item.c;
      if (isCorrect) correct++;
      else if (isAnswered) incorrect++;
      else unanswered++;
      const section = index < theory.length ? "Parte A · Teoría" : "Parte B · Interpretación";
      const number = (index < theory.length ? examLayout.theory : examLayout.interpretation).indexOf(index < theory.length ? index : index - theory.length) + 1;
      const statusClass = isCorrect ? "student-correct" : isAnswered ? "student-incorrect" : "student-unanswered";
      const status = isCorrect ? "✓ CORRECTA" : isAnswered ? "✕ INCORRECTA" : "— SIN RESPONDER";
      return `<article class="student-summary-item ${statusClass}">
        <div class="student-summary-top"><strong>${section} · Pregunta ${number}</strong><span>${status}</span></div>
        <p><strong>Tu respuesta:</strong> ${isAnswered ? escapeHTML(item.a[selected]) : "No respondiste esta pregunta."}</p>
        ${!isCorrect ? `<p><strong>Respuesta correcta:</strong> ${escapeHTML(item.a[item.c])}</p>` : ""}
        ${item.e ? `<small>${escapeHTML(item.e)}</small>` : ""}
      </article>`;
    }).join("");
    const theoryCorrect = items.slice(0, theory.length).filter(item => savedAnswers?.[item.id] === item.c).length;
    const interpretationCorrect = items.slice(theory.length).filter(item => savedAnswers?.[item.id] === item.c).length;
    const abPoints = calculateABPoints(savedAnswers);
    const theoryPoints = Number((theoryCorrect * (2 / theory.length)).toFixed(2));
    const interpretationPoints = Number((interpretationCorrect * (4 / interpretation.length)).toFixed(2));
    const automaticCodeTotal = Number((attempt.autoCodeScores || []).reduce((sum, value) => sum + Number(value || 0), 0).toFixed(2));
    const teacherCodeTotal = Object.values(attempt.teacherCodeScores || {}).reduce((sum, value) => sum + Number(value || 0), 0);
    const codePoints = Number.isFinite(attempt.teacherScore) ? teacherCodeTotal : automaticCodeTotal;
    const finalPoints = Number.isFinite(attempt.teacherScore) ? attempt.teacherScore : Number((abPoints + automaticCodeTotal).toFixed(2));
    const finalStatus = finalPoints >= 7 ? "APROBADO" : "NO APROBADO";
    root.innerHTML = `<h3>Corrección automática · Resultado de tu evaluación</h3>
      <div class="student-summary-counts">
        <div class="student-count count-correct"><strong>${correct}</strong><span>Correctas</span></div>
        <div class="student-count count-incorrect"><strong>${incorrect}</strong><span>Incorrectas</span></div>
        <div class="student-count count-unanswered"><strong>${unanswered}</strong><span>Sin responder</span></div>
      </div>
      <div class="student-section-scores">
        <div class="student-score-card"><span>Parte A · Teoría</span><strong>${formatScore(theoryPoints)} / 2</strong><small>${theoryCorrect} de ${theory.length} correctas</small></div>
        <div class="student-score-card"><span>Parte B · Interpretación</span><strong>${formatScore(interpretationPoints)} / 4</strong><small>${interpretationCorrect} de ${interpretation.length} correctas</small></div>
        <div class="student-score-card"><span>Parte C · Código</span><strong>${formatScore(codePoints)} / 4</strong><small>Corrección por criterios</small></div>
        <div class="student-score-card student-score-final"><span>PUNTAJE FINAL</span><strong>${formatScore(finalPoints)} / 10</strong><small>${finalStatus}</small></div>
      </div>
      <p class="student-summary-score">Puntaje A+B: <strong>${formatScore(abPoints)} / 6</strong>. ${Number.isFinite(attempt.teacherScore) ? "Nota definitiva con revisión docente." : "Nota automática calculada por respuestas y criterios de código. El docente puede revisar."}</p>
      <details class="student-code-feedback"><summary>Ver corrección automática de los ejercicios de código</summary><ol>${(attempt.autoCodeFeedback || []).map((exercise, i) => `<li><strong>Ejercicio ${i + 1} · ${formatScore((attempt.autoCodeScores || [])[i] || 0)} / ${formatScore([1.33, 1.33, 1.34][i])}</strong><ul>${exercise.map(item => `<li class="code-criterion ${item.ok ? "criterion-correct" : "criterion-incorrect"}">${item.ok ? "✓ CORRECTO" : "✗ INCORRECTO"} · ${escapeHTML(item.label)} (${formatScore(item.points)} pts)</li>`).join("")}</ul></li>`).join("")}</ol></details>
      <p class="learning-tip"><strong>Para mejorar:</strong> si tuviste errores en teoría, repasá conceptos y definiciones; si tuviste errores en interpretación, practicá la lectura paso a paso de fragmentos de código. La corrección automática de código brinda puntaje por criterios; el docente puede revisar y ajustar si corresponde.</p>
      <details class="student-summary-details" open><summary>Ver detalle de las 30 preguntas</summary><div class="student-summary-list">${rows}</div></details>`;
  }

  function showCorrection(savedAnswers, savedScore = null, savedDate = null, attempt = {}) {
    // Al entregar, se muestra al estudiante el resumen de A y B con aciertos y errores.
    renderStudentSummary(savedAnswers, attempt);
    allItems().forEach(item => {
      const selected = savedAnswers[item.id];
      const card = $(item.id);
      if (!card) return;
      card.querySelectorAll('input[type="radio"]').forEach(radio => {
        const optionIndex = Number(radio.value);
        radio.disabled = true;
        radio.checked = selected === optionIndex;
        const label = radio.closest(".option");
        if (label) {
          label.classList.remove("student-option-correct", "student-option-incorrect");
          if (optionIndex === item.c) label.classList.add("student-option-correct");
          else if (selected === optionIndex) label.classList.add("student-option-incorrect");
        }
      });
      const feedback = card.querySelector(".feedback");
      if (feedback) {
        const isCorrect = selected === item.c;
        const isAnswered = Number.isInteger(selected);
        feedback.className = `feedback student-feedback ${isCorrect ? "is-correct" : isAnswered ? "is-incorrect" : "is-unanswered"}`;
        feedback.textContent = isCorrect
          ? "✓ Correcta. ¡Bien hecho!"
          : isAnswered
            ? `✗ Incorrecta. La respuesta correcta es: ${item.a[item.c]}`
            : `— Sin responder. La respuesta correcta es: ${item.a[item.c]}`;
      }
    });

    const student = attempt.student || {};
    const identity = [student.name, student.lastName, student.course].filter(Boolean).join(" · ");
    if (Number.isFinite(attempt.teacherScore)) {
      if ($("score")) $("score").innerHTML = `${Number(attempt.teacherScore).toLocaleString("es-AR", { maximumFractionDigits: 2 })}<small> / 10</small>`;
      if ($("scoreText")) $("scoreText").textContent = `${identity ? identity + " | " : ""}Nota docente: ${Number(attempt.teacherGradeOutOfTen || 0).toFixed(2).replace(".", ",")}/10 · ${performanceLabel(Number(attempt.teacherGradeOutOfTen || 0))}. Calificación guardada.`;
      if ($("gradeMessage")) {
        const approved = attempt.teacherScore >= 7;
        $("gradeMessage").textContent = approved ? "Evaluación aprobada según el criterio del 70% (7/10)." : "Evaluación no aprobada. El mínimo es 70% (7/10).";
        $("gradeMessage").className = `grade-message ${approved ? "pass" : "fail"}`;
      }
    } else {
      const autoCodeTotal = Number((attempt.autoCodeScores || []).reduce((sum, value) => sum + Number(value || 0), 0).toFixed(2));
      const autoGrade = Number.isFinite(Number(attempt.autoGrade)) ? Number(attempt.autoGrade) : Number((calculateABPoints(savedAnswers) + autoCodeTotal).toFixed(2));
      const passed = autoGrade >= 7;
      if ($("score")) $("score").innerHTML = `${formatScore(autoGrade)}<small> / 10</small>`;
      if ($("scoreText")) $("scoreText").textContent = `${identity ? identity + " | " : ""}Nota automática: ${formatScore(autoGrade)}/10. Teoría e interpretación: ${formatScore(calculateABPoints(savedAnswers))}/6. Código: ${formatScore(autoCodeTotal)}/4. Resultado: ${passed ? "APROBADO" : "NO APROBADO"}.`;
      if ($("gradeMessage")) {
        $("gradeMessage").textContent = passed ? "Evaluación corregida automáticamente: APROBADO (7/10 o más). El docente puede revisar y ajustar la parte práctica." : "Evaluación corregida automáticamente: NO APROBADO (menos de 7/10). El docente puede revisar y ajustar la parte práctica.";
        $("gradeMessage").className = `grade-message ${passed ? "pass" : "fail"}`;
      }
    }
    ["studentName", "studentLastName", "studentCourse"].forEach(id => { if ($(id)) $(id).disabled = true; });
    document.querySelectorAll(".code-answer").forEach(field => { field.disabled = true; });
    const button = $("gradeBtn");
    if (button) { button.disabled = true; button.textContent = "RECUPERATORIO ENTREGADO"; }
    if ($("teacherReviewBtn")) $("teacherReviewBtn").hidden = false;
    if ($("resetBtn")) { $("resetBtn").disabled = true; $("resetBtn").hidden = true; }
    examLocked = true;
    updateProgress();
  }

  function assessCodeAnswers(codeAnswers = {}) {
    const texts = [1, 2, 3].map(n => String(codeAnswers[`answer${n}`] || "").toLowerCase().replace(/\s+/g, " "));
    const checks = [
      [
        ["precio", /const\s+precio\s*=\s*2400|let\s+precio\s*=\s*2400/, 0.30],
        ["Multiplicación para subtotal", /subtotal\s*=\s*precio\s*\*\s*cantidad/, 0.35],
        ["Descuento del 10%", /descuento\s*=\s*subtotal\s*\*\s*(0?\.1|10\s*\/\s*100)/, 0.34],
        ["Resta del descuento", /total\s*=\s*subtotal\s*-\s*descuento/, 0.34]
      ],
      [
        ["Promedio de cuatro notas", /\(\s*n1\s*\+\s*n2\s*\+\s*n3\s*\+\s*n4\s*\)\s*\/\s*4|\(\s*n1\s*\+\s*n2\s*\+\s*n3\s*\+\s*n4\s*\)\s*\/\s*4/, 0.45],
        ["Condición de aprobación (6 o más)", /promedio\s*>=\s*6/, 0.35],
        ["Mensajes de aprobado y desaprobado", /aprobado[\s\S]*desaprobado|desaprobado[\s\S]*aprobado/, 0.28],
        ["Uso de función", /function\s+calcularpromedio|calcularpromedio\s*\(/, 0.25]
      ],
      [
        ["Recorrido hasta el final del array", /i\s*<\s*temperaturas\.length/, 0.35],
        ["Filtro de 20 grados o más", /temperaturas\s*\[\s*i\s*\]\s*>=\s*20/, 0.35],
        ["Mostrar temperatura que cumple", /console\.log\s*\(\s*temperaturas\s*\[\s*i\s*\]\s*\)/, 0.30],
        ["Contador y salida del total", /cantidad\s*\+\+|cantidad\s*=\s*cantidad\s*\+\s*1/, 0.34]
      ]
    ];
    const maxPoints = [1.33, 1.33, 1.34];
    const results = texts.map((text, idx) => {
      let score = 0;
      const feedback = checks[idx].map(([label, pattern, points]) => {
        const ok = pattern.test(text);
        if (ok) score += points;
        return { label, ok, points };
      });
      score = Math.min(maxPoints[idx], Number(score.toFixed(2)));
      return { score, max: maxPoints[idx], feedback };
    });
    return results;
  }


  function modelAnswers() {
    return [
      `const precio = 2400;\nconst cantidad = 2;\nconst subtotal = precio * cantidad;\nconst descuento = subtotal * 0.10;\nconst total = subtotal - descuento;\nconsole.log(total);`,
      `function calcularPromedio(n1, n2, n3, n4) {\n  const promedio = (n1 + n2 + n3 + n4) / 4;\n  if (promedio >= 6) {\n    console.log("Aprobado");\n  } else {\n    console.log("Desaprobado");\n  }\n  return promedio;\n}\ncalcularPromedio(7, 5, 8, 6);`,
      `const temperaturas = [18, 24, 15, 30, 20];\nlet cantidad = 0;\nfor (let i = 0; i < temperaturas.length; i++) {\n  if (temperaturas[i] >= 20) {\n    console.log(temperaturas[i]);\n    cantidad++;\n  }\n}\nconsole.log("Cantidad:", cantidad);`
    ];
  }

  function renderTeacherReview(attempt) {
    const root = $("teacherReview");
    if (!root) return;
    const items = allItems();
    const correct = items.filter(item => attempt.answers?.[item.id] === item.c).length;
    const codeAnswersNow = attempt.codeAnswers || {};
    const savedCodeScores = attempt.teacherCodeScores || Object.fromEntries(assessCodeAnswers(codeAnswersNow).map((r, i) => [`answer${i + 1}`, r.score]));
    const keys = items.map((item, index) => {
      const selected = attempt.answers?.[item.id];
      const isAnswered = Number.isInteger(selected) && selected >= 0 && selected < item.a.length;
      const isCorrect = isAnswered && selected === item.c;
      const statusClass = isCorrect ? "answer-correct" : isAnswered ? "answer-incorrect" : "answer-unanswered";
      const statusText = isCorrect ? "✓ CORRECTA" : isAnswered ? "✕ INCORRECTA" : "— SIN RESPONDER";
      const section = index < theory.length ? "Parte A" : "Parte B";
      const number = (index < theory.length ? examLayout.theory : examLayout.interpretation).indexOf(index < theory.length ? index : index - theory.length) + 1;
      const studentText = isAnswered ? item.a[selected] : "Sin responder";
      const optionsMarkup = item.a.map((option, optionIndex) => {
        const optionClass = optionIndex === item.c
          ? "review-option review-option-correct"
          : (isAnswered && optionIndex === selected ? "review-option review-option-incorrect" : "review-option");
        const marker = optionIndex === item.c ? "✓ Correcta" : (isAnswered && optionIndex === selected ? "✕ Elegida" : "");
        return `<li class="${optionClass}"><span>${escapeHTML(option)}</span>${marker ? `<strong>${marker}</strong>` : ""}</li>`;
      }).join("");
      return `<li class="teacher-answer ${statusClass}">
        <div class="teacher-answer-top"><strong>${section} · Pregunta ${number}</strong><span class="answer-status">${statusText}</span></div>
        <p><strong>Respuesta del estudiante:</strong> ${escapeHTML(studentText)}</p>
        <p><strong>Respuesta correcta:</strong> ${escapeHTML(item.a[item.c])}</p>
        <ul class="review-options-list">${optionsMarkup}</ul>
        <small>${escapeHTML(item.e || "")}</small>
      </li>`;
    }).join("");
    const abScore = calculateABPoints(attempt.answers);
    const autoCodeResults = assessCodeAnswers(codeAnswersNow);
    const exercises = modelAnswers().map((model, index) => `
      <article class="ai-result">
        <h4>Ejercicio ${index + 1} · Código corregido de referencia</h4>
        <p class="reference-note">Puntaje automático: <strong>${formatScore(autoCodeResults[index].score)} / ${formatScore(autoCodeResults[index].max)}</strong>. ${autoCodeResults[index].feedback.map(f => `${f.ok ? "✓" : "✗"} ${f.label}`).join(" · ")}.</p><p>Modelo de solución. El docente puede ajustar el puntaje si considera válida otra solución.</p>
        <pre class="reference-code"><code>${escapeHTML(model)}</code></pre>
        <p><strong>Código entregado por el estudiante:</strong></p>
        <pre><code>${escapeHTML(codeAnswersNow[`answer${index + 1}`] || "Sin responder")}</code></pre>
        <label>Puntaje editable (automático como base; máximo según ejercicio)
          <input class="teacher-code-score" data-index="${index + 1}" type="number" min="0" max="${index === 2 ? "1.34" : "1.33"}" step="0.01" value="${Number.isFinite(Number(savedCodeScores[`answer${index + 1}`])) ? Number(savedCodeScores[`answer${index + 1}`]) : 0}">
        </label>
      </article>`).join("");
    root.innerHTML = `<h3>Evaluación docente · ${correct}/30 respuestas correctas · A y B: ${abScore.toFixed(2).replace(".", ",")}/6 puntos</h3>
      <p>Las respuestas correctas aparecen en verde y las incorrectas en rojo. En cada pregunta se muestra la respuesta elegida, la respuesta correcta y una explicación.</p>
      <details open><summary>Corrección de respuestas · Partes A y B</summary><ol class="teacher-answer-list">${keys}</ol></details>
      <h3>Parte C · Corrección de código</h3>
      <p>Teoría: 2 puntos repartidos entre las 15 preguntas. Interpretación: 4 puntos repartidos entre las 15 preguntas. Asigná hasta 1,33 puntos en los dos primeros ejercicios y 1,34 en el tercero (máximo 4 puntos). Total: 10 puntos.</p>${exercises}
      <button id="saveTeacherGrade" class="primary" type="button">Guardar calificación docente</button>
      <p id="teacherGradeStatus" aria-live="polite"></p>`;
    $("saveTeacherGrade")?.addEventListener("click", () => {
      const scores = {};
      let valid = true;
      root.querySelectorAll(".teacher-code-score").forEach(input => {
        const value = Number(input.value);
        if (!Number.isFinite(value) || value < 0 || value > (Number(input.dataset.index) === 3 ? 1.34 : 1.33)) valid = false;
        scores[`answer${input.dataset.index}`] = value;
      });
      if (!valid) {
        $("teacherGradeStatus").textContent = "Ingresá los puntajes permitidos: 1,33 en los dos primeros ejercicios y 1,34 en el tercero.";
        return;
      }
      const codeScore = Object.values(scores).reduce((sum, value) => sum + value, 0);
      const total = Number((abScore + codeScore).toFixed(2));
      const percent = total * 10;
      const gradeOutOfTen = total;
      attempt.teacherCodeScores = scores;
      attempt.teacherScore = total;
      attempt.teacherGradeOutOfTen = Number(gradeOutOfTen.toFixed(2));
      attempt.teacherGradedAt = new Date().toISOString();
      let isActiveAttempt = false;
      try {
        const activeAttempt = JSON.parse(localStorage.getItem(EXAM_KEY) || "null");
        isActiveAttempt = activeAttempt?.id === attempt.id;
        if (isActiveAttempt) localStorage.setItem(EXAM_KEY, JSON.stringify(attempt));
        saveHistory(attempt);
      } catch (error) {
        $("teacherGradeStatus").textContent = "No se pudo guardar la nota en este navegador.";
        return;
      }
      if (isActiveAttempt) {
        renderStudentSummary(attempt.answers, attempt);
        if ($("score")) $("score").innerHTML = `${total.toLocaleString("es-AR", { maximumFractionDigits: 2 })}<small> / 10</small>`;
        if ($("scoreText")) $("scoreText").textContent = `Nota docente: ${gradeOutOfTen.toFixed(2).replace(".", ",")}/10 · ${percent.toFixed(0)}% · ${performanceLabel(gradeOutOfTen)} · Teoría e interpretación: ${abScore.toFixed(2).replace(".", ",")}/6 (${correct}/30 correctas) · Código: ${codeScore.toFixed(2).replace(".", ",")}/4.`;
        if ($("gradeMessage")) {
          $("gradeMessage").textContent = percent >= PASS_PERCENT ? "Evaluación aprobada según el criterio del 70% (7/10)." : "Evaluación no aprobada. El mínimo es 70% (7/10).";
          $("gradeMessage").className = `grade-message ${percent >= PASS_PERCENT ? "pass" : "fail"}`;
        }
      }
      $("teacherGradeStatus").textContent = "Calificación docente guardada en el historial de este navegador.";
      renderTeacherDashboard();
    });
  }

  function renderTeacherDashboard() {
    let root = $('teacherDashboard');
    if (!root) {
      root = document.createElement('section');
      root.id = 'teacherDashboard';
      root.className = 'teacher-dashboard panel';
      root.innerHTML = '<div class="dashboard-heading"><div><span class="eyebrow">ADMINISTRACIÓN</span><h2>Panel de resultados</h2><p>Historial de entregas registradas en este navegador y dispositivo. Para reunir resultados de distintos dispositivos se necesita una base de datos compartida.</p></div><div class="dashboard-actions"><button id="exportExcelBtn" class="secondary" type="button">Exportar Excel (CSV)</button><button id="printReportBtn" class="primary" type="button">Imprimir / Guardar PDF</button></div></div><div class="dashboard-filters"><label>Filtrar por curso<input id="courseFilter" type="search" placeholder="Ej.: 6° A"></label><label>Buscar estudiante<input id="studentFilter" type="search" placeholder="Nombre o apellido"></label><label>Estado de evaluación<select id="statusFilter"><option value="todos">Todos los estados</option><option value="pendiente">Pendiente de corrección</option><option value="aprobado">Aprobado</option><option value="no-aprobado">No aprobado</option></select></label><label>Ordenar resultados<select id="sortFilter"><option value="reciente">Más recientes primero</option><option value="apellido">Apellido A–Z</option><option value="nota-desc">Mayor nota primero</option><option value="nota-asc">Menor nota primero</option></select></label></div><div id="dashboardStats" class="dashboard-stats"></div><div id="dashboardTableWrap"></div><div id="questionAnalytics"></div>';
      $('teacherReview')?.after(root);
    }
    const history = getHistory();
    const renderTable = () => {
      const course = $('courseFilter').value.trim().toLowerCase();
      const student = $('studentFilter').value.trim().toLowerCase();
      const status = $('statusFilter').value;
      const sort = $('sortFilter').value;
      let filtered = history.filter(item => {
        const grade = Number.isFinite(item.teacherScore) ? Number(item.teacherScore) : null;
        const matchesStatus = status === 'todos' ||
          (status === 'pendiente' && grade === null) ||
          (status === 'aprobado' && grade !== null && grade >= 7) ||
          (status === 'no-aprobado' && grade !== null && grade < 7);
        return `${item.student?.course || ''}`.toLowerCase().includes(course) &&
          `${item.student?.name || ''} ${item.student?.lastName || ''}`.toLowerCase().includes(student) && matchesStatus;
      });
      filtered.sort((a, b) => {
        if (sort === 'apellido') return `${a.student?.lastName || ''} ${a.student?.name || ''}`.localeCompare(`${b.student?.lastName || ''} ${b.student?.name || ''}`, 'es');
        if (sort === 'nota-desc') return (Number.isFinite(b.teacherScore) ? b.teacherScore : -1) - (Number.isFinite(a.teacherScore) ? a.teacherScore : -1);
        if (sort === 'nota-asc') return (Number.isFinite(a.teacherScore) ? a.teacherScore : 99) - (Number.isFinite(b.teacherScore) ? b.teacherScore : 99);
        return new Date(b.date) - new Date(a.date);
      });
      const graded = filtered.filter(item => Number.isFinite(item.teacherScore));
      const average = graded.length ? graded.reduce((sum, item) => sum + Number(item.teacherScore), 0) / graded.length : 0;
      const passed = graded.filter(item => Number(item.teacherScore) >= 7).length;
      $('dashboardStats').innerHTML = `
        <div class="dashboard-stat"><strong>${filtered.length}</strong><span>Entregas encontradas</span></div>
        <div class="dashboard-stat"><strong>${graded.length}</strong><span>Calificadas</span></div>
        <div class="dashboard-stat"><strong>${graded.length ? formatScore(average) : '—'}</strong><span>Promedio del filtro / 10</span></div>
        <div class="dashboard-stat"><strong>${graded.length ? Math.round(passed / graded.length * 100) + '%' : '—'}</strong><span>Aprobación entre calificadas</span></div>`;
      $('dashboardTableWrap').innerHTML = filtered.length ? `<div class="table-scroll"><table class="results-table"><thead><tr><th>Estudiante</th><th>Curso</th><th>Fecha</th><th>Nota / 10</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${filtered.map(item => {
        const studentName = `${item.student?.lastName || ''}, ${item.student?.name || ''}`.replace(/^, |, $/g, '');
        const grade = Number.isFinite(item.teacherScore) ? formatScore(item.teacherScore) : 'Pendiente';
        const state = Number.isFinite(item.teacherScore) ? (item.teacherScore >= 7 ? 'Aprobado' : 'No aprobado') : 'Sin corregir';
        return `<tr><td>${escapeHTML(studentName || 'Sin datos')}</td><td>${escapeHTML(item.student?.course || '—')}</td><td>${escapeHTML(new Date(item.date).toLocaleDateString('es-AR'))}</td><td>${grade}</td><td>${state}</td><td><button type="button" class="small-action" data-report-id="${escapeHTML(item.id || '')}">Informe</button> <button type="button" class="small-action" data-review-id="${escapeHTML(item.id || '')}">Corregir / revisar</button></td></tr>`;
      }).join('')}</tbody></table></div>` : '<p class="empty-dashboard">No hay entregas que coincidan con los filtros seleccionados.</p>';
    $('dashboardTableWrap').querySelectorAll('[data-report-id]').forEach(button => button.addEventListener('click', () => {
        const item = getHistory().find(record => record.id === button.dataset.reportId);
        if (item) showIndividualReport(item);
      }));
      $('dashboardTableWrap').querySelectorAll('[data-review-id]').forEach(button => button.addEventListener('click', () => {
        const item = getHistory().find(record => record.id === button.dataset.reviewId);
        if (item) { renderTeacherReview(item); $('teacherReview')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      }));
    };
    renderTable();
    $('courseFilter').oninput = renderTable;
    $('studentFilter').oninput = renderTable;
    $('statusFilter').onchange = renderTable;
    $('sortFilter').onchange = renderTable;

    const stats = calculateQuestionStats(history);
    $('questionAnalytics').innerHTML = `<h3>Preguntas con más errores</h3><p class="muted">Porcentaje calculado sobre las entregas que respondieron cada pregunta.</p><div class="analytics-list">${stats.slice(0, 8).map(item => `<div class="analytics-row"><strong>${item.label}</strong><div class="analytics-track"><span style="width:${item.rate}%"></span></div><span>${item.total ? Math.round(item.rate) + '%' : 'Sin datos'} (${item.errors}/${item.total})</span></div>`).join('')}</div>`;

    $('exportExcelBtn').onclick = () => exportHistoryCSV(getHistory());
    $('printReportBtn').onclick = () => printDashboard(getHistory());
  }

  function showIndividualReport(attempt) {
    const student = attempt.student || {};
    const score = Number.isFinite(attempt.teacherScore) ? Number(attempt.teacherScore) : null;
    const ab = calculateABPoints(attempt.answers || {});
    const code = Object.values(attempt.teacherCodeScores || {}).reduce((sum, value) => sum + Number(value || 0), 0);
    const correct = allItems().filter(item => attempt.answers?.[item.id] === item.c).length;
    const theoryScore = Number((allItems().slice(0, theory.length).filter(item => attempt.answers?.[item.id] === item.c).length * (2 / theory.length)).toFixed(2));
    const interpretationScore = Number((allItems().slice(theory.length).filter(item => attempt.answers?.[item.id] === item.c).length * (4 / interpretation.length)).toFixed(2));
    const codeBreakdown = [1, 2, 3].map(index => `Ej. ${index}: ${formatScore(attempt.teacherCodeScores?.[`answer${index}`] || 0)}/${index === 3 ? "1,34" : "1,33"}`).join(' · ');
    const html = `<div class="individual-report"><h3>Informe individual</h3><p><strong>Estudiante:</strong> ${escapeHTML(student.name || '')} ${escapeHTML(student.lastName || '')}</p><p><strong>Curso:</strong> ${escapeHTML(student.course || '—')}</p><p><strong>Fecha:</strong> ${escapeHTML(new Date(attempt.date).toLocaleString('es-AR'))}</p><div class="report-score">${score === null ? 'Pendiente de calificación' : `${formatScore(score)} / 10 · ${score >= 7 ? 'Aprobado' : 'No aprobado'} · ${performanceLabel(score)}`}</div><p>Parte A – Teoría: ${formatScore(theoryScore)}/2. Parte B – Interpretación: ${formatScore(interpretationScore)}/4. Parte C – Código: ${formatScore(code)}/4.</p><p><strong>Detalle de código:</strong> ${codeBreakdown}</p><p><strong>Respuestas correctas:</strong> ${correct}/30.</p><p><strong>Diagnóstico:</strong> ${correct < 15 ? 'Necesita reforzar conceptos básicos y lectura de código.' : correct < 24 ? 'Buen avance; conviene practicar los temas donde hubo errores.' : 'Buen dominio de teoría e interpretación; reforzar la resolución práctica si corresponde.'}</p><div class="report-actions"><button class="secondary" type="button" id="printIndividualReport">Imprimir / Guardar PDF</button><button class="secondary" type="button" id="closeIndividualReport">Cerrar informe</button></div></div>`;
    const existing = $('individualReport');
    if (existing) existing.remove();
    const wrapper = document.createElement('div');
    wrapper.id = 'individualReport';
    wrapper.className = 'individual-report-overlay';
    wrapper.innerHTML = html;
    document.body.append(wrapper);
    $('closeIndividualReport').onclick = () => wrapper.remove();
    $('printIndividualReport').onclick = () => {
      const printWindow = window.open('', '_blank');
      if (!printWindow) { alert('Permití las ventanas emergentes para generar el informe PDF.'); return; }
      const reportContent = wrapper.querySelector('.individual-report').innerHTML;
      printWindow.onload = () => printWindow.print();
      printWindow.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Informe individual IPEM 146</title><style>body{font:14px Arial;padding:28px;color:#172033;line-height:1.5}h3{font-size:22px}.report-score{padding:12px;background:#f0f7ff;border-radius:8px;font-weight:bold}.report-actions{display:none}</style></head><body>${reportContent}</body></html>`);
      printWindow.document.close();
    };
  }

  function csvCell(value) { return `"${String(value ?? '').replace(/"/g, '""')}"`; }
  function exportHistoryCSV(history) {
    const header = ['Apellido', 'Nombre', 'Curso', 'Fecha', 'Teoria / 2', 'Interpretacion / 4', 'Codigo / 4', 'Nota / 10', 'Estado'];
    const rows = history.map(item => {
      const ab = calculateABPoints(item.answers || {});
      const code = Object.values(item.teacherCodeScores || {}).reduce((sum, value) => sum + Number(value || 0), 0);
      const grade = Number.isFinite(item.teacherScore) ? item.teacherScore : '';
      return [item.student?.lastName, item.student?.name, item.student?.course, new Date(item.date).toLocaleString('es-AR'), calculateABPoints(Object.fromEntries(allItems().slice(0, theory.length).map(q => [q.id, item.answers?.[q.id]]))), ab - calculateABPoints(Object.fromEntries(allItems().slice(0, theory.length).map(q => [q.id, item.answers?.[q.id]]))), code, grade, grade === '' ? 'Pendiente' : grade >= 7 ? 'Aprobado' : 'No aprobado'].map(csvCell).join(';');
    });
    const blob = new Blob(['\ufeff' + [header.map(csvCell).join(';'), ...rows].join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = 'informe_ipem146_resultados.csv'; link.click(); URL.revokeObjectURL(url);
  }

  function printDashboard(history) {
    const rows = history.map(item => {
      const ab = calculateABPoints(item.answers || {});
      const code = Object.values(item.teacherCodeScores || {}).reduce((sum, value) => sum + Number(value || 0), 0);
      const score = Number.isFinite(item.teacherScore) ? formatScore(item.teacherScore) : 'Pendiente';
      return `<tr><td>${escapeHTML(item.student?.lastName || '')}, ${escapeHTML(item.student?.name || '')}</td><td>${escapeHTML(item.student?.course || '')}</td><td>${new Date(item.date).toLocaleDateString('es-AR')}</td><td>${formatScore(ab)}</td><td>${formatScore(code)}</td><td>${score}</td><td>${Number.isFinite(item.teacherScore) ? (item.teacherScore >= 7 ? 'Aprobado' : 'No aprobado') : 'Pendiente'}</td></tr>`;
    }).join('');
    const win = window.open('', '_blank');
    if (!win) { alert('El navegador bloqueó la ventana. Permití las ventanas emergentes para imprimir o guardar el PDF.'); return; }
    win.onload = () => win.print();
    win.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Informe IPEM 146</title><style>body{font:14px Arial;padding:24px;color:#172033}h1{font-size:22px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #bbb;padding:8px;text-align:left}th{background:#edf2f7}@media print{button{display:none}}</style></head><body><h1>IPEM 146 · Informe de resultados</h1><p>Fecha de emisión: ${new Date().toLocaleString('es-AR')}</p><table><thead><tr><th>Estudiante</th><th>Curso</th><th>Fecha</th><th>A+B / 6</th><th>C / 4</th><th>Nota / 10</th><th>Estado</th></tr></thead><tbody>${rows}</tbody></table><p>Escala: 0–3,99 desempeño bajo · 4–5,99 en proceso · 6–6,99 próximo a aprobar · 7–8,99 aprobado · 9–10 destacado.</p></body></html>`);
    win.document.close();
  }

  function requestTeacherPassword(title) {
    const dialog = $("teacherPasswordDialog");
    const input = $("teacherPasswordInput");
    const heading = $("teacherPasswordTitle");
    const form = $("teacherPasswordForm");
    if (!dialog || !input || !form) return Promise.resolve(null);
    heading.textContent = title;
    input.value = "";
    dialog.showModal();
    input.focus();
    return new Promise(resolve => {
      const cleanup = () => {
        form.removeEventListener("submit", onSubmit);
        dialog.removeEventListener("cancel", onCancel);
        dialog.removeEventListener("close", onClose);
        input.value = "";
      };
      const onSubmit = event => {
        event.preventDefault();
        const value = input.value;
        cleanup();
        dialog.close();
        resolve(value);
      };
      const onCancel = () => { cleanup(); resolve(null); };
      const onClose = () => { cleanup(); resolve(null); };
      form.addEventListener("submit", onSubmit);
      dialog.addEventListener("cancel", onCancel, { once: true });
      dialog.addEventListener("close", onClose, { once: true });
    });
  }

  async function openTeacherDashboard() {
    const password = await requestTeacherPassword("Contraseña docente para abrir el panel de resultados");
    if (password === null) return;
    if (password !== TEACHER_PASSWORD) {
      window.alert("Contraseña incorrecta. No se abrió el panel docente.");
      return;
    }
    renderTeacherDashboard();
    $("teacherDashboard")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function openTeacherReview() {
    const attempt = (() => { try { return JSON.parse(localStorage.getItem(EXAM_KEY) || "null"); } catch { return null; } })();
    if (!attempt) {
      window.alert("Todavía no hay un examen entregado para revisar.");
      return;
    }
    const password = await requestTeacherPassword("Contraseña docente para abrir la clave y evaluar");
    if (password === null) return;
    // Funciona también en GitHub Pages: no depende de una API Node.js.
    // Es una barrera básica de interfaz, no autenticación segura.
    if (password !== TEACHER_PASSWORD) {
      window.alert("Contraseña incorrecta. No se abrió la evaluación docente.");
      return;
    }
    renderTeacherReview(attempt);
    renderTeacherDashboard();
    if ($("teacherReview")) $("teacherReview").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function grade() {
    if (examLocked || isGrading) return;
    const student = {
      name: $("studentName")?.value.trim() || "",
      lastName: $("studentLastName")?.value.trim() || "",
      course: $("studentCourse")?.value.trim() || ""
    };
    if (!student.name || !student.lastName || !student.course) {
      window.alert("Completá nombre, apellido y curso antes de finalizar.");
      $("studentName")?.focus();
      return;
    }
    const unanswered = totalQuestions - Object.keys(answers).length;
    const emptyExercises = Array.from(document.querySelectorAll(".code-answer")).filter(field => !field.value.trim()).length;
    const confirmText = unanswered > 0 || emptyExercises > 0
      ? `Tenés ${unanswered} pregunta(s) y ${emptyExercises} ejercicio(s) de código sin completar. ¿Querés entregar igualmente? El docente revisará el examen.`
      : "¿Confirmás la entrega? El intento quedará registrado en este navegador y no podrás modificarlo.";
    if (!window.confirm(confirmText)) return;

    isGrading = true;
    const button = $("gradeBtn");
    if (button) { button.disabled = true; button.textContent = "CORRIGIENDO…"; }
    let attempt;
    let storageSaved = false;
    try {
      const codeAnswersNow = Object.fromEntries(Array.from(document.querySelectorAll(".code-answer"), field => [field.id, field.value]));
      const automaticCodeScores = assessCodeAnswers(codeAnswersNow);
      const automaticCodeTotal = Number(automaticCodeScores.reduce((sum, result) => sum + result.score, 0).toFixed(2));
      const automaticABTotal = calculateABPoints(answers);
      const automaticGrade = Number((automaticABTotal + automaticCodeTotal).toFixed(2));
      attempt = {
        student, answers: { ...answers }, codeAnswers: codeAnswersNow,
        autoCodeScores: automaticCodeScores.map(r => r.score),
        autoCodeFeedback: automaticCodeScores.map(r => r.feedback),
        autoCodeTotal: automaticCodeTotal, autoGrade: automaticGrade,
        date: new Date().toISOString(), version: 10, teacherCodeScores: {}, layout: examLayout,
        id: `${Date.now()}_${student.lastName.toLowerCase().replace(/[^a-z0-9]+/g, "-" )}`
      };

      // Guardar el intento principal primero; el historial es secundario y no debe bloquear la corrección.
      try {
        localStorage.setItem(EXAM_KEY, JSON.stringify(attempt));
        storageSaved = true;
      } catch (storageError) {
        console.warn("No se pudo persistir el intento principal:", storageError);
      }
      try { saveHistory(attempt); } catch (historyError) { console.warn("Error en historial:", historyError); }
      try { localStorage.removeItem(DRAFT_KEY); } catch {}

      // La pantalla de corrección se presenta aunque el almacenamiento falle.
      showCorrection(attempt.answers, null, attempt.date, attempt);
      if ($("storageStatus")) {
        $("storageStatus").textContent = storageSaved
          ? "Entrega registrada en este navegador. La corrección automática está completa."
          : "La corrección se realizó, pero el navegador no pudo guardar la entrega. Avisá al docente antes de cerrar.";
      }
    } catch (error) {
      console.error("Error durante la corrección/entrega:", error);
      if (attempt) {
        try { showCorrection(attempt.answers, null, attempt.date, attempt); examLocked = true; }
        catch (renderError) { console.error("No se pudo mostrar la corrección:", renderError); }
      }
      if ($("gradeMessage")) $("gradeMessage").textContent = "Se produjo un error al finalizar. No cierres la página y avisá al docente.";
      if (button && !examLocked) { button.disabled = false; button.textContent = "Reintentar finalizar"; }
    } finally {
      isGrading = false;
    }
  }

  async function deleteSavedAttempt() {
    // Contraseña solicitada para evitar reinicios accidentales desde la interfaz.
    // En GitHub Pages esta validación es del lado del navegador, no una protección segura.
    const password = await requestTeacherPassword("Ingresá la contraseña docente para eliminar los datos");
    if (password === null) return;
    if (password !== TEACHER_PASSWORD) {
      window.alert("Contraseña incorrecta. No se eliminaron los datos del examen.");
      const status = $("deleteStatus");
      if (status) status.textContent = "Contraseña incorrecta. El examen sigue guardado.";
      return;
    }

    const confirmed = window.confirm(
      "¿Querés borrar el examen entregado y el borrador guardado en ESTE navegador?\n\n" +
      "Al confirmar, se limpiarán los datos y podrás ingresar nuevamente nombre, apellido, curso y respuestas."
    );
    if (!confirmed) return;

    const status = $("deleteStatus");
    const button = $("deleteSavedBtn");
    try {
      // Este examen guarda los intentos en el navegador. No se consulta una API
      // porque GitHub Pages no ejecuta server.js y esa llamada impedía reiniciar.
      const keysToRemove = Object.keys(localStorage).filter(key =>
        key === EXAM_KEY || key === DRAFT_KEY || key.startsWith("ipem146_js_examen_intento_unico")
      );
      keysToRemove.forEach(key => localStorage.removeItem(key));
      localStorage.removeItem(LAYOUT_KEY);
      examLayout = makeExamLayout();
      localStorage.setItem(LAYOUT_KEY, JSON.stringify(examLayout));

      answers = {};
      codeAnswers = {};
      renderQuestions(theory, "theoryQuestions", "t");
      renderQuestions(interpretation, "interpretQuestions", "i");
      examLocked = false;
      isGrading = false;

      document.querySelectorAll('input[type="radio"]').forEach(input => {
        input.checked = false;
        input.disabled = false;
      });
      ["studentName", "studentLastName", "studentCourse"].forEach(id => {
        const field = $(id);
        if (field) {
          field.value = "";
          field.disabled = false;
        }
      });
      document.querySelectorAll(".code-answer").forEach(field => {
        field.value = "";
        field.disabled = false;
      });
      document.querySelectorAll(".feedback").forEach(feedback => { feedback.textContent = ""; });

      if ($("score")) $("score").innerHTML = `—<small> / 10</small>`;
      if ($("scoreText")) $("scoreText").textContent =
        "Respondé las 30 preguntas y completá los 3 ejercicios. La nota es sobre 10 puntos: teoría 2, interpretación 4 y código 4. Se aprueba con 7/10 (70%).";
      if ($("gradeMessage")) {
        $("gradeMessage").textContent = "Nuevo intento habilitado. Ingresá nuevamente tus datos y comenzá la evaluación.";
        $("gradeMessage").className = "grade-message";
      }
      if ($("teacherReview")) $("teacherReview").innerHTML = "";
      if ($("teacherReviewBtn")) $("teacherReviewBtn").hidden = true;
      if ($("gradeBtn")) {
        $("gradeBtn").disabled = false;
        $("gradeBtn").textContent = "Finalizar y corregir";
      }
      if (button) {
        button.disabled = false;
        button.textContent = "Eliminar intento activo y habilitar nuevo";
      }
      updateProgress();
      if (status) status.textContent =
        "Datos eliminados. Ya podés ingresar nuevamente nombre, apellido y curso y realizar otro examen.";
      $("studentName")?.focus();
    } catch (error) {
      console.error("No se pudieron eliminar los datos del examen:", error);
      if (status) status.textContent =
        "El navegador no permitió borrar los datos. Revisá que no esté bloqueado el almacenamiento del sitio.";
      if (button) button.disabled = false;
    }
  }

  function saveDraft() {
    if (examLocked) return;
    const student = {
      name: $("studentName")?.value.trim() || "",
      lastName: $("studentLastName")?.value.trim() || "",
      course: $("studentCourse")?.value.trim() || ""
    };
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({
        student,
        answers: { ...answers },
        codeAnswers: Object.fromEntries(Array.from(document.querySelectorAll(".code-answer"), field => [field.id, field.value])),
        layout: examLayout,
        updatedAt: new Date().toISOString()
      }));
      if ($("storageStatus")) $("storageStatus").textContent = "Avance guardado automáticamente en localStorage de este dispositivo.";
    } catch (error) {
      console.warn("No se pudo guardar el avance local:", error);
      if ($("storageStatus")) $("storageStatus").textContent = "No se pudo guardar el avance. Verificá el almacenamiento del navegador.";
    }
  }

  function restoreDraft() {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return false;
      const draft = JSON.parse(raw);
      if (!draft || typeof draft !== "object") return false;
      const student = draft.student || {};
      if ($("studentName")) $("studentName").value = student.name || "";
      if ($("studentLastName")) $("studentLastName").value = student.lastName || "";
      if ($("studentCourse")) $("studentCourse").value = student.course || "";
      answers = draft.answers && typeof draft.answers === "object" ? draft.answers : {};
      Object.entries(answers).forEach(([id, selected]) => {
        const option = document.querySelector(`input[name="${id}"][value="${selected}"]`);
        if (option) option.checked = true;
      });
      codeAnswers = draft.codeAnswers && typeof draft.codeAnswers === "object" ? draft.codeAnswers : {};
      document.querySelectorAll(".code-answer").forEach(field => {
        field.value = typeof codeAnswers[field.id] === "string" ? codeAnswers[field.id] : "";
      });
      updateProgress();
      if ($("gradeMessage")) $("gradeMessage").textContent = "Se recuperó tu avance guardado en este dispositivo. Podés continuar.";
      return true;
    } catch (error) {
      console.warn("No se pudo recuperar el borrador:", error);
      return false;
    }
  }

  function restoreAttempt() {
    let raw;
    try {
      raw = localStorage.getItem(EXAM_KEY);
    } catch (error) {
      console.error("No se pudo acceder al almacenamiento:", error);
      if ($("gradeMessage")) $("gradeMessage").textContent = "El navegador no permite acceder al almacenamiento. No se puede garantizar el registro del intento.";
      if ($("gradeBtn")) $("gradeBtn").disabled = true;
      return true;
    }
    if (!raw) return false;

    try {
      const attempt = JSON.parse(raw);
      if (!attempt || !attempt.answers || typeof attempt.answers !== "object") {
        throw new Error("Registro de intento inválido");
      }
      // Los intentos de versiones anteriores a la escala sobre 10 se conservan,
      // pero su calificación se recalcula con la escala actual.
      if (Number(attempt.version || 0) < 7) {
        delete attempt.teacherScore;
        delete attempt.teacherGradeOutOfTen;
        delete attempt.teacherGradedAt;
        attempt.teacherCodeScores = {};
        attempt.version = 8;
        try { localStorage.setItem(EXAM_KEY, JSON.stringify(attempt)); } catch (error) {
          console.warn("No se pudo actualizar la versión de la evaluación:", error);
        }
      }
      answers = attempt.answers;
      if (!attempt.id) attempt.id = `${attempt.date || Date.now()}_${(attempt.student?.lastName || "estudiante").toLowerCase()}`;
      if (!attempt.layout) attempt.layout = examLayout;
      saveHistory(attempt);
      try { localStorage.setItem(EXAM_KEY, JSON.stringify(attempt)); } catch {}
      if (attempt.student) {
        if ($("studentName")) $("studentName").value = attempt.student.name || "";
        if ($("studentLastName")) $("studentLastName").value = attempt.student.lastName || "";
        if ($("studentCourse")) $("studentCourse").value = attempt.student.course || "";
      }
      restoreCodeAnswers(attempt.codeAnswers || {});
      showCorrection(attempt.answers, attempt.score, attempt.date, attempt);
      if ($("storageStatus")) $("storageStatus").textContent = "Intento recuperado desde localStorage de este dispositivo.";
      const message = $("gradeMessage");
      if (message) {
        message.textContent += " Este examen ya fue realizado en este navegador y dispositivo.";
      }
      return true;
    } catch (error) {
      console.error("No se pudo recuperar el intento guardado:", error);
      // Ante un registro existente pero ilegible, se bloquea por seguridad.
      examLocked = true;
      if ($("gradeBtn")) {
        $("gradeBtn").disabled = true;
        $("gradeBtn").textContent = "EXAMEN BLOQUEADO";
      }
      if ($("gradeMessage")) {
        $("gradeMessage").textContent = "Existe un intento registrado, pero no se pudo leer. Comunicarse con el docente.";
      }
      document.querySelectorAll('input[type="radio"]').forEach(input => input.disabled = true);
      return true;
    }
  }

  function initTabs() {
    document.querySelectorAll(".tab").forEach(button => {
      button.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach(tab => tab.classList.toggle("active", tab === button));
        document.querySelectorAll(".section").forEach(section => {
          section.classList.toggle("active", section.id === button.dataset.target);
        });
      });
    });
  }

  function initSolutions() {
    document.querySelectorAll(".solution-btn").forEach(button => {
      button.addEventListener("click", () => {
        const solution = $(button.dataset.solution);
        if (!solution || !examLocked) return;
        solution.classList.toggle("hidden");
        button.textContent = solution.classList.contains("hidden")
          ? "Ver solución del modelo"
          : "Ocultar solución";
      });
    });
    // En un examen no se muestran soluciones modelo.
    document.querySelectorAll(".solution").forEach(solution => solution.classList.add("hidden"));
    document.querySelectorAll(".solution-btn").forEach(button => button.hidden = true);
  }

  function init() {
    loadExamLayout();
    renderQuestions(theory, "theoryQuestions", "t");
    renderQuestions(interpretation, "interpretQuestions", "i");
    initTabs();
    initSolutions();
    initCodeEditors();
    updateProgress();

    if ($("gradeBtn")) $("gradeBtn").addEventListener("click", grade);
    if ($("teacherReviewBtn")) $("teacherReviewBtn").addEventListener("click", openTeacherReview);
    ["studentName", "studentLastName", "studentCourse"].forEach(id => {
      if ($(id)) $(id).addEventListener("input", saveDraft);
    });
    if ($("deleteSavedBtn")) $("deleteSavedBtn").addEventListener("click", deleteSavedAttempt);
    if ($("teacherDashboardBtn")) $("teacherDashboardBtn").addEventListener("click", openTeacherDashboard);

    // No existe reinicio para el estudiante. El docente debe publicar una nueva versión.
    if ($("resetBtn")) {
      $("resetBtn").disabled = true;
      $("resetBtn").hidden = true;
      $("resetBtn").title = "El examen es de intento único.";
    }

    if (!restoreAttempt()) {
      restoreDraft();
      examLocked = false;
      if ($("score")) $("score").innerHTML = `—<small> / 10</small>`;
      if ($("scoreText")) $("scoreText").textContent = `Respondé las 30 preguntas y completá los 3 ejercicios. La nota es sobre 10 puntos: teoría 2, interpretación 4 y código 4. Se aprueba con 7/10 (70%).`;
      if ($("gradeMessage")) $("gradeMessage").textContent = "Completá tus datos personales. Al entregar, el docente podrá consultar la clave y evaluar tus respuestas.";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
