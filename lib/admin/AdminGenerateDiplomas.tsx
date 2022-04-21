import { Form } from "material-ui-pack"
import moment from "moment"
import { useState } from "react"
import { useGenerateDiplomas } from "../api/api"
import { GenerateDiplomasRequest } from "../api/GenerateDiplomasRequest"

const description = `DESCRIPTION: Handwork supports concentration and engagement in the developing elementary 
child and can offer beautiful opportunities for follow up work in any area. We encourage, inspire 
and connect children to that handwork the same way we inspire children in other areas, through 
modeling and access in the prepared environment! In this workshop we will discuss ways we can 
bring inspirational handwork into the prepared environment through our stories, artifacts and 
personal touches in the space. We will think through how handwork can reflect the community 
where you spend your days ensuring that everyone is represented and seen.`

export function AdminGenerateDiplomas() {
  const [state, setState] = useState<GenerateDiplomasRequest>({
    names: "Clayton Bell\nAngelika Steinberg",
    description: description.split("\n").join(""),
    date: moment().format("YYYY-MM-DD"),
    instructorName: "Jane Doe",
  })

  const {
    mutateAsync: generateDiplomas,
    isLoading,
    error,
  } = useGenerateDiplomas()

  function handleSubmit() {
    generateDiplomas(state)
  }

  return (
    <Form
      busy={isLoading}
      error={error?.message}
      onSubmit={handleSubmit}
      state={state}
      setState={setState}
      submitLabel="Generate Diplomas"
      schema={{
        names: { type: "text", multiline: true, rows: 7 },
        instructorName: "capitalize",
        date: "date",
        description: { type: "text", multiline: true, rows: 7 },
      }}
      layout={{
        instructorName: { xs: 6, sm: 4 },
        names: { xs: 6, sm: 4 },
        date: { xs: 6, sm: 4 },
        description: { xs: 12, md: 8 },
        submitButton: { xs: 12 },
      }}
    />
  )
}
