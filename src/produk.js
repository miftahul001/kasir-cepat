import { db } from './db.js'
import { el } from './utils.js'

export const renderProduk = async app => {
	
	const products = await db.getAll("products")
	
	const form = el({ a: "div", d:{class:'produk-form'}, b: app })
	
	const nameInput = el({ a: "input", d: { placeholder: "Nama produk" }, b: form })
	const priceInput = el({ a: "input", d: { placeholder: "Harga" }, b: form })
	
	el({
		a: "button",
		c: "Tambah",
		b: form,
		e: {
			click: async () => {
				const p = {
					id: Date.now(),
					name: nameInput.value,
					price: parseInt(priceInput.value)
				}
				
				await db.save("products", p)
				navigate("produk")
			}
		}
	})
	
	const list = el({ a: "div", d:{class:'produk-list'}, b: app })
	
	products.forEach(p => {
		const row = el({ a: "div", d:{class:'produk-item'}, b: list })
		
		el({ a: "span", c: `${p.name} - ${p.price}`, b: row })
		
		el({
			a: "button",
			c: "Hapus",
			b: row,
			e: {
				click: async () => {
					await db.save("products", { ...p, deleted: true })
					navigate("produk")
				}
			}
		})
	})
	
}
