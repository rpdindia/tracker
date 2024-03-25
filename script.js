// Assuming you have a backend to store the attendance data
var attendanceData = [];

document.addEventListener("DOMContentLoaded", (event) => {
  const registerButton = document.querySelector(".registration .button");
  registerButton.addEventListener("click", () => {
    const username = document.querySelector(
      '.registration input[type="text"]'
    ).value;
    const password = document.querySelector(
      '.registration input[type="password"]'
    ).value;

    // Simple validation check
    if (username.length > 0 && password.length > 0) {
      // Store username and password
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
      alert("Registration successful!");
      // Hide the registration form and show the login form
      document.querySelector(".login").style.display = "block";
      document.querySelector(".registration").style.display = "none";
    } else {
      alert("Please fill in both username and password.");
    }
  });
});

function login() {
  var storedUsername = localStorage.getItem("username");
  var storedPassword = localStorage.getItem("password");

  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  if (username === storedUsername && password === storedPassword) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("attendance-section").style.display = "block";
  } else {
    alert("Invalid credentials!");
  }
}

var currentPage = 1;
var rowsPerPage = { 'calendar': 6, 'report-table': 10 };

function paginate(tableId) {
  var table = document.getElementById(tableId).getElementsByTagName('tbody')[0];
  var rows = table.getElementsByTagName('tr');
  var totalPages = Math.ceil(rows.length / rowsPerPage[tableId]);

  // Hide all rows
  for (var i = 0; i < rows.length; i++) {
    rows[i].style.display = 'none';
  }

  // Show the rows for the current page
  var start = (currentPage - 1) * rowsPerPage[tableId];
  var end = start + rowsPerPage[tableId];
  for (var i = start; i < rows.length && i < end; i++) {
    rows[i].style.display = '';
  }

  // Update the page information
  document.getElementById(tableId + '-page-info').textContent = currentPage + ' of ' + totalPages;
}

function changePage(step, tableId) {
  var table = document.getElementById(tableId).getElementsByTagName('tbody')[0];
  var rows = table.getElementsByTagName('tr');
  var totalPages = Math.ceil(rows.length / rowsPerPage[tableId]);

  // Update the current page
  currentPage += step;
  currentPage = Math.max(1, Math.min(currentPage, totalPages)); // Clamp between 1 and totalPages

  // Update the table for the new page
  paginate(tableId);
}

function markAttendance(day, status) {
  // Record the date and status
  var date =
    day + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear();

  // Update or add the attendance record for the current day
  var recordIndex = attendanceData.findIndex((record) => record.date === date);
  if (recordIndex !== -1) {
    attendanceData[recordIndex].status = status;
  } else {
    attendanceData.push({ date: date, status: status });
  }
  console.log("Attendance for " + date + " marked as " + status);
}


// this function  is used for Generate Report
function generateReport() {
  var today = new Date();
  var currentMonth = today.getMonth();
  var currentYear = today.getFullYear();
  var daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  var presentCount = 0;
  var absentCount = 0;

  // Get or create the tbody for the report table
  var reportTable = document.getElementById('report-table');
  var reportTableBody = reportTable.getElementsByTagName('tbody')[0];
  if (!reportTableBody) {
    reportTableBody = document.createElement('tbody');
    reportTable.appendChild(reportTableBody);
  } else {
    reportTableBody.innerHTML = ''; // Clear existing rows if tbody already exists
  }

  for (var day = 1; day <= daysInMonth; day++) {
    var date = new Date(currentYear, currentMonth, day);
    var dateString = day + "-" + (currentMonth + 1) + "-" + currentYear;
    var dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    var attendanceRecord = attendanceData.find(record => record.date === dateString);

    var row = document.createElement('tr');
    row.innerHTML = '<td>' + dayName + '</td><td>' + dateString + '</td><td>' +
                    (attendanceRecord && attendanceRecord.status === "present" ? "Present" : "Absent") + '</td>';
    reportTableBody.appendChild(row);

    if (attendanceRecord && attendanceRecord.status === "present") {
      presentCount++;
    } else {
      absentCount++;
    }
  }

  // Display Total Summary
  var presentTotal = document.getElementById('present-count');
  var absentTotal = document.getElementById('absent-count');
  presentTotal.innerHTML = presentCount;
  absentTotal.innerHTML = absentCount;

  // Display the report section
  var reportSection = document.getElementById('report-section');
  reportSection.style.display = 'block';
  document.getElementById("attendance-section").style.display = "none";

  // Ensure currentPage is reset to 1 when generating a new report
  currentPage = 1;
  paginate('report-table');
}

function printReport() {
  window.print();
}


