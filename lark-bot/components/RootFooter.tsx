"use server"

import packageJson from "../package.json"

export default async function RootFooter() {
  return <footer className={"shrink-0"}>
    ClassWayX version {packageJson.version}
  </footer>
}