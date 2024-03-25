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
var rowsPerPage = 7;

function generateCalendar() {
  var today = new Date();
  var currentMonth = today.getMonth();
  var currentYear = today.getFullYear();
  var daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  var calendarBody = document.querySelector("#calendar tbody");
  var monthYearLabel = document.getElementById("current-month-year");
  monthYearLabel.textContent =
    today.toLocaleString("default", { month: "long" }) + " " + currentYear;

  for (var day = 1; day <= daysInMonth; day++) {
    (function (currentDay) {
      // IIFE to capture the current day
      var row = document.createElement("tr");

      var dateCell = document.createElement("td");
      dateCell.textContent = currentDay;
      row.appendChild(dateCell);

      var statusCell = document.createElement("td");
      statusCell.colSpan = "2"; // Span across 'Present' and 'Absent' columns
      var statusButton = document.createElement("button");
      statusButton.textContent = "Absent"; // Default status
      statusButton.classList.add("absent"); // Add class for styling
      statusButton.onclick = function () {
        // Toggle status on click
        if (statusButton.textContent === "Absent") {
          statusButton.textContent = "Present";
          statusButton.classList.remove("absent");
          statusButton.classList.add("present");
          markAttendance(currentDay, "present");
        } else {
          statusButton.textContent = "Absent";
          statusButton.classList.remove("present");
          statusButton.classList.add("absent");
          markAttendance(currentDay, "absent");
        }
      };
      statusCell.appendChild(statusButton);
      row.appendChild(statusCell);

      calendarBody.appendChild(row);
    })(day);
  }

  // After generating the calendar, call paginate to show the first page
  paginate();
}

// Call this function when the user logs in successfully
generateCalendar();

function paginate() {
  var table = document
    .getElementById("calendar")
    .getElementsByTagName("tbody")[0];
  var rows = table.getElementsByTagName("tr");
  var totalPages = Math.ceil(rows.length / rowsPerPage);

  // Hide all rows
  for (var i = 0; i < rows.length; i++) {
    rows[i].style.display = "none";
  }

  // Show the rows for the current page
  var start = (currentPage - 1) * rowsPerPage;
  var end = start + rowsPerPage;
  for (var i = start; i < rows.length && i < end; i++) {
    rows[i].style.display = "";
  }

  // Update the page information
  document.getElementById("page-info").textContent =
     currentPage + " of " + totalPages;

      
}

function changePage(step) {
  var table = document
    .getElementById("calendar")
    .getElementsByTagName("tbody")[0];
  var rows = table.getElementsByTagName("tr");
  var totalPages = Math.ceil(rows.length / rowsPerPage);

  // Update the current page
  currentPage += step;
  currentPage = Math.max(1, Math.min(currentPage, totalPages)); // Clamp between 1 and totalPages

  // Update the table for the new page
  paginate();
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

function generateReport() {
  var today = new Date();
  var currentMonth = today.getMonth();
  var currentYear = today.getFullYear();
  var daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  var presentCount = 0;
  var absentCount = 0;
  var reportContent = "Date\t\tStatus\n";

  for (var day = 1; day <= daysInMonth; day++) {
    var date = day + "-" + (currentMonth + 1) + "-" + currentYear;
    var attendanceRecord = attendanceData.find(
      (record) => record.date === date
    );

    if (attendanceRecord && attendanceRecord.status === "present") {
      reportContent += date + "\t\tPresent\n";
      presentCount++;
    } else {
      reportContent += date + "\t\tAbsent\n";
      absentCount++;
    }
  }

  reportContent +=
    "\nTotal Present: " + presentCount + "\nTotal Absent: " + absentCount;

  // Display the report in the UI
  var reportSection = document.getElementById("report-section");
  var attendanceReport = document.getElementById("attendance-report");
  attendanceReport.textContent = reportContent;
  reportSection.style.display = "block";
}
