/* =========================================================
   validateForm()
   Called when the "Register Now" button is clicked.
   Checks every required field, shows inline error messages
   if anything is missing, or shows the success banner if
   everything is filled in correctly.
========================================================= */
function validateForm() {
  let valid = true;

  // Clear previous error state before re-validating
  clearErrors();

  /* --- First Name --- */
  const firstName = document.getElementById("firstName").value.trim();
  if (firstName === "") {
    markError("firstName", "firstNameErr", "Please enter your first name.");
    valid = false;
  }

  /* --- Surname --- */
  const surname = document.getElementById("surname").value.trim();
  if (surname === "") {
    markError("surname", "surnameErr", "Please enter your surname.");
    valid = false;
  }

  /* --- Email --- */
  const email = document.getElementById("email").value.trim();
  if (email === "") {
    markError("email", "emailErr", "Please enter your email address.");
    valid = false;
  } else if (!isEmailValid(email)) {
    markError("email", "emailErr", "Please enter a valid email address.");
    valid = false;
  }

  /* --- Telephone --- */
  const telephone = document.getElementById("telephone").value.trim();
  if (telephone === "") {
    markError("telephone", "telephoneErr", "Please enter your telephone number.");
    valid = false;
  } else if (telephone.replace(/[\s\-+()]/g, "").length < 7) {
    // Strip spaces, dashes, plus, brackets then check min digit count
    markError("telephone", "telephoneErr", "Please enter a valid telephone number (min 7 digits).");
    valid = false;
  }

  /* --- Session (AM / PM radio) --- */
  const sessionSelected = document.querySelector('input[name="session"]:checked');
  if (!sessionSelected) {
    document.getElementById("sessionErr").textContent =
      "Please choose a morning or afternoon session.";
    valid = false;
  }

  /* --- Show result --- */
  if (valid) {
    // Save the registration data to a .txt file in the Applications folder
    saveToFile(firstName, surname, email, telephone, sessionSelected.value);

    // All fields pass — show success
    document.getElementById("successBanner").classList.remove("hidden");
    document.getElementById("errorBanner").classList.add("hidden");
    // Disable the form to prevent duplicate submissions
    document.getElementById("formFields").classList.add("submitted");
    // Scroll success banner into view
    document.getElementById("successBanner").scrollIntoView({ behavior: "smooth", block: "nearest" });
  } else {
    // Show error summary banner
    document.getElementById("errorBanner").classList.remove("hidden");
    document.getElementById("successBanner").classList.add("hidden");
    // Scroll to first invalid field
    const firstInvalid = document.querySelector(".invalid");
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalid.focus();
    }
  }
}

/* =========================================================
   markError(inputId, errId, message)
   Adds the "invalid" class to an input and sets the
   error message text in the associated <span>.
========================================================= */
function markError(inputId, errId, message) {
  document.getElementById(inputId).classList.add("invalid");
  document.getElementById(errId).textContent = message;
}

/* =========================================================
   clearErrors()
   Resets all input fields to their default state and
   wipes all inline error messages.
========================================================= */
function clearErrors() {
  // Remove invalid class from all inputs
  var inputs = document.querySelectorAll("input");
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].classList.remove("invalid");
  }
  // Clear all error message spans
  var errorSpans = document.querySelectorAll(".field-err");
  for (var j = 0; j < errorSpans.length; j++) {
    errorSpans[j].textContent = "";
  }
}

/* =========================================================
   isEmailValid(email)
   Simple regex test — checks for a basic user@domain.tld
   pattern. Sufficient for front-end validation purposes.
========================================================= */
function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* =========================================================
   Real-time validation clearing
   Remove the invalid style as soon as the user starts
   correcting a field — immediate positive feedback.
========================================================= */
var allInputs = document.querySelectorAll("input");
for (var k = 0; k < allInputs.length; k++) {
  allInputs[k].addEventListener("input", function () {
    this.classList.remove("invalid");
    var errSpan = document.getElementById(this.id + "Err");
    if (errSpan) errSpan.textContent = "";
  });
}

/* =========================================================
   saveToFile(firstName, surname, email, telephone, session)
   Creates a formatted .txt file with the registration data
   and triggers a download so it is saved in the
   Applications folder (or the browser's default download
   location).
========================================================= */
function saveToFile(firstName, surname, email, telephone, session) {
  // Build a timestamp for the registration record
  var now = new Date();
  var timestamp = now.toLocaleDateString() + " " + now.toLocaleTimeString();

  // Format the registration data as readable plain text
  var fileContent =
    "========================================\r\n" +
    "   OPEN DAY REGISTRATION\r\n" +
    "========================================\r\n\r\n" +
    "First Name      : " + firstName + "\r\n" +
    "Surname         : " + surname + "\r\n" +
    "Email           : " + email + "\r\n" +
    "Telephone       : " + telephone + "\r\n" +
    "Session         : " + session + "\r\n\r\n" +
    "----------------------------------------\r\n" +
    "Submitted on    : " + timestamp + "\r\n" +
    "========================================\r\n";

  // Create a Blob from the text content
  var blob = new Blob([fileContent], { type: "text/plain" });

  // Build a filename using the registrant's name
  var fileName = firstName + "_" + surname + "_registration.txt";

  // Create a temporary download link and trigger the download
  var link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
