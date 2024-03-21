const formName = document.querySelector('#name');
const phone = document.querySelector('#phone');
const noticePeriod = document.querySelector('#notice-period');
const experience = document.querySelector('#experience');
const hometown = document.querySelector('#hometown');
const email = document.querySelector('#Email');
const currentLocation = document.querySelector('#current-location');
const currentSalary = document.querySelector('#current-salary');
const expectedSalary = document.querySelector('#expected-salary');
const currentCompany = document.querySelector('#current-company');
const file = document.querySelector('#resume');
const saveBtn = document.querySelector('#save-btn');

const handleButtonStatus = (status) => {
    saveBtn.disabled = status;
}

const validateName = (input) => {
    let inputVal = input.value;
    let errorLabel = input.parentElement.parentElement.lastElementChild;
    if (inputVal == '') {
        errorLabel.innerText = 'Enter your name';
    }
    else {
        errorLabel.innerText = '';
    }
    return (input.value.trim() != '' && errorLabel.innerText == '');
}


const formatPhoneNumber = (input) => {

    let inputValue = input.value;

    // Remove non-numeric characters
    var cleanedString = inputValue.replace(/[^0-9]/g, '');

    // Format the phone number with spaces after every three digits
    var formattedNumber = cleanedString.replace(/(\d{3})(?=\d)/g, '$1 ');

    // Update the input value with the formatted number
    input.value = formattedNumber;

    // Check if the phone number is empty or less than 10 digits and display an error
    var errorLabel = input.parentElement.parentElement.lastElementChild;
    if (cleanedString.length < 10) {
        errorLabel.innerText = 'Please enter phone number (at least 10 digits)';
    } else {
        errorLabel.innerText = ''; // Clear the error message
    }
    return (input.value.trim() != '' && errorLabel.innerText == '');
};

const onlyNumeric = (input) => {
    let inputValue = input.value;
    input.value = inputValue.replace(/\D/g, '');
}

const includeDecimal = (input) => {
    let inputValue = input.value;
    input.value = inputValue.replace(/[^0-9.]/g, '');
}

const validateEmail = (input) => {

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var email = "test@example.com";
    let errorLabel = input.parentElement.parentElement.lastElementChild;
    if (emailRegex.test(input.value)) {
        errorLabel.innerText = "";
    } else {
        errorLabel.innerText = "Enter a valid email address";
    }
    return (input.value.trim() != '' && errorLabel.innerText == '');
}

const isFileInputNotEmpty = (input) => {
    var files = input.files;
    let errorLabel = input.parentElement.lastElementChild;

    if (files.length > 0) {
        if (!files[0].type.includes('pdf')) {
            errorLabel.innerText = 'Only PDF files are allowed';
            return false;
        }

        if (files[0].size > 4 * 1024 * 1024) {
            errorLabel.innerText = 'File size exceeds the limit (4MB)';
            return false;
        } else {
            errorLabel.innerText = '';
            return true;
        }
    } else {
        errorLabel.innerText = 'Provide your resume';
        return false;
    }
}



function showToast(message, type, duration) {
    // Create the toast element
    const toastElement = document.createElement('div');
    toastElement.className = `toast ${type}`;
    toastElement.innerHTML = `<span>${message}</span>`;

    // Append the toast element to the container
    document.body.appendChild(toastElement);

    // Show the toast
    toastElement.style.display = 'flex';

    // Automatically remove the toast after the specified duration
    setTimeout(() => {
        closeToast(toastElement);
    }, duration);
}

window.closeToast = function (element) {
    // Remove the toast element from the DOM
    document.body.removeChild(element);
};

const submissionSuccess =()=> {

    let successContainer = document.getElementById('success-content');
    successContainer.style.display = 'block';


}

const handleSave = (e) => {

    e.preventDefault();

      let isNameOk = validateName(formName);
      let isEmailOk = validateEmail(email);
      let isResumeOk = isFileInputNotEmpty(file);
      let isPhoneOk = formatPhoneNumber(phone);
      let saveBtnStatus = isNameOk && isEmailOk && isResumeOk && isPhoneOk;
      handleButtonStatus(!saveBtnStatus);

      if (!saveBtnStatus) {
          console.log('status btn is disabled and return');
          return;
      }
      
      let isRecordSaved = saveCandidateInformation();
}


const siteUrl = 'https://metadologie-operations-dev-ed.my.site.com';
const apiUrl = `${siteUrl}/services/apexrest/JobOpening/`;
const saveCandidateInformation = () => {

    handleButtonStatus(true);
    let urlParams = new URLSearchParams(window.location.search);
    let positionId = urlParams.has('positionId') ? urlParams.get('positionId') : null;
    console.log('positionId', positionId);
    const reader = new FileReader();
    reader.onloadend = function () {
        const fileContent = reader.result.split(',')[1];

        // submissionSuccess();


        // Make the PATCH request with contact information and file attachment
        fetch(apiUrl + 'saveCandidateInformation', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: formName.value,
                email: email.value,
                phone: phone.value,
                currentLocation: currentLocation.value,
                currentSalary: currentSalary.value,
                experience : experience.value,
                hometown: hometown.value,
                expectedSalary: expectedSalary.value,
                currentCompany: currentCompany.value,
                noticePeriod: noticePeriod.value,
                positionId: positionId,
                fileContent: fileContent,
                fileName: file.files[0].name
            })
        })
            .then(response => response.text())
            .then(res => {
                submissionSuccess();
                handleButtonStatus(false);
                if (res.includes('success')) {
                    let message = res.replace(' #success', '');
                    // showToast(message ,'success', 3000);
                }
                else {
                    console.log();
                    showToast(res,'error', 3000);
                }

            })
            .catch(error => {
                handleButtonStatus(false);
                showToast('error', 'There are some issues please refresh the page', 3000);
                console.log(error);
            });
    };

    reader.readAsDataURL(file.files[0]);
}
