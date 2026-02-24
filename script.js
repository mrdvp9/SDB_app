/*--=============================================================================
File Name: script.js
Team: T3_Delivery
Date: 20/02/2026 
Author: Dhruv Patel
Modified: None
Course: ELNC-6012 Practical Project
Professor: XiaoMing Guo

© Fanshawe College, 2026

Description: JavaScript file for index.html, used to support a web-based
			delivery management application. Handles OTP (One-Time Password)
			generation and history tracking for food and package deliveries,
			system lockout control, and photo gallery loading from Google
			Drive or demo placeholders. Runs in any modern web browser and
			requires an active internet connection for Google Drive API access.

/* Global Variables ===========================================================
   OTP Storage and Lockout State =============================================*/

var otpHistory = {		// Stores arrays of generated OTPs for each delivery type
    food: [],
    package: []
};

var isLockedOut = false;	// Tracks whether the system is in lockout mode


/* Configuration ==============================================================
   Google Drive API Settings =================================================*/

var DRIVE_FOLDER_ID = '1jghyPM951sBjU54vo8-MsDgpvIahOC0R';	// Target Drive folder
var GOOGLE_API_KEY  = 'AIzaSyDAk8rFYA849BMEo2UJ8Gg3b45lBgtg888';	// API key for Drive access


/* Functions ==================================================================
   Page Navigation & Display =================================================*/

/*>>> showPage: ===============================================================
Author:		Dhruv Patel
Date:		20/02/2026
Modified:	None
Desc:		Hides all pages and displays the requested page by ID.
			Also triggers data refresh when navigating to the history
			page (page5) or the photo gallery page (page4).
Input: 		String pageId - the ID of the HTML page element to display
Returns:	None
============================================================================*/
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(function(page) {
        page.classList.add('hidden');
    });
    document.getElementById(pageId).classList.remove('hidden');
    
    // Update history display when going to page 5
    if (pageId === 'page5') {
        updateHistoryDisplay();
    }
    
    // Load photos when going to page 4
    if (pageId === 'page4') {
        loadPhotos();
    }
} // eo showPage::


/*>>> generateOTP: ============================================================
Author:		Dhruv Patel
Date:		20/02/2026
Modified:	None
Desc:		Generates a random 4-digit OTP for the specified delivery type,
			stores it in the OTP history, displays it on screen for 5 seconds,
			and blocks generation if the system is locked out.
Input: 		String type - delivery type, either 'food' or 'package'
Returns:	None
============================================================================*/
function generateOTP(type) {
    if (isLockedOut) {
        alert('System is locked out!');
        return;
    }
    
    var otp = Math.floor(1000 + Math.random() * 9000);	// 4-digit OTP
    var timestamp = new Date();
    
    // Store in history
    otpHistory[type].push({
        code: otp,
        time: timestamp
    });
    
    // Display OTP
    var displayId = type === 'food' ? 'otpFood' : 'otpPackage';
    var otpDisplay = document.getElementById(displayId);
    otpDisplay.textContent = otp;
    otpDisplay.classList.add('show');
    
    // Hide OTP after 5 seconds
    setTimeout(function() {
        otpDisplay.classList.remove('show');
    }, 5000);
} // eo generateOTP::


/*>>> updateHistoryDisplay: ===================================================
Author:		Dhruv Patel
Date:		20/02/2026
Modified:	None
Desc:		Reads the OTP history arrays for both food and package types
			and renders them in reverse chronological order into their
			respective history display containers on the history page.
Input: 		None
Returns:	None
============================================================================*/
function updateHistoryDisplay() {
    // Food history
    var foodHistoryDiv = document.getElementById('foodHistory');
    if (otpHistory.food.length === 0) {
        foodHistoryDiv.innerHTML = '<div class="empty-state">No OTPs generated yet</div>';
    } else {
        foodHistoryDiv.innerHTML = '';
        otpHistory.food.slice().reverse().forEach(function(item) {
            var historyItem = document.createElement('div');
            historyItem.className = 'otp-history-item';
            historyItem.innerHTML = '<span class="otp-code">' + item.code + '</span><span class="otp-time">' + formatTime(item.time) + '</span>';
            foodHistoryDiv.appendChild(historyItem);
        });
    }
    
    // Package history
    var packageHistoryDiv = document.getElementById('packageHistory');
    if (otpHistory.package.length === 0) {
        packageHistoryDiv.innerHTML = '<div class="empty-state">No OTPs generated yet</div>';
    } else {
        packageHistoryDiv.innerHTML = '';
        otpHistory.package.slice().reverse().forEach(function(item) {
            var historyItem = document.createElement('div');
            historyItem.className = 'otp-history-item';
            historyItem.innerHTML = '<span class="otp-code">' + item.code + '</span><span class="otp-time">' + formatTime(item.time) + '</span>';
            packageHistoryDiv.appendChild(historyItem);
        });
    }
} // eo updateHistoryDisplay::


