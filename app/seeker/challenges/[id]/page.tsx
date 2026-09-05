import ManageChallengeClient from "@/component/seeker/manage-challenge/ManageChallengeClient";

export default async function ManageChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ManageChallengeClient id={id} />;
}
