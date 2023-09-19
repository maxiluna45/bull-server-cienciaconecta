import Arena from "bull-arena";
import Bull from "bull";


export const arenaConfig = (queues) => Arena({
    Bull,
    queues,
  },
  {
    basePath: '/arena',
    disableListen: true,
  });
