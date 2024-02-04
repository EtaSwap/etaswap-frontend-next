export const parseTokens = (tokens: any): any[] => tokens.map((token: number[]) => token[1])
    .sort((a: any, b: any) =>
        a.providers.length > b.providers.length
            ? -1
            : (a.providers.length === b.providers.length
                    ? (a.name > b.name ? 1 : -1)
                    : 1
            )
    )
