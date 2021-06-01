/** @jsx jsx */
import { jsx } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltDown, faPlay } from "@fortawesome/free-solid-svg-icons";
import { graphql } from "gatsby";
import { trackCustomEvent } from "gatsby-plugin-google-analytics";
import * as R from "ramda";
import { Fragment, useState } from "react";
import { Helmet } from "react-helmet";
import "twin.macro";

// import song from '../song.mp3';
import AudioPlayer from "../components/AudioPlayer";
import MixFilter from "../components/MixFilter";

const getMixes = R.pathOr([], ["allAirtable", "edges"]);

const Home = ({ data }) => {
  const mixes = getMixes(data);
  const [filteredMixes, setFilteredMixes] = useState(mixes);
  const [currentTrack, setCurrentTrack] = useState({
    artist: null,
    title: null,
    src: null,
  });

  const handleDownloadClick = ({ artist, title, src }) => {
    trackCustomEvent({
      category: "Download Button",
      action: "Download",
      label: artist,
      value: `${artist} - ${title}`,
    });
  };

  const handlePlayClick = ({ artist, title, src }) => {
    trackCustomEvent({
      category: "Play Button",
      action: "Play",
      label: artist,
      value: `${artist} - ${title}`,
    });
    setCurrentTrack({ artist, title, src });
  };

  return (
    <Fragment>
      <Helmet>
        <title>The Vault</title>
      </Helmet>
      <div tw="bg-gray-900 text-white">
        <main tw="m-auto max-w-xl pt-32 px-2">
          <h1 tw="font-semibold text-center text-5xl">Welcome to the Vault</h1>
          <MixFilter
            aria-controls="mixes"
            mixList={mixes}
            setMixList={setFilteredMixes}
            tw="mt-8"
          />

          <div tw="font-semibold">{filteredMixes.length} Mixes</div>

          <ul id="mixes" aria-label="Mixes" tw="mt-8">
            {/* Show a local file during development for testing. */}
            {/* {process.env.NODE_ENV === "development" ? (
              <li tw="flex items-center py-4">
                <div tw="flex flex-col">
                  <span tw="text-gray-400 text-sm">Test Artist</span>
                  <span tw="font-semibold">Test Track</span>
                </div>
                <div tw="flex space-x-4 ml-auto text-red-400">
                  <button
                    onClick={() =>
                      setCurrentTrack({
                        artist: "Test Artist",
                        title: "Test Track",
                        src: song,
                      })
                    }
                    title="Play"
                    type="button"
                    tw="inline-flex justify-center items-center w-8 h-8 rounded-full shadow-neu"
                  >
                    <FontAwesomeIcon icon={faPlay} size="xs" />
                  </button>
                </div>
              </li>
            ) : null} */}
            {filteredMixes.map(
              ({
                node: {
                  id,
                  data: { artist, collection, date, episode, src, tags, title },
                },
              }) => (
                <li key={id} tw="flex items-center py-4">
                  <div tw="flex flex-col">
                    <span tw="text-gray-400 text-sm">{artist}</span>
                    <span tw="font-semibold">{title}</span>
                    <div tw="flex text-sm mt-2 space-x-8">
                      {date ? (
                        <span tw="flex flex-col">
                          <span tw="text-gray-400">Date</span>
                          <span>{date}</span>
                        </span>
                      ) : null}
                      {/* {collection ? (
                        <span tw="flex flex-col">
                          <span tw="text-gray-400">Collection</span>
                          <span>{collection}</span>
                        </span>
                      ) : null}
                      {episode ? (
                        <span tw="flex flex-col">
                          <span tw="text-gray-400">Episode</span>
                          <span>{episode}</span>
                        </span>
                      ) : null} */}
                      {tags?.length ? (
                        <span tw="flex flex-col">
                          <span tw="text-gray-400">Tags</span>
                          <span tw="flex flex-row">
                            {tags.map((tag) => (
                              <span
                                key={tag}
                                tw="bg-gray-200 text-gray-900 rounded inline-block px-1 mr-1"
                              >
                                {tag}
                              </span>
                            ))}
                          </span>
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div tw="flex space-x-4 ml-auto text-red-400">
                    <button
                      onClick={() => handlePlayClick({ artist, title, src })}
                      title="Play"
                      type="button"
                      tw="inline-flex justify-center items-center w-8 h-8 rounded-full shadow-neu"
                    >
                      <span tw="sr-only">Play "{title}"</span>
                      <FontAwesomeIcon icon={faPlay} size="xs" />
                    </button>
                    {src ? (
                      <a
                        download
                        href={src}
                        onClick={() =>
                          handleDownloadClick({ artist, title, src })
                        }
                        title="Download"
                        tw="inline-flex justify-center items-center w-8 h-8 rounded-full shadow-neu"
                      >
                        <span tw="sr-only">Download "{title}"</span>
                        <FontAwesomeIcon icon={faLongArrowAltDown} />
                      </a>
                    ) : null}
                  </div>
                </li>
              )
            )}
          </ul>
        </main>
        {currentTrack?.src ? (
          <div tw="sticky bottom-0 bg-gray-800 w-full z-10">
            <AudioPlayer currentTrack={currentTrack} />
          </div>
        ) : null}
      </div>
    </Fragment>
  );
};

export default Home;

export const query = graphql`
  query MixesList {
    allAirtable(sort: { fields: data___date, order: DESC }) {
      edges {
        node {
          id
          data {
            artist
            collection
            date(formatString: "MMM YYYY")
            episode
            tags
            src
            title
          }
        }
      }
    }
  }
`;
