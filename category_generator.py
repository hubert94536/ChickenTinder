import json

with open('categories.json') as f:
  data = json.load(f)
  
new_data = []

for i in range(0, len(data)):
    element = data[i]
    print(element)
    if 'restaurants' in element['parents']:
        if 'country_blacklist' in element:
            if 'US' not in element['country_blacklist']:
                new_data.append(element)
        elif 'country_whitelist' in element:
            if 'US' in element['country_whitelist']:
                new_data.append(element)
        else:
          new_data.append(element)
    # else:
    #   for category in new_data:
    #     if category in element['parents']:
    #       new_data.append(element)
    #       break

with open('fixed_categories2.json', 'w') as new_file:
  json.dump(new_data, new_file)