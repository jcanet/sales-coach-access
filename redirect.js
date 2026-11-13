// Esta página solo localiza la app: no recibe contraseñas, sesiones ni mensajes.
async function openCoach() {
  const status = document.getElementById('status');
  const retry = document.getElementById('retry');
  retry.hidden = true;
  status.textContent = 'Abriendo tu coach…';
  try {
    // Raw puede mantener una rama mutable en caché aun cambiando la consulta.
    // Contents devuelve el fichero de la rama actual, sin credenciales o tokens.
    const response = await fetch(`https://api.github.com/repos/jcanet/sales-coach-access/contents/target.json?ref=live&t=${Date.now()}`, {
      cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer', signal: AbortSignal.timeout(10000),
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!response.ok) throw new Error('unavailable');
    const file = await response.json();
    if (file.encoding !== 'base64' || typeof file.content !== 'string') throw new Error('invalid');
    const target = JSON.parse(atob(file.content));
    if (typeof target.url !== 'string' || !/^https:\/\/[a-z0-9]+(?:-[a-z0-9]+)*\.trycloudflare\.com$/.test(target.url)) throw new Error('invalid');
    // No reenviar parámetros ni fragmentos del enlace de entrada.
    window.location.replace(`${target.url}/`);
  } catch {
    status.textContent = 'No hemos podido abrir el coach. Vuelve a intentarlo en un momento.';
    retry.hidden = false;
  }
}
document.getElementById('retry').addEventListener('click', openCoach);
void openCoach();
