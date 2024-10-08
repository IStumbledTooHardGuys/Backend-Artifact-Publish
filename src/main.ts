import * as core from '@actions/core'
import axios from 'axios';
import { readFileSync } from 'fs';

export async function run(): Promise<void> {
  try {
    const key: string = core.getInput('secret_key')
    const host: string = core.getInput('host')
    const branch: string = core.getInput('branch')
    const commit: string = core.getInput('commit')
    const dllPath: string = core.getInput('dll_path')
    const xdevenv: string = core.getInput('x_dev_env') ?? "KeyLmao";

    core.info("Uploading artifact to " + host);

    const res = await axios.post(`${host}/${branch}/${commit}`, readFileSync(dllPath).toString(), {
      headers: {
        "X-ISTHG-CiCd-Auth-Token": key,
        "X-Dev-Env": xdevenv,
        "Content-Type": "application/octet-stream"
      }
    });

    core.info(`${res.status} ${res.statusText}: ${JSON.stringify(res.data)}`);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
