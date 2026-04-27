
const projects = JSON.parse(document.getElementById('data').textContent);
const cards = document.getElementById('cards');
const filter = document.getElementById('filter');
const search = document.getElementById('search');

[...new Set(projects.map(p=>p.area))].forEach(a=>{
  const o=document.createElement('option'); o.value=a; o.textContent=a; filter.appendChild(o);
});

function render(){
  const q=search.value.toLowerCase();
  const arr=projects.filter(p=>{
    const hay=[p.name,p.area,p.stage,p.role,p.why,...p.partners].join(' ').toLowerCase();
    return (!filter.value || p.area===filter.value) && (!q || hay.includes(q));
  }).sort((a,b)=>b.momentum-a.momentum);
  cards.innerHTML=arr.map(p=>`
    <article class="project-card">
      <img src="assets/${p.visual}" alt="${p.name}">
      <div class="project-body">
        <span class="tag">${p.area} / ${p.stage}</span>
        <h3>${p.name}</h3>
        <p>${p.why}</p>
        <div class="meter"><span style="width:${p.momentum}%"></span></div>
        <div class="mini">
          <div><small>成長感</small><b>${p.momentum}</b></div>
          <div><small>進捗</small><b>${p.progress}%</b></div>
          <div><small>回収</small><b>${p.cash}</b></div>
        </div>
        <button class="open" onclick="openDetail('${p.id}')">商流・次アクションを見る</button>
      </div>
    </article>
  `).join('');
}
function openDetail(id){
  const p=projects.find(x=>x.id===id);
  document.getElementById('modalContent').innerHTML=`
  <div class="detail">
    <img src="assets/${p.visual}" alt="${p.name}">
    <div>
      <p class="eyebrow">${p.area}</p>
      <h2>${p.name}</h2>
      <p class="lead">${p.role}</p>
      <p>${p.why}</p>
      <div class="mini">
        <div><small>進捗</small><b>${p.progress}%</b></div>
        <div><small>成長感</small><b>${p.momentum}</b></div>
        <div><small>収益性</small><b>${p.potential}</b></div>
      </div>
      <h3>参画・候補パートナー</h3>
      <div class="chips">${p.partners.map(x=>`<span class="chip">${x}</span>`).join('')}</div>
      <h3>次アクション</h3>
      <ul>${p.next.map(x=>`<li>${x}</li>`).join('')}</ul>
    </div>
  </div>`;
  document.getElementById('modal').classList.remove('hidden');
}
document.getElementById('close').onclick=()=>document.getElementById('modal').classList.add('hidden');
document.getElementById('modal').onclick=e=>{ if(e.target.id==='modal') e.currentTarget.classList.add('hidden'); };
search.oninput=render; filter.oninput=render;
document.getElementById('zoomMap').onclick=()=>{ document.getElementById('modalContent').innerHTML='<img src="assets/edutex-correlation-map.png" style="width:100%;border-radius:20px;background:white">'; document.getElementById('modal').classList.remove('hidden'); };
document.getElementById('exportJson').onclick=()=>download(new Blob([JSON.stringify(projects,null,2)],{type:'application/json'}),'edutex-growth-vision.json');
document.getElementById('exportCsv').onclick=()=>{
  const h=['name','area','stage','progress','momentum','cash','potential','partners','next'];
  const rows=[h.join(',')].concat(projects.map(p=>h.map(k=>`"${String(Array.isArray(p[k])?p[k].join(' / '):p[k]).replaceAll('"','""')}"`).join(',')));
  download(new Blob([rows.join('\n')],{type:'text/csv'}),'edutex-growth-vision.csv');
};
function download(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();URL.revokeObjectURL(a.href);}
render();
