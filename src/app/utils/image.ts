interface Image {
    id: string,
    color: string,
    description: string,
    alt_description: string,
    urls: {
        raw: string,
        full: string,
        regular: string,
        small: string,
        thumb: string,
    },
    user: {
        name: string,
        portfolio_url: any,
        instagram_username: string,
        profile_image: {
            large: string,
            medium: string,
        }
    },
    links: {
        self: string,
        html: string,
        download: string,
        download_location: string,
    },
}