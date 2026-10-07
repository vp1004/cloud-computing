let files = [];
let totalStorage = 5 * 1024 * 1024 * 1024; // 5 GB

function uploadFile() {

    const input = document.getElementById("fileInput");
    const message = document.getElementById("message");

    if (input.files.length === 0) {
        message.textContent = "Please select a file.";
        message.style.color = "red";
        return;
    }

    const file = input.files[0];

    // Calculate current storage
    let usedStorage = files.reduce((total, item) => {
        return total + item.size;
    }, 0);

    if (usedStorage + file.size > totalStorage) {
        message.textContent = "Storage limit exceeded!";
        message.style.color = "red";
        return;
    }

    const fileData = {
        id: Date.now(),
        name: file.name,
        size: file.size,
        type: file.type || "Unknown"
    };

    files.push(fileData);

    message.textContent = "File uploaded successfully!";
    message.style.color = "green";

    input.value = "";

    displayFiles();
    updateStorage();
}


// Display files
function displayFiles() {

    const fileList = document.getElementById("fileList");

    fileList.innerHTML = "";

    if (files.length === 0) {
        fileList.innerHTML = `
            <tr>
                <td colspan="4">No files uploaded</td>
            </tr>
        `;
        return;
    }

    files.forEach(file => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${file.name}</td>
            <td>${formatFileSize(file.size)}</td>
            <td>${file.type}</td>
            <td>
                <button 
                    class="delete-btn"
                    onclick="deleteFile(${file.id})">
                    Delete
                </button>
            </td>
        `;

        fileList.appendChild(row);
    });
}


// Delete file
function deleteFile(id) {

    files = files.filter(file => file.id !== id);

    displayFiles();
    updateStorage();
}


// Update storage
function updateStorage() {

    let usedStorage = files.reduce((total, file) => {
        return total + file.size;
    }, 0);

    let percentage = (usedStorage / totalStorage) * 100;

    document.getElementById("storageUsed").style.width =
        percentage + "%";

    document.getElementById("storageText").textContent =
        `${formatFileSize(usedStorage)} of 5 GB used`;
}


// Format file size
function formatFileSize(bytes) {

    if (bytes === 0) {
        return "0 Bytes";
    }

    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];

    const index =
        Math.floor(Math.log(bytes) / Math.log(1024));

    return (
        (bytes / Math.pow(1024, index)).toFixed(2)
        + " "
        + units[index]
    );
}