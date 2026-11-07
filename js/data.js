// Sunset City RP — static game data
export const WORLD = { w: 3600, h: 3600 };

export const ROAD_LINES = [300, 900, 1500, 2100, 2700, 3300];
export const ROAD_W = 120;
export const BLOCKS = 5;

export const COLORS = {
  skins: ['#f2c9a4', '#dda57a', '#b97a50', '#8d5636', '#613a24', '#3f2517', '#e8b58b', '#a86b43'],
  shirts: ['#ffd400', '#ff5a5f', '#46d98b', '#54a9ff', '#c58bff', '#ff9b3d', '#f4f4f4', '#20242c', '#1f7a5c', '#b02a37'],
  pants: ['#252a33', '#3a4250', '#1b3a5c', '#5c4a2e', '#2e2e2e', '#6b7280', '#8a2b3a', '#1f4d3a', '#d7d9de', '#101216'],
  accessories: ['none', 'cap', 'shades', 'chain', 'beanie'],
};

export const VEHICLE_TYPES = {
  sedan: { name: 'Sedán', len: 84, wid: 42, maxSpeed: 330, accel: 220, handling: 2.1, price: 12000, tank: 60 },
  compact: { name: 'Compacto', len: 70, wid: 38, maxSpeed: 300, accel: 240, handling: 2.4, price: 8000, tank: 45 },
  sports: { name: 'Deportivo', len: 92, wid: 44, maxSpeed: 470, accel: 340, handling: 2.7, price: 42000, tank: 65 },
  suv: { name: 'SUV', len: 100, wid: 50, maxSpeed: 300, accel: 190, handling: 1.7, price: 26000, tank: 80 },
  taxi: { name: 'Taxi', len: 86, wid: 43, maxSpeed: 340, accel: 230, handling: 2.2, price: 15000, tank: 60 },
  van: { name: 'Furgoneta', len: 108, wid: 52, maxSpeed: 270, accel: 170, handling: 1.5, price: 18000, tank: 90 },
};

export const VEHICLE_COLORS = ['#c0392b', '#2c3e50', '#ecf0f1', '#f39c12', '#27ae60', '#8e44ad', '#2980b9', '#7f8c8d', '#d35400', '#16a085', '#1c1f26', '#b8bcc4'];