/*>>> formatTime: =============================================================
Author:		Dhruv Patel
Date:		20/02/2026
Modified:	None
Desc:		Converts a Date object into a readable relative time string
			(e.g., "Just now", "5 mins ago") or falls back to a locale date
			string if the time is older than 24 hours.
Input: 		Date date - the timestamp to format
Returns:	String readable relative time label
============================================================================*/
function formatTime(date) {
    var now  = new Date();
    var diff = Math.floor((now - date) / 1000);		// Elapsed time in seconds
    
    if (diff < 60)    return 'Just now';
    if (diff < 3600)  return Math.floor(diff / 60)   + ' mins ago';
    if (diff < 86400) return Math.floor(diff / 3600)  + ' hours ago';
    return date.toLocaleDateString();
} // eo formatTime::


/*>>> toggleLockout: ==========================================================
Author:		Dhruv Patel
Date:		20/02/2026
Modified:	None
Desc:		Toggles the system lockout state between locked and normal.
			Updates the status label and button text on the UI to reflect
			the current state. When locked, OTP generation is disabled.
Input: 		None
Returns:	None
============================================================================*/
function toggleLockout() {
    isLockedOut = !isLockedOut;
    
    var statusElement = document.getElementById('lockStatus');
    var btnElement    = document.getElementById('lockBtn');
    
    if (isLockedOut) {
        statusElement.textContent = 'LOCKED';
        statusElement.classList.add('locked');
        btnElement.textContent = 'Unlock';
    } else {
        statusElement.textContent = 'NORMAL';
        statusElement.classList.remove('locked');
        btnElement.textContent = 'Lockout';
    }
} // eo toggleLockout::


/*>>> loadPhotos: =============================================================
Author:		Dhruv Patel
Date:		20/02/2026
Modified:	None
Desc:		Entry point for the photo gallery page. Displays a loading message
			then determines whether to fetch real images from Google Drive or
			fall back to demo placeholder images based on whether API credentials
			are configured.
Input: 		None
Returns:	None
============================================================================*/
function loadPhotos() {
    var gallery = document.getElementById('photoGallery');
    gallery.innerHTML = '<div class="loading">Loading photos...</div>';
    
    // Use Google Drive if both credentials are set, otherwise use demo mode
    if (DRIVE_FOLDER_ID && GOOGLE_API_KEY && DRIVE_FOLDER_ID.length > 0 && GOOGLE_API_KEY.length > 0) {
        loadFromGoogleDrive();
    } else {
        loadDemoPhotos();
    }
} // eo loadPhotos::


/*>>> loadFromGoogleDrive: ====================================================
Author:		Dhruv Patel
Date:		20/02/2026
Modified:	None
Desc:		Fetches a list of image files from the configured Google Drive
			folder using the Drive v3 REST API. On success, passes the file
			list to displayPhotos(). On failure, shows an error message in
			the gallery container.
Input: 		None
Returns:	None
============================================================================*/
function loadFromGoogleDrive() {
    var url = 'https://www.googleapis.com/drive/v3/files?q="' + DRIVE_FOLDER_ID +
              '"+in+parents+and+mimeType+contains+"image/"&key=' + GOOGLE_API_KEY +
              '&fields=files(id,name,createdTime,webContentLink,thumbnailLink)&orderBy=createdTime%20desc';
    
    fetch(url)
        .then(function(response) { return response.json(); })
        .then(function(data) {
            displayPhotos(data.files);
        })
        .catch(function(error) {
            console.error('Error loading photos:', error);
            document.getElementById('photoGallery').innerHTML = '<div class="empty-state">Error loading photos. Check console.</div>';
        });
} // eo loadFromGoogleDrive::


