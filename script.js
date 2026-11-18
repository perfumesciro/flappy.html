
// ==========================================
// CREATOR HUB - SCRIPT PRINCIPAL
// ==========================================

// ESTADO DE LA APLICACIÓN
let videos = [
  {id:1,title:"La historia que nadie te contó",views:45000,status:"Publicado"},
  {id:2,title:"10 promesas que decepcionaron",views:28000,status:"Publicado"},
  {id:3,title:"Los secretos del fútbol",views:15000,status:"En producción"}
];

let ideas = [];
let events = [];
let monthDate = new Date();

const $ = id => document.getElementById(id);
const format = n => Number(n || 0).toLocaleString("es-AR");

// ==========================================
// NAVEGACIÓN
// ==========================================

function toggleMenu(){
  $("sidebar").classList.toggle("open");
}

document.querySelectorAll(".nav-item").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".nav-item").forEach(b=>b.classList.remove("active"));
    document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));

    btn.classList.add("active");
    $(btn.dataset.page).classList.add("active");

    $("greeting").textContent=btn.textContent.trim();
    $("sidebar").classList.remove("open");

    if(btn.dataset.page==="analytics") renderAnalytics();
  });
});

// ==========================================
// INFORMACIÓN DEL CANAL
// ==========================================

function saveChannel(){
  const name=$("channelName").value.trim();
  const subs=Math.max(0,Number($("channelSubs").value)||0);
  const views=Math.max(0,Number($("channelViews").value)||0);

  if(!name){
    alert("Ingresá el nombre del canal");
    return;
  }

  $("greeting").textContent=name;
  $("subStat").textContent=format(subs);
  $("viewStat").textContent=format(views);

  const progress=Math.min(100,subs/10000*100);
  $("goalProgress").style.width=progress+"%";
  $("goalText").textContent=format(subs)+" de 10.000 suscriptores";

  alert("Información guardada.");
}

// ==========================================
// GESTIÓN DE VIDEOS
// ==========================================

function openVideoForm(){
  $("videoForm").style.display="block";
}

function closeVideoForm(){
  $("videoForm").style.display="none";
}

function addVideo(){
  const title=$("vTitle").value.trim();
  const views=Math.max(0,Number($("vViews").value)||0);

  if(!title){
    alert("Ingresá un título");
    return;
  }

  videos.unshift({
    id:Date.now(),
    title,
    views,
    status:$("vStatus").value
  });

  $("vTitle").value="";
  $("vViews").value=0;

  closeVideoForm();
  renderVideos();
  renderDashboard();
  renderAnalytics();
}

function deleteVideo(id){
  if(!confirm("¿Eliminar este video?")) return;

  videos=videos.filter(v=>v.id!==id);

  renderVideos();
  renderDashboard();
  renderAnalytics();
}

function renderVideos(){
  const query=$("videoSearch").value.toLowerCase();

  const filtered=videos.filter(v=>
    v.title.toLowerCase().includes(query)
  );

  $("videoTable").innerHTML=filtered.length
    ?filtered.map(v=>`
      <tr>
        <td><strong>${escapeHTML(v.title)}</strong></td>
        <td>${format(v.views)}</td>
        <td><span class="tag">${escapeHTML(v.status)}</span></td>
        <td>
          <button class="delete" onclick="deleteVideo(${v.id})">
            Eliminar
          </button>
        </td>
      </tr>
    `).join("")
    :`<tr><td colspan="4" class="empty">No hay videos registrados.</td></tr>`;
}

// ==========================================
// IDEAS Y GUIONES
// ==========================================

function addIdea(){
  const title=$("ideaTitle").value.trim();
  const description=$("ideaDescription").value.trim();

  if(!title){
    alert("Escribí el título de la idea");
    return;
  }

  ideas.unshift({
    id:Date.now(),
    title,
    description
  });

  $("ideaTitle").value="";
  $("ideaDescription").value="";

  renderIdeas();
  renderAnalytics();
}

function deleteIdea(id){
  ideas=ideas.filter(i=>i.id!==id);

  renderIdeas();
  renderAnalytics();
}

function renderIdeas(){
  $("ideasList").innerHTML=ideas.length
    ?ideas.map(i=>`
      <div class="card idea-card">
        <h3>${escapeHTML(i.title)}</h3>
        <p>${escapeHTML(i.description)}</p>

        <div class="idea-actions">
          <span class="muted" style="font-size:10px">
            Idea guardada
          </span>

          <button class="delete" onclick="deleteIdea(${i.id})">
            Eliminar
          </button>
        </div>
      </div>
    `).join("")
    :`<div class="card empty">Todavía no guardaste ninguna idea.</div>`;
}

// ==========================================
// CALENDARIO
// ==========================================

function changeMonth(delta){
  monthDate.setMonth(monthDate.getMonth()+delta);
  renderCalendar();
}

