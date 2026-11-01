/**
 * ==========================================================================
 * NOVA EMS — ENTERPRISE EMPLOYEE MANAGEMENT SYSTEM
 * Core Data Structure: Singly Linked List with Memory Address Simulation
 * ==========================================================================
 */

class EmployeeNode {
  constructor(id, name, department, designation, salary) {
    this.id = parseInt(id, 10);
    this.name = name.trim();
    this.department = department || "Engineering";
    this.designation = designation.trim();
    this.salary = parseFloat(salary);
    this.next = null; // Singly linked list pointer
    // Simulated heap memory address based on node ID
    this.address = `0x7FFE${(0x1000 + (this.id * 16)).toString(16).toUpperCase()}`;
  }
}

class OrganizationLinkedList {
  constructor() {
    this.head = null;
    this.count = 0;
  }

  // Check if ID exists (Linear search O(N))
  exists(id) {
    let curr = this.head;
    while (curr !== null) {
      if (curr.id === id) return true;
      curr = curr.next;
    }
    return false;
  }

  // Insert at Tail - O(N)
  insertTail(id, name, dept, des, salary) {
    id = parseInt(id, 10);
    if (this.exists(id)) {
      return { success: false, message: `Node with Employee ID ${id} already exists!` };
    }

    const newNode = new EmployeeNode(id, name, dept, des, salary);

    if (this.head === null) {
      this.head = newNode;
    } else {
      let curr = this.head;
      while (curr.next !== null) {
        curr = curr.next;
      }
      curr.next = newNode;
    }
    this.count++;
    return { success: true, message: `Node #${id} (${name}) allocated and linked at Tail.` };
  }

  // Insert at Head - O(1)
  insertHead(id, name, dept, des, salary) {
    id = parseInt(id, 10);
    if (this.exists(id)) {
      return { success: false, message: `Node with Employee ID ${id} already exists!` };
    }

    const newNode = new EmployeeNode(id, name, dept, des, salary);
    newNode.next = this.head;
    this.head = newNode;
    this.count++;
    return { success: true, message: `Node #${id} (${name}) prepended at HEAD (O(1)).` };
  }

  // Delete Head Node - O(1)
  deleteHead() {
    if (this.head === null) {
      return { success: false, message: "List is empty! Nothing to delete." };
    }
    const targetId = this.head.id;
    const targetName = this.head.name;
    this.head = this.head.next;
    this.count--;
    return { success: true, message: `Head Node #${targetId} (${targetName}) unlinked and deallocated.` };
  }

  // Delete by ID - Safe O(N)
  deleteById(id) {
    id = parseInt(id, 10);
    if (this.head === null) {
      return { success: false, message: "Organization list is empty!" };
    }

    // Base Case: Target is the Head
    if (this.head.id === id) {
      return this.deleteHead();
    }

    let curr = this.head;
    let prev = null;

    while (curr !== null && curr.id !== id) {
      prev = curr;
      curr = curr.next;
    }

    if (curr === null) {
      return { success: false, message: `Node with ID ${id} not found in the roster.` };
    }

    // Unlink node
    prev.next = curr.next;
    this.count--;
    return { success: true, message: `Node #${id} (${curr.name}) unlinked from chain.` };
  }

  // Search by ID - O(N)
  find(id) {
    id = parseInt(id, 10);
    let curr = this.head;
    let pos = 1;
    while (curr !== null) {
      if (curr.id === id) {
        return { node: curr, position: pos };
      }
      curr = curr.next;
      pos++;
    }
    return null;
  }

  // Bubble Sort by ID - O(N^2)
  sortById(ascending = true) {
    if (!this.head || !this.head.next) return;

    for (let p = this.head; p !== null; p = p.next) {
      for (let q = p.next; q !== null; q = q.next) {
        const condition = ascending ? (p.id > q.id) : (p.id < q.id);
        if (condition) {
          this.swapPayload(p, q);
        }
      }
    }
  }

  // Bubble Sort by Salary - O(N^2)
  sortBySalary(ascending = false) {
    if (!this.head || !this.head.next) return;

    for (let p = this.head; p !== null; p = p.next) {
      for (let q = p.next; q !== null; q = q.next) {
        const condition = ascending ? (p.salary > q.salary) : (p.salary < q.salary);
        if (condition) {
          this.swapPayload(p, q);
        }
      }
    }
  }

  // Bubble Sort by Name - O(N^2)
  sortByName(ascending = true) {
    if (!this.head || !this.head.next) return;

    for (let p = this.head; p !== null; p = p.next) {
      for (let q = p.next; q !== null; q = q.next) {
        const cmp = p.name.localeCompare(q.name);
        const condition = ascending ? (cmp > 0) : (cmp < 0);
        if (condition) {
          this.swapPayload(p, q);
        }
      }
    }
  }

  // Safe swap of data payload without modifying pointers
  swapPayload(a, b) {
    const temp = {
      id: a.id,
      name: a.name,
      department: a.department,
      designation: a.designation,
      salary: a.salary,
      address: a.address
    };

    a.id = b.id;
    a.name = b.name;
    a.department = b.department;
    a.designation = b.designation;
    a.salary = b.salary;
    a.address = b.address;

    b.id = temp.id;
    b.name = temp.name;
    b.department = temp.department;
    b.designation = temp.designation;
    b.salary = temp.salary;
    b.address = temp.address;
  }

