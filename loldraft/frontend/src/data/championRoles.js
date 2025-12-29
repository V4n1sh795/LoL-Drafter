// Файл: src/data/championRoles.js

// Маппинг чемпионов по игровым ролям (lane roles)
// Оптимизировано для быстрого поиска
const championRoles = {
  // Топ-лейн
  'top': new Set([
    'Ambessa', 'Aatrox', 'Vladimir', 'Volibear', 'Gangplank', 'Garen', 'Gwen', 'Gnar', 
    'Gragas', 'Darius', 'Jax', 'Jayce', 'DrMundo', 'Yone', 'Zaahen', 'Illaoi', 'Irelia', 
    'Yorick', 'Camille', 'Quinn', 'Kayle', 'Kennen', 'Kled', 'KSante', 'Malphite', 
    'Mordekaiser', 'Nasus', 'Olaf', 'Ornn', 'Pantheon', 'Rumble', 'Renekton', 'Riven', 
    'Sett', 'Singed', 'Sion', 'Teemo', 'Tryndamere', 'Urgot', 'Fiora', 'Heimerdinger', 
    'Chogath', 'Shen', 'Yasuo'
  ]),
  
  // Лес
  'jungle': new Set([
    'Amumu', 'Aatrox', 'Belveth', 'Briar', 'Vi', 'Warwick', 'Viego', 'Volibear', 
    'MonkeyKing', 'Hecarim', 'Graves', 'Jax', 'JarvanIV', 'Diana', 'DrMundo', 'Zaahen', 
    'Zac', 'Zed', 'Ivern', 'Khazix', 'Kayn', 'Karthus', 'Qiyana', 'Kindred', 'XinZhao', 
    'Lillia', 'LeeSin', 'Malphite', 'MasterYi', 'Naafiri', 'Nidalee', 'Nocturne', 
    'Nunu', 'Pantheon', 'Rammus', 'RekSai', 'Rengar', 'Sylas', 'Sejuani', 'Skarner', 
    'Talon', 'Trundle', 'Udyr', 'Fiddlesticks', 'Shaco', 'Shyvana', 'Evelynn', 'Ekko', 
    'Elise'
  ]),
  
  // Мид-лейн
  'middle': new Set([
    'Aurora', 'Azir', 'Akali', 'Akshan', 'Anivia', 'Ahri', 'AurelionSol', 'Veigar', 
    'Vex', 'Viktor', 'Vladimir', 'Galio', 'Diana', 'Yone', 'Zed', 'Xerath', 'Zoe', 
    'Irelia', 'Kassadin', 'Cassiopeia', 'Katarina', 'Qiyana', 'Leblanc', 'Lissandra', 
    'Lux', 'Malzahar', 'Morgana', 'Mel', 'Orianna', 'Ryze', 'Sylas', 'Syndra', 
    'Taliyah', 'TwistedFate', 'Fizz', 'Hwei', 'Ekko', 'Annie', 'Yasuo'
  ]),
  
  // Бот-лейн (ADC)
  'bottom': new Set([
    'Aphelios', 'Varus', 'Vayne', 'Jhin', 'Jinx', 'Draven', 'Zeri', 'Ziggs', 'Kaisa', 
    'Kalista', 'Caitlyn', 'KogMaw', 'Corki', 'Lucian', 'MissFortune', 'Nilah', 
    'Samira', 'Sivir', 'Smolder', 'Twitch', 'Tristana', 'Xayah', 'Ezreal', 'Ashe', 
    'Yunara'
  ]),
  
  // Поддержка
  'support': new Set([
    'Alistar', 'Bard', 'Blitzcrank', 'Braum', 'Brand', 'Velkoz', 'Janna', 'Zyra', 
    'Xerath', 'Zilean', 'Karma', 'Leona', 'Lulu', 'Lux', 'Maokai', 'Milio', 'Morgana', 
    'Mel', 'Nami', 'Nautilus', 'Neeko', 'Pyke', 'Pantheon', 'Poppy', 'Rell', 
    'Renata', 'Rakan', 'Swain', 'Senna', 'Seraphine', 'Sona', 'Soraka', 'TahmKench', 
    'Taric', 'Thresh', 'Yuumi'
  ])
};

// Функция для получения ролей чемпиона по его ID
export const getChampionRoles = (championId) => {
  const roles = [];
  
  for (const [role, championsSet] of Object.entries(championRoles)) {
    if (championsSet.has(championId)) {
      roles.push(role);
    }
  }
  
  return roles;
};

// Функция для фильтрации массива чемпионов по роли
export const filterChampionsByRole = (champions, role) => {
  if (!role || role === 'all') return champions;
  
  const roleSet = championRoles[role];
  if (!roleSet) return champions;
  
  return champions.filter(champ => roleSet.has(champ.id));
};

// Экспорт для отладки
export default championRoles;