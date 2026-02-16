// Generate OTP
function generateOTP() {
    var otp = Math.floor(1000 + Math.random() * 9000);
    
    var otpDisplay = document.getElementById('otpDisplay');
    otpDisplay.textContent = otp;
    otpDisplay.classList.add('show');
    
    setTimeout(function() {
        otpDisplay.classList.remove('show');
    }, 5000);
    
    addActiveOTP(otp);
}

// Add to active list
function addActiveOTP(otp) {
    var otpList = document.getElementById('activeOtpList');
    
    var otpItem = document.createElement('div');
    otpItem.className = 'otp-item';
    otpItem.innerHTML = '<span class="code">' + otp + '</span><span class="time">15 mins left</span>';
    
    otpList.insertBefore(otpItem, otpList.firstChild);
}

// Toggle lockout
var isLockedOut = false;

function toggleLockout() {
    isLockedOut = !isLockedOut;
    
    var statusElement = document.getElementById('lockoutStatus');
    
    if (isLockedOut) {
        statusElement.textContent = 'Locked';
        statusElement.classList.add('locked');
    } else {
        statusElement.textContent = 'Normal';
        statusElement.classList.remove('locked');
    }
}