import axios, { AxiosError } from "axios"
import moment from "moment-timezone"
import * as querystring from "querystring"
import { IStatusMonitorPing } from "../../api/IStatusMonitorPing"
import { getMiscSettings } from "../getMiscSettings"
import prisma from "../prisma"
import { makePopuliApiRequest } from "./makePopuliApiRequest"
import { AddTagResponse } from "./models/populi/AddTagResponse"
import {
  Address,
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
      await makePopuliApiRequest(() => {
        return axios
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
          .catch((err) => {
            if (err.response) {
              console.log(err.response.data) // => the response payload
              console.log(`person:`) // => the response payload
              console.log(person) // => the response payload

              // ignore some errors
              const ignoreErrors = ["is not a valid person_id"]
              const ignorable =
                ignoreErrors.filter((x) => err.response.data.includes(x))
                  .length > 0
              if (ignorable) {
                console.log("This error is ignorable")
                return
              }
            }
            throw err
          })
      })
    }
  }
  return addTags
}

async function fetchPersonFromPopuli(person_id: number) {
  return makePopuliApiRequest(() => {
    return axios
      .post(
        `https://montessorinorthwest.populiweb.com/api/`,
        querystring.stringify({
          task: "getPerson",
          person_id,
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
  })
}

export async function runPopuliProcessing() {
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

      // important to use America/Los_Angeles timezone
      const start_time = moment(startTime)
        .tz("America/Los_Angeles")
        .format("YYYY-MM-DD HH:mm:ss")

      const response = await makePopuliApiRequest(() => {
        return axios
          .post(
            `https://montessorinorthwest.populiweb.com/api/`,
            querystring.stringify({
              task: "getUpdatedPeople",
              start_time,
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
      })

      if (response === null) {
        log("Failed to fetch updated people")
        keepGoing = false
        continue
      }

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
          const personResponse = await fetchPersonFromPopuli(p.id)

          if (personResponse === null) {
            log(`Failed to fetch person ${p.id}`)
            continue
          }
          const { response: person } = personResponse

          if (person.status === "DELETED") {
            log(`Skipping DELETED person ${p.id}`)
          } else {
            // UPDATE RECORD IN POPULI IF NEEDED
            const addTags = await processPopuliPerson(p.id, person)
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
      name: "Process Populi Data",
      groupName: "Populi",
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
