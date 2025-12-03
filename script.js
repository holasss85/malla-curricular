// script.js
// Guarda en localStorage el array de IDs aprobadas bajo la key 'aprobadas_malla'

const STORAGE_KEY = "aprobadas_malla_v1";

function getAprobadas(){
  try{
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  }catch(e){
    return [];
  }
}
function setAprobadas(arr){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

// dame todos los elementos .materia y aplica estado inicial
function inicializar(){
  const aprobadas = getAprobadas();
  document.querySelectorAll(".materia").forEach(m => {
    const id = m.id;
    const checkbox = m.querySelector(".chk");
    // si está aprobada previamente
    if(aprobadas.includes(id)){
      checkbox.checked = true;
      m.classList.add("aprobada");
      m.classList.remove("locked");
      checkbox.disabled = true; // opcional: evitar desmarcar aprobada
    } else {
      checkbox.checked = false;
      checkbox.disabled = true; // por defecto bloqueada hasta comprobar prereqs
      m.classList.add("locked");
      m.classList.remove("aprobada");
    }

    // evento para cuando el usuario intente marcar (si está habilitado)
    checkbox.addEventListener("change", (e) => {
      if(e.target.checked){
        marcarAprobada(id);
      } else {
        // si quieres permitir desmarcar, puedes quitar el comentario siguiente
        // desmarcarAprobada(id);
        // por ahora, prevenimos desmarcar (estado permanente)
        e.target.checked = true;
      }
    });
  });

  actualizarDesbloqueos();
}

// añade a storage y refresca estados
function marcarAprobada(id){
  const arr = getAprobadas();
  if(!arr.includes(id)){
    arr.push(id);
    setAprobadas(arr);
  }
  inicializar(); // recalcula todo
}

// si quisieras permitir quitar aprobada (opcional)
function desmarcarAprobada(id){
let arr = getAprobadas();
arr = arr.filter(x => x !== id);
setAprobadas(arr);
inicializar();
}

// función que decide si una materia está desbloqueada
function puedeDesbloquear(materiaEl){
  const reqs = (materiaEl.dataset.req || "").split(",").map(s => s.trim()).filter(Boolean);
  if(reqs.length === 0) return true; // sin prerequisitos -> disponible
  const aprobadas = getAprobadas();
  return reqs.every(r => aprobadas.includes(r));
}

// Recorre todas las materias y actualiza disabled/locked/aprobada
function actualizarDesbloqueos(){
  const aprobadas = getAprobadas();
  document.querySelectorAll(".materia").forEach(m => {
    const id = m.id;
    const checkbox = m.querySelector(".chk");

    // si ya está aprobada, mantenerla como aprobada y checkbox disabled
    if(aprobadas.includes(id)){
      m.classList.add("aprobada");
      m.classList.remove("locked");
      checkbox.disabled = true;
      checkbox.checked = true;
      return;
    }

    // si cumple requisitos -> desbloqueada
    if(puedeDesbloquear(m)){
      m.classList.remove("locked");
      checkbox.disabled = false;
      checkbox.title = "Marcar como aprobada";
    } else {
      m.classList.add("locked");
      checkbox.disabled = true;
    }
  });
}

// Botón reset
document.addEventListener("DOMContentLoaded", () => {
  inicializar();
  document.getElementById("resetBtn").addEventListener("click", () => {
    if(confirm("¿Seguro que quieres borrar las materias aprobadas? Se guardan en tu navegador.")){
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  });
});
