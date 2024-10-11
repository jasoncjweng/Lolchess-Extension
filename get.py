import requests
from pymongo import MongoClient, UpdateOne
import time
client = MongoClient("mongodb://admin:admin@18.227.79.14:27017/?authMechanism=DEFAULT&authSource=admin")
db = client.huh
collection = db.a

leagues = ['IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND']
divisions = ['I', 'II', 'III', 'IV']
leagues2 = ['MASTER', 'GRANDMASTER', 'CHALLENGER']
# for l in leagues:
#     for d in divisions:
#         b = True
#         p = 1
#         while b:
#             print(l,d,p)
#             url = f'https://na1.api.riotgames.com/tft/league/v1/entries/{l}/{d}?queue=RANKED_TFT&page={p}'
#             key = 'RGAPI-f9db2ada-8847-480a-a0ac-1e69039b54b2'
#             result = requests.get(url, headers = {'X-Riot-Token': key})
#             if type(result.json()) != list:
#                 print('waiting')
#                 time.sleep(60)
#                 p-=1
#             elif len(result.json()) == 0: b = False
#             else:
#                 collection.bulk_write([UpdateOne({'puuid': x['puuid']}, {"$set": x}, upsert=True) for x in result.json()])
#             p += 1
i = 0
while i < len(leagues2):
    url = f'https://na1.api.riotgames.com//tft/league/v1/{leagues2[i]}'
    key = 'RGAPI-f9db2ada-8847-480a-a0ac-1e69039b54b2'
    result = requests.get(url, headers = {'X-Riot-Token': key})
    print(leagues2[i])
    if type(result.json()) != list:
        print('waiting')
        time.sleep(60)
        i-=1
    elif len(result.json()) == 0: b = False
    else:
        collection.bulk_write([UpdateOne({'puuid': x['puuid']}, {"$set": x}, upsert=True) for x in result.json()])