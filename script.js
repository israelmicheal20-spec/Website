
let students = [];

// DOM Elements
const studentForm = document.getElementById('studentForm');
const tableBody = document.getElementById('tableBody');
const noDataMsg = document.getElementById('noDataMsg');
const statsDisplay = document.getElementById('statsDisplay');
const liveClock = document.getElementById('liveClock');
const bannerMessage = document.getElementById('bannerMessage');

// ==================== LIVE CLOCK (Timer Feature) ====================
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    liveClock.textContent = ` ${hours}:${minutes}:${seconds}`;
}

// Update clock every second
setInterval(updateClock, 1000);
updateClock(); // Initial call

// ==================== ANIMATED BANNER (Timer Feature) ====================
const bannerMessages = [
    " Welcome to Academic Dashboard",
    " Track your student performance",
    " Top performers highlighted",
    "Real-time statistics",
    " Enter student marks below"
];

let messageIndex = 0;
setInterval(() => {
    messageIndex = (messageIndex + 1) % bannerMessages.length;
    bannerMessage.textContent = bannerMessages[messageIndex];
}, 3000);

// ==================== VALIDATION FUNCTIONS ====================
function validateName(name) {
    const nameError = document.getElementById('nameError');
    if (!name || name.trim() === '') {
        nameError.textContent = 'Full name is required';
        return false;
    }
    nameError.textContent = '';
    return true;
}

function validateRegNo(regNo) {
    const regError = document.getElementById('regError');
    if (!regNo || regNo.trim() === '') {
        regError.textContent = 'Registration number is required';
        return false;
    }
    regError.textContent = '';
    return true;
}

function validateCatMarks(cat) {
    const catError = document.getElementById('catError');
    const catValue = parseFloat(cat);
    
    if (isNaN(catValue)) {
        catError.textContent = 'CAT marks must be a number';
        return false;
    }
    
    if (catValue < 0 || catValue > 30) {
        catError.textContent = 'CAT marks must be between 0 and 30';
        return false;
    }
    
    catError.textContent = '';
    return true;
}

function validateExamMarks(exam) {
    const examError = document.getElementById('examError');
    const examValue = parseFloat(exam);
    
    if (isNaN(examValue)) {
        examError.textContent = 'Exam marks must be a number';
        return false;
    }
    
    if (examValue < 0 || examValue > 70) {
        examError.textContent = 'Exam marks must be between 0 and 70';
        return false;
    }
    
    examError.textContent = '';
    return true;
}

// ==================== GRADE CALCULATION ====================
function calculateGrade(total) {
    if (total >= 70 && total <= 100) return 'A';
    if (total >= 60 && total < 70) return 'B';
    if (total >= 50 && total < 60) return 'C';
    if (total >= 40 && total < 50) return 'D';
    return 'Fail';
}

// ==================== ADD STUDENT ====================
function addStudent(event) {
    event.preventDefault(); // Prevent form reload
    
    // Get form values
    const name = document.getElementById('fullName').value;
    const regNo = document.getElementById('regNo').value;
    const cat = document.getElementById('catMarks').value;
    const exam = document.getElementById('examMarks').value;
    
    // Validate all fields
    const isValidName = validateName(name);
    const isValidReg = validateRegNo(regNo);
    const isValidCat = validateCatMarks(cat);
    const isValidExam = validateExamMarks(exam);
    
    if (isValidName && isValidReg && isValidCat && isValidExam) {
        // Calculate total and grade
        const total = parseFloat(cat) + parseFloat(exam);
        const grade = calculateGrade(total);
        
        // Create student object
        const student = {
            name: name.trim(),
            regNo: regNo.trim(),
            cat: parseFloat(cat),
            exam: parseFloat(exam),
            total: total,
            grade: grade
        };
        
        // Add to array
        students.push(student);
        
        // Clear form
        studentForm.reset();
        
        // Update display
        updateResultsTable();
        updateStats();
        
        // Show success (optional)
        console.log('Student added:', student);
    }
}

