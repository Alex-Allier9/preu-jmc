// ========================================
// PREUNIVERSITARIO JMC - CLOUDFLARE WORKER
// ========================================

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const pathname = url.pathname

  // Redirects para URLs limpias
  const htmlRedirects = {
    '/index.html': '/',
    '/nosotros.html': '/nosotros',
    '/fundador.html': '/fundador',
    '/servicios.html': '/servicios',
    '/testimonios.html': '/testimonios',
    '/contacto.html': '/contacto',
    '/recursos.html': '/recursos'
  }

  // Si la URL termina en .html, redirigir a la versión limpia
  if (htmlRedirects[pathname]) {
    return Response.redirect(url.origin + htmlRedirects[pathname], 301)
  }

  // Reescritura para URLs limpias
  const cleanUrls = {
    '/nosotros': '/nosotros.html',
    '/fundador': '/fundador.html',
    '/servicios': '/servicios.html',
    '/testimonios': '/testimonios.html',
    '/contacto': '/contacto.html',
    '/recursos': '/recursos.html'
  }

  // Si es una URL limpia, servir el archivo .html correspondiente
  if (cleanUrls[pathname]) {
    url.pathname = cleanUrls[pathname]
    const modifiedRequest = new Request(url.toString(), request)
    const response = await fetch(modifiedRequest)
    
    if (response.ok) {
      return new Response(response.body, {
        status: 200,
        statusText: 'OK',
        headers: {
          ...response.headers,
          'Content-Type': 'text/html; charset=utf-8'
        }
      })
    }
  }

  // Manejo de 404 personalizado
  const response = await fetch(request)
  
  if (response.status === 404) {
    const notFoundResponse = await fetch(url.origin + '/404.html')
    if (notFoundResponse.ok) {
      return new Response(notFoundResponse.body, {
        status: 404,
        statusText: 'Not Found',
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Frame-Options': 'SAMEORIGIN',
          'X-Content-Type-Options': 'nosniff',
          'X-XSS-Protection': '1; mode=block'
        }
      })
    }
  }

  // Headers de seguridad para todas las respuestas
  const newResponse = new Response(response.body, response)
  newResponse.headers.set('X-Frame-Options', 'SAMEORIGIN')
  newResponse.headers.set('X-Content-Type-Options', 'nosniff')
  newResponse.headers.set('X-XSS-Protection', '1; mode=block')
  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Headers de caché según el tipo de archivo
  if (pathname.startsWith('/css/') || pathname.startsWith('/js/') || pathname.startsWith('/media/')) {
    newResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  } else if (pathname.endsWith('.html') || pathname === '/') {
    newResponse.headers.set('Cache-Control', 'public, max-age=86400')
  }

  return newResponse
}
