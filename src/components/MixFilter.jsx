/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Form, Select, Option } from "informed";
import PropTypes from "prop-types";
import * as R from "ramda";
import "twin.macro";

// Hardcoding this for now to enforce order.
const ARTISTS = ["The Hamptons", "Tyler Hampton", "Tyler C", "Champagne"];

const applyFilter = (filterValues, list) => {
  if (R.isEmpty(filterValues)) return list;

  const makeFilter = R.curry((path, selectedKey) =>
    R.filter(
      R.pipe(
        R.pathOr({}, path),
        R.includes(R.__, R.propOr({}, selectedKey)(filterValues))
      )
    )
  );

  const filteredByArtist = makeFilter(
    ["node", "data", "artist"],
    "artist"
  )(list);

  return filteredByArtist;
};

const MixFilter = ({ mixList, setMixList, ...rest }) => {
  const handleFilterChange = (values) => {
    if (R.isEmpty(values)) {
      setMixList(mixList);
    } else {
      setMixList(applyFilter(values, mixList));
    }
  };

  return (
    <section {...rest}>
      <Form onValueChange={handleFilterChange}>
        <div tw="flex flex-row items-center justify-between">
          <label>
            Alias
            <Select
              field="artist"
              tw="block mt-1 w-full py-1 px-2 border border-gray-400 bg-white rounded-lg text-gray-900"
            >
              <Option value="">All</Option>
              {ARTISTS.map((name, index) => (
                <Option key={index} value={name}>
                  {name}
                </Option>
              ))}
            </Select>
          </label>
        </div>
      </Form>
    </section>
  );
};

MixFilter.propTypes = {
  mixList: PropTypes.arrayOf(
    PropTypes.shape({
      node: PropTypes.shape({
        id: PropTypes.string.isRequired,
        data: PropTypes.shape({
          artist: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    })
  ).isRequired,
  setMixList: PropTypes.func.isRequired,
};

export default MixFilter;
