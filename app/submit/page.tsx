import { getActiveContest } from '~/server/contests';
import Submit from './Submit';

export default async function Page() {
  const activeContest = await getActiveContest();
  return activeContest ? <Submit contest={activeContest} /> : <> </>;
}
