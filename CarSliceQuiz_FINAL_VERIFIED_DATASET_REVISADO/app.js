const cfg = window.CARSLICE_CONFIG || {};
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const state = { authMode:'login', user:null, online:false, screen:'login', mode:'classic', difficulty:'normal', region:'all', category:'all', questions:[], current:null, round:0, cursor:0, score:0, streak:0, bestRun:0, time:60, timer:null, usedHint:false, hintUsed:{}, noTimer:true, endless:true, continueUses:0, waitingContinue:false, preloadQueue:[], fullImageUsed:false, lastImage:'', lastAnswer:null, lastEndMode:'classic', userSettings:{sounds:true,animations:true,tutorial:false} };
let preloadBusy=false;
const imageMemory=new Map();

const CARS = [
 {brand:'Audi',model:'RS3',region:'euro',rarity:'Epic',query:'Audi RS 3',wiki:['Audi RS 3','Audi A3']},
 {brand:'Audi',model:'R8',region:'supercar',rarity:'Legendary',query:'Audi R8',wiki:['Audi R8']},
 {brand:'Audi',model:'TT',region:'euro',rarity:'Rare',query:'Audi TT',wiki:['Audi TT']},
 {brand:'Audi',model:'Quattro',region:'rally',rarity:'Legendary',query:'Audi Quattro',wiki:['Audi Quattro']},
 {brand:'BMW',model:'M3 E46',region:'euro',rarity:'Legendary',query:'BMW M3',wiki:['BMW M3','BMW 3 Series (E46)']},
 {brand:'BMW',model:'M4',region:'euro',rarity:'Epic',query:'BMW M4',wiki:['BMW M4']},
 {brand:'BMW',model:'M5',region:'euro',rarity:'Epic',query:'BMW M5',wiki:['BMW M5']},
 {brand:'BMW',model:'Z4',region:'euro',rarity:'Rare',query:'BMW Z4',wiki:['BMW Z4']},
 {brand:'Mercedes-Benz',model:'AMG GT',region:'supercar',rarity:'Legendary',query:'Mercedes-AMG GT',wiki:['Mercedes-AMG GT']},
 {brand:'Mercedes-Benz',model:'A45 AMG',region:'euro',rarity:'Epic',query:'Mercedes-AMG A-Class',wiki:['Mercedes-AMG A-Class','Mercedes-Benz A-Class']},
 {brand:'Mercedes-Benz',model:'190E Evo II',region:'classic',rarity:'Legendary',query:'Mercedes-Benz 190E Evolution II',wiki:['Mercedes-Benz W201']},
 {brand:'Volkswagen',model:'Golf GTI',region:'euro',rarity:'Rare',query:'Volkswagen Golf GTI',wiki:['Volkswagen Golf GTI','Volkswagen Golf Mk7']},
 {brand:'Volkswagen',model:'Scirocco',region:'euro',rarity:'Rare',query:'Volkswagen Scirocco',wiki:['Volkswagen Scirocco']},
 {brand:'Volkswagen',model:'Beetle',region:'classic',rarity:'Rare',query:'Volkswagen Beetle',wiki:['Volkswagen Beetle']},
 {brand:'Porsche',model:'911 GT3',region:'supercar',rarity:'Mythic',query:'Porsche 911 GT3',wiki:['Porsche 911 GT3']},
 {brand:'Porsche',model:'Cayman GT4',region:'supercar',rarity:'Legendary',query:'Porsche Cayman',wiki:['Porsche Cayman','Porsche Boxster and Cayman']},
 {brand:'Porsche',model:'Taycan',region:'euro',rarity:'Epic',query:'Porsche Taycan',wiki:['Porsche Taycan']},
 {brand:'Porsche',model:'Carrera GT',region:'supercar',rarity:'Mythic',query:'Porsche Carrera GT',wiki:['Porsche Carrera GT']},
 {brand:'Toyota',model:'Supra MK4',region:'jdm',rarity:'Mythic',query:'Toyota Supra A80',wiki:['Toyota Supra']},
 {brand:'Toyota',model:'GR86',region:'jdm',rarity:'Rare',query:'Toyota GR86',wiki:['Toyota 86','Toyota GR86']},
 {brand:'Toyota',model:'Celica',region:'jdm',rarity:'Rare',query:'Toyota Celica',wiki:['Toyota Celica']},
 {brand:'Toyota',model:'AE86',region:'jdm',rarity:'Legendary',query:'Toyota AE86',wiki:['Toyota AE86']},
 {brand:'Nissan',model:'GT-R R35',region:'jdm',rarity:'Legendary',query:'Nissan GT-R',wiki:['Nissan GT-R']},
 {brand:'Nissan',model:'Silvia S15',region:'jdm',rarity:'Legendary',query:'Nissan Silvia',wiki:['Nissan Silvia']},
 {brand:'Nissan',model:'Skyline R34',region:'jdm',rarity:'Mythic',query:'Nissan Skyline GT-R',wiki:['Nissan Skyline GT-R']},
 {brand:'Nissan',model:'350Z',region:'jdm',rarity:'Rare',query:'Nissan 350Z',wiki:['Nissan 350Z']},
 {brand:'Mazda',model:'RX-7 FD',region:'jdm',rarity:'Legendary',query:'Mazda RX-7',wiki:['Mazda RX-7']},
 {brand:'Mazda',model:'MX-5',region:'jdm',rarity:'Rare',query:'Mazda MX-5',wiki:['Mazda MX-5']},
 {brand:'Mazda',model:'RX-8',region:'jdm',rarity:'Rare',query:'Mazda RX-8',wiki:['Mazda RX-8']},
 {brand:'Honda',model:'NSX',region:'jdm',rarity:'Legendary',query:'Honda NSX',wiki:['Honda NSX']},
 {brand:'Honda',model:'Civic Type R',region:'jdm',rarity:'Epic',query:'Honda Civic Type R',wiki:['Honda Civic Type R']},
 {brand:'Honda',model:'S2000',region:'jdm',rarity:'Legendary',query:'Honda S2000',wiki:['Honda S2000']},
 {brand:'Subaru',model:'Impreza WRX STI',region:'jdm',rarity:'Epic',query:'Subaru Impreza WRX STI',wiki:['Subaru Impreza WRX STI','Subaru Impreza']},
 {brand:'Subaru',model:'BRZ',region:'jdm',rarity:'Rare',query:'Subaru BRZ',wiki:['Subaru BRZ']},
 {brand:'Mitsubishi',model:'Lancer Evolution',region:'jdm',rarity:'Epic',query:'Mitsubishi Lancer Evolution',wiki:['Mitsubishi Lancer Evolution']},
 {brand:'Mitsubishi',model:'3000GT',region:'jdm',rarity:'Epic',query:'Mitsubishi GTO',wiki:['Mitsubishi GTO']},
 {brand:'Ford',model:'Mustang GT',region:'muscle',rarity:'Epic',query:'Ford Mustang',wiki:['Ford Mustang']},
 {brand:'Ford',model:'GT',region:'supercar',rarity:'Mythic',query:'Ford GT',wiki:['Ford GT']},
 {brand:'Ford',model:'Focus RS',region:'euro',rarity:'Rare',query:'Ford Focus RS',wiki:['Ford Focus RS']},
 {brand:'Ford',model:'Escort RS Cosworth',region:'rally',rarity:'Legendary',query:'Ford Escort RS Cosworth',wiki:['Ford Escort RS Cosworth']},
 {brand:'Chevrolet',model:'Camaro SS',region:'muscle',rarity:'Epic',query:'Chevrolet Camaro',wiki:['Chevrolet Camaro']},
 {brand:'Chevrolet',model:'Corvette C8',region:'supercar',rarity:'Legendary',query:'Chevrolet Corvette C8',wiki:['Chevrolet Corvette (C8)']},
 {brand:'Chevrolet',model:'Corvette C7',region:'muscle',rarity:'Epic',query:'Chevrolet Corvette C7',wiki:['Chevrolet Corvette (C7)']},
 {brand:'Dodge',model:'Challenger Hellcat',region:'muscle',rarity:'Legendary',query:'Dodge Challenger SRT Hellcat',wiki:['Dodge Challenger']},
 {brand:'Dodge',model:'Viper',region:'muscle',rarity:'Mythic',query:'Dodge Viper',wiki:['Dodge Viper']},
 {brand:'Dodge',model:'Charger',region:'muscle',rarity:'Epic',query:'Dodge Charger',wiki:['Dodge Charger']},
 {brand:'Lamborghini',model:'Huracan',region:'supercar',rarity:'Mythic',query:'Lamborghini Huracán',wiki:['Lamborghini Huracán']},
 {brand:'Lamborghini',model:'Aventador',region:'supercar',rarity:'Mythic',query:'Lamborghini Aventador',wiki:['Lamborghini Aventador']},
 {brand:'Lamborghini',model:'Gallardo',region:'supercar',rarity:'Legendary',query:'Lamborghini Gallardo',wiki:['Lamborghini Gallardo']},
 {brand:'Ferrari',model:'458 Italia',region:'supercar',rarity:'Mythic',query:'Ferrari 458',wiki:['Ferrari 458']},
 {brand:'Ferrari',model:'F40',region:'supercar',rarity:'Mythic',query:'Ferrari F40',wiki:['Ferrari F40']},
 {brand:'Ferrari',model:'LaFerrari',region:'supercar',rarity:'Mythic',query:'LaFerrari',wiki:['LaFerrari']},
 {brand:'McLaren',model:'720S',region:'supercar',rarity:'Mythic',query:'McLaren 720S',wiki:['McLaren 720S']},
 {brand:'McLaren',model:'P1',region:'supercar',rarity:'Mythic',query:'McLaren P1',wiki:['McLaren P1']},
 {brand:'Bugatti',model:'Chiron',region:'supercar',rarity:'Mythic',query:'Bugatti Chiron',wiki:['Bugatti Chiron']},
 {brand:'Bugatti',model:'Veyron',region:'supercar',rarity:'Mythic',query:'Bugatti Veyron',wiki:['Bugatti Veyron']},
 {brand:'Koenigsegg',model:'Agera',region:'supercar',rarity:'Mythic',query:'Koenigsegg Agera',wiki:['Koenigsegg Agera']},
 {brand:'Renault',model:'Megane RS',region:'euro',rarity:'Rare',query:'Renault Mégane RS',wiki:['Renault Mégane RS']},
 {brand:'Renault',model:'Clio RS',region:'euro',rarity:'Rare',query:'Renault Clio RS',wiki:['Renault Clio RS']},
 {brand:'Renault',model:'5 Turbo',region:'rally',rarity:'Legendary',query:'Renault 5 Turbo',wiki:['Renault 5 Turbo']},
 {brand:'Peugeot',model:'205 GTI',region:'classic',rarity:'Epic',query:'Peugeot 205 GTI',wiki:['Peugeot 205']},
 {brand:'Peugeot',model:'208 GTI',region:'euro',rarity:'Rare',query:'Peugeot 208 GTI',wiki:['Peugeot 208']},
 {brand:'Seat',model:'Leon Cupra',region:'euro',rarity:'Rare',query:'SEAT León Cupra',wiki:['SEAT León']},
 {brand:'Seat',model:'Ibiza Cupra',region:'euro',rarity:'Rare',query:'SEAT Ibiza Cupra',wiki:['SEAT Ibiza']},
 {brand:'Hyundai',model:'i30 N',region:'euro',rarity:'Rare',query:'Hyundai i30 N',wiki:['Hyundai i30 N']},
 {brand:'Hyundai',model:'Veloster N',region:'euro',rarity:'Rare',query:'Hyundai Veloster N',wiki:['Hyundai Veloster']},
 {brand:'Alfa Romeo',model:'Giulia Quadrifoglio',region:'euro',rarity:'Legendary',query:'Alfa Romeo Giulia Quadrifoglio',wiki:['Alfa Romeo Giulia (952)']},
 {brand:'Mini',model:'Cooper S',region:'euro',rarity:'Rare',query:'Mini Cooper S',wiki:['Mini Hatch']},
 {brand:'Lotus',model:'Elise',region:'euro',rarity:'Epic',query:'Lotus Elise',wiki:['Lotus Elise']},
 {brand:'Aston Martin',model:'DB11',region:'supercar',rarity:'Legendary',query:'Aston Martin DB11',wiki:['Aston Martin DB11']},
 {brand:'Jaguar',model:'F-Type',region:'euro',rarity:'Epic',query:'Jaguar F-Type',wiki:['Jaguar F-Type']}
,
 {brand:'Abarth',model:'595 Competizione',region:'euro',rarity:'Rare',query:'Abarth 595',wiki:['Abarth 595']},
 {brand:'Alpine',model:'A110',region:'euro',rarity:'Epic',query:'Alpine A110',wiki:['Alpine A110 (2017)','Alpine A110']},
 {brand:'Aston Martin',model:'Vantage',region:'supercar',rarity:'Legendary',query:'Aston Martin Vantage',wiki:['Aston Martin Vantage']},
 {brand:'Aston Martin',model:'DBS Superleggera',region:'supercar',rarity:'Mythic',query:'Aston Martin DBS Superleggera',wiki:['Aston Martin DBS Superleggera']},
 {brand:'Bentley',model:'Continental GT',region:'supercar',rarity:'Legendary',query:'Bentley Continental GT',wiki:['Bentley Continental GT']},
 {brand:'BMW',model:'M2',region:'euro',rarity:'Epic',query:'BMW M2',wiki:['BMW M2']},
 {brand:'BMW',model:'M3 G80',region:'euro',rarity:'Epic',query:'BMW M3 G80',wiki:['BMW M3','BMW 3 Series (G20)']},
 {brand:'BMW',model:'i8',region:'supercar',rarity:'Legendary',query:'BMW i8',wiki:['BMW i8']},
 {brand:'Bugatti',model:'EB110',region:'supercar',rarity:'Mythic',query:'Bugatti EB110',wiki:['Bugatti EB 110']},
 {brand:'Cadillac',model:'CTS-V',region:'muscle',rarity:'Epic',query:'Cadillac CTS-V',wiki:['Cadillac CTS-V']},
 {brand:'Chevrolet',model:'Corvette C6 Z06',region:'muscle',rarity:'Epic',query:'Chevrolet Corvette C6 Z06',wiki:['Chevrolet Corvette (C6)']},
 {brand:'Citroën',model:'Saxo VTS',region:'hot_hatch',rarity:'Rare',query:'Citroen Saxo VTS',wiki:['Citroën Saxo']},
 {brand:'Citroën',model:'DS3 Racing',region:'hot_hatch',rarity:'Rare',query:'Citroen DS3 Racing',wiki:['Citroën DS3']},
 {brand:'Cupra',model:'Formentor VZ5',region:'euro',rarity:'Epic',query:'Cupra Formentor VZ5',wiki:['Cupra Formentor']},
 {brand:'Datsun',model:'240Z',region:'jdm',rarity:'Legendary',query:'Datsun 240Z',wiki:['Nissan S30']},
 {brand:'Ferrari',model:'488 GTB',region:'supercar',rarity:'Mythic',query:'Ferrari 488 GTB',wiki:['Ferrari 488']},
 {brand:'Ferrari',model:'Enzo',region:'supercar',rarity:'Mythic',query:'Ferrari Enzo',wiki:['Ferrari Enzo']},
 {brand:'Ferrari',model:'Testarossa',region:'supercar',rarity:'Mythic',query:'Ferrari Testarossa',wiki:['Ferrari Testarossa']},
 {brand:'Fiat',model:'Punto GT',region:'hot_hatch',rarity:'Rare',query:'Fiat Punto GT',wiki:['Fiat Punto']},
 {brand:'Fiat',model:'Coupe',region:'euro',rarity:'Rare',query:'Fiat Coupe',wiki:['Fiat Coupé']},
 {brand:'Ford',model:'Fiesta ST',region:'hot_hatch',rarity:'Rare',query:'Ford Fiesta ST',wiki:['Ford Fiesta ST','Ford Fiesta']},
 {brand:'Ford',model:'Sierra RS Cosworth',region:'rally',rarity:'Legendary',query:'Ford Sierra RS Cosworth',wiki:['Ford Sierra RS Cosworth']},
 {brand:'Honda',model:'Integra Type R',region:'jdm',rarity:'Legendary',query:'Honda Integra Type R',wiki:['Honda Integra']},
 {brand:'Honda',model:'Prelude',region:'jdm',rarity:'Rare',query:'Honda Prelude',wiki:['Honda Prelude']},
 {brand:'Hyundai',model:'Elantra N',region:'euro',rarity:'Rare',query:'Hyundai Elantra N',wiki:['Hyundai Elantra N','Hyundai Elantra']},
 {brand:'Jaguar',model:'XJ220',region:'supercar',rarity:'Mythic',query:'Jaguar XJ220',wiki:['Jaguar XJ220']},
 {brand:'Kia',model:'Stinger GT',region:'euro',rarity:'Epic',query:'Kia Stinger GT',wiki:['Kia Stinger']},
 {brand:'Koenigsegg',model:'Jesko',region:'supercar',rarity:'Mythic',query:'Koenigsegg Jesko',wiki:['Koenigsegg Jesko']},
 {brand:'Koenigsegg',model:'Regera',region:'supercar',rarity:'Mythic',query:'Koenigsegg Regera',wiki:['Koenigsegg Regera']},
 {brand:'Lancia',model:'Delta Integrale',region:'rally',rarity:'Mythic',query:'Lancia Delta Integrale',wiki:['Lancia Delta HF Integrale','Lancia Delta']},
 {brand:'Lancia',model:'Stratos',region:'rally',rarity:'Mythic',query:'Lancia Stratos',wiki:['Lancia Stratos']},
 {brand:'Lexus',model:'LFA',region:'supercar',rarity:'Mythic',query:'Lexus LFA',wiki:['Lexus LFA']},
 {brand:'Lexus',model:'RC F',region:'jdm',rarity:'Epic',query:'Lexus RC F',wiki:['Lexus RC']},
 {brand:'Lotus',model:'Exige',region:'euro',rarity:'Epic',query:'Lotus Exige',wiki:['Lotus Exige']},
 {brand:'Maserati',model:'MC20',region:'supercar',rarity:'Legendary',query:'Maserati MC20',wiki:['Maserati MC20']},
 {brand:'Maserati',model:'GranTurismo',region:'euro',rarity:'Epic',query:'Maserati GranTurismo',wiki:['Maserati GranTurismo']},
 {brand:'Mazda',model:'Mazdaspeed3',region:'hot_hatch',rarity:'Rare',query:'Mazdaspeed3',wiki:['Mazdaspeed3','Mazda3']},
 {brand:'McLaren',model:'Senna',region:'supercar',rarity:'Mythic',query:'McLaren Senna',wiki:['McLaren Senna']},
 {brand:'Mercedes-Benz',model:'C63 AMG',region:'euro',rarity:'Epic',query:'Mercedes C63 AMG',wiki:['Mercedes-Benz C-Class (W204)','Mercedes-AMG C 63']},
 {brand:'Mercedes-Benz',model:'SLS AMG',region:'supercar',rarity:'Legendary',query:'Mercedes-Benz SLS AMG',wiki:['Mercedes-Benz SLS AMG']},
 {brand:'Mini',model:'John Cooper Works',region:'hot_hatch',rarity:'Rare',query:'Mini John Cooper Works',wiki:['Mini Hatch']},
 {brand:'Nissan',model:'370Z',region:'jdm',rarity:'Rare',query:'Nissan 370Z',wiki:['Nissan 370Z']},
 {brand:'Nissan',model:'240SX',region:'jdm',rarity:'Epic',query:'Nissan 240SX',wiki:['Nissan 240SX']},
 {brand:'Nissan',model:'Skyline R32',region:'jdm',rarity:'Legendary',query:'Nissan Skyline R32 GT-R',wiki:['Nissan Skyline GT-R']},
 {brand:'Opel',model:'Corsa OPC',region:'hot_hatch',rarity:'Rare',query:'Opel Corsa OPC',wiki:['Opel Corsa']},
 {brand:'Opel',model:'Astra OPC',region:'hot_hatch',rarity:'Rare',query:'Opel Astra OPC',wiki:['Opel Astra']},
 {brand:'Pagani',model:'Zonda',region:'supercar',rarity:'Mythic',query:'Pagani Zonda',wiki:['Pagani Zonda']},
 {brand:'Pagani',model:'Huayra',region:'supercar',rarity:'Mythic',query:'Pagani Huayra',wiki:['Pagani Huayra']},
 {brand:'Peugeot',model:'106 Rallye',region:'hot_hatch',rarity:'Rare',query:'Peugeot 106 Rallye',wiki:['Peugeot 106']},
 {brand:'Peugeot',model:'306 GTI-6',region:'hot_hatch',rarity:'Rare',query:'Peugeot 306 GTI-6',wiki:['Peugeot 306']},
 {brand:'Porsche',model:'918 Spyder',region:'supercar',rarity:'Mythic',query:'Porsche 918 Spyder',wiki:['Porsche 918 Spyder']},
 {brand:'Porsche',model:'959',region:'supercar',rarity:'Mythic',query:'Porsche 959',wiki:['Porsche 959']},
 {brand:'Renault',model:'Clio V6',region:'euro',rarity:'Legendary',query:'Renault Clio V6',wiki:['Renault Clio V6 RS']},
 {brand:'Renault',model:'Twingo RS',region:'hot_hatch',rarity:'Rare',query:'Renault Twingo RS',wiki:['Renault Twingo']},
 {brand:'Seat',model:'Leon FR',region:'hot_hatch',rarity:'Rare',query:'SEAT Leon FR',wiki:['SEAT León']},
 {brand:'Skoda',model:'Octavia RS',region:'euro',rarity:'Rare',query:'Skoda Octavia RS',wiki:['Škoda Octavia']},
 {brand:'Subaru',model:'Legacy GT',region:'jdm',rarity:'Rare',query:'Subaru Legacy GT',wiki:['Subaru Legacy']},
 {brand:'Tesla',model:'Model S Plaid',region:'supercar',rarity:'Legendary',query:'Tesla Model S Plaid',wiki:['Tesla Model S']},
 {brand:'Toyota',model:'MR2',region:'jdm',rarity:'Epic',query:'Toyota MR2',wiki:['Toyota MR2']},
 {brand:'Toyota',model:'Yaris GR',region:'rally',rarity:'Epic',query:'Toyota GR Yaris',wiki:['Toyota GR Yaris']},
 {brand:'Volkswagen',model:'Golf R',region:'hot_hatch',rarity:'Epic',query:'Volkswagen Golf R',wiki:['Volkswagen Golf R']},
 {brand:'Volkswagen',model:'Corrado VR6',region:'classic',rarity:'Rare',query:'Volkswagen Corrado VR6',wiki:['Volkswagen Corrado']},
 {brand:'Volvo',model:'850 R',region:'classic',rarity:'Rare',query:'Volvo 850 R',wiki:['Volvo 850']}

];
const PARTS = [
 {name:'Faro izquierdo',origin:'18% 34%',zoom:2.75},{name:'Morro/parrilla',origin:'50% 36%',zoom:2.55},{name:'Llanta',origin:'25% 78%',zoom:3.1},{name:'Trasera',origin:'78% 52%',zoom:2.75},{name:'Silueta lateral',origin:'50% 55%',zoom:1.95},{name:'Detalle sorpresa',origin:'68% 38%',zoom:3.05}
];
const TITLES = ['Turbo Kid','JDM Hunter','Farero Supremo','Rey del Morro','Nürburgring Rookie','Llantólogo','Garaje Legendario','Anti-Placeholder','Daily Driver','Combo Demon','Clásico Salvaje'];
const BRAND_COUNTRY={Audi:'Alemania',BMW:'Alemania','Mercedes-Benz':'Alemania',Volkswagen:'Alemania',Porsche:'Alemania',Toyota:'Japón',Nissan:'Japón',Mazda:'Japón',Honda:'Japón',Subaru:'Japón',Mitsubishi:'Japón',Ford:'Estados Unidos',Chevrolet:'Estados Unidos',Dodge:'Estados Unidos',Lamborghini:'Italia',Ferrari:'Italia',McLaren:'Reino Unido',Bugatti:'Francia',Koenigsegg:'Suecia',Renault:'Francia',Peugeot:'Francia',Seat:'España',Hyundai:'Corea del Sur','Alfa Romeo':'Italia',Abarth:'Italia',Alpine:'Francia',Bentley:'Reino Unido',Cadillac:'Estados Unidos',Citroën:'Francia',Cupra:'España',Datsun:'Japón',Fiat:'Italia',Kia:'Corea del Sur',Lancia:'Italia',Lexus:'Japón',Maserati:'Italia',Opel:'Alemania',Pagani:'Italia',Skoda:'República Checa',Tesla:'Estados Unidos',Volvo:'Suecia'};
const ACHIEVEMENTS=[
 {id:'first_win',name:'Primer rugido',desc:'Acierta tu primer coche.'},
 {id:'streak_5',name:'Combo x5',desc:'Consigue 5 aciertos seguidos.'},
 {id:'streak_10',name:'Nitro x10',desc:'Consigue 10 aciertos seguidos.'},
 {id:'score_1000',name:'Mil puntos',desc:'Supera 1000 puntos en una partida.'},
 {id:'collector_10',name:'Coleccionista',desc:'Desbloquea 10 coches.'},
 {id:'daily_played',name:'Daily Driver',desc:'Juega un Daily Challenge.'},
 {id:'time_attack',name:'Contra el reloj',desc:'Juega una partida contrarreloj.'},
 {id:'favorite_1',name:'Primer favorito',desc:'Marca un coche como favorito.'},
 {id:'play_5',name:'Piloto constante',desc:'Juega 5 partidas.'},
 {id:'streak_20',name:'Nitro x20',desc:'Consigue 20 aciertos seguidos.'},
 {id:'full_reveal',name:'Rayos X',desc:'Usa la imagen completa durante una ronda.'}
];
function enrichCars(){
 CARS.forEach(c=>{
   c.country=BRAND_COUNTRY[c.brand]||'Desconocido';
   const text=(c.model+' '+c.query).toLowerCase();
   c.year=text.includes('e46')?'2000-2006':text.includes('mk4')||text.includes('a80')?'1993-2002':text.includes('r34')?'1999-2002':text.includes('f40')?'1987-1992':text.includes('205')?'1984-1994':'Moderno';
   c.type=c.region==='supercar'?'Superdeportivo':c.region==='muscle'?'Muscle car':/gti|cupra|rs|type r|i30|focus|a45|clio|208|scirocco|golf/i.test(c.model)?'Hot hatch':/wrx|evolution|impreza|lancer|celica/i.test(c.model)?'Rally/Deportivo':'Deportivo';
   c.category=c.region;
   if(/gti|cupra|rs|type r|i30|focus|a45|clio|208|scirocco|golf|megane/i.test(c.model)) c.category='hot_hatch';
   if(/wrx|evolution|impreza|lancer|celica|focus rs/i.test(c.model)) c.rally=true;
   if(/f40|205|e46|mk4|r34|rx-7|s15|3000gt|viper/i.test(c.model)) c.classic=true;
 });
}
enrichCars();

