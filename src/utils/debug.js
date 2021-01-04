const noop = () => {};
const debug =
  process.env.NODE_ENV === "production"
    ? ["debug", "error", "info", "log", "table", "warn"].reduce(
        (accumulator, currentValue) => ({
          ...accumulator,
          [currentValue]: noop,
        }),
        {}
      )
    : global.console;

export default debug;
