import Button from "@mui/material/Button"
import Fab from "@mui/material/Fab"
import Grid from "@mui/material/Grid"
import { Certificate } from "@prisma/client"
import {
  DisplayDate,
  ResponsiveTable,
  Spacer,
  TextFieldBase,
} from "material-ui-pack"
import moment from "moment"
import React from "react"
import { useDebounce } from "react-use"
import ConfirmDialog from "../../lib/ConfirmDialog"
import { Title } from "../../lib/Title"
import { Paginator } from "../shared/Paginator"
import { useFetchUserActivities } from "../userActivity/api"
import {
  useDeleteCertificate,
  useDownloadCertificates,
  useFetchCertificates,
} from "./api"
import { CertificateDialog } from "./CertificateDialog"
import { FetchCertificatesParams } from "./FetchCertificatesParams"

export function AdminCertificateList() {
  const [keyword, setKeyword] = React.useState("")
  const [state, setState] = React.useState<FetchCertificatesParams>({
    pageNum: 1,
    pageSize: 100,
    keyword: "",
  })
  const { data } = useFetchCertificates(state)
  useFetchUserActivities({ ...state, pageNum: state.pageNum + 1 })

  useDebounce(
    () => {
      setState((prev) => ({ ...prev, keyword }))
    },
    500,
    [keyword]
  )

  const [openCertificate, setOpenCertificate] = React.useState<Certificate>()
  const [confirmDeleteCertificate, setConfirmDeleteCertificate] =
    React.useState<Certificate>()

  const {
    mutateAsync: deleteCertificate,
    isLoading: isDeleting,
    error: deleteError,
  } = useDeleteCertificate()

  const { mutateAsync: downloadCertificates, isLoading: isDownloading } =
    useDownloadCertificates()

  return (
    <>
      <Grid container justifyContent="space-between">
        <Grid item>
          <Title label="Certificates" />
          <Spacer />
          <Grid container spacing={2}>
            <Grid item>
              <TextFieldBase
                label="Search Title"
                value={keyword}
                onChange={(keyword) => setKeyword(keyword)}
              />
            </Grid>
          </Grid>
          <Spacer />
        </Grid>
        <Grid item>
          <Fab
            variant="extended"
            onClick={() => {
              setOpenCertificate({
                id: 0,
                title: "",
                description: "",
                hours: "",
                presenter: "",
                displayDate: false,
                date: moment().format("YYYY-MM-DD"),
                names: "",
              })
            }}
          >
            Create Certificate
          </Fab>
        </Grid>
      </Grid>
      {data !== undefined ? (
        <>
          <Paginator
            results={{ ...data, pageNum: state.pageNum }}
            onChangePage={(pageNum) =>
              setState((prev) => ({ ...prev, pageNum }))
            }
          />
          <ResponsiveTable
            striped
            rowData={data?.data || []}
            onEdit={(certificate) => setOpenCertificate(certificate)}
            onDelete={(certificate) => setConfirmDeleteCertificate(certificate)}
            schema={[
              {
                label: "Date",
                render: (x) => (
                  <DisplayDate ymd={moment(x.date).format("YYYY-MM-DD")} />
                ),
              },
              {
                label: "Title",
                render: (x) => x.title,
              },
              {
                label: "Presenter",
                render: (x) => x.presenter,
              },
              {
                label: "Hours",
                render: (x) => x.hours,
              },
              {
                label: "Download",
                render: (x) => {
                  return (
                    <Button
                      disabled={isDownloading}
                      variant="outlined"
                      onClick={() => {
                        downloadCertificates(x.id)
                      }}
                    >
                      Download Certificates
                    </Button>
                  )
                },
              },
            ]}
          />
        </>
      ) : null}
      <Spacer />
      {openCertificate !== undefined ? (
        <CertificateDialog
          open={true}
          onClose={() => setOpenCertificate(undefined)}
          certificate={openCertificate}
        />
      ) : null}

      <ConfirmDialog
        message="Are you sure you want to delete this certificate?"
        open={confirmDeleteCertificate !== undefined}
        onClose={() => setConfirmDeleteCertificate(undefined)}
        onAccept={() => {
          if (confirmDeleteCertificate !== undefined) {
            deleteCertificate(confirmDeleteCertificate)
            setConfirmDeleteCertificate(undefined)
          }
        }}
      />
    </>
  )
}
