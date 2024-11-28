import './Chat.css';

export default function Chat() {
  return (
    <div className="chat-container">
      <div className="chat-wrapper">
        <iframe
          id="audio_iframe"
          src="https://widget.synthflow.ai/widget/v2/1732785939835x108377617932045250/1732785939728x451771329958449800"
          allow="microphone"
          onLoad={() => {
            // Set up message handling for the iframe
            const iframe = document.getElementById('audio_iframe') as HTMLIFrameElement;
            
            // Listen for messages from the iframe
            window.addEventListener('message', (event) => {
              if (event.source !== iframe.contentWindow) return;
              
              // Forward the message to the Transcripts component
              window.postMessage(event.data, '*');
            });
          }}
        />
      </div>
    </div>
  );
}