const startBtn = document.getElementById('start-btn');
const status = document.getElementById('status');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const synth = window.speechSynthesis;

function speak(text) {
  if (synth.speaking) {
    console.error('speechSynthesis.speaking');
    return;
  }
  const utterThis = new SpeechSynthesisUtterance(text);

  const voices = synth.getVoices();

  const femaleVoice = voices.find(voice =>
    voice.name.toLowerCase().includes('female') ||
    voice.name.toLowerCase().includes('zira') ||
    voice.name.toLowerCase().includes('susan') ||
    voice.name.toLowerCase().includes('victoria') ||
    voice.name.toLowerCase().includes('kate')
  );

  if (femaleVoice) {
    utterThis.voice = femaleVoice;
  } else if (voices.length > 0) {
    utterThis.voice = voices[0];
  }

  utterThis.pitch = 1;
  utterThis.rate = 1;
  synth.speak(utterThis);
}

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getCurrentDate() {
  const now = new Date();
  return now.toLocaleDateString();
}

function processCommand(command) {
  command = command.toLowerCase();
  status.textContent = 'You said: ' + command;

  // Websites opening commands
  if (command.includes('open youtube')) {
    speak('Opening YouTube');
    window.open('https://www.youtube.com', '_blank');

  } else if (command.includes('search youtube for')) {
    const query = command.split('search youtube for')[1].trim();
    if (query.length > 0) {
      speak('Searching YouTube for ' + query);
      const url = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(query);
      window.open(url, '_blank');
    } else {
      speak('Please specify what to search for on YouTube');
    }

  } else if (command.includes('open google')) {
    speak('Opening Google');
    window.open('https://www.google.com', '_blank');

  } else if (command.includes('search google for')) {
    const query = command.split('search google for')[1].trim();
    if (query.length > 0) {
      speak('Searching Google for ' + query);
      const url = 'https://www.google.com/search?q=' + encodeURIComponent(query);
      window.open(url, '_blank');
    } else {
      speak('Please specify what to search for on Google');
    }

  } else if (command.includes('open facebook')) {
    speak('Opening Facebook');
    window.open('https://www.facebook.com', '_blank');

  } else if (command.includes('open twitter')) {
    speak('Opening Twitter');
    window.open('https://www.twitter.com', '_blank');

  } else if (command.includes('open instagram')) {
    speak('Opening Instagram');
    window.open('https://www.instagram.com', '_blank');

  } else if (command.includes('open gmail') || command.includes('open google mail')) {
    speak('Opening Gmail');
    window.open('https://mail.google.com', '_blank');

  } else if (command.includes('open wikipedia')) {
    speak('Opening Wikipedia');
    window.open('https://www.wikipedia.org', '_blank');

  } else if (command.includes('search wikipedia for')) {
    const query = command.split('search wikipedia for')[1].trim();
    if (query.length > 0) {
      speak('Searching Wikipedia for ' + query);
      const url = 'https://en.wikipedia.org/wiki/' + encodeURIComponent(query.replace(/\s+/g, '_'));
      window.open(url, '_blank');
    } else {
      speak('Please specify what to search for on Wikipedia');
    }

  // Time and Date
  } else if (command.includes('what time is it') || command.includes('current time') || command.includes('tell me the time')) {
    const time = getCurrentTime();
    speak('The current time is ' + time);

  } else if (command.includes('what is today\'s date') || command.includes('what day is it') || command.includes('current date')) {
    const date = getCurrentDate();
    speak('Today\'s date is ' + date);

  // Greetings
  } else if (command.includes('hello') || command.includes('hi') || command.includes('hey')) {
    speak('Hello! How can I help you today?');

  } else if (command.includes('how are you')) {
    speak('I am doing great, thank you! How about you?');

  } else if (command.includes('goodbye') || command.includes('bye') || command.includes('see you')) {
    speak('Goodbye! Have a nice day.');

  // Jokes
  } else if (command.includes('tell me a joke') || command.includes('joke')) {
    const jokes = [
      'Why don’t scientists trust atoms? Because they make up everything.',
      'Why did the scarecrow win an award? Because he was outstanding in his field.',
      'I told my wife she was drawing her eyebrows too high. She looked surprised.',
      'Why don’t programmers like nature? It has too many bugs.',
      'Why did the bicycle fall over? Because it was two-tired!'
    ];
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    speak(joke);

  // Weather placeholder (no API)
  } else if (command.includes('what\'s the weather') || command.includes('weather like today')) {
    speak('Sorry, I cannot access live weather data, but I hope it’s nice outside!');

  // Fallback
  } else {
    speak('Sorry, I did not understand that command.');
  }
}

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  processCommand(transcript);
};

recognition.onspeechend = () => {
  recognition.stop();
  startBtn.disabled = false;
  startBtn.classList.remove('listening');
  status.textContent += ' (Listening stopped)';
};

recognition.onerror = (event) => {
  status.textContent = 'Error occurred in recognition: ' + event.error;
  startBtn.disabled = false;
  startBtn.classList.remove('listening');
};

startBtn.onclick = () => {
  recognition.start();
  status.textContent = 'Listening... Please speak now';
  startBtn.disabled = true;
  startBtn.classList.add('listening');
};
