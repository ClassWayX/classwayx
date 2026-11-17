import {fetchClasses} from "@/app/dashboard/_utils/fetchClasses";
import ClassNotFound from "@/app/dashboard/_components/ClassNotFound";
import LoadDashboardFailed from "@/app/dashboard/_components/LoadDashboardFailed";
import ClassTable from "@/app/dashboard/_components/ClassTable";
import AddClassButton from "@/app/dashboard/_components/AddClassButton";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const classesResult = await fetchClasses();

  let dashboardBody;

  if (classesResult.ok) {
    if (classesResult.value.length == 0) {
      dashboardBody = <ClassNotFound/>
    } else {
      dashboardBody = <>
        <ClassTable classItems={classesResult.value}></ClassTable>
        <AddClassButton />
      </>
    }
  } else {
    dashboardBody = <LoadDashboardFailed/>
  }

  return <>
    <DashboardHeader />
    {dashboardBody}
  </>
}

function DashboardHeader() { return <h1 className={"text-2xl font-bold"}>管理面板</h1> }
