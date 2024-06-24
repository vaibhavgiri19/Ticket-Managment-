document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "http://localhost:3000/tickets";
  
    const ticketForm = document.getElementById("ticket-form");
    const ticketTableBody = document.getElementById("tickets-table").querySelector("tbody");
  
    // Fetch and display tickets on page load
    fetchTickets();
  
    // Handle form submission for adding/updating tickets
    ticketForm.addEventListener("submit", handleFormSubmit);
  
    // Fetch tickets from the JSON-server
    function fetchTickets() {
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => displayTickets(data))
        .catch(error => console.error("Error fetching tickets:", error));
    }
  
    // Display tickets in the table
    function displayTickets(tickets) {
      ticketTableBody.innerHTML = "";
      tickets.forEach(ticket => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${ticket.title}</td>
          <td>${ticket.description}</td>
          <td>${ticket.status}</td>
          <td>${new Date(ticket.dueDate).toLocaleString()}</td>
          <td>${calculatePriority(ticket.dueDate)}</td>
          <td>
            <button onclick="editTicket(${ticket.id})">Edit</button>
            <button onclick="deleteTicket(${ticket.id})">Delete</button>
          </td>
        `;
        ticketTableBody.appendChild(row);
      });
    }
  
    // Handle form submission
    function handleFormSubmit(event) {
      event.preventDefault();
  
      const id = document.getElementById("ticket-id").value;
      const title = document.getElementById("title").value;
      const description = document.getElementById("description").value;
      const status = document.getElementById("status").value;
      const dueDate = document.getElementById("dueDate").value;
  
      const ticket = { title, description, status, dueDate };
  
      if (id) {
        updateTicket(id, ticket);
      } else {
        createTicket(ticket);
      }
    }
  
    // Create a new ticket
    function createTicket(ticket) {
      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(ticket)
      })
        .then(response => response.json())
        .then(() => {
          fetchTickets();
          ticketForm.reset();
        })
        .catch(error => console.error("Error creating ticket:", error));
    }
  
    // Update an existing ticket
    function updateTicket(id, ticket) {
      fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(ticket)
      })
        .then(response => response.json())
        .then(() => {
          fetchTickets();
          ticketForm.reset();
        })
        .catch(error => console.error("Error updating ticket:", error));
    }
  
    // Delete a ticket
    window.deleteTicket = function(id) {
      fetch(`${apiUrl}/${id}`, {
        method: "DELETE"
      })
        .then(() => fetchTickets())
        .catch(error => console.error("Error deleting ticket:", error));
    };
  
    // Edit a ticket
    window.editTicket = function(id) {
      fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(ticket => {
          document.getElementById("ticket-id").value = ticket.id;
          document.getElementById("title").value = ticket.title;
          document.getElementById("description").value = ticket.description;
          document.getElementById("status").value = ticket.status;
          document.getElementById("dueDate").value = ticket.dueDate;
        })
        .catch(error => console.error("Error fetching ticket:", error));
    };
  
    // Calculate priority based on the due date
    function calculatePriority(dueDate) {
      const now = new Date();
      const due = new Date(dueDate);
      const timeDiff = due - now;
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
      if (daysDiff < 0) return "Overdue";
      if (daysDiff < 3) return "High";
      if (daysDiff < 7) return "Medium";
      return "Low";
    }
  });
  