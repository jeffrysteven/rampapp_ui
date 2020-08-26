const MARKETPLACEVSCODE_URL =
  'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery';

const getRequestOptions = (query) => {
  const headers = new Headers();
  headers.append('X-Market-User-Id', 'redacted-just-in-case');
  headers.append(
    'accept',
    'application/json;api-version=6.0-preview.1;excludeUrls=true',
  );
  headers.append('Origin', 'file://');
  headers.append(
    'User-Agent',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.40.2 Chrome/76.0.3809.146 Electron/6.1.5 Safari/537.36',
  );
  headers.append('X-Market-Client-Id', 'VSCode 1.40.2');
  headers.append('Sec-Fetch-Mode', 'cors');
  headers.append('Content-Type', 'application/json');
  headers.append(
    'Cookie',
    'VstsSession=%7B%22PersistentSessionId%22%3A%228d4d504e-34f4-4dcb-90ce-40eb492d9437%22%2C%22PendingAuthenticationSessionId%22%3A%2200000000-0000-0000-0000-000000000000%22%2C%22CurrentAuthenticationSessionId%22%3A%2200000000-0000-0000-0000-000000000000%22%2C%22SignInState%22%3A%7B%7D%7D; Gallery-Service-UserIdentifier=2bcc109c-cbf2-4505-ad57-c701aea90487',
  );
  const raw = JSON.stringify({
    filters: [
      {
        criteria: [
          { filterType: 8, value: 'Microsoft.VisualStudio.Code' },
          { filterType: 12, value: '4096' },
          { filterType: 10, value: query },
        ],
        pageNumber: 1,
        pageSize: 50,
        sortBy: 0,
        sortOrder: 0,
      },
    ],
    assetTypes: [],
    flags: 914,
  });

  return {
    method: 'POST',
    headers: headers,
    body: raw,
    redirect: 'follow',
  };
};

export const getVSCodeExtensions = async (query) => {
  try {
    const requestOptions = getRequestOptions(query);
    const response = await fetch(MARKETPLACEVSCODE_URL, requestOptions);
    const result = await response.json();

    return result;
  } catch (error) {
    console.error(error);
  }
};
