(() => {
    const API_LIST = "https://www.fulek.com/data/api/supit/curriculum-list/hr";
    const API_DETAILS = (id) => `https://www.fulek.com/data/api/supit/get-curriculum/${id}`;

    const searchInput   = document.getElementById("courseSearch");
    const suggestionsEl = document.getElementById("suggestions");
    const selectedBody  = document.getElementById("selectedBody");
    const apiErrorEl    = document.getElementById("apiError");

    const totalEctsEl = document.getElementById("totalEcts");
    const totalSatiEl = document.getElementById("totalSati");
    const totalPredEl = document.getElementById("totalPredavanja");
    const totalVjezEl = document.getElementById("totalVjezbe");

    const selected = new Map();  

    let allCourses = [];        

    function showError(msg) {
      apiErrorEl.style.display = "block";
      apiErrorEl.textContent = msg;
    }
    function clearError() {
      apiErrorEl.style.display = "none";
      apiErrorEl.textContent = "";
    }

    function getToken() {
      return sessionStorage.getItem("token");
    }

    function normalize(s) {
      return (s ?? "")
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
    }

    async function apiGet(url) {
      const token = getToken();
      if (!token) {
        showError("Niste prijavljeni (nema tokena). Prijavite se pa ponovo otvorite nastavni plan.");
        throw new Error("Missing token");
      }

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        console.error("API ERROR:", res.status, body);

        if (res.status === 401) {
          showError("Token je istekao ili nije validan. Prijavite se ponovo.");
        } else {
          showError(`Greška API (${res.status}). Pogledajte Console.`);
        }
        throw new Error(`HTTP ${res.status}`);
      }

      return res.json();
    }

    async function loadCourses() {
      clearError();

      const json = await apiGet(API_LIST);

      const list = Array.isArray(json.data) ? json.data : [];

      allCourses = list
        .map(x => ({ id: Number(x.id), kolegij: (x.kolegij ?? "").trim() }))
        .filter(x => x.id && x.kolegij);

      console.log("Loaded courses:", allCourses.length);
    }

    function renderSuggestions(query) {
      const q = normalize(query.trim());
      suggestionsEl.innerHTML = "";

      if (!q) {
        suggestionsEl.classList.remove("show");
        return;
      }

      const matches = allCourses
        .filter(c => !selected.has(c.id))                 
        .filter(c => normalize(c.kolegij).startsWith(q))  
        .slice(0, 12);

      if (matches.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Nema rezultata";
        li.style.cursor = "default";
        suggestionsEl.appendChild(li);
        suggestionsEl.classList.add("show");
        return;
      }

      for (const c of matches) {
        const li = document.createElement("li");
        li.textContent = c.kolegij;
        li.dataset.id = String(c.id);
        suggestionsEl.appendChild(li);
      }

      suggestionsEl.classList.add("show");
    }

    async function addCourseById(id) {
      if (selected.has(id)) return;

      const json = await apiGet(API_DETAILS(id));
      const d = json.data ?? json; 

      const course = {
        id: Number(d.id ?? id),
        kolegij: (d.kolegij ?? "").trim(),
        ects: Number(d.ects ?? 0),
        sati: Number(d.sati ?? 0),
        predavanja: Number(d.predavanja ?? 0),
        vjezbe: Number(d.vjezbe ?? 0),
        tip: (d.tip ?? "").toString()
      };

      selected.set(course.id, course);
      renderTable();
      updateTotals();

      searchInput.value = "";
      renderSuggestions("");
    }

    function removeCourse(id) {
      selected.delete(id);
      renderTable();
      updateTotals();
      renderSuggestions(searchInput.value);
    }

    function renderTable() {
      selectedBody.innerHTML = "";
      for (const c of selected.values()) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${c.kolegij}</td>
          <td>${c.ects}</td>
          <td>${c.sati}</td>
          <td>${c.predavanja}</td>
          <td>${c.vjezbe}</td>
          <td>${c.tip}</td>
          <td><button class="btn-delete" data-id="${c.id}">Delete</button></td>
        `;
        selectedBody.appendChild(tr);
      }
    }

    function updateTotals() {
      let ects = 0, sati = 0, pred = 0, vjez = 0;

      for (const c of selected.values()) {
        ects += c.ects || 0;
        sati += c.sati || 0;
        pred += c.predavanja || 0;
        vjez += c.vjezbe || 0;
      }

      totalEctsEl.textContent = ects;
      totalSatiEl.textContent = sati;
      totalPredEl.textContent = pred;
      totalVjezEl.textContent = vjez;
    }

    searchInput.addEventListener("input", () => renderSuggestions(searchInput.value));

    suggestionsEl.addEventListener("click", async (e) => {
      const li = e.target.closest("li");
      if (!li || !li.dataset.id) return;
      try {
        await addCourseById(Number(li.dataset.id));
      } catch (err) {
        console.error(err);
      }
    });

    selectedBody.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-delete");
      if (!btn) return;
      removeCourse(Number(btn.dataset.id));
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".autocomplete")) suggestionsEl.classList.remove("show");
    });

    (async function init() {
      try {
        await loadCourses();
      } catch (err) {
        console.error("INIT ERROR:", err);
      }
    })();
  })();
