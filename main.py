import base64
import json

import requests
from serpapi import GoogleSearch


def jsonhandle(jsonfile):
    with open(jsonfile + ".json", 'r', encoding='utf-8') as f:
        extracted = json.load(f)  # load json file
        jobs_results = extracted['jobs_results']
        #  print(jobs_results)
        for job in jobs_results:
            # get title of job
            titre = job['title']
            # get company name
            company_name = job['company_name']
            # get location
            localisation = job['location']
            # get description
            description = job['description']
            # get thumbnail if it exists
            if 'thumbnail' in job:
                thumbnail = job['thumbnail']
                print("thumbnail: ", thumbnail)
            else:
                thumbnail = "-1"

            # get provider
            via = job['via']
            # get job_id
            job_id = base64decoder(job['job_id'])
            # get job_link
            job_link = json.loads(job_id)['apply_link']['link']
            x = requests.post("http://localhost:3000/annonce/create/11",
                              data={"titre": titre, "description": description,
                                    "image": thumbnail, "localisation": localisation, "lien": job_link})

        print(x.text)


def get_jobs(query):
    params = {
        "api_key": "demander a youcef",
        "engine": "google_jobs",
        "google_domain": "google.fr",
        "q": query,
        "hl": "fr",
        "gl": "fr",
        "location": "Ile-de-France, France"
    }

    search = GoogleSearch(params)
    results = search.get_dict()
    with open(f"{query}.json", 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False)


def base64decoder(input_string):
    return base64.b64decode(input_string)


if __name__ == '__main__':
    query = "linux"
    # get_jobs(query)
    jsonhandle(query)
