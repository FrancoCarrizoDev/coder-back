const loginBtnRef = document.querySelector('#loginBtn')

loginBtnRef.addEventListener('click', async (e) => {
	e.preventDefault()
	const email = document.querySelector('#GET-email').value
	const password = document.querySelector('#GET-password').value

	const response = await fetch('/api/session/login', {
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'POST',
		body: JSON.stringify({ email, password }),
	}).then((data) => data.json()).then(resp => resp)

	if(response.ok){
		window.location.href = './products'
	}
})
