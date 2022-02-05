import { MailChimpMergeFields } from "./MailChimpMergeFields"
import { MailChimpTag } from "./MailChimpTag"

export interface MailChimpMember {
  id: string
  email_address: string
  unique_email_id: string
  status: "subscribed" | "unsubscribed"
  merge_fields: MailChimpMergeFields
  list_id: string
  last_changed: string
  interests: { [interestId: string]: boolean }
  tags: MailChimpTag[]
}

// {
//     "id": "f0da77671658a17728554c139ad44f3b",
//     "email_address": "maitai.garcia@montessorilatierra.org",
//     "unique_email_id": "af7099b73f",
//     "web_id": 152140603,
//     "email_type": "html",
//     "status": "subscribed",
//     "merge_fields": { "FNAME": "Maitai", "LNAME": "Garcia", "ADDRESSYU": "", "PHONEYUI_": "" },
//     "interests": {
//       "c1f9194e49": false,
//       "c4be082750": false,
//       "217d4160f4": false,
//       "86002e7651": false,
//       "6da47beefa": false,
//       "3324471ab5": false,
//       "18f8e8605f": false,
//       "d277019704": false,
//       "597371560d": false,
//       "317e8d9bc3": false,
//       "f526eff310": false,
//       "6936ed020e": false
//     },
//     "stats": { "avg_open_rate": 0, "avg_click_rate": 0 },
//     "ip_signup": "97.120.164.232",
//     "timestamp_signup": "2020-04-06T23:21:32+00:00",
//     "ip_opt": "98.19.11.11",
//     "timestamp_opt": "2020-04-06T23:35:30+00:00",
//     "member_rating": 2,
//     "last_changed": "2020-04-06T23:35:30+00:00",
//     "language": "",
//     "vip": false,
//     "email_client": "",
//     "location": {
//       "latitude": 35.98,
//       "longitude": -106.15,
//       "gmtoff": 0,
//       "dstoff": 0,
//       "country_code": "US",
//       "timezone": "America/Shiprock"
//     },
//     "source": "API - Generic",
//     "tags_count": 4,
//     "tags": [
//       { "id": 10119, "name": "Exported From Populi" },
//       { "id": 10415, "name": "Active Lead" },
//       { "id": 10871, "name": "2020" },
//       { "id": 11887, "name": "CE - CC Webinar Attendee 04.01.2020" }
//     ],
//     "list_id": "42d5e0fcba",
//     "_links": [
//       {
//         "rel": "self",
//         "href": "https://us7.api.mailchimp.com/3.0/lists/42d5e0fcba/members/f0da77671658a17728554c139ad44f3b",
//         "method": "GET",
//         "targetSchema": "https://us7.api.mailchimp.com/schema/3.0/Definitions/Lists/Members/Response.json"
//       },
//       {
//         "rel": "parent",
//         "href": "https://us7.api.mailchimp.com/3.0/lists/42d5e0fcba/members",
//         "method": "GET",
//         "targetSchema": "https://us7.api.mailchimp.com/schema/3.0/Definitions/Lists/Members/CollectionResponse.json",
//         "schema": "https://us7.api.mailchimp.com/schema/3.0/CollectionLinks/Lists/Members.json"
//       },
//       {
//         "rel": "update",
//         "href": "https://us7.api.mailchimp.com/3.0/lists/42d5e0fcba/members/f0da77671658a17728554c139ad44f3b",
//         "method": "PATCH",
//         "targetSchema": "https://us7.api.mailchimp.com/schema/3.0/Definitions/Lists/Members/Response.json",
//         "schema": "https://us7.api.mailchimp.com/schema/3.0/Definitions/Lists/Members/PATCH.json"
//       },
//       {
//         "rel": "upsert",
//         "href": "https://us7.api.mailchimp.com/3.0/lists/42d5e0fcba/members/f0da77671658a17728554c139ad44f3b",
//         "method": "PUT",
//         "targetSchema": "https://us7.api.mailchimp.com/schema/3.0/Definitions/Lists/Members/Response.json",
//         "schema": "https://us7.api.mailchimp.com/schema/3.0/Definitions/Lists/Members/PUT.json"
//       },
//       {
//         "rel": "delete",
//         "href": "https://us7.api.mailchimp.com/3.0/lists/42d5e0fcba/members/f0da77671658a17728554c139ad44f3b",
//         "method": "DELETE"
//       },
//       {
//         "rel": "activity",
//         "href": "https://us7.api.mailchimp.com/3.0/lists/42d5e0fcba/members/f0da77671658a17728554c139ad44f3b/activity",
//         "method": "GET",
//         "targetSchema": "https://us7.api.mailchimp.com/schema/3.0/Definitions/Lists/Members/Activity/Response.json"
//       },
//       {
//         "rel": "goals",
//         "href": "https://us7.api.mailchimp.com/3.0/lists/42d5e0fcba/members/f0da77671658a17728554c139ad44f3b/goals",
//         "method": "GET",
//         "targetSchema": "https://us7.api.mailchimp.com/schema/3.0/Definitions/Lists/Members/Goals/Response.json"
//       },
//       {
//         "rel": "notes",
//         "href": "https://us7.api.mailchimp.com/3.0/lists/42d5e0fcba/members/f0da77671658a17728554c139ad44f3b/notes",
//         "method": "GET",
//         "targetSchema": "https://us7.api.mailchimp.com/schema/3.0/Definitions/Lists/Members/Notes/CollectionResponse.json"
//       },
//       {
//         "rel": "events",
//         "href": "https://us7.api.mailchimp.com/3.0/lists/42d5e0fcba/members/f0da77671658a17728554c139ad44f3b/events",
//         "method": "POST",
//         "targetSchema": "https://us7.api.mailchimp.com/schema/3.0/Definitions/Lists/Members/Events/POST.json"
//       },
//       {
//         "rel": "delete_permanent",
//         "href": "https://us7.api.mailchimp.com/3.0/lists/42d5e0fcba/members/f0da77671658a17728554c139ad44f3b/actions/delete-permanent",
//         "method": "POST"
//       }
//     ]
//   }
