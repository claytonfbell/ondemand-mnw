import { Form } from "material-ui-pack"
import { useState } from "react"
import { useGenerateCertificates } from "../api/api"
import { GenerateCertificatesRequest } from "../api/GenerateCertificatesRequest"

const description = `DESCRIPTION: Handwork supports concentration and engagement in the developing elementary 
child and can offer beautiful opportunities for follow up work in any area. We encourage, inspire 
and connect children to that handwork the same way we inspire children in other areas, through 
modeling and access in the prepared environment! In this workshop we will discuss ways we can 
bring inspirational handwork into the prepared environment through our stories, artifacts and 
personal touches in the space. We will think through how handwork can reflect the community 
where you spend your days ensuring that everyone is represented and seen.`

export function AdminGenerateCertificates() {
  const [state, setState] = useState<GenerateCertificatesRequest>({
    names: "",
    description: description.split("\n").join(""),
    date: "2022-04-21",
    presenterName: "Andrea Fleener",
    eventName: "Handwork as Inspiration",
  })

  const {
    mutateAsync: generateCertificates,
    isLoading,
    error,
  } = useGenerateCertificates()

  function handleSubmit() {
    generateCertificates(state)
  }

  return (
    <Form
      busy={isLoading}
      error={error?.message}
      onSubmit={handleSubmit}
      state={state}
      setState={setState}
      submitLabel="Generate Certificates"
      schema={{
        eventName: "capitalize",
        presenterName: "capitalize",
        date: "date",
        description: { type: "text", multiline: true, rows: 7 },
        names: { type: "text", multiline: true, rows: 7 },
      }}
      layout={{
        eventName: { xs: 6, sm: 4 },
        presenterName: { xs: 6, sm: 4 },
        names: { xs: 6, sm: 4 },
        date: { xs: 6, sm: 4 },
        description: { xs: 12, md: 8 },
        submitButton: { xs: 12, sm: 4 },
      }}
    />
  )
}
