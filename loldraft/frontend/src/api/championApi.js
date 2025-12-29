import axios from 'axios';
import { getRussianChampionName, getLocalizedRole } from '../data/championTranslations';

// Получение списка всех чемпионов
export const fetchAllChampions = async () => {
  try {
    // Получаем последнюю версию игры
    const versionRes = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
    const latestVersion = versionRes.data[0];

    // Получаем данные чемпионов
    const championsRes = await axios.get(
      `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`
    );

    const championsData = championsRes.data.data;

    // Преобразуем объект в массив и добавляем русские названия
    const championsArray = Object.values(championsData).map(champ => {
      const tags = Array.isArray(champ.tags) ? champ.tags : [];
      return {
        id: champ.id,
        name: champ.name,
        russianName: getRussianChampionName(champ.id) || champ.name,
        key: champ.key,
        title: champ.title,
        icon: `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${champ.image.full}`,
        splash: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ.id}_0.jpg`,
        tags: tags,
        partype: champ.partype,
        localizedRoles: tags.map(tag => getLocalizedRole(tag)) || []
      };
    });

    return championsArray.sort((a, b) =>
      a.russianName.localeCompare(b.russianName, 'ru', { sensitivity: 'base' })
    );
  } catch (error) {
    console.error('Error fetching champions:', error);
    throw error;
  }
};

// Fallback данные — полностью автономный набор чемпионов
export const getFallbackChampions = () => {
  const fallbackChampions = [
    { id: "Aatrox", name: "Aatrox", russianName: "Аатрокс", key: "266", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Aatrox.png", tags: ["Fighter", "Tank"], localizedRoles: ["Боец", "Танк"], title: "Меч Возрождения" },
    { id: "Ahri", name: "Ahri", russianName: "Ари", key: "103", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Ahri.png", tags: ["Mage", "Assassin"], localizedRoles: ["Маг", "Убийца"], title: "Лиса-демон" },
    { id: "Akali", name: "Akali", russianName: "Акали", key: "84", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Akali.png", tags: ["Assassin"], localizedRoles: ["Убийца"], title: "Ро́ковая тень" },
    { id: "Aphelios", name: "Aphelios", russianName: "Афелий", key: "523", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Aphelios.png", tags: ["Marksman"], localizedRoles: ["Стрелок"], title: "Оружие веры" },
    { id: "Belveth", name: "Bel'Veth", russianName: "Бел'Вет", key: "200", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Belveth.png", tags: ["Fighter"], localizedRoles: ["Боец"], title: "Императрица пустоты" },
    { id: "Briar", name: "Briar", russianName: "Брайер", key: "233", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Briar.png", tags: ["Fighter", "Assassin"], localizedRoles: ["Боец", "Убийца"], title: "Охотница Кровавой Луны" },
    { id: "Gwen", name: "Gwen", russianName: "Гвен", key: "887", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Gwen.png", tags: ["Fighter"], localizedRoles: ["Боец"], title: "Ножницы и нитки" },
    { id: "Hwei", name: "Hwei", russianName: "Хвея", key: "910", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Hwei.png", tags: ["Mage"], localizedRoles: ["Маг"], title: "Художник тьмы" },
    { id: "Kayn", name: "Kayn", russianName: "Каин", key: "141", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Kayn.png", tags: ["Fighter", "Assassin"], localizedRoles: ["Боец", "Убийца"], title: "Тень войны" },
    { id: "KSante", name: "K'Sante", russianName: "К'Санте", key: "897", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/KSante.png", tags: ["Tank", "Fighter"], localizedRoles: ["Танк", "Боец"], title: "Гордость Навоса" },
    { id: "Lillia", name: "Lillia", russianName: "Лиллия", key: "876", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Lillia.png", tags: ["Fighter", "Mage"], localizedRoles: ["Боец", "Маг"], title: "Застенчивая цветодевушка" },
    { id: "Milio", name: "Milio", russianName: "Милио", key: "902", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Milio.png", tags: ["Support"], localizedRoles: ["Поддержка"], title: "Сердце племени" },
    { id: "Naafiri", name: "Naafiri", russianName: "Наафири", key: "950", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Naafiri.png", tags: ["Assassin"], localizedRoles: ["Убийца"], title: "Стаей — как один" },
    { id: "Nilah", name: "Nilah", russianName: "Нила", key: "895", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Nilah.png", tags: ["Fighter"], localizedRoles: ["Боец"], title: "Радость войны" },
    { id: "Nunu", name: "Nunu & Willump", russianName: "Нуну и Виллумп", key: "20", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Nunu.png", tags: ["Tank", "Fighter"], localizedRoles: ["Танк", "Боец"], title: "Мальчик и его yeti" },
    { id: "Renata", name: "Renata Glasc", russianName: "Рената Гласк", key: "888", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Renata.png", tags: ["Support"], localizedRoles: ["Поддержка"], title: "Химическая баронесса" },
    { id: "Smolder", name: "Smolder", russianName: "Смолдер", key: "901", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Smolder.png", tags: ["Marksman"], localizedRoles: ["Стрелок"], title: "Дракон-пушка" },
    { id: "Vex", name: "Vex", russianName: "Векс", key: "711", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Vex.png", tags: ["Mage"], localizedRoles: ["Маг"], title: "Меланхолия" },
    { id: "Zeri", name: "Zeri", russianName: "Зери", key: "221", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Zeri.png", tags: ["Marksman"], localizedRoles: ["Стрелок"], title: "Искра жизни" },

    // Новые/гипотетические чемпионы (с placeholder-иконками без пробелов)
    { id: "Ambessa", name: "Ambessa", russianName: "Амбесса", key: "999", icon: "https://via.placeholder.com/48/1F2937/64748B?text=AMB", tags: ["Fighter", "Tank"], localizedRoles: ["Боец", "Танк"], title: "The Iron Matron" },
    { id: "Aurora", name: "Aurora", russianName: "Аврора", key: "998", icon: "https://via.placeholder.com/48/1F2937/64748B?text=AUR", tags: ["Mage", "Support"], localizedRoles: ["Маг", "Поддержка"], title: "The Northern Star" },
    { id: "Mel", name: "Mel", russianName: "Мэл", key: "997", icon: "https://via.placeholder.com/48/1F2937/64748B?text=MEL", tags: ["Assassin"], localizedRoles: ["Убийца"], title: "The Shadow Dancer" },
    { id: "Yunara", name: "Yunara", russianName: "Юнара", key: "996", icon: "https://via.placeholder.com/48/1F2937/64748B?text=YUN", tags: ["Mage"], localizedRoles: ["Маг"], title: "The Dream Weaver" },
    { id: "Zaahen", name: "Zaahen", russianName: "Заахен", key: "995", icon: "https://via.placeholder.com/48/1F2937/64748B?text=ZAA", tags: ["Marksman"], localizedRoles: ["Стрелок"], title: "The Desert Wind" }
  ];

  return fallbackChampions.sort((a, b) =>
    a.russianName.localeCompare(b.russianName, 'ru', { sensitivity: 'base' })
  );
};

// Добавление ручных чемпионов (если их нет)
export const addManualChampions = (championsArray) => {
  const manualChampions = [
    {
      id: "Ambessa",
      name: "Ambessa",
      russianName: "Амбесса",
      key: "999",
      icon: "https://via.placeholder.com/48/1F2937/64748B?text=AMB",
      tags: ["Fighter", "Tank"],
      localizedRoles: ["Боец", "Танк"],
      title: "The Iron Matron"
    },
    {
      id: "Aurora",
      name: "Aurora",
      russianName: "Аврора",
      key: "998",
      icon: "https://via.placeholder.com/48/1F2937/64748B?text=AUR",
      tags: ["Mage", "Support"],
      localizedRoles: ["Маг", "Поддержка"],
      title: "The Northern Star"
    },
    {
      id: "Mel",
      name: "Mel",
      russianName: "Мэл",
      key: "997",
      icon: "https://via.placeholder.com/48/1F2937/64748B?text=MEL",
      tags: ["Assassin"],
      localizedRoles: ["Убийца"],
      title: "The Shadow Dancer"
    },
    {
      id: "Yunara",
      name: "Yunara",
      russianName: "Юнара",
      key: "996",
      icon: "https://via.placeholder.com/48/1F2937/64748B?text=YUN",
      tags: ["Mage"],
      localizedRoles: ["Маг"],
      title: "The Dream Weaver"
    },
    {
      id: "Zaahen",
      name: "Zaahen",
      russianName: "Заахен",
      key: "995",
      icon: "https://via.placeholder.com/48/1F2937/64748B?text=ZAA",
      tags: ["Marksman"],
      localizedRoles: ["Стрелок"],
      title: "The Desert Wind"
    }
  ];

  const existingIds = new Set(championsArray.map(ch => ch.id));
  const toAdd = manualChampions.filter(ch => !existingIds.has(ch.id));

  return [...championsArray, ...toAdd].sort((a, b) =>
    a.russianName.localeCompare(b.russianName, 'ru', { sensitivity: 'base' })
  );
};