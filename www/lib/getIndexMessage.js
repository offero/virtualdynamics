import fetch from 'isomorphic-unfetch';

export default async function getIndexMessage(baseUrl) {
  const url = `${baseUrl}/api/index-message`;
  console.log('fetching', url);
  const res = await fetch(url);
  if (res.status !== 200) {
    console.error('Error fetching index-message', res.status);
    return '(Message unavailable)';
  }
  return res.text();
}
