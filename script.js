const STORAGE_KEY = "aprobadas_malla_v2";

function getAprobadas(){
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function setAprobadas(arr){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

function toggleAprobada(id){
  let aprobadas = getAprobadas();

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

    if(aprobadas.includes(id)){
      m.classList.add("aprobada");
      m.classList.remove("locked");
      return;
    }

    const puede = reqs.every(r => aprobadas.includes(r));

    if(puede){
      m.classList.remove("locked");
    } else {
      m.classList.add("locked");
    }
  });
}

// Hacer click en materia
document.addEventListener("DOMContentLoaded", () => {
  actualizar();

  document.querySelectorAll(".materia").forEach(m => {
    m.addEventListener("click", () => {
      if(!m.classList.contains("locked")){
        toggleAprobada(m.id);
      }
    });
  });

  document.getElementById("resetBtn").onclick = () => {
    if(confirm("¿Seguro que quieres reiniciar todo?")){
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  };
});
