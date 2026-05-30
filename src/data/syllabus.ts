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

// Split a comma-separated topics string without breaking inside parentheses
function splitTopics(s: string): string[] {
  const result: string[] = [];
  let current = '';
  let depth = 0;
  for (const ch of s) {
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    else if (ch === ',' && depth === 0) {
      const t = current.trim().replace(/\.$/, '');
      if (t) result.push(t);
      current = '';
      continue;
    }
    current += ch;
  }
  const last = current.trim().replace(/\.$/, '');
  if (last) result.push(last);
  return result;
}

// Convert BTECH_SYLLABUS unit data into the app's Unit[] format
function fromSyllabus(subId: string, btechUnits: { unit: number; title: string; topics: string }[]): Unit[] {
  return btechUnits.map(u => {
    const uid = `${subId}-u${u.unit}`;
    const topicList = splitTopics(u.topics);
    return {
      id: uid,
      name: `Unit ${u.unit}: ${u.title}`,
      weightage: Math.round(100 / btechUnits.length),
      topics: topicList.map((name, i) => ({
        id: `${uid}-t${i + 1}`,
        name,
        important: i === 0,
      })),
      pyqs: [],
      notes: [],
    };
  });
}

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

// ═══════════════════════════════════════════════════════════════════════
// COMPLETE B.Tech CSE SYLLABUS — Gurugram University 2023-24
// ═══════════════════════════════════════════════════════════════════════

export interface BTechUnit {
  unit: number;
  title: string;
  topics: string;
}

export interface BTechSubject {
  name: string;
  category: "BSC"|"ESC"|"HSMC"|"PCC"|"PEC"|"OEC"|"LC"|"MC"|"PROJECT"|"PT";
  credits: number;
  L: number; T: number; P: number;
  isElective?: boolean;
  electiveGroup?: string;
  units?: BTechUnit[];
  labContents?: string[];
}

export interface BTechSemester {
  semester: number;
  totalCredits: number;
  totalMarks: number;
  subjects: BTechSubject[];
  notes?: string[];
  electiveOptions?: { group: string; options: string[] }[];
}

