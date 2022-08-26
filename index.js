const key = import.meta.env.VITE_RAPID_API_KEY;

export function fetchWord() {
  const url =
    'https://random-words5.p.rapidapi.com/getMultipleRandom?count=1&wordLength=5';

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': key,
      'X-RapidAPI-Host': 'random-words5.p.rapidapi.com',
    },
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((json) => json[0])
    .catch((err) => err);
}

export function checkWord(entry) {
  const urlCheckWord = `https://mashape-community-urban-dictionary.p.rapidapi.com/define?term=${entry}`;

  const optionsCheckWord = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': key,
      'X-RapidAPI-Host': 'mashape-community-urban-dictionary.p.rapidapi.com',
    },
  };

  return fetch(urlCheckWord, optionsCheckWord)
    .then((res) => res.json())
    .then((json) => json)
    .catch((err) => err);
}
