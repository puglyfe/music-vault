require("dotenv").config({
  path: ".env",
});

module.exports = {
  siteMetadata: {
    title: "music-vault",
  },
  plugins: [
    "gatsby-plugin-emotion",
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "257695822",
        head: false,
        anonymize: true,
        respectDNT: true,
        defer: true,
      },
    },
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
    {
      resolve: "gatsby-source-airtable",
      options: {
        apiKey: process.env.AIRTABLE_API_KEY,
        tables: [
          {
            baseId: "appDOzeafD6RAsfXI",
            tableName: "Vault",
          },
        ],
      },
    },
  ],
};
