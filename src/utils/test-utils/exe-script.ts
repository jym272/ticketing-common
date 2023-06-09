import childProcess from 'child_process';
import { promisify } from 'util';
import { activateLogging, log } from '@utils/logs';
import { Streams, Subjects } from '@events/nats';

const exec = promisify(childProcess.exec);
export const runPsqlCommand = async (psqlCommand: string, logging = activateLogging()) => {
  try {
    // escape single quote for bash script
    const psqlCommandProc = psqlCommand.replace(/'/g, `'\\''`);
    const { stdout, stderr } = await exec('./scripts/run_psql ' + `'${psqlCommandProc}'`);
    if (stderr && logging) log(stderr);
    if (stdout && logging) log(stdout);
    return stdout;
  } catch (error) {
    log(`Error executing script: ${error as string}`);
    throw error;
  }
};

export const runPsqlCommandWithTimeout = async (
  cmd: string,
  timeout = 10000,
  waiting = 250,
  logging = activateLogging()
) => {
  let res = '';
  const startTime = Date.now();
  while (res === '') {
    res = await runPsqlCommand(cmd, logging);
    res = res.trim();
    if (res.trim()) {
      return res;
    } else if (Date.now() - startTime >= timeout) {
      throw new Error('Timeout exceeded');
    }
    log(`cmd: ${cmd} Waiting for ${waiting}ms before trying again. Time left: ${timeout - (Date.now() - startTime)}ms`);
    await new Promise(resolve => setTimeout(resolve, waiting));
  }
};

export const runNatsCommand = async (natsCmd: string, logging = activateLogging()) => {
  try {
    // escape single quote for bash script
    const cmd = natsCmd.replace(/'/g, `'\\''`);
    const { stdout, stderr } = await exec('./scripts/run_nats ' + `'${cmd}'`);
    if (stderr && logging) log(stderr);
    if (stdout && logging) log(stdout);
    return stdout;
  } catch (error) {
    log(`Error executing script: ${error as string}`);
    throw error;
  }
};

interface Response<T> {
  subject: Subjects;
  seq: number;
  data: T;
  time: string;
}

export const getSequenceDataFromNats = async <T>(stream: Streams, seq: number) => {
  const res = await runNatsCommand(`nats str get ${stream} ${seq} -j`);
  const resJson = JSON.parse(res) as Response<string>;
  const decodedData = Buffer.from(resJson.data, 'base64').toString('utf8');
  const dataJson = JSON.parse(decodedData) as T;
  const returnObj: Response<T> = {
    ...resJson,
    data: dataJson
  };
  return returnObj;
};

export const publishToSubject = async <T>(subject: Subjects, data: T) => {
  const dataStr = JSON.stringify(data);
  await runNatsCommand(`nats pub ${subject} ${dataStr}`);
};

export const truncateTables = async (...table: [string, ...string[]]) => {
  const processedTables = table.map(t => `"${t}"`);
  await runPsqlCommand(`truncate table ${processedTables.join(', ')} cascade;`);
};

export const insertIntoTableWithReturnJson = async <T>(
  table: string,
  props: Partial<T>, //Record<string, string | number | Record<string, unknown>>,
  logging = activateLogging()
) => {
  const keys = Object.keys(props).map(k => `"${k}"`);
  const values = Object.values(props).map(v => {
    if (typeof v === 'string') {
      return `'${v}'`;
    } else if (v instanceof Date) {
      return `'${v.toISOString()}'`;
    } else if (typeof v === 'object' && v !== null) {
      return `'${JSON.stringify(v)}'::jsonb`;
    } else {
      return v;
    }
  });
  const psqlCommand = `insert into "${table}" (${keys.join(', ')}) values (${values.join(
    ', '
  )}) returning row_to_json("${table}".*);`;
  const stdout = await runPsqlCommand(psqlCommand, logging);
  if (!stdout) throw new Error('No stdout returned');
  if (logging) {
    log('Raw stdout: ', JSON.stringify(stdout));
  }
  return JSON.parse(stdout) as T;
};