// POI definitions. Block coordinates are 0..4; door faces south unless stated.
export const POIS = [
  {
    id: 'binco', type: 'clothing', name: 'Binco', full: 'Binco Clothing', letter: 'B',
    color: '#ffd400', block: [0, 0], tagline: 'Ropa para gente con estilo.',
    desc: 'Camisetas, pantalones y accesorios. Todo lo que necesitas para marcar tendencia en la ciudad.',
  },
  {
    id: 'ammunation', type: 'ammo', name: 'Ammu-Nation', full: 'Ammu-Nation', letter: 'A',
    color: '#ff5a5f', block: [1, 0], tagline: 'La mejor selección de armas.',
    desc: 'Armas, munición y chalecos. Recuerda: portar un arma en público llama la atención.',
  },
  {
    id: 'burgershot', type: 'restaurant', name: 'Burger Shot', full: 'Burger Shot', letter: 'R',
    color: '#ff9b3d', block: [2, 0], tagline: 'Comida rápida, problemas lentos.',
    desc: 'Hamburguesas, patatas y refrescos. Recupera hambre y salud en el acto.',
  },
  {
    id: 'food24', type: 'food', name: '24/7', full: '24/7 Food Store', letter: 'F',
    color: '#46d98b', block: [3, 0], tagline: 'Abierto cuando todo lo demás cierra.',
    desc: 'Snacks, bebidas y provisiones para llevar. Compra y guarda en tu mochila.',
  },
  {
    id: 'club', type: 'club', name: 'Bahama Mamas', full: 'Bahama Mamas Club', letter: 'N',
    color: '#c58bff', block: [4, 0], tagline: 'La noche empieza aquí.',
    desc: 'Copas, música y socialización. Sube tu reputación social y conoce gente.',
  },
  {
    id: 'ltd', type: 'gas', name: 'LTD Gasoline', full: 'LTD Gasoline', letter: 'G',
    color: '#ffd400', block: [0, 1], tagline: 'Reposta y sigue tu camino.',
    desc: 'Gasolina para tu vehículo, bidones, snacks y un túnel de lavado.',
  },
  {
    id: 'suburban', type: 'clothing', name: 'Suburban', full: 'Suburban Outfits', letter: 'S',
    color: '#ff5a5f', block: [1, 1], tagline: 'Estilo urbano de verdad.',
    desc: 'Colección premium de ropa y accesorios. Más caro, más exclusivo.',
  },
  {
    id: 'bank', type: 'bank', name: 'Banco', full: 'Sunset Bank', letter: '$',
    color: '#54a9ff', block: [2, 1], tagline: 'Tu dinero, seguro.',
    desc: 'Deposita y retira efectivo. Cobra tu paga de ciudadano cada cierto tiempo.',
  },
  {
    id: 'hospital', type: 'hospital', name: 'Hospital', full: 'Sunset General Hospital', letter: 'H',
    color: '#ff5a5f', block: [3, 1], tagline: 'Cuidamos de ti.',
    desc: 'Cura tus heridas por una tarifa médica. También es donde reapareces si caes.',
  },
  {
    id: 'police', type: 'police', name: 'Comisaría', full: 'Sunset Police Department', letter: 'P',
    color: '#54a9ff', block: [4, 1], tagline: 'Servir y proteger.',
    desc: 'Paga tus multas y limpia tu historial. Si tienes estrellas, mejor no pasees cerca.',
  },
  {
    id: 'dealer', type: 'dealer', name: 'Autos Deluxe', full: 'Autos Deluxe', letter: 'D',
    color: '#46d98b', block: [0, 2], tagline: 'Conduce algo que importe.',
    desc: 'Compra un vehículo y recíbelo en la puerta. Seguro incluido, más o menos.',
  },
  {
    id: 'pizza', type: 'restaurant', name: 'Pizza This', full: 'Pizza This', letter: 'R',
    color: '#ff9b3d', block: [1, 2], tagline: 'Una porción de felicidad.',
    desc: 'Pizza recién hecha, pasta y bebidas. Aquí también reparten trabajo.',
  },
  {
    id: 'park', type: 'park', name: 'Parque Central', full: 'Parque Central', letter: '·',
    color: '#46d98b', block: [2, 2], tagline: 'Un respiro en la ciudad.',
    desc: 'Zona verde con fuente. Buen sitio para descansar y quedar con otros jugadores.',
  },
  {
    id: 'pawn', type: 'pawn', name: 'Empeños', full: 'Pawn & Gun', letter: 'E',
    color: '#ff9b3d', block: [3, 2], tagline: 'Todo tiene un precio.',
    desc: 'Compra suministros baratos y vende objetos que ya no uses.',
  },
  {
    id: 'gym', type: 'gym', name: 'Gimnasio', full: 'Sunset Gym', letter: 'X',
    color: '#46d98b', block: [4, 2], tagline: 'Entrena duro, vive fuerte.',
    desc: 'Entrena para aumentar tu resistencia y recuperar energía.',
  },
  {
    id: 'mechanic', type: 'mechanic', name: 'Taller', full: 'Los Santos Customs', letter: 'M',
    color: '#ffd400', block: [1, 3], tagline: 'Tu coche en buenas manos.',
    desc: 'Repara tu vehículo, repinta la carrocería y reposta el depósito.',
  },
  {
    id: 'liquor', type: 'food', name: 'Licorería', full: 'Liquor Ace', letter: 'L',
    color: '#c58bff', block: [3, 3], tagline: 'Para las noches largas.',
    desc: 'Bebidas y snacks. Compra provisiones antes de que cierre.',
  },
  {
    id: 'motel', type: 'motel', name: 'Motel', full: 'Sunset Motel', letter: 'O',
    color: '#54a9ff', block: [4, 3], tagline: 'Descansa. Mañana será otro día.',
    desc: 'Alquila una habitación para recuperar salud y guardar tu partida.',
  },
];

export const BLOCK_POI = {};
for (const p of POIS) BLOCK_POI[p.block.join(',')] = p;

