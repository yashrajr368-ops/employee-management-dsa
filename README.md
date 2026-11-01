# Employee Management System (DSA in C++ & Modern Web Frontend)

A complete, full-stack Data Structures and Algorithms (DSA) project featuring an optimized **Singly Linked List** implementation in modern C++ and an interactive **Web Frontend Visualizer**.

---

## 📌 Project Overview

This project implements a professional **Employee Management System** where employees are modeled as dynamically allocated nodes within a custom Singly Linked List data structure.

### Key Components:
1. **Core C++ Engine (`cpp/main.cpp`)**:
   - Production-grade Singly Linked List with zero memory leaks (automatic destructor deallocation).
   - Fast $O(N)$ insertion, safe head/middle/tail deletion, and pointer-safe bubble sort algorithms.
   - Robust input handling (supports spaces in names, input validation) and CSV file persistence.
2. **Interactive Web Frontend (`frontend/`)**:
   - **Real-Time DSA Visualizer**: Graphical rendering of each heap node `[HEAD] ➔ [Node 1] ➔ [Node 2] ➔ [NULL]` with simulated memory addresses (`0x1010`, `0x1020`) and pointer chains.
   - **Interactive Operations**: Live visual node insertion, pointer rewiring on deletion, animated traversal scanner, and ascending/descending bubble sorting.
   - **Enterprise Dashboard**: Real-time KPI metrics (Headcount, Total Payroll, Average Salary, Max Earner), search filter, and CSV data export.

---

## 🛠️ Critical Bug Fixes (From Original C++ Snippet)

| Problem in Original Snippet | Cause | Resolution in This Project |
| :--- | :--- | :--- |
| **Crash in `sorting()`** | `Emp *temp = NULL; temp->id = p->id;` attempts to dereference a null pointer, causing a fatal **Segmentation Fault**. | Rewrote sorting using safe payload swap (`swapPayload(p, q)`) without pointer corruption. |
| **Incomplete Swap in `sorting()`** | Only `id` was swapped, leaving `nm`, `des`, and `sal` attached to the old node. This corrupted employee data records. | Swapped all fields (`id`, `name`, `designation`, `salary`) synchronously. |
| **Crash in `deletee()` on Head Node** | `p->next->id != x` begins checking at the second node, completely skipping the head node and crashing if head is the only node. | Handled head deletion as an explicit base case (`head = head->next; delete temp;`). |
| **Crash in `deletee()` on Not Found** | While loops ran until `p->next` was `NULL`, throwing null-pointer dereference errors when an ID didn't exist. | Added boundary checks (`curr != nullptr`) with graceful error messaging. |
| **Truncated Names with Spaces** | `cin >> nm` stops at spaces, breaking the menu sequence when entering full names like "John Doe". | Switched to `std::string` with `getline(cin, name)` and stream clear guards. |
| **Memory Leak** | No destructor or cleanup loop; all allocated nodes remained leaked in heap memory upon exit. | Implemented `~Organization()` destructor and `clear()` method to free every node. |

---

## 📊 Data Structures & Algorithm Complexity (Big-O)

| Operation | Best Case | Average Case | Worst Case | Space Complexity | Explanation |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Insert (at Tail)** | $O(1)$* | $O(N)$ | $O(N)$ | $O(1)$ | Traverses from `head` until `curr->next == nullptr` (*$O(1)$ if tail pointer maintained). |
| **Delete (by ID)** | $O(1)$ | $O(N)$ | $O(N)$ | $O(1)$ | $O(1)$ if head is target; otherwise $O(N)$ linear traversal to find target and predecessor. |
| **Search (by ID/Name)** | $O(1)$ | $O(N)$ | $O(N)$ | $O(1)$ | Linear scan starting from `head`. |
| **Bubble Sort (by ID/Sal)**| $O(N)$ | $O(N^2)$ | $O(N^2)$ | $O(1)$ | Nested pointer traversal comparing `p` and `q = p->next`. |
| **Memory Cleanup (Destructor)** | $O(N)$ | $O(N)$ | $O(N)$ | $O(1)$ | Walks through each node and invokes `delete` to free heap memory. |

---

## 🚀 How to Run

### 1. Running the Interactive Web Frontend
You have two simple options:

#### Option A: Direct in Browser
Double-click or open `frontend/index.html` in Chrome, Edge, Firefox, or any modern web browser.

#### Option B: Local Web Server (Recommended)
Run the bundled lightweight Python server:
```bash
cd employee_management_dsa
python server.py
```
This serves the application at **`http://localhost:8080`** and automatically opens your browser.

---

### 2. Compiling & Running the C++ CLI Application

#### Using GCC / MinGW (`g++`):
```bash
cd employee_management_dsa/cpp
g++ -std=c++11 main.cpp -o emp_system.exe
./emp_system.exe
```

#### Using Clang:
```bash
clang++ -std=c++11 main.cpp -o emp_system.exe
./emp_system.exe
```

#### Using Microsoft Visual C++ (`cl`):
```bash
cl /EHsc /std:c++14 main.cpp /Fe:emp_system.exe
emp_system.exe
```

---

## 📁 Project Directory Structure

```
employee_management_dsa/
├── cpp/
│   ├── main.cpp             # Clean, bug-free C++ CLI with Linked List DSA & CSV persistence
│   └── emp_system.exe       # Pre-compiled executable (Windows)
├── frontend/
│   ├── index.html           # Interactive Web Frontend & Live Linked List Visualizer
│   ├── styles.css           # Modern design system, node animations & pointer styles
│   └── app.js               # Singly Linked List DSA engine in JavaScript
├── server.py                # Zero-dependency local development server
└── README.md                # Comprehensive documentation & complexity reference
```

---

## 💡 Features Included

- [x] **Dynamic Node Visualizer**: See how pointer chains `[Node] ➔ [Node] ➔ [NULL]` behave during operations.
- [x] **Node Animation**: Animated pointer traversal, node deletion fade-out, and visual focus highlighting.
- [x] **Analytics Dashboard**: Instant calculation of roster size, total payroll, average wage, and maximum compensation.
- [x] **Multi-Criteria Sorting**: Sort ascending/descending by Employee ID or Annual Salary.
- [x] **Search & Filter**: Real-time linear search matching IDs, names, or designations.
- [x] **Data Persistence**: Export and import roster records to and from CSV.
