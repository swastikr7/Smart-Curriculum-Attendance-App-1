// Global variables
let currentUser = null;
let qrScanner = null;

// Sample Data
const scheduleData = {
    student: [
        { time: "9:00 AM - 10:00 AM", subject: "Computer Science", room: "Room 301", code: "CS101" },
        { time: "10:00 AM - 11:00 AM", subject: "Mathematics", room: "Room 205", code: "MATH201" },
        { time: "11:00 AM - 12:00 PM", subject: "Free Period", room: "Library", code: "FREE" },
        { time: "12:00 PM - 1:00 PM", subject: "Lunch Break", room: "Cafeteria", code: "LUNCH" },
        { time: "1:00 PM - 2:00 PM", subject: "Physics", room: "Lab 102", code: "PHY301" },
        { time: "2:00 PM - 3:00 PM", subject: "English", room: "Room 108", code: "ENG101" },
        { time: "3:00 PM - 4:00 PM", subject: "Free Period", room: "Study Hall", code: "FREE" }
    ],
    teacher: [
        { time: "9:00 AM - 10:00 AM", subject: "Computer Science - Section A", room: "Room 301", code: "CS101" },
        { time: "10:00 AM - 11:00 AM", subject: "Computer Science - Section B", room: "Room 301", code: "CS101" },
        { time: "11:00 AM - 12:00 PM", subject: "Free Period", room: "Staff Room", code: "FREE" },
        { time: "12:00 PM - 1:00 PM", subject: "Lunch Break", room: "Cafeteria", code: "LUNCH" },
        { time: "2:00 PM - 3:00 PM", subject: "Computer Science - Section C", room: "Room 301", code: "CS101" }
    ]
};

const activities = [
    { 
        title: "📖 Practice Python Programming",
        description: "Complete coding challenges on HackerRank",
        duration: "30-45 minutes",
        category: "skill"
    },
    {
        title: "📚 Read Research Papers",
        description: "Review latest CS research papers from IEEE",
        duration: "45-60 minutes",
        category: "academic"
    },
    {
        title: "🎯 Career Planning",
        description: "Update your resume and LinkedIn profile",
        duration: "30 minutes",
        category: "career"
    },
    {
        title: "🧮 Math Problem Solving",
        description: "Solve practice problems for upcoming exam",
        duration: "45 minutes",
        category: "academic"
    },
    {
        title: "💡 Project Brainstorming",
        description: "Work on your semester project ideas",
        duration: "30-60 minutes",
        category: "project"
    },
    {
        title: "🏃 Physical Activity",
        description: "Take a walk or do stretching exercises",
        duration: "15-20 minutes",
        category: "wellness"
    }
];

// Initialize app on load
window.onload = function() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    }
    
    // Initialize sample attendance data if not exists
    if (!localStorage.getItem('attendanceData')) {
        localStorage.setItem('attendanceData', JSON.stringify({}));
    }
};

// Login function
function login() {
    const userId = document.getElementById('userId').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('userRole').value;
    
    if (!userId || !password) {
        alert('Please enter User ID and Password');
        return;
    }
    
    // For demo, accept any credentials
    currentUser = {
        id: userId,
        name: userId,
        role: role
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showDashboard();
}

// Show appropriate dashboard
function showDashboard() {
    document.getElementById('loginScreen').classList.remove('active');
    
    if (currentUser.role === 'student') {
        document.getElementById('studentDashboard').classList.add('active');
        document.getElementById('studentName').textContent = currentUser.name;
        loadStudentDashboard();
    } else {
        document.getElementById('teacherDashboard').classList.add('active');
        document.getElementById('teacherName').textContent = currentUser.name;
        loadTeacherDashboard();
    }
}

// Load Student Dashboard
function loadStudentDashboard() {
    displaySchedule();
    displayActivities();
    displayAttendanceHistory();
}

// Load Teacher Dashboard
function loadTeacherDashboard() {
    displayTeacherSchedule();
    loadClassAttendance();
}

// Display student schedule
function displaySchedule() {
    const scheduleList = document.getElementById('scheduleList');
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    
    scheduleList.innerHTML = '';
    
    scheduleData.student.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'schedule-item';
        
        // Check if it's current class
        const classHour = parseInt(item.time.split(':')[0]);
        if (classHour <= currentHour && currentHour < classHour + 1) {
            div.className += ' current';
        }
        
        if (item.code === 'FREE') {
            div.className += ' free-period';
        }
        
        div.innerHTML = `
            <span class="time">${item.time}</span>
            <span class="subject">${item.subject}</span>
            <span class="room">${item.room}</span>
        `;
        
        scheduleList.appendChild(div);
    });
}

// Display teacher schedule
function displayTeacherSchedule() {
    const scheduleDiv = document.getElementById('teacherSchedule');
    scheduleDiv.innerHTML = '';
    
    scheduleData.teacher.forEach(item => {
        const div = document.createElement('div');
        div.className = 'schedule-item';
        
        if (item.code === 'FREE') {
            div.className += ' free-period';
        }
        
        div.innerHTML = `
            <span class="time">${item.time}</span>
            <span class="subject">${item.subject}</span>
            <span class="room">${item.room}</span>
        `;
        
        scheduleDiv.appendChild(div);
    });
}