/*>>> displayPhotos: ==========================================================
Author:		Dhruv Patel
Date:		20/02/2026
Modified:	None
Desc:		Renders a grid of photo thumbnails in the gallery container
			from an array of Google Drive file objects. Each thumbnail is
			clickable and opens the full-size image in a modal. Displays
			an empty-state message if the file list is empty or undefined.
Input: 		Array files - array of Google Drive file objects containing
			id, name, createdTime, and thumbnailLink properties
Returns:	None
============================================================================*/
function displayPhotos(files) {
    var gallery = document.getElementById('photoGallery');
    
    if (!files || files.length === 0) {
        gallery.innerHTML = '<div class="empty-state">No photos found</div>';
        return;
    }
    
    gallery.innerHTML = '';
    
    files.forEach(function(file) {
        var item = document.createElement('div');
        item.className = 'gallery-item';
        
        // Use thumbnail link if available, otherwise construct one from file ID
        var thumbnailUrl = file.thumbnailLink || 'https://drive.google.com/thumbnail?id=' + file.id;
        
        item.innerHTML = '<img src="' + thumbnailUrl + '" alt="Photo">';
        item.onclick = function() {
            openPhotoModal(file.id, file.createdTime);
        };
        
        gallery.appendChild(item);
    });
} // eo displayPhotos::


/*>>> loadDemoPhotos: =========================================================
Author:		Dhruv Patel
Date:		20/02/2026
Modified:	None
Desc:		Populates the photo gallery with 9 placeholder images for
			testing and demonstration purposes when Google Drive API
			credentials are not configured.
Input: 		None
Returns:	None
============================================================================*/
function loadDemoPhotos() {
    var gallery = document.getElementById('photoGallery');
    gallery.innerHTML = '';
    
    // Create 9 demo photo slots
    for (var i = 1; i <= 9; i++) {
        var item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = '<img src="https://via.placeholder.com/300x300/f0f0f0/999?text=Photo+' + i + '" alt="Demo Photo ' + i + '">';
        item.onclick = (function(num) {
            return function() {
                openPhotoModal('demo' + num, new Date());
            };
        })(i);
        gallery.appendChild(item);
    }
} // eo loadDemoPhotos::


/*>>> openPhotoModal: =========================================================
Author:		Dhruv Patel
Date:		20/02/2026
Modified:	None
Desc:		Opens the photo modal overlay and displays a full-size version
			of the selected image. Handles both demo placeholder images and
			real Google Drive images based on the fileIdOrUrl argument.
			Also displays the photo's timestamp below the image.
Input: 		String fileIdOrUrl - either a demo identifier (e.g., 'demo3')
			or a Google Drive file ID string
			Date/String time - the timestamp of when the photo was taken
			or uploaded
Returns:	None
============================================================================*/
function openPhotoModal(fileIdOrUrl, time) {
    var modal      = document.getElementById('photoModal');
    var modalImage = document.getElementById('modalImage');
    var photoInfo  = document.getElementById('photoInfo');
    
    // Check if this is a demo placeholder image
    if (typeof fileIdOrUrl === 'string' && fileIdOrUrl.startsWith('demo')) {
        var num = fileIdOrUrl.replace('demo', '');
        modalImage.src = 'https://via.placeholder.com/800x800/f0f0f0/999?text=Photo+' + num;
    } else {
        // Google Drive photo - request larger thumbnail size for modal
        modalImage.src = 'https://drive.google.com/thumbnail?id=' + fileIdOrUrl + '&sz=w1000';
    }
    
    photoInfo.textContent = formatPhotoTime(time);
    modal.classList.remove('hidden');
} // eo openPhotoModal::


/*>>> closePhotoModal: ========================================================
Author:		Dhruv Patel
Date:		20/02/2026
Modified:	None
Desc:		Hides the photo modal overlay by adding the 'hidden' CSS class.
Input: 		None
Returns:	None
============================================================================*/
function closePhotoModal() {
    document.getElementById('photoModal').classList.add('hidden');
} // eo closePhotoModal::


/*>>> formatPhotoTime: ========================================================
Author:		Dhruv Patel
Date:		20/02/2026
Modified:	None
Desc:		Converts a photo timestamp (either a Date object or an ISO
			date string) into a formatted locale date-time string for
			display in the photo modal info section.
Input: 		Date/String time - the timestamp to format; accepts both
			Date objects and ISO 8601 date strings
Returns:	String - locale-formatted date and time string
============================================================================*/
function formatPhotoTime(time) {
    if (typeof time === 'string') {
        time = new Date(time);
    }
    return time.toLocaleString();
} // eo formatPhotoTime::