let activities = [];

//menyimpan data di local storage
function saveToLocalStorage() {
    localStorage.setItem('activities', JSON.stringify(activities));
}

//memuat data dari local storage
function loadFromLocalStorage() {
    const data = localStorage.getItem('activities');
    if (data) {
        activities = JSON.parse(data);
        // Validasi struktur data
        activities.forEach(activity => {
            if (!activity.updates) activity.updates = [];
            if (!activity.schedules) activity.schedules = [];
        });
    }
}


//pemilihan role login
function login(role) {
    document.getElementById('login-screen').style.display = 'none';
    if (role === 'admin') {
        document.getElementById('admin-menu').style.display = 'block';
    } else {
        document.getElementById('user-menu').style.display = 'block';
    }
    clearContent();
}

//kembali ke menu login
function logout() {
    document.getElementById('admin-menu').style.display = 'none';
    document.getElementById('user-menu').style.display = 'none';
    document.getElementById('login-screen').style.display = 'block';
    clearContent();
}


function clearContent() {
    document.getElementById('content').innerHTML = '';
}

//tampilan tambah kegiatan
function showAddActivityForm() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <h3>Tambah Kegiatan</h3>
        <div class="coolinput">
            <label for="input" class="text">Nama Kegiatan:</label>
            <input type="text" id="activity-name" placeholder="Write here..."  class="input">
        </div>
        <div class="coolinput">
            <label for="input" class="text">Kontak:</label>
            <input type="text" id="activity-contact" placeholder="No.HP/Email/Sosmed"  class="input">
        </div>
        <div class="coolinput">
            <label for="input" class="text">Gambar:</label>
            <input type="file" id="activity-image" class="input">
        </div>
        <div class="coolinput">
            <label for="input" class="text">Deskripsi:</label>
            <textarea id="activity-description" rows="10" cols="40" placeholder="Deskripsi" class="input"></textarea>
        </div>
        <p></p>
        <button onclick="addActivity()">Tambah</button>
    `;
}

//logic tambah kegiatan
function addActivity() {
    const name = document.getElementById('activity-name').value;
    const description = document.getElementById('activity-description').value;
    const contact = document.getElementById('activity-contact').value;
    const imageFile = document.getElementById('activity-image').files[0];

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const image = e.target.result;
            activities.push({ name, description, contact, image, updates: [], schedules: [] });
            saveToLocalStorage();
            alert('Kegiatan berhasil ditambah');
            clearContent();
        }
        reader.readAsDataURL(imageFile);
    } else {
        activities.push({ name, description, contact, image: '', updates: [], schedules: [] });
        saveToLocalStorage();
        alert('Kegiatan berhasil ditambah');
        clearContent();
    }
}

//tampilan edit kegiatan
function showEditActivityForm() {
    const content = document.getElementById('content');
    let activityOptions = activities.map((activity, index) => `<option value="${index}">${activity.name}</option>`).join('');
    content.innerHTML = `
        <h3>Edit Kegiatan</h3>
        <select id="activity-select" class="custom-select">${activityOptions}</select>
        <div class="coolinput">
            <label for="input" class="text">Deskripsi Baru:</label>
            <input type="text" id="new-activity-description" placeholder="tulis di sini..." class="input">
        </div>
        <div class="coolinput">
            <label for="input" class="text">Kontak Baru:</label>
            <input type="text" id="new-activity-contact" placeholder="Email/No.HP/Sosmed..." class="input">
        </div>
        <div class="coolinput">
            <label for="input" class="text">Gambar Baru:</label>
            <input type="file" id="new-activity-image" class="input">
        </div>
        <button onclick="editActivity()">Edit</button>
    `;
}

//logic edit kegiatan
function editActivity() {
    const index = document.getElementById('activity-select').value;
    const newDescription = document.getElementById('new-activity-description').value;
    const newContact = document.getElementById('new-activity-contact').value;
    const newImageFile = document.getElementById('new-activity-image').files[0];

    if (activities[index]) {
        if (newImageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const newImage = e.target.result;
                activities[index].description = newDescription;
                activities[index].contact = newContact;
                activities[index].image = newImage;
                saveToLocalStorage();
                alert('Kegiatan berhasil diupdate');
                clearContent();
            }
            reader.readAsDataURL(newImageFile);
        } else {
            activities[index].description = newDescription;
            activities[index].contact = newContact;
            activities[index].image = '';
            saveToLocalStorage();
            alert('Kegiatan berhasil diupdate');
            clearContent();
        }
    }
}

//tampilan hapus kegiatan
function showDeleteActivityForm() {
    const content = document.getElementById('content');
    let activityOptions = activities.map((activity, index) => `<option value="${index}">${activity.name}</option>`).join('');
    content.innerHTML = `
        <h3>Hapus Kegiatan atau Update</h3>
        <select id="delete-type-select" class="custom-select" onchange="updateDeleteOptions()">
            <option value="activity">Hapus Kegiatan</option>
            <option value="update">Hapus Update</option>
        </select>
        <div id="delete-options">
            <h4>Pilih Kegiatan</h4>
            <select id="activity-delete-select" class="custom-select">${activityOptions}</select>
            <button onclick="deleteActivity()">Hapus Kegiatan</button>
        </div>
    `;
}

//tampilan hapus update
function updateDeleteOptions() {
    const deleteType = document.getElementById('delete-type-select').value;
    const deleteOptions = document.getElementById('delete-options');
    
    if (deleteType === 'activity') {
        let activityOptions = activities.map((activity, index) => `<option value="${index}">${activity.name}</option>`).join('');
        deleteOptions.innerHTML = `
            <h4>Pilih Kegiatan</h4>
            <select id="activity-delete-select">${activityOptions}</select>
            <button onclick="deleteActivity()">Hapus Kegiatan</button>
        `;
    } else if (deleteType === 'update') {
        let activityOptions = activities.map((activity, index) => `<option value="${index}">${activity.name}</option>`).join('');
        deleteOptions.innerHTML = `
            <h4>Pilih Kegiatan</h4>
            <select id="activity-update-select">${activityOptions}</select>
            <div id="update-options">
                <!-- Update options will be filled dynamically -->
            </div>
            <button onclick="showUpdateDeleteOptions()">Pilih Update</button>
        `;
    }
}

//menampilkan
function showUpdateDeleteOptions() {
    const activityIndex = document.getElementById('activity-update-select').value;
    const updateOptionsDiv = document.getElementById('update-options');
    let updateOptions = activities[activityIndex].updates.map((update, index) => `<option value="${index}">${update.text}</option>`).join('');
    
    updateOptionsDiv.innerHTML = `
        <h4>Pilih Update</h4>
        <select id="update-delete-select" class="custom-select">${updateOptions}</select>
        <button onclick="deleteUpdate(${activityIndex})">Hapus Update</button>
    `;
}

//logic hapus update
function deleteUpdate(activityIndex) {
    const updateIndex = document.getElementById('update-delete-select').value;
    activities[activityIndex].updates.splice(updateIndex, 1);
    saveToLocalStorage();
    alert('Update berhasil dihapus');
    clearContent();
}

//logic hapus kegiatan
function deleteActivity() {
    const index = document.getElementById('activity-delete-select').value;
    activities.splice(index, 1);
    saveToLocalStorage();
    alert('Kegiatan berhasil dihapus');
    clearContent();
}

//lihat daftar kegiatan
function viewActivities() {
    const content = document.getElementById('content');
    let activityList = activities.map((activity, index) => `
        <div class="activity" onclick="viewActivityDetail(${index})">
            <img src="${activity.image}" alt="${activity.name}">
            <h4>${activity.name}</h4>
        </div>
    `).join('');
    content.innerHTML = `<h3>Daftar Kegiatan</h3>${activityList}`;
}

//tampilan detail kegiatan
function viewActivityDetail(index) {
    const activity = activities[index];
    const content = document.getElementById('content');
    
    // Pastikan updates dan schedules diinisialisasi jika belum ada
    if (!activity.updates) activity.updates = [];
    if (!activity.schedules) activity.schedules = [];

    // Urutkan updates berdasarkan urutan waktu penambahan
    let sortedUpdates = activity.updates.slice().sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    let updates = sortedUpdates.map(update => `
        <div class="activity-update">
            ${update.image ? `<img src="${update.image}" alt="Update Image">` : ''}
            <h4>${update.text}</h4>
            <p>${update.description}</p>
        </div>
    `).join('');

    // Urutkan schedules berdasarkan tanggal
    let sortedSchedules = activity.schedules.slice().sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));
    let schedules = sortedSchedules.map(schedule => `
        <tr>
            <td>${schedule.date}</td>
            <td>${schedule.time}</td>
            <td>${schedule.description}</td>
        </tr>
    `).join('');

    content.innerHTML = `
        <div class="activity-detail">
            <br>
            <h3>${activity.name}</h3>
            <br>
            <img src="${activity.image}" alt="${activity.name}">
            <p>${activity.description}</p>
            <br>
            <h4>Kontak</h4>
            <p>${activity.contact}</p>
            <br>
            <h4>Updates/Products:</h4>
            ${updates}
            <br>
            <h4>Jadwal Kegiatan:</h4>
            <table class="Schedule" border= 1>
                <tr>
                    <th>Tanggal</th>
                    <th>Waktu</th>
                    <th>Deskripsi</th>
                </tr>
                ${schedules}
            </table>
            <br>
            <button onclick="viewActivities()">Back to Activities</button>
        </div>`;
}


//tampilan tambah update
function showAddUpdateForm() {
    const content = document.getElementById('content');
    let activityOptions = activities.map((activity, index) => `<option value="${index}">${activity.name}</option>`).join('');
    content.innerHTML = `
        <h3>Update/Product Kegiatan</h3>
        <p>Nama kegiatan</p>
        <select id="activity-update-select" class="custom-select">${activityOptions}</select>
        <div class="coolinput">
            <label for="input" class="text">Judul:</label>
            <input type="text" id="activity-update-text" placeholder="produk/update..."  class="input">
        </div>
        <div class="coolinput">
            <label for="input" class="text">Gambar:</label>
            <input type="file" id="activity-update-image" class="input">
        </div>
        <div class="coolinput">
            <label for="input" class="text">Deskripsi:</label>
            <textarea id="activity-update-description" rows="10" cols="40" placeholder="Deskripsi" class="input"></textarea>
        </div>
        <button onclick="addUpdate()">Tambah Update/Product</button>
    `;
}

//logic tambah update
function addUpdate() {
    const index = document.getElementById('activity-update-select').value;
    const text = document.getElementById('activity-update-text').value;
    const imageFile = document.getElementById('activity-update-image').files[0];
    const description = document.getElementById('activity-update-description').value;

    if (activities[index]) {
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const image = e.target.result;
                activities[index].updates.push({ image, text, description });
                saveToLocalStorage();
                alert('Update/Product berhasil ditambah');
                clearContent();
            }
            reader.readAsDataURL(imageFile);
        } else {
            activities[index].updates.push({ image, text, description, dateAdded: new Date().toISOString() });
            saveToLocalStorage();
            alert('Update/Product berhasil ditambah');
            clearContent();
        }
    }
}

//tampilan Kelola jadwal
function showManageSchedulesForm() {
    const content = document.getElementById('content');
    let activityOptions = activities.map((activity, index) => `<option value="${index}">${activity.name}</option>`).join('');
    content.innerHTML = `
        <h3>Manage Jadwal Kegiatan</h3>
        <p>Nama kegiatan</p>
        <select id="activity-schedule-select" class="custom-select">${activityOptions}</select>
        <button onclick="viewSchedules()">Lihat Jadwal</button>
        <button onclick="showAddScheduleForm()">Tambah Jadwal</button>
    `;
}

//tampilan tambah jadwal
function showAddScheduleForm() {
    const content = document.getElementById('content');
    let activityOptions = activities.map((activity, index) => `<option value="${index}">${activity.name}</option>`).join('');
    content.innerHTML = `
        <h3>Tambah Jadwal Kegiatan</h3>
        <p>Nama kegiatan</p>
        <select id="activity-schedule-select" class="custom-select">${activityOptions}</select>
        <div class="coolinput">
            <label for="schedule-date" class="text">Tanggal:</label>
            <input type="date" id="schedule-date" class="input">
        </div>
        <div class="coolinput">
            <label for="schedule-time" class="text">Waktu:</label>
            <input type="time" id="schedule-time" class="input">
        </div>
        <div class="coolinput">
            <label for="schedule-description" class="text">Deskripsi:</label>
            <textarea id="schedule-description" rows="10" cols="20" class="input" placeholder="Deskripsi"></textarea>
        </div>
        <button onclick="addSchedule()">Tambah Jadwal</button>
        <button onclick="showManageSchedulesForm()">Batal</button>
    `;
}


//Method tambah jadwal
function addSchedule() {
    const index = document.getElementById('activity-schedule-select').value;
    const date = document.getElementById('schedule-date').value;
    const time = document.getElementById('schedule-time').value;
    const description = document.getElementById('schedule-description').value;

    if (activities[index]) {
        activities[index].schedules.push({ date, time, description });
        saveToLocalStorage();
        alert('Jadwal berhasil ditambah');
        clearContent();
    }
}



//tampilan lihat jadwal
function viewSchedules() {
    const index = document.getElementById('activity-schedule-select').value;
    const activity = activities[index];
    const content = document.getElementById('content');
    
    if (!activity.schedules) activity.schedules = [];

    // Urutkan schedules berdasarkan tanggal
    let sortedSchedules = activity.schedules.slice().sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));
    let schedules = sortedSchedules.map((schedule, scheduleIndex) => `
        <tr >
            <td>${schedule.date}</td>
            <td>${schedule.time}</td>
            <td>${schedule.description}</td>
            <td>
                <button class="bg-blue" onclick="showEditScheduleForm(${index}, ${scheduleIndex})">edit</button>
                <button class="bg-red" onclick="deleteSchedule(${index}, ${scheduleIndex})">hapus</button>
            </td>
        </tr>
    `).join('');

    content.innerHTML = `
        <h3>Jadwal Kegiatan untuk ${activity.name}</h3>
        <table class="Schedule" border= 1>
            <tr>
                <th>Tanggal</th>
                <th>Waktu</th>
                <th>Deskripsi</th>
                <th>Edit/Hapus</th>
            </tr>
            ${schedules}
        </table>
        <button onclick="showManageSchedulesForm()">Back</button>
    `;
}

//tampilan edit jadwal
function showEditScheduleForm(activityIndex, scheduleIndex) {
    const activity = activities[activityIndex];
    const schedule = activity.schedules[scheduleIndex];
    const content = document.getElementById('content');

    content.innerHTML = `
        <h3>Edit Jadwal untuk ${activity.name}</h3>
        <div class="coolinput">
            <label for="edit-schedule-date" class="text">Tanggal:</label>
            <input type="date" id="edit-schedule-date" value="${schedule.date}" class="input">
        </div>
        <div class="coolinput">
            <label for="edit-schedule-time" class="text">Waktu:</label>
            <input type="time" id="edit-schedule-time" value="${schedule.time}" class="input">
        </div>
        <div class="coolinput">
            <label for="edit-schedule-description" class="text">Deskripsi:</label>
            <textarea id="edit-schedule-description" rows="10" cols="40" class="input">${schedule.description}</textarea>
        </div>
        <button onclick="editSchedule(${activityIndex}, ${scheduleIndex})">Simpan</button>
        <button onclick="viewSchedules()">Batal</button>
    `;
}

//method edit jadwal
function editSchedule(activityIndex, scheduleIndex) {
    const date = document.getElementById('edit-schedule-date').value;
    const time = document.getElementById('edit-schedule-time').value;
    const description = document.getElementById('edit-schedule-description').value;

    activities[activityIndex].schedules[scheduleIndex] = { date, time, description };
    saveToLocalStorage();
    alert('Jadwal berhasil diupdate');
    showManageSchedulesForm();
}

//method hapus jadwal
function deleteSchedule(activityIndex, scheduleIndex) {
    activities[activityIndex].schedules.splice(scheduleIndex, 1);
    saveToLocalStorage();
    alert('Jadwal berhasil dihapus');
    showManageSchedulesForm();
}


//memuat data
loadFromLocalStorage();
