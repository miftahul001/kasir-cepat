import { scoreMatch } from './fuzzysearch.js'
import { db } from './db.js'
import { el } from './utils.js'

export const renderKasir = async app => {
	
	// === CART ===
	const cartDiv = el({ a: "div", d: { id: "cart" }, b: app })
	
	// === INPUT SEARCH ===
	let suggestIndex = -1;
	let suggestItems = [];
	const inputContainer = el({a:'div', b:app, d:{class:'inputContainer'} })
	el({a:'div', b:inputContainer})
	const suggestBox = el({
		a: "div",
		d: { id: "suggest" }
	})
	
	const search = el({
		a: "input",
		d: { id: "search", placeholder: "Scan / ketik barang..." },
		e: {input: e => { renderSuggest(e.target.value) } },
		b: inputContainer
	})
	
	function renderSuggest(keyword) {
		if (search.value === '+' || search.value === '-') {
			search.value = ''
			return
		}
		
		if (!keyword) {
			suggestBox.remove()
			suggestIndex = -1
			suggestItems = []
			return
		}
	
		suggestBox.innerHTML = "";
		!suggestBox.parentElement && inputContainer.children[0].appendChild(suggestBox);
	
		let results = products.map(p => ({
			...p,
			score: scoreMatch(p.name, keyword)
		}))
		.filter(p => p.score > 0)
		.sort((a, b) => b.score - a.score)
		.slice(0, 5);
	
		suggestItems = results
		suggestIndex = 0
	
		el({
			a: 'button',
			b: suggestBox,
			c: 'X',
			e: { click: () => suggestBox.remove() }
		});
	
		results.forEach((p, i) => {
			el({
				a: "div",
				c: p.name,
				d: { class: i === suggestIndex ? "active" : "" },
				e: {
					click: () => {
						addToCart(p);
						suggestBox.remove();
						search.value = "";
					}
				},
				b: suggestBox
			})
		})
	}
	
	function updateSuggestUI() {
		const children = suggestBox.querySelectorAll("div")
		
		children.forEach((el, i) => {
			el.classList.toggle("active", i === suggestIndex)
		})
	}
	
	// === SUMMARY ===
	const summary = el({ a: "div", d: { id: "summary" }, b: app })
	
	const totalEl = el({ a: "div", d: { id: "total" }, c: "Total: 0", b: summary })
	
	const bayarInput = el({
		a: "input",
		d: { id: "bayar", placeholder: "Uang bayar" },
		b: summary
	})
	
	const kembaliEl = el({ a: "div", d: { id: "kembali" }, c: "Kembali: 0", b: summary })
	
	// === DATA ===
	const products = await db.getAll("products")
	if (!products.length) {
		products.push(
			{ id: 1, name: "Indomie", price: 3000 },
			{ id: 2, name: "Kopi", price: 2000 },
			{ id: 3, name: "Gula", price: 12000 },
			{ id: 4, name: "Mie Sedap", price: 3000 },
			{ id: 5, name: "Supermie", price: 3000 }
		)
		await db.batchInsert("products", products)
	}
	
	const cart = []
	let selectedIndex = -1
	
	// === FUNCTIONS ===
	function addToCart(product) {
		let item = cart.find(i => i.id === product.id)
		if (item) item.qty++
		else cart.push({ ...product, qty: 1 })
		
		selectedIndex = cart.length - 1
		renderCart()
	}
	
	function renderCart() {
		cartDiv.innerHTML = ""
		let total = 0
		
		cart.forEach((item, i) => {
			total += item.qty * item.price
			
			const row = el({
				a: "div",
				d: { class: "item" + (i === selectedIndex ? " active" : "") },
				b: cartDiv
			})
			
			el({ a: "div", c: item.name + " x" + item.qty, b: row })
			el({ a: "div", c: item.qty * item.price, b: row })
		})
		
		totalEl.textContent = "Total: " + total
		updateKembali()
	}
	
	function updateKembali() {
		const total = getTotal()
		const bayar = parseInt(bayarInput.value) || 0
		kembaliEl.textContent = "Kembali: " + (bayar - total)
	}
	
	function getTotal() {
		return cart.reduce((t, i) => t + i.qty * i.price, 0)
	}
	
	async function checkout() {
		if (!cart.length) return
		
		await db.save("transactions", {
			items: cart,
			total: getTotal(),
			date: new Date().toISOString()
		})
		
		cart.length = 0
		selectedIndex = -1
		bayarInput.value = ""
		renderCart()
		search.focus()
	}
	
	// === SEARCH ===
	search.addEventListener("keydown", e => {
		
		if (e.key === "ArrowDown") {
			e.preventDefault()
			
			if (suggestBox.parentElement && suggestItems.length) {
				if (suggestIndex < suggestItems.length - 1) {
					suggestIndex++
					updateSuggestUI()
				}
				return
			}
		}
		
		if (e.key === "ArrowUp") {
			e.preventDefault()
			
			if (suggestBox.parentElement && suggestItems.length) {
				if (suggestIndex > 0) {
					suggestIndex--
					updateSuggestUI()
				}
				return
			}
		}
		
		if (e.key === "Enter") {
			if (suggestBox.parentElement && suggestItems.length) {
				const selected = suggestItems[suggestIndex]
				if (selected) addToCart(selected)
				
				suggestBox.remove()
				search.value = ""
				return
			}
		}
	
	})
	
	// === BAYAR INPUT ===
	bayarInput.addEventListener("input", updateKembali)
	
	// === KEYBOARD SHORTCUT ===
	document.addEventListener("keydown", kasirKeyboardShortcut)
	/*
	document.addEventListener("keydown", e => {
		// F2 → focus search
		if (e.key === "F2") {
			e.preventDefault()
			search.focus()
		}
		
		// Qty +
		if (e.key === "+") {
			if (cart[selectedIndex]) {
				cart[selectedIndex].qty++
				renderCart()
			}
			return
		}
		
		// Qty -
		if (e.key === "-") {
			if (cart[selectedIndex]) {
				cart[selectedIndex].qty--
				if (cart[selectedIndex].qty <= 0) cart.splice(selectedIndex, 1)
				renderCart()
			}
			return
		}
		
		// Delete item
		if (e.key === "Delete") {
			if (cart[selectedIndex]) {
				cart.splice(selectedIndex, 1)
				selectedIndex--
				renderCart()
			}
			return
		}
		
		// Arrow navigation
		if (e.key === "ArrowDown") {
			e.preventDefault()
			
			// PRIORITAS: suggest
			if (suggestBox.parentElement && suggestItems.length) return
			
			// fallback ke cart
			if (selectedIndex < cart.length - 1) selectedIndex++
			renderCart()
			return
		}
		
		// Arrow navigation
		if (e.key === "ArrowUp") {
			e.preventDefault()
			
			if (suggestBox.parentElement && suggestItems.length) return
			
			if (selectedIndex > 0) selectedIndex--
			renderCart()
			return
		}
		
		// Enter checkout (kalau bukan di search)
		if (e.key === "Enter" && document.activeElement !== search) {
			checkout()
		}
	})*/
	
	// autofocus awal
	search.focus()
}