// Display activity suggestions
function displayActivities() {
    const activityDiv = document.getElementById('activitySuggestions');
    activityDiv.innerHTML = '';
    
    // Check if current time is free period
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    
    let isFreePeriod = false;
    scheduleData.student.forEach(item => {
        const classHour = parseInt(item.time.split(':')[0]);
        if (classHour <= currentHour && currentHour < classHour + 1 && item.code === 'FREE') {
            isFreePeriod = true;
        }
    });
    
    if (isFreePeriod) {
        activityDiv.innerHTML = '<p style="color: green; margin-bottom: 15px;">🟢 You have a free period now! Here are some activities:</p>';
    }
    
    // Randomly select 3 activities
    const selectedActivities = activities.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    selectedActivities.forEach(activity => {
        const div = document.createElement('div');
        div.className = 'activity-item';
        div.innerHTML = `
            <div class="activity-title">${activity.title}</div>
            <div class="activity-desc">${activity.description}</div>
            <div class="activity-time">⏱️ ${activity.duration}</div>
        `;
        div.onclick = () => startActivity(activity);
        activityDiv.appendChild(div);
    });
}

// Start an activity
function startActivity(activity) {
    if (confirm(`Start activity: ${activity.title}?`)) {
        alert(`Great! You've started: ${activity.title}\n\nRemember to:\n- Focus for ${activity.duration}\n- Take notes if needed\n- Track your progress`);
        
        // Log activity
        const activityLog = JSON.parse(localStorage.getItem('activityLog') || '[]');
        activityLog.push({
            activity: activity.title,
            timestamp: new Date().toISOString(),
            user: currentUser.id
        });
        localStorage.setItem('activityLog', JSON.stringify(activityLog));
    }
}

// Mark attendance
function markAttendance() {
    const qrCode = document.getElementById('qrCodeInput').value;
    
    if (!qrCode) {
        showAttendanceStatus('Please enter class code', 'error');
        return;
    }
    
    // Validate QR code format (should contain class code and timestamp)
    const validCodes = ['CS101', 'MATH201', 'PHY301', 'ENG101'];
    const classCode = qrCode.split('-')[0];
    
    if (!validCodes.includes(classCode)) {
        showAttendanceStatus('Invalid class code', 'error');
        return;
    }
    
    // Save attendance
    const attendanceData = JSON.parse(localStorage.getItem('attendanceData'));
    const today = new Date().toDateString();
    
    if (!attendanceData[currentUser.id]) {
        attendanceData[currentUser.id] = {};
    }
    
    if (!attendanceData[currentUser.id][today]) {
        attendanceData[currentUser.id][today] = [];
    }
    
    // Check if already marked
    if (attendanceData[currentUser.id][today].includes(classCode)) {
        showAttendanceStatus('Attendance already marked for this class', 'error');
        return;
    }
    
    attendanceData[currentUser.id][today].push(classCode);
    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
    
    showAttendanceStatus(`✅ Attendance marked for ${classCode}`, 'success');
    document.getElementById('qrCodeInput').value = '';
    
    // Refresh attendance history
    displayAttendanceHistory();
}

// Show attendance status
function showAttendanceStatus(message, type) {
    const statusDiv = document.getElementById('attendanceStatus');
    statusDiv.className = type;
    statusDiv.textContent = message;
    statusDiv.style.display = 'block';
    
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 3000);
}

// Display attendance history
function displayAttendanceHistory() {
    const historyDiv = document.getElementById('attendanceHistory');
    const attendanceData = JSON.parse(localStorage.getItem('attendanceData'));
    const userAttendance = attendanceData[currentUser.id] || {};
    
    // Calculate statistics
    const totalClasses = 20; // Sample total
    const attendedClasses = Object.values(userAttendance).flat().length;
    const percentage = ((attendedClasses / totalClasses) * 100).toFixed(1);
    
    historyDiv.innerHTML = `
        <div class="attendance-stats">
            <div class="stat-box">
                <div class="stat-value">${attendedClasses}/${totalClasses}</div>
                <div class="stat-label">Classes Attended</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${percentage}%</div>
                <div class="stat-label">Attendance Rate</div>
            </div>
        </div>
        <h4>Recent Attendance:</h4>
        <div class="attendance-list">
    `;
    
    // Show last 5 days
    const dates = Object.keys(userAttendance).slice(-5).reverse();
    
    if (dates.length === 0) {
        historyDiv.innerHTML += '<p>No attendance records yet</p>';
    } else {
        dates.forEach(date => {
            const classes = userAttendance[date];
            historyDiv.innerHTML += `
                <div class="attendance-entry present">
                    <span>${new Date(date).toLocaleDateString()}</span>
                    <span>${classes.join(', ')}</span>
                </div>
            `;
        });
    }
    
    historyDiv.innerHTML += '</div>';
}

