import { db } from './db.js'
import { el } from './utils.js'

export const renderTransaksi = async app => {
	
	const transactions = await db.getAll("transactions")
	
	transactions.reverse() // terbaru di atas
	
	transactions.forEach(trx => {
		const box = el({
			a: "div",
			d: { class: "transaksi-item" },
			b: app
		})
		
		el({
			a: "div",
			c: new Date(trx.date).toLocaleString(),
			b: box
		})
		
		el({
			a: "div",
			c: "Total: " + trx.total,
			b: box
		})
		
		trx.items.forEach(item => {
			el({
				a: "div",
				c: `${item.name} x${item.qty}`,
				b: box
			})
		})
	})
}