export const BTECH_SYLLABUS: BTechSemester[] = [

  // ─── SEMESTER 1 ───────────────────────────────────────────
  {
    semester: 1, totalCredits: 19.5, totalMarks: 900,
    subjects: [
      { name: "Communication Skills in English", category: "HSMC", credits: 3, L:2, T:0, P:2 },
      { name: "Basics of Environmental Science", category: "MC", credits: 2, L:2, T:0, P:0 },
      { name: "Mathematics-I", category: "BSC", credits: 4, L:3, T:1, P:0 },
      { name: "Basic of Electrical and Electronics Engineering", category: "ESC", credits: 4, L:3, T:0, P:2 },
      { name: "Programming for Problem-Solving using C", category: "ESC", credits: 4, L:3, T:0, P:2 },
      { name: "Workshop Practices", category: "ESC", credits: 2.5, L:1, T:0, P:2 },
    ]
  },

  // ─── SEMESTER 2 ───────────────────────────────────────────
  {
    semester: 2, totalCredits: 22, totalMarks: 900,
    subjects: [
      { name: "Human Value & Soft Skills", category: "HSMC", credits: 3, L:2, T:0, P:2 },
      { name: "Mathematics-II", category: "BSC", credits: 4, L:3, T:1, P:0 },
      { name: "Physics", category: "BSC", credits: 5, L:3, T:1, P:2 },
      { name: "Data Structure Using C", category: "ESC", credits: 4, L:3, T:0, P:2 },
      { name: "Object-Oriented Concepts and Python Programming", category: "ESC", credits: 4, L:3, T:0, P:2 },
      { name: "Engineering Graphics (Web Design)", category: "ESC", credits: 2, L:1, T:0, P:2 },
    ]
  },

  // ─── SEMESTER 3 ───────────────────────────────────────────
  {
    semester: 3, totalCredits: 22, totalMarks: 1000,
    subjects: [
      {
        name: "Digital Electronics", category: "ESC", credits: 3, L:3, T:0, P:0,
        units: [
          { unit:1, title:"Fundamentals of Digital Systems and Logic Families",
            topics:"Digital signals, digital circuits, AND/OR/NOT/NAND/NOR/XOR operations, Boolean algebra, IC gates, number systems (binary, octal, hex), binary arithmetic, one's and two's complements, codes, error detecting and correcting codes." },
          { unit:2, title:"Combinational Digital Circuits",
            topics:"K-map simplification, minimization, Don't care conditions, Multiplexer, De-Multiplexer, Decoders, Adders, Subtractors, BCD arithmetic, carry look-ahead adder, serial adder, ALU, digital comparator, parity checker/generator, code converters, priority encoders, Q-M method." },
          { unit:3, title:"Sequential Circuits and Systems",
            topics:"Bistable latch, SR flip-flop, J-K flip-flop, T flip-flop, D flip-flop, applications of flip-flops, shift registers, serial-to-parallel/parallel-to-serial converter, ring counter, sequence generator, ripple counters, synchronous counters, counter design using flip-flops." },
          { unit:4, title:"A/D and D/A Converters",
            topics:"Weighted resistor D/A converter, R-2R Ladder D/A converter, D/A converter ICs, sample and hold circuit, parallel comparator A/D converter, successive approximation A/D converter, counting A/D converter, dual slope A/D converter." },
        ]
      },
      {
        name: "Advanced Data Structure", category: "PCC", credits: 3, L:3, T:0, P:0,
        units: [
          { unit:1, title:"Review of Linear Data Structures",
            topics:"Linked List (traverse, insert, delete), Circular List, Doubly List, Stack and Queue using linked list, Dictionaries, Hashing: Hash Function, Collision Resolution (Separate Chaining, Open Addressing, Linear Probing, Quadratic Probing, Double Hashing, Rehashing, Extendible Hashing)." },
          { unit:2, title:"Advanced Trees",
            topics:"Binary trees and BST review (traversal, insertion, deletion), AVL Trees (LL/RR/LR/RL rotations), Red-Black Trees, 2-3 Trees, B-Trees, B+ Trees, Splay Trees." },
          { unit:3, title:"Sets and Files",
            topics:"Representation and operations on Sets, File Concepts, File organization, Sequential File Organization, Direct File Organization, Indexed Sequential Organization." },
          { unit:4, title:"Graphs",
            topics:"Representation, Basic terminology, traversal, connected components, shortest path, topological sort, Dijkstra's Algorithm, Floyd Warshall's Algorithm, network flow problems." },
        ]
      },
      {
        name: "Database Management Systems with SQL", category: "PCC", credits: 3, L:3, T:0, P:0,
        units: [
          { unit:1, title:"Database System Architecture",
            topics:"Data Abstraction, Data Independence, DDL, DML, Entity-relationship model, network model, relational and object-oriented data models, integrity constraints, data manipulation operations." },
          { unit:2, title:"Relational Query Languages and Database Design",
            topics:"Relational algebra, Tuple and domain relational calculus, SQL3, DDL/DML, MySQL/Oracle/DB2/SQL Server, Domain and data dependency, Armstrong's axioms, Normal forms, Query processing and optimization, Join strategies." },
          { unit:3, title:"Transaction Processing and Storage",
            topics:"Concurrency control, ACID property, Serializability of scheduling, Locking and timestamp-based schedulers, Multi-version and optimistic Concurrency Control, Database recovery, Indices, B-trees, hashing." },
          { unit:4, title:"Database Security and Advanced Topics",
            topics:"Authentication, Authorization, DAC/MAC/RBAC models, Intrusion detection, SQL injection, Object-oriented and object-relational databases, Web databases, Distributed databases, Data warehousing and data mining." },
        ]
      },
      {
        name: "Programming with C++", category: "PCC", credits: 3, L:3, T:0, P:0,
        units: [
          { unit:1, title:"Object-Oriented Programming Concepts and Classes",
            topics:"OOP vs procedural paradigm, object, class, interface, abstraction, encapsulation, data hiding, inheritance, overloading, polymorphism, messaging, specifying a class, access specifiers, static members, friend functions, nested classes, abstract classes." },
          { unit:2, title:"Inheritance and Pointers",
            topics:"Defining derived classes, forms of inheritance, multiple inheritance ambiguity, virtual base class, object slicing, overriding, object composition, constructors/destructors order, pointer arithmetic, dynamic memory (new/delete), this pointer, dangling pointers, memory leaks." },
          { unit:3, title:"Constructors, Operator Overloading and Polymorphism",
            topics:"Copy constructor, dynamic constructors, explicit constructors, destructors, initializer lists, overloading operators, type conversion, early binding, late binding, virtual functions, pure virtual functions, virtual destructors." },
          { unit:4, title:"Exception Handling and Templates",
            topics:"Traditional error handling, exception handling mechanism, throw/catch/rethrow, specifying exceptions, function templates, class templates." },
        ]
      },
      {
        name: "Introduction to AI and ML", category: "PCC", credits: 3, L:3, T:0, P:0,
        units: [
          { unit:1, title:"Introduction to AI and Machine Learning",
            topics:"What is AI, Turing test, History of AI, AI Techniques, AI Applications (transportation, healthcare, education, finance), What is ML, History of ML, Types of ML: Supervised, Unsupervised, Semi-supervised, Reinforcement Learning." },
          { unit:2, title:"Intelligent and Multi-Agent Systems",
            topics:"Nature of Agents, Rationality, Task environment, Types of agents, Multi-Agent Systems, Agents vs Objects, Semantic Web, Agent Communication, Knowledge Sharing using Ontologies." },
          { unit:3, title:"Knowledge Representation and Uncertain Reasoning",
            topics:"Procedural vs declarative knowledge, Matching, Propositional logic, predicate logic, Resolution, Clause form, Bayesian probability, Belief network, Forward and backward reasoning, Fuzzy logic, Dempster-Shafer theory." },
          { unit:4, title:"Planning and Learning",
            topics:"Planning problem, state space search, partial order planning, planning graphs, Hierarchical and conditional planning, Types of Learning: Induction, Rote Learning, Identification Trees, Explanation Based Learning, Introduction to Neural Networks, Expert Systems." },
        ]
      },
      {
        name: "Calculus and Ordinary Differential Equations", category: "BSC", credits: 3, L:3, T:0, P:0,
        units: [
          { unit:1, title:"Multivariable Differential Calculus",
            topics:"Limit, Continuity, Partial derivatives, Homogeneous functions, Euler's Theorem, Total derivative, Maxima, Minima, Saddle points, Lagrange's method of undetermined multipliers." },
          { unit:2, title:"Multivariable Integral Calculus",
            topics:"Double integral, change of order of integration, change of variables, applications of double integral to find area, Triple integral." },
          { unit:3, title:"Ordinary Differential Equations of First Order",
            topics:"Linear and Bernoulli's equations, Exact differential equations, Equations reducible to exact, Applications to electric circuits, Newton's law of cooling, Heat flow, Orthogonal trajectories." },
          { unit:4, title:"Ordinary Differential Equations of Second and Higher Order",
            topics:"Linear differential equations of second and higher order, Complete solution, Complementary function, Particular integral, Method of variation of parameters, Cauchy's and Legendre's linear equations, Simultaneous linear differential equations, Applications to oscillatory electric circuits." },
        ]
      },
      {
        name: "Digital Electronics Lab", category: "LC", credits: 1, L:0, T:0, P:2,
        labContents: ["Logic Gates truth-table verification and realization", "Half Adder/Full Adder", "Half Subtractor/Full Subtractor", "4-Bit Binary-to-Gray & Gray-to-Binary Code Converter", "4-Bit and 8-Bit Comparator", "Multiplexer", "Demultiplexer", "Flip Flops (JK, T, D)", "Asynchronous Counter", "Synchronous Counter", "Shift Register operations", "DAC Operation", "ADC Operations"]
      },
      {
        name: "Advanced Data Structure Lab", category: "LC", credits: 1, L:0, T:0, P:2,
        labContents: ["1-D array operations", "Simple Linked List", "Circular Linked List", "Doubly Linked List", "Doubly Circular Linked List", "Stack using Array", "Stack using Linked List", "Queue using Array", "Queue using Linked List", "Dictionary techniques", "Hashing techniques", "Red-Black Trees", "Binary Search Trees", "Quick, Merge and Bubble sorting", "Recursive BFS and DFS", "Non-recursive BFS and DFS"]
      },
      {
        name: "Database Management Systems Lab", category: "LC", credits: 1, L:0, T:0, P:2,
        labContents: ["Database and table design (Bank/College)", "Constraints (Primary Key, Foreign Key, NOT NULL)", "ALTER, UPDATE, DELETE statements", "SQL Joins", "Aggregate functions: MAX/MIN/AVG/COUNT", "Integrity constraints", "Views", "Triggers", "PL/SQL blocks", "PL/SQL with user input", "User roles and permissions", "Mini projects (Hospital/Railway/Hotel Management)"]
      },
      {
        name: "Programming with C++ Lab", category: "LC", credits: 1, L:0, T:0, P:2,
        labContents: ["Member functions defined inside/outside a class", "Static and const data members", "Zero argument and parameterized constructors", "Dynamic constructor", "Explicit constructor", "Initializer list", "Increment/decrement operator overloading", "Binary arithmetic operator overloading", "Memory management operator overloading", "Multilevel inheritance", "Multiple inheritance", "Virtual derivation", "Runtime polymorphism", "Exception handling", "Function template", "Class template"]
      },
      { name: "Constitution of India", category: "MC", credits: 0, L:2, T:0, P:0,
        units: [
          { unit:1, title:"Philosophy of Indian Constitution", topics:"Salient features, Preamble, Nature of Indian Constitution, Amendment procedure." },
          { unit:2, title:"Federal Structure", topics:"Distribution of legislative and financial powers between Union and States." },
          { unit:3, title:"Organs of Governance", topics:"President – Qualifications and Powers, Governor, Parliament: Composition/Qualifications/Disqualifications, Judiciary: Appointment/Tenure/Removal." },
          { unit:4, title:"Fundamental Rights", topics:"Rights to equality, freedom, against exploitation, freedom of religion, Cultural and Education rights, Fundamental duties." },
        ]
      },
    ]
  },

  // ─── SEMESTER 4 ───────────────────────────────────────────
  {
    semester: 4, totalCredits: 22, totalMarks: 1000,
    notes: ["After 4th semester: 4-6 weeks Practical Training in Industry/Institute required"],
    subjects: [
      {
        name: "Operating System", category: "PCC", credits: 3, L:3, T:0, P:0,
        units: [
          { unit:1, title:"Introduction, Processes and Scheduling",
            topics:"OS Concepts, Generations, Types, Services, Process states, PCB, Context switching, Threads, Multithreading, Scheduling algorithms: FCFS, SJF, SRTF, Round Robin." },
          { unit:2, title:"Inter-process Communication and Deadlocks",
            topics:"Critical Section, Race Conditions, Mutual Exclusion, Producer-Consumer Problem, Semaphores, Monitors, Message Passing, Reader-Writer Problem, Dining Philosopher Problem, Deadlock Prevention/Avoidance: Banker's Algorithm, Detection and Recovery." },
          { unit:3, title:"Memory Management and Virtual Memory",
            topics:"Logical and Physical address map, Contiguous memory allocation, Fixed/variable partition, Paging, Virtual Memory, Demand paging, Page Replacement: Optimal, FIFO, LRU." },
          { unit:4, title:"File and Disk Management",
            topics:"File concepts, access methods, directory structure, file system structure, allocation methods (contiguous, linked, indexed), Disk scheduling: FCFS, SSTF, SCAN, C-SCAN, Case study: UNIX and WINDOWS." },
        ]
      },
      {
        name: "R-Programming", category: "PCC", credits: 3, L:3, T:0, P:0,
        units: [
          { unit:1, title:"Introduction to R and Data Types",
            topics:"What is R, RStudio, Handling Packages (install.packages, library), Input/Output, R Data Types: Vectors, Lists, Matrices, Arrays, Factors, Data Frame, Variable assignment." },
          { unit:2, title:"Operators, Control Flow and Functions",
            topics:"Arithmetic/Relational/Logical operators, if/else/switch, repeat/while/for loops, break/next, function definition, built-in functions: mean/paste/sum/min/max/seq, user-defined functions." },
          { unit:3, title:"Strings, Vectors, Lists, Matrices and Data Frames",
            topics:"String manipulation: substr/strsplit/paste/grep/toupper, Vector operations, List operations, Matrix computations, Arrays, Factors with gl(), Data Frames: create/access/expand/merge, melt and cast." },
          { unit:4, title:"Data Loading and Visualization",
            topics:"getwd/setwd, CSV files (read/analyze/write), Excel files, Data Visualization: bar charts, histogram, frequency polygon, density plots, scatter plots, box plots, heat/contour plots, ggplot2." },
        ]
      },
      {
        name: "Programming in Java", category: "PCC", credits: 3, L:3, T:0, P:0,
        units: [
          { unit:1, title:"Introduction to Java",
            topics:"Evolution of Java, OOP structure, JVM/JRE/JDK, JAR format, Naming Conventions, Data types, Type casting, Operators, Security Promises, Sandbox model." },
          { unit:2, title:"OOP Implementation and Inheritance",
            topics:"Classes, Objects, Encapsulation, Constructors, Method Overloading, Static members, Inheritance, super keyword, Method Overriding, Runtime Polymorphism, Abstract classes, Interfaces, Aggregation, Composition, Inner classes, String Buffer, Applets." },
          { unit:3, title:"Threads, Swing, AWT and Exception Handling",
            topics:"Creating Threads, Thread Priority, Synchronization, wait/notify, Swing hierarchy, AWT Components, Layout Managers (Border/Flow/Grid/Card/GridBag), AWT Events, Listeners, Packages and Scopes, Exception Handling: try/catch/throw/finally, User-defined Exceptions." },
          { unit:4, title:"Collections, JDBC and Reflection",
            topics:"Collection Framework: List/Set/Map, Iterator, Generics, Comparable/Comparator, JDBC: Types of drivers, CRUD operations, Prepared Statement, Callable Statement, Batch Updation, ResultSetMetaData, I/O Streams, Reflection API." },
        ]
      },
      {
        name: "Microprocessor and Microcontroller", category: "PCC", credits: 3, L:3, T:0, P:0,
        units: [
          { unit:1, title:"The 8086 Microprocessor",
            topics:"8086 architecture, Addressing modes, Instruction set, Assembly language programming, Modular Programming, Linking and Relocation, Stacks, Procedures, Macros, Interrupts, Byte and String Manipulation." },
          { unit:2, title:"8086 System Bus Structure",
            topics:"8086 signals, Basic configurations, System bus timing, System design using 8086, I/O programming, Multiprogramming, Multiprocessor configurations, Coprocessor, Closely/Loosely Coupled configurations, Advanced processors." },
          { unit:3, title:"I/O Interfacing",
            topics:"Memory and I/O interfacing, Parallel communication interface, Serial communication interface, D/A and A/D Interface, Timer, Keyboard/display controller, Interrupt controller, DMA controller, Case studies: Traffic Light, LED/LCD display, Keyboard interface, Alarm Controller." },
          { unit:4, title:"Microcontroller 8051",
            topics:"Architecture of 8051, Special Function Registers, I/O Ports, Instruction set, Addressing modes, Assembly language programming, Timer programming, Serial Port Programming, Interrupts, LCD/Keyboard Interfacing, ADC/DAC/Sensor Interfacing, Stepper Motor." },
        ]
      },
      {
        name: "Discrete Mathematics", category: "BSC", credits: 3, L:3, T:0, P:0,
      },
      {
        name: "Computer Organization & Architecture", category: "PCC", credits: 3, L:3, T:0, P:0,
        units: [
          { unit:1, title:"Data Representation and Register Transfer",
            topics:"Data Types, Complements, Fixed-Point and Floating-Point Representation, Gray codes, Error Detection Codes, Register Transfer Language, Bus and Memory Transfers, Arithmetic/Logic/Shift Microoperations." },
          { unit:2, title:"Basic Computer Organization and CPU",
            topics:"Instruction Codes, Computer Registers, Instructions, Timing and Control, Instruction Cycle, General Register Organization, Stack organization, Instruction Format, Addressing Modes, RISC, CISC." },
          { unit:3, title:"Pipelining and Parallel Processors",
            topics:"Parallel Processing, Amdahl's law, Pipelining, Arithmetic Pipeline, Instruction Pipeline, Pipeline Hazards, RISC Pipeline, Cache Coherency, Vector Processing, Array Processors, SIMD." },
          { unit:4, title:"I/O Organization and Memory",
            topics:"I/O device interface, Program controlled/Interrupt-driven/DMA transfers, Memory Hierarchy, Main/Auxiliary/Cache/Virtual Memory, Associative Mapping, Direct Mapping, Set-Associative Mapping." },
        ]
      },
      {
        name: "Operating System Lab", category: "LC", credits: 1, L:0, T:0, P:2,
        labContents: ["UNIX File System introduction", "File and Directory commands in UNIX", "Essential UNIX commands", "I/O Redirection and Piping", "VI Editor", "Processes in UNIX", "Communication in UNIX and AWK", "Shell Scripting introduction", "Decision and Iterative statements in Shell", "Shell scripts for various problems"]
      },
      {
        name: "Programming in Java Lab", category: "LC", credits: 1, L:0, T:0, P:2,
        labContents: ["Stack and Queue in Java", "Dynamic polymorphism and interfaces", "Multithreaded producer-consumer", "Custom exceptions with 5 keywords", "File content to uppercase", "Analog clock using applet", "Scientific calculator using Swings", "MS-Word like editor using Swings", "Cookies in Servlets", "Java Bean with bound and constrained properties"]
      },
      {
        name: "Microprocessor and Microcontroller Lab", category: "LC", credits: 1, L:0, T:0, P:2,
        labContents: ["8085: 8-bit addition (with and without carry)", "8085: 8-bit and 16-bit subtraction", "8085: Multiplication by repeated addition", "8085: Multiplication by bit rotation", "8086: Square root of a number", "8086: Copying 12 bytes of data", "8086: Largest/Smallest from array", "8086: Descending order sort", "8086: Ascending order sort", "8-Bit seven-segment display interface", "Stepper motor control with 8085/8086", "LCD/LED/7-segment interfacing with 8051", "Motor interfacing (stepper, DC, servo)", "Temperature and pressure measurement", "Graphical LCD interface with 89C51"]
      },
      {
        name: "R-Programming Lab", category: "LC", credits: 1, L:0, T:0, P:2,
        labContents: ["Install R and basic packages", "Basics: data types, variables, operators", "R Loops", "Functions in R", "Data frames, cbind/rbind", "String manipulation functions", "Vectors, Lists, Data Frames", "Read CSV and analyze data", "Pie charts and bar charts", "Statistical analysis on dataset"]
      },
    ]
  },

  // ─── SEMESTER 5 ───────────────────────────────────────────
  {
    semester: 5, totalCredits: 21, totalMarks: 900,
    notes: ["Evaluation of Practical Training-I based on seminar, viva voce, and report"],
    electiveOptions: [
      { group: "PEC-I", options: ["Software Engineering", "Digital Image Processing", "Distributed System", "Statistical Computing", "Big Data Analytics"] }
    ],
    subjects: [
      {
        name: "Design and Analysis of Algorithm", category: "PCC", credits: 3, L:3, T:0, P:0,
        units: [
          { unit:1, title:"Introduction and Divide & Conquer",
            topics:"Algorithm, Time and Space complexity, Asymptotic Notation (Big O, Omega, Theta), Elementary Data Structures, Sets, Disjoint Set Union, Divide and Conquer: Binary Search, Merge Sort, Quick Sort, Strassen's Matrix Multiplication." },
          { unit:2, title:"Greedy Method and Dynamic Programming",
            topics:"Greedy: Fractional Knapsack, Job Sequencing, Minimum Cost Spanning Trees, Single source shortest paths. Dynamic Programming: Optimal BST, 0/1 Knapsack, Traveling Salesperson." },
          { unit:3, title:"Back Tracking and Branch & Bound",
            topics:"Backtracking: 8-Queen's problem, Sum of subsets, Graph Colouring, Hamiltonian Cycles. Branch and Bound: 0/1 Knapsack, Traveling Salesperson, Efficiency considerations." },
          { unit:4, title:"NP Hard and NP Complete Problems",
            topics:"Basic concepts, Cook's theorem, NP Hard graph problems, NP Hard scheduling problems, NP Hard code generation problems, Simplified NP Hard problems." },
        ]
      },
      {
        name: "Formal Languages & Automata Theory", category: "PCC", credits: 3, L:3, T:0, P:0,
        units: [
          { unit:1, title:"Finite Automata",
            topics:"DFA, NDFA, Equivalence of DFA and NDFA, NFA to DFA conversion, Minimization of finite automata, Finite automata with ε-moves, Mealy and Moore Machines." },
          { unit:2, title:"Regular Expressions",
            topics:"Arden's Method, Regular Expressions, Regular expression to Finite Automata conversion, Properties of regular languages, Pumping lemma." },
          { unit:3, title:"Grammars and Push Down Automata",
            topics:"Chomsky hierarchy, Context-free grammar, Parse trees, Ambiguity removal, Reduced Forms, CNF and GNF, Deterministic and Non-Deterministic PDA, PDA and equivalence with CFG." },
          { unit:4, title:"Turing Machines and Undecidability",
            topics:"Deterministic and Non-Deterministic Turing machines, Design of Turing Machines, Variants, Halting problem, PCP Problem, Linear Bounded Automata, Church-Turing thesis, Rice's theorem, Undecidable problems." },
        ]
      },
      {
        name: "Web Technology", category: "PCC", credits: 3, L:3, T:0, P:0,
        units: [
          { unit:1, title:"HTML and CSS",
            topics:"HTML document structure, page markup, links, lists, images, tables, frames, CSS: internal and external style sheets, page and site design." },
          { unit:2, title:"PHP and Server-side Programming",
            topics:"Declaring variables, data types, arrays, strings, operations, control structures, functions, reading data from web forms (text boxes, radio buttons), server-side processing." },
          { unit:3, title:"Advanced Web Technologies",
            topics:"JavaScript, AJAX, XML, JSON, Web Services, RESTful APIs." },
          { unit:4, title:"Frameworks and Web Security",
            topics:"MVC frameworks, web application architecture, authentication, authorization, session management, web security fundamentals." },
        ]
      },
      {
        name: "Computer Networks", category: "PCC", credits: 3, L:3, T:0, P:0,
        units: [
          { unit:1, title:"Introduction and Physical Layer",
            topics:"Data communication, Components, Data Representation, Simplex/Half Duplex/Full Duplex, Modulation, Multiplexing, Network topologies, Packet and circuit switching, OSI model, TCP/IP Model, Physical Layer, Ethernet." },
          { unit:2, title:"Data Link Layer and Medium Access",
            topics:"MAC Addressing, Framing, Stop and Wait, Go-Back-N ARQ, Selective Repeat ARQ, Sliding Window Protocol." },
          { unit:3, title:"Network Layer and Routing",
            topics:"IP addressing, IPv4/IPv6, Subnetting, Routing algorithms (Dijkstra, Bellman-Ford), RIP, OSPF, BGP." },
          { unit:4, title:"Transport and Application Layer",
            topics:"TCP, UDP, Flow control, Congestion control, DNS, HTTP, HTTPS, FTP, SMTP, Application layer protocols." },
        ]
      },
      { name: "Professional Elective Course-I", category: "PEC", credits: 3, L:3, T:0, P:0, isElective: true, electiveGroup: "PEC-I" },
      { name: "Open Elective Course-I", category: "OEC", credits: 3, L:3, T:0, P:0, isElective: true, electiveGroup: "OEC-I" },
      { name: "Design and Analysis of Algorithm Lab", category: "LC", credits: 1, L:0, T:0, P:2 },
      { name: "Web Technology Lab", category: "LC", credits: 1, L:0, T:0, P:2 },
      { name: "Computer Networks Lab", category: "LC", credits: 1, L:0, T:0, P:2 },
      { name: "Economics for Engineers", category: "HSMC", credits: 3, L:3, T:0, P:0,
        units: [
          { unit:1, title:"Introduction to Economics",
            topics:"Definitions, Micro and Macro Economics, Production Possibility Curve, Demand: Law of Demand, Elasticity of Demand." },
          { unit:2, title:"Production and Cost",
            topics:"Factors of production, Law of variable proportions, Returns to scale, Economies of scale, Fixed/Variable/Marginal cost." },
          { unit:3, title:"Market Structures", topics:"Perfect Competition, Monopoly, Monopolistic Competition, Oligopoly, Pricing." },
          { unit:4, title:"National Income and Engineering Economics", topics:"GDP, GNP, National Income, Economic growth, Engineering project economics, Break-even analysis." },
        ]
      },
      { name: "Practical Training-I", category: "PT", credits: 1, L:0, T:0, P:2 },
    ]
  },

  // ─── SEMESTER 6 ───────────────────────────────────────────
  {
    semester: 6, totalCredits: 22, totalMarks: 900,
    electiveOptions: [
      { group: "PEC-II", options: ["Software Testing", "Computer Graphics", "Information Retrieval", "Internet of Things", "Soft Computing"] },
      { group: "PEC-III", options: ["Network Security and Cryptography", "Internet Technologies", "Mobile Applications Development", "Advance Database Management System", "Cloud Computing"] }
    ],
    subjects: [
      {
        name: "Compiler Design", category: "PCC", credits: 3, L:3, T:0, P:0,
        units: [
          { unit:1, title:"Lexical Analysis",
            topics:"Language Processors, Structure of compiler, Compiler Construction Tools, Lexical analyzer role, Input Buffering, Specification and recognition of tokens, Regular expressions, Finite automata, DFA minimization." },
          { unit:2, title:"Syntax Analysis",
            topics:"Role of parsers, Context-free grammars, Shift-reduce parsing, Operator precedence parsing, Top-down parsing, LL(1) parsers, LR parsers, SLR/LALR parsers." },
          { unit:3, title:"Semantic Analysis and Intermediate Code",
            topics:"Semantic analysis, Syntax-directed definitions, Type checking, Intermediate code generation: three-address code, quadruples, triples." },
          { unit:4, title:"Code Optimization and Generation",
            topics:"Code optimization techniques, Basic blocks, DAG representation, Code generation, Register allocation, Peephole optimization." },
        ]
      },
      {
        name: "Advance Java Programming", category: "PCC", credits: 3, L:3, T:0, P:0,
        units: [
          { unit:1, title:"Servlets",
            topics:"Servlet introduction, web terminology, Servlet API, Servlet Interface, Generic Servlet, Http Servlet, Servlet lifecycle, IDE setup, Servlet request, collaboration, configuration, context, attribute, session technique, event and listener, filter, CRUD, SSI." },
          { unit:2, title:"JSP",
            topics:"JSP Lifecycle, JSPAPI, scripting elements, 9 Implicit Objects, directive elements, Exceptions, action elements, expression language, MVC in JSP, JSTL, custom tags, pagination, CRUD." },
          { unit:3, title:"Hibernate and Spring",
            topics:"ORM concepts, Hibernate architecture, configuration, Session factory, CRUD with Hibernate, HQL, Spring IoC, Dependency Injection, Spring MVC." },
          { unit:4, title:"Web Services and Microservices",
            topics:"RESTful Web Services, JAX-RS, JSON/XML, Microservices architecture, Spring Boot, API design." },
        ]
      },
      {
        name: "Machine Learning and its Applications", category: "PCC", credits: 3, L:3, T:0, P:0,
        units: [
          { unit:1, title:"Introduction to Machine Learning",
            topics:"Definition, History, Need, Supervised/Unsupervised/Reinforcement Learning, ML life cycle, Parametric vs non-parametric models, Bias/variance tradeoff, Underfitting/Overfitting, Cross-validation, Grid Search." },
          { unit:2, title:"Dimensionality Reduction and Supervised Learning",
            topics:"Dimensionality reduction, PCA, LDA, Feature selection, Linear Regression, Logistic Regression, Decision Trees, Random Forest, SVM, k-NN." },
          { unit:3, title:"Unsupervised Learning",
            topics:"Clustering: k-Means, Hierarchical clustering, DBSCAN, Association rule mining: Apriori, FP-Growth." },
          { unit:4, title:"Neural Networks and Applications",
            topics:"Perceptron, Multi-layer perceptron, Backpropagation, CNNs, RNNs, Applications: image recognition, NLP, recommendation systems." },
        ]
      },
      { name: "Professional Elective Course-II", category: "PEC", credits: 3, L:3, T:0, P:0, isElective: true, electiveGroup: "PEC-II" },
      { name: "Professional Elective Course-III", category: "PEC", credits: 3, L:3, T:0, P:0, isElective: true, electiveGroup: "PEC-III" },
      { name: "Open Elective Course-II", category: "OEC", credits: 3, L:3, T:0, P:0, isElective: true, electiveGroup: "OEC-II" },
      { name: "Advance Java Programming Lab", category: "LC", credits: 1, L:0, T:0, P:2 },
      { name: "Machine Learning and its Applications Lab", category: "LC", credits: 1, L:0, T:0, P:2 },
      { name: "Project-I", category: "PROJECT", credits: 2, L:0, T:0, P:4 },
    ]
  },

  // ─── SEMESTER 7 ───────────────────────────────────────────
  {
    semester: 7, totalCredits: 20, totalMarks: 800,
    electiveOptions: [
      { group: "PEC-IV", options: ["Cyber Security Threats", "Advanced Computer Architecture", "Predictive Analytics", "Information Hiding Techniques", "Data Science"] }
    ],
    subjects: [
      {
        name: "Neural Networks", category: "PCC", credits: 3, L:3, T:0, P:0,
        units: [
          { unit:1, title:"Introduction to Neural Networks", topics:"Biological neuron, Perceptron, Activation functions, Single layer and Multi-layer networks, Backpropagation algorithm." },
          { unit:2, title:"Deep Learning Architectures", topics:"CNNs, Pooling, RNNs, LSTM, GRU, Autoencoders." },
          { unit:3, title:"Training and Optimization", topics:"Gradient descent variants, Regularization, Dropout, Batch normalization, Hyperparameter tuning." },
          { unit:4, title:"Applications", topics:"Image classification, Object detection, NLP, Speech recognition, Generative models: GAN, VAE." },
        ]
      },
      { name: "Professional Elective Course-IV", category: "PEC", credits: 3, L:3, T:0, P:0, isElective: true, electiveGroup: "PEC-IV" },
      { name: "Open Elective Course-III", category: "OEC", credits: 3, L:3, T:0, P:0, isElective: true, electiveGroup: "OEC-III" },
      { name: "Open Elective Course-IV", category: "OEC", credits: 3, L:3, T:0, P:0, isElective: true, electiveGroup: "OEC-IV" },
      {
        name: "Organizational Behaviour", category: "HSMC", credits: 3, L:3, T:0, P:0,
        units: [
          { unit:1, title:"Introduction to OB", topics:"Concept, scope, importance, relationship with other disciplines, Individual behaviour, Personality, Perception." },
          { unit:2, title:"Group Dynamics", topics:"Group formation, Group norms, Teamwork, Leadership styles, Motivation theories: Maslow, Herzberg, McGregor." },
          { unit:3, title:"Organizational Structure", topics:"Organizational design, Culture, Power and Politics, Conflict management, Communication." },
          { unit:4, title:"Change and Development", topics:"Organizational change, resistance to change, OD interventions, Stress management." },
        ]
      },
      { name: "Neural Networks Lab", category: "LC", credits: 1, L:0, T:0, P:2 },
      { name: "Project-II", category: "PROJECT", credits: 4, L:0, T:0, P:8 },
      { name: "Practical Training-II", category: "PT", credits: 1, L:0, T:0, P:2 },
    ]
  },

  // ─── SEMESTER 8 ───────────────────────────────────────────
  {
    semester: 8, totalCredits: 14, totalMarks: 500,
    notes: ["Submit MOOCs certificate at end of 8th semester"],
    subjects: [
      { name: "MOOCs - Essential I", category: "ESC", credits: 3, L:3, T:0, P:0 },
      { name: "MOOCs - Essential II", category: "ESC", credits: 3, L:3, T:0, P:0 },
      { name: "Project-III / Industrial Training", category: "PROJECT", credits: 8, L:0, T:0, P:16 },
    ]
  },
];