// Generic building palettes
export const BUILDING_PALETTES = [
  { wall: '#3b414d', roof: '#2b303a', trim: '#4b525f', sign: '#d7dbe2' },
  { wall: '#4a4038', roof: '#332c26', trim: '#5b4e43', sign: '#e8dccb' },
  { wall: '#3c4a46', roof: '#2b3532', trim: '#4d5d58', sign: '#d6e6df' },
  { wall: '#4a3b42', roof: '#332930', trim: '#5c4a52', sign: '#eadde4' },
  { wall: '#39445c', roof: '#283044', trim: '#4a5873', sign: '#d8e1f3' },
  { wall: '#5a4b32', roof: '#3f3524', trim: '#6d5b3f', sign: '#f0e3c6' },
];

export const GENERIC_NAMES = [
  'Sunset Tower', 'Vela & Asociados', 'Hotel Marina', 'Garaje Central', 'Clínica Dental',
  'Muebles Ortega', 'Radio Sur', 'Ferretería Ruiz', 'Estudio 54', 'Agencia Solar',
  'Café Colón', 'Galería Norte', 'Imprenta Rápida', 'Seguros Delta', 'Lavandería 24h',
  'Panadería Luna', 'Taller El Rayo', 'Óptica Visión', 'Bazar Chino', 'Inmobiliaria Sur',
];

