
import * as os from 'os';
import * as path from 'path';
import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import { Octokit } from "@octokit/core";
import { Error, isError } from './error';

// versionPrefix is used in Github release names, and can
// optionally be specified in the action's version parameter.
const versionPrefix = "v";

export async function getFlytectl(version: string): Promise<string | Error> {
  const binaryPath = tc.find('flytectl', version, os.arch());
  if (binaryPath !== '') {
    core.info(`Found in cache @ ${binaryPath}`);
    return binaryPath;
  }

  core.info(`Resolving the download URL for the current platform...`);
  const downloadURL = await getDownloadURL(version);
  if (isError(downloadURL)) {
    return downloadURL
  }

  core.info(`Downloading flytectl version "${version}" from ${downloadURL}`);
  const downloadPath = await tc.downloadTool(downloadURL);
  core.info(`Successfully downloaded flytectl version "${version}" from ${downloadURL}`);

  core.info('Extracting flytectl...');
  const extractPath = await tc.extractTar(downloadPath);
  core.info(`Successfully extracted flytectl to ${extractPath}`);

  core.info('Adding flytectl to the cache...');
  const cacheDir = await tc.cacheDir(
    path.join(extractPath),
    'flytectl',
    version,
    os.arch()
  );
  core.info(`Successfully cached flytectl to ${cacheDir}`);

  return cacheDir;
}

// getDownloadURL resolves flytectl's Github download URL for the
// current architecture and platform.
async function getDownloadURL(version: string): Promise<string | Error> {
  let architecture = '';
  switch (os.arch()) {
    case 'x64':
      architecture = 'x86_64';
      break;
    default:
      return {
        message: `The "${os.arch()}" architecture is not supported with a flytectl release.`
      };
  }
  let platform = '';
  switch (os.platform()) {
    case 'linux':
      platform = 'Linux';
      break;
    default:
      return {
        message: `The "${os.platform()}" platform is not supported with a flytectl release.`
      };
  }

  const assetName = `flytectl_${platform}_${architecture}.tar.gz`
  const octokit = new Octokit();
  const { data: releases } = await octokit.request(
    'GET /repos/{owner}/{repo}/releases',
    {
      owner: 'flyteorg',
      repo: 'flyte',
    }
  );
  // Filter out releases for which the tags do not have the prefix `flytectl/`
  const filteredReleases = releases.filter((release) => release.tag_name.startsWith('flytectl/'));
  console.log(`assetName: ${assetName}`)
  console.log(`version: ${version}`)
  switch (version) {
    case 'latest':
      for (const asset of filteredReleases[0].assets) {
        console.log(`Asset name: ${asset.name}`);
        if (assetName === asset.name) {
          return asset.browser_download_url;
        }
      }
      break;
    default:
      for (const release of filteredReleases) {
        if (releaseTagIsVersion(release.tag_name, version)) {
          for (const asset of release.assets) {
            if (assetName === asset.name) {
              return asset.browser_download_url;
            }
          }
        }
      }
  }
  return {
    message: `Unable to find flytectl version "${version}" for platform "${platform}" and architecture "${architecture}".`
  };
}

function releaseTagIsVersion(releaseTag: string, version: string): boolean {
  // Print releasetag and version
  console.log(`Release tag: ${releaseTag}`);
  console.log(`Version: ${version}`);

  // Remove the prefix `flytectl/` from releaseTag if it exists
  if (releaseTag.indexOf('flytectl/') !== 0) {
    releaseTag = releaseTag.slice('flytectl/'.length)
  }

  if (releaseTag.indexOf(versionPrefix) === 0) {
    releaseTag = releaseTag.slice(versionPrefix.length)
  }
  if (version.indexOf(versionPrefix) === 0) {
    version = version.slice(versionPrefix.length)
  }
  return releaseTag === version
}