function local(){return JSON.parse(localStorage.carslice||'{}')}function saveLocal(v){localStorage.carslice=JSON.stringify(v)}
function loadSettings(){try{return JSON.parse(localStorage.carsliceSettings||'{}')}catch{return {}}}
function saveSettings(v){localStorage.carsliceSettings=JSON.stringify(v)}
function applySettings(){const st={sounds:true,animations:true,tutorial:false,...loadSettings(),...(state.userSettings||{})};state.userSettings=st;cfg.ENABLE_SOUNDS=!!st.sounds;document.body.classList.toggle('low-motion',!st.animations);if($('#setting-sounds'))$('#setting-sounds').checked=!!st.sounds;if($('#setting-animations'))$('#setting-animations').checked=!!st.animations;if($('#setting-tutorial'))$('#setting-tutorial').checked=!!st.tutorial}
function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2200)}
function setLoading(on,text='Precargando imágenes reales...',pct=25){const o=$('#loading-overlay');if(!o)return;o.classList.toggle('hidden',!on);$('#loading-text').textContent=text;$('#loading-fill').style.width=Math.max(6,Math.min(100,pct))+'%'}
function show(id){$$('.screen').forEach(s=>s.classList.remove('active'));$('#screen-'+id).classList.add('active');$$('.nav').forEach(n=>n.classList.toggle('active',n.dataset.go===id));state.screen=id;if(id==='home')renderHome();if(id==='profile')renderProfile();if(id==='garage')renderGarage();if(id==='daily')renderDaily();if(id==='ranking')renderRanking();if(id==='history')renderHistory();if(id==='settings')renderSettings();if(id==='help')renderHelp()}
function beep(type='ok'){if(!cfg.ENABLE_SOUNDS)return;try{const ac=new AudioContext();const o=ac.createOscillator();const g=ac.createGain();o.connect(g);g.connect(ac.destination);o.type=type==='bad'?'sawtooth':'triangle';o.frequency.value=type==='bad'?140:type==='win'?620:360;g.gain.setValueAtTime(.05,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+.18);o.start();o.stop(ac.currentTime+.18)}catch{}}
async function api(path,opt={}){if(!cfg.SUPABASE_URL||!cfg.SUPABASE_ANON_KEY||!cfg.ENABLE_SUPABASE)throw Error('offline');const r=await fetch(`${cfg.SUPABASE_URL}/rest/v1/${path}`,{...opt,headers:{apikey:cfg.SUPABASE_ANON_KEY,Authorization:`Bearer ${cfg.SUPABASE_ANON_KEY}`,'Content-Type':'application/json',Prefer:'return=representation',...(opt.headers||{})}});if(!r.ok)throw Error(await r.text());return r.status===204?null:r.json()}
function getPendingSaves(){try{return JSON.parse(localStorage.carslicePendingSaves||'[]')}catch{return []}}
function setPendingSaves(v){localStorage.carslicePendingSaves=JSON.stringify(v)}
function queuePendingSave(payload){const q=getPendingSaves();q.unshift({...payload,queuedAt:new Date().toISOString()});setPendingSaves(q.slice(0,20))}
async function saveGameToSupabase(userPayload,game){
  await api(`usuarios?nombre=eq.${encodeURIComponent(userPayload.nombre)}`,{method:'PATCH',body:JSON.stringify({puntos:userPayload.puntos,racha_max:userPayload.racha_max,stats:userPayload.stats})});
  await api('partidas',{method:'POST',body:JSON.stringify(game)});
}
async function syncPendingSaves(){
  const q=getPendingSaves();
  if(!q.length||!state.user||!state.online)return;
  const left=[];let ok=0;
  for(const item of q.reverse()){
    try{await saveGameToSupabase(item.userPayload,item.game);ok++;}
    catch(e){left.push(item)}
  }
  setPendingSaves(left.reverse());
  if(ok)toast(`Partidas pendientes sincronizadas: ${ok}`);
}
function friendlyDbError(e){
  const msg = String(e?.message || e || '');
  if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
    return 'No se puede conectar con Supabase. Revisa internet, la URL y la ANON KEY de config.js.';
  }
  if (msg.includes('permission denied') || msg.includes('row-level security') || msg.includes('policy')) {
    return 'Supabase está bloqueando la tabla por RLS. Ejecuta supabase.sql completo en SQL Editor.';
  }
  if (msg.includes('column') || msg.includes('relation') || msg.includes('schema cache')) {
    return 'Faltan columnas o tablas en Supabase. Ejecuta supabase.sql completo otra vez.';
  }
  if (msg.includes('duplicate key') || msg.includes('usuarios_nombre_key')) {
    return 'Ese usuario ya existe. Cambia a Entrar o usa otro nombre.';
  }
  return msg || 'Error desconocido conectando con Supabase.';
}