export const SHOP_CATALOGS = {
  binco: [
    { cat: 'Ropa', id: 'shirt_yellow', name: 'Camiseta Sunset', desc: 'Algodón, corte clásico', price: 120, icon: 'shirt', swatch: '#ffd400', apply: { shirt: '#ffd400' } },
    { cat: 'Ropa', id: 'shirt_red', name: 'Camiseta Roja', desc: 'Para destacar de noche', price: 120, icon: 'shirt', swatch: '#ff5a5f', apply: { shirt: '#ff5a5f' } },
    { cat: 'Ropa', id: 'shirt_green', name: 'Camiseta Menta', desc: 'Fresca y cómoda', price: 120, icon: 'shirt', swatch: '#46d98b', apply: { shirt: '#46d98b' } },
    { cat: 'Ropa', id: 'shirt_blue', name: 'Camiseta Azul', desc: 'Estilo urbano', price: 120, icon: 'shirt', swatch: '#54a9ff', apply: { shirt: '#54a9ff' } },
    { cat: 'Ropa', id: 'shirt_purple', name: 'Camiseta Lila', desc: 'Edición limitada', price: 160, icon: 'shirt', swatch: '#c58bff', apply: { shirt: '#c58bff' } },
    { cat: 'Ropa', id: 'shirt_white', name: 'Camiseta Blanca', desc: 'Nunca falla', price: 100, icon: 'shirt', swatch: '#f4f4f4', apply: { shirt: '#f4f4f4' } },
    { cat: 'Ropa', id: 'shirt_black', name: 'Camiseta Negra', desc: 'Básico imprescindible', price: 110, icon: 'shirt', swatch: '#20242c', apply: { shirt: '#20242c' } },
    { cat: 'Pantalones', id: 'pants_jeans', name: 'Vaqueros', desc: 'Corte recto, azul', price: 180, icon: 'pants', swatch: '#1b3a5c', apply: { pants: '#1b3a5c' } },
    { cat: 'Pantalones', id: 'pants_dark', name: 'Chinos Negros', desc: 'Elegantes y versátiles', price: 190, icon: 'pants', swatch: '#252a33', apply: { pants: '#252a33' } },
    { cat: 'Pantalones', id: 'pants_khaki', name: 'Pantalón Caqui', desc: 'Estilo informal', price: 170, icon: 'pants', swatch: '#5c4a2e', apply: { pants: '#5c4a2e' } },
    { cat: 'Pantalones', id: 'pants_grey', name: 'Joggers Grises', desc: 'Comodidad total', price: 150, icon: 'pants', swatch: '#6b7280', apply: { pants: '#6b7280' } },
    { cat: 'Accesorios', id: 'acc_cap', name: 'Gorra', desc: 'Protección solar con estilo', price: 220, icon: 'cap', apply: { accessory: 'cap' }, unique: true },
    { cat: 'Accesorios', id: 'acc_shades', name: 'Gafas de sol', desc: 'Misterio garantizado', price: 260, icon: 'cap', apply: { accessory: 'shades' }, unique: true },
    { cat: 'Accesorios', id: 'acc_chain', name: 'Cadena de oro', desc: 'Brilla con luz propia', price: 480, icon: 'shirt', apply: { accessory: 'chain' }, unique: true },
    { cat: 'Accesorios', id: 'acc_beanie', name: 'Gorro', desc: 'Para los días fríos', price: 180, icon: 'cap', apply: { accessory: 'beanie' }, unique: true },
  ],
  suburban: [
    { cat: 'Ropa', id: 'sub_shirt_gold', name: 'Camisa Dorada', desc: 'Premium, tejido satinado', price: 340, icon: 'shirt', swatch: '#e8b53a', apply: { shirt: '#e8b53a' } },
    { cat: 'Ropa', id: 'sub_shirt_teal', name: 'Polo Verde Agua', desc: 'Corte slim', price: 300, icon: 'shirt', swatch: '#1f7a5c', apply: { shirt: '#1f7a5c' } },
    { cat: 'Ropa', id: 'sub_shirt_burgundy', name: 'Camisa Burdeos', desc: 'Elegancia de noche', price: 320, icon: 'shirt', swatch: '#b02a37', apply: { shirt: '#b02a37' } },
    { cat: 'Ropa', id: 'sub_shirt_white', name: 'Camisa Blanca', desc: 'Siempre impecable', price: 280, icon: 'shirt', swatch: '#f4f4f4', apply: { shirt: '#f4f4f4' } },
    { cat: 'Pantalones', id: 'sub_pants_cream', name: 'Pantalón Crema', desc: 'Lino premium', price: 360, icon: 'pants', swatch: '#d7d9de', apply: { pants: '#d7d9de' } },
    { cat: 'Pantalones', id: 'sub_pants_green', name: 'Pantalón Esmeralda', desc: 'Edición exclusiva', price: 380, icon: 'pants', swatch: '#1f4d3a', apply: { pants: '#1f4d3a' } },
    { cat: 'Pantalones', id: 'sub_pants_red', name: 'Pantalón Granate', desc: 'Atrevido', price: 340, icon: 'pants', swatch: '#8a2b3a', apply: { pants: '#8a2b3a' } },
    { cat: 'Accesorios', id: 'sub_acc_chain', name: 'Cadena de platino', desc: 'Solo para unos pocos', price: 900, icon: 'shirt', apply: { accessory: 'chain' }, unique: true },
    { cat: 'Accesorios', id: 'sub_acc_shades', name: 'Gafas de diseño', desc: 'Cristales polarizados', price: 540, icon: 'cap', apply: { accessory: 'shades' }, unique: true },
  ],
  ammunation: [
    { cat: 'Armas', id: 'w_pistol', name: 'Pistola', desc: 'Fiable. Munición 9mm.', price: 900, icon: 'gun', weapon: 'pistol' },
    { cat: 'Armas', id: 'w_smg', name: 'Subfusil', desc: 'Cadencia alta, poco precisa.', price: 2600, icon: 'gun', weapon: 'smg' },
    { cat: 'Armas', id: 'w_shotgun', name: 'Escopeta', desc: 'Devastadora a corta distancia.', price: 3400, icon: 'gun', weapon: 'shotgun' },
    { cat: 'Munición', id: 'ammo_pistol', name: 'Caja 9mm (24)', desc: 'Munición para pistola.', price: 90, icon: 'ammo', ammo: 'pistol', qty: 24 },
    { cat: 'Munición', id: 'ammo_smg', name: 'Cargador SMG (40)', desc: 'Munición para subfusil.', price: 180, icon: 'ammo', ammo: 'smg', qty: 40 },
    { cat: 'Munición', id: 'ammo_shotgun', name: 'Cartuchos (12)', desc: 'Munición para escopeta.', price: 150, icon: 'ammo', ammo: 'shotgun', qty: 12 },
    { cat: 'Protección', id: 'armor_light', name: 'Chaleco ligero', desc: '+40 de armadura.', price: 650, icon: 'shield', armor: 40 },
    { cat: 'Protección', id: 'armor_heavy', name: 'Chaleco pesado', desc: '+100 de armadura.', price: 1400, icon: 'shield', armor: 100 },
    { cat: 'Extras', id: 'medkit', name: 'Botiquín', desc: 'Cura 60 de salud al usarlo.', price: 300, icon: 'heart', item: 'medkit' },
  ],
  burgershot: [
    { cat: 'Menú', id: 'burger', name: 'Hamburguesa clásica', desc: '+35 hambre', price: 18, icon: 'food', consume: { hunger: 35 } },
    { cat: 'Menú', id: 'double', name: 'Doble con queso', desc: '+55 hambre, +10 salud', price: 32, icon: 'food', consume: { hunger: 55, health: 10 } },
    { cat: 'Menú', id: 'fries', name: 'Patatas grandes', desc: '+25 hambre', price: 12, icon: 'food', consume: { hunger: 25 } },
    { cat: 'Menú', id: 'soda', name: 'Refresco', desc: '+30 sed', price: 8, icon: 'water', consume: { thirst: 30 } },
    { cat: 'Menú', id: 'combo', name: 'Combo Sunset', desc: '+70 hambre, +40 sed, +15 salud', price: 45, icon: 'food', consume: { hunger: 70, thirst: 40, health: 15 } },
    { cat: 'Menú', id: 'coffee', name: 'Café', desc: '+20 sed, +5 salud', price: 6, icon: 'water', consume: { thirst: 20, health: 5 } },
  ],
  pizza: [
    { cat: 'Menú', id: 'pizza_slice', name: 'Porción de pepperoni', desc: '+30 hambre', price: 14, icon: 'food', consume: { hunger: 30 } },
    { cat: 'Menú', id: 'pizza_whole', name: 'Pizza familiar', desc: '+85 hambre, +20 salud', price: 52, icon: 'food', consume: { hunger: 85, health: 20 } },
    { cat: 'Menú', id: 'pasta', name: 'Pasta al pesto', desc: '+55 hambre', price: 34, icon: 'food', consume: { hunger: 55 } },
    { cat: 'Menú', id: 'soda_pizza', name: 'Refresco 500ml', desc: '+35 sed', price: 9, icon: 'water', consume: { thirst: 35 } },
  ],
  food24: [
    { cat: 'Snacks', id: 'chips', name: 'Patatas fritas', desc: '+18 hambre', price: 7, icon: 'food', item: 'chips' },
    { cat: 'Snacks', id: 'sandwich', name: 'Sándwich', desc: '+30 hambre', price: 12, icon: 'food', item: 'sandwich' },
    { cat: 'Snacks', id: 'energy', name: 'Bebida energética', desc: '+30 sed, +5 salud', price: 11, icon: 'water', item: 'energy' },
    { cat: 'Snacks', id: 'water', name: 'Botella de agua', desc: '+40 sed', price: 4, icon: 'water', item: 'water' },
    { cat: 'Snacks', id: 'chocolate', name: 'Chocolate', desc: '+15 hambre', price: 6, icon: 'food', item: 'chocolate' },
    { cat: 'Extras', id: 'medkit24', name: 'Botiquín', desc: 'Cura 60 de salud.', price: 320, icon: 'heart', item: 'medkit' },
    { cat: 'Extras', id: 'phone_credit', name: 'Recarga móvil', desc: 'Crédito para tu teléfono.', price: 25, icon: 'phone', item: 'credit' },
  ],
  liquor: [
    { cat: 'Bebidas', id: 'beer', name: 'Cerveza', desc: '+20 sed, +5 salud', price: 9, icon: 'water', item: 'beer' },
    { cat: 'Bebidas', id: 'wine', name: 'Vino', desc: '+25 sed', price: 24, icon: 'water', item: 'wine' },
    { cat: 'Bebidas', id: 'energy2', name: 'Energética', desc: '+35 sed', price: 12, icon: 'water', item: 'energy' },
    { cat: 'Snacks', id: 'nuts', name: 'Frutos secos', desc: '+20 hambre', price: 8, icon: 'food', item: 'chips' },
  ],
  ltd: [
    { cat: 'Gasolina', id: 'refuel', name: 'Repostar vehículo', desc: 'Llena el depósito al completo.', price: 0, icon: 'fuel', action: 'refuel' },
    { cat: 'Gasolina', id: 'jerry', name: 'Bidón de gasolina', desc: '20 litros para llevar.', price: 65, icon: 'fuel', item: 'jerry' },
    { cat: 'Tienda', id: 'g_snack', name: 'Snack de estación', desc: '+25 hambre', price: 8, icon: 'food', item: 'sandwich' },
    { cat: 'Tienda', id: 'g_water', name: 'Agua', desc: '+40 sed', price: 4, icon: 'water', item: 'water' },
    { cat: 'Tienda', id: 'g_energy', name: 'Energética', desc: '+30 sed', price: 11, icon: 'water', item: 'energy' },
    { cat: 'Servicios', id: 'wash', name: 'Túnel de lavado', desc: 'Deja tu coche reluciente.', price: 40, icon: 'car', action: 'wash' },
  ],
  hospital: [
    { cat: 'Servicios', id: 'heal', name: 'Tratamiento completo', desc: 'Recupera toda la salud.', price: 120, icon: 'heart', action: 'heal' },
    { cat: 'Servicios', id: 'heal_small', name: 'Curas básicas', desc: 'Recupera 40 de salud.', price: 50, icon: 'heart', action: 'heal40' },
    { cat: 'Extras', id: 'h_medkit', name: 'Botiquín', desc: 'Cura 60 de salud al usarlo.', price: 280, icon: 'heart', item: 'medkit' },
  ],
  bank: [
    { cat: 'Cuenta', id: 'deposit', name: 'Depositar efectivo', desc: 'Guarda tu dinero en el banco.', price: 0, icon: 'lock', action: 'deposit' },
    { cat: 'Cuenta', id: 'withdraw', name: 'Retirar efectivo', desc: 'Saca dinero del banco.', price: 0, icon: 'cash', action: 'withdraw' },
    { cat: 'Cuenta', id: 'paycheck', name: 'Cobrar paga', desc: 'Paga de ciudadano disponible cada 5 min.', price: 0, icon: 'cash', action: 'paycheck' },
  ],
  police: [
    { cat: 'Servicios', id: 'fine', name: 'Pagar multa', desc: 'Limpia tus estrellas de búsqueda.', price: 0, icon: 'star', action: 'fine' },
    { cat: 'Servicios', id: 'license', name: 'Licencia de armas', desc: 'Reduce la sospecha policial.', price: 1500, icon: 'shield', action: 'license' },
  ],
  dealer: [
    { cat: 'Vehículos', id: 'buy_sedan', name: 'Sedán', desc: 'Cómodo y fiable. 4 plazas.', price: 12000, icon: 'car', action: 'buycar', vehicle: 'sedan' },
    { cat: 'Vehículos', id: 'buy_compact', name: 'Compacto', desc: 'Perfecto para la ciudad.', price: 8000, icon: 'car', action: 'buycar', vehicle: 'compact' },
    { cat: 'Vehículos', id: 'buy_suv', name: 'SUV', desc: 'Espacioso y resistente.', price: 26000, icon: 'car', action: 'buycar', vehicle: 'suv' },
    { cat: 'Vehículos', id: 'buy_sports', name: 'Deportivo', desc: 'Velocidad pura.', price: 42000, icon: 'car', action: 'buycar', vehicle: 'sports' },
    { cat: 'Vehículos', id: 'buy_taxi', name: 'Taxi', desc: 'Tu herramienta de trabajo.', price: 15000, icon: 'car', action: 'buycar', vehicle: 'taxi' },
  ],
  mechanic: [
    { cat: 'Servicios', id: 'repair', name: 'Reparar vehículo', desc: 'Devuelve el coche a su estado óptimo.', price: 250, icon: 'wrench', action: 'repair' },
    { cat: 'Servicios', id: 'repaint', name: 'Repintar', desc: 'Color aleatorio nuevo.', price: 400, icon: 'car', action: 'repaint' },
    { cat: 'Servicios', id: 'refuel2', name: 'Repostar', desc: 'Depósito lleno.', price: 0, icon: 'fuel', action: 'refuel' },
  ],
  club: [
    { cat: 'Barra', id: 'cocktail', name: 'Cóctel Bahama', desc: '+30 sed, +10 salud', price: 26, icon: 'water', consume: { thirst: 30, health: 10 } },
    { cat: 'Barra', id: 'champagne', name: 'Botella VIP', desc: '+40 sed, reputación social', price: 220, icon: 'water', consume: { thirst: 40 }, xp: 20 },
    { cat: 'Barra', id: 'club_soda', name: 'Refresco', desc: '+30 sed', price: 10, icon: 'water', consume: { thirst: 30 } },
  ],
  gym: [
    { cat: 'Entrenamiento', id: 'train', name: 'Sesión de entrenamiento', desc: 'Recupera energía y gana XP.', price: 30, icon: 'walk', action: 'train' },
    { cat: 'Entrenamiento', id: 'protein', name: 'Batido de proteínas', desc: '+30 hambre, +10 salud', price: 22, icon: 'food', consume: { hunger: 30, health: 10 } },
  ],
  pawn: [
    { cat: 'Suministros', id: 'p_medkit', name: 'Botiquín usado', desc: 'Cura 40 de salud.', price: 160, icon: 'heart', item: 'medkit' },
    { cat: 'Suministros', id: 'p_armor', name: 'Chaleco usado', desc: '+25 de armadura.', price: 340, icon: 'shield', armor: 25 },
    { cat: 'Suministros', id: 'p_ammo', name: 'Munición variada', desc: '24 balas de pistola.', price: 70, icon: 'ammo', ammo: 'pistol', qty: 24 },
  ],
  motel: [
    { cat: 'Habitación', id: 'rent', name: 'Habitación (1 noche)', desc: 'Salud completa y guardado.', price: 80, icon: 'lock', action: 'rent' },
    { cat: 'Habitación', id: 'nap', name: 'Siesta corta', desc: 'Recupera 40 de salud.', price: 30, icon: 'heart', action: 'heal40' },
  ],
};

