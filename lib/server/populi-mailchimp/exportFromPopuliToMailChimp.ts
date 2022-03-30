import axios, { AxiosError } from "axios"
import md5 from "md5"
import moment from "moment"
import * as querystring from "querystring"
import { IStatusMonitorPing } from "../../api/IStatusMonitorPing"
import { getMiscSettings } from "../getMiscSettings"
import prisma from "../prisma"
import { MailChimpCreateMemberError } from "./models/MailChimpCreateMemberError"
import { MailChimpMember } from "./models/MailChimpMember"
import { MailChimpMergeFields } from "./models/MailChimpMergeFields"
import { MailChimpTag } from "./models/MailChimpTag"
import { AddTagResponse } from "./models/populi/AddTagResponse"
import {
  Address,
  Email,
  GetPersonResponse,
  Person,
  PopuliTag,
} from "./models/populi/GetPersonResponse"
import {
  GetUpdatedPeopleResponse,
  UpdatedPerson,
} from "./models/populi/GetUpdatedPeopleResponse"
import { populiRegionTags } from "./populiRegionTags"
import { xml2json } from "./xml2Json"

const POPULI_API_KEY = process.env.POPULI_API_KEY || ""
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY || ""
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID || ""

interface LogMessage {
  id: number
  message: string
}

let messageCount = 0
const getMessageId = () => messageCount++

const logs: string[] = []
function log(str: string) {
  logs.push(str)
  console.log(str)
}

// POPULI UPDATES
async function processPopuliPerson(personId: number, person: Person) {
  const addresses: Address[] = Array.isArray(person.address)
    ? person.address
    : person.address === undefined
    ? []
    : [person.address]

  // get unique list of states
  const states = Array.from(
    new Set(
      addresses
        .map((adr) => adr.state)
        .filter((x) => x !== undefined && x !== null && x !== "")
    )
  )

  // get unique list of countries
  const countries = Array.from(
    new Set(
      addresses
        .map((adr) => adr.country)
        .filter((x) => x !== undefined && x !== null && x !== "")
    )
  )

  // get uniqe zip codes
  const zips = Array.from(
    new Set(
      addresses
        .map((adr) => adr.zip)
        .filter((x) => x !== undefined && x !== null && x !== "")
    )
  )

  const regionTagNames: string[] = []
  populiRegionTags.forEach((prt) => {
    // tag from zip
    if (
      prt.zips !== undefined &&
      prt.zips.filter((value) => zips.indexOf(String(value)) !== -1).length > 0
    ) {
      regionTagNames.push(prt.tag)
    }
    // tag from countries
    if (prt.testCountries !== undefined && prt.testCountries(countries)) {
      regionTagNames.push(prt.tag)
    }
    // tag from states
    if (
      prt.states !== undefined &&
      prt.states.filter((value) => states.indexOf(value) !== -1).length > 0
    ) {
      regionTagNames.push(prt.tag)
    }
  })

  const populiTags: PopuliTag[] = Array.isArray(person.tags.tag)
    ? person.tags.tag
    : person.tags.tag !== undefined
    ? [person.tags.tag]
    : []

  const addTags: string[] = regionTagNames.filter(
    (x) => populiTags.filter((y) => y.name === x).length === 0
  )

  // TODO create removeTags array to cleanup incorrect regions

  if (addTags.length > 0) {
    log(
      `Applying Populi tags to \`${person.first} ${person.last}\`: ${addTags
        .map((x) => `\`${x}\``)
        .join(", ")}`
    )

    for (let i = 0; i < addTags.length; i++) {
      const response = await axios
        .post(
          `https://montessorinorthwest.populiweb.com/api/`,
          querystring.stringify({
            task: "addTag",
            person_id: personId,
            tag: addTags[i],
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: POPULI_API_KEY,
            },
          }
        )
        .then((resp) => {
          return xml2json(resp.data) as Promise<AddTagResponse>
        })
    }
  }
}

