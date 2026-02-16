// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(function(page) {
        page.classList.add('hidden');
    });
    document.getElementById(pageId).classList.remove('hidden');
}

// Generate OTP
function generateOTP() {
    var otp = Math.floor(1000 + Math.random() * 9000);
    
    var otpBox = document.getElementById('otpBox');
    otpBox.textContent = otp;
    otpBox.classList.add('show');
    
    setTimeout(function() {
        otpBox.classList.remove('show');
    }, 5000);
    
    addActiveOTP(otp);
}

// Add to active OTP list
function addActiveOTP(otp) {
    var otpList = document.getElementById('activeOtps');
    
    var otpItem = document.createElement('div');
    otpItem.className = 'otp-item';
    otpItem.innerHTML = '<span class="code">' + otp + '</span><span class="expire">15m left</span>';
    
    otpList.insertBefore(otpItem, otpList.firstChild);
}

// Toggle lockout
var isLockedOut = false;

function toggleLockout() {
    isLockedOut = !isLockedOut;
    
    var statusElement = document.getElementById('lockStatus');
    
    if (isLockedOut) {
        statusElement.textContent = 'Locked';
        statusElement.classList.add('locked');
    } else {
        statusElement.textContent = 'Normal';
        statusElement.classList.remove('locked');
    }
}