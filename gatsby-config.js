require("dotenv").config({
  path: ".env",
});

module.exports = {
  siteMetadata: {
    title: "music-vault",
  },
  plugins: [
    "gatsby-plugin-emotion",
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
