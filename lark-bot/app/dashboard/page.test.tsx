import {describe, expect, it, vi} from "vitest";
import {fetchClasses} from "@/app/dashboard/_utils/fetchClasses";
import {Err, Ok} from "@/types/result";
import Dashboard from "@/app/dashboard/page";
import {render, screen, within} from "@testing-library/react";

vi.mock("@/app/dashboard/_utils/fetchClasses", () => ({
  fetchClasses: vi.fn()
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("Dashboard tests", () => {
  it("can handle empty classes query result", async () => {
    vi.mocked(fetchClasses).mockResolvedValueOnce(Ok([]));

    const dashboardPage = await Dashboard();
    render(dashboardPage);
    expect(screen.queryByText("班级列表空空如也")).not.toBeNull();
  });

  it("can show classes information after good query result", async () => {
    vi.mocked(fetchClasses).mockResolvedValueOnce(Ok([
      {
        class_soft_id: 0,
        class_name: "Example class",
        created_at: new Date(),
      },
    ]));

    const dashboardPage = await Dashboard();
    render(dashboardPage);

    const table = screen.getByRole("table", {name: "班级列表"});
    const row = within(table).getByRole("row", {name: /Example class/});
    expect(within(row).queryByRole("cell", {name: "Example class"})).not.toBeNull();
    expect(within(row).queryByRole("cell", {name: "0"})).not.toBeNull();
  });

  it("can handle error query result", async () => {
    vi.mocked(fetchClasses).mockResolvedValueOnce(Err("Example failure"));

    const dashboardPage = await Dashboard();
    render(dashboardPage);
    expect(screen.queryByText("数据加载失败")).not.toBeNull();
  })
});
