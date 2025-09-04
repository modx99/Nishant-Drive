// Simple Drive Application JavaScript

// Global variables
let uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
let filteredFiles = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the login page or dashboard
    if (document.getElementById('loginForm')) {
        initializeLoginPage();
    } else if (document.getElementById('uploadBtn')) {
        initializeDashboardPage();
    }
});

// Login Page Functions
function initializeLoginPage() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Simple validation (in a real app, this would be server-side)
        if (username && password) {
            // Store login state
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            alert('Please enter both username and password');
        }
    });
}

// Dashboard Page Functions
function initializeDashboardPage() {
    // Check if user is logged in
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize upload functionality
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadStatus = document.getElementById('uploadStatus');
    const dropZone = document.getElementById('dropZone');
    
    // Click to browse files
    dropZone.addEventListener('click', function() {
        fileInput.click();
    });
    
    // File input change
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            uploadFiles(this.files);
        }
    });
    
    // Drag and drop functionality
    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    });
    
    dropZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
    });
    
    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            uploadFiles(files);
        }
    });
    
    uploadBtn.addEventListener('click', function() {
        const files = fileInput.files;
        
        if (files.length === 0) {
            showUploadStatus('Please select at least one file to upload', 'error');
            return;
        }
        
        uploadFiles(files);
    });
    
    // Initialize logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.href = 'index.html';
    });
    
    // Initialize search functionality
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    
    searchInput.addEventListener('input', function() {
        filterFiles(this.value);
        clearSearchBtn.style.display = this.value ? 'block' : 'none';
    });
    
    clearSearchBtn.addEventListener('click', function() {
        searchInput.value = '';
        filterFiles('');
        this.style.display = 'none';
    });
    
    // Display existing files
    displayFiles();
    
    // Update storage info
    updateStorageInfo();
}

function uploadFiles(files) {
    const uploadStatus = document.getElementById('uploadStatus');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadProgress = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    // Show loading state
    uploadBtn.disabled = true;
    uploadBtn.textContent = 'Uploading...';
    uploadProgress.style.display = 'block';
    showUploadStatus('Uploading files...', 'info');
    
    let filesProcessed = 0;
    let filesToProcess = files.length;
    
    // Validate all files first
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 10 * 1024 * 1024) {
            showUploadStatus(`File "${file.name}" is too large. Maximum size is 10MB.`, 'error');
            uploadBtn.disabled = false;
            uploadBtn.textContent = 'Upload';
            uploadProgress.style.display = 'none';
            return;
        }
    }
    
    try {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Convert file to base64 for persistent storage
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    // Create file object with metadata
                    const fileData = {
                        id: Date.now() + Math.random(),
                        name: file.name,
                        size: formatFileSize(file.size),
                        type: file.type || 'application/octet-stream',
                        uploadDate: new Date().toLocaleDateString(),
                        data: e.target.result, // Store as base64
                        originalSize: file.size
                    };
                    
                    uploadedFiles.push(fileData);
                    filesProcessed++;
                    
                    // Update progress
                    const progress = (filesProcessed / filesToProcess) * 100;
                    progressFill.style.width = progress + '%';
                    progressText.textContent = Math.round(progress) + '%';
                    
                    // Check if all files are processed
                    if (filesProcessed === filesToProcess) {
                        saveFilesToStorage();
                        showUploadStatus(`Successfully uploaded ${files.length} file(s)`, 'success');
                        fileInput.value = '';
                        displayFiles();
                        updateStorageInfo();
                        uploadBtn.disabled = false;
                        uploadBtn.textContent = 'Upload';
                        uploadProgress.style.display = 'none';
                        progressFill.style.width = '0%';
                        progressText.textContent = '0%';
                    }
                } catch (error) {
                    console.error('Error processing file:', error);
                    showUploadStatus('Error processing file: ' + error.message, 'error');
                    uploadBtn.disabled = false;
                    uploadBtn.textContent = 'Upload';
                    uploadProgress.style.display = 'none';
                }
            };
            
            reader.onerror = function() {
                showUploadStatus('Error reading file: ' + file.name, 'error');
                uploadBtn.disabled = false;
                uploadBtn.textContent = 'Upload';
                uploadProgress.style.display = 'none';
            };
            
            reader.readAsDataURL(file);
        }
    } catch (error) {
        console.error('Error uploading files:', error);
        showUploadStatus('Error uploading files: ' + error.message, 'error');
        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Upload';
        uploadProgress.style.display = 'none';
    }
}

function saveFilesToStorage() {
    try {
        localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
    } catch (error) {
        console.error('Error saving files to storage:', error);
        if (error.name === 'QuotaExceededError') {
            showUploadStatus('Storage is full. Please delete some files to free up space.', 'error');
        } else {
            showUploadStatus('Error saving files. Please try again.', 'error');
        }
    }
}

function showUploadStatus(message, type) {
    const uploadStatus = document.getElementById('uploadStatus');
    uploadStatus.textContent = message;
    uploadStatus.className = `upload-status ${type}`;
    
    // Clear status after 3 seconds
    setTimeout(() => {
        uploadStatus.textContent = '';
        uploadStatus.className = 'upload-status';
    }, 3000);
}

