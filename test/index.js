import Mocha from 'mocha';
import Glob from 'glob';

const pattern = 'test/specs/**/*.js';

const mocha = new Mocha({
    reporter: 'spec',
});

Glob(
    pattern,
    {},
    (err, files) => {
        files.forEach((file) => mocha.addFile(file));
        mocha.run((failures) => {
            process.on('exit', () => {
                process.exit(failures);
            });
        });
    }
);
