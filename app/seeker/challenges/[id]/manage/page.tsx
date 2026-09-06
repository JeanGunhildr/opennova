import { redirect } from "next/navigation";
import { getManageChallengeDataAction } from "@/lib/actions/seeker-manage";
import ManageChallengeClient from "@/component/seeker/manage-challenge/ManageChallengeClient";

export default async function ManageChallengeSubroutePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data, error } = await getManageChallengeDataAction(id);

  if (error || !data) {
    redirect("/seeker/challenges");
  }

  return <ManageChallengeClient data={data} />;
}