// ─── BTECH SYLLABUS HELPER FUNCTIONS ──────────────────────

export function getSemesterData(semesterNumber: number): BTechSemester | undefined {
  return BTECH_SYLLABUS.find(s => s.semester === semesterNumber);
}

export function getSubject(semesterNumber: number, subjectName: string): BTechSubject | undefined {
  const sem = getSemesterData(semesterNumber);
  return sem?.subjects.find(s => s.name.toLowerCase().includes(subjectName.toLowerCase()));
}

export function searchSyllabus(query: string): { semester: number; subject: BTechSubject; matchedUnits: BTechUnit[] }[] {
  const results: { semester: number; subject: BTechSubject; matchedUnits: BTechUnit[] }[] = [];
  for (const sem of BTECH_SYLLABUS) {
    for (const subject of sem.subjects) {
      const matchedUnits = (subject.units || []).filter(u =>
        u.topics.toLowerCase().includes(query.toLowerCase()) ||
        u.title.toLowerCase().includes(query.toLowerCase())
      );
      if (
        subject.name.toLowerCase().includes(query.toLowerCase()) ||
        matchedUnits.length > 0
      ) {
        results.push({ semester: sem.semester, subject, matchedUnits });
      }
    }
  }
  return results;
}

// ─── ENRICH EXISTING SEMESTERS WITH REAL SYLLABUS DATA ────
// Maps existing placeholder subjects to BTECH_SYLLABUS unit/topic data
(function enrichSemesters() {
  // subjectId → [BTECH_SYLLABUS semester number, subject name to match]
  const mapping: Record<string, [number, string]> = {
    // Semester 3
    "digital-electronics": [3, "Digital Electronics"],
    "ads": [3, "Advanced Data Structure"],
    "cpp": [3, "Programming with C++"],
    "intro-aiml": [3, "Introduction to AI and ML"],
    "calculus-ode": [3, "Calculus and Ordinary Differential Equations"],
    // Semester 4
    "r-prog": [4, "R-Programming"],
    "mpmc": [4, "Microprocessor and Microcontroller"],
    "coa": [4, "Computer Organization"],
    // Semester 5
    "flat": [5, "Formal Languages"],
    "web-tech": [5, "Web Technology"],
    // Semester 6
    "compiler": [6, "Compiler Design"],
    "adv-java": [6, "Advance Java Programming"],
    "ml-apps": [6, "Machine Learning"],
    // Semester 7
    "nn": [7, "Neural Networks"],
    "ob": [7, "Organizational Behaviour"],
  };

  for (const sem of semesters) {
    for (const subject of sem.subjects) {
      const match = mapping[subject.id];
      if (!match) continue;
      const btechSem = BTECH_SYLLABUS.find(s => s.semester === match[0]);
      const btechSub = btechSem?.subjects.find(s =>
        s.name.toLowerCase().includes(match[1].toLowerCase())
      );
      if (btechSub?.units) {
        subject.units = fromSyllabus(subject.id, btechSub.units);
      }
    }
  }
})();
