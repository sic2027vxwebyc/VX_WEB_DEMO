import json
import os

locales_dir = 'src/i18n/locales'
master_locale = 'ko'
placeholder_locale = 'en'
target_locales = ['en', 'ja', 'es', 'ru', 'zh-TW']

domains = [
    'admin', 'ar', 'booking', 'common', 'directory', 'errors', 'events', 
    'home', 'map', 'navigation', 'notifications', 'settings', 'spaceDetail', 'viewer'
]

def get_nested_key(data, keys):
    for key in keys:
        if isinstance(data, dict) and key in data:
            data = data[key]
        else:
            return None
    return data

def sync_dict(master, placeholder, current, path=[]):
    synced = {}
    for key, value in master.items():
        current_path = path + [key]
        if isinstance(value, dict):
            p_val = placeholder.get(key, {}) if isinstance(placeholder, dict) else {}
            c_val = current.get(key, {}) if isinstance(current, dict) else {}
            synced[key] = sync_dict(value, p_val, c_val, current_path)
        else:
            # Prefer current value if it exists and matches structure
            if isinstance(current, dict) and key in current and not isinstance(current[key], dict):
                synced[key] = current[key]
            # Then placeholder value
            elif isinstance(placeholder, dict) and key in placeholder and not isinstance(placeholder[key], dict):
                synced[key] = placeholder[key]
            # Finally master value
            else:
                synced[key] = value
    return synced

for locale in target_locales:
    locale_path = os.path.join(locales_dir, locale)
    if not os.path.exists(locale_path):
        os.makedirs(locale_path)
    
    for domain in domains:
        master_file = os.path.join(locales_dir, master_locale, f"{domain}.json")
        placeholder_file = os.path.join(locales_dir, placeholder_locale, f"{domain}.json")
        target_file = os.path.join(locale_path, f"{domain}.json")
        
        if not os.path.exists(master_file):
            print(f"Warning: Master file {master_file} missing")
            continue
            
        with open(master_file, 'r', encoding='utf-8') as f:
            master_data = json.load(f)
            
        placeholder_data = {}
        if os.path.exists(placeholder_file):
            with open(placeholder_file, 'r', encoding='utf-8') as f:
                placeholder_data = json.load(f)
        
        current_data = {}
        if os.path.exists(target_file):
            with open(target_file, 'r', encoding='utf-8') as f:
                try:
                    current_data = json.load(f)
                except json.JSONDecodeError:
                    print(f"Warning: Could not decode {target_file}")
        
        synced_data = sync_dict(master_data, placeholder_data, current_data)
        
        with open(target_file, 'w', encoding='utf-8') as f:
            json.dump(synced_data, f, indent=2, ensure_ascii=False)
            f.write('\n')
        print(f"Synced {locale}/{domain}.json")
