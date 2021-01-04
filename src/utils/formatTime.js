const formatTime = (seconds = 0) => {
  const date = new Date(parseInt(seconds, 10) * 1000);

  return [
    date.getUTCHours().toString(),
    date.getUTCMinutes().toString().padStart(2, "0"),
    date.getUTCSeconds().toString().padStart(2, "0"),
  ].join(":");
};

export default formatTime;
