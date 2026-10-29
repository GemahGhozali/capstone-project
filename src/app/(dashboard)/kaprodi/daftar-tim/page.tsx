import { TeamTable } from "@/features/tim/components/team-table";
import { getAllTeam } from "@/features/tim/queries";

export default async function DaftarTimPage() {
  const tim = await getAllTeam();

  return (
    <div className="space-y-4">
      <div className="space-y-0.5">
        <h1 className="font-semibold text-lg">Daftar Tim</h1>
        <p className="text-muted-foreground text-sm">Semua data tim capstone project yang terdaftar</p>
      </div>
      <TeamTable data={tim} />
    </div>
  );
}
