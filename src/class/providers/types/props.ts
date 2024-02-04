export type NetworkProps = {
    getTokensUrl: string | null;
    whbar: string | null;
    oracle: string | null;
}

export type Props = {
    [key: string]: NetworkProps;
}