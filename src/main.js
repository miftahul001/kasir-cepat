import './style.css'
import { renderLogin } from './login.js'
import { renderKasir, kasirKeyboardShortcut } from './kasir.js'
import { renderTransaksi } from './transaksi.js'
import { renderProduk } from './produk.js'
import { el } from './utils.js'

const routes = {
	kasir: renderKasir,
	produk: renderProduk,
	transaksi: renderTransaksi
}

function navigate(page) {
	document.removeEventListener("keydown", kasirKeyboardShortcut)
	const app = document.getElementById('app')
	app.innerHTML = ''
	routes[page](app)
}

const logout = () => {
	document.removeEventListener("keydown", kasirKeyboardShortcut)
	renderLogin(() => {
		document.body.innerHTML = ""
		
		renderNav(document.body)
		el({ a: "div", d: { id: "app" }, b: document.body })
		navigate('kasir')
		renderLog(document.body)
	})
}

//=============
// Nav bar
//=============
function renderNav(parent) {
	const nav = el({ a: "div", b: parent, d:{id:'nav'} });
	
	["kasir", "produk", "transaksi"].forEach(p => {
		el({
			a: "button",
			c: p.toUpperCase(),
			b: nav,
			e: { click: () => navigate(p) }
		})
	})
	
	el({
		a: "button",
		c: 'LOGOUT',
		b: nav,
		e: { click: logout }
	})
}

//=============
// log
//=============
function renderLog(parent) {
	const nav = el({ a: "div", b: parent, d:{id:'log'} });
}

addEventListener('load', logout)