  // Convert to array for UI rendering
  toArray() {
    const arr = [];
    let curr = this.head;
    let pos = 1;
    while (curr !== null) {
      arr.push({
        position: pos,
        id: curr.id,
        name: curr.name,
        department: curr.department,
        designation: curr.designation,
        salary: curr.salary,
        address: curr.address,
        hasNext: curr.next !== null,
        nextAddress: curr.next ? curr.next.address : "0x0 (NULL)",
        nextId: curr.next ? curr.next.id : null
      });
      curr = curr.next;
      pos++;
    }
    return arr;
  }

  // Analytics Metrics
  getMetrics() {
    let totalPayroll = 0;
    let maxSal = 0;
    let maxEmp = "None";
    const deptCounts = {
      "Engineering": 0,
      "Data & AI": 0,
      "Product & Design": 0,
      "Operations & HR": 0
    };
    const salaryTiers = {
      "Entry (<$80k)": 0,
      "Mid ($80k-$120k)": 0,
      "Senior ($120k-$150k)": 0,
      "Lead/Exec (>$150k)": 0
    };

    let curr = this.head;
    while (curr !== null) {
      totalPayroll += curr.salary;
      if (curr.salary > maxSal) {
        maxSal = curr.salary;
        maxEmp = `${curr.name} (#${curr.id})`;
      }

      // Dept count
      if (deptCounts[curr.department] !== undefined) {
        deptCounts[curr.department]++;
      } else {
        deptCounts["Engineering"]++;
      }

      // Salary Tier
      if (curr.salary < 80000) salaryTiers["Entry (<$80k)"]++;
      else if (curr.salary <= 120000) salaryTiers["Mid ($80k-$120k)"]++;
      else if (curr.salary <= 150000) salaryTiers["Senior ($120k-$150k)"]++;
      else salaryTiers["Lead/Exec (>$150k)"]++;

      curr = curr.next;
    }

    const avgSalary = this.count > 0 ? (totalPayroll / this.count) : 0;

    return {
      count: this.count,
      totalPayroll,
      avgSalary,
      maxSalary: maxSal,
      maxEmpName: maxEmp,
      deptCounts,
      salaryTiers
    };
  }

  // Load Presets
  loadTechStartup() {
    this.head = null;
    this.count = 0;
    this.insertTail(101, "Yashraj Rao", "Engineering", "Founder & Lead Architect", 165000);
    this.insertTail(104, "Priya Sharma", "Data & AI", "Head of AI Systems", 155000);
    this.insertTail(102, "Amit Patel", "Engineering", "Principal Cloud Engineer", 145000);
    this.insertTail(106, "Sneha Verma", "Product & Design", "Lead Product Designer", 118000);
    this.insertTail(103, "Rohan Deshmukh", "Engineering", "Senior DevOps Engineer", 128000);
    this.insertTail(105, "Tanvi Mehta", "Operations & HR", "VP of Operations", 112000);
  }

  loadEnterprise() {
    this.head = null;
    this.count = 0;
    this.insertTail(201, "Dr. Rajesh Iyer", "Engineering", "Chief Technology Officer", 220000);
    this.insertTail(205, "Ananya Roy", "Data & AI", "Director of Applied ML", 185000);
    this.insertTail(202, "Vikram Malhotra", "Engineering", "Enterprise Architect", 170000);
    this.insertTail(209, "Kavita Nair", "Product & Design", "VP of User Experience", 160000);
    this.insertTail(204, "Sameer Joshi", "Engineering", "Senior Platform Engineer", 135000);
    this.insertTail(208, "Divya Pillai", "Operations & HR", "Head of Talent Management", 125000);
    this.insertTail(203, "Nikhil Sen", "Data & AI", "Senior Data Engineer", 130000);
    this.insertTail(207, "Pooja Hegde", "Engineering", "Full-Stack Engineer", 115000);
    this.insertTail(206, "Arjun Kapoor", "Product & Design", "Senior UI/UX Specialist", 108000);
    this.insertTail(210, "Manish Tyagi", "Operations & HR", "HR Business Partner", 92000);
  }
}