export const SHOP_OVERRIDES = {
  binco: { icon: 'B', tabs: ['Ropa', 'Pantalones', 'Accesorios'] },
  suburban: { icon: 'S', tabs: ['Ropa', 'Pantalones', 'Accesorios'] },
  ammunation: { icon: 'A', tabs: ['Armas', 'Munición', 'Protección', 'Extras'] },
  burgershot: { icon: 'R', tabs: ['Menú'] },
  pizza: { icon: 'R', tabs: ['Menú'] },
  food24: { icon: 'F', tabs: ['Snacks', 'Extras'] },
  liquor: { icon: 'L', tabs: ['Bebidas', 'Snacks'] },
  ltd: { icon: 'G', tabs: ['Gasolina', 'Tienda', 'Servicios'] },
  hospital: { icon: 'H', tabs: ['Servicios', 'Extras'] },
  bank: { icon: '$', tabs: ['Cuenta'] },
  police: { icon: 'P', tabs: ['Servicios'] },
  dealer: { icon: 'D', tabs: ['Vehículos'] },
  mechanic: { icon: 'M', tabs: ['Servicios'] },
  club: { icon: 'N', tabs: ['Barra'] },
  gym: { icon: 'X', tabs: ['Entrenamiento'] },
  pawn: { icon: 'E', tabs: ['Suministros'] },
  motel: { icon: 'O', tabs: ['Habitación'] },
};

