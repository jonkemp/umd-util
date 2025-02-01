import { readFile as fsReadFile, readFileSync, writeFileSync } from 'fs';
import { join, basename, dirname, extname } from 'path';
import { makeDirectory, makeDirectorySync } from 'make-dir';
import { promisify } from 'util';
import _ from 'underscore';
import writeFileAtomic from 'write-file-atomic';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const readFile = promisify(fsReadFile);

const capitalizeFilename = filepath => {
    const name = basename(filepath, extname(filepath));
    return name.charAt(0).toUpperCase() + name.substring(1);
};

const defaultOptions = {
    dependencies() {
        return [];
    },
    destination: 'umd',
    exports(filepath) {
        return capitalizeFilename(filepath);
    },
    namespace(filepath) {
        return capitalizeFilename(filepath);
    },
    template: join(__dirname, 'templates', 'returnExports.js')
};

const buildFileTemplateData = (filepath, options) => {
    const amd = [];
    const cjs = [];
    const global = [];
    const param = [];
    const requires = [];
    const dependencies = options.dependencies();

    const commaPrefix = items => items.map(value => `, ${value}`).join('');

    dependencies.forEach(d => {
        let dep = d;
        if (typeof d === 'string') {
            dep = {
                amd: d,
                cjs: d,
                global: d,
                param: d
            };
        }
        amd.push(`'${dep.amd || d.name}'`);
        cjs.push(`require('${dep.cjs || d.name}')`);
        global.push(`root.${dep.global || d.name}`);
        param.push(dep.param || d.name);
        requires.push(`${dep.param || d.name}=require('${dep.cjs || d.name}')`);
    });

    return {
        dependencies,
        exports: options.exports(filepath),
        namespace: options.namespace(filepath),
        amd: `[${amd.join(', ')}]`,
        cjs: cjs.join(', '),
        commaCjs: commaPrefix(cjs),
        global: global.join(', '),
        commaGlobal: commaPrefix(global),
        param: param.join(', '),
        commaParam: commaPrefix(param)
    };
};

const umdify = async (src, opts) => {
    const options = { ...defaultOptions, ...opts };
    let text = '';

    if (options.templateName) {
        text = options.templateName;
        if (text === 'amdNodeWeb') {
            text = 'returnExports';
        }
        text = join(__dirname, 'templates', `${text}.js`);
        text = await readFile(text, 'utf8');
    } else if (options.templateSource) {
        text = options.templateSource;
    } else {
        text = await readFile(options.template, 'utf8');
    }

    const compiled = _.template(text);
    const data = buildFileTemplateData(src, options);
    const fileContent = await readFile(src, 'utf8');
    const umdFile = join(options.destination, src);

    data.contents = fileContent;
    const output = compiled(data);

    await makeDirectory(dirname(umdFile));
    await writeFileAtomic(umdFile, output);
};

const umdifySync = (src, opts) => {
    const options = { ...defaultOptions, ...opts };
    let text = '';

    if (options.templateName) {
        text = options.templateName;
        if (text === 'amdNodeWeb') {
            text = 'returnExports';
        }
        text = join(__dirname, 'templates', `${text}.js`);
        text = readFileSync(text, 'utf8');
    } else if (options.templateSource) {
        text = options.templateSource;
    } else {
        text = readFileSync(options.template, 'utf8');
    }

    const compiled = _.template(text);
    const data = buildFileTemplateData(src, options);
    const fileContent = readFileSync(src, 'utf8');
    const umdFile = join(options.destination, src);

    data.contents = fileContent;
    const output = compiled(data);

    makeDirectorySync(dirname(umdFile));
    writeFileSync(umdFile, output);
};

umdify.sync = umdifySync;

export default umdify;
