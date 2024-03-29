import type { GetStaticProps, NextPage } from 'next';
import { StaticDataProvider } from 'src/components/providers/static-data';
import { fetchKintoneActiveUser, fetchKintoneUserSummary } from 'src/lib/external';
import Page from 'src/components/pages/data';
import { getFormattedDate } from 'src/lib/util';

type StaticProps = {
  kintoneGraphData: website.graphData.KintoneUser[] | null;
  lastModified: string;
};

const GRAPH_POINT_COUNT = 100;

export const getStaticProps: GetStaticProps<StaticProps> = async () => {
  const [kintoneUserSummaryResult, kintoneActiveUserResult] = await Promise.allSettled([
    fetchKintoneUserSummary(),
    fetchKintoneActiveUser(),
  ]);

  const kintoneUserSummary =
    kintoneUserSummaryResult.status === 'fulfilled' ? kintoneUserSummaryResult.value : null;
  const kintoneActiveUser =
    kintoneActiveUserResult.status === 'fulfilled' ? kintoneActiveUserResult.value : null;

  let kintoneGraphData: website.graphData.KintoneUser[] = [];
  if (kintoneUserSummary && kintoneActiveUser) {
    const entries = Object.entries(kintoneUserSummary);
    const step = Math.floor(entries.length / GRAPH_POINT_COUNT);

    const targetEntries = entries.reduce<[string, external.kintone.SummaryItem][]>(
      (acc, summary, i) => {
        if (i % step === 0) {
          acc.push(summary);
        }
        return acc;
      },
      []
    );

    kintoneGraphData = targetEntries.map(([date, summary]) => {
      return {
        unixTime: summary.unixTime * 1000,
        dl: summary.numUsers,
        mau: kintoneActiveUser?.mau[date]?.count ?? null,
        wau: kintoneActiveUser?.wau[date]?.count ?? null,
        activeRate: (kintoneActiveUser?.mau[date]?.count || 0) / summary.numUsers,
        counter: summary.counter,
      };
    });
  }

  const us = new Date();
  us.setHours(us.getHours() + 9);

  const lastModified = getFormattedDate(us, 'M月d日');

  return {
    props: { kintoneGraphData, lastModified },
    revalidate: 12 * 60 * 60,
  };
};

const DashboardRoot: NextPage<StaticProps> = (props) => (
  <StaticDataProvider initialValue={props}>
    <Page />
  </StaticDataProvider>
);

export default DashboardRoot;
