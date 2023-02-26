const login = async (req, res) => {
	const { email, password } = req.body

	if (!email || !password) {
		return res.status(400).json({
			msg: 'Email or Password invalid',
			ok: false,
		})
	}



    req.session.user = {
		email
	}

	return res.status(200).json({
		msg: 'Login successfully',
		ok: true,
	})
}

module.exports = {
	login,
}