function renderCalendar(){
  const year=monthDate.getFullYear();
  const month=monthDate.getMonth();

  $("monthLabel").textContent=
    new Intl.DateTimeFormat("es",{
      month:"long",
      year:"numeric"
    }).format(monthDate);

  const first=new Date(year,month,1).getDay();
  const days=new Date(year,month+1,0).getDate();

  const names=["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

  let html=names.map(n=>`
    <div class="muted" style="text-align:center;padding:8px;font-size:10px">
      ${n}
    </div>
  `).join("");

  for(let i=0;i<first;i++){
    html+="<div></div>";
  }

  for(let d=1;d<=days;d++){
    const date=
      `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

    const matching=events.filter(e=>e.date===date);

    html+=`
      <div class="day ${matching.length?"event":""}">
        <strong>${d}</strong>
        ${matching.map(e=>`
          <small>${escapeHTML(e.title)}</small>
        `).join("")}
      </div>
    `;
  }

  $("calendarGrid").innerHTML=html;
}

function addEvent(){
  const title=$("eventTitle").value.trim();
  const date=$("eventDate").value;

  if(!title||!date){
    alert("Completá el título y la fecha");
    return;
  }

  events.push({
    id:Date.now(),
    title,
    date
  });

  $("eventTitle").value="";
  renderCalendar();
}

// ==========================================
// CALCULADORA DE INGRESOS
// ==========================================

function calculate(){
  const views=Math.max(0,Number($("calcViews").value)||0);
  const rpm=Math.max(0,Number($("calcRPM").value)||0);

  const income=(views/1000)*rpm;

  $("earningsResult").textContent=
    "USD "+income.toLocaleString("en-US",{
      minimumFractionDigits:2,
      maximumFractionDigits:2
    });

  $("incomeStat").textContent="USD "+income.toFixed(2);
}

// ==========================================
// GRÁFICOS
// ==========================================

function drawChart(id,data){
  const canvas=$(id);

  if(!canvas) return;

  const rect=canvas.getBoundingClientRect();
  const w=rect.width;
  const h=rect.height;

  if(!w||!h) return;

  const dpr=window.devicePixelRatio||1;

  canvas.width=w*dpr;
  canvas.height=h*dpr;

  const ctx=canvas.getContext("2d");

  ctx.scale(dpr,dpr);

  const max=Math.max(...data,1)*1.2;

  const left=28;
  const bottom=h-25;
  const top=12;
  const right=w-10;

  const step=data.length>1
    ?(right-left)/(data.length-1)
    :0;

  // Líneas de referencia

  ctx.strokeStyle="#292a36";
  ctx.lineWidth=1;

  for(let i=0;i<4;i++){
    const y=top+(bottom-top)*i/3;

    ctx.beginPath();
    ctx.moveTo(left,y);
    ctx.lineTo(right,y);
    ctx.stroke();
  }

  const points=data.map((v,i)=>({
    x:left+i*step,
    y:bottom-(v/max)*(bottom-top)
  }));

  // Área del gráfico

  const gradient=ctx.createLinearGradient(0,top,0,bottom);

  gradient.addColorStop(0,"rgba(148,113,255,.30)");
  gradient.addColorStop(1,"rgba(148,113,255,0)");

  ctx.beginPath();

  points.forEach((p,i)=>
    i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)
  );

  ctx.lineTo(right,bottom);
  ctx.lineTo(left,bottom);
  ctx.closePath();

  ctx.fillStyle=gradient;
  ctx.fill();

  // Línea

  ctx.beginPath();

  points.forEach((p,i)=>
    i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)
  );

  ctx.strokeStyle="#9471ff";
  ctx.lineWidth=2.5;
  ctx.stroke();

  // Puntos

  points.forEach(p=>{
    ctx.beginPath();
    ctx.arc(p.x,p.y,3,0,Math.PI*2);
    ctx.fillStyle="#ad95ff";
    ctx.fill();
  });
}

function renderAnalytics(){
  const total=videos.reduce((s,v)=>s+v.views,0);

  $("analyticsVideos").textContent=videos.length;
  $("analyticsViews").textContent=format(total);

  $("analyticsAverage").textContent=format(
    videos.length
      ?Math.round(total/videos.length)
      :0
  );

  $("analyticsIdeas").textContent=ideas.length;

  drawChart(
    "analyticsChart",
    videos.slice(0,7).reverse().map(v=>v.views)
  );
}

// ==========================================
// DASHBOARD
// ==========================================

function renderDashboard(){
  $("videoStat").textContent=videos.length;

  $("recentVideos").innerHTML=videos.slice(0,4).map(v=>`
    <div class="video-row">
      <div class="thumb">▶</div>

      <div class="video-info">
        <strong>${escapeHTML(v.title)}</strong>
        <small>${escapeHTML(v.status)}</small>
      </div>

      <div class="video-views">${format(v.views)}</div>
    </div>
  `).join("")||'<div class="empty">Sin videos todavía</div>';
}

// ==========================================
// SEGURIDAD DE TEXTO
// ==========================================

function escapeHTML(value){
  return String(value).replace(/[&<>"']/g,c=>({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#39;"
  })[c]);
}

// ==========================================
// EXPORTAR INFORMACIÓN
// ==========================================

function exportData(){
  const data={
    videos,
    ideas,
    events,
    channel:{
      name:$("channelName").value,
      subscribers:$("channelSubs").value,
      views:$("channelViews").value
    }
  };

  const blob=new Blob(
    [JSON.stringify(data,null,2)],
    {type:"application/json"}
  );

  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");

  a.href=url;
  a.download="creator-hub-data.json";
  a.click();

  URL.revokeObjectURL(url);
}

// ==========================================
// INICIALIZACIÓN
// ==========================================

function init(){
  const now=new Date();

  $("dateLabel").textContent=
    new Intl.DateTimeFormat("es",{
      dateStyle:"full"
    }).format(now).toUpperCase();

  renderDashboard();
  renderVideos();
  renderIdeas();
  renderCalendar();
  calculate();

  drawChart(
    "mainChart",
    [3200,4800,3900,6500,5200,8200,9700]
  );

  window.addEventListener("resize",()=>{
    if($("dashboard").classList.contains("active")){
      drawChart(
        "mainChart",
        [3200,4800,3900,6500,5200,8200,9700]
      );
    }

    if($("analytics").classList.contains("active")){
      renderAnalytics();
    }
  });
}

init();

