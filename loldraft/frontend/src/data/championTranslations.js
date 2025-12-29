// Полный словарь перевода названий чемпионов на русский
const championTranslations = {
  // Базовые чемпионы
  "Aatrox": "Атрокс",
  "Ahri": "Ари",
  "Akali": "Акали",
  "Akshan": "Акшан",
  "Alistar": "Алистар",
  "Amumu": "Амуму",
  "Anivia": "Анивия",
  "Annie": "Энни",
  "Aphelios": "Афелий", // Исправлено: Афелиос → Афелий
  "Ashe": "Эш",
  "AurelionSol": "Аурелион Сол",
  "Azir": "Азир",
  
  "Bard": "Бард",
  "Belveth": "Бел'Вет",
  "Blitzcrank": "Блицкранк",
  "Brand": "Брэнд",
  "Braum": "Браум",
  "Briar": "Брайер",
  
  "Caitlyn": "Кейтлин",
  "Camille": "Камилла",
  "Cassiopeia": "Кассиопея",
  "Chogath": "Чо'Гат",
  "Corki": "Корки",
  
  "Darius": "Дариус",
  "Diana": "Диана",
  "Draven": "Дрейвен",
  "DrMundo": "Доктор Мундо",
  
  "Ekko": "Экко",
  "Elise": "Элиза",
  "Evelynn": "Эвелинн",
  "Ezreal": "Эзреаль",
  
  "Fiddlesticks": "Фиддлстикс",
  "Fiora": "Фиора",
  "Fizz": "Физз",
  
  "Galio": "Галио",
  "Gangplank": "Гангпланк",
  "Garen": "Гарен",
  "Gnar": "Гнар",
  "Gragas": "Грагас",
  "Graves": "Грейвз",
  "Gwen": "Гвен",
  
  "Hecarim": "Гекарим",
  "Heimerdinger": "Хеймердингер",
  "Hwei": "Хвея",
  
  "Illaoi": "Иллаой",
  "Irelia": "Ирелия",
  "Ivern": "Иверн",
  
  "Janna": "Жанна",
  "JarvanIV": "Джарван IV",
  "Jax": "Джакс",
  "Jayce": "Джейс",
  "Jhin": "Джин",
  "Jinx": "Джинкс",
  
  "Kaisa": "Кай'Са",
  "Kalista": "Калиста",
  "Karma": "Карма",
  "Karthus": "Картус",
  "Kassadin": "Кассадин",
  "Katarina": "Катарина",
  "Kayle": "Кейл",
  "Kayn": "Каин", // Исправлено: Кейн → Каин
  "Kennen": "Кеннен",
  "Khazix": "Ка'Зикс",
  "Kindred": "Киндред",
  "Kled": "Клед",
  "KogMaw": "Ког'Мао",
  "KSante": "К'Санте",
  
  "Leblanc": "ЛеБлан",
  "LeeSin": "Ли Син",
  "Leona": "Леона",
  "Lillia": "Лиллия", // Исправлено: Лиллиа → Лиллия
  "Lissandra": "Лиссандра",
  "Lucian": "Люциан",
  "Lulu": "Лулу",
  "Lux": "Люкс",
  
  "Malphite": "Мальфит",
  "Malzahar": "Мальзахар",
  "Maokai": "Маокай",
  "MasterYi": "Мастер Йи",
  "Milio": "Милио",
  "MissFortune": "Мисс Фортуна",
  "MonkeyKing": "Вуконг",
  "Mordekaiser": "Мордекайзер",
  "Morgana": "Моргана",
  
  "Naafiri": "Наафири",
  "Nami": "Нами",
  "Nasus": "Насус",
  "Nautilus": "Наутилус",
  "Neeko": "Нико",
  "Nidalee": "Нидали",
  "Nilah": "Нила", // Исправлено: Нилах → Нила
  "Nocturne": "Ноктюрн",
  "Nunu": "Нуну и Виллумп", // Исправлено: Нуну → Нуну и Виллумп
  
  "Olaf": "Олаф",
  "Orianna": "Орианна",
  "Ornn": "Орн",
  
  "Pantheon": "Пантеон",
  "Poppy": "Поппи",
  "Pyke": "Пайк",
  
  "Qiyana": "Киана",
  "Quinn": "Квинн",
  
  "Rakan": "Рэйкан",
  "Rammus": "Раммус",
  "RekSai": "Рек'Сай",
  "Rell": "Релл",
  "Renata": "Рената Гласк",
  "Renekton": "Ренектон",
  "Rengar": "Ренгар",
  "Riven": "Ривен",
  "Rumble": "Рамбл",
  "Ryze": "Райз",
  
  "Samira": "Самира",
  "Sejuani": "Седжуани",
  "Senna": "Сенна",
  "Seraphine": "Серафина",
  "Sett": "Сетт",
  "Shaco": "Шако",
  "Shen": "Шен",
  "Shyvana": "Шивана",
  "Singed": "Синджед",
  "Sion": "Сион",
  "Sivir": "Сивир",
  "Skarner": "Скарнер",
  "Smolder": "Смолдер",
  "Sona": "Сона",
  "Soraka": "Сорака",
  "Swain": "Свейн",
  "Sylas": "Сайлас",
  "Syndra": "Синдра",
  
  "TahmKench": "Таам Кенч",
  "Taliyah": "Талия",
  "Talon": "Талон",
  "Taric": "Тарик",
  "Teemo": "Тимо",
  "Thresh": "Треш",
  "Tristana": "Тристана",
  "Trundle": "Трандл",
  "Tryndamere": "Триндамир",
  "TwistedFate": "Твистед Фейт",
  "Twitch": "Твич",
  
  "Udyr": "Удир",
  "Urgot": "Ургот",
  
  "Varus": "Варус",
  "Vayne": "Вейн",
  "Veigar": "Вейгар",
  "Velkoz": "Вел'Коз",
  "Vex": "Векс",
  "Vi": "Вай",
  "Viego": "Виего",
  "Viktor": "Виктор",
  "Vladimir": "Владимир",
  "Volibear": "Волибир",
  
  "Warwick": "Варвик",
  
  "Xayah": "Шая",
  "Xerath": "Зерат",
  "XinZhao": "Ксин Жао",
  
  "Yasuo": "Ясуо",
  "Yone": "Ёнэ",
  "Yorick": "Йорик",
  "Yuumi": "Юми",
  
  "Zac": "Зак",
  "Zed": "Зед",
  "Zeri": "Зери",
  "Ziggs": "Зиггс",
  "Zilean": "Зилеан",
  "Zoe": "Зои",
  "Zyra": "Зайра",
  
  // Новые чемпионы, которые ты упомянул
  "Ambessa": "Амбесса",
  "Aurora": "Аврора",
  "Mel": "Мэл",
  "Yunara": "Юнара",
  "Zaahen": "Заахен"
}

// Функция для получения русского названия чемпиона
export const getRussianChampionName = (championId) => {
  return championTranslations[championId] || championId
}

// Функция для перевода ролей
export const getLocalizedRole = (tag) => {
  const roleTranslations = {
    "Fighter": "Боец",
    "Tank": "Танк",
    "Mage": "Маг",
    "Assassin": "Убийца",
    "Marksman": "Стрелок",
    "Support": "Поддержка",
    "Controller": "Контроллер",
    "Specialist": "Специалист"
  }
  return roleTranslations[tag] || tag
}

// Экспорт всего словаря если нужно
export default championTranslations