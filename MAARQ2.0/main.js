// app.js

// Modo oscuro
const modoOscuroBtn = document.getElementById('modoOscuroBtn');
modoOscuroBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('modoOscuro', document.body.classList.contains('dark'));
});
if (localStorage.getItem('modoOscuro') === 'true') {
  document.body.classList.add('dark');
}

// Formulario dinámico por tipo de servicio
const tipoServicio = document.getElementById('tipoServicio');
const formularioPresupuesto = document.getElementById('formularioPresupuesto');

const servicios = {
  vivienda: ["Superficie (m²)", "Cantidad de habitaciones", "Baños"],
  remodelacion: ["Superficie a remodelar (m²)", "Tipo de reforma"],
  proyecto: ["Metros cuadrados a proyectar", "Nivel de detalle requerido"],
  supervision: ["Duración del proyecto (meses)", "Frecuencia de visitas"]
};

tipoServicio.addEventListener('change', () => {
  formularioPresupuesto.innerHTML = '';
  const seleccion = servicios[tipoServicio.value];
  if (seleccion) {
    seleccion.forEach((campo, i) => {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = campo;
      input.className = 'w-full p-2 rounded border';
      input.name = `campo_${i}`;
      formularioPresupuesto.appendChild(input);
    });
  }
});

// Imágenes
const inputImagenes = document.getElementById('inputImagenes');
const vistaPrevia = document.getElementById('vistaPrevia');
let imagenes = [];

inputImagenes.addEventListener('change', () => {
  imagenes = [];
  vistaPrevia.innerHTML = '';
  [...inputImagenes.files].forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      imagenes.push(e.target.result);
      const img = document.createElement('img');
      img.src = e.target.result;
      img.className = 'w-full h-32 object-cover rounded';
      vistaPrevia.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});

// Generar PDF
const generarPDF = document.getElementById('generarPDF');

generarPDF.addEventListener('click', async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const fecha = new Date().toLocaleDateString();

  if (!tipoServicio.value) {
    Swal.fire({ icon: 'warning', title: 'Selecciona un servicio' });
    return;
  }

  const inputs = [...formularioPresupuesto.elements];
  const vacios = inputs.filter(input => input.value.trim() === '');
  if (vacios.length > 0) {
    Swal.fire({ icon: 'warning', title: 'Completa todos los campos' });
    return;
  }

  doc.text(`Presupuesto MAARQ - ${fecha}`, 10, 10);
  doc.text(`Servicio: ${tipoServicio.options[tipoServicio.selectedIndex].text}`, 10, 20);

  inputs.forEach((input, i) => {
    doc.text(`${input.placeholder}: ${input.value}`, 10, 30 + i * 10);
  });

  // Insertar imágenes
  let y = 30 + inputs.length * 10 + 10;
  for (let i = 0; i < imagenes.length; i++) {
    await doc.addImage(imagenes[i], 'JPEG', 10, y, 60, 45);
    y += 50;
    if (y > 270) {
      doc.addPage();
      y = 10;
    }
  }

  doc.save(`Presupuesto_MAARQ_${fecha}.pdf`);

  // Guardar en localStorage
  const presupuesto = {
    fecha,
    tipo: tipoServicio.value,
    datos: inputs.map(input => ({ campo: input.placeholder, valor: input.value }))
  };

  let guardados = JSON.parse(localStorage.getItem('presupuestos')) || [];
  guardados.push(presupuesto);
  localStorage.setItem('presupuestos', JSON.stringify(guardados));

  Swal.fire({
    icon: 'success',
    title: '¡Presupuesto guardado!',
    text: 'Tu presupuesto ha sido descargado en PDF y guardado localmente.'
  });
});

// Ver presupuestos guardados
const seccionPresupuestos = document.createElement('section');
seccionPresupuestos.id = 'presupuestosGuardados';
seccionPresupuestos.className = 'p-6';
seccionPresupuestos.innerHTML = `
  <h2 class="text-2xl font-bold mb-4">Presupuestos Guardados</h2>
  <div id="listaPresupuestos" class="space-y-4"></div>
`;
document.body.appendChild(seccionPresupuestos);

function mostrarPresupuestosGuardados() {
  const lista = document.getElementById('listaPresupuestos');
  lista.innerHTML = '';
  const guardados = JSON.parse(localStorage.getItem('presupuestos')) || [];

  if (guardados.length === 0) {
    lista.innerHTML = '<p class="text-gray-500">No hay presupuestos guardados.</p>';
    return;
  }

  guardados.forEach((pres, idx) => {
    const div = document.createElement('div');
    div.className = 'border p-4 rounded bg-white dark:bg-gray-800';
    div.innerHTML = `
      <h3 class="font-semibold">${pres.fecha} - ${pres.tipo}</h3>
      <ul class="list-disc list-inside">
        ${pres.datos.map(d => `<li><strong>${d.campo}</strong>: ${d.valor}</li>`).join('')}
      </ul>
    `;
    lista.appendChild(div);
  });
}

document.addEventListener('DOMContentLoaded', mostrarPresupuestosGuardados);