async function login(){
  const name=$('#auth-name').value.trim();
  const pass=$('#auth-pass').value.trim();
  if(!name||!pass)return toast('Pon usuario y contraseña');

  // IMPORTANTE: ya NO entra en modo local automáticamente si falla Supabase.
  // Antes parecía que la base de datos funcionaba, pero realmente creaba usuarios locales.
  try{
    if(state.authMode==='register'){
      const exists=await api(`usuarios?nombre=eq.${encodeURIComponent(name)}&select=nombre&limit=1`);
      if(exists.length) return toast('Ese usuario ya existe. Cambia a Entrar.');
      const u=await api('usuarios',{method:'POST',body:JSON.stringify({nombre:name,password:pass,puntos:0,racha_max:0,stats:{games:0,correct:0,total:0,bestScore:0,titles:['Turbo Kid'],collection:[],achievements:[],favorites:[],history:[],modeStats:{}}})});
      state.user=u[0];
      state.online=true;
      toast('Cuenta creada en Supabase');
    }else{
      const u=await api(`usuarios?nombre=eq.${encodeURIComponent(name)}&select=*`);
      if(!u.length) return toast('Usuario no existe. Pulsa Registro para crearlo.');
      if(String(u[0].password)!==String(pass)) return toast('Contraseña incorrecta');
      state.user=u[0];
      state.online=true;
      toast('Conectado a Supabase');
    }
    afterLogin();
  }catch(e){
    console.error('Error Supabase:', e);
    state.online=false;
    toast(friendlyDbError(e));
  }
}