function filterFiles(searchTerm) {
    if (!searchTerm.trim()) {
        filteredFiles = [...uploadedFiles];
    } else {
        filteredFiles = uploadedFiles.filter(file => 
            file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            file.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    displayFiles();
}

function displayFiles() {
    const filesList = document.getElementById('filesList');
    const filesToShow = filteredFiles.length > 0 ? filteredFiles : uploadedFiles;
    
    if (filesToShow.length === 0) {
        if (uploadedFiles.length === 0) {
            filesList.innerHTML = '<p class="no-files">No files uploaded yet</p>';
        } else {
            filesList.innerHTML = '<p class="no-files">No files match your search</p>';
        }
        return;
    }
    
    filesList.innerHTML = '';
    
    filesToShow.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        const fileIcon = getFileIcon(file.type);
        fileItem.innerHTML = `
            <div class="file-info">
                <div class="file-icon">${fileIcon}</div>
                <div class="file-details">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${file.size} • Uploaded ${file.uploadDate}</div>
                </div>
            </div>
            <div class="file-actions">
                ${file.type.startsWith('image/') ? `<button onclick="previewFile('${file.id}')" class="preview-btn">Preview</button>` : ''}
                <button onclick="downloadFile('${file.id}')" class="download-btn">Download</button>
                <button onclick="deleteFile('${file.id}')" class="delete-btn">Delete</button>
            </div>
        `;
        filesList.appendChild(fileItem);
    });
}

function getFileIcon(fileType) {
    if (!fileType) return '📄';
    
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.startsWith('video/')) return '🎥';
    if (fileType.startsWith('audio/')) return '🎵';
    if (fileType.includes('pdf')) return '📕';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📽️';
    if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('archive')) return '📦';
    if (fileType.includes('text')) return '📄';
    if (fileType.includes('code') || fileType.includes('javascript') || fileType.includes('html') || fileType.includes('css')) return '💻';
    
    return '📄';
}

function downloadFile(fileId) {
    try {
        const file = uploadedFiles.find(f => f.id == fileId);
        if (!file) {
            showUploadStatus('File not found', 'error');
            return;
        }
        
        if (!file.data) {
            showUploadStatus('File data is corrupted', 'error');
            return;
        }
        
        // Convert base64 back to blob
        const base64Data = file.data.split(',')[1];
        if (!base64Data) {
            showUploadStatus('Invalid file data', 'error');
            return;
        }
        
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: file.type || 'application/octet-stream' });
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showUploadStatus(`Downloaded: ${file.name}`, 'success');
    } catch (error) {
        console.error('Download error:', error);
        showUploadStatus('Error downloading file: ' + error.message, 'error');
    }
}

function deleteFile(fileId) {
    if (confirm('Are you sure you want to delete this file?')) {
        // Remove file from array
        uploadedFiles = uploadedFiles.filter(f => f.id != fileId);
        
        // Save updated array to storage
        saveFilesToStorage();
        
        // Refresh the files list
        displayFiles();
        updateStorageInfo();
        
        // Show success message
        showUploadStatus('File deleted successfully', 'success');
    }
}

function previewFile(fileId) {
    const file = uploadedFiles.find(f => f.id == fileId);
    if (!file || !file.data) {
        showUploadStatus('File not found or corrupted', 'error');
        return;
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'preview-modal';
    modal.innerHTML = `
        <div class="preview-content">
            <div class="preview-header">
                <h3>${file.name}</h3>
                <button class="close-preview" onclick="closePreview()">&times;</button>
            </div>
            <div class="preview-body">
                <img src="${file.data}" alt="${file.name}" style="max-width: 100%; max-height: 80vh; object-fit: contain;">
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Add keyboard support
    const handleKeyPress = function(e) {
        if (e.key === 'Escape') {
            closePreview();
        }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    
    // Store the handler so we can remove it later
    modal._keyHandler = handleKeyPress;
}

function closePreview() {
    const modal = document.querySelector('.preview-modal');
    if (modal) {
        // Remove keyboard event listener
        if (modal._keyHandler) {
            document.removeEventListener('keydown', modal._keyHandler);
        }
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

function updateStorageInfo() {
    const storageInfo = document.getElementById('storageInfo');
    if (!storageInfo) return;
    
    try {
        // Calculate used storage
        const usedStorage = JSON.stringify(uploadedFiles).length;
        const usedMB = (usedStorage / (1024 * 1024)).toFixed(2);
        
        // Estimate total available storage (typically 5-10MB for localStorage)
        const estimatedTotal = 5 * 1024 * 1024; // 5MB estimate
        const percentage = Math.min((usedStorage / estimatedTotal) * 100, 100);
        
        storageInfo.innerHTML = `
            <div class="storage-bar">
                <div class="storage-fill" style="width: ${percentage}%"></div>
            </div>
            <div class="storage-text">${usedMB} MB used</div>
        `;
    } catch (error) {
        storageInfo.innerHTML = '<div class="storage-text">Storage info unavailable</div>';
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Add CSS for the buttons
const style = document.createElement('style');
style.textContent = `
    .file-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
    }
    
    .preview-btn {
        background: #9f7aea;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background-color 0.3s ease;
    }
    
    .preview-btn:hover {
        background: #805ad5;
    }
    
    .download-btn {
        background: #4299e1;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background-color 0.3s ease;
    }
    
    .download-btn:hover {
        background: #3182ce;
    }
    
    .delete-btn {
        background: #e53e3e;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background-color 0.3s ease;
    }
    
    .delete-btn:hover {
        background: #c53030;
    }
`;
document.head.appendChild(style);
