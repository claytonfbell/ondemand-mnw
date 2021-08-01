# Mux Stuff

## Setup Playback Restrictions on domain

```bash
curl 'https://api.mux.com/video/v1/playback-restrictions' \
  -X POST \
  -d '{ "referrer": { "allowed_domains": ["*.montessori-nw.org"], "allow_no_referrer": false } }' \
  -H "Content-Type: application/json" \
  -u "MUX_TOKEN_ID:MUX_TOKEN_SECRET"

curl 'https://api.mux.com/video/v1/playback-restrictions' \
  -X GET \
  -H "Content-Type: application/json" \
  -u "MUX_TOKEN_ID:MUX_TOKEN_SECRET"

curl 'https://api.mux.com/video/v1/playback-restrictions/Ndb9lWUBv02wYmCn3w3026afTrtC79NDhAU3lw74s4AfQ' \
  -X DELETE \
  -H "Content-Type: application/json" \
  -u "MUX_TOKEN_ID:MUX_TOKEN_SECRET"


```
