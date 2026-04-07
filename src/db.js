class DB {
	#db
	ready
	
	constructor() {
		this.ready = new Promise((resolve, reject) => {
			const request = indexedDB.open("pos_db", 1)
			
			request.onupgradeneeded = e => {
				this.#db = e.target.result
				
				if (!this.#db.objectStoreNames.contains("products")) {
					this.#db.createObjectStore("products", { keyPath: "id" })
				}
				
				if (!this.#db.objectStoreNames.contains("transactions")) {
					const trx = this.#db.createObjectStore("transactions", {
						keyPath: "id",
						autoIncrement: true
					})
					trx.createIndex("date", "date")
				}
			}
			
			request.onsuccess = e => {
				this.#db = e.target.result
				resolve()
			}
			
			request.onerror = reject
		})
	}
	
	async save(store, data) {
		await this.ready
		return new Promise((resolve, reject) => {
			const tx = this.#db.transaction(store, "readwrite")
			const req = tx.objectStore(store).put(data)
			req.onsuccess = resolve
			req.onerror = reject
		})
	}
	
	async getAll(store) {
		await this.ready
		return new Promise((resolve, reject) => {
			const tx = this.#db.transaction(store, "readonly")
			const req = tx.objectStore(store).getAll()
			req.onsuccess = () => resolve(req.result)
			req.onerror = reject
		})
	}
	
	async cursor(store, { mapFn, filterFn } = {}) {
		await this.ready
		
		return new Promise((resolve, reject) => {
			const tx = this.#db.transaction(store, "readonly")
			const objectStore = tx.objectStore(store)
			
			tx.onerror = (e) => {
				console.error("Transaction error:", e.target.error)
				reject(e.target.error)
			}
			
			tx.onabort = (e) => {
				console.error("Transaction aborted:", e.target.error)
				reject(e.target.error)
			}
			
			const request = objectStore.openCursor()
			const results = []
			
			request.onerror = (e) => {
				console.error("Cursor error:", e.target.error)
				reject(e.target.error)
			}
			
			// Compose sekali di luar, tapi pakai sentinel yang jelas
			const SKIP = Symbol("skip")
			
			const filterMap = (filterFn && mapFn) ?
				v => filterFn(v) ? mapFn(v) : SKIP
				: filterFn ?
				v => filterFn(v) ? v : SKIP
				: mapFn ?
				v => mapFn(v)
				: v => v
			
			request.onsuccess = (e) => {
				const cursor = e.target.result
				
				if (cursor) {
					try {
						const value = filterMap(cursor.value)
						if (value !== SKIP) results.push(value)
					} catch (err) {
						reject(err)
						return
					}
					cursor.continue()
				} else {
					resolve(results)
				}
			}
			
		})
	}
	
	// ==========================================
	// BATCH INSERT - THE PERFORMANCE MONSTER
	// ==========================================
	async batchInsert(storeName, dataArray) {
		await this.ready
		return new Promise((resolve, reject) => {
			const tx = this.#db.transaction(storeName, 'readwrite')
			const store = tx.objectStore(storeName)
			
			tx.oncomplete = () => {
				console.log(`[Batch Success] ${dataArray.length} data tersimpan di '${storeName}'.`)
				//Logger.success(`[Batch Success] ${dataArray.length} data tersimpan di '${storeName}'.`)
				resolve(true);
			}
			
			tx.onerror = () => {
				console.log(`[Batch Error] Gagal menyimpan data massal di '${storeName}': ${tx.error}`)
				reject(tx.error)
			}
			
			dataArray.forEach(data => { store.put(data) })
		})
	}
	
	async clearStore(store) {
		await this.ready
		return new Promise((resolve, reject) => {
			const tx = this.#db.transaction(store, "readwrite")
			const req = tx.objectStore(store).clear()
			req.onsuccess = resolve
			req.onerror = reject
		})
	}
}

export const db = new DB()