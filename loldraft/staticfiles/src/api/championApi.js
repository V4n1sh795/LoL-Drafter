import axios from 'axios'
import { getRussianChampionName, getLocalizedRole } from '../data/championTranslations'

// Получение списка всех чемпионов
export const fetchAllChampions = async () => {
  try {
    // Получаем последнюю версию игры
    const versionRes = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json')
    const latestVersion = versionRes.data[0]
    
    // Получаем данные чемпионов
    const championsRes = await axios.get(
      `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`
    )
    
    const championsData = championsRes.data.data
    
    // Преобразуем объект в массив и добавляем русские названия
    const championsArray = Object.values(championsData)
      .map(champ => ({
        id: champ.id,
        name: champ.name, // оригинальное имя
        russianName: getRussianChampionName(champ.id), // русское имя
        key: champ.key,
        title: champ.title,
        icon: `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${champ.image.full}`,
        splash: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ.id}_0.jpg`,
        tags: champ.tags,
        partype: champ.partype,
        localizedRoles: champ.tags?.map(tag => getLocalizedRole(tag)) || []
      }))
      .sort((a, b) => a.russianName.localeCompare(b.russianName, 'ru'))
    
    return championsArray
  } catch (error) {
    console.error('Error fetching champions:', error)
    throw error
  }
}

// Fallback данные для случая если API не работает
export const getFallbackChampions = () => {
  const fallbackChampions = [
    // Исправленные переводы
    { id: "Aphelios", name: "Aphelios", russianName: "Афелий", key: "523", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Aphelios.png", tags: ["Marksman"], localizedRoles: ["Стрелок"] },
    { id: "Kayn", name: "Kayn", russianName: "Каин", key: "141", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Kayn.png", tags: ["Fighter", "Assassin"], localizedRoles: ["Боец", "Убийца"] },
    { id: "Lillia", name: "Lillia", russianName: "Лиллия", key: "876", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Lillia.png", tags: ["Fighter", "Mage"], localizedRoles: ["Боец", "Маг"] },
    { id: "Nilah", name: "Nilah", russianName: "Нила", key: "895", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Nilah.png", tags: ["Fighter"], localizedRoles: ["Боец"] },
    { id: "Nunu", name: "Nunu & Willump", russianName: "Нуну и Виллумп", key: "20", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Nunu.png", tags: ["Tank", "Fighter"], localizedRoles: ["Танк", "Боец"] },
    
    // Новые чемпионы
    { id: "Ambessa", name: "Ambessa", russianName: "Амбесса", key: "999", icon: "https://via.placeholder.com/48/1F2937/64748B?text=AMB", tags: ["Fighter", "Tank"], localizedRoles: ["Боец", "Танк"] },
    { id: "Aurora", name: "Aurora", russianName: "Аврора", key: "998", icon: "https://via.placeholder.com/48/1F2937/64748B?text=AUR", tags: ["Mage", "Support"], localizedRoles: ["Маг", "Поддержка"] },
    { id: "Mel", name: "Mel", russianName: "Мэл", key: "997", icon: "https://via.placeholder.com/48/1F2937/64748B?text=MEL", tags: ["Assassin"], localizedRoles: ["Убийца"] },
    { id: "Yunara", name: "Yunara", russianName: "Юнара", key: "996", icon: "https://via.placeholder.com/48/1F2937/64748B?text=YUN", tags: ["Mage"], localizedRoles: ["Маг"] },
    { id: "Zaahen", name: "Zaahen", russianName: "Заахен", key: "995", icon: "https://via.placeholder.com/48/1F2937/64748B?text=ZAA", tags: ["Marksman"], localizedRoles: ["Стрелок"] },
    
    // Популярные чемпионы для примера
    { id: "Aatrox", name: "Aatrox", russianName: "Атрокс", key: "266", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Aatrox.png", tags: ["Fighter", "Tank"], localizedRoles: ["Боец", "Танк"] },
    { id: "Ahri", name: "Ahri", russianName: "Ари", key: "103", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Ahri.png", tags: ["Mage", "Assassin"], localizedRoles: ["Маг", "Убийца"] },
    { id: "Akali", name: "Akali", russianName: "Акали", key: "84", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Akali.png", tags: ["Assassin"], localizedRoles: ["Убийца"] },
    { id: "Akshan", name: "Akshan", russianName: "Акшан", key: "166", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Akshan.png", tags: ["Marksman", "Assassin"], localizedRoles: ["Стрелок", "Убийца"] },
    { id: "Belveth", name: "Bel'Veth", russianName: "Бел'Вет", key: "200", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Belveth.png", tags: ["Fighter"], localizedRoles: ["Боец"] },
    { id: "Briar", name: "Briar", russianName: "Брайер", key: "233", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Briar.png", tags: ["Fighter", "Assassin"], localizedRoles: ["Боец", "Убийца"] },
    { id: "Gwen", name: "Gwen", russianName: "Гвен", key: "887", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Gwen.png", tags: ["Fighter"], localizedRoles: ["Боец"] },
    { id: "Hwei", name: "Hwei", russianName: "Хвея", key: "910", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Hwei.png", tags: ["Mage"], localizedRoles: ["Маг"] },
    { id: "KSante", name: "K'Sante", russianName: "К'Санте", key: "897", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/KSante.png", tags: ["Tank", "Fighter"], localizedRoles: ["Танк", "Боец"] },
    { id: "Milio", name: "Milio", russianName: "Милио", key: "902", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Milio.png", tags: ["Support"], localizedRoles: ["Поддержка"] },
    { id: "Naafiri", name: "Naafiri", russianName: "Наафири", key: "950", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Naafiri.png", tags: ["Assassin"], localizedRoles: ["Убийца"] },
    { id: "Renata", name: "Renata Glasc", russianName: "Рената Гласк", key: "888", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Renata.png", tags: ["Support"], localizedRoles: ["Поддержка"] },
    { id: "Smolder", name: "Smolder", russianName: "Смолдер", key: "901", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Smolder.png", tags: ["Marksman"], localizedRoles: ["Стрелок"] },
    { id: "Vex", name: "Vex", russianName: "Векс", key: "711", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Vex.png", tags: ["Mage"], localizedRoles: ["Маг"] },
    { id: "Zeri", name: "Zeri", russianName: "Зери", key: "221", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Zeri.png", tags: ["Marksman"], localizedRoles: ["Стрелок"] }
  ]
  
  return fallbackChampions.sort((a, b) => a.russianName.localeCompare(b.russianName, 'ru'))
}

// Функция для ручного добавления чемпионов (если API их не находит)
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
  ]
  
  // Добавляем только если их еще нет в массиве
  manualChampions.forEach(manualChamp => {
    if (!championsArray.some(champ => champ.id === manualChamp.id)) {
      championsArray.push(manualChamp)
    }
  })
  
  // Сортируем заново
  return championsArray.sort((a, b) => a.russianName.localeCompare(b.russianName, 'ru'))
}