// === KEYBOARD SHORTCUT ===
export function kasirKeyboardShortcut(e) {
	// F2 → focus search
	if (e.key === "F2") {
		e.preventDefault()
		search.focus()
	}
	
	// Qty +
	if (e.key === "+") {
		if (cart[selectedIndex]) {
			cart[selectedIndex].qty++
			renderCart()
		}
		return
	}
	
	// Qty -
	if (e.key === "-") {
		if (cart[selectedIndex]) {
			cart[selectedIndex].qty--
			if (cart[selectedIndex].qty <= 0) cart.splice(selectedIndex, 1)
			renderCart()
		}
		return
	}
	
	// Delete item
	if (e.key === "Delete") {
		if (cart[selectedIndex]) {
			cart.splice(selectedIndex, 1)
			selectedIndex--
			renderCart()
		}
		return
	}
	
	// Arrow navigation
	if (e.key === "ArrowDown") {
		e.preventDefault()
		
		// PRIORITAS: suggest
		if (suggestBox.parentElement && suggestItems.length) return
		
		// fallback ke cart
		if (selectedIndex < cart.length - 1) selectedIndex++
		renderCart()
		return
	}
	
	// Arrow navigation
	if (e.key === "ArrowUp") {
		e.preventDefault()
		
		if (suggestBox.parentElement && suggestItems.length) return
		
		if (selectedIndex > 0) selectedIndex--
		renderCart()
		return
	}
	
	// Enter checkout (kalau bukan di search)
	if (e.key === "Enter" && document.activeElement !== search) {
		checkout()
	}
}
