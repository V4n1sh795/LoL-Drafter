import os
import json
import requests
from urllib.parse import quote

# Настройки
STATIC_DIR = 'static'
ICONS_DIR = os.path.join(STATIC_DIR, 'icons')
JSON_PATH = os.path.join(STATIC_DIR, 'champions.json')

os.makedirs(ICONS_DIR, exist_ok=True)

def get_latest_version():
    url = "https://ddragon.leagueoflegends.com/api/versions.json"
    response = requests.get(url)
    response.raise_for_status()
    versions = response.json()
    return versions[0]  # самая свежая версия

def get_champion_list(version):
    url = f"https://ddragon.leagueoflegends.com/cdn/{version}/data/en_US/champion.json"
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()
    return data["data"]  # dict: { "Aatrox": { ... }, ... }

def sanitize_name(name: str) -> str:
    """Преобразует имя чемпиона в техническое имя для файла (без пробелов и апострофов)"""
    return name.replace("'", "").replace(" ", "").replace(".", "")

def download_icon(version, champion_key, champion_name, icons_dir):
    # Имя файла в ddragon — это champion_key (например, "Kaisa", а не "Kai'Sa")
    icon_url = f"https://ddragon.leagueoflegends.com/cdn/{version}/img/champion/{champion_key}.png"
    filename = f"{sanitize_name(champion_name)}.png"
    filepath = os.path.join(icons_dir, filename)

    if os.path.exists(filepath):
        print(f"✓ Уже скачан: {filename}")
        return filename

    try:
        response = requests.get(icon_url)
        response.raise_for_status()
        with open(filepath, 'wb') as f:
            f.write(response.content)
        print(f"↓ Скачан: {filename}")
        return filename
    except Exception as e:
        print(f"✗ Ошибка при скачивании {champion_key}: {e}")
        return None

def main():
    print("Получение последней версии...")
    version = get_latest_version()
    print(f"Версия: {version}")

    print("Получение списка чемпионов...")
    champion_data = get_champion_list(version)

    champions_json = {}

    for key, info in champion_data.items():
        name = info["name"]  # человекочитаемое имя: "Kai'Sa"
        # Техническое имя для ключа в JSON (без спецсимволов)
        safe_key = sanitize_name(name)

        print(f"Обработка: {name} ({key})")

        icon_filename = download_icon(version, key, name, ICONS_DIR)
        if icon_filename:
            champions_json[safe_key] = {
                "name": name,
                "icon": f"/static/icons/{icon_filename}"
            }

    print(f"\nГенерация {JSON_PATH}...")
    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(champions_json, f, indent=2, ensure_ascii=False)

    print(f"✅ Готово! Скачано {len(champions_json)} чемпионов.")

if __name__ == "__main__":
    main()