export const sortTokens = (tokensMap: any) => ([...tokensMap]
    .map(wrap => wrap[1])
    .sort((a, b) =>
        a.providers.length > b.providers.length
            ? -1
            : (a.providers.length === b.providers.length
                    ? (a.name > b.name ? 1 : -1)
                    : 1
            )
    )
);
