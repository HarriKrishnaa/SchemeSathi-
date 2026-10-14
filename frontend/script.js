const API_URL="https://vmrftyj5g1.execute-api.us-east-1.amazonaws.com/stage1/Schemes";
const $=id=>document.getElementById(id);
const statusEl=$("status"),resultsEl=$("results"),countEl=$("count");
let ALL=[],cat="",savedOnly=false,saved=new Set();
try{saved=new Set(JSON.parse(localStorage.getItem("ss_saved")||"[]"))}catch(e){}
try{const t=localStorage.getItem("ss_theme");if(t)document.documentElement.dataset.theme=t}catch(e){}

const get=(o,k)=>{for(const x of k)if(o[x]!=null&&o[x]!=="")return o[x];return""};
const mk=(tag,txt,cls)=>{const e=document.createElement(tag);if(txt)e.textContent=txt;if(cls)e.className=cls;return e};
const nameOf=i=>get(i,["scheme_name","SchemeName","name"])||"Government scheme";
function catOf(i){
  const raw=String(get(i,["category","Category"]));
  const name=String(get(i,["scheme_name","SchemeName","name"]));
  const text=(name+" "+raw+" "+Object.values(i||{}).map(v=>String(v??"")).join(" ")).toLowerCase();

  // Specific categories are checked before broad words such as loan, insurance, or energy.
  if(/solar|renewable energy|solar pump|solar power|rooftop pv|surya ghar|pm.?kusum|kusum/.test(text))return "Solar & Renewable Energy";
  if(/fisher|aquaculture|fishery|livestock|dairy|cattle|animal husbandry|poultry|goat|sheep rearing/.test(text))return "Fisheries & Livestock";
  if(/girl child|girl-child|women|woman|maternity|pregnan|magalir|self.?help group|widow|working mother|anganwadi/.test(text))return "Women & Child Welfare";
  if(/scholarship|education|student|school|college|tuition|academic|hostel for students|education loan/.test(text))return "Education & Scholarships";
  if(/pension|senior citizen|old age|social security|life insurance|life assurance|provident fund|retirement|widow pension/.test(text))return "Pensions & Social Security";
  if(/ayushman|health|medical|hospital|healthcare|medical insurance|health insurance|disease|treatment|disability|assistive device/.test(text))return "Healthcare & Insurance";
  if(/ration|public distribution|food security|food subsidy|mid.?day meal|midday meal|nutrition|take.?home ration/.test(text))return "Food & Nutrition";
  if(/housing|house construction|home loan subsidy|awas|rural shelter|urban shelter|pucca house|homeless/.test(text))return "Housing & Shelter";
  if(/agricultur|farmer|kisan|crop|irrigation|soil health|tractor|seed|fertili[sz]er|farm equipment|landholding|cultivation/.test(text))return "Agriculture & Farmers";
  if(/employment|job|skill development|vocational training|apprentice|worker|labour|labor|mgnrega|nrega|unemployment/.test(text))return "Employment & Skill Development";
  if(/msme|micro.?enterprise|small business|business|entrepreneur|startup|trade|industry|mudra|working capital|business credit/.test(text))return "Business & Entrepreneurship";
  if(/education loan|loan|credit|bank|financial inclusion|interest subsidy|self.?employment finance|microfinance/.test(text))return "Loans & Financial Assistance";
  if(/electricity|energy efficiency|clean cooking|biogas|wind power|hydro power|environment|afforestation|forest conservation|climate/.test(text))return "Energy & Environment";
  if(/drinking water|water supply|water conservation|watershed|sanitation|toilet|sewerage|waste management|cleanliness/.test(text))return "Water & Sanitation";
  if(/transport|vehicle|mobility|road safety|bus pass|public transport|electric vehicle/.test(text))return "Transport & Mobility";
  if(/digital|internet|broadband|e.?governance|citizen service|identity|digital literacy|common service centre|online service/.test(text))return "Digital & Public Services";
  if(/scheduled caste|scheduled tribe|sc\/st|backward class|minority|tribal|nomadic tribe|socially disadvantaged/.test(text))return "Community & Inclusion";
  if(/disaster|flood relief|drought relief|cyclone|earthquake|relief fund|ex.?gratia|emergency assistance/.test(text))return "Disaster Relief & Assistance";
  if(/rural development|village development|panchayat|urban development|smart city|slum redevelopment/.test(text))return "Rural & Urban Development";
  if(/sports|athlete|athletics|olympic|paralympic|arts|artist|culture|heritage|tourism|craftsperson|handloom|handicraft/.test(text))return "Sports, Arts & Culture";
  if(/tax|income tax|gst|taxpayer|tax rebate|tax exemption/.test(text))return "Tax & Benefits";
  if(/legal aid|legal assistance|justice|court fee|free legal/.test(text))return "Legal Aid";
  return raw.trim()||"Other Schemes";
}
const stOf=i=>String(get(i,["state_applicability","state","State"]));
function toast(m){const t=$("toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),1800)}
function persist(){try{localStorage.setItem("ss_saved",JSON.stringify([...saved]))}catch(e){}$("savedBtn").textContent=`★ Saved (${saved.size})`}

function buildChips(){
  const box=$("chips");box.replaceChildren();
  ["",...[...new Set(ALL.map(catOf).filter(Boolean))].sort()].forEach(c=>{
    const b=mk("button",c||"All categories","chip");b.type="button";b.setAttribute("aria-pressed",String(c===cat));
    b.onclick=()=>{cat=c;buildChips();apply()};box.appendChild(b)});
}

function card(i){
  const id=nameOf(i),c=mk("article","","card");
  const h=mk("header");h.appendChild(mk("h3",id));
  const s=mk("button","★","star");s.type="button";s.title="Save scheme";s.setAttribute("aria-label","Save "+id);
  s.setAttribute("aria-pressed",String(saved.has(id)));
  s.onclick=()=>{saved.has(id)?saved.delete(id):saved.add(id);s.setAttribute("aria-pressed",String(saved.has(id)));persist();toast(saved.has(id)?"Saved":"Removed from saved");if(savedOnly)apply()};
  h.appendChild(s);c.appendChild(h);
  const tags=mk("div","","tags");[catOf(i),get(i,["government_level"]),stOf(i)].filter(Boolean).forEach(v=>tags.appendChild(mk("span",String(v),"tag")));
  if(tags.childNodes.length)c.appendChild(tags);
  const row=(l,v)=>{const p=mk("p");p.appendChild(mk("b",l+": "));p.appendChild(document.createTextNode(v));return p};
  const benefit=get(i,["benefit_summary","benefits","Benefits"]),elig=get(i,["eligibility_summary","eligibility","Eligibility"]);
  const who=get(i,["target_beneficiaries","beneficiaries"]),docs=get(i,["documents_or_information","documents"]);
  if(benefit)c.appendChild(row("Benefits",benefit));
  if(elig)c.appendChild(row("Eligibility",elig));
  const more=mk("div","","more");if(who)more.appendChild(row("For",who));if(docs)more.appendChild(row("Documents",docs));
  if(more.childNodes.length)c.appendChild(more);
  const acts=mk("div","","acts");
  if(more.childNodes.length){const t=mk("button","Show details","secondary");t.type="button";t.onclick=()=>{const o=c.classList.toggle("open");t.textContent=o?"Hide details":"Show details"};acts.appendChild(t)}
  const url=get(i,["official_url","apply_url","ApplyURL"]);
  if(url&&/^https?:\/\//i.test(url)){const a=mk("a","Official website");a.href=url;a.target="_blank";a.rel="noopener noreferrer";acts.appendChild(a)}
  const cp=mk("button","Copy","secondary");cp.type="button";cp.onclick=async()=>{
    const t=`${id}\n${benefit?"Benefits: "+benefit+"\n":""}${elig?"Eligibility: "+elig+"\n":""}${url||""}`;
    try{await navigator.clipboard.writeText(t);toast("Copied to clipboard")}catch(e){toast("Copy not available")}};
  acts.appendChild(cp);
  if("speechSynthesis" in window){const r=mk("button","🔊 Read aloud","secondary");r.type="button";r.onclick=()=>{
    speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(`${id}. ${benefit?"Benefits: "+benefit+". ":""}${elig?"Eligibility: "+elig:""}`);
    u.lang=$("voiceLang").value;speechSynthesis.speak(u)};acts.appendChild(r)}
  c.appendChild(acts);return c;
}

function apply(){
  const kw=$("keyword").value.trim().toLowerCase(),st=$("state").value.trim().toLowerCase();
  let d=ALL.filter(i=>{
    if(cat&&catOf(i)!==cat)return false;
    if(savedOnly&&!saved.has(nameOf(i)))return false;
    if(st){const s=stOf(i).toLowerCase();if(!s.includes(st)&&!s.includes("all india"))return false}
    if(kw&&!Object.values(i).some(v=>String(v??"").toLowerCase().includes(kw)))return false;
    return true});
  const so=$("sort").value;
  if(so==="az")d=[...d].sort((a,b)=>nameOf(a).localeCompare(nameOf(b)));
  if(so==="cat")d=[...d].sort((a,b)=>String(catOf(a)).localeCompare(String(catOf(b))));
  resultsEl.replaceChildren();countEl.textContent=`${d.length} result${d.length===1?"":"s"}`;
  if(!d.length){resultsEl.appendChild(mk("div",savedOnly?"You have not saved any matching schemes yet. Tap ★ on a scheme to keep it here.":"No schemes match. Try a shorter keyword, another category, or clear the filters.","empty"));return}
  d.forEach(i=>resultsEl.appendChild(card(i)));
}

async function load(){
  resultsEl.replaceChildren();for(let n=0;n<4;n++)resultsEl.appendChild(mk("div","","sk"));
  statusEl.textContent="Loading schemes…";
  try{
    const r=await fetch(API_URL,{headers:{Accept:"application/json"}});
    const raw=await r.text();if(!r.ok)throw new Error(`HTTP ${r.status}: ${raw.slice(0,200)}`);
    let data=JSON.parse(raw);if(data&&typeof data.body==="string")data=JSON.parse(data.body);
    if(!Array.isArray(data))throw new Error("API response is not a list. Check the Lambda integration.");
    ALL=data;buildChips();apply();statusEl.textContent=`${ALL.length} schemes loaded.`;
  }catch(err){
    resultsEl.replaceChildren();statusEl.textContent=`Could not load schemes: ${err.message}`;
    const e=mk("div","Check that CORS is enabled on the API (allow origin *, GET) and that the route is GET /Schemes with a capital S. ","empty");
    const b=mk("button","Try again","primary");b.type="button";b.onclick=load;e.appendChild(b);resultsEl.appendChild(e);
  }
}

let deb;$("keyword").addEventListener("input",()=>{clearTimeout(deb);deb=setTimeout(apply,250)});
$("state").addEventListener("input",()=>{clearTimeout(deb);deb=setTimeout(apply,250)});
$("keyword").addEventListener("keydown",e=>{if(e.key==="Enter")apply()});
$("searchBtn").onclick=apply;$("sort").onchange=apply;
$("clearBtn").onclick=()=>{$("keyword").value="";$("state").value="";cat="";savedOnly=false;$("savedBtn").setAttribute("aria-pressed","false");$("sort").value="";buildChips();apply()};
$("savedBtn").onclick=()=>{savedOnly=!savedOnly;$("savedBtn").setAttribute("aria-pressed",String(savedOnly));$("savedBtn").className=savedOnly?"primary":"secondary";apply()};
$("themeBtn").onclick=()=>{const d=document.documentElement,n=d.dataset.theme==="dark"?"light":"dark";d.dataset.theme=n;try{localStorage.setItem("ss_theme",n)}catch(e){}};

// Voice search (Web Speech API; best in Chrome/Edge)
const SR=window.SpeechRecognition||window.webkitSpeechRecognition,vb=$("voiceBtn");
if(!SR){vb.disabled=true;vb.textContent="Voice search unavailable";vb.title="Try Chrome or Edge"}
else{
  const rec=new SR();rec.continuous=false;rec.interimResults=false;
  const reset=()=>{vb.disabled=false;vb.classList.remove("on");vb.textContent="🎙 Search by voice"};
  vb.onclick=()=>{rec.lang=$("voiceLang").value;statusEl.textContent="Listening… say a scheme name, category, or state.";
    vb.disabled=true;vb.classList.add("on");vb.textContent="Listening…";
    try{rec.start()}catch(e){reset();statusEl.textContent="Could not start the microphone. Check permissions."}};
  rec.onresult=e=>{const t=e.results[0][0].transcript.trim();$("keyword").value=t;statusEl.textContent=`Heard: “${t}”`;apply()};
  rec.onerror=e=>{statusEl.textContent=e.error==="not-allowed"?"Microphone blocked. Allow access in your browser settings.":`Voice error: ${e.error}. Try again or type your search.`};
  rec.onend=reset;
}
persist();load();