// Generate QR Code for teachers
function generateQR() {
    const classCode = document.getElementById('classSelect').value;
    
    if (!classCode) {
        alert('Please select a class');
        return;
    }
    
    const qrDisplay = document.getElementById('qrDisplay');
    qrDisplay.innerHTML = '';
    
    // Generate unique code with timestamp
    const timestamp = Date.now();
    const qrData = `${classCode}-${timestamp}`;
    
    // Create QR code
    const qrDiv = document.createElement('div');
    qrDiv.id = 'generatedQR';
    qrDisplay.appendChild(qrDiv);
    
    new QRCode(qrDiv, {
        text: qrData,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
    
    // Add code display
    qrDisplay.innerHTML += `
        <p style="margin-top: 15px; font-weight: bold;">Class Code: ${qrData}</p>
        <p style="color: #666; font-size: 14px;">Students can scan this QR or enter the code manually</p>
        <p style="color: #f44336; font-size: 12px; margin-top: 10px;">⚠️ This code expires in 10 minutes</p>
    `;
    
    // Save to session
    sessionStorage.setItem('activeQR', JSON.stringify({
        code: qrData,
        class: classCode,
        timestamp: timestamp
    }));
    
    // Auto expire after 10 minutes
    setTimeout(() => {
        sessionStorage.removeItem('activeQR');
    }, 600000);
}

// Load class attendance for teachers
function loadClassAttendance() {
    const attendanceView = document.getElementById('classAttendanceView');
    const attendanceData = JSON.parse(localStorage.getItem('attendanceData'));
    const today = new Date().toDateString();
    
    // Sample student list
    const students = [
        { id: 'student1', name: 'John Doe' },
        { id: 'student2', name: 'Jane Smith' },
        { id: 'student3', name: 'Mike Johnson' },
        { id: 'student4', name: 'Sarah Williams' }
    ];
    
    let html = `
        <table class="attendance-table">
            <thead>
                <tr>
                    <th>Student Name</th>
                    <th>Student ID</th>
                    <th>Today's Status</th>
                    <th>Classes Attended</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    students.forEach(student => {
        const studentAttendance = attendanceData[student.id]?.[today] || [];
        const status = studentAttendance.length > 0 ? 'Present' : 'Absent';
        const statusClass = status === 'Present' ? 'status-present' : 'status-absent';
        
        html += `
            <tr>
                <td>${student.name}</td>
                <td>${student.id}</td>
                <td class="${statusClass}">${status}</td>
                <td>${studentAttendance.join(', ') || '-'}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    attendanceView.innerHTML = html;
}

// Start QR Scanner
function startQRScanner() {
    const qrCodeInput = document.getElementById('qrCodeInput');
    
    // Create scanner container
    const scannerDiv = document.createElement('div');
    scannerDiv.id = 'reader';
    scannerDiv.style.width = '100%';
    
    // Insert scanner after the buttons
    const qrScannerDiv = document.querySelector('.qr-scanner');
    qrScannerDiv.appendChild(scannerDiv);
    
    // Initialize QR scanner
    const html5QrCode = new Html5Qrcode("reader");
    
    const config = { 
        fps: 10, 
        qrbox: { width: 250, height: 250 } 
    };
    
    html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText, decodedResult) => {
            // Handle successful scan
            qrCodeInput.value = decodedText;
            html5QrCode.stop().then(() => {
                scannerDiv.remove();
                markAttendance();
            });
        },
        (errorMessage) => {
            // Handle scan error (ignore)
        }
    ).catch((err) => {
        console.error('Unable to start scanner:', err);
        alert('Unable to access camera. Please enter the code manually.');
        scannerDiv.remove();
    });
    
    // Add stop button
    const stopButton = document.createElement('button');
    stopButton.textContent = 'Stop Scanning';
    stopButton.style.marginTop = '10px';
    stopButton.onclick = () => {
        html5QrCode.stop().then(() => {
            scannerDiv.remove();
            stopButton.remove();
        });
    };
    qrScannerDiv.appendChild(stopButton);
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        currentUser = null;
        
        // Hide all dashboards
        document.getElementById('studentDashboard').classList.remove('active');
        document.getElementById('teacherDashboard').classList.remove('active');
        
        // Show login screen
        document.getElementById('loginScreen').classList.add('active');
        
        // Clear form
        document.getElementById('userId').value = '';
        document.getElementById('password').value = '';
    }
}

// Utility function to get current period
function getCurrentPeriod() {
    const now = new Date();
    const currentHour = now.getHours();
    const schedule = currentUser.role === 'student' ? scheduleData.student : scheduleData.teacher;
    
    for (let item of schedule) {
        const startHour = parseInt(item.time.split(':')[0]);
        const isPM = item.time.includes('PM');
        const adjustedHour = isPM && startHour !== 12 ? startHour + 12 : startHour;
        
        if (currentHour >= adjustedHour && currentHour < adjustedHour + 1) {
            return item;
        }
    }
    
    return null;
}

// Auto-refresh schedule every minute
setInterval(() => {
    if (currentUser && currentUser.role === 'student') {
        displaySchedule();
    }
}, 60000);