// ==================== UPDATE RESULTS TABLE ====================
function updateResultsTable() {
    // Clear table body
    tableBody.innerHTML = '';
    
    if (students.length === 0) {
        noDataMsg.style.display = 'block';
        return;
    }
    
    noDataMsg.style.display = 'none';
    
    // Loop through students and create rows
    students.forEach((student, index) => {
        const row = document.createElement('tr');
        
        // Check if this is top student (for highlighting)
        const isTopStudent = isTopPerformer(index);
        if (isTopStudent) {
            row.classList.add('top-student');
        }
        
        // Create cells
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.regNo}</td>
            <td>${student.total.toFixed(1)}</td>
            <td><strong>${student.grade}</strong></td>
            <td>
                <button class="delete-btn" onclick="deleteStudent(${index})">Delete</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// ==================== DASHBOARD FEATURES ====================

// Feature 1: Sort by Total Marks
document.getElementById('sortBtn').addEventListener('click', () => {
    // Create copy and sort
    const sortedStudents = [...students].sort((a, b) => b.total - a.total);
    students = sortedStudents;
    updateResultsTable();
    statsDisplay.innerHTML = ' Students sorted by total marks (highest to lowest)';
});

// Feature 2: Show Class Average
document.getElementById('averageBtn').addEventListener('click', () => {
    if (students.length === 0) {
        statsDisplay.innerHTML = ' No students to calculate average';
        return;
    }
    
    const totalSum = students.reduce((sum, student) => sum + student.total, 0);
    const average = totalSum / students.length;
    
    statsDisplay.innerHTML = ` Class Average: <strong>${average.toFixed(1)}</strong> (based on ${students.length} students)`;
});

// Feature 3: Highlight Top Student
function isTopPerformer(index) {
    if (students.length === 0) return false;
    
    // Find max total
    const maxTotal = Math.max(...students.map(s => s.total));
    return students[index].total === maxTotal;
}

document.getElementById('highlightBtn').addEventListener('click', () => {
    if (students.length === 0) {
        statsDisplay.innerHTML = ' No students to highlight';
        return;
    }
    
    updateResultsTable(); // Re-render with highlighting
    const topStudent = students.reduce((prev, current) => 
        (prev.total > current.total) ? prev : current
    );
    
    statsDisplay.innerHTML = ` Top Student: <strong>${topStudent.name}</strong> (Total: ${topStudent.total.toFixed(1)}, Grade: ${topStudent.grade})`;
});

// Feature 4: Pass/Fail Stats
document.getElementById('statsBtn').addEventListener('click', () => {
    if (students.length === 0) {
        statsDisplay.innerHTML = ' No students to analyze';
        return;
    }
    
    const passCount = students.filter(s => s.grade !== 'Fail').length;
    const failCount = students.filter(s => s.grade === 'Fail').length;
    const passPercentage = (passCount / students.length * 100).toFixed(1);
    
    statsDisplay.innerHTML = `
         Pass: <strong style="color:green">${passCount}</strong> (${passPercentage}%) | 
        Fail: <strong style="color:red">${failCount}</strong> (${(100 - passPercentage).toFixed(1)}%)
    `;
});

// Feature 5: Delete Student
window.deleteStudent = function(index) {
    students.splice(index, 1);
    updateResultsTable();
    updateStats();
    statsDisplay.innerHTML = ' Student deleted successfully';
};

// Update stats display
function updateStats() {
    if (students.length === 0) {
        statsDisplay.innerHTML = 'No students in the system';
    }
}

// ==================== FORM SUBMISSION ====================
studentForm.addEventListener('submit', addStudent);

// ==================== INITIAL SETUP ====================
// Add some sample data for testing (optional)
function addSampleData() {
    const sampleStudents = [
        { name: 'John Doe', regNo: 'BIT-001-2025', cat: 25, exam: 60, total: 85, grade: 'A' },
        { name: 'Jane Smith', regNo: 'BIT-002-2025', cat: 18, exam: 45, total: 63, grade: 'B' },
        { name: 'Bob Johnson', regNo: 'BIT-003-2025', cat: 12, exam: 30, total: 42, grade: 'D' }
    ];
    
    students = sampleStudents;
    updateResultsTable();
    updateStats();
}