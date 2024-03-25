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
        var date = new Date(currentYear, currentMonth, currentDay); // Create a new date object for the current day
        var dayOfWeek = date.toLocaleString("default", { weekday: "short" }); // Get the short name of the day
  
        var row = document.createElement("tr");
  
        // Add day of the week cell
        var dayCell = document.createElement("td");
        dayCell.textContent = dayOfWeek;
        row.appendChild(dayCell);
        // Add date cell
        var dateCell = document.createElement("td");
        dateCell.textContent = currentDay;
        row.appendChild(dateCell);
  
        // Status cell and button as before
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
            statusButton.style.backgroundColor= "#4CAF50";
          } else {
            statusButton.textContent = "Absent";
            statusButton.classList.remove("present");
            statusButton.classList.add("absent");
            markAttendance(currentDay, "absent");
            statusButton.style.backgroundColor= "red";
          }
        };
        statusCell.appendChild(statusButton);
        row.appendChild(statusCell);
  
        calendarBody.appendChild(row);
      })(day);
    }
  
    // After generating the calendar, call paginate to show the first page
    paginate('calendar');
  }

  // Call this function when the user logs in successfully
generateCalendar();