// MAILCHIMP ADD / UPDATE
async function processMailChimpPerson(person: Person) {
  // log(`processMailChimpPerson ${JSON.stringify(person)}`)

  const mailChimpAuth = {
    auth: {
      username: "any",
      password: MAILCHIMP_API_KEY,
    },
  }

  const emails: Email[] = Array.isArray(person.email)
    ? person.email
    : person.email !== undefined
    ? [person.email]
    : []

  for (let j = 0; j < emails.length; j++) {
    // LOOKUP IN MAILCHIMP
    let mcMember = await axios
      .get(
        `https://us7.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/${md5(
          emails[j].address.toLowerCase()
        )}`,
        mailChimpAuth
      )
      .then((resp) => {
        return resp.data as Promise<MailChimpMember>
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 404) {
          return null
        }
        throw err
      })

    // CREATE NEW MAILCHIMP MEMBER
    if (mcMember === null && emails[j].no_mailings !== true) {
      log(`Adding missing email \`${emails[j].address}\` to MailChimp...`)
      mcMember = await axios
        .post(
          `https://us7.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`,
          {
            email_address: emails[j].address,
            status: "subscribed",
          },
          mailChimpAuth
        )
        .then((resp) => {
          return resp.data as Promise<MailChimpMember>
        })
        .catch((e: AxiosError) => {
          const err: MailChimpCreateMemberError = e.response?.data
          throw Error(
            `**${err.title}** - ${err.detail} You submitted \`${emails[j].address}\``
          )
        })
    }

    // now lets make sure mcMember data is up2dat2
    if (mcMember !== null) {
      let doUpdate = false
      const merge_fields: MailChimpMergeFields = {
        FNAME: "",
        LNAME: "",
      }
      // update first/last name
      if (
        person.first !== mcMember.merge_fields.FNAME ||
        person.last !== mcMember.merge_fields.LNAME
      ) {
        merge_fields.FNAME = person.first
        merge_fields.LNAME = person.last
        doUpdate = true
      }
      if (doUpdate) {
        log(
          `Updating name from \`${mcMember.merge_fields.FNAME} ${mcMember.merge_fields.LNAME}\` to  \`${merge_fields.FNAME} ${merge_fields.LNAME}\``
        )
        mcMember = await axios
          .patch(
            `https://us7.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/${mcMember.id}`,
            { merge_fields },
            mailChimpAuth
          )
          .then((resp) => {
            return resp.data as Promise<MailChimpMember>
          })
      }

      // update tags
      const populiTags: PopuliTag[] = Array.isArray(person.tags.tag)
        ? person.tags.tag
        : person.tags.tag !== undefined
        ? [person.tags.tag]
        : []

      const tags: MailChimpTag[] = []
      populiTags.forEach((x) => {
        if (mcMember?.tags.find((y) => y.name === x.name) === undefined) {
          tags.push({ name: x.name, status: "active" })
        }
      })
      if (tags.length > 0 && mcMember !== null) {
        log(
          `Applying tags to \`${mcMember?.email_address}\`: ${tags
            .map((x) => `\`${x.name}\``)
            .join(", ")}`
        )
        const r = await axios.post(
          `https://us7.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/${mcMember.id}/tags`,
          { tags },
          mailChimpAuth
        )
      }
    }
  }
}

export async function exportFromPopuliToMailChimp() {
  try {
    logs.splice(0, logs.length)

    // reset start time
    // await prisma.miscSettings.update({
    //   where: { id: 1 },
    //   data: {
    //     exportFromPopuliLastModifiedTime: moment()
    //       .subtract(4, "hours")
    //       .toDate(),
    //   },
    // })

    const miscSettings = await getMiscSettings()
    const startTime = moment(
      miscSettings.exportFromPopuliLastModifiedTime
    ).toISOString()
    const newStartTime = moment().toDate()

    let keepGoing = true
    let offset = 0

    while (keepGoing) {
      // FETCH UPDATED PEOPLE IN POPULI
      log(
        `Fetching updated people since \`${moment(
          startTime
        ).fromNow()}\` with offset \`${offset}\`...`
      )
      const response = await axios
        .post(
          `https://montessorinorthwest.populiweb.com/api/`,
          querystring.stringify({
            task: "getUpdatedPeople",
            start_time: moment(startTime).format("YYYY-MM-DD HH:mm:ss"),
            offset,
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: POPULI_API_KEY,
            },
          }
        )
        .then((resp) => {
          return xml2json(resp.data) as Promise<GetUpdatedPeopleResponse>
        })
        .catch((e: AxiosError) => {
          throw Error(
            `Failed **Populi** API request \`getUpdatedPeople\` with status \`${
              e.response?.statusText ||
              e.response?.status ||
              e.message ||
              "unknown"
            }\``
          )
        })

      let updatedPeople: UpdatedPerson[] = []
      if (response.response.person !== undefined) {
        updatedPeople = Array.isArray(response.response.person)
          ? response.response.person
          : [response.response.person]
      }

      if (updatedPeople.length > 0) {
        log(
          `Processing \`${offset + 1} - ${offset + updatedPeople.length} of ${
            response.response.$.num_results
          }\``
        )

        for (let i = 0; i < updatedPeople.length; i++) {
          const p = updatedPeople[i]

          // FETCH MORE DETAILS IN POPULI
          // log(`Fetching details on \`${p.first_name}\` \`${p.last_name}\``)
          const personResponse = await axios
            .post(
              `https://montessorinorthwest.populiweb.com/api/`,
              querystring.stringify({
                task: "getPerson",
                person_id: p.id,
              }),
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  Authorization: POPULI_API_KEY,
                },
              }
            )
            .then((resp) => {
              return xml2json(resp.data) as Promise<GetPersonResponse>
            })

          // LOOP EACH EMAIL ADDRESS
          const { response: person } = personResponse

          // UPDATE RECORD IN POPULI IF NEEDED
          await processPopuliPerson(p.id, person)

          // MAILCHIMP
          try {
            await processMailChimpPerson(person)
          } catch (err: any) {
            log(err.message)
            log(`**Skipping over error...**`)
          }
        }
        offset += updatedPeople.length
        keepGoing = updatedPeople.length > 0
      } else {
        log("*No more results*")
        keepGoing = false
      }
    }

    log(`Setting new start time: ${newStartTime.toISOString()}`)
    await prisma.miscSettings.update({
      where: { id: 1 },
      data: { exportFromPopuliLastModifiedTime: newStartTime },
    })

    log("**Done!**")

    // status monitor
    const ping: IStatusMonitorPing = {
      name: "Export From Populi To MailChimp",
      groupName: "Populi and MailChimp",
      details: logs.join("\n\n"),
      apiKey: process.env.STATUS_MONITOR_API_KEY || "",
      interval: 60 * 24,
      success: true,
      tag: "",
      progressBar: 0,
      emails: ["angelika@montessori-nw.org", "claytonfbell@gmail.com"],
    }
    axios.post(`https://status-monitor.app/api/ping`, ping)
  } catch (e: any) {
    log("# ERROR")
    log(e.message)
  }
}
