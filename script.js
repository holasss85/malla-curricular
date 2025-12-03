// ========== SISTEMA DE APROBACIÓN SIN CHECKBOX ==========

const STORAGE_KEY = "aprobadas_malla_v2";

function getAprobadas(){
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function setAprobadas(arr){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

function toggleAprobada(id){
  let aprobadas = getAprobadas();

  // Si ya está aprobada, NO permitimos desmarcar
  if(!aprobadas.includes(id)){
    aprobadas.push(id);
    setAprobadas(aprobadas);
  }

  actualizar();
}

function actualizar(){
  const aprobadas = getAprobadas();

  document.querySelectorAll(".materia").forEach(m => {
    const id = m.id;
    const reqs = (m.dataset.req || "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    // Aprobada
    if(aprobadas.includes(id)){
      m.classList.add("aprobada");
      return;
    }

    // Verificar si sus requisitos se cumplieron
    const puede = reqs.every(r => aprobadas.includes(r));

    if(puede){
      m.classList.remove("locked");
    } else {
      m.classList.add("locked");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  actualizar();

  document.getElementById("resetBtn").onclick = () => {
    if(confirm("¿Seguro que quieres reiniciar todo?")){
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  };
});