/**
 * ==========================================================================
 * WEB PORTAL CONTROLLER (UI, Navigation & State Synchronization)
 * ==========================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
  const org = new OrganizationLinkedList();
  const auditLogs = [];
  let animSpeed = 600;

  // Initialize data from LocalStorage or Load Startup preset
  const savedData = localStorage.getItem("nova_ems_roster");
  if (savedData) {
    try {
      const records = JSON.parse(savedData);
      records.forEach(r => org.insertTail(r.id, r.name, r.department, r.designation, r.salary));
      logAudit("SYSTEM", `Restored ${org.count} records from LocalStorage.`);
    } catch (e) {
      org.loadTechStartup();
      logAudit("INIT", "Loaded default AI Tech Startup dataset.");
    }
  } else {
    org.loadTechStartup();
    logAudit("INIT", "Initialized with 6 employee nodes.");
  }

  // Save to LocalStorage helper
  function persistData() {
    const list = org.toArray();
    localStorage.setItem("nova_ems_roster", JSON.stringify(list));
    const indicator = document.getElementById("storage-record-indicator");
    if (indicator) indicator.innerText = `${list.length} Records Saved`;
  }

  // Audit Logger
  function logAudit(action, message) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    auditLogs.unshift({ time, action, message });
    if (auditLogs.length > 25) auditLogs.pop();
    renderAuditLogs();
  }

  function renderAuditLogs() {
    const container = document.getElementById("dash-audit-log");
    const countBadge = document.getElementById("audit-log-count");
    if (!container) return;

    countBadge.innerText = `${auditLogs.length} Events`;
    container.innerHTML = auditLogs.map(log => `
      <div class="audit-item">
        <span class="audit-time">${log.time}</span>
        <div class="audit-msg"><strong>[${log.action}]</strong> ${escapeHtml(log.message)}</div>
      </div>
    `).join("");
  }

  // Currency formatter helper
  function formatCurrency(val) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(val);
  }

  // Toast helper
  function showToast(msg, type = "info") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${msg}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // ==========================================================================
  // SPA ROUTING & NAVIGATION
  // ==========================================================================
  const navItems = document.querySelectorAll(".nav-item");
  const tabPanes = document.querySelectorAll(".tab-pane");
  const pageTitleElem = document.getElementById("current-page-title");
  const sidebar = document.getElementById("sidebar");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");

  const pageNames = {
    "dashboard": "Executive Dashboard",
    "directory": "Employee Directory",
    "visualizer": "DSA Visualizer Studio",
    "add-employee": "Add Employee Node",
    "analytics": "Analytics & Reports",
    "code-hub": "C++ Code & Viva Hub",
    "data-tools": "Data Tools & Backup"
  };

  function switchTab(tabId) {
    navItems.forEach(n => {
      n.classList.toggle("active", n.getAttribute("data-tab") === tabId);
    });

    tabPanes.forEach(pane => {
      pane.classList.toggle("active", pane.id === `pane-${tabId}`);
    });

    if (pageTitleElem && pageNames[tabId]) {
      pageTitleElem.innerText = pageNames[tabId];
    }

    // Close mobile menu if open
    sidebar.classList.remove("open");

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Refresh active section data
    if (tabId === "visualizer") renderVisualizer();
    if (tabId === "analytics") renderAnalytics();
    if (tabId === "directory") renderDirectory();
    if (tabId === "dashboard") renderDashboard();
  }

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const tabId = item.getAttribute("data-tab");
      switchTab(tabId);
    });
  });

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  // Quick jump buttons
  const btnJumpVis = document.getElementById("btn-jump-visualizer");
  if (btnJumpVis) btnJumpVis.addEventListener("click", () => switchTab("visualizer"));

  const topbarBtnAdd = document.getElementById("topbar-btn-add");
  if (topbarBtnAdd) topbarBtnAdd.addEventListener("click", () => switchTab("add-employee"));

  const dashBtnViewAll = document.getElementById("dash-btn-view-all");
  if (dashBtnViewAll) dashBtnViewAll.addEventListener("click", () => switchTab("directory"));

  // ==========================================================================
  // THEME SWITCHER
  // ==========================================================================
  const themeToggleBtn = document.getElementById("btn-theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    themeIcon.innerText = theme === "dark" ? "🌙" : "☀️";
    localStorage.setItem("nova_ems_theme", theme);
  }

  const savedTheme = localStorage.getItem("nova_ems_theme") || "dark";
  setTheme(savedTheme);

  themeToggleBtn.addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme");
    setTheme(cur === "dark" ? "light" : "dark");
  });

  // ==========================================================================
  // RENDER 1: EXECUTIVE DASHBOARD
  // ==========================================================================
  function renderDashboard() {
    const m = org.getMetrics();
    const nodes = org.toArray();

    // KPIs
    document.getElementById("dash-count").innerText = m.count;
    document.getElementById("dash-payroll").innerText = formatCurrency(m.totalPayroll);
    document.getElementById("dash-avg").innerText = formatCurrency(m.avgSalary);
    document.getElementById("dash-max-sal").innerText = formatCurrency(m.maxSalary);
    document.getElementById("dash-max-emp").innerText = m.maxEmpName;
    document.getElementById("sidebar-count").innerText = m.count;

    // Mini Chain
    const miniChain = document.getElementById("dash-mini-chain");
    if (miniChain) {
      if (nodes.length === 0) {
        miniChain.innerHTML = `<span class="text-subtle font-mono">[HEAD] ➔ NULL</span>`;
      } else {
        let html = `<span class="mini-node-chip font-bold text-green">HEAD</span> <span class="mini-arrow">➔</span> `;
        html += nodes.slice(0, 5).map(n => `
          <span class="mini-node-chip">#${n.id} ${escapeHtml(n.name.split(" ")[0])}</span>
          <span class="mini-arrow">➔</span>
        `).join(" ");
        if (nodes.length > 5) html += `<span class="mini-node-chip">+${nodes.length - 5} more</span> <span class="mini-arrow">➔</span> `;
        html += `<span class="mini-node-chip font-bold text-red">NULL</span>`;
        miniChain.innerHTML = html;
      }
    }

    // Recent Table
    const recentTable = document.getElementById("dash-recent-table");
    if (recentTable) {
      if (nodes.length === 0) {
        recentTable.innerHTML = `<tr><td colspan="4" class="text-center text-muted p-4">No employees in list.</td></tr>`;
      } else {
        recentTable.innerHTML = nodes.slice(0, 4).map(n => `
          <tr>
            <td class="font-mono text-cyan">#${n.id}</td>
            <td><strong>${escapeHtml(n.name)}</strong></td>
            <td>${getDeptBadge(n.department)}</td>
            <td style="text-align: right;" class="font-mono text-green">${formatCurrency(n.salary)}</td>
          </tr>
        `).join("");
      }
    }
  }

  // Dashboard quick sort buttons
  document.getElementById("btn-quick-sort-id").addEventListener("click", () => {
    org.sortById(true);
    logAudit("SORT", "Sorted linked list by Employee ID (Ascending).");
    showToast("Sorted by Employee ID (Ascending)", "info");
    persistData();
    renderAll();
  });

  document.getElementById("btn-quick-sort-sal").addEventListener("click", () => {
    org.sortBySalary(false);
    logAudit("SORT", "Sorted linked list by Annual Salary (Descending).");
    showToast("Sorted by Salary (High-to-Low)", "info");
    persistData();
    renderAll();
  });

  // ==========================================================================
  // RENDER 2: EMPLOYEE DIRECTORY
  // ==========================================================================
  const dirSearchInput = document.getElementById("dir-search-input");
  const dirClearSearch = document.getElementById("dir-clear-search");
  const dirDeptFilter = document.getElementById("dir-dept-filter");
  const dirSortFilter = document.getElementById("dir-sort-filter");
  const dirTableContainer = document.getElementById("dir-table-container");
  const dirGridContainer = document.getElementById("dir-grid-container");
  const btnViewTable = document.getElementById("btn-view-table");
  const btnViewGrid = document.getElementById("btn-view-grid");

  let currentView = "table";

  btnViewTable.addEventListener("click", () => {
    currentView = "table";
    btnViewTable.classList.add("active");
    btnViewGrid.classList.remove("active");
    dirTableContainer.style.display = "block";
    dirGridContainer.style.display = "none";
    renderDirectory();
  });

  btnViewGrid.addEventListener("click", () => {
    currentView = "grid";
    btnViewGrid.classList.add("active");
    btnViewTable.classList.remove("active");
    dirTableContainer.style.display = "none";
    dirGridContainer.style.display = "grid";
    renderDirectory();
  });

  function getDeptBadge(dept) {
    switch (dept) {
      case "Engineering": return `<span class="dept-pill dept-eng">Engineering</span>`;
      case "Data & AI": return `<span class="dept-pill dept-ai">Data & AI</span>`;
      case "Product & Design": return `<span class="dept-pill dept-prod">Product & Design</span>`;
      case "Operations & HR": return `<span class="dept-pill dept-hr">Operations & HR</span>`;
      default: return `<span class="dept-pill dept-eng">${escapeHtml(dept)}</span>`;
    }
  }

  function renderDirectory() {
    const nodes = org.toArray();
    const query = (dirSearchInput.value || "").toLowerCase().trim();
    const selectedDept = dirDeptFilter.value;

    const filtered = nodes.filter(n => {
      const matchQuery = !query ||
        n.id.toString().includes(query) ||
        n.name.toLowerCase().includes(query) ||
        n.designation.toLowerCase().includes(query) ||
        n.department.toLowerCase().includes(query);

      const matchDept = (selectedDept === "ALL") || (n.department === selectedDept);
      return matchQuery && matchDept;
    });

    // Table rendering
    const tbody = document.getElementById("dir-table-body");
    if (tbody) {
      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">No matching employee nodes found.</td></tr>`;
      } else {
        tbody.innerHTML = filtered.map(n => `
          <tr>
            <td style="color: var(--text-subtle); font-family: var(--font-mono);">#${n.position}</td>
            <td style="font-family: var(--font-mono); font-weight: 700; color: var(--accent-cyan);">${n.id}</td>
            <td>
              <div style="font-weight: 700;">${escapeHtml(n.name)}</div>
              <small style="color: var(--text-subtle); font-family: var(--font-mono); font-size: 0.72rem;">${n.address}</small>
            </td>
            <td>${getDeptBadge(n.department)}</td>
            <td style="color: var(--text-muted);">${escapeHtml(n.designation)}</td>
            <td style="text-align: right; font-family: var(--font-mono); font-weight: 700; color: var(--accent-green);">
              ${formatCurrency(n.salary)}
            </td>
            <td style="text-align: center;">
              <div style="display: flex; gap: 6px; justify-content: center;">
                <button class="btn btn-sm btn-ghost" onclick="window.inspectNode(${n.id})" title="Inspect Node Pointers">
                  Inspect
                </button>
                <button class="btn btn-sm btn-danger" onclick="window.deleteNodePrompt(${n.id})" title="Deallocate Node">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        `).join("");
      }
    }

    // Grid Cards rendering
    if (dirGridContainer && currentView === "grid") {
      if (filtered.length === 0) {
        dirGridContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">No records found.</div>`;
      } else {
        const colors = ["#6366f1", "#06b6d4", "#a855f7", "#10b981", "#f59e0b", "#ec4899"];
        dirGridContainer.innerHTML = filtered.map((n, idx) => {
          const color = colors[idx % colors.length];
          const initials = n.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
          return `
            <div class="emp-card">
              <div class="emp-card-header">
                <div class="emp-avatar" style="background: ${color};">${initials}</div>
                <div class="emp-card-meta">
                  <h4>${escapeHtml(n.name)}</h4>
                  <span>${escapeHtml(n.designation)}</span>
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                ${getDeptBadge(n.department)}
                <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-subtle);">Node #${n.position}</span>
              </div>
              <div class="emp-card-footer">
                <div>
                  <div style="font-size: 0.7rem; color: var(--text-subtle); text-transform: uppercase;">ID: ${n.id}</div>
                  <div class="emp-card-sal">${formatCurrency(n.salary)}</div>
                </div>
                <div style="display: flex; gap: 6px;">
                  <button class="btn btn-sm btn-ghost" onclick="window.inspectNode(${n.id})">Inspect</button>
                  <button class="btn btn-sm btn-danger" onclick="window.deleteNodePrompt(${n.id})">Delete</button>
                </div>
              </div>
            </div>
          `;
        }).join("");
      }
    }
  }

  dirSearchInput.addEventListener("input", (e) => {
    dirClearSearch.style.display = e.target.value ? "block" : "none";
    renderDirectory();
  });

  dirClearSearch.addEventListener("click", () => {
    dirSearchInput.value = "";
    dirClearSearch.style.display = "none";
    renderDirectory();
  });

  dirDeptFilter.addEventListener("change", renderDirectory);

  dirSortFilter.addEventListener("change", (e) => {
    const val = e.target.value;
    if (val === "id-asc") org.sortById(true);
    else if (val === "id-desc") org.sortById(false);
    else if (val === "sal-desc") org.sortBySalary(false);
    else if (val === "sal-asc") org.sortBySalary(true);
    else if (val === "name-asc") org.sortByName(true);
    logAudit("SORT", `Re-ordered roster by ${val}.`);
    persistData();
    renderAll();
  });

  // Global actions for table & cards
  window.deleteNodePrompt = (id) => {
    if (confirm(`Are you sure you want to deallocate Employee Node #${id}?`)) {
      const res = org.deleteById(id);
      if (res.success) {
        showToast(res.message, "success");
        logAudit("DELETE", `Unlinked Employee Node #${id}.`);
        persistData();
        renderAll();
      } else {
        showToast(res.message, "error");
      }
    }
  };

  // Inspect Modal
  const inspectModal = document.getElementById("modal-inspect");
  const inspectBody = document.getElementById("inspect-body");
  const btnCloseInspect = document.getElementById("btn-close-inspect");
  const btnCloseInspectFoot = document.getElementById("btn-close-inspect-foot");

  window.inspectNode = (id) => {
    const found = org.find(id);
    if (!found) return;
    const { node, position } = found;

    inspectBody.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); pb-3;">
          <h4 style="font-size: 1.15rem; font-weight: 800;">${escapeHtml(node.name)}</h4>
          <span style="font-family: var(--font-mono); color: var(--accent-cyan); font-weight: bold;">ID #${node.id}</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.85rem;">
          <div><strong style="color: var(--text-subtle);">Department:</strong><br>${escapeHtml(node.department)}</div>
          <div><strong style="color: var(--text-subtle);">Designation:</strong><br>${escapeHtml(node.designation)}</div>
          <div><strong style="color: var(--text-subtle);">Compensation:</strong><br><span style="color: var(--accent-green); font-family: var(--font-mono); font-weight: 700;">${formatCurrency(node.salary)} / year</span></div>
          <div><strong style="color: var(--text-subtle);">Node Position:</strong><br>#${position} in Linked List</div>
        </div>
        <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 8px; padding: 12px; font-family: var(--font-mono); font-size: 0.8rem;">
          <div style="color: var(--text-subtle); margin-bottom: 4px;">// Memory Pointers</div>
          <div>this-&gt;address: <span style="color: #38bdf8;">${node.address}</span></div>
          <div>this-&gt;next* : <span style="color: ${node.next ? '#a855f7' : '#ef4444'};">${node.next ? node.next.address : "0x0 (NULL Terminator)"}</span></div>
        </div>
      </div>
    `;

    inspectModal.classList.add("active");
  };

  const closeInspect = () => inspectModal.classList.remove("active");
  if (btnCloseInspect) btnCloseInspect.addEventListener("click", closeInspect);
  if (btnCloseInspectFoot) btnCloseInspectFoot.addEventListener("click", closeInspect);
  inspectModal.addEventListener("click", (e) => { if (e.target === inspectModal) closeInspect(); });

  // ==========================================================================
  // RENDER 3: DSA VISUALIZER STUDIO
  // ==========================================================================
  const visTrack = document.getElementById("visualizer-canvas-track");
  const visBtnTraverse = document.getElementById("vis-btn-traverse");
  const visBtnAnimSort = document.getElementById("vis-btn-animated-sort");
  const visBtnAnimSal = document.getElementById("vis-btn-sort-sal");
  const visBtnInsertHead = document.getElementById("vis-btn-insert-head");
  const visBtnDelHead = document.getElementById("vis-btn-del-head");
  const visBtnReset = document.getElementById("vis-btn-reset");
  const visStepBanner = document.getElementById("vis-step-banner");
  const stepDesc = document.getElementById("step-desc");
  const stepCmpCount = document.getElementById("step-cmp-count");
  const stepSwapCount = document.getElementById("step-swap-count");

  // Speed controls
  document.querySelectorAll(".speed-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".speed-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      animSpeed = parseInt(btn.getAttribute("data-speed"), 10);
    });
  });

  function renderVisualizer(scanId = null, swapId = null) {
    if (!visTrack) return;
    visTrack.innerHTML = "";
    const nodes = org.toArray();

    // 1. HEAD Box
    const headBox = document.createElement("div");
    headBox.className = "v-head-box";
    headBox.innerHTML = `<div>HEAD</div><small>${nodes.length > 0 ? nodes[0].address : "0x0 (NULL)"}</small>`;
    visTrack.appendChild(headBox);

    // Initial arrow
    visTrack.appendChild(createVisArrow());

    if (nodes.length === 0) {
      visTrack.appendChild(createNullBox());
      return;
    }

    // 2. Nodes
    nodes.forEach((node) => {
      const nodeBox = document.createElement("div");
      let hlClass = "";
      if (node.id === scanId) hlClass = "highlight-scan";
      if (node.id === swapId) hlClass = "highlight-swap";

      nodeBox.className = `v-node-box ${hlClass}`;
      nodeBox.id = `vis-box-${node.id}`;

      nodeBox.innerHTML = `
        <div class="v-node-hdr">
          <span>Node #${node.position}</span>
          <span style="color: var(--accent-cyan);">${node.address}</span>
        </div>
        <div class="v-node-body">
          <div class="v-node-name">${escapeHtml(node.name)}</div>
          <div class="v-node-des">${escapeHtml(node.designation)}</div>
          <div class="v-node-sal">${formatCurrency(node.salary)}</div>
        </div>
        <div class="v-node-ftr">
          <span>ID: ${node.id}</span>
          <span>next: ${node.hasNext ? node.nextAddress : "0x0 (NULL)"}</span>
        </div>
      `;

      nodeBox.addEventListener("click", () => window.inspectNode(node.id));
      visTrack.appendChild(nodeBox);

      // Arrow
      visTrack.appendChild(createVisArrow());
    });

    // 3. NULL Terminator
    visTrack.appendChild(createNullBox());
  }

  function createVisArrow() {
    const arrow = document.createElement("div");
    arrow.className = "v-arrow";
    arrow.innerHTML = `<div class="v-arrow-line"></div><div class="v-arrow-head"></div>`;
    return arrow;
  }

  function createNullBox() {
    const nullBox = document.createElement("div");
    nullBox.className = "v-null-box";
    nullBox.innerText = "NULL";
    return nullBox;
  }

  // Animate Traversal
  visBtnTraverse.addEventListener("click", async () => {
    const nodes = org.toArray();
    if (nodes.length === 0) {
      showToast("List is empty. Nothing to traverse.", "error");
      return;
    }

    visBtnTraverse.disabled = true;
    showToast("Traversing pointer chain from HEAD...", "info");

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      renderVisualizer(n.id);
      const elem = document.getElementById(`vis-box-${n.id}`);
      if (elem) elem.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      await new Promise(r => setTimeout(r, animSpeed));
    }

    renderVisualizer();
    visBtnTraverse.disabled = false;
    showToast("Traversal complete: reached NULL terminator.", "success");
    logAudit("TRAVERSE", "Completed full pointer chain traversal.");
  });

  // Animated Bubble Sort Step-by-Step
  async function runAnimatedSort(bySalary = false) {
    if (!org.head || !org.head.next) {
      showToast("Need at least 2 nodes to perform bubble sort.", "info");
      return;
    }

    visBtnAnimSort.disabled = true;
    visBtnAnimSal.disabled = true;
    visStepBanner.style.display = "flex";

    let comparisons = 0;
    let swaps = 0;

    for (let p = org.head; p !== null; p = p.next) {
      for (let q = p.next; q !== null; q = q.next) {
        comparisons++;
        stepCmpCount.innerText = comparisons;
        stepSwapCount.innerText = swaps;
        stepDesc.innerText = `Comparing Node #${p.id} (${p.name}) with Node #${q.id} (${q.name})...`;

        // Highlight comparison
        renderVisualizer(p.id, q.id);
        await new Promise(r => setTimeout(r, animSpeed));

        const shouldSwap = bySalary ? (p.salary < q.salary) : (p.id > q.id);
        if (shouldSwap) {
          swaps++;
          stepSwapCount.innerText = swaps;
          stepDesc.innerText = `Condition Met! Swapping data between Node #${p.id} and Node #${q.id}...`;

          org.swapPayload(p, q);
          renderVisualizer(q.id, p.id); // Show swapped
          await new Promise(r => setTimeout(r, animSpeed));
        }
      }
    }

    renderVisualizer();
    stepDesc.innerText = `Sorting Completed! Total Comparisons: ${comparisons}, Total Swaps: ${swaps}.`;
    visBtnAnimSort.disabled = false;
    visBtnAnimSal.disabled = false;
    showToast(`Bubble sort finished with ${swaps} swaps!`, "success");
    logAudit("SORT", `Completed animated bubble sort (${bySalary ? 'Salary' : 'ID'}).`);
    persistData();
    renderAll();
  }

  visBtnAnimSort.addEventListener("click", () => runAnimatedSort(false));
  visBtnAnimSal.addEventListener("click", () => runAnimatedSort(true));

  // Quick visualizer actions
  visBtnInsertHead.addEventListener("click", () => {
    const newId = Math.floor(Math.random() * 800) + 110;
    const names = ["Karan Singh", "Neha Gupta", "Vikram Rathore", "Pooja Roy"];
    const roles = ["Security Analyst", "Systems Engineer", "Data Specialist", "UI Engineer"];
    const depts = ["Engineering", "Data & AI", "Operations & HR"];

    const rName = names[Math.floor(Math.random() * names.length)];
    const rRole = roles[Math.floor(Math.random() * roles.length)];
    const rDept = depts[Math.floor(Math.random() * depts.length)];
    const rSal = 95000 + Math.floor(Math.random() * 50000);

    org.insertHead(newId, rName, rDept, rRole, rSal);
    showToast(`Inserted Node #${newId} at Head (O(1)).`, "success");
    logAudit("INSERT", `Inserted Node #${newId} at Head.`);
    persistData();
    renderAll();
  });

  visBtnDelHead.addEventListener("click", () => {
    const res = org.deleteHead();
    if (res.success) {
      showToast(res.message, "success");
      logAudit("DELETE", "Unlinked Head Node.");
      persistData();
      renderAll();
    } else {
      showToast(res.message, "error");
    }
  });

  visBtnReset.addEventListener("click", () => {
    org.loadTechStartup();
    showToast("Restored demo tech startup linked list.", "info");
    logAudit("RESET", "Restored default startup dataset.");
    persistData();
    renderAll();
  });

  // ==========================================================================
  // RENDER 4: ADD EMPLOYEE PORTAL & LIVE PREVIEW
  // ==========================================================================
  const fullAddForm = document.getElementById("full-add-form");
  const fId = document.getElementById("f-id");
  const fName = document.getElementById("f-name");
  const fDept = document.getElementById("f-dept");
  const fDes = document.getElementById("f-des");
  const fSalRange = document.getElementById("f-sal-range");
  const fSalNum = document.getElementById("f-sal-num");
  const fSalPreview = document.getElementById("f-sal-preview");

  const prevAddr = document.getElementById("prev-addr");
  const prevName = document.getElementById("prev-name");
  const prevDes = document.getElementById("prev-des");
  const prevDept = document.getElementById("prev-dept");
  const prevSal = document.getElementById("prev-sal");
  const prevId = document.getElementById("prev-id");

  function updateFormPreview() {
    const idVal = fId.value || "106";
    const nameVal = fName.value || "Aditi Kulkarni";
    const deptVal = fDept.value || "Engineering";
    const desVal = fDes.value || "Senior ML Engineer";
    const salVal = parseFloat(fSalNum.value) || 120000;

    prevId.innerText = idVal;
    prevName.innerText = nameVal;
    prevDept.innerText = deptVal;
    prevDes.innerText = desVal;
    prevSal.innerText = `${formatCurrency(salVal)} / year`;
    prevAddr.innerText = `0x7FFE${(0x1000 + (parseInt(idVal, 10) * 16 || 0)).toString(16).toUpperCase()}`;
  }

  fSalRange.addEventListener("input", (e) => {
    fSalNum.value = e.target.value;
    fSalPreview.innerText = formatCurrency(e.target.value);
    updateFormPreview();
  });

  fSalNum.addEventListener("input", (e) => {
    fSalRange.value = e.target.value;
    fSalPreview.innerText = formatCurrency(e.target.value);
    updateFormPreview();
  });

  [fId, fName, fDept, fDes].forEach(elem => elem.addEventListener("input", updateFormPreview));

  fullAddForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = parseInt(fId.value, 10);
    const name = fName.value.trim();
    const dept = fDept.value;
    const des = fDes.value.trim();
    const sal = parseFloat(fSalNum.value);
    const strategy = document.querySelector('input[name="link-strategy"]:checked').value;

    let res;
    if (strategy === "head") {
      res = org.insertHead(id, name, dept, des, sal);
    } else {
      res = org.insertTail(id, name, dept, des, sal);
    }

    if (res.success) {
      showToast(res.message, "success");
      logAudit("INSERT", `Allocated Employee Node #${id} (${name}).`);
      persistData();
      renderAll();
      fullAddForm.reset();
      fSalRange.value = 120000;
      fSalNum.value = 120000;
      fSalPreview.innerText = "$120,000";
      updateFormPreview();
      switchTab("directory");
    } else {
      showToast(res.message, "error");
    }
  });

  // ==========================================================================
  // RENDER 5: ANALYTICS & REPORTS
  // ==========================================================================
  function renderAnalytics() {
    const m = org.getMetrics();
    const nodes = org.toArray();

    // Department breakdown bars
    const deptBars = document.getElementById("analytics-dept-bars");
    if (deptBars) {
      const colors = {
        "Engineering": "#6366f1",
        "Data & AI": "#a855f7",
        "Product & Design": "#f59e0b",
        "Operations & HR": "#10b981"
      };

      deptBars.innerHTML = Object.entries(m.deptCounts).map(([dept, count]) => {
        const pct = m.count > 0 ? Math.round((count / m.count) * 100) : 0;
        return `
          <div class="chart-bar-item">
            <div class="bar-labels">
              <span>${escapeHtml(dept)}</span>
              <span class="font-mono">${count} Nodes (${pct}%)</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill" style="width: ${pct}%; background: ${colors[dept] || '#6366f1'};"></div>
            </div>
          </div>
        `;
      }).join("");
    }

    // Salary Tiers bars
    const salaryBars = document.getElementById("analytics-salary-bars");
    if (salaryBars) {
      const tierColors = ["#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"];
      let i = 0;
      salaryBars.innerHTML = Object.entries(m.salaryTiers).map(([tier, count]) => {
        const pct = m.count > 0 ? Math.round((count / m.count) * 100) : 0;
        const color = tierColors[i++ % tierColors.length];
        return `
          <div class="chart-bar-item">
            <div class="bar-labels">
              <span>${tier}</span>
              <span class="font-mono">${count} Employees (${pct}%)</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill" style="width: ${pct}%; background: ${color};"></div>
            </div>
          </div>
        `;
      }).join("");
    }

    // Top Earners Leaderboard
    const topTable = document.getElementById("analytics-top-earners");
    if (topTable) {
      const sorted = [...nodes].sort((a, b) => b.salary - a.salary);
      topTable.innerHTML = sorted.slice(0, 5).map((n, idx) => `
        <tr>
          <td style="font-weight: 800; color: ${idx === 0 ? 'var(--accent-amber)' : 'var(--text-subtle)'}; font-family: var(--font-mono);">
            #${idx + 1}
          </td>
          <td class="font-mono text-cyan">#${n.id}</td>
          <td><strong>${escapeHtml(n.name)}</strong></td>
          <td>${getDeptBadge(n.department)}</td>
          <td>${escapeHtml(n.designation)}</td>
          <td style="text-align: right;" class="font-mono text-green font-bold">
            ${formatCurrency(n.salary)}
          </td>
        </tr>
      `).join("");
    }
  }

  // ==========================================================================
  // RENDER 6 & 7: CODE HUB & DATA TOOLS
  // ==========================================================================
  const btnCopyCpp = document.getElementById("btn-copy-cpp");
  if (btnCopyCpp) {
    btnCopyCpp.addEventListener("click", () => {
      const code = document.getElementById("cpp-code-display").innerText;
      navigator.clipboard.writeText(code).then(() => {
        showToast("C++ source code copied to clipboard!", "success");
      });
    });
  }

  // Export CSV
  const btnExportCsvFull = document.getElementById("btn-export-csv-full");
  if (btnExportCsvFull) {
    btnExportCsvFull.addEventListener("click", () => {
      const nodes = org.toArray();
      if (nodes.length === 0) {
        showToast("No employee records to export.", "error");
        return;
      }
      let csv = "ID,Name,Department,Designation,Salary,SimulatedAddress\n";
      nodes.forEach(n => {
        csv += `${n.id},"${n.name}","${n.department}","${n.designation}",${n.salary},"${n.address}"\n`;
      });
      downloadFile(csv, "nova_ems_roster.csv", "text/csv;charset=utf-8;");
      showToast("Exported records as nova_ems_roster.csv", "success");
      logAudit("EXPORT", "Exported roster to CSV file.");
    });
  }

  // Export JSON
  const btnExportJson = document.getElementById("btn-export-json");
  if (btnExportJson) {
    btnExportJson.addEventListener("click", () => {
      const nodes = org.toArray();
      const json = JSON.stringify(nodes, null, 2);
      downloadFile(json, "nova_ems_roster.json", "application/json");
      showToast("Exported records as nova_ems_roster.json", "success");
      logAudit("EXPORT", "Exported roster to JSON file.");
    });
  }

  function downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Presets
  const btnLoadStartup = document.getElementById("btn-load-tech-startup");
  if (btnLoadStartup) {
    btnLoadStartup.addEventListener("click", () => {
      org.loadTechStartup();
      persistData();
      renderAll();
      showToast("Loaded 'AI Tech Startup' benchmark preset.", "success");
      logAudit("BENCHMARK", "Loaded AI Tech Startup benchmark (6 nodes).");
    });
  }

  const btnLoadEnterprise = document.getElementById("btn-load-enterprise");
  if (btnLoadEnterprise) {
    btnLoadEnterprise.addEventListener("click", () => {
      org.loadEnterprise();
      persistData();
      renderAll();
      showToast("Loaded 'Global Enterprise' benchmark preset.", "success");
      logAudit("BENCHMARK", "Loaded Global Enterprise benchmark (10 nodes).");
    });
  }

  const btnFactoryReset = document.getElementById("btn-factory-reset");
  if (btnFactoryReset) {
    btnFactoryReset.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear all nodes? This cannot be undone.")) {
        org.head = null;
        org.count = 0;
        persistData();
        renderAll();
        showToast("Roster cleared. Linked list is now empty.", "info");
        logAudit("RESET", "Cleared all nodes from linked list.");
      }
    });
  }

  // ==========================================================================
  // MASTER RENDER
  // ==========================================================================
  function renderAll() {
    renderDashboard();
    renderDirectory();
    renderVisualizer();
    renderAnalytics();
  }

  function escapeHtml(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // Initial Boot
  renderAll();
  updateFormPreview();
});
