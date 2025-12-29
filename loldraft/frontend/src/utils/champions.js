import axios from 'axios';

// Получение списка чемпионов
export const fetchChampions = async () => {
  try {
    // Последняя версия Data Dragon
    const versionRes = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
    const latestVersion = versionRes.data[0];
    
    // Получаем данные чемпионов
    const championsRes = await axios.get(
      `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`
    );
    
    const champions = championsRes.data.data;
    
    // Преобразуем объект в массив
    return Object.values(champions).map(champ => ({
      id: champ.id,
      name: champ.name,
      key: champ.key,
      title: champ.title,
      // URL иконки
      icon: `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${champ.image.full}`,
      // URL полноразмерного изображения
      splash: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ.id}_0.jpg`,
      // URL загрузочного экрана
      loading: `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champ.id}_0.jpg`,
      tags: champ.tags,
      partype: champ.partype,
      stats: champ.stats
    }));
  } catch (error) {
    console.error('Error fetching champions:', error);
    return [];
  }
};

// Предзагруженный список чемпионов (на случай если API недоступно)
export const fallbackChampions = [
  { id: "Aatrox", name: "Aatrox", key: "266", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Aatrox.png", tags: ["Fighter", "Tank"] },
  { id: "Ahri", name: "Ahri", key: "103", icon: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Ahri.png", tags: ["Mage", "Assassin"] },
  // ... добавьте остальных чемпионов
];