export const WEAPONS = {
  pistol: { name: 'Pistola', damage: 34, rate: 0.32, range: 520, spread: 0.035, mag: 12, speed: 900, sound: 'pistol' },
  smg: { name: 'Subfusil', damage: 18, rate: 0.09, range: 460, spread: 0.09, mag: 40, speed: 950, sound: 'smg' },
  shotgun: { name: 'Escopeta', damage: 22, rate: 0.85, range: 330, spread: 0.16, mag: 8, speed: 850, sound: 'shotgun', pellets: 5 },
};

export const ITEM_DEFS = {
  chips: { name: 'Patatas fritas', icon: 'food', desc: '+18 hambre', use: { hunger: 18 } },
  sandwich: { name: 'Sándwich', icon: 'food', desc: '+30 hambre', use: { hunger: 30 } },
  chocolate: { name: 'Chocolate', icon: 'food', desc: '+15 hambre', use: { hunger: 15 } },
  water: { name: 'Agua', icon: 'water', desc: '+40 sed', use: { thirst: 40 } },
  energy: { name: 'Energética', icon: 'water', desc: '+30 sed, +5 salud', use: { thirst: 30, health: 5 } },
  beer: { name: 'Cerveza', icon: 'water', desc: '+20 sed', use: { thirst: 20 } },
  wine: { name: 'Vino', icon: 'water', desc: '+25 sed', use: { thirst: 25 } },
  medkit: { name: 'Botiquín', icon: 'heart', desc: 'Cura 60 de salud', use: { health: 60 } },
  jerry: { name: 'Bidón', icon: 'fuel', desc: 'Reposta 20L en tu coche', use: { fuel: 20 } },
  credit: { name: 'Recarga móvil', icon: 'phone', desc: 'Objeto coleccionable', use: {} },
};

