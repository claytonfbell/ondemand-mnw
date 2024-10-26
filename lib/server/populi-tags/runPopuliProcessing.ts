import axios from "axios"
import moment from "moment-timezone"
import { IStatusMonitorPing } from "../../api/IStatusMonitorPing"
import { getMiscSettings } from "../getMiscSettings"
import prisma from "../prisma"
import { IPersonFull, IPersonResult } from "./IPerson"
import { populiRegionTags } from "./populiRegionTags"

const logs: string[] = []
function log(str: string) {
  logs.push(str)
  console.log(str)
}

// POPULI UPDATES
async function processPopuliPerson(person: IPersonFull) {
  const addresses = person.addresses

  console.log(`Processing \`${person.first_name} ${person.last_name}\``)
  //-->log(JSON.stringify(person, null, 2))

  // get unique list of states
  const states = addresses
    .map((adr) => adr.state)
    .filter((x) => x !== undefined && x !== null && x !== "")
    .filter((value, index, self) => self.indexOf(value) === index)

  console.log(`states: ${JSON.stringify(states)}`)

  // get unique list of countries
  const countries = addresses
    .map((adr) => adr.country)
    .filter((x) => x !== undefined && x !== null && x !== "")
    .filter((value, index, self) => self.indexOf(value) === index)

  console.log(`countries: ${JSON.stringify(countries)}`)

  // get uniqe zip codes
  const zips = addresses
    .map((adr) => adr.postal)
    .filter((x) => x !== undefined && x !== null && x !== "")
    .filter((value, index, self) => self.indexOf(value) === index)

  console.log(`zips: ${JSON.stringify(zips)}`)

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

  console.log(`regionTagNames: ${JSON.stringify(regionTagNames)}`)

  const populiTags = person.tags

  const addTags: string[] = regionTagNames.filter(
    (x) => populiTags.filter((y) => y.name === x).length === 0
  )

  console.log(`addTags: ${JSON.stringify(addTags)}`)

  // TODO create removeTags array to cleanup incorrect regions
  if (addTags.length > 0) {
    log(
      `Applying Populi tags to \`${person.first_name} ${
        person.last_name
      }\`: ${addTags.map((x) => `\`${x}\``).join(", ")}`
    )

    for (let i = 0; i < addTags.length; i++) {
      const data = JSON.stringify(
        {
          name: addTags[i],
        },
        null,
        2
      )
      await axios.get(
        `https://montessorinorthwest.populiweb.com/api2/people/${person.id}/tags/add`,
        {
          data,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${process.env.POPULI_API_TOKEN_NEW}`,
          },
        }
      )
    }
  }
}

async function fetchPersonFromPopuli(person_id: number) {
  return axios
    .get<IPersonFull>(
      `https://montessorinorthwest.populiweb.com/api2/people/${person_id}`,
      {
        data: JSON.stringify({
          expand: ["addresses", "tags"],
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${process.env.POPULI_API_TOKEN_NEW}`,
        },
      }
    )
    .then((resp) => {
      return resp.data
    })
}

export async function runPopuliProcessing() {
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

  let hasMore = true
  let page = 1
  while (hasMore === true) {
    const data = JSON.stringify(
      {
        page,
        filter: [
          {
            logic: "ALL",
            fields: [
              {
                name: "info_changed",
                value: {
                  type: "RANGE",
                  start: moment(startTime).toISOString(),
                  end: moment().toISOString(),
                },
                positive: 1,
              },
            ],
          },
        ],
      },
      null,
      2
    )
    console.log(`fetching page ${data}`)

    const response = await axios
      .get<IPersonResult>(
        `https://montessorinorthwest.populiweb.com/api2/people`,
        {
          data,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.POPULI_API_TOKEN_NEW}`,
          },
        }
      )
      .then((resp) => resp.data)

    log(`page ${response.page} of ${response.pages}`)

    // process the people
    for (let i = 0; i < response.data.length; i++) {
      console.log(
        `page ${response.page} of ${response.pages} processing index ${i} of ${response.data.length}`
      )
      const p = response.data[i]

      // FETCH MORE DETAILS IN POPULI
      const person = await fetchPersonFromPopuli(p.id)
      //-->log(`person: ${JSON.stringify(person, null, 2)}`)

      if (person === null) {
        log(`Failed to fetch person ${p.id}`)
        continue
      }

      if (person.status === "DELETED") {
        log(`Skipping DELETED person ${p.id}`)
      } else {
        // UPDATE RECORD IN POPULI IF NEEDED
        await pause(i % 20 === 0 ? 4000 : 200)
        await processPopuliPerson(person)
      }

      // temporary break
      //   if (i >= 0) {
      //     break
      //   }
    }

    // continue to next page if there are more
    page++
    hasMore = response.page < response.pages
  }
  //   log("STOPPING HERE!")
  //   return

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
}

async function pause(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
