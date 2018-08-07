const { existsSync, readFileSync, writeFile } = require("fs");

exports.create = filePath => {
  let next;
  // let complete;
  let stream;

  function getSaveStream() {
    if (stream) return next;

    // TODO: why is this causing error when required at module?
    const { Observable } = require("rxjs");
    const { throttleTime } = require("rxjs/operators");

    stream = Observable.create(subscriber => {
      next = x => subscriber.next(x);
      // complete = () => subscriber.complete();
    }).pipe(throttleTime(1000, undefined, { leading: true, trailing: true }));

    stream.subscribe(state => {
      // console.log('Saving...');
      writeFile(filePath, JSON.stringify(state), "utf8", err => {
        // eslint-disable-next-line no-console
        if (err) console.error(err);
        // console.log('Saved!');
      });
    });

    return next;
  }

  return {
    save(state) {
      const saveStream = getSaveStream();
      saveStream(state);
    },
    load() {
      if (!existsSync(filePath)) return {};
      return JSON.parse(readFileSync(filePath, "utf8"));
    }
  };
};
