document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("contactForm");
	const status = document.getElementById("formStatus");

	const fields = {
		name: {
			input: document.getElementById("name"),
			error: document.getElementById("nameError"),
			message: "Please enter your name."
		},

		email: {
			input: document.getElementById("email"),
			error: document.getElementById("emailError"),
			message: "Please enter a valid email address."
		},

		subject: {
			input: document.getElementById("subject"),
			error: document.getElementById("subjectError"),
			message: "Please select a subject."
		},

		message: {
			input: document.getElementById("message"),
			error: document.getElementById("messageError"),
			message: "Please enter your message."
		}
	};

	// Validate individual field
	function validateField(fieldName) {
		const field = fields[fieldName];
		const input = field.input;
		const error = field.error;
		const group = input.closest(".form-group");

		const value = input.value.trim();
		let isValid = true;

		// Empty field
		if (!value) {
			isValid = false;
		}

		// Email validation
		if (
			fieldName === "email" &&
			value &&
			!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
		) {
			isValid = false;
		}

		if (isValid) {
			group.classList.remove("invalid");
			error.textContent = "";
		} else {
			group.classList.add("invalid");
			error.textContent = field.message;
		}

		return isValid;
	}

	// Live validation
	Object.keys(fields).forEach((fieldName) => {
		const input = fields[fieldName].input;

		input.addEventListener("blur", () => {
			validateField(fieldName);
		});

		input.addEventListener("input", () => {
			if (input.value.trim()) {
				validateField(fieldName);
			}

			status.textContent = "";
			status.className = "form-status";
		});
	});

	// Form submit
	form.addEventListener("submit", (event) => {
		event.preventDefault();

		let isFormValid = true;

		Object.keys(fields).forEach((fieldName) => {
			if (!validateField(fieldName)) {
				isFormValid = false;
			}
		});

		// Stop if validation fails
		if (!isFormValid) {
			status.textContent = "Please complete the highlighted fields.";
			status.className = "form-status error";
			return;
		}

		// Get form values
		const name = fields.name.input.value.trim();
		const email = fields.email.input.value.trim();
		const subject = fields.subject.input.value;
		const message = fields.message.input.value.trim();

		/*
		  Frontend demo only.
	
		  When you connect your backend, send:
		  name
		  email
		  subject
		  message
	
		  to your API here.
		*/

		console.log("Contact Form Submitted:", {
			name,
			email,
			subject,
			message
		});

		// Success message
		status.textContent = `Thanks, ${name}! Your message has been received.`;
		status.className = "form-status success";

		// Reset form
		form.reset();

		// Remove validation errors
		Object.values(fields).forEach((field) => {
			field.input.closest(".form-group").classList.remove("invalid");
			field.error.textContent = "";
		});
	});
});