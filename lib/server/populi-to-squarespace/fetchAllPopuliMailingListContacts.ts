import axios from "axios"
import moment from "moment"
import papaparse from "papaparse"
import { IPopuliPeopleResponse } from "./IPopuliPeopleResponse"

interface RowData {
  firstName: string
  lastName: string
  email: string
}

export async function fetchAllPopuliMailingListContacts(alumni: boolean) {
  console.log("fetchAllPopuliMailingListContacts")

  const baseUrl = "https://montessorinorthwest.populiweb.com/api2"
  const peopleUrl = `${baseUrl}/people`

  // tag with today's date
  const exportTag = `sp-${moment().format("YYYY-MM-DD")}}`

  // fetch all people
  let keepGoing = true
  let page = 0
  const pauseMs = 100
  const maxPages = 100
  const allData: RowData[] = []
  while (keepGoing) {
    page++
    const filter = {
      "0": {
        logic: "ALL",
        fields: [
          {
            name: "tag",
            value: {
              display_text: "Alumni",
              id: "12",
            },
            positive: alumni ? 1 : 0,
          },
        ],
      },
    }
    // console.log(JSON.stringify(filter, null, 2))

    const response = await axios.get<IPopuliPeopleResponse>(peopleUrl, {
      data: {
        page,
        expand: ["email_addresses", "tags"],
        filter,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.POPULI_API_TOKEN_NEW}`,
      },
    })

    // console.log(response.data)

    const newRowData: RowData[] = response.data.data
      .map((person) => {
        const email = person.email_addresses.find(
          (email) => email.primary
        )?.email
        const firstName = person.first_name
        const lastName = person.last_name

        // if (person.tags.find((tag) => tag.name === "Alumni")) {
        //   console.log("found alumni", person)
        // }

        return {
          firstName,
          lastName,
          email: email ?? "",
          alumni,
        }
      })
      .filter((row) => row.email !== "")

    allData.push(...newRowData)

    keepGoing = response.data.has_more && page < maxPages

    // pause for a second
    if (keepGoing) {
      console.log("pausing for a moment")
      await new Promise((resolve) => setTimeout(resolve, pauseMs))
    }
  }

  // return as csv
  return papaparse.unparse(
    [
      ["Email Address", "First Name", "Last Name"],
      ...allData.map((row) => {
        return [row.email, row.firstName, row.lastName]
      }),
    ],
    {
      quotes: false, //or array of booleans
      quoteChar: '"',
      escapeChar: '"',
      delimiter: ",",
      header: true,
      newline: "\r\n",
      skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
    }
  )
}
