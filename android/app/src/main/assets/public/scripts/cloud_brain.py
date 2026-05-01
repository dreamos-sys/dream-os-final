import os
import sys
from ollama import Client

def connect_to_120b():
    api_key = os.environ.get('OLLAMA_API_KEY')
    if not api_key:
        print("Error: OLLAMA_API_KEY belum di-set Sultan!")
        return

    client = Client(
        host="https://ollama.com",
        headers={'Authorization': f'Bearer {api_key}'}
    )

    messages = [
      {
        'role': 'user',
        'content': ' '.join(sys.argv[1:]) if len(sys.argv) > 1 else 'Sultan di sini. Berikan salam pembuka untuk Dream OS v2.1.1!',
      },
    ]

    try:
        for part in client.chat('gpt-oss:120b', messages=messages, stream=True):
            print(part['message']['content'], end='', flush=True)
        print("\n\nBi idznillah.")
    except Exception as e:
        print(f"\nError Koneksi Cloud: {e}")

if __name__ == "__main__":
    connect_to_120b()
