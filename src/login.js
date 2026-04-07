import { el } from './utils.js'

export function renderLogin(onSuccess) {
	document.body.innerHTML = ""
	
	const wrap = el({ a: "div", d: { id: "login" }, b: document.body })
	
	const box = el({ a: "div", d: { class: "login-box" }, b: wrap })
	
	el({a:'div', b:box, c:'Username: kasir'})
	el({a:'div', b:box, c:'Password: kasir'})
	const user = el({ a: "input", d: { placeholder: "Username" }, b: box })
	const pass = el({ a: "input", d: { type: "password", placeholder: "Password" }, b: box })
	
	const error = el({ a: "div", d: { class: "login-error" }, b: box })
	
	el({
		a: "button",
		c: "LOGIN",
		b: box,
		e: {
			click: () => {
				if (user.value === "kasir" && pass.value === "kasir") {
					onSuccess()
				} else {
					error.textContent = "Username / password salah"
				}
			}
		}
	})
}