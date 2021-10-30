import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { DynamoDB } from 'aws-sdk';
import { AWS_REGION } from '../consts';

const formatNumber = (phoneNumber: string) => {
    return phoneNumber.substr(0, phoneNumber.length - 6) + ' ' + phoneNumber.substr(phoneNumber.length - 6, 6);
};

const Home: NextPage<HomeProps> = ({ results }) => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Foundry Connect UI</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Last 5 Callers:
                </h1>

                <br/>

                <table>
                    <tr><th>Phone Number</th><th>Vanity Numbers</th></tr>
                    {results.map(result => <tr key={result.phoneNumber}>
                        <td><strong>{formatNumber(result.phoneNumber)}</strong></td>
                        <td>{result.vanityNumbers.map(number => formatNumber(number)).join(', ')}</td>
                    </tr>)}
                </table>

                <p className={styles.description}>
                    <p>Built by Jacob Ellis</p>
                    <a href='mailto: jacob@goellis.com'>jacob@goellis.com</a>
                </p>
            </main>
        </div>
    );
};

export default Home;

type VanityRecord = { phoneNumber: string, vanityNumbers: string[], insertTime: number };

type HomeProps = { results: VanityRecord[] };

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
    const dynamo = new DynamoDB.DocumentClient({ region: AWS_REGION });

    const results = await dynamo.scan({
        TableName: 'vanity-numbers'
    }).promise();

    const items = (results.Items as VanityRecord[])?.sort((item, item2) => item2.insertTime - item.insertTime).slice(0, 5);

    if (!items) {
        throw Error('Items were not present');
    }

    return { props: { results: items } };
};
