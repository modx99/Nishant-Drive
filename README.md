# Nishant's Drive - Personal File Storage

A modern, client-side file storage application built with HTML, CSS, and JavaScript. Store, organize, and manage your files locally in your browser.

## Features

### 🔐 Authentication
- Simple login system with username/password
- Session management with localStorage
- Automatic logout functionality

### 📁 File Management
- **Upload Files**: Drag & drop or click to browse
- **File Types**: Support for all file types with visual icons
- **File Size**: 10MB maximum per file
- **Progress Tracking**: Real-time upload progress bar
- **File Preview**: Preview images directly in the browser
- **Download**: Download any uploaded file
- **Delete**: Remove files with confirmation

### 🔍 Search & Organization
- **Search**: Find files by name or type
- **File Icons**: Visual file type indicators
- **File Details**: Size, upload date, and type information
- **Responsive Design**: Works on desktop and mobile

### 🎨 User Experience
- **Modern UI**: Clean, professional design
- **Drag & Drop**: Intuitive file upload
- **Loading States**: Visual feedback during operations
- **Error Handling**: Comprehensive error messages
- **Keyboard Support**: ESC key to close previews

## How to Use

1. **Start the Server**: 
   ```bash
   python -m http.server 8000
   ```
   Or use any local web server

2. **Access the Application**: 
   Open `http://localhost:8000` in your browser

3. **Login**: 
   - Enter any username and password
   - Click "Login" to access the dashboard

4. **Upload Files**:
   - Drag files onto the upload area, or
   - Click the upload area to browse files
   - Watch the progress bar during upload

5. **Manage Files**:
   - Search for files using the search box
   - Preview images by clicking "Preview"
   - Download files by clicking "Download"
   - Delete files by clicking "Delete"

## Technical Details

- **Storage**: Uses browser localStorage for persistence
- **File Format**: Files are stored as base64 data
- **Browser Support**: Modern browsers with localStorage support
- **No Backend**: Completely client-side application
- **Responsive**: Mobile-friendly design

## File Structure

```
├── index.html          # Login page
├── dashboard.html      # Main application interface
├── script.js          # Application logic
├── styles.css         # Styling and layout
└── README.md          # This file
```

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Security Note

This application stores files locally in your browser. Files are not uploaded to any server and remain private to your device. Clear your browser data to remove all stored files.

## Future Enhancements

- File sharing capabilities
- Folder organization
- File versioning
- Cloud storage integration
- Advanced search filters
- File compression







⭐⭐🌟🌟

things to do in it ⬇️ 
login page - ( google account + email login in it )
dashboard - 3 option [upload , prieview , download ] also give the size occupetions
log out 
connect to amazon s3 bucket