function enterOffline(){toast('Modo local desactivado: ahora el juego usa Supabase obligatorio.')}

function afterLogin(){state.user.stats=typeof state.user.stats==='string'?JSON.parse(state.user.stats):state.user.stats;state.user.stats??={games:0,correct:0,total:0,bestScore:0,titles:['Turbo Kid'],collection:[],achievements:[],modeStats:{}};state.user.stats.titles??=['Turbo Kid'];state.user.stats.collection??=[];state.user.stats.achievements??=[];state.user.stats.modeStats??={};state.user.stats.favorites??=[];state.user.stats.history??=[];applySettings();$('#welcome-user').textContent=state.user.nombre;show('home');warmImageCache();maybeShowTutorial();syncPendingSaves()}
function logout(){state.user=null;clearInterval(state.timer);show('login')}
function pool(){let p=CARS;
 if(state.mode==='region'&&state.region!=='all')p=p.filter(c=>c.region===state.region);
 if(state.mode==='category'&&state.category!=='all'){
   if(state.category==='rally') p=p.filter(c=>c.rally);
   else if(state.category==='classic') p=p.filter(c=>c.classic);
   else p=p.filter(c=>c.category===state.category||c.region===state.category);
 }
 return [...p].sort(()=>Math.random()-.5)}
function dailyId(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function dailyCar(){const d=new Date();const seed=d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();return CARS[seed%CARS.length]}
function dailyPool(){const d=new Date();const seed=d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();return [...CARS].map((car,i)=>({car,sort:Math.sin(seed+i*999)*10000})).sort((a,b)=>a.sort-b.sort).map(x=>x.car)}
async function start(mode){
 state.mode=mode;state.difficulty=$('#difficulty-select').value;state.region=$('#region-select')?.value||'all';state.category=$('#category-select')?.value||'all';
 state.score=0;state.streak=0;state.bestRun=0;state.round=0;state.cursor=0;state.usedHint=false;state.hintUsed={};state.endless=true;state.noTimer=mode!=='time';state.continueUses=0;state.waitingContinue=false;state.preloadQueue=[];state.fullImageUsed=false;state.lastImage='';state.lastAnswer=null;state.lastEndMode=mode;
 state.questions=mode==='daily'?dailyPool():pool();if(!state.questions.length){toast('Esa categoría está vacía, usando todos los coches');state.category='all';state.questions=pool();}
 state.time=60;$('#game-mode-label').textContent={classic:'Clásico infinito',time:'Contrarreloj',parts:'Solo piezas infinito',region:'Regiones infinito',category:'Categoría infinita',daily:'Daily Challenge infinito'}[mode] || 'Modo infinito';
 show('game');clearInterval(state.timer);state.timer=null;$('#timer').textContent=state.noTimer?'∞':state.time;
 const btnContinue=$('#btn-continue');if(btnContinue)btnContinue.classList.add('hidden');const btnFull=$('#btn-full-image');if(btnFull){btnFull.disabled=true;btnFull.textContent='Ver imagen completa -100'}
 $('#feedback').className='feedback';$('#feedback').textContent='Preparando imágenes para que la partida vaya más rápida...';$('#round-label').textContent='Calentando garaje...';
 setLoading(true,'Buscando fotos reales y preparando varias rondas...',20);
 await schedulePreload(5,true);
 schedulePreload(20);
 setLoading(true,'Listo. Arrancando partida...',92);
 setTimeout(()=>setLoading(false),250);
 nextRound();if(!state.noTimer){state.timer=setInterval(tick,1000)}
}
function tick(){if(state.noTimer)return;state.time--;$('#timer').textContent=state.time;if(state.time<=0)finishGame()}

function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
function loadImageOk(url,timeout=6500){
 return new Promise(resolve=>{
   if(!url)return resolve(null);
   const img=new Image();
   let done=false;
   const finish=v=>{if(done)return;done=true;resolve(v)};
   const t=setTimeout(()=>finish(null),timeout);
   img.onload=()=>{clearTimeout(t);
     const w=img.naturalWidth||0,h=img.naturalHeight||0;
     finish(w>=650 && h>=360 && w/h>=1.15 ? url : null);
   };
   img.onerror=()=>{clearTimeout(t);finish(null)};
   img.referrerPolicy='no-referrer';
   img.src=url;
 });
}
function filePathUrl(name,width=2400){return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(name)}?width=${width}`}
// No guardamos imágenes locales: el juego construye una lista de fotos reales desde Wikipedia/Wikimedia,
// las filtra, las valida y luego rota entre varias para que no salga siempre la misma.
const DIRECT_IMAGES = {};
const PAGE_TITLES = Object.fromEntries(CARS.map(c => [`${c.brand} ${c.model}`, c.wiki || [c.query]]));
const imagePoolMemory=new Map();
function carId(car){return `${car.brand||''} ${car.model||''}`.trim()}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function cleanWikiThumb(url,size=2200){
 if(!url)return '';
 let u=String(url);
 u=u.replace(/\/thumb\/([^/]+)\/([^/]+)\/\d+px-[^/?#]+/,'/$1/$2');
 u=u.replace(/\/\d+px-[^/?#]+(?=\?|$)/,'');
 if(u.includes('/thumb/')) u=u.replace(/\/\d+px-/,'/'+size+'px-');
 return u;
}
function isBadImage(url='',title=''){
 const x=(url+' '+title).toLowerCase();
 return /\.svg(\?|$)|\.pdf(\?|$)|\.gif(\?|$)|\.tif|\.tiff|document|manual|brochure|scan|crash|test|report|logo|emblem|badge|icon|diagram|map|drawing|interior|engine|wheel|rim|seat|dashboard|instrument|publication|highway|transportation|library|side_impact|side-impact|vin|number_plate|license_plate|police|accident|chart|graph/.test(x);
}
function looksLikeThisCar(url='',car){
 const x=norm(url);
 const brand=norm(car.brand).split(' ')[0];
 const modelParts=norm(car.model).split(' ').filter(w=>w.length>=2 && !['mk4','e46','r35','fd','ss','gt'].includes(w));
 return x.includes(brand) || modelParts.some(w=>x.includes(w));
}
async function wikiPageImages(title,car){
 const out=[];
 try{
   const url=`https://en.wikipedia.org/w/api.php?origin=*&action=query&generator=images&titles=${encodeURIComponent(title)}&gimlimit=60&prop=imageinfo&iiprop=url|mime|size&iiurlwidth=2200&format=json`;
   const j=await fetch(url,{cache:'force-cache'}).then(r=>r.json());
   for(const page of Object.values(j.query?.pages||{})){
     const info=page.imageinfo?.[0];
     const mime=info?.mime||'';
     const src=info?.thumburl || info?.url;
     const name=page.title||'';
     if(!src || !/^image\/(jpeg|png|webp)$/i.test(mime)) continue;
     if(isBadImage(src,name)) continue;
     if((info.width||0)<700 || (info.height||0)<360) continue;
     if((info.width||1)/(info.height||1)<1.05) continue;
     // Preferimos fotos cuyo nombre contiene marca/modelo, pero no excluimos todo: algunas fotos buenas tienen nombre genérico.
     out.push({url:cleanWikiThumb(src),score:looksLikeThisCar(src+' '+name,car)?3:1});
   }
 }catch{}
 return out;
}
async function wikiMainImage(title,car){
 const out=[];
 try{
   const url=`https://en.wikipedia.org/w/api.php?origin=*&action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=2200`;
   const j=await fetch(url,{cache:'force-cache'}).then(r=>r.json());
   for(const page of Object.values(j.query?.pages||{})){
     const src=page.thumbnail?.source || page.original?.source;
     if(src && !isBadImage(src,page.title||'')) out.push({url:cleanWikiThumb(src),score:4});
   }
 }catch{}
 return out;
}
async function fetchExactPageImage(title){
 // Fuente exacta: solo la imagen principal de la página concreta del coche.
 // Así evitamos galerías abiertas que metían PDFs, logos, informes o coches incorrectos.
 const urls=[];
 try{
   const api=`https://en.wikipedia.org/w/api.php?origin=*&action=query&titles=${encodeURIComponent(title)}&prop=pageimages|pageprops&format=json&pithumbsize=2400&pilicense=any`;
   const j=await fetch(api,{cache:'force-cache'}).then(r=>r.json());
   for(const page of Object.values(j.query?.pages||{})){
     if(page.thumbnail?.source) urls.push(cleanWikiThumb(page.thumbnail.source,2400));
     if(page.original?.source) urls.push(cleanWikiThumb(page.original.source,2400));
   }
 }catch{}
 return urls;
}
async function fetchExactCommonsFiles(title,car){
 // Segunda fuente exacta: ficheros asociados a la página concreta, pero con filtro fuerte.
 const out=[];
 try{
   const api=`https://en.wikipedia.org/w/api.php?origin=*&action=query&generator=images&titles=${encodeURIComponent(title)}&gimlimit=35&prop=imageinfo&iiprop=url|mime|size&iiurlwidth=2400&format=json`;
   const j=await fetch(api,{cache:'force-cache'}).then(r=>r.json());
   for(const page of Object.values(j.query?.pages||{})){
     const info=page.imageinfo?.[0];
     const src=info?.thumburl || info?.url;
     const name=page.title || '';
     const mime=info?.mime || '';
     if(!src || !/^image\/(jpeg|jpg|png|webp)$/i.test(mime)) continue;
     if(isBadImage(src,name)) continue;
     if((info.width||0)<900 || (info.height||0)<420) continue;
     if((info.width||1)/(info.height||1)<1.05) continue;
     // Filtro de coincidencia: debe contener marca o parte importante del modelo.
     if(!looksLikeThisCar(src+' '+name+' '+title,car)) continue;
     out.push(cleanWikiThumb(src,2400));
   }
 }catch{}
 return out;
}
async function collectWikiCandidates(car){
 const id=carId(car);
 const titles=[...(car.wiki||[]), car.query, `${car.brand} ${car.model}`].filter(Boolean);
 const unique=[...new Set(titles)];
 const candidates=[];
 for(const title of unique){
   const main=await fetchExactPageImage(title);
   candidates.push(...main);
   const files=await fetchExactCommonsFiles(title,car);
   candidates.push(...files);
 }
 const seen=new Set();
 return candidates
   .filter(Boolean)
   .filter(u=>!isBadImage(u,id))
   .filter(u=>{const k=u.split('?')[0]; if(seen.has(k)) return false; seen.add(k); return true;})
   .slice(0,10);
}
async function getImagePool(car){
 const id=carId(car);
 const key='img_pool_v10_verified_exact_'+id;
 if(imagePoolMemory.has(id)) return imagePoolMemory.get(id);
 // No usamos cachés antiguas para evitar fotos malas guardadas de versiones anteriores.
 const candidates=await collectWikiCandidates(car);
 const firstWave=shuffle(candidates).slice(0,10);
 const checked=await Promise.allSettled(firstWave.map(url=>loadImageOk(url,1800)));
 let valid=checked.map(r=>r.status==='fulfilled'?r.value:null).filter(Boolean);
 valid=[...new Set(valid)];
 if(!valid.length) throw Error('Sin imagen válida para '+id);
 valid=shuffle(valid).slice(0,6);
 try{localStorage.setItem(key,JSON.stringify(valid));}catch{sessionStorage.setItem(key,JSON.stringify(valid));}
 imagePoolMemory.set(id,valid);
 return valid;
}
async function getImage(car){
 const id=carId(car);
 const pool=await getImagePool(car);
 let choices=pool.filter(u=>u!==state.lastImage);
 if(!choices.length) choices=pool;
 const url=choices[Math.floor(Math.random()*choices.length)];
 imageMemory.set(id,url);
 return url;
}
async function findNextPlayable(){
 let tries=0;
 if(!state.questions.length)state.questions=state.mode==='daily'?dailyPool():pool();
 while(tries < Math.max(80, state.questions.length*2)){
   if(state.cursor>=state.questions.length){
     state.questions=state.mode==='daily'?dailyPool():pool();
     state.cursor=0;
   }
   const car=state.questions[state.cursor++];
   tries++;
   try{return {car,image:await getImage(car)}}catch(e){console.warn(e.message)}
 }
 throw Error('No se pudo cargar una imagen verificada. El coche se saltará sin contar ronda.');
}
async function schedulePreload(target=10, wait=false){
 if(preloadBusy && !wait)return;
 preloadBusy=true;
 const work=(async()=>{
   try{
     state.preloadQueue??=[];
     const batch=[];
     while(state.preloadQueue.length + batch.length < target){
       if(!state.questions?.length) state.questions=state.mode==='daily'?dailyPool():pool();
       if(state.cursor>=state.questions.length){
         state.questions=state.mode==='daily'?dailyPool():pool();
         state.cursor=0;
       }
       const car=state.questions[state.cursor++];
       if(!car)break;
       if(state.preloadQueue.some(x=>carId(x.car)===carId(car)) || batch.some(x=>carId(x)===carId(car))) continue;
       batch.push(car);
       if(batch.length>=10)break;
     }
     const loaded=await Promise.allSettled(batch.map(async car=>({car,image:await getImage(car)})));
     for(const r of loaded){
       if(r.status==='fulfilled' && r.value?.image && !state.preloadQueue.some(x=>carId(x.car)===carId(r.value.car))) state.preloadQueue.push(r.value);
     }
     if(state.preloadQueue.length<Math.min(3,target) && batch.length){
       // Segundo intento suave por si Wikimedia ha rechazado algún coche concreto.
       await sleep(80);
     }
   }catch(e){console.warn('Precarga detenida:',e.message)}
   finally{preloadBusy=false}
 })();
 if(wait) await work; if(wait) setLoading(true,`Imágenes preparadas: ${state.preloadQueue.length}`,80);
}
async function warmImageCache(){
 if(preloadBusy)return;
 preloadBusy=true;
 try{
   const warm=[...CARS].sort(()=>Math.random()-.5).slice(0,18);
   await Promise.allSettled(warm.map(car=>getImage(car)));
 }finally{preloadBusy=false}
}
async function getPlayableCar(){
 state.preloadQueue??=[];
 if(state.preloadQueue.length){
   const next=state.preloadQueue.shift();
   schedulePreload(20);
   return next;
 }
 const playable=await findNextPlayable();
 schedulePreload(20);
 return playable;
}
async function nextRound(){
 state.usedHint=false;state.hintUsed={};state.waitingContinue=false;state.fullImageUsed=false;
 const btnContinue=$('#btn-continue');if(btnContinue)btnContinue.classList.add('hidden');
 const btnFull=$('#btn-full-image');if(btnFull){btnFull.disabled=true;btnFull.textContent='Ver imagen completa -100'}
 const img=$('#car-img');
 $('#brand-input').value='';$('#model-input').value='';
 $('#feedback').className='feedback';
 $('#feedback').textContent='Cargando imagen real...';
 $('#round-label').textContent=`Preparando ronda ${state.round+1}...`;
 const part=PARTS[Math.floor(Math.random()*PARTS.length)];
 $('#part-badge').textContent=state.mode==='parts'?part.name:'Detalle: '+part.name;
 const blur=0;
 const zoom=state.difficulty==='easy'?Math.max(1.02,part.zoom-1.55):state.difficulty==='normal'?Math.max(1.10,part.zoom-1.08):Math.max(1.24,part.zoom-.58);
 img.style.setProperty('--origin',part.origin);img.style.setProperty('--zoom',zoom);img.style.setProperty('--blur',blur+'px');
 img.classList.add('loading');
 img.removeAttribute('src');
 try{
   const showPlayable = (playable)=>{
     state.current=playable.car;state.lastImage=playable.image;state.lastAnswer=playable.car;
     let counted=false;
     img.onload=()=>{
       img.classList.remove('loading');
       if(!counted){
         counted=true;
         state.round++;
         $('#round-label').textContent=`Ronda ${state.round} · hasta que falles`;
         $('#feedback').textContent=state.mode==='time'?'Contrarreloj: solo acaba si fallas o se agota el tiempo.':'Modo infinito: la partida acaba cuando falles.';
         const btnFull=$('#btn-full-image');if(btnFull){btnFull.disabled=false;btnFull.textContent='Ver imagen completa -100'}
         updateFavoriteButton();updateHud();schedulePreload(20);
       }
     };
     img.onerror=async()=>{
       img.classList.add('loading');
       toast('Imagen caída. Buscando otra sin contar ronda...');
       $('#round-label').textContent=`Preparando ronda ${state.round+1}...`;
       $('#feedback').textContent='Esa foto falló al cargar. Buscando otra imagen real...';
       try{const p=await getPlayableCar(); showPlayable(p);}catch{ $('#feedback').className='feedback bad'; $('#feedback').textContent='No se pudo encontrar otra imagen válida.'; }
     };
     img.src=playable.image;
   };
   const playable=await getPlayableCar();
   showPlayable(playable);
 }catch(e){
   $('#feedback').className='feedback bad';
   $('#feedback').textContent=e.message;
   toast('No se pudieron cargar imágenes reales');
 }
 updateHud();fillLists();
}
function normalize(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/&/g,'and').replace(/[^a-z0-9]/g,'')}
const BRAND_ALIASES={
 'Mercedes-Benz':['mercedes','mercedesbenz','amg'],
 'Volkswagen':['vw','volkswagen'],
 'Chevrolet':['chevy','chevrolet'],
 'Lamborghini':['lambo','lamborghini'],
 'Alfa Romeo':['alfa','alfaromeo'],
 'BMW':['bmw'],
 'Audi':['audi'],
 'Porsche':['porsche']
};
const MODEL_ALIASES={
 'GT-R R35':['gtr','gtrr35','r35','nissangtr'],
 'Supra MK4':['supra','mk4','a80','supramk4'],
 'M3 E46':['m3','e46','m3e46'],
 'RX-7 FD':['rx7','fd','rx7fd'],
 'Civic Type R':['civic','typer','civictyper'],
 'Impreza WRX STI':['impreza','wrx','sti','wrxsti'],
 'Lancer Evolution':['evo','lancer','lancerevolution'],
 '911 GT3':['911','gt3','911gt3'],
 'Cayman GT4':['cayman','gt4','caymangt4'],
 'AMG GT':['amggt','gt'],
 'Golf GTI':['golf','gti','golfgti'],
 'Leon Cupra':['leon','cupra','leoncupra'],
 'Megane RS':['megane','rs','meganers'],
 '205 GTI':['205','gti','205gti'],
 'i30 N':['i30','i30n'],
 'Giulia Quadrifoglio':['giulia','quadrifoglio'],
 'TT':['tt','auditt'], 'M5':['m5','bmwm5'], 'A45 AMG':['a45','a45amg','amga45'], 'Scirocco':['scirocco'], 'Taycan':['taycan'],
 'Celica':['celica'], 'Skyline R34':['r34','skyline','skyliner34','gtrr34'], 'RX-8':['rx8'], 'S2000':['s2000'], 'BRZ':['brz'], '3000GT':['3000gt','gto'],
 'Focus RS':['focus','focusrs'], 'Corvette C7':['c7','corvettec7'], 'Charger':['charger'], 'Gallardo':['gallardo'], 'LaFerrari':['laferrari'], 'P1':['p1','mclarenp1'], 'Veyron':['veyron'],
 'Clio RS':['clio','cliors'], '208 GTI':['208','208gti'], 'Ibiza Cupra':['ibiza','cupra','ibizacupra'], 'Veloster N':['veloster','velostern']
};
function acceptedValues(main,map){return [main,...(map[main]||[])].map(normalize).filter(Boolean)}
function answerMatches(input,correct,map){
 const v=normalize(input); if(!v)return false;
 const vals=acceptedValues(correct,map);
 return vals.some(x=>v===x || (v.length>=3 && x.startsWith(v)) || (v.length>=4 && x.includes(v)));
}
function revealFullCurrent(label='Imagen completa'){
 const img=$('#car-img');
 if(!img)return;
 img.style.setProperty('--origin','50% 50%');
 img.style.setProperty('--zoom','1');
 img.style.setProperty('--blur','0px');
 $('#part-badge').textContent=label;
 const btn=$('#btn-full-image');
 if(btn){btn.disabled=true;btn.textContent='Imagen completa mostrada'}
}
function check(){
 if(state.waitingContinue||!state.current)return;
 const b=$('#brand-input').value,m=$('#model-input').value;
 const ok=answerMatches(b,state.current.brand,BRAND_ALIASES)&&answerMatches(m,state.current.model,MODEL_ALIASES);
 if(ok){
   const base=state.difficulty==='hard'?150:state.difficulty==='normal'?100:70;
   const bonus=state.streak*10;
   const gained=Math.max(10,base+bonus-(state.usedHint?25:0));
   state.score+=gained;state.streak++;state.bestRun=Math.max(state.bestRun,state.streak);state.user.stats.correct++;unlockCar(state.current);updateAchievements();
   $('#feedback').className='feedback good combo-'+comboTier();
   $('#feedback').textContent=`Correcto: ${state.current.brand} ${state.current.model}. +${gained} puntos${comboText()}`;
   beep('ok');pulseCombo();setTimeout(nextRound,750);
 }else{
   state.streak=0;state.waitingContinue=true;
   revealFullCurrent('Solución completa');
   $('#feedback').className='feedback bad';
   $('#feedback').textContent=`Fallaste. Era ${state.current.brand} ${state.current.model}. Puedes continuar gastando puntos o terminar la partida.`;
   showContinueOption();beep('bad');
 }
 state.user.stats.total++;updateHud();
}
function spendHint(key,cost,text){if(!state.current||state.waitingContinue)return;if(state.hintUsed[key])return toast('Ya usaste esa pista');state.hintUsed[key]=true;state.usedHint=true;state.score=Math.max(0,state.score-cost);$('#feedback').className='feedback';$('#feedback').textContent=text;updateHud()}
function hint(){spendHint('initials',25,`Pista: ${state.current.brand[0]}... / ${state.current.model[0]}...`)}
function hintCountry(){spendHint('country',50,`País de la marca: ${state.current.country}.`)}
function hintYear(){spendHint('year',75,`Época aproximada: ${state.current.year}.`)}
function hintType(){spendHint('type',50,`Tipo de coche: ${state.current.type}.`)}
function reveal(){if(state.waitingContinue)return;state.streak=0;state.waitingContinue=true;revealFullCurrent('Solución completa');$('#feedback').className='feedback bad';$('#feedback').textContent=`Era ${state.current.brand} ${state.current.model}. Puedes continuar gastando puntos o terminar.`;showContinueOption();beep('bad')}
function showFullImage(){
 if(!state.current||state.fullImageUsed||state.waitingContinue)return;
 state.fullImageUsed=true;
 state.score=Math.max(0,state.score-100);
 const img=$('#car-img');
 img.style.setProperty('--origin','50% 50%');
 img.style.setProperty('--zoom','1');
 img.style.setProperty('--blur','0px');
 const btn=$('#btn-full-image');if(btn){btn.disabled=true;btn.textContent='Imagen completa usada'}
 $('#part-badge').textContent='Imagen completa';
 $('#feedback').className='feedback';
 $('#feedback').textContent='Has visto el coche completo. Penalización: -100 puntos.';
 unlockAchievement('full_reveal');updateHud();
}
function updateHud(){$('#score').textContent=state.score;$('#streak').textContent=state.streak;$('#timer').textContent=state.noTimer?'∞':state.time;$('#game-progress').style.width=Math.min(100,(state.round%20)*5)+'%'}
function continueCost(){return [1000,2500,5000,9000][state.continueUses]||15000}
function showContinueOption(){const btn=$('#btn-continue');if(!btn)return;btn.textContent=`Continuar por ${continueCost()} pts`;btn.classList.remove('hidden')}
function continueGame(){const cost=continueCost();const available=(state.user.puntos||0)+state.score;if(available<cost)return toast('No tienes puntos suficientes para continuar');if(state.score>=cost){state.score-=cost}else{const rest=cost-state.score;state.score=0;state.user.puntos=Math.max(0,(state.user.puntos||0)-rest)}state.continueUses++;state.waitingContinue=false;const btn=$('#btn-continue');if(btn)btn.classList.add('hidden');toast('Has continuado la partida');nextRound()}
function comboTier(){return state.streak>=30?'god':state.streak>=20?'nitro':state.streak>=10?'fire':state.streak>=5?'boost':'normal'}
function comboText(){if(state.streak>=30)return ' · CAR GOD';if(state.streak>=20)return ' · NITRO x20';if(state.streak>=10)return ' · COMBO x10';if(state.streak>=5)return ' · BOOST x5';return ''}
function pulseCombo(){const tier=comboTier();if(tier==='normal')return;document.body.classList.remove('combo-boost','combo-fire','combo-nitro','combo-god');document.body.classList.add('combo-'+tier);setTimeout(()=>document.body.classList.remove('combo-'+tier),650)}
async function finishGame(){
 clearInterval(state.timer);beep('win');
 state.user.puntos=(state.user.puntos||0)+state.score;
 state.user.racha_max=Math.max(state.user.racha_max||0,state.bestRun);
 state.user.stats.games++;
 state.user.stats.bestScore=Math.max(state.user.stats.bestScore||0,state.score);
 state.user.stats.modeStats??={};
 const ms=state.user.stats.modeStats[state.mode]||{games:0,bestScore:0,bestStreak:0};
 ms.games++;ms.bestScore=Math.max(ms.bestScore||0,state.score);ms.bestStreak=Math.max(ms.bestStreak||0,state.bestRun);state.user.stats.modeStats[state.mode]=ms;
 updateAchievements(true);
 const game={usuario:state.user.nombre,puntos:state.score,racha:state.bestRun,modo:state.mode,daily_id:state.mode==='daily'?dailyId():null,fecha:new Date().toISOString()};
 state.user.stats.history??=[];state.user.stats.history.unshift({...game,coche:state.lastAnswer?state.lastAnswer.brand+' '+state.lastAnswer.model:''});state.user.stats.history=state.user.stats.history.slice(0,30);
 const userPayload={nombre:state.user.nombre,puntos:state.user.puntos,racha_max:state.user.racha_max,stats:state.user.stats};
 try{
   if(!state.online) throw Error('No hay sesión online activa');
   await saveGameToSupabase(userPayload,game);
   toast(`Partida guardada en Supabase: ${state.score} pts, racha ${state.bestRun}`);
 }catch(e){
   console.error('No se pudo guardar en Supabase:',e);
   queuePendingSave({userPayload,game});
   toast('No se pudo guardar ahora. Queda pendiente y se sincronizará al volver a entrar.');
 }
 showEndModal();
}
function persistLocalGame(game={usuario:state.user.nombre,puntos:state.score,racha:state.bestRun,modo:state.mode,daily_id:state.mode==='daily'?dailyId():null}){let db=local();db.users??={};db.users[state.user.nombre]=state.user;db.games??=[];db.games.unshift({...game,fecha:new Date().toISOString()});saveLocal(db)}
function unlockCar(car){const id=car.brand+' '+car.model;state.user.stats.collection??=[];if(!state.user.stats.collection.includes(id))state.user.stats.collection.push(id);if(state.user.stats.correct>=10&&!state.user.stats.titles.includes('Farero Supremo'))state.user.stats.titles.push('Farero Supremo')}
function startsWithNorm(text,query){return normalize(text).startsWith(normalize(query))}
function uniqueSorted(a){return [...new Set(a)].sort((x,y)=>x.localeCompare(y,'es',{sensitivity:'base'}))}
function suggestionBox(input,box,items,onPick){
 const q=input.value.trim();
 const filtered=q?items.filter(x=>startsWithNorm(x,q)).slice(0,8):items.slice(0,8);
 box.innerHTML=filtered.map(x=>`<button type="button" class="suggestion-item">${x}</button>`).join('');
 box.classList.toggle('show',filtered.length>0 && document.activeElement===input);
 [...box.querySelectorAll('.suggestion-item')].forEach(btn=>btn.onclick=()=>{input.value=btn.textContent;box.classList.remove('show');onPick?.();});
}
function fillLists(){
 const brandInput=$('#brand-input'), modelInput=$('#model-input');
 const brands=uniqueSorted(CARS.map(c=>c.brand));
 const brandText=brandInput.value.trim();
 const exactBrand=CARS.find(c=>answerMatches(brandText,c.brand,BRAND_ALIASES))?.brand;
 const selectedBrand=exactBrand || brandText;
 const modelPool=CARS.filter(c=>!selectedBrand||answerMatches(selectedBrand,c.brand,BRAND_ALIASES)||startsWithNorm(c.brand,selectedBrand)).map(c=>c.model);
 suggestionBox(brandInput,$('#brand-suggestions'),brands,()=>{modelInput.value='';fillLists();});
 suggestionBox(modelInput,$('#model-suggestions'),uniqueSorted(modelPool),()=>{});
}

