/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Link } from "gatsby";
import { Fragment } from "react";
import { Helmet } from "react-helmet";
import "twin.macro";

const NotFoundPage = () => {
  return (
    <Fragment>
      <Helmet>
        <title>404</title>
      </Helmet>
      <div>
        <main>
          <h1 tw="font-semibold text-center text-5xl">Page not found</h1>
          <p>
            Sorry{" "}
            <span role="img" aria-label="Pensive emoji">
              😔
            </span>{" "}
            we couldn’t find what you were looking for.
            <br />
            {process.env.NODE_ENV === "development" ? (
              <>
                <br />
                Try creating a page in <code>src/pages/</code>.
                <br />
              </>
            ) : null}
            <br />
            <Link to="/">Go home</Link>.
          </p>
        </main>
      </div>
    </Fragment>
  );
};

export default NotFoundPage;
