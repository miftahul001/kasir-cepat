// ======================================================================
// CENTRALIZED LOGGER (Facade Pattern)
// Saat ini melempar ke F12 (Console), kelak akan dihubungkan ke UI Taskbar
// ======================================================================

// Flag environment (Kelak bisa di-set ke false saat rilis ke publik)
const IS_DEV = true

export const Logger = {
	log: (msg, ...args) => {
		if (IS_DEV) console.log(`[LOG] ${msg}`, ...args)
		
		// TODO (Phase UI): Kirim ke Bottom Terminal
		// TerminalUI.append('log', msg);
	},
	
	info: (msg, ...args) => {
		IS_DEV && console.info(`%c[INFO] ${msg}`, 'color: #4dabf7; font-weight: bold;', ...args)
		
		// TODO (Phase UI): Kirim ke Bottom Terminal
	},
	
	success: (msg, ...args) => {
		IS_DEV && console.log(`%c[SUCCESS] ${msg}`, 'color: #40c057; font-weight: bold;', ...args)
		
		// TODO (Phase UI): Munculkan Toast Hijau & Bottom Terminal
	},
	
	warn: (msg, ...args) => {
		IS_DEV && console.warn(`%c[WARN] ${msg}`, 'color: #fab005; font-weight: bold;', ...args)
		
		// TODO (Phase UI): Munculkan Toast Kuning & Bottom Terminal
	},
	
	error: (msg, ...args) => {
		IS_DEV && console.error(`%c[ERROR] ${msg}`, 'color: #fa5252; font-weight: bold; font-size: 1.1em;', ...args)
		
		// TODO (Phase UI): Munculkan Toast Merah Bergetar & Bottom Terminal
	}
}