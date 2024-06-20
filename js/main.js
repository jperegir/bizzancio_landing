document.addEventListener('DOMContentLoaded', async function (event) {
	const nameInput = document.getElementById('name');
	const surnamesInput = document.getElementById('surnames');
	const emailInput = document.getElementById('email');
	const phoneInput = document.getElementById('phone');
	const marketingCheck = document.getElementById('marketing');
	const termsCheck = document.getElementById('terms');
	const sendBtn = document.getElementById('btnSend');
	const spinner = document.getElementById('spinner');
	const dataForm = document.getElementById('data-form');
	const nameMaxlenght = 30;
	const surnamesMaxlenght = 80;
	const emailMaxlenght = 320;
	const phoneMaxlenght = 25;

	// eslint-disable-next-line no-undef
	const validator = new JustValidate(document.querySelector('#data-form'), {
		validateBeforeSubmitting: true,
		// focusInvalidField: true,
	});
	validator
		.addField(document.querySelector('#name'), [
			{
				rule: 'required',
			},
			{
				rule: 'maxLength',
				value: nameMaxlenght,
			},
		])
		.addField(document.querySelector('#surnames'), [
			{
				rule: 'required',
			},
			{
				rule: 'maxLength',
				value: surnamesMaxlenght,
			},
		])
		.addField(document.querySelector('#email'), [
			{
				rule: 'required',
			},
			{
				rule: 'email',
			},
			{
				rule: 'maxLength',
				value: emailMaxlenght,
			},
		])
		.addField(document.querySelector('#phone'), [
			{
				rule: 'required',
			},
			{
				rule: 'customRegexp',
				value:
					/(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})/g,
			},
			{
				rule: 'maxLength',
				value: phoneMaxlenght,
			},
		]);

	// eslint-disable-next-line no-unused-vars
	const showSpinner = () => {
		spinner.removeAttribute('hidden');
	};

	// eslint-disable-next-line no-unused-vars
	const hideSpinner = () => {
		spinner.setAttribute('hidden', '');
	};

	dataForm.addEventListener('submit', () => {
		event.preventDefault();
	});

	dataForm.addEventListener('change', event => {
		console.log(event.target.nodeName);
		if (event.target.nodeName === 'INPUT') {
			console.log('isValid', validator.isValid);
			console.log('errorLabels', validator.errorLabels);
		}
	});

	sendBtn.addEventListener('click', async event => {
		if (!validator.isValid) {
			// eslint-disable-next-line no-undef
			await Swal.fire({
				title: '',
				html: `<p styte="text-align:left;">Algún campo del formulario no es válido.</p>`,
				icon: 'warning',
				confirmButtonText: 'Ok',
			});
			return;
		}
		if (!termsCheck.checked) {
			// eslint-disable-next-line no-undef
			await Swal.fire({
				title: '',
				html: `<p styte="text-align:left;">Debe de aceptar la Política de privacidad y los Términos y condiciones.</p>`,
				icon: 'warning',
				confirmButtonText: 'Ok',
			});
			return;
		}
		const name = nameInput.value.trim().slice(0, nameMaxlenght);
		const surnames = surnamesInput.value.trim().slice(0, surnamesMaxlenght);
		const email = emailInput.value.trim().slice(0, emailMaxlenght);
		const phone = phoneInput.value.trim().slice(0, phoneMaxlenght);
		const privacyPolicyAccepted = termsCheck.checked;
		const marketingAccepted = marketingCheck.checked;
		// Enviamos datos a BBDD y mostramos mensaje al usuario
		const jsonData = {
			name,
			surnames,
			email,
			phone,
			privacyPolicyAccepted,
			marketingAccepted,
		};
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(jsonData),
		};
		showSpinner();
		const request = await fetch('/data/register', options);
		const response = await request.json();
		hideSpinner();
		console.log('response', response);
		return true;
	});
});
