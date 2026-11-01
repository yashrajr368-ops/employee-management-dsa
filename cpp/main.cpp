#include <iostream>
#include <iomanip>
#include <string>
#include <fstream>
#include <sstream>
#include <utility>
#include <limits>

using namespace std;

// ==========================================
// Node Class: Represents an Employee
// ==========================================
class Employee
{
public:
    int id;
    string name;
    string designation;
    double salary;
    Employee *next;

    Employee(int id, const string &name, const string &designation, double salary)
        : id(id), name(name), designation(designation), salary(salary), next(nullptr) {}
};

// ==========================================
// Data Structure: Singly Linked List (Org)
// ==========================================
class Organization
{
private:
    Employee *head;
    int count;

public:
    Organization() : head(nullptr), count(0) {}

    // Destructor: Clean up all dynamically allocated memory
    ~Organization()
    {
        clear();
    }

    void clear()
    {
        Employee *curr = head;
        while (curr != nullptr)
        {
            Employee *temp = curr;
            curr = curr->next;
            delete temp;
        }
        head = nullptr;
        count = 0;
    }

    int getCount() const
    {
        return count;
    }

    // Check if ID already exists
    bool exists(int id) const
    {
        Employee *curr = head;
        while (curr != nullptr)
        {
            if (curr->id == id)
                return true;
            curr = curr->next;
        }
        return false;
    }

    // Insert Employee at End - O(N)
    bool insert(int id, const string &name, const string &designation, double salary)
    {
        if (id <= 0)
        {
            cout << "\n[!] Error: Employee ID must be a positive integer.\n";
            return false;
        }

        if (exists(id))
        {
            cout << "\n[!] Error: Employee with ID " << id << " already exists!\n";
            return false;
        }

        Employee *newNode = new Employee(id, name, designation, salary);

        if (head == nullptr)
        {
            head = newNode;
        }
        else
        {
            Employee *curr = head;
            while (curr->next != nullptr)
            {
                curr = curr->next;
            }
            curr->next = newNode;
        }
        count++;
        cout << "\n[+] Employee record inserted successfully! (ID: " << id << ")\n";
        return true;
    }

    // Delete Employee by ID - Safe O(N)
    bool deleteById(int id)
    {
        if (head == nullptr)
        {
            cout << "\n[!] Organization record list is EMPTY!\n";
            return false;
        }

        Employee *curr = head;
        Employee *prev = nullptr;

        // Case 1: Head node itself holds the ID
        if (curr != nullptr && curr->id == id)
        {
            head = curr->next;
            delete curr;
            count--;
            cout << "\n[-] Employee with ID " << id << " deleted successfully.\n";
            return true;
        }

        // Case 2: Search for node to delete, keeping track of previous node
        while (curr != nullptr && curr->id != id)
        {
            prev = curr;
            curr = curr->next;
        }

        // Case 3: ID was not present in the list
        if (curr == nullptr)
        {
            cout << "\n[!] Employee with ID " << id << " NOT found!\n";
            return false;
        }

        // Unlink the node and free memory
        prev->next = curr->next;
        delete curr;
        count--;
        cout << "\n[-] Employee with ID " << id << " deleted successfully.\n";
        return true;
    }

    // Search Employee by ID - O(N)
    void searchById(int id) const
    {
        if (head == nullptr)
        {
            cout << "\n[!] Organization record list is EMPTY!\n";
            return;
        }

        Employee *curr = head;
        int position = 1;
        while (curr != nullptr)
        {
            if (curr->id == id)
            {
                cout << "\n============================================\n";
                cout << "            EMPLOYEE DETAILS FOUND          \n";
                cout << "============================================\n";
                cout << " Node Position: #" << position << " in Linked List\n";
                cout << " Employee ID  : " << curr->id << "\n";
                cout << " Full Name    : " << curr->name << "\n";
                cout << " Designation  : " << curr->designation << "\n";
                cout << " Salary       : $" << fixed << setprecision(2) << curr->salary << "\n";
                cout << "============================================\n";
                return;
            }
            curr = curr->next;
            position++;
        }

        cout << "\n[!] Employee with ID " << id << " NOT found!\n";
    }

    // Search Employee by Name (Partial Match)
    void searchByName(const string &query) const
    {
        if (head == nullptr)
        {
            cout << "\n[!] Organization record list is EMPTY!\n";
            return;
        }

        bool found = false;
        Employee *curr = head;
        cout << "\nSearching for: \"" << query << "\"...\n";
        cout << string(70, '-') << "\n";
        cout << left << setw(8) << "ID"
             << setw(25) << "Name"
             << setw(22) << "Designation"
             << right << setw(15) << "Salary ($)" << "\n";
        cout << string(70, '-') << "\n";

        while (curr != nullptr)
        {
            if (curr->name.find(query) != string::npos)
            {
                cout << left << setw(8) << curr->id
                     << setw(25) << curr->name
                     << setw(22) << curr->designation
                     << right << setw(15) << fixed << setprecision(2) << curr->salary << "\n";
                found = true;
            }
            curr = curr->next;
        }

        if (!found)
        {
            cout << "No matching records found.\n";
        }
        cout << string(70, '-') << "\n";
    }

