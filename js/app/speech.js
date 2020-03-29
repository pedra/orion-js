var SPEECH = {
	msg: [
		'Olá!',
		'O que você deseja fazer?',
		'As opções são: ver o saldo, transferência ou pagamento de conta.',
		'Você tem R$ 1.245,56 de saldo na carteira.'
	],
	voz: null,
	rec: null,
	cb: () => null,

	init: () => {
		SPEECH.rec = new webkitSpeechRecognition()
		SPEECH.rec.continuous = false
		SPEECH.rec.lang = 'pt-BR'
		SPEECH.rec.interimResults = false
		SPEECH.rec.maxAlternatives = 1
		SPEECH.rec.onresult = SPEECH.result

		SPEECH.voz = new SpeechSynthesisUtterance()
		SPEECH.voz.voice = speechSynthesis.getVoices()[16]
	},

	// ----- Speech --------
	falar: msg => {
		SPEECH.voz.text = SPEECH.msg[msg]
		speechSynthesis.speak(SPEECH.voz)
	},

	// ----- Recognition ------
	escutar: cb => {
		SPEECH.cb = cb
		SPEECH.rec.start()
	},

	result: e => SPEECH.cb(e.results[0][0].transcript, e),

	repetir: () =>
		SPEECH.escutar(t => {
			console.log('[ENTENDI:] ' + t)
			SPEECH.voz.text = t
			speechSynthesis.speak(SPEECH.voz)
		})
}

// OLD SCRIPT ---- deletar

// var recognition = new webkitSpeechRecognition();
// //var speechRecognitionList = new webkitSpeechGrammarList();
// //speechRecognitionList.addFromString(grammar, 1);
// //recognition.grammars = speechRecognitionList;
// recognition.continuous = false;
// recognition.lang = 'pt-BR';
// recognition.interimResults = false;
// recognition.maxAlternatives = 1;

// //var diagnostic = document.querySelector('.output');
// var bg = document.querySelector('html');

// speechSynthesis.speak(new SpeechSynthesisUtterance("Olá, Filipe Dutra?! O que você quer fazer?"))

// document.body.onclick = function() {
//   recognition.start();
//   console.log('Ready to receive a color command.');
// }

// recognition.onresult = function(event) {
//   var frase = event.results[0][0].transcript;
//   console.log('Result received: ' + frase)

// if(frase.trim() == "sim"){
// speechSynthesis.speak(new SpeechSynthesisUtterance("Qual valor?"))
// } else {
//     speechSynthesis.speak(new SpeechSynthesisUtterance(frase + ".... Confirma?"))
// }

// }

// recognition.onaudiostart = e => console.log("audiostart", e)
// recognition.onspeechstart = e => console.log("speechstart", e)
// recognition.onstart = e => console.log("start", e)