export const BOT_NAMES = [
  'Dani_Rivera', 'LaTigresa', 'Kevin_Mendoza', 'Sofi_Blanco', 'El_Negro', 'Marta_Vega',
  'Rulo_44', 'Carla_Santos', 'Diego_Fox', 'Nina_Peralta', 'Tomas_Cruz', 'Lola_Marín',
  'Bruno_Diaz', 'Vega_17', 'Pipe_Rojas', 'Ana_Torres', 'El_Chino', 'Mica_Lopez',
];

export const RP_CHATTER = [
  'Alguien vende un coche barato?',
  'Acabo de salir del curro, qué día más largo.',
  '¿Dónde está la tienda de ropa nueva?',
  'Cuidado por el centro, hay mucha policía.',
  'Me han robado la cartera en el club...',
  '¿Alguien para una carrera en la autopista?',
  'El Burger Shot de la esquina hace las mejores hamburguesas.',
  'Necesito un mecánico urgente.',
  'Voy a repostar, el depósito está seco.',
  'Esta ciudad nunca duerme.',
  '¿Quién está en el parque central?',
  'Busco trabajo de repartidor, ¿alguien sabe?',
  'Qué buen atardecer hoy.',
  'No me fío de la gente del puerto.',
  'He oído sirenas por el norte.',
  '¿Alguien tiene un bidón de gasolina?',
  'Me voy al gimnasio, hay que mantenerse en forma.',
  'La vida en Sunset City es cara.',
];

