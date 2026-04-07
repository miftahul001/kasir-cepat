export const el = a => {
	a.f = document.createElement(a.a)
	a.c && (a.f.textContent = a.c)
	a.d && Object.keys(a.d).forEach(d=>{ a.f.setAttribute(d, a.d[d]) })
	a.e && Object.keys(a.e).forEach(e=>{ a.f.addEventListener(e, a.e[e]) })
	a.b && a.b.appendChild(a.f)
	return a.f
}