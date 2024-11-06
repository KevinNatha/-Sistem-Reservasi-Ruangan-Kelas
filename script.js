// Kelas Room
class Room {
    constructor(number, capacity) {
        this.number = number;
        this.capacity = capacity;
        this.reservations = [];
    }

    // Memeriksa ketersediaan ruangan berdasarkan kapasitas dan waktu
    isAvailable(date, startTime, duration, participants) {
        const newEndTime = new Date(`${date}T${startTime}`);
        newEndTime.setHours(newEndTime.getHours() + parseInt(duration));

        // Periksa apakah ada reservasi yang tumpang tindih
        const isTimeAvailable = this.reservations.every(reservation => {
            const resStartTime = new Date(`${reservation.date}T${reservation.startTime}`);
            const resEndTime = new Date(resStartTime);
            resEndTime.setHours(resEndTime.getHours() + reservation.duration);

            return newEndTime <= resStartTime || new Date(`${date}T${startTime}`) >= resEndTime;
        });

        // Periksa apakah kapasitas mencukupi
        const isCapacityAvailable = this.capacity >= participants;

        return isTimeAvailable && isCapacityAvailable;
    }

    // Menambahkan reservasi dan mengurangi kapasitas
    addReservation(reservation) {
        this.reservations.push(reservation);
        this.capacity -= reservation.participants; // Mengurangi kapasitas ruangan
    }
}

// Kelas Reservation
class Reservation {
    constructor(name, roomNumber, date, startTime, duration, participants) {
        this.name = name;
        this.roomNumber = roomNumber;
        this.date = date;
        this.startTime = startTime;
        this.duration = parseInt(duration);
        this.participants = participants; // Menyimpan jumlah peserta
    }
}

// Data ruangan dengan total 10 ruangan
const rooms = [
    new Room(101, 30),
    new Room(102, 20),
    new Room(103, 50),
    new Room(104, 40),
    new Room(105, 25),
    new Room(106, 35),
    new Room(107, 45),
    new Room(108, 30),
    new Room(109, 20),
    new Room(110, 15)
];

// Menampilkan daftar ruangan
function displayRooms() {
    const tableBody = document.getElementById("rooms-table").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";
    rooms.forEach(room => {
        const row = tableBody.insertRow();
        row.insertCell(0).innerText = room.number;
        row.insertCell(1).innerText = room.capacity;
        row.insertCell(2).innerText = room.reservations.length ? "Tidak Tersedia" : "Tersedia";
    });
}

// Menambahkan reservasi baru
function makeReservation() {
    const name = document.getElementById("name").value;
    const roomNumber = parseInt(document.getElementById("room-number").value);
    const date = document.getElementById("date").value;
    const startTime = document.getElementById("start-time").value;
    const duration = document.getElementById("duration").value;
    const participants = parseInt(document.getElementById("participants").value);
    const errorMessage = document.getElementById("error-message");

    const room = rooms.find(r => r.number === roomNumber);

    if (!room || !room.isAvailable(date, startTime, duration, participants)) {
        errorMessage.innerText = "Ruangan tidak tersedia pada waktu yang dipilih atau kapasitas tidak mencukupi.";
        return;
    }

    const reservation = new Reservation(name, roomNumber, date, startTime, duration, participants);
    room.addReservation(reservation);
    displayReservations();
    displayRooms();
    errorMessage.innerText = "";
}

// Menampilkan daftar reservasi
function displayReservations() {
    const list = document.getElementById("reservations-list");
    list.innerHTML = "";
    rooms.forEach(room => {
        room.reservations.forEach((reservation, index) => {
            const item = document.createElement("li");
            item.innerText = `Nama: ${reservation.name}, Ruangan: ${reservation.roomNumber}, Tanggal: ${reservation.date}, Waktu Mulai: ${reservation.startTime}, Durasi: ${reservation.duration} jam, Peserta: ${reservation.participants}`;
            const cancelButton = document.createElement("button");
            cancelButton.innerText = "Batalkan";
            cancelButton.onclick = () => cancelReservation(room, index);
            item.appendChild(cancelButton);
            list.appendChild(item);
        });
    });
}

// Membatalkan reservasi
function cancelReservation(room, index) {
    const reservation = room.reservations[index];
    room.capacity += reservation.participants; // Menambahkan kapasitas kembali
    room.reservations.splice(index, 1);
    displayReservations();
    displayRooms();
}

// Menampilkan daftar ruangan dan reservasi awal
displayRooms();
displayReservations();
