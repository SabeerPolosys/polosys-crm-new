import { ReactNode } from "react";
import { CSVLink } from "react-csv";

export default function DownloadCsv({data, headers, children, styles, docName}: {data:any[], headers: any[], children: ReactNode|string, styles: string, docName: string}) {
  return (
    <div>
      <CSVLink
      data={data}
      headers={headers}
      filename={`${docName}.csv`}
      className={`btn btn-primary ${styles}`}
      target="_blank"
    >
      {children}
    </CSVLink>
    </div>
  )
}
