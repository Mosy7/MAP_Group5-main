import { database } from "./firebase-config.js";

function searchRoom() {
  const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
  const searchResultsBody = document.getElementById('searchResultsBody');
  const buildingAndRoom = document.getElementById('buildingAndRoom');

  // Clear previous search results only if there are existing ones
  searchResultsBody.innerHTML = '';
  buildingAndRoom.innerHTML = '';

  database.ref('Rooms')
    .orderByChild('Name')
    .equalTo(searchTerm)
    .once('value')
    .then(snapshot => {
      if (snapshot.exists()) {
        snapshot.forEach(roomSnapshot => {
          const room = roomSnapshot.val();
          // Check if schedule exists before fetching
          if (room.hasOwnProperty('Schedule')) {
            const scheduleHTML = Object.entries(room.Schedule).map(([key, value]) => `<tr><td>${key}</td><td>${value}</td></tr>`).join('');
            searchResultsBody.innerHTML = `<tr><th>Schedule</th></tr>${scheduleHTML}`;
            buildingAndRoom.innerHTML = `<p>Building: ${room.Building}</p><p>Room: ${room.Name}</p>`;
          } else {
            // Handle case where room has no schedule
            console.log('Room ' + room.Name + ' has no schedule');
          }
        });
      } else {
        // Handle case where no rooms match the search term
        console.log('No rooms found matching the search term');
      }
    })
    .catch(error => {
      console.error('Error retrieving data:', error);
    });
}