    // Traverse and Display all Employees in a Table
    void display() const
    {
        if (head == nullptr)
        {
            cout << "\n[!] No records to display. The list is empty.\n";
            return;
        }

        cout << "\n" << string(72, '=') << "\n";
        cout << "                  EMPLOYEE ROSTER (TOTAL: " << count << ")\n";
        cout << string(72, '=') << "\n";
        cout << left << setw(8) << "ID"
             << setw(24) << "Name"
             << setw(22) << "Designation"
             << right << setw(18) << "Salary ($)" << "\n";
        cout << string(72, '-') << "\n";

        double totalSalary = 0;
        Employee *curr = head;
        while (curr != nullptr)
        {
            cout << left << setw(8) << curr->id
                 << setw(24) << curr->name
                 << setw(22) << curr->designation
                 << right << setw(18) << fixed << setprecision(2) << curr->salary << "\n";
            totalSalary += curr->salary;
            curr = curr->next;
        }

        cout << string(72, '=') << "\n";
        cout << left << setw(54) << "Total Payroll Expense:"
             << right << setw(18) << fixed << setprecision(2) << totalSalary << "\n";
        cout << left << setw(54) << "Average Salary:"
             << right << setw(18) << fixed << setprecision(2) << (totalSalary / count) << "\n";
        cout << string(72, '=') << "\n";
    }

    // Visual ASCII representation of Linked List
    void displayVisualList() const
    {
        if (head == nullptr)
        {
            cout << "\n[HEAD] ➔ NULL\n";
            return;
        }

        cout << "\n--- Linked List Pointer Chain Visualization ---\n";
        cout << "[HEAD] ➔ ";
        Employee *curr = head;
        while (curr != nullptr)
        {
            cout << "[ID:" << curr->id << " | " << curr->name << "] ➔ ";
            curr = curr->next;
        }
        cout << "NULL\n-----------------------------------------------\n";
    }

    // Sort by ID - Bubble Sort on Singly Linked List - O(N^2)
    void sortById(bool ascending = true)
    {
        if (head == nullptr || head->next == nullptr)
        {
            cout << "\n[i] List has 0 or 1 element. No sorting required.\n";
            return;
        }

        for (Employee *p = head; p != nullptr; p = p->next)
        {
            for (Employee *q = p->next; q != nullptr; q = q->next)
            {
                bool shouldSwap = ascending ? (p->id > q->id) : (p->id < q->id);
                if (shouldSwap)
                {
                    swapPayload(p, q);
                }
            }
        }
        cout << "\n[*] List sorted by Employee ID (" << (ascending ? "Ascending" : "Descending") << ") successfully!\n";
    }

    // Sort by Salary - Bubble Sort - O(N^2)
    void sortBySalary(bool ascending = true)
    {
        if (head == nullptr || head->next == nullptr)
        {
            cout << "\n[i] List has 0 or 1 element. No sorting required.\n";
            return;
        }

        for (Employee *p = head; p != nullptr; p = p->next)
        {
            for (Employee *q = p->next; q != nullptr; q = q->next)
            {
                bool shouldSwap = ascending ? (p->salary > q->salary) : (p->salary < q->salary);
                if (shouldSwap)
                {
                    swapPayload(p, q);
                }
            }
        }
        cout << "\n[*] List sorted by Salary (" << (ascending ? "Ascending" : "Descending") << ") successfully!\n";
    }

    // Export to CSV File
    bool saveToCSV(const string &filename = "employees.csv") const
    {
        ofstream outFile(filename);
        if (!outFile.is_open())
        {
            cout << "\n[!] Error: Unable to open file for writing: " << filename << "\n";
            return false;
        }

        outFile << "ID,Name,Designation,Salary\n";
        Employee *curr = head;
        while (curr != nullptr)
        {
            outFile << curr->id << ",\"" << curr->name << "\",\"" << curr->designation << "\"," << curr->salary << "\n";
            curr = curr->next;
        }
        outFile.close();
        cout << "\n[+] Successfully exported " << count << " records to " << filename << "\n";
        return true;
    }