function unlockAchievement(id){state.user.stats.achievements??=[];if(!state.user.stats.achievements.includes(id)){state.user.stats.achievements.push(id);const a=ACHIEVEMENTS.find(x=>x.id===id);if(a)toast('Logro desbloqueado: '+a.name)}}
function updateAchievements(final=false){const st=state.user.stats; if((st.correct||0)>=1)unlockAchievement('first_win'); if(state.bestRun>=5)unlockAchievement('streak_5'); if(state.bestRun>=10)unlockAchievement('streak_10'); if(state.score>=1000)unlockAchievement('score_1000'); if((st.collection||[]).length>=10)unlockAchievement('collector_10'); if(state.mode==='daily')unlockAchievement('daily_played'); if(state.mode==='time')unlockAchievement('time_attack'); if((st.games||0)>=5)unlockAchievement('play_5'); if(state.bestRun>=20)unlockAchievement('streak_20'); if((st.favorites||[]).length>=1)unlockAchievement('favorite_1');}
function showEndModal(){const modal=$('#end-modal');if(!modal)return;$('#end-photo').src=state.lastImage||$('#car-img')?.src||'';const ans=state.lastAnswer||state.current;$('#end-title').textContent=state.mode==='time'?'Contrarreloj terminado':'Partida terminada';$('#end-answer').textContent=ans?`Último coche: ${ans.brand} ${ans.model}.`:'';$('#end-stats').innerHTML=`<div><b>${state.score}</b><span>Puntos</span></div><div><b>${state.bestRun}</b><span>Mejor racha</span></div><div><b>${state.round}</b><span>Rondas</span></div><div><b>${(state.user.stats.achievements||[]).length}</b><span>Logros</span></div>`;modal.classList.remove('hidden')}
function closeEndModal(){const modal=$('#end-modal');if(modal)modal.classList.add('hidden')}
function renderHome(){if(!state.user)return;$('#welcome-user').textContent=state.user.nombre;$('#stat-total-points').textContent=state.user.puntos||0;$('#stat-best-streak').textContent=state.user.racha_max||0;$('#stat-collection').textContent=(state.user.stats?.collection||[]).length+'/'+CARS.length;$('#stat-achievements').textContent=(state.user.stats?.achievements||[]).length+'/'+ACHIEVEMENTS.length;$('#daily-title').textContent=new Date().toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'})}
function renderProfile(){const u=state.user;$('#profile-name').value=u.nombre;$('#profile-pass').value=u.password||'';const acc=u.stats?.total?Math.round((u.stats.correct/u.stats.total)*100):0;$('#profile-stats').innerHTML=[['Partidas',u.stats?.games||0],['Precisión',acc+'%'],['Mejor puntuación',u.stats?.bestScore||0],['Puntos totales',u.puntos||0],['Mejor racha',u.racha_max||0],['Coches desbloqueados',(u.stats?.collection||[]).length],['Logros',(u.stats?.achievements||[]).length+'/'+ACHIEVEMENTS.length]].map(x=>`<div><span>${x[0]}</span><b>${x[1]}</b></div>`).join('');$('#titles-list').innerHTML=(u.stats?.titles||['Turbo Kid']).map(t=>`<span class="chip">${t}</span>`).join('');$('#achievements-list').innerHTML=ACHIEVEMENTS.map(a=>{const ok=(u.stats?.achievements||[]).includes(a.id);return `<div class="achievement ${ok?'done':''}"><b>${ok?'✓':'·'} ${a.name}</b><span>${a.desc}</span></div>`}).join('')}
async function saveProfile(){const old=state.user.nombre;const name=$('#profile-name').value.trim();const pass=$('#profile-pass').value.trim();if(!name||!pass)return toast('Completa nombre y contraseña');try{if(!state.online)throw Error('Sin sesión online');await api(`usuarios?nombre=eq.${encodeURIComponent(old)}`,{method:'PATCH',body:JSON.stringify({nombre:name,password:pass,stats:state.user.stats})});state.user.nombre=name;state.user.password=pass;toast('Perfil guardado en Supabase');renderHome();renderProfile()}catch(e){console.error(e);toast('No se pudo guardar el perfil en Supabase. No se ha guardado en local.')}}
function renderGarage(){const col=state.user.stats?.collection||[];$('#garage-grid').innerHTML=CARS.map((c,i)=>{const id=c.brand+' '+c.model, ok=col.includes(id);return `<article class="car-card ${ok?'':'locked'}"><img src="" data-car-index="${i}" alt="${id}"><div><b>${ok?id:'???'}</b><br><span>${c.rarity} · ${c.region.toUpperCase()} ${state.user.stats?.favorites?.includes(id)?'· ★ Favorito':''}</span></div></article>`}).join('');$$('.car-card img').forEach(async img=>{try{img.src=await getImage(CARS[Number(img.dataset.carIndex)])}catch{img.closest('.car-card')?.remove()}})}
function gacha(){if((state.user.puntos||0)<250)return toast('Necesitas 250 puntos');state.user.puntos-=250;const title=TITLES[Math.floor(Math.random()*TITLES.length)];state.user.stats.titles??=[];if(!state.user.stats.titles.includes(title))state.user.stats.titles.push(title);$('#gacha-result').textContent='Has desbloqueado: '+title;toast('Gacha conseguido');renderGarage();renderHome()}
async function renderDaily(){const car=dailyCar();$('#daily-screen-title').textContent='Daily Challenge · '+new Date().toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'});const img=$('#daily-preview');if(img){try{img.src=await getImage(car)}catch{img.removeAttribute('src');}}await renderDailyRanking()}
async function renderDailyRanking(){const box=$('#daily-ranking');if(!box)return;try{const rows=await api(`partidas?select=usuario,puntos,racha,fecha,modo,daily_id&modo=eq.daily&daily_id=eq.${dailyId()}&order=puntos.desc&limit=15`);box.innerHTML=rows.length?rows.map((g,i)=>`<div class="rank-row ${g.usuario===state.user?.nombre?'me':''}"><span>#${i+1} ${g.usuario}</span><b>${g.puntos} pts · 🔥${g.racha}</b></div>`).join('')+'<p class="rank-muted">Ranking del daily de hoy. Si no sale nadie, todavía no lo ha jugado nadie o falta ejecutar el SQL nuevo.</p>':'<p>Hoy todavía no hay partidas daily guardadas.</p>'}catch(e){box.innerHTML='<p>No se pudo cargar el ranking daily desde Supabase. Revisa SQL/RLS/conexión.</p>'}}
async function renderRanking(){try{const users=await api('usuarios?select=nombre,puntos,racha_max&order=puntos.desc&limit=15');$('#ranking-users').innerHTML=users.length?users.map((u,i)=>`<div class="rank-row ${u.nombre===state.user?.nombre?'me':''}"><span>#${i+1} ${u.nombre}</span><b>${u.puntos||0} pts · 🔥${u.racha_max||0}</b></div>`).join('')+'<p class="rank-muted">Top 15 global de todos los usuarios registrados en Supabase.</p>':'<p>No hay usuarios todavía.</p>';let games;try{games=await api('partidas?select=usuario,puntos,racha,fecha,modo&order=puntos.desc&limit=15')}catch{games=await api('partidas?select=usuario,puntos,racha,fecha&order=puntos.desc&limit=15')}$('#ranking-games').innerHTML=games.length?games.map((g,i)=>`<div class="rank-row"><span>#${i+1} ${g.usuario} <small>${g.modo||'classic'}</small></span><b>${g.puntos} pts · 🔥${g.racha}</b></div>`).join('')+'<p class="rank-muted">Mejores 15 partidas guardadas, no solo las tuyas.</p>':'<p>Sin partidas.</p>';await renderModeRanking()}catch(e){console.error(e);$('#ranking-users').innerHTML='<p>No se pudo cargar usuarios desde Supabase.</p>';$('#ranking-games').innerHTML='<p>No se pudo cargar partidas desde Supabase.</p>';if($('#ranking-mode'))$('#ranking-mode').innerHTML='<p>Revisa config.js, SQL y políticas RLS.</p>'}}
async function renderModeRanking(){const mode=$('#ranking-mode-select')?.value||'classic';const box=$('#ranking-mode');if(!box)return;try{const rows=await api(`partidas?select=usuario,puntos,racha,modo&modo=eq.${mode}&order=puntos.desc&limit=15`);box.innerHTML=rows.length?rows.map((g,i)=>`<div class="rank-row ${g.usuario===state.user?.nombre?'me':''}"><span>#${i+1} ${g.usuario}</span><b>${g.puntos} pts · 🔥${g.racha}</b></div>`).join(''):'<p>Sin partidas en este modo.</p>'}catch{renderModeRankingLocal()}}
function renderModeRankingLocal(){const mode=$('#ranking-mode-select')?.value||'classic';const box=$('#ranking-mode');if(!box)return;const db=local();const rows=(db.games||[]).filter(g=>(g.modo||'classic')===mode).sort((a,b)=>(b.puntos||0)-(a.puntos||0)).slice(0,15);box.innerHTML=rows.length?rows.map((g,i)=>`<div class="rank-row ${g.usuario===state.user?.nombre?'me':''}"><span>#${i+1} ${g.usuario}</span><b>${g.puntos} pts · 🔥${g.racha}</b></div>`).join(''):'<p>Sin partidas locales en este modo.</p>'}

function renderHistory(){
 const hist=state.user?.stats?.history||[];
 const box=$('#history-list'), sum=$('#history-summary');
 if(!box||!sum)return;
 box.innerHTML=hist.length?hist.map((g,i)=>`<div class="rank-row"><span>#${i+1} ${new Date(g.fecha||Date.now()).toLocaleString('es-ES')} <small>${g.modo||'classic'}</small><br><small>${g.coche||''}</small></span><b>${g.puntos||0} pts · 🔥${g.racha||0}</b></div>`).join(''):'<p class="history-empty">Todavía no hay partidas en tu historial.</p>';
 const total=hist.length, best=Math.max(0,...hist.map(g=>g.puntos||0)), avg=total?Math.round(hist.reduce((a,g)=>a+(g.puntos||0),0)/total):0;
 sum.innerHTML=[['Partidas guardadas',total],['Mejor partida',best],['Media de puntos',avg],['Último modo',hist[0]?.modo||'Sin datos']].map(x=>`<div><span>${x[0]}</span><b>${x[1]}</b></div>`).join('');
}
function renderSettings(){applySettings()}
function renderHelp(){}
function saveUiSettings(){const st={sounds:$('#setting-sounds')?.checked??true,animations:$('#setting-animations')?.checked??true,tutorial:$('#setting-tutorial')?.checked??false};state.userSettings=st;saveSettings(st);applySettings();toast('Ajustes guardados')}
function exportData(){const data={usuario:state.user,local:local(),settings:loadSettings(),fecha:new Date().toISOString()};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='carslice-progreso.json';a.click();URL.revokeObjectURL(a.href)}
function resetLocalData(){if(!confirm('¿Borrar datos locales de este navegador?'))return;localStorage.removeItem('carslice');toast('Datos locales borrados')}
function toggleFavorite(){if(!state.current)return;state.user.stats.favorites??=[];const id=state.current.brand+' '+state.current.model;const i=state.user.stats.favorites.indexOf(id);if(i>=0){state.user.stats.favorites.splice(i,1);toast('Quitado de favoritos')}else{state.user.stats.favorites.push(id);toast('Añadido a favoritos');unlockAchievement('favorite_1')}updateFavoriteButton()}
function updateFavoriteButton(){const btn=$('#btn-favorite');if(!btn||!state.current)return;const id=state.current.brand+' '+state.current.model;const on=(state.user.stats?.favorites||[]).includes(id);btn.textContent=on?'★ Favorito':'Favorito';btn.classList.toggle('favorite-on',on)}
function ensureTutorialModal(){if($('#tutorial-modal'))return;document.body.insertAdjacentHTML('beforeend',`<div id="tutorial-modal" class="tutorial-modal hidden"><div class="tutorial-card glass"><h2>Bienvenido a CarSlice</h2><p>Identifica coches por detalles. Todos los modos son infinitos hasta fallar, y solo Contrarreloj usa tiempo.</p><div class="tutorial-steps"><div><b>1. Elige modo</b><span>Clásico, piezas, categoría, daily o contrarreloj.</span></div><div><b>2. Responde</b><span>Marca y modelo con autocompletado.</span></div><div><b>3. Progresa</b><span>Consigue puntos, logros, favoritos y colección.</span></div></div><button id="btn-close-tutorial" class="btn primary full">Entendido</button></div></div>`);$('#btn-close-tutorial').onclick=()=>{$('#tutorial-modal').classList.add('hidden')};}
function maybeShowTutorial(){ensureTutorialModal();const seen=localStorage.carsliceTutorialSeen==='1';if(state.userSettings.tutorial||!seen){$('#tutorial-modal').classList.remove('hidden');localStorage.carsliceTutorialSeen='1'}}

$$('[data-go]').forEach(b=>b.onclick=()=>show(b.dataset.go));$$('[data-start-mode]').forEach(b=>b.onclick=()=>start(b.dataset.startMode));$$('.tab').forEach(t=>t.onclick=()=>{state.authMode=t.dataset.auth;$$('.tab').forEach(x=>x.classList.remove('active'));t.classList.add('active');$('#btn-auth').textContent=state.authMode==='login'?'Entrar al garaje':'Crear cuenta'});$('#btn-auth').onclick=login;if($('#btn-offline'))$('#btn-offline').onclick=enterOffline;$('#btn-logout').onclick=logout;$('#btn-check').onclick=check;$('#btn-hint').onclick=hint;$('#btn-hint-country').onclick=hintCountry;$('#btn-hint-year').onclick=hintYear;$('#btn-hint-type').onclick=hintType;$('#btn-reveal').onclick=reveal;$('#btn-full-image').onclick=showFullImage;$('#btn-favorite').onclick=toggleFavorite;$('#btn-continue').onclick=continueGame;$('#btn-end-run').onclick=finishGame;$('#btn-close-end').onclick=closeEndModal;$('#btn-end-home').onclick=()=>{closeEndModal();show('home')};$('#btn-retry').onclick=()=>{closeEndModal();start(state.lastEndMode||state.mode)};if($('#ranking-mode-select'))$('#ranking-mode-select').onchange=renderModeRanking;$('#brand-input').oninput=fillLists;$('#brand-input').onfocus=fillLists;$('#model-input').oninput=fillLists;$('#model-input').onfocus=fillLists;document.addEventListener('click',e=>{if(!e.target.closest('.suggest-wrap')){$$('#brand-suggestions,#model-suggestions').forEach(x=>x.classList.remove('show'))}});$('#btn-save-profile').onclick=saveProfile;$('#btn-gacha').onclick=gacha;if($('#btn-save-settings'))$('#btn-save-settings').onclick=saveUiSettings;if($('#btn-export-data'))$('#btn-export-data').onclick=exportData;if($('#btn-reset-local'))$('#btn-reset-local').onclick=resetLocalData;document.addEventListener('keydown',e=>{if(state.screen==='game'&&e.key==='Enter')check()});
show('login');