export const BOT_RP = [
  { me: true, text: 'mira el móvil y sonríe.' },
  { me: true, text: 'se ajusta la chaqueta y sigue caminando.' },
  { do: true, text: 'un coche frena de golpe en el cruce.' },
  { me: true, text: 'saluda con la cabeza al pasar.' },
  { do: true, text: 'se oye música alta desde el club.' },
];

export const MISSIONS = {
  delivery: {
    name: 'Repartidor', icon: 'briefcase', tag: 'TRABAJO',
    desc: 'Recoge el paquete y entrégalo antes de que se acabe el tiempo.',
    reward: 320, xp: 45, time: 150,
  },
  taxi: {
    name: 'Taxista', icon: 'car', tag: 'TRABAJO',
    desc: 'Recoge al pasajero y llévalo a su destino.',
    reward: 260, xp: 35, time: 170,
  },
  mechanic: {
    name: 'Mecánico', icon: 'wrench', tag: 'TRABAJO',
    desc: 'Ve al vehículo averiado y repáralo.',
    reward: 380, xp: 55, time: 180,
  },
};

export const DELIVERY_POINTS = ['food24', 'pizza', 'burgershot', 'liquor', 'pawn', 'motel'];
export const TAXI_POINTS = ['bank', 'hospital', 'police', 'club', 'gym', 'motel', 'dealer', 'park'];
export const MECHANIC_POINTS = ['mechanic', 'dealer', 'park', 'motel', 'ltd'];

export const STREET_NAMES = [
  'Calle Mayor', 'Avenida del Sol', 'Bulevar Marina', 'Calle 8', 'Avenida Norte',
  'Calle del Puerto', 'Ronda Sur', 'Calle Industria', 'Paseo Central', 'Callejón Neón',
];
