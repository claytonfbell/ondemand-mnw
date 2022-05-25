import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import { useTheme } from "@mui/material/styles"
import clsx from "clsx"
import { Spacer } from "material-ui-pack"
import React from "react"
import { Pagination } from "./Pagination"

type Props = {
  onChangePage: (pageNum: number) => void
  results: Pagination
}

export function Paginator(props: Props) {
  const theme = useTheme()
  const { pageNum, pageCount, pageSize, rowCount } = props.results

  const start = pageNum * pageSize - pageSize + 1
  const end = Math.min(pageNum * pageSize, rowCount)

  const pagesStart: number[] = [1, 2, 3].filter((x) => x < pageCount)
  const pagesEnd: number[] = [pageCount - 2, pageCount - 1, pageCount].filter(
    (x) => x > 0 && !pagesStart.includes(x)
  )
  const pagesMiddle: number[] = [pageNum - 1, pageNum, pageNum + 1].filter(
    (x) =>
      x > 0 && x < pageCount && !pagesStart.includes(x) && !pagesEnd.includes(x)
  )

  function pageButton(x: number) {
    return (
      <Button
        onClick={() => props.onChangePage(x)}
        variant="text"
        sx={{
          textTransform: "none",
          minWidth: 24,
          minHeight: 0,
          paddingLeft: "4px",
          paddingRight: "4px",
          marginRight: "6px",
          lineHeight: 1,
          border: `1px solid ${theme.palette.primary.main}`,
          "&.active": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          },
        }}
        className={clsx(x === pageNum ? "active" : undefined)}
      >
        {x.toLocaleString()}
      </Button>
    )
  }

  const ellipsis = (
    <Box
      component="span"
      sx={{
        marginRight: "6px",
      }}
    >
      ...
    </Box>
  )

  return (
    <>
      {pageCount > 1 ? (
        <>
          {start.toLocaleString()} - {end.toLocaleString()} of{" "}
          {rowCount.toLocaleString()}
          <Spacer />
          <IconButton
            disabled={pageNum === 1}
            size="small"
            onClick={() => props.onChangePage(pageNum - 1)}
          >
            <ChevronLeftIcon />
          </IconButton>
          {pagesStart.map((x) => (
            <React.Fragment key={x}>{pageButton(x)}</React.Fragment>
          ))}
          {(pagesMiddle.length > 0 &&
            pagesStart[pagesStart.length - 1] !== pagesMiddle[0] - 1) ||
          (pagesMiddle.length === 0 &&
            pagesEnd.length > 0 &&
            pagesStart[pagesStart.length - 1] !== pagesEnd[0] - 1)
            ? ellipsis
            : null}
          {pagesMiddle.map((x) => (
            <React.Fragment key={x}>{pageButton(x)}</React.Fragment>
          ))}
          {pagesMiddle.length > 0 &&
          pagesEnd.length > 0 &&
          pagesMiddle[pagesMiddle.length - 1] !== pagesEnd[0] - 1
            ? ellipsis
            : null}
          {pagesEnd.map((x) => (
            <React.Fragment key={x}>{pageButton(x)}</React.Fragment>
          ))}
          {pageNum < pageCount ? (
            <IconButton
              size="small"
              onClick={() => props.onChangePage(pageNum + 1)}
            >
              <ChevronRightIcon />
            </IconButton>
          ) : null}
          <Spacer />
        </>
      ) : null}
    </>
  )
}
