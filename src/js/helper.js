import { TIMEOUT_SEC } from './config.js';

export const FORKIFY_API_KEY = '9206d41d-f7e3-470a-9bcd-63077d5f4a09';
export const SPOONACULAR_API_KEY = '545ec99404be4cea8c4c19405cf3c156';
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(` ${data.message} (${res.status})`);
    }
    return data;
  } catch (error) {
    throw error;
  }
};
