export interface Topic {
  id: string;
  name: string;
  important: boolean;
}

export interface PYQ {
  question: string;
  year: number;
  marks: number;
  repeated: number;
}

export interface Unit {
  id: string;
  name: string;
  weightage: number;
  topics: Topic[];
  pyqs: PYQ[];
  notes: string[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  units: Unit[];
  isLab?: boolean;
  labPrograms?: { title: string; description: string; vivaQuestions: string[] }[];
}

export interface Semester {
  number: number;
  subjects: Subject[];
}

// ---------- helpers ----------
const placeholderUnits = (id: string): Unit[] =>
  Array.from({ length: 4 }, (_, i) => ({
    id: `${id}-u${i + 1}`,
    name: `Unit ${i + 1}`,
    weightage: 25,
    topics: [
      { id: `${id}-u${i + 1}-t1`, name: `Topic ${i + 1}.1`, important: i === 0 },
      { id: `${id}-u${i + 1}-t2`, name: `Topic ${i + 1}.2`, important: false },
      { id: `${id}-u${i + 1}-t3`, name: `Topic ${i + 1}.3`, important: false },
    ],
    pyqs: [],
    notes: ["Detailed notes coming soon..."],
  }));

const sub = (id: string, name: string, code: string, units?: Unit[]): Subject => ({
  id,
  name,
  code,
  units: units ?? placeholderUnits(id),
});

// ---------- rich unit data (kept from previous content) ----------
const dbmsUnits: Unit[] = [
  {
    id: "dbms-u1",
    name: "Unit 1: Introduction & ER Model",
    weightage: 25,
    topics: [
      { id: "dbms-u1-t1", name: "Database System Architecture", important: true },
      { id: "dbms-u1-t2", name: "Data Models", important: false },
      { id: "dbms-u1-t3", name: "ER Diagram & Extended ER", important: true },
      { id: "dbms-u1-t4", name: "Relational Model", important: true },
      { id: "dbms-u1-t5", name: "Keys & Constraints", important: false },
    ],
    pyqs: [
      { question: "Draw an ER diagram for a university database", year: 2023, marks: 10, repeated: 3 },
      { question: "Explain different types of keys with examples", year: 2022, marks: 5, repeated: 2 },
    ],
    notes: [
      "DBMS provides data abstraction through 3 levels: Physical, Logical, View",
      "ER Model: Entity, Attribute, Relationship — core building blocks",
      "Keys: Super, Candidate, Primary, Foreign, Composite",
    ],
  },
  {
    id: "dbms-u2",
    name: "Unit 2: SQL & Relational Algebra",
    weightage: 25,
    topics: [
      { id: "dbms-u2-t1", name: "SQL DDL & DML", important: true },
      { id: "dbms-u2-t2", name: "Aggregate Functions & Grouping", important: true },
      { id: "dbms-u2-t3", name: "Joins & Subqueries", important: true },
      { id: "dbms-u2-t4", name: "Relational Algebra Operations", important: false },
      { id: "dbms-u2-t5", name: "Views & Indexes", important: false },
    ],
    pyqs: [
      { question: "Write SQL queries for given operations on employee database", year: 2023, marks: 10, repeated: 4 },
      { question: "Explain different types of joins with examples", year: 2022, marks: 5, repeated: 3 },
    ],
    notes: ["DDL: CREATE, ALTER, DROP, TRUNCATE", "DML: SELECT, INSERT, UPDATE, DELETE", "Joins: INNER, LEFT, RIGHT, FULL OUTER, CROSS, SELF"],
  },
  {
    id: "dbms-u3",
    name: "Unit 3: Normalization",
    weightage: 25,
    topics: [
      { id: "dbms-u3-t1", name: "Functional Dependencies", important: true },
      { id: "dbms-u3-t2", name: "Normal Forms (1NF to BCNF)", important: true },
      { id: "dbms-u3-t3", name: "Decomposition", important: false },
      { id: "dbms-u3-t4", name: "Lossless Join & Dependency Preservation", important: true },
    ],
    pyqs: [
      { question: "Normalize the given relation to BCNF", year: 2023, marks: 10, repeated: 5 },
      { question: "Find candidate keys from functional dependencies", year: 2022, marks: 5, repeated: 3 },
    ],
    notes: ["1NF: Atomic values", "2NF: No partial dependency", "3NF: No transitive dependency", "BCNF: Every determinant is a candidate key"],
  },
  {
    id: "dbms-u4",
    name: "Unit 4: Transactions & Concurrency",
    weightage: 25,
    topics: [
      { id: "dbms-u4-t1", name: "ACID Properties", important: true },
      { id: "dbms-u4-t2", name: "Serializability", important: true },
      { id: "dbms-u4-t3", name: "Concurrency Control Protocols", important: false },
      { id: "dbms-u4-t4", name: "Deadlock Handling", important: true },
      { id: "dbms-u4-t5", name: "Recovery Techniques", important: false },
    ],
    pyqs: [
      { question: "Explain ACID properties with examples", year: 2023, marks: 5, repeated: 4 },
      { question: "Check serializability of a given schedule", year: 2022, marks: 10, repeated: 3 },
    ],
    notes: ["ACID: Atomicity, Consistency, Isolation, Durability", "Two-Phase Locking: Growing + Shrinking", "Deadlock: Prevention, Detection, Avoidance"],
  },
];

const osUnits: Unit[] = [
  {
    id: "os-u1", name: "Unit 1: OS Fundamentals", weightage: 20,
    topics: [
      { id: "os-u1-t1", name: "Types of OS", important: false },
      { id: "os-u1-t2", name: "System Calls", important: true },
      { id: "os-u1-t3", name: "Process Concepts", important: true },
      { id: "os-u1-t4", name: "Process States & PCB", important: true },
    ],
    pyqs: [{ question: "Describe process states with diagram", year: 2022, marks: 5, repeated: 3 }],
    notes: ["OS Types: Batch, Time-sharing, Distributed, Real-time", "Process states: New, Ready, Running, Waiting, Terminated"],
  },
  {
    id: "os-u2", name: "Unit 2: CPU Scheduling & Synchronization", weightage: 30,
    topics: [
      { id: "os-u2-t1", name: "Scheduling Algorithms (FCFS, SJF, RR)", important: true },
      { id: "os-u2-t2", name: "Process Synchronization", important: true },
      { id: "os-u2-t3", name: "Semaphores & Mutex", important: true },
      { id: "os-u2-t4", name: "Classical Sync Problems", important: true },
    ],
    pyqs: [{ question: "Solve scheduling problem using Round Robin", year: 2023, marks: 10, repeated: 5 }],
    notes: ["FCFS: Non-preemptive, convoy effect", "SJF: Optimal avg waiting time", "RR: Time quantum based"],
  },
  {
    id: "os-u3", name: "Unit 3: Memory Management", weightage: 25,
    topics: [
      { id: "os-u3-t1", name: "Paging & Segmentation", important: true },
      { id: "os-u3-t2", name: "Virtual Memory", important: true },
      { id: "os-u3-t3", name: "Page Replacement Algorithms", important: true },
      { id: "os-u3-t4", name: "Thrashing", important: false },
    ],
    pyqs: [{ question: "Solve page replacement using LRU", year: 2023, marks: 10, repeated: 4 }],
    notes: ["Paging: Fixed-size blocks", "Page Replacement: FIFO, LRU, Optimal", "Thrashing: Excessive paging"],
  },
  {
    id: "os-u4", name: "Unit 4: Deadlocks & File Systems", weightage: 25,
    topics: [
      { id: "os-u4-t1", name: "Deadlock Conditions & Prevention", important: true },
      { id: "os-u4-t2", name: "Banker's Algorithm", important: true },
      { id: "os-u4-t3", name: "File System Structure", important: false },
      { id: "os-u4-t4", name: "Disk Scheduling", important: true },
    ],
    pyqs: [{ question: "Apply Banker's algorithm to check safe state", year: 2023, marks: 10, repeated: 5 }],
    notes: ["Deadlock conditions: Mutual exclusion, Hold & Wait, No Preemption, Circular Wait"],
  },
];

const cnUnits: Unit[] = [
  {
    id: "cn-u1", name: "Unit 1: Network Fundamentals", weightage: 20,
    topics: [
      { id: "cn-u1-t1", name: "OSI & TCP/IP Models", important: true },
      { id: "cn-u1-t2", name: "Network Topologies", important: false },
      { id: "cn-u1-t3", name: "Transmission Media", important: false },
      { id: "cn-u1-t4", name: "Switching Techniques", important: true },
    ],
    pyqs: [{ question: "Compare OSI and TCP/IP models", year: 2023, marks: 10, repeated: 4 }],
    notes: ["OSI: 7 layers", "TCP/IP: 4 layers"],
  },
  {
    id: "cn-u2", name: "Unit 2: Data Link Layer", weightage: 25,
    topics: [
      { id: "cn-u2-t1", name: "Error Detection & Correction", important: true },
      { id: "cn-u2-t2", name: "Flow Control Protocols", important: true },
      { id: "cn-u2-t3", name: "MAC Protocols", important: true },
      { id: "cn-u2-t4", name: "Ethernet & LAN", important: false },
    ],
    pyqs: [{ question: "Explain sliding window protocol", year: 2023, marks: 10, repeated: 3 }],
    notes: ["Error Detection: Parity, Checksum, CRC", "Flow Control: Stop-and-Wait, Go-Back-N, Selective Repeat"],
  },
  {
    id: "cn-u3", name: "Unit 3: Network Layer", weightage: 30,
    topics: [
      { id: "cn-u3-t1", name: "IP Addressing & Subnetting", important: true },
      { id: "cn-u3-t2", name: "Routing Algorithms", important: true },
      { id: "cn-u3-t3", name: "IPv4 vs IPv6", important: false },
      { id: "cn-u3-t4", name: "ARP, RARP, ICMP", important: true },
    ],
    pyqs: [{ question: "Solve subnetting problem for given IP address", year: 2023, marks: 10, repeated: 5 }],
    notes: ["IP Classes: A, B, C", "Routing: Distance Vector (RIP), Link State (OSPF)"],
  },
  {
    id: "cn-u4", name: "Unit 4: Transport & Application Layer", weightage: 25,
    topics: [
      { id: "cn-u4-t1", name: "TCP vs UDP", important: true },
      { id: "cn-u4-t2", name: "TCP Congestion Control", important: true },
      { id: "cn-u4-t3", name: "DNS, HTTP, FTP", important: false },
      { id: "cn-u4-t4", name: "Socket Programming", important: false },
    ],
    pyqs: [{ question: "Explain TCP 3-way handshake", year: 2022, marks: 5, repeated: 4 }],
    notes: ["TCP: Connection-oriented, reliable", "UDP: Connectionless, fast"],
  },
];

const javaUnits: Unit[] = [
  {
    id: "java-u1", name: "Unit 1: OOP Fundamentals", weightage: 25,
    topics: [
      { id: "java-u1-t1", name: "Classes & Objects", important: true },
      { id: "java-u1-t2", name: "Constructors & Overloading", important: true },
      { id: "java-u1-t3", name: "Inheritance & Polymorphism", important: true },
      { id: "java-u1-t4", name: "Abstraction & Encapsulation", important: false },
    ],
    pyqs: [{ question: "Write a program demonstrating inheritance types", year: 2023, marks: 10, repeated: 3 }],
    notes: ["4 OOP pillars: Encapsulation, Inheritance, Polymorphism, Abstraction"],
  },
  {
    id: "java-u2", name: "Unit 2: Exception Handling & I/O", weightage: 20,
    topics: [
      { id: "java-u2-t1", name: "Try-Catch-Finally", important: true },
      { id: "java-u2-t2", name: "Custom Exceptions", important: false },
      { id: "java-u2-t3", name: "File I/O Streams", important: true },
      { id: "java-u2-t4", name: "Serialization", important: false },
    ],
    pyqs: [{ question: "Write a program with custom exception handling", year: 2023, marks: 10, repeated: 2 }],
    notes: ["Checked: compile-time", "Unchecked: runtime"],
  },
  {
    id: "java-u3", name: "Unit 3: Collections & Generics", weightage: 30,
    topics: [
      { id: "java-u3-t1", name: "List, Set, Map Interfaces", important: true },
      { id: "java-u3-t2", name: "ArrayList vs LinkedList", important: true },
      { id: "java-u3-t3", name: "HashMap & TreeMap", important: true },
      { id: "java-u3-t4", name: "Generics & Wildcards", important: false },
    ],
    pyqs: [{ question: "Compare ArrayList and LinkedList with code", year: 2023, marks: 10, repeated: 3 }],
    notes: ["Collection hierarchy: Collection → List, Set, Queue"],
  },
  {
    id: "java-u4", name: "Unit 4: Multithreading & JDBC", weightage: 25,
    topics: [
      { id: "java-u4-t1", name: "Thread Creation & Lifecycle", important: true },
      { id: "java-u4-t2", name: "Synchronization", important: true },
      { id: "java-u4-t3", name: "JDBC Basics", important: true },
      { id: "java-u4-t4", name: "Prepared Statements", important: false },
    ],
    pyqs: [{ question: "Write a multithreaded program using Runnable", year: 2023, marks: 10, repeated: 3 }],
    notes: ["Thread states: New, Runnable, Running, Blocked, Dead"],
  },
];

const daaUnits: Unit[] = [
  {
    id: "daa-u1", name: "Unit 1: Fundamentals & Divide-Conquer", weightage: 25,
    topics: [
      { id: "daa-u1-t1", name: "Asymptotic Notations", important: true },
      { id: "daa-u1-t2", name: "Recurrence Relations", important: true },
      { id: "daa-u1-t3", name: "Merge Sort & Quick Sort", important: true },
      { id: "daa-u1-t4", name: "Master Theorem", important: true },
    ],
    pyqs: [{ question: "Solve recurrence using Master theorem", year: 2023, marks: 10, repeated: 4 }],
    notes: ["Master Theorem: T(n) = aT(n/b) + f(n)"],
  },
  {
    id: "daa-u2", name: "Unit 2: Greedy & Dynamic Programming", weightage: 30,
    topics: [
      { id: "daa-u2-t1", name: "Greedy Strategy", important: true },
      { id: "daa-u2-t2", name: "Huffman Coding", important: true },
      { id: "daa-u2-t3", name: "0/1 Knapsack", important: true },
      { id: "daa-u2-t4", name: "LCS & Matrix Chain", important: true },
    ],
    pyqs: [{ question: "Solve 0/1 Knapsack using DP", year: 2023, marks: 10, repeated: 5 }],
    notes: ["Greedy: Local optimal → Global optimal", "DP: Overlapping subproblems + Optimal substructure"],
  },
  {
    id: "daa-u3", name: "Unit 3: Graph Algorithms", weightage: 25,
    topics: [
      { id: "daa-u3-t1", name: "BFS & DFS", important: true },
      { id: "daa-u3-t2", name: "MST (Prim's, Kruskal's)", important: true },
      { id: "daa-u3-t3", name: "Shortest Path (Dijkstra, Bellman-Ford)", important: true },
    ],
    pyqs: [{ question: "Find MST using Kruskal's algorithm", year: 2023, marks: 10, repeated: 4 }],
    notes: ["BFS: Queue", "DFS: Stack/recursion", "Dijkstra: No negative weights"],
  },
  {
    id: "daa-u4", name: "Unit 4: Backtracking & NP", weightage: 20,
    topics: [
      { id: "daa-u4-t1", name: "N-Queens Problem", important: true },
      { id: "daa-u4-t2", name: "NP-Complete & NP-Hard", important: true },
      { id: "daa-u4-t3", name: "Branch & Bound", important: false },
    ],
    pyqs: [{ question: "Solve 4-Queens problem using backtracking", year: 2023, marks: 10, repeated: 3 }],
    notes: ["Backtracking: Try → Check → Undo", "P ⊆ NP"],
  },
];

// ---------- semesters ----------
const semesters: Semester[] = [
  {
    number: 1,
    subjects: [
      sub("cse101", "Programming for Problem Solving using C", "CSE-101"),
      sub("bsm101", "Mathematics-I", "BSM-101"),
      sub("bsp101", "Physics", "BSP-101"),
      sub("hse101", "Communication Skills in English", "HSE-101"),
      sub("env101", "Basics of Environmental Science", "ENV-101"),
    ],
  },
  {
    number: 2,
    subjects: [
      sub("bsm102", "Mathematics-II", "BSM-102"),
      sub("hsv102", "Human Values & Soft Skills", "HSV-102"),
      sub("eee101", "Basics of Electrical & Electronics Engineering", "EEE-101"),
      sub("cse102", "Data Structures using C", "CSE-102"),
      sub("cse104", "Object Oriented Concepts & Python Programming", "CSE-104"),
    ],
  },
  {
    number: 3,
    subjects: [
      sub("digital-electronics", "Digital Electronics", "CSE-201"),
      sub("ads", "Advanced Data Structures", "CSE-203"),
      sub("dbms", "Database Management Systems with SQL", "CSE-205", dbmsUnits),
      sub("cpp", "Programming with C++", "CSE-207"),
      sub("intro-aiml", "Introduction to AI and ML", "CSE-209"),
      sub("calculus-ode", "Calculus & Ordinary Differential Equations", "BSM-201"),
    ],
  },
  {
    number: 4,
    subjects: [
      sub("os", "Operating System", "CSE-202", osUnits),
      sub("r-prog", "R-Programming", "CSE-204"),
      sub("java", "Programming in Java", "CSE-206", javaUnits),
      sub("mpmc", "Microprocessor & Microcontroller", "CSE-208"),
      sub("dm", "Discrete Mathematics", "BSM-202"),
      sub("coa", "Computer Organization & Architecture", "CSE-210"),
    ],
  },
  {
    number: 5,
    subjects: [
      sub("daa", "Design & Analysis of Algorithms", "CSE-301", daaUnits),
      sub("flat", "Formal Languages & Automata", "CSE-303"),
      sub("web-tech", "Web Technology", "CSE-305"),
      sub("cn", "Computer Networks", "CSE-307", cnUnits),
      sub("cloud", "Cloud Computing", "CSE-309"),
      sub("pt1", "Practical Training 1", "CSE-311"),
    ],
  },
  {
    number: 6,
    subjects: [
      sub("compiler", "Compiler Design", "CSE-302"),
      sub("adv-java", "Advanced Java Programming", "CSE-304"),
      sub("ml-apps", "Machine Learning and its Applications", "CSE-306"),
      sub("iot", "Internet of Things", "CSE-308"),
      sub("mad", "Mobile Application Development", "CSE-310"),
      sub("project1", "Project 1", "CSE-312"),
    ],
  },
  {
    number: 7,
    subjects: [
      sub("nn", "Neural Networks", "CSE-401"),
      sub("ob", "Organizational Behaviour", "HSE-401"),
      sub("aca", "Advanced Computer Architecture", "CSE-403"),
      sub("data-science", "Data Science", "CSE-405"),
      sub("project2", "Project 2", "CSE-407"),
    ],
  },
  {
    number: 8,
    subjects: [
      sub("project3", "Project 3", "CSE-402"),
      sub("mooc1", "MOOC - I", "CSE-404"),
      sub("mooc2", "MOOC - II", "CSE-406"),
    ],
  },
];

export const getAllSemesters = (): Semester[] => semesters.sort((a, b) => a.number - b.number);
export const getSemester = (num: number): Semester | undefined => semesters.find(s => s.number === num);
