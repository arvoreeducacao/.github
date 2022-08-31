import requests
from requests.structures import CaseInsensitiveDict
import datetime
import argparse
parser = argparse.ArgumentParser()
parser.add_argument('--revision', help='foo help')
parser.add_argument('--changelog', help='foo help')
parser.add_argument('--description', help='foo help')
parser.add_argument('--new_relic_api_key', help='foo help')
parser.add_argument('--new_relic_application_id', help='foo help')
parser.add_argument('--user', help='foo help')

args = parser.parse_args()


url = "https://api.newrelic.com/v2/applications/{app_id}/deployments.json".format(app_id=args.new_relic_application_id)

headers = CaseInsensitiveDict()
headers["Api-Key"] = args.new_relic_api_key
headers["Content-Type"] = "application/json"

data = {
  "deployment": {
    "revision": args.revision,
    "changelog": args.changelog,
    "description": args.description,
    "user": args.user,
    "timestamp": datetime.datetime.now().astimezone().isoformat()
  }
}

resp = requests.post(url, headers=headers, data=data)

print(resp.status_code)