    // Import from CSV File
    bool loadFromCSV(const string &filename = "employees.csv")
    {
        ifstream inFile(filename);
        if (!inFile.is_open())
        {
            cout << "\n[!] Error: Unable to open file for reading: " << filename << "\n";
            return false;
        }

        string line;
        getline(inFile, line); // Skip header row

        int importedCount = 0;
        while (getline(inFile, line))
        {
            if (line.empty()) continue;
            stringstream ss(line);
            string idStr, name, des, salStr;

            if (getline(ss, idStr, ',') &&
                getline(ss, name, ',') &&
                getline(ss, des, ',') &&
                getline(ss, salStr, ','))
            {
                // Strip quotes if present
                if (name.size() >= 2 && name.front() == '"' && name.back() == '"')
                    name = name.substr(1, name.size() - 2);
                if (des.size() >= 2 && des.front() == '"' && des.back() == '"')
                    des = des.substr(1, des.size() - 2);

                try
                {
                    int id = stoi(idStr);
                    double sal = stod(salStr);
                    if (!exists(id))
                    {
                        insert(id, name, des, sal);
                        importedCount++;
                    }
                }
                catch (...)
                {
                    continue;
                }
            }
        }
        inFile.close();
        cout << "\n[+] Imported " << importedCount << " records from " << filename << "\n";
        return true;
    }

private:
    // Helper to safely swap data between two nodes without re-linking pointers
    void swapPayload(Employee *a, Employee *b)
    {
        swap(a->id, b->id);
        swap(a->name, b->name);
        swap(a->designation, b->designation);
        swap(a->salary, b->salary);
    }
};

// ==========================================
// Safe Console Input Helper Functions
// ==========================================
int getIntInput(const string &prompt)
{
    int value;
    string line;
    while (true)
    {
        cout << prompt;
        if (!getline(cin, line))
        {
            exit(0);
        }
        stringstream ss(line);
        if (ss >> value)
        {
            return value;
        }
        cout << "[!] Invalid input. Please enter a valid number.\n";
    }
}

double getDoubleInput(const string &prompt)
{
    double value;
    string line;
    while (true)
    {
        cout << prompt;
        if (!getline(cin, line))
        {
            exit(0);
        }
        stringstream ss(line);
        if (ss >> value)
        {
            return value;
        }
        cout << "[!] Invalid input. Please enter a valid decimal number.\n";
    }
}

string getStringInput(const string &prompt)
{
    string val;
    while (true)
    {
        cout << prompt;
        if (!getline(cin, val))
        {
            exit(0);
        }
        if (!val.empty())
        {
            return val;
        }
        cout << "[!] Input cannot be empty. Please try again.\n";
    }
}

// ==========================================
// Main Function & CLI Menu
// ==========================================
int main()
{
    Organization org;

    // Load initial sample data for demonstration
    org.insert(101, "Yashraj Rao", "Senior Software Engineer", 125000.00);
    org.insert(104, "Priya Sharma", "Lead Data Scientist", 138000.00);
    org.insert(102, "Amit Patel", "Cloud Architect", 145000.00);
    org.insert(103, "Sneha Verma", "Product Designer", 98000.00);

    int choice;

    while (true)
    {
        cout << "\n=======================================================\n";
        cout << "      EMPLOYEE MANAGEMENT SYSTEM (SINGLY LINKED LIST)  \n";
        cout << "=======================================================\n";
        cout << " [1] Insert New Employee\n";
        cout << " [2] Delete Employee by ID\n";
        cout << " [3] Show All Records (Tabular View)\n";
        cout << " [4] View Linked List Pointer Chain (Visual DSA)\n";
        cout << " [5] Search Employee by ID\n";
        cout << " [6] Search Employee by Name\n";
        cout << " [7] Sort Employees by ID (Ascending)\n";
        cout << " [8] Sort Employees by Salary (Descending)\n";
        cout << " [9] Save Records to CSV File\n";
        cout << " [10] Load Records from CSV File\n";
        cout << " [0] Exit Application\n";
        cout << "=======================================================\n";

        choice = getIntInput("Enter your choice: ");

        switch (choice)
        {
        case 1:
        {
            int id = getIntInput("Enter Employee ID: ");
            string name = getStringInput("Enter Employee Full Name: ");
            string des = getStringInput("Enter Designation: ");
            double sal = getDoubleInput("Enter Salary: $");
            org.insert(id, name, des, sal);
            break;
        }
        case 2:
        {
            int id = getIntInput("Enter Employee ID to Delete: ");
            org.deleteById(id);
            break;
        }
        case 3:
            org.display();
            break;

        case 4:
            org.displayVisualList();
            break;

        case 5:
        {
            int id = getIntInput("Enter Employee ID to Search: ");
            org.searchById(id);
            break;
        }
        case 6:
        {
            string query = getStringInput("Enter Employee Name to Search: ");
            org.searchByName(query);
            break;
        }
        case 7:
            org.sortById(true);
            org.display();
            break;

        case 8:
            org.sortBySalary(false);
            org.display();
            break;

        case 9:
        {
            string fname = getStringInput("Enter filename (default: employees.csv): ");
            org.saveToCSV(fname);
            break;
        }
        case 10:
        {
            string fname = getStringInput("Enter filename (default: employees.csv): ");
            org.loadFromCSV(fname);
            break;
        }
        case 0:
            cout << "\nExiting Employee Management System. Thank you!\n";
            return 0;

        default:
            cout << "\n[!] Invalid option. Please select between 0 and 10.\n";
            break;
        }
    }

    return 0;
}
