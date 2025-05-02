import Scoreboard from './results/Scoreboard';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <Scoreboard searchParams={searchParams} />;
}
