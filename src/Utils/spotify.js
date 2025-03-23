export default async function getnp() {
    const res = await fetch('https://spotify-np-api.vercel.app/api', {mode: 'cors'});
    const data = await res.json();
    return data['np